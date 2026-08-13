import { useEffect } from "react";
import { useVisitor } from "@/context/VisitorContext";
import IfkStocksundBanner from "@/components/IfkStocksundBanner";
import Index from "@/pages/Index";

const IfkStocksund = () => {
  const { setVisitorType } = useVisitor();

  useEffect(() => {
    setVisitorType("ifk-stocksund");
  }, [setVisitorType]);

  return (
    <>
      <IfkStocksundBanner />
      <Index />
    </>
  );
};

export default IfkStocksund;
