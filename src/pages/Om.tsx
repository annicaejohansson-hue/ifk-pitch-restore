import { useEffect } from "react";
import { Helmet } from "react-helmet";
import Therapists from "@/components/Therapists";
import Partner from "@/components/Partner";

const Om = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-[calc(100vh-7rem)]">
      <Helmet>
        <title>Om – Caselo Idrottsmedicin</title>
        <meta
          name="description"
          content="Lär känna Henrik Nilsson, legitimerad fysioterapeut med specialisering inom idrottsskador hos Caselo Idrottsmedicin."
        />
      </Helmet>

      <Therapists />
      <Partner />
    </main>
  );
};

export default Om;
