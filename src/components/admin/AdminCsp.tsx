import { Helmet } from "react-helmet-async";

/**
 * Restrictive Content-Security-Policy for the admin dashboard.
 * No third-party scripts, no inline event handlers, no external frames.
 */
const AdminCsp = () => (
  <Helmet>
    <meta
      httpEquiv="Content-Security-Policy"
      content={[
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https: blob:",
        "connect-src 'self' https://*.supabase.co",
        "frame-src 'none'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
      ].join("; ")}
    />
  </Helmet>
);

export default AdminCsp;
