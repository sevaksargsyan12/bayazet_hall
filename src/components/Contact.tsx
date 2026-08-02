import { MapPin, Phone, Users } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export default function Contact() {
  return (
    <section
      id="contact"
      className="mx-auto w-full max-w-6xl px-6 py-20 scroll-mt-24"
    >
      <h2 className="text-center text-3xl font-bold sm:text-4xl">Կապ</h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-foreground/70">
        Կապվեք մեզ հետ ամրագրման կամ հարցերի համար։
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
              <span>Գավառ, Սայադյան 112/2</span>
            </li>
            <li className="flex items-start gap-3">
              <Phone
                className="mt-0.5 h-5 w-5 shrink-0 text-amber-500"
                aria-hidden="true"
              />
              <a href="tel:+374917774774" className="hover:underline">
                +374 91 774 774
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Users
                className="mt-0.5 h-5 w-5 shrink-0 text-amber-500"
                aria-hidden="true"
              />
              <span>Նախատեսված է մինչև 600 անձի համար</span>
            </li>
          </ul>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
