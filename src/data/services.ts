import type { LucideIcon } from "lucide-react";
import { UtensilsCrossed, Cake, Mic2, MessageSquare, Drum } from "lucide-react";

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

export const services: ServiceBadgeData[] = [
  { id: "menu", label: "Ճաշացանկ", icon: UtensilsCrossed },
  { id: "cakes", label: "Տորթեր", icon: Cake },
  {
    id: "designs",
    label: "Դիզայն",
    image: {
      src: "/images/services/design.jpg",
      alt: "Դիզայն՝ ոսկեգույն ծաղկեպսակ",
    },
  },
  {
    id: "weddings",
    label: "Հարսանիք",
    image: {
      src: "/images/services/wedding.jpg",
      alt: "Հարսանիք՝ հարսնացու և փեսա",
    },
  },
  { id: "showmen", label: "Հաղորդավարներ", icon: Mic2 },
  { id: "feedback", label: "Կարծիքներ", icon: MessageSquare },
  { id: "band", label: "Խումբ", icon: Drum },
];
