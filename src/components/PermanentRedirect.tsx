import { Helmet } from "react-helmet";
import { Navigate } from "react-router-dom";
import { SITE_ORIGIN } from "@/lib/booking";

type PermanentRedirectProps = {
  to: string;
};

/**
 * Client-side stand-in for a 301. Host-level redirects in vercel.json
 * send the actual HTTP status; this keeps in-app and local navigation correct
 * and tells crawlers not to index the old URL.
 */
const PermanentRedirect = ({ to }: PermanentRedirectProps) => (
  <>
    <Helmet>
      <title>Sidan har flyttats</title>
      <meta name="robots" content="noindex, follow" />
      <link rel="canonical" href={`${SITE_ORIGIN}${to}`} />
    </Helmet>
    <Navigate to={to} replace />
  </>
);

export default PermanentRedirect;
