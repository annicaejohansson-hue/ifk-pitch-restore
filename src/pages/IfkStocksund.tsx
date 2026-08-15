import { useEffect } from "react";
import { useVisitor } from "@/context/VisitorContext";
import Index from "@/pages/Index";

const IfkStocksund = () => {
  const { setVisitorType } = useVisitor();

  useEffect(() => {
    setVisitorType("ifk-stocksund");
  }, [setVisitorType]);

  return <Index />;
};

export default IfkStocksund;
