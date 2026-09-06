import { Helmet } from "react-helmet";
import Hero from "@/components/Hero";
import Partner from "@/components/Partner";
import Services from "@/components/Services";
import Testimonial from "@/components/Testimonial";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Caselo Idrottsmedicin – Fysioterapi i Danderyd</title>
        <meta
          name="description"
          content="Idrottsfysioterapi i Danderyd: skadebehandling, hälkoppsinlägg och prestationsutveckling."
        />
        <link rel="canonical" href="https://www.caseloidrottsmedicin.se/" />
        <meta property="og:url" content="https://www.caseloidrottsmedicin.se/" />
        <meta
          property="og:title"
          content="Caselo Idrottsmedicin – Fysioterapi i Danderyd"
        />
        <meta
          property="og:description"
          content="Idrottsfysioterapi i Danderyd: skadebehandling, hälkoppsinlägg och prestationsutveckling."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://www.caseloidrottsmedicin.se/apple-touch-icon.png"
        />
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content="Caselo Idrottsmedicin – Fysioterapi i Danderyd"
        />
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
