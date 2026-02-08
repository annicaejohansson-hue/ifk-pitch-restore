import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Booking from "@/components/Booking";
import AboutHenrikTeaser from "@/components/AboutHenrikTeaser";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Services />
      <Booking />
      <AboutHenrikTeaser />
    </div>
  );
};

export default Index;
