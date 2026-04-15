#!/usr/bin/env python3
"""
EVU Platform -- Synthetic Seed Script
======================================
Generates realistic training data for the EV charging platform:
  - 8 Milwaukee-area stations  (matching UI mock coordinates)
  - 64 chargers                (8 per station, mix of L2 + DCFC)
  - 10 user profiles           (across all 4 roles)
  - 20 vehicles                (real EV models with accurate capacities)
  - 100 charging sessions      (past 30 days, realistic battery arcs)
  - 500 telemetry rows         (5 per session, battery rises during charge)

Requirements:
    pip install supabase python-dotenv faker

Usage:
    python supabase/seed.py

Environment:
    Reads NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env.local
"""

import os
import uuid
import random
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
from faker import Faker
from supabase import create_client, Client

#  Config 
load_dotenv(".env.local")

SUPABASE_URL = os.environ["NEXT_PUBLIC_SUPABASE_URL"]
SERVICE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

fake = Faker()
sb: Client = create_client(SUPABASE_URL, SERVICE_KEY)

#  Static data 
STATIONS = [
    {"name": "Congress Center",  "address": "433 W State St, Milwaukee, WI",           "lat": 43.0412, "lng": -87.9137, "power_kw": 150, "price_per_kwh": 0.35},
    {"name": "Public Market",    "address": "400 N Water St, Milwaukee, WI",            "lat": 43.0425, "lng": -87.9063, "power_kw": 50,  "price_per_kwh": 0.30},
    {"name": "East Side Hub",    "address": "2300 N Farwell Ave, Milwaukee, WI",        "lat": 43.0583, "lng": -87.8873, "power_kw": 150, "price_per_kwh": 0.38},
    {"name": "Midwest Center",   "address": "111 W Wisconsin Ave, Milwaukee, WI",       "lat": 43.0389, "lng": -87.9065, "power_kw": 350, "price_per_kwh": 0.42},
    {"name": "Bay View Station", "address": "2772 S Kinnickinnic Ave, Milwaukee, WI",   "lat": 43.0017, "lng": -87.9047, "power_kw": 50,  "price_per_kwh": 0.28},
    {"name": "Wauwatosa Hub",    "address": "7700 W North Ave, Wauwatosa, WI",          "lat": 43.0601, "lng": -88.0081, "power_kw": 150, "price_per_kwh": 0.35},
    {"name": "Shorewood Depot",  "address": "4200 N Oakland Ave, Shorewood, WI",        "lat": 43.0876, "lng": -87.8865, "power_kw": 50,  "price_per_kwh": 0.32},
    {"name": "Airport Charge",   "address": "5300 S Howell Ave, Milwaukee, WI",         "lat": 42.9467, "lng": -87.8966, "power_kw": 350, "price_per_kwh": 0.45},
]

# (make, model, year, battery_capacity_kwh)
EV_MODELS = [
    ("Tesla",      "Model 3",       2022, 82.0),
    ("Tesla",      "Model Y",       2023, 75.0),
    ("Tesla",      "Model S",       2023, 100.0),
    ("Ford",       "Mustang Mach-E",2022, 91.0),
    ("Chevrolet",  "Bolt EV",       2023, 66.0),
    ("Rivian",     "R1T",           2023, 135.0),
    ("Hyundai",    "IONIQ 6",       2023, 77.4),
    ("BMW",        "iX",            2023, 105.2),
    ("Volkswagen", "ID.4",          2022, 82.0),
    ("Kia",        "EV6",           2023, 77.4),
    ("Lucid",      "Air",           2023, 118.0),
    ("Porsche",    "Taycan",        2023, 93.4),
]

ROLES = ["admin", "operator", "technician", "owner", "owner", "owner", "owner", "owner", "owner", "owner"]
TEST_PASSWORD = "EVU_test_2025!"


#  Helpers 
def utcnow() -> datetime:
    return datetime.now(timezone.utc)


def iso(dt: datetime) -> str:
    return dt.strftime("%Y-%m-%dT%H:%M:%SZ")


def rand_milw_coord() -> tuple[float, float]:
    """Random point within the Milwaukee metro bounding box."""
    return (
        random.uniform(42.94, 43.09),
        random.uniform(-88.01, -87.89),
    )


#  Seed functions 
def seed_stations() -> list[str]:
    print(" Seeding 8 stations...")
    ids = []
    for s in STATIONS:
        available = random.randint(2, 7)
        r = sb.table("stations").insert({
            **s,
            "id": str(uuid.uuid4()),
            "total_chargers": 8,
            "available_chargers": available,
            "status": "Available",
        }).execute()
        ids.append(r.data[0]["id"])
    print(f"   + {len(ids)} stations inserted")
    return ids


def seed_chargers(station_ids: list[str]) -> list[str]:
    print(" Seeding 64 chargers (8 per station)...")
    ids = []
    charger_types = ["L2", "L2", "DCFC", "DCFC", "DCFC", "DCFC", "L2", "DCFC"]
    for sid in station_ids:
        for t in charger_types:
            r = sb.table("chargers").insert({
                "id": str(uuid.uuid4()),
                "station_id": sid,
                "type": t,
                "status": "Available",
            }).execute()
            ids.append(r.data[0]["id"])
    print(f"   + {len(ids)} chargers inserted")
    return ids


