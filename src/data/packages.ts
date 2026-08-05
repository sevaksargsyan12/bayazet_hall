export interface DishOption {
  id: string;
  name: string;
  imageUrl: string;
}

export interface PackageItem {
  id: string;
  type: "fixed" | "choice";
  label?: string; // only used when type is "choice", e.g. "Ընտրեք աղցան"
  options: DishOption[]; // 1 item if fixed, multiple if choice
}

export interface Package {
  id: string;
  name: string;
  pricePerPerson: number; // AMD
  description: string;
  items: PackageItem[];
  highlighted?: boolean;
}
