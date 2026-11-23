import { useEffect } from "react";
import { useVisitor } from "@/context/VisitorContext";
import Index from "@/pages/Index";

const SEO_TITLE = "Enebybergs IF – Caselo Idrottsmedicin";
const SEO_DESCRIPTION =
  "Som medlem i Enebybergs IF har du rabatterade priser hos Caselo Idrottsmedicin. Boka idrottsfysioterapi i Danderyd.";

const EnebybergsIf = () => {
  const { setVisitorType } = useVisitor();

  useEffect(() => {
    setVisitorType("enebybergs-if");
  }, [setVisitorType]);

  return (
    <Index
      title={SEO_TITLE}
      description={SEO_DESCRIPTION}
      canonicalPath="/enebybergs-if"
    />
  );
};

export default EnebybergsIf;
