-- =============================================================
-- EVU Platform — Initial Schema
-- Migration: 001_initial_schema.sql
-- =============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================
-- ENUM TYPES
-- =============================================================
CREATE TYPE user_role      AS ENUM ('operator', 'owner', 'technician', 'admin');
CREATE TYPE station_status AS ENUM ('Available', 'In Use', 'Warning', 'Offline');
CREATE TYPE charger_type   AS ENUM ('L2', 'DCFC');
CREATE TYPE charger_status AS ENUM ('Available', 'Charging', 'Warning', 'Offline');
CREATE TYPE session_status AS ENUM ('active', 'completed', 'failed');

-- =============================================================
-- PROFILES  (extends auth.users 1-to-1)
-- =============================================================
CREATE TABLE public.profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  role        user_role   NOT NULL DEFAULT 'owner',
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-create profile row on new auth user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================
-- STATIONS
-- =============================================================
CREATE TABLE public.stations (
  id                  UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                TEXT         NOT NULL,
  address             TEXT         NOT NULL,
  lat                 DOUBLE PRECISION NOT NULL,
  lng                 DOUBLE PRECISION NOT NULL,
  total_chargers      INT          NOT NULL DEFAULT 0,
  available_chargers  INT          NOT NULL DEFAULT 0,
  status              station_status NOT NULL DEFAULT 'Available',
  power_kw            NUMERIC(8,2) NOT NULL DEFAULT 150,
  price_per_kwh       NUMERIC(6,4) NOT NULL DEFAULT 0.35,
  created_at          TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- =============================================================
-- CHARGERS
-- =============================================================
CREATE TABLE public.chargers (
  id                  UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  station_id          UUID          NOT NULL REFERENCES public.stations(id) ON DELETE CASCADE,
  type                charger_type  NOT NULL DEFAULT 'DCFC',
  status              charger_status NOT NULL DEFAULT 'Available',
  last_maintenance_at TIMESTAMPTZ,
  created_at          TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- =============================================================
-- VEHICLES
-- =============================================================
CREATE TABLE public.vehicles (
  id                    UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  make                  TEXT        NOT NULL,
  model                 TEXT        NOT NULL,
  year                  INT         NOT NULL,
  battery_capacity_kwh  NUMERIC(6,2) NOT NULL,
  current_battery_pct   NUMERIC(5,2) NOT NULL DEFAULT 80,
  license_plate         TEXT        UNIQUE,
  vin                   TEXT        UNIQUE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- CHARGING SESSIONS
-- =============================================================
CREATE TABLE public.charging_sessions (
  id                UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id        UUID          NOT NULL REFERENCES public.vehicles(id),
  charger_id        UUID          NOT NULL REFERENCES public.chargers(id),
  station_id        UUID          NOT NULL REFERENCES public.stations(id),
  user_id           UUID          NOT NULL REFERENCES public.profiles(id),
  started_at        TIMESTAMPTZ   NOT NULL DEFAULT now(),
  ended_at          TIMESTAMPTZ,
  energy_kwh        NUMERIC(8,3)  DEFAULT 0,
  cost_usd          NUMERIC(8,2)  DEFAULT 0,
  battery_start_pct NUMERIC(5,2),
  battery_end_pct   NUMERIC(5,2),
  status            session_status NOT NULL DEFAULT 'active'
);

-- =============================================================
-- TELEMETRY  (real-time vehicle state, 1 row per tick)
-- =============================================================
CREATE TABLE public.telemetry (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id  UUID        NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  session_id  UUID        REFERENCES public.charging_sessions(id),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  battery_pct NUMERIC(5,2) NOT NULL,
  lat         DOUBLE PRECISION,
  lng         DOUBLE PRECISION,
  speed_kmh   NUMERIC(6,2) DEFAULT 0,
  soc_kwh     NUMERIC(8,3)
);

-- =============================================================
-- INDEXES
-- =============================================================
CREATE INDEX idx_telemetry_vehicle_time  ON public.telemetry(vehicle_id, recorded_at DESC);
CREATE INDEX idx_sessions_user           ON public.charging_sessions(user_id, started_at DESC);
CREATE INDEX idx_sessions_station        ON public.charging_sessions(station_id, started_at DESC);
CREATE INDEX idx_sessions_status         ON public.charging_sessions(status) WHERE status = 'active';
CREATE INDEX idx_chargers_station        ON public.chargers(station_id);
CREATE INDEX idx_vehicles_user           ON public.vehicles(user_id);
