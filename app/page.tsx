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
import BrandsMarquee from "@/components/BrandsMarquee";
import Reviews from "@/components/Reviews";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getSkills, getStats, getServices, getAboutDetails } from "@/lib/contentStore";
import { getSiteSettings } from "@/lib/siteSettings";
import { getApprovedReviews } from "@/lib/reviewsStore";

// The Work section (and now Skills/Stats/Services/About details) read live data
// from disk via the admin dashboard's JSON store — this must render dynamically
// so edits show up without a rebuild.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [skills, stats, services, aboutDetails, settings, reviews] = await Promise.all([
    getSkills(),
    getStats(),
    getServices(),
    getAboutDetails(),
    getSiteSettings(),
    getApprovedReviews(),
  ]);

  return (
    <main id="main">
      <HudBar />
      <Nav />
      <Hero />
      <SkillsMarquee skills={skills} />
      <About aboutDetails={aboutDetails} avatarUrl={settings.avatarUrl} />
      <Stats stats={stats} />
      <Toolkit />
      <Services services={services} />
      <Work />
      <Lab />
      <BrandsMarquee />
      <Reviews initialReviews={reviews} />
      <Contact />
      <Footer />
    </main>
  );
}
