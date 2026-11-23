import { useEffect } from "react";
import { useVisitor } from "@/context/VisitorContext";
import Index from "@/pages/Index";

const SEO_TITLE = "FC Djursholm – Caselo Idrottsmedicin";
const SEO_DESCRIPTION =
  "Som spelare i FC Djursholm har du rabatterade priser hos Caselo Idrottsmedicin. Boka idrottsfysioterapi i Danderyd.";

const FcDjursholm = () => {
  const { setVisitorType } = useVisitor();

  useEffect(() => {
    setVisitorType("fc-djursholm");
  }, [setVisitorType]);

  return (
    <Index
      title={SEO_TITLE}
      description={SEO_DESCRIPTION}
      canonicalPath="/fc-djursholm"
    />
  );
};

export default FcDjursholm;
