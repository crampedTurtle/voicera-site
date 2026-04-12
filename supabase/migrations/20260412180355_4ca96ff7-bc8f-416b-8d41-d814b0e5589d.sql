CREATE TABLE public.start_building_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  job_title text NOT NULL,
  business_email text NOT NULL,
  company_name text NOT NULL,
  company_website text,
  use_case text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.start_building_submissions ENABLE ROW LEVEL SECURITY;