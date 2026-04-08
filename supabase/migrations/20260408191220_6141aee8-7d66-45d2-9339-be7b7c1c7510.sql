CREATE TABLE public.partner_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  job_title text NOT NULL,
  business_email text NOT NULL,
  company_name text NOT NULL,
  company_website text,
  partner_interest text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.partner_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read partner submissions"
  ON public.partner_submissions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));