export interface DishOption {
  id: string;
  name: string;
  imageUrl: string;
}

export interface PackageItem {
  id: string;
  type: "fixed" | "radio" | "checkbox";
  label?: string; // used for "radio"/"checkbox", e.g. "Ընտրեք աղցան"
  max?: number; // only set when type is "checkbox" — required pick count,
  // already capped to <= options.length by groupDishesByCategory
  options: DishOption[]; // 1 item if fixed, multiple otherwise
}

export interface Package {
  id: string;
  name: string;
  pricePerPerson: number; // AMD
  description: string;
  items: PackageItem[];
  highlighted?: boolean;
}
