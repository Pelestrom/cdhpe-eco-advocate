-- Add RLS policies to allow INSERT, UPDATE, DELETE on publications
CREATE POLICY "Admins can insert publications"
ON public.publications
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can update publications"
ON public.publications
FOR UPDATE
USING (true);

CREATE POLICY "Admins can delete publications"
ON public.publications
FOR DELETE
USING (true);

-- Add RLS policies to allow INSERT, UPDATE, DELETE on events
CREATE POLICY "Admins can insert events"
ON public.events
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can update events"
ON public.events
FOR UPDATE
USING (true);

CREATE POLICY "Admins can delete events"
ON public.events
FOR DELETE
USING (true);

-- Add RLS policies to allow SELECT, UPDATE, DELETE on contact_messages
CREATE POLICY "Admins can read contact messages"
ON public.contact_messages
FOR SELECT
USING (true);

CREATE POLICY "Admins can update contact messages"
ON public.contact_messages
FOR UPDATE
USING (true);

CREATE POLICY "Admins can delete contact messages"
ON public.contact_messages
FOR DELETE
USING (true);

-- Add RLS policies to allow SELECT, UPDATE, DELETE on event_registrations
CREATE POLICY "Admins can update registrations"
ON public.event_registrations
FOR UPDATE
USING (true);

CREATE POLICY "Admins can delete registrations"
ON public.event_registrations
FOR DELETE
USING (true);

-- Add RLS policies to allow INSERT, UPDATE, DELETE on media
CREATE POLICY "Admins can insert media"
ON public.media
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can update media"
ON public.media
FOR UPDATE
USING (true);

CREATE POLICY "Admins can delete media"
ON public.media
FOR DELETE
USING (true);