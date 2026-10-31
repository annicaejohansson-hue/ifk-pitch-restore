import { Helmet } from "react-helmet";
import Hero from "@/components/Hero";
import Partner from "@/components/Partner";
import Services from "@/components/Services";
import Testimonial from "@/components/Testimonial";
import { SITE_ORIGIN } from "@/lib/booking";

const DEFAULT_TITLE = "Caselo Idrottsmedicin – Fysioterapi i Danderyd";
const DEFAULT_DESCRIPTION =
  "Idrottsfysioterapi i Danderyd: skadebehandling, hälkoppsinlägg och prestationsutveckling.";

type IndexProps = {
  title?: string;
  description?: string;
  canonicalPath?: string;
};

const Index = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  canonicalPath = "/",
}: IndexProps) => {
  const pageUrl = `${SITE_ORIGIN}${canonicalPath}`;

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://www.caseloidrottsmedicin.se/apple-touch-icon.png"
        />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta
          name="twitter:image"
          content="https://www.caseloidrottsmedicin.se/apple-touch-icon.png"
        />
      </Helmet>
      <Hero />
      <Services />
      <Testimonial />
      <Partner />
    </div>
  );
};

export default Index;
