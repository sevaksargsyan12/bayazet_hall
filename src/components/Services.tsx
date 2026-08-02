import { services } from "@/data/services";
import ServiceBadge from "@/components/ServiceBadge";
import ServicesVideoBackground from "@/components/ServicesVideoBackground";
import BackgroundVideo from "@/components/BackgroundVideo";

const videoSources = [
  { src: "/videos/venue-hall.mp4", poster: "/images/videos/venue-hall.jpg" },
  { src: "/videos/venue-detail.mp4", poster: "/images/videos/venue-detail.jpg" },
  { src: "/videos/venue-finale.mp4", poster: "/images/videos/venue-finale.jpg" },
];

export default function Services() {
  return (
    <section
      id="services"
      className="relative overflow-hidden py-24 sm:py-28 scroll-mt-24"
    >
      {/* 3 side-by-side columns are too thin on narrow phones — below the
          `sm` breakpoint, a single cycling video takes over instead. */}
      <ServicesVideoBackground
        sources={videoSources}
        className="absolute inset-0 -z-10 max-sm:hidden"
      />
      <BackgroundVideo
        sources={videoSources}
        className="absolute inset-0 -z-10 sm:hidden"
      />
      <div className="absolute inset-0 -z-10 bg-black/60" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-6xl px-6">
        <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">
          Ծառայություններ
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-white/80">
          Ամեն ինչ Ձեր միջոցառումը կատարյալ դարձնելու համար՝ մեկ վայրում։
        </p>

        <div className="service-badges mt-14 flex flex-wrap items-start justify-center gap-x-6 gap-y-10 sm:gap-x-8 lg:flex-nowrap lg:justify-between">
          {services.map((service) => (
            <ServiceBadge key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