def seed_profiles() -> list[str]:
    print(" Seeding 10 user profiles...")
    ids = []
    for role in ROLES:
        email = fake.unique.email()
        user_resp = sb.auth.admin.create_user({
            "email": email,
            "password": TEST_PASSWORD,
            "email_confirm": True,
            "user_metadata": {"full_name": fake.name()},
        })
        uid = user_resp.user.id
        sb.table("profiles").upsert({
            "id": uid,
            "full_name": user_resp.user.user_metadata.get("full_name"),
            "role": role,
        }).execute()
        ids.append(uid)
    print(f"   + {len(ids)} profiles created (password: {TEST_PASSWORD})")
    return ids


def seed_vehicles(profile_ids: list[str]) -> list[tuple[str, float]]:
    """Returns list of (vehicle_id, battery_capacity_kwh) tuples."""
    print(" Seeding 20 vehicles...")
    results = []
    for _ in range(20):
        make, model, year, cap = random.choice(EV_MODELS)
        r = sb.table("vehicles").insert({
            "id": str(uuid.uuid4()),
            "user_id": random.choice(profile_ids),
            "make": make,
            "model": model,
            "year": year,
            "battery_capacity_kwh": cap,
            "current_battery_pct": round(random.uniform(20, 95), 1),
            "license_plate": fake.license_plate(),
        }).execute()
        results.append((r.data[0]["id"], cap))
    print(f"   + {len(results)} vehicles inserted")
    return results


def seed_sessions(
    vehicle_tuples: list[tuple[str, float]],
    charger_ids: list[str],
    profile_ids: list[str],
) -> None:
    """Inserts 100 sessions + 5 telemetry rows each (500 total)."""
    print(" Seeding 100 charging sessions + 500 telemetry rows...")

    # Pre-fetch chargerstation mapping to avoid N+1 lookups
    charger_rows = sb.table("chargers").select("id, station_id").execute().data
    charger_to_station: dict[str, str] = {r["id"]: r["station_id"] for r in charger_rows}

    station_prices: dict[str, float] = {}
    for s in sb.table("stations").select("id, price_per_kwh").execute().data:
        station_prices[s["id"]] = float(s["price_per_kwh"])

    now = utcnow()
    session_count = 0
    telemetry_count = 0

    for _ in range(100):
        vid, cap = random.choice(vehicle_tuples)
        cid = random.choice(charger_ids)
        sid = charger_to_station[cid]
        price = station_prices.get(sid, 0.35)
        uid = random.choice(profile_ids)

        # Realistic session timing: somewhere in the past 30 days
        start = now - timedelta(
            days=random.randint(0, 29),
            hours=random.randint(0, 23),
            minutes=random.randint(0, 59),
        )
        duration_min = random.randint(20, 90)
        end = start + timedelta(minutes=duration_min)

        # Battery arc: starts low, ends higher (never exceeds 100%)
        battery_start = round(random.uniform(8, 40), 1)
        # Energy delivered (constrained by remaining capacity)
        max_energy = cap * (1 - battery_start / 100)
        energy = round(min(max_energy, random.uniform(10, 65)), 3)
        battery_end = min(100.0, round(battery_start + (energy / cap) * 100, 1))

        r = sb.table("charging_sessions").insert({
            "id": str(uuid.uuid4()),
            "vehicle_id": vid,
            "charger_id": cid,
            "station_id": sid,
            "user_id": uid,
            "started_at": iso(start),
            "ended_at": iso(end),
            "energy_kwh": energy,
            "cost_usd": round(energy * price, 2),
            "battery_start_pct": battery_start,
            "battery_end_pct": battery_end,
            "status": "completed",
        }).execute()
        sess_id = r.data[0]["id"]
        session_count += 1

        # 5 telemetry ticks evenly spaced across the session
        for tick in range(5):
            t_offset = (duration_min / 4) * tick  # 0%, 25%, 50%, 75%, 100% of session
            t_time = start + timedelta(minutes=t_offset)
            batt = round(battery_start + ((battery_end - battery_start) / 4) * tick, 1)
            lat, lng = rand_milw_coord()

            sb.table("telemetry").insert({
                "vehicle_id": vid,
                "session_id": sess_id,
                "recorded_at": iso(t_time),
                "battery_pct": batt,
                "lat": lat,
                "lng": lng,
                "speed_kmh": 0.0,
                "soc_kwh": round(batt / 100 * cap, 2),
            }).execute()
            telemetry_count += 1

    print(f"   + {session_count} sessions + {telemetry_count} telemetry rows inserted")


#  Main 
def main() -> None:
    print("\n EVU Platform Seed Script")
    print("=" * 40)

    station_ids = seed_stations()
    charger_ids = seed_chargers(station_ids)
    profile_ids = seed_profiles()
    vehicle_tuples = seed_vehicles(profile_ids)
    seed_sessions(vehicle_tuples, charger_ids, profile_ids)

    print("\n Seed complete!")
    print(f"   8 stations | 64 chargers | 10 users | 20 vehicles")
    print(f"   100 charging sessions | 500 telemetry rows")
    print(f"\n   All test users share password: {TEST_PASSWORD}")


if __name__ == "__main__":
    main()
