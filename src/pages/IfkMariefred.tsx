import { useEffect } from "react";
import { useVisitor } from "@/context/VisitorContext";
import Index from "@/pages/Index";

const SEO_TITLE = "IFK Mariefred – Caselo Idrottsmedicin";
const SEO_DESCRIPTION =
  "Som medlem i IFK Mariefred har du rabatterade priser hos Caselo Idrottsmedicin. Boka idrottsfysioterapi i Mariefred.";

const IfkMariefred = () => {
  const { setVisitorType } = useVisitor();

  useEffect(() => {
    setVisitorType("ifk-mariefred");
  }, [setVisitorType]);

  return (
    <Index
      title={SEO_TITLE}
      description={SEO_DESCRIPTION}
      canonicalPath="/ifk-mariefred"
    />
  );
};

export default IfkMariefred;
