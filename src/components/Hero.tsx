import { getSiteSettings } from "@/lib/queries/site-settings";
import { getSlides } from "@/lib/queries/slides";
import HeroClient from "@/components/HeroClient";

export default async function Hero() {
  const [siteSettings, slides] = await Promise.all([
    getSiteSettings(),
    getSlides(),
  ]);

  return (
    <HeroClient
      title={siteSettings.heroTitle}
      subtitle={siteSettings.heroSubtitle}
      slides={slides}
    />
  );
}
