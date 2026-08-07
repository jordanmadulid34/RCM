-- ==========================================================
-- ROTARY CLUB OF MAKATI - EMAIL LOGS & RLS POLICIES SCHEMA
-- Execute this SQL script in the Supabase SQL Editor
-- ==========================================================

-- 1. Create email_logs table for audit and history tracking
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  record_id TEXT,
  record_table TEXT,
  status TEXT NOT NULL, -- 'success' or 'failed'
  error_message TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  -- optional compatibility columns
  recipient_email TEXT,
  recipient_name TEXT,
  related_record_id TEXT,
  related_table_name TEXT,
  admin_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup by record ID and email
CREATE INDEX IF NOT EXISTS idx_email_logs_record ON public.email_logs(record_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON public.email_logs(recipient);

-- 2. Enable Row Level Security (RLS) on email_logs
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for public/admin access
CREATE POLICY "Allow read email_logs"
  ON public.email_logs FOR SELECT
  USING (true);

CREATE POLICY "Allow insert email_logs"
  ON public.email_logs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow delete email_logs"
  ON public.email_logs FOR DELETE
  USING (true);

-- 3. Ensure Core Application Tables & Policies

-- members
CREATE TABLE IF NOT EXISTS public.members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  full_name TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  company TEXT,
  classification TEXT,
  role TEXT DEFAULT 'Member', -- 'President', 'Vice President', 'Secretary', 'Treasurer', 'Board Director', 'Committee Chair', 'Member'
  role_title TEXT,
  status TEXT DEFAULT 'Active Member', -- 'Active Member', 'Pending Renewal', 'Honorary Member'
  rotary_id TEXT,
  joined_date TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public select members" ON public.members;
CREATE POLICY "Allow public select members"
  ON public.members FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated update members" ON public.members;
CREATE POLICY "Allow authenticated update members"
  ON public.members FOR UPDATE
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated insert members" ON public.members;
CREATE POLICY "Allow authenticated insert members"
  ON public.members FOR INSERT
  WITH CHECK (true);

-- events
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT DEFAULT 'General Meeting', -- 'General Meeting', 'Board Meeting', 'Committee Meeting', 'Social Event', 'Community Service', 'Fundraiser'
  event_date DATE NOT NULL,
  event_time TEXT,
  location TEXT,
  virtual_link TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow select events" ON public.events;
CREATE POLICY "Allow select events"
  ON public.events FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow insert events" ON public.events;
CREATE POLICY "Allow insert events"
  ON public.events FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update events" ON public.events;
CREATE POLICY "Allow update events"
  ON public.events FOR UPDATE
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow delete events" ON public.events;
CREATE POLICY "Allow delete events"
  ON public.events FOR DELETE
  USING (true);

-- event_rsvps
CREATE TABLE IF NOT EXISTS public.event_rsvps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  member_id TEXT NOT NULL, -- member id or email
  status TEXT NOT NULL DEFAULT 'going', -- 'going', 'not_going', 'maybe'
  responded_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, member_id)
);

ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow select event_rsvps" ON public.event_rsvps;
CREATE POLICY "Allow select event_rsvps"
  ON public.event_rsvps FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow insert event_rsvps" ON public.event_rsvps;
CREATE POLICY "Allow insert event_rsvps"
  ON public.event_rsvps FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update event_rsvps" ON public.event_rsvps;
CREATE POLICY "Allow update event_rsvps"
  ON public.event_rsvps FOR UPDATE
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow delete event_rsvps" ON public.event_rsvps;
CREATE POLICY "Allow delete event_rsvps"
  ON public.event_rsvps FOR DELETE
  USING (true);

-- 4. Ensure Delete Policies on Application Inbox Tables
-- (Run these to ensure authenticated admin users can execute DELETE statements)

-- membership_applications
ALTER TABLE public.membership_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert membership_applications" ON public.membership_applications;
CREATE POLICY "Allow public insert membership_applications"
  ON public.membership_applications FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow select membership_applications" ON public.membership_applications;
CREATE POLICY "Allow select membership_applications"
  ON public.membership_applications FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow update membership_applications" ON public.membership_applications;
CREATE POLICY "Allow update membership_applications"
  ON public.membership_applications FOR UPDATE
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow delete membership_applications" ON public.membership_applications;
CREATE POLICY "Allow delete membership_applications"
  ON public.membership_applications FOR DELETE
  USING (true);

-- visit_requests
ALTER TABLE public.visit_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert visit_requests" ON public.visit_requests;
CREATE POLICY "Allow public insert visit_requests"
  ON public.visit_requests FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow select visit_requests" ON public.visit_requests;
CREATE POLICY "Allow select visit_requests"
  ON public.visit_requests FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow update visit_requests" ON public.visit_requests;
CREATE POLICY "Allow update visit_requests"
  ON public.visit_requests FOR UPDATE
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow delete visit_requests" ON public.visit_requests;
CREATE POLICY "Allow delete visit_requests"
  ON public.visit_requests FOR DELETE
  USING (true);

-- contact_messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert contact_messages" ON public.contact_messages;
CREATE POLICY "Allow public insert contact_messages"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow select contact_messages" ON public.contact_messages;
CREATE POLICY "Allow select contact_messages"
  ON public.contact_messages FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow update contact_messages" ON public.contact_messages;
CREATE POLICY "Allow update contact_messages"
  ON public.contact_messages FOR UPDATE
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow delete contact_messages" ON public.contact_messages;
CREATE POLICY "Allow delete contact_messages"
  ON public.contact_messages FOR DELETE
  USING (true);
