# API Endpoints & Real-time Schema

## 1. Overview
This app utilizes a hybrid backend: Supabase for relational data (moods, albums, profiles) and OpenRouter for AI companion intelligence.

## 2. Supabase Real-time Channels
### Channel: relationship:{couple_id}
- Type: Postgres Changes
- Tables: mood_entries, nudge_events
- Function: Triggers AI companion responses and haptic nudges on the partner's device when a change is detected.

### Channel: doodles:{couple_id}
- Type: Broadcast
- Function: Streams real-time path coordinate data (JSON) between devices for the Doodle Notes feature.

## 3. REST API Endpoints

### OpenRouter (AI Companion)
- POST https://openrouter.ai/api/v1/chat/completions
- Headers: 
  - Authorization: Bearer {OPENROUTER_API_KEY}
  - HTTP-Referer: {YOUR_APP_URL}
  - X-Title: {YOUR_APP_NAME}
- Payload:
  {
    "model": "openai/gpt-oss-20b",
    "messages": [
      { "role": "system", "content": "You are a cute pixel-art companion..." },
      { "role": "user", "content": "Partner mood: {mood}. Give a short, cute response." }
    ]
  }

### Supabase Storage (Photo Albums)
- POST /storage/v1/object/albums/{couple_id}/{filename}
- Purpose: Uploading pixel-art PNGs from the gallery.

### Location Tracking
- PATCH /rest/v1/profiles?id=eq.{user_id}
- Payload: { "last_lat": number, "last_long": number }
- Security: Protected by Row-Level Security (RLS) policies.

## 4. Database Schema Requirements
- profiles: id (UUID), couple_id (UUID), last_lat, last_long
- mood_entries: id (UUID), user_id (UUID), mood_type (text), timestamp (timestamptz)
- doodles: id (UUID), couple_id (UUID), path_data (jsonb)

## 5. Security Policies (RLS)
- Every table must have a couple_id column.
- Policy: "Allow access only if auth.uid() belongs to the same couple_id."