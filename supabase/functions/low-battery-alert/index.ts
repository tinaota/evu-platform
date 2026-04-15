/**
 * EVU Platform — Low Battery Alert Edge Function
 * ================================================
 * Triggered when a vehicle's battery drops below 20%.
 *
 * Logic:
 *  1. Skip if vehicle is already actively charging.
 *  2. Rate-limit: skip if an alert was already fired within the cooldown window.
 *  3. Find the nearest available stations.
 *  4. Log the alert (extend here to add Web Push / FCM / email).
 *
 * Deploy:
 *   supabase functions deploy low-battery-alert
 *
 * Test:
 *   curl -X POST https://<ref>.supabase.co/functions/v1/low-battery-alert \
 *     -H "Authorization: Bearer <anon-key>" \
 *     -H "Content-Type: application/json" \
 *     -d '{"vehicle_id":"<uuid>","battery_pct":12}'
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ALERT_THRESHOLD_PCT = 20
const COOLDOWN_MINUTES = 30

interface AlertRequest {
  vehicle_id: string
  battery_pct: number
}

interface NearbyStation {
  id: string
  name: string
  address: string
  available_chargers: number
}

serve(async (req: Request): Promise<Response> => {
  // CORS pre-flight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, content-type',
      },
    })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  let body: AlertRequest
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  const { vehicle_id, battery_pct } = body

  if (!vehicle_id || battery_pct === undefined) {
    return json({ error: 'vehicle_id and battery_pct are required' }, 400)
  }

  // ── 1. Battery above threshold — nothing to do ──────────────────────────
  if (battery_pct >= ALERT_THRESHOLD_PCT) {
    return json({ action: 'none', reason: 'battery_ok' })
  }

  // ── 2. Already charging — no alert needed ───────────────────────────────
  const { data: activeSession } = await supabase
    .from('charging_sessions')
    .select('id')
    .eq('vehicle_id', vehicle_id)
    .eq('status', 'active')
    .limit(1)
    .single()

  if (activeSession) {
    return json({ action: 'skip', reason: 'already_charging' })
  }

  // ── 3. Rate limiting — don't spam if battery stays low ──────────────────
  const cooldownCutoff = new Date(
    Date.now() - COOLDOWN_MINUTES * 60 * 1000
  ).toISOString()

  const { data: recentLowReadings } = await supabase
    .from('telemetry')
    .select('id')
    .eq('vehicle_id', vehicle_id)
    .lt('battery_pct', ALERT_THRESHOLD_PCT)
    .gte('recorded_at', cooldownCutoff)

  // If there are > 1 readings in the cooldown window, an alert was already sent
  if (recentLowReadings && recentLowReadings.length > 1) {
    return json({ action: 'skip', reason: 'cooldown_active' })
  }

  // ── 4. Fetch vehicle + owner details ────────────────────────────────────
  const { data: vehicle } = await supabase
    .from('vehicles')
    .select('make, model, year, profiles(full_name, avatar_url)')
    .eq('id', vehicle_id)
    .single()

  // ── 5. Find nearest available stations (simple approach: first 3) ───────
  const { data: nearbyStations } = await supabase
    .from('stations')
    .select('id, name, address, available_chargers')
    .eq('status', 'Available')
    .gt('available_chargers', 0)
    .order('name')
    .limit(3)

  const stations = (nearbyStations ?? []) as NearbyStation[]

  // ── 6. Dispatch alert ────────────────────────────────────────────────────
  const alertPayload = {
    vehicle_id,
    battery_pct,
    vehicle_label: vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'Unknown vehicle',
    nearest_stations: stations.map((s) => ({
      name: s.name,
      address: s.address,
      available_chargers: s.available_chargers,
    })),
    timestamp: new Date().toISOString(),
  }

  // Log to console (visible in Supabase Edge Function logs)
  console.log('[LOW BATTERY ALERT]', JSON.stringify(alertPayload, null, 2))

  // ── TODO: Extend with real push delivery ────────────────────────────────
  //
  // Web Push (VAPID):
  //   import webpush from 'npm:web-push'
  //   webpush.setVapidDetails(subject, publicKey, privateKey)
  //   await webpush.sendNotification(subscription, JSON.stringify(alertPayload))
  //
  // Firebase Cloud Messaging:
  //   await fetch('https://fcm.googleapis.com/v1/projects/<id>/messages:send', {
  //     method: 'POST',
  //     headers: { Authorization: `Bearer ${fcmToken}` },
  //     body: JSON.stringify({ message: { token, notification: { title, body } } })
  //   })
  //
  // Email via Resend:
  //   await fetch('https://api.resend.com/emails', {
  //     method: 'POST',
  //     headers: { Authorization: `Bearer ${Deno.env.get('RESEND_API_KEY')}` },
  //     body: JSON.stringify({ from, to, subject, html })
  //   })
  // ────────────────────────────────────────────────────────────────────────

  return json({ action: 'alert_sent', ...alertPayload })
})

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
