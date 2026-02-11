import Hero from "@/components/Hero";
import Partner from "@/components/Partner";
import Services from "@/components/Services";
import Booking from "@/components/Booking";
import Therapists from "@/components/Therapists";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Services />
      <Booking />
      <Therapists />
      <Partner />
    </div>
  );
};

export default Index;
