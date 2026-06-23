import { BearGallery }  from "@/components/landing/BearGallery";
import { Footer }       from "@/components/landing/Footer";
import { Hero }         from "@/components/landing/Hero";
import { HowItWorks }   from "@/components/landing/HowItWorks";
import { Navbar }       from "@/components/landing/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white">
      <Navbar />
      <Hero />
      <HowItWorks />
      <BearGallery />
      <Footer />
    </main>
  );
}
