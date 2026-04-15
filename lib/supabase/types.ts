/**
 * Placeholder Supabase TypeScript types.
 *
 * After linking your project, replace with the generated version:
 *   supabase gen types typescript --linked > lib/supabase/types.ts
 *
 * These types mirror supabase/migrations/001_initial_schema.sql exactly.
 * @supabase/postgrest-js v2+ requires each table to declare a Relationships
 * array or the generic parameter collapses to `never`.
 */

export type UserRole      = 'operator' | 'owner' | 'technician' | 'admin'
export type StationStatus = 'Available' | 'In Use' | 'Warning' | 'Offline'
export type ChargerType   = 'L2' | 'DCFC'
export type ChargerStatus = 'Available' | 'Charging' | 'Warning' | 'Offline'
export type SessionStatus = 'active' | 'completed' | 'failed'

export interface Database {
  public: {
    Tables: {

      // ── profiles ──────────────────────────────────────────────────────
      profiles: {
        Row: {
          id: string
          full_name: string | null
          role: UserRole
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          role?: UserRole
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          full_name?: string | null
          role?: UserRole
          avatar_url?: string | null
        }
        Relationships: []
      }

      // ── stations ──────────────────────────────────────────────────────
      stations: {
        Row: {
          id: string
          name: string
          address: string
          lat: number
          lng: number
          total_chargers: number
          available_chargers: number
          status: StationStatus
          power_kw: number
          price_per_kwh: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          lat: number
          lng: number
          total_chargers?: number
          available_chargers?: number
          status?: StationStatus
          power_kw?: number
          price_per_kwh?: number
          created_at?: string
        }
        Update: {
          name?: string
          address?: string
          lat?: number
          lng?: number
          total_chargers?: number
          available_chargers?: number
          status?: StationStatus
          power_kw?: number
          price_per_kwh?: number
        }
        Relationships: []
      }

      // ── chargers ──────────────────────────────────────────────────────
      chargers: {
        Row: {
          id: string
          station_id: string
          type: ChargerType
          status: ChargerStatus
          last_maintenance_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          station_id: string
          type?: ChargerType
          status?: ChargerStatus
          last_maintenance_at?: string | null
          created_at?: string
        }
        Update: {
          station_id?: string
          type?: ChargerType
          status?: ChargerStatus
          last_maintenance_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chargers_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["id"]
          }
        ]
      }

      // ── vehicles ──────────────────────────────────────────────────────
      vehicles: {
        Row: {
          id: string
          user_id: string
          make: string
          model: string
          year: number
          battery_capacity_kwh: number
          current_battery_pct: number
          license_plate: string | null
          vin: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          make: string
          model: string
          year: number
          battery_capacity_kwh: number
          current_battery_pct?: number
          license_plate?: string | null
          vin?: string | null
          created_at?: string
        }
        Update: {
          user_id?: string
          make?: string
          model?: string
          year?: number
          battery_capacity_kwh?: number
          current_battery_pct?: number
          license_plate?: string | null
          vin?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }

      // ── charging_sessions ─────────────────────────────────────────────
      charging_sessions: {
        Row: {
          id: string
          vehicle_id: string
          charger_id: string
          station_id: string
          user_id: string
          started_at: string
          ended_at: string | null
          energy_kwh: number
          cost_usd: number
          battery_start_pct: number | null
          battery_end_pct: number | null
          status: SessionStatus
        }
        Insert: {
          id?: string
          vehicle_id: string
          charger_id: string
          station_id: string
          user_id: string
          started_at?: string
          ended_at?: string | null
          energy_kwh?: number
          cost_usd?: number
          battery_start_pct?: number | null
          battery_end_pct?: number | null
          status?: SessionStatus
        }
        Update: {
          vehicle_id?: string
          charger_id?: string
          station_id?: string
          user_id?: string
          started_at?: string
          ended_at?: string | null
          energy_kwh?: number
          cost_usd?: number
          battery_start_pct?: number | null
          battery_end_pct?: number | null
          status?: SessionStatus
        }
        Relationships: [
          {
            foreignKeyName: "charging_sessions_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "charging_sessions_charger_id_fkey"
            columns: ["charger_id"]
            isOneToOne: false
            referencedRelation: "chargers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "charging_sessions_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "charging_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }

      // ── telemetry ─────────────────────────────────────────────────────
      telemetry: {
        Row: {
          id: string
          vehicle_id: string
          session_id: string | null
          recorded_at: string
          battery_pct: number
          lat: number | null
          lng: number | null
          speed_kmh: number
          soc_kwh: number | null
        }
        Insert: {
          id?: string
          vehicle_id: string
          session_id?: string | null
          recorded_at?: string
          battery_pct: number
          lat?: number | null
          lng?: number | null
          speed_kmh?: number
          soc_kwh?: number | null
        }
        Update: {
          vehicle_id?: string
          session_id?: string | null
          recorded_at?: string
          battery_pct?: number
          lat?: number | null
          lng?: number | null
          speed_kmh?: number
          soc_kwh?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "telemetry_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "telemetry_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "charging_sessions"
            referencedColumns: ["id"]
          }
        ]
      }
    }

    Views: Record<string, never>

    Functions: {
      current_user_role: {
        Args: Record<string, never>
        Returns: UserRole
      }
    }

    Enums: {
      user_role: UserRole
      station_status: StationStatus
      charger_type: ChargerType
      charger_status: ChargerStatus
      session_status: SessionStatus
    }
  }
}
