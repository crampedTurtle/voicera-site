import { createClient } from "https://esm.sh/@supabase/supabase-js@2.100.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { content } = await req.json();
    if (!content || typeof content !== 'string') {
      return new Response(JSON.stringify({ warnings: [] }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Extract all href URLs from content
    const hrefRegex = /href=["']([^"']+)["']/gi;
    const urls: string[] = [];
    let match;
    while ((match = hrefRegex.exec(content)) !== null) {
      const url = match[1];
      if (url.startsWith('http://') || url.startsWith('https://')) {
        urls.push(url);
      }
    }

    // Check each URL (with timeout)
    const warnings: { url: string; status: number; message: string }[] = [];
    const uniqueUrls = [...new Set(urls)].slice(0, 20); // limit to 20 URLs

    await Promise.allSettled(
      uniqueUrls.map(async (url) => {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 5000);
          const res = await fetch(url, {
            method: 'HEAD',
            signal: controller.signal,
            redirect: 'follow',
          });
          clearTimeout(timeout);
          if (res.status === 404 || res.status === 410) {
            warnings.push({ url, status: res.status, message: `Link returns ${res.status}` });
          }
        } catch {
          // Network errors are not flagged (could be temporary)
        }
      })
    );

    return new Response(JSON.stringify({ warnings }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
