import type { LucideIcon } from "lucide-react";

export interface ServiceImage {
  src: string;
  alt: string;
}

export interface ServiceBadgeData {
  id: string;
  label: string;
  icon?: LucideIcon;
  image?: ServiceImage;
}
