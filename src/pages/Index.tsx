import Hero from "@/components/Hero";
import Partner from "@/components/Partner";
import Services from "@/components/Services";
import Booking from "@/components/Booking";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Services />
      <Booking />
      <Partner />
    </div>
  );
};

export default Index;
