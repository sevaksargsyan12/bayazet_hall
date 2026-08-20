import { MapPin, Phone, Users } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import GoogleReviewsLink from "@/components/GoogleReviewsLink";
import { getSiteSettings } from "@/lib/queries/site-settings";

export default async function Contact() {
  const siteSettings = await getSiteSettings();

  return (
    <section
      id="contact"
      className="mx-auto w-full max-w-6xl px-6 py-20 scroll-mt-24"
    >
      <h2 className="text-center text-3xl font-bold sm:text-4xl">
        {siteSettings.contactHeading}
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-foreground/70">
        {siteSettings.contactSubtitle}
      </p>

      <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
          <h3 className="text-lg font-semibold">Կապի տվյալներ</h3>
          <ul className="mt-6 space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin
                className="mt-0.5 h-5 w-5 shrink-0 text-amber-500"
                aria-hidden="true"
              />
              <span>{siteSettings.contactAddress}</span>
            </li>
            <li className="flex items-start gap-3">
              <Phone
                className="mt-0.5 h-5 w-5 shrink-0 text-amber-500"
                aria-hidden="true"
              />
              <a href={`tel:${siteSettings.contactPhone}`} className="hover:underline">
                {siteSettings.contactDisplayPhone}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Users
                className="mt-0.5 h-5 w-5 shrink-0 text-amber-500"
                aria-hidden="true"
              />
              <span>{siteSettings.contactCapacityNote}</span>
            </li>
            <li className="flex items-start gap-3">
              <GoogleReviewsLink />
            </li>
          </ul>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
