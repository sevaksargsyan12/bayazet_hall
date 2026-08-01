import ContactForm from "@/components/ContactForm";

export default function Contact() {
  return (
    <section id="contact" className="mx-auto w-full max-w-6xl px-6 py-20">
      <h2 className="text-center text-3xl font-bold sm:text-4xl">Կապ</h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-foreground/70">
        Կապվեք մեզ հետ ամրագրման կամ հարցերի համար։
      </p>

      <ContactForm />
    </section>
  );
}
