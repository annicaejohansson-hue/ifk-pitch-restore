import Hero from "@/components/Hero";
import Partner from "@/components/Partner";
import Services from "@/components/Services";
import Testimonial from "@/components/Testimonial";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Services />
      <Testimonial />
      <Partner />
    </div>
  );
};

export default Index;
