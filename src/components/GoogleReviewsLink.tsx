import { Star } from "lucide-react";
import { GOOGLE_REVIEWS_URL } from "@/lib/constants";

// 5 static stars — purely decorative, not tied to any dynamic rating value.
export default function GoogleReviewsLink() {
  return (
    <a
      href={GOOGLE_REVIEWS_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Թողնել կարծիք Bayazet Hall-ի մասին Google-ում"
      className="inline-flex items-center gap-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
    >
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
        ))}
      </span>
      Թողնել կարծիք Google-ում
    </a>
  );
}
