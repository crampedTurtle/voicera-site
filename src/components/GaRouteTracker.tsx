import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Sends a GA4 page_view on every client-side route change.
 * The initial page view is handled by the gtag config in index.html.
 */
const GaRouteTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "page_view", {
        page_path: location.pathname + location.search + location.hash,
        page_title: document.title,
      });
    }
  }, [location]);

  return null;
};

export default GaRouteTracker;
