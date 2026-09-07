import HudBar from "@/components/HudBar";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import SkillsMarquee from "@/components/SkillsMarquee";
import About from "@/components/About";
import Stats from "@/components/Stats";
import Toolkit from "@/components/Toolkit";
import Services from "@/components/Services";
import Work from "@/components/Work";
import Lab from "@/components/Lab";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getSkills, getStats, getServices, getAboutDetails } from "@/lib/contentStore";

// The Work section (and now Skills/Stats/Services/About details) read live data
// from disk via the admin dashboard's JSON store — this must render dynamically
// so edits show up without a rebuild.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [skills, stats, services, aboutDetails] = await Promise.all([
    getSkills(),
    getStats(),
    getServices(),
    getAboutDetails(),
  ]);

  return (
    <main id="main">
      <HudBar />
      <Nav />
      <Hero />
      <SkillsMarquee skills={skills} />
      <About aboutDetails={aboutDetails} />
      <Stats stats={stats} />
      <Toolkit />
      <Services services={services} />
      <Work />
      <Lab />
      <Contact />
      <Footer />
    </main>
  );
}
