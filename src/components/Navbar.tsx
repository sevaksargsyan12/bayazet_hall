import NavbarClient from "@/components/NavbarClient";
import { getSiteSettings } from "@/lib/queries/site-settings";

export default async function Navbar() {
  const siteSettings = await getSiteSettings();

  return (
    <NavbarClient
      instagramUrl={siteSettings.socialInstagramUrl}
      facebookUrl={siteSettings.socialFacebookUrl}
      whatsappPhone={siteSettings.contactPhone}
    />
  );
}
