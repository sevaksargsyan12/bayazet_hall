// Renders a JSON-LD <script> tag from a plain object. `<` is escaped to
// `<` so a value containing e.g. a literal "</script>" (or any other
// tag) can never prematurely close the script element or inject markup —
// JSON.stringify alone doesn't protect against that.
export default function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
