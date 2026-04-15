-- =============================================================
-- EVU Platform — Row Level Security Policies
-- Migration: 002_rls_policies.sql
-- =============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stations          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chargers          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charging_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemetry         ENABLE ROW LEVEL SECURITY;

-- =============================================================
-- HELPER: returns the current user's role (cached per statement)
-- =============================================================
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- =============================================================
-- PROFILES
-- =============================================================
CREATE POLICY "profiles: own row"
  ON public.profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "profiles: admins see all"
  ON public.profiles FOR SELECT
  USING (public.current_user_role() = 'admin');

CREATE POLICY "profiles: own update"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "profiles: insert on signup"
  ON public.profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- =============================================================
-- STATIONS  (read-only for all authenticated; write for admin/operator)
-- =============================================================
CREATE POLICY "stations: authenticated read"
  ON public.stations FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "stations: admin/operator write"
  ON public.stations FOR ALL
  USING (public.current_user_role() IN ('admin', 'operator'));

-- =============================================================
-- CHARGERS
-- =============================================================
CREATE POLICY "chargers: authenticated read"
  ON public.chargers FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "chargers: admin/operator/technician write"
  ON public.chargers FOR ALL
  USING (public.current_user_role() IN ('admin', 'operator', 'technician'));

-- =============================================================
-- VEHICLES  (owners see own; admins/operators see all)
-- =============================================================
CREATE POLICY "vehicles: owner sees own"
  ON public.vehicles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "vehicles: admin/operator sees all"
  ON public.vehicles FOR SELECT
  USING (public.current_user_role() IN ('admin', 'operator'));

CREATE POLICY "vehicles: owner insert/update/delete"
  ON public.vehicles FOR ALL
  USING (user_id = auth.uid());

-- =============================================================
-- CHARGING SESSIONS
-- =============================================================
CREATE POLICY "sessions: users see own"
  ON public.charging_sessions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "sessions: admin/operator see all"
  ON public.charging_sessions FOR SELECT
  USING (public.current_user_role() IN ('admin', 'operator'));

CREATE POLICY "sessions: users manage own"
  ON public.charging_sessions FOR ALL
  USING (user_id = auth.uid());

-- =============================================================
-- TELEMETRY
-- =============================================================
CREATE POLICY "telemetry: vehicle owner sees own"
  ON public.telemetry FOR SELECT
  USING (
    vehicle_id IN (
      SELECT id FROM public.vehicles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "telemetry: admin/operator sees all"
  ON public.telemetry FOR SELECT
  USING (public.current_user_role() IN ('admin', 'operator'));

CREATE POLICY "telemetry: authenticated insert"
  ON public.telemetry FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
