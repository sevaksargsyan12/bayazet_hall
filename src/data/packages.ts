// data/packages.ts

export interface DishOption {
  id: string;
  name: string;
  imageUrl: string; // placeholder for now, real photos come later
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

export const packages: Package[] = [
  {
    id: "standard",
    name: "Ստանդարտ",
    pricePerPerson: 12000,
    description: "Իդեալական ընտրություն կանոնավոր միջոցառումների համար",
    items: [
      {
        id: "i1",
        type: "choice",
        label: "Ընտրեք աղցան",
        options: [
          { id: "s1", name: "Հայկական սալաթ", imageUrl: "/images/dishes/armenian-salad.png" },
          { id: "s2", name: "Օլիվյե", imageUrl: "/images/dishes/olivier.png" },
        ],
      },
      {
        id: "i2",
        type: "choice",
        label: "Ընտրեք հիմնական ուտեստ",
        options: [
          { id: "m1", name: "Խոզի խորոված", imageUrl: "/images/dishes/pork-khorovats.png" },
          { id: "m2", name: "Հավի խորոված", imageUrl: "/images/dishes/chicken-khorovats.png" },
        ],
      },
      {
        id: "i3",
        type: "fixed",
        options: [{ id: "f1", name: "Թարմ բանջարեղեն", imageUrl: "/images/dishes/vegetables.png" }],
      },
      {
        id: "i4",
        type: "fixed",
        options: [{ id: "f2", name: "Հաց և լավաշ", imageUrl: "/images/dishes/bread-lavash.png" }],
      },
      {
        id: "i5",
        type: "fixed",
        options: [{ id: "f3", name: "Ալկոհոլային խմիչքներ (գինի, օղի)", imageUrl: "/images/dishes/drinks.png" }],
      },
    ],
  },
  {
    id: "premium",
    name: "Պրեմիում",
    pricePerPerson: 18000,
    description: "Հարուստ ընտրանի հատուկ առիթների համար",
    highlighted: true,
    items: [
      {
        id: "i1",
        type: "choice",
        label: "Ընտրեք աղցան",
        options: [
          { id: "s1", name: "Հայկական սալաթ", imageUrl: "/images/dishes/armenian-salad.png" },
          { id: "s2", name: "Օլիվյե", imageUrl: "/images/dishes/olivier.png" },
          { id: "s3", name: "Կրաբի սալաթ", imageUrl: "/images/dishes/crab-salad.png" },
        ],
      },
      {
        id: "i2",
        type: "choice",
        label: "Ընտրեք հիմնական ուտեստ",
        options: [
          { id: "m1", name: "Խոզի խորոված", imageUrl: "/images/dishes/pork-khorovats.png" },
          { id: "m2", name: "Հավի խորոված", imageUrl: "/images/dishes/chicken-khorovats.png" },
          { id: "m3", name: "Ձկան ուտեստ", imageUrl: "/images/dishes/fish.png" },
        ],
      },
      {
        id: "i3",
        type: "fixed",
        options: [{ id: "f4", name: "Դոլմա", imageUrl: "/images/dishes/dolma.png" }],
      },
      {
        id: "i4",
        type: "fixed",
        options: [{ id: "f1", name: "Թարմ բանջարեղեն", imageUrl: "/images/dishes/vegetables.png" }],
      },
      {
        id: "i5",
        type: "fixed",
        options: [{ id: "f2", name: "Հաց և լավաշ", imageUrl: "/images/dishes/bread-lavash.png" }],
      },
      {
        id: "i6",
        type: "fixed",
        options: [{ id: "f5", name: "Ալկոհոլային խմիչքներ (գինի, օղի, կոնյակ)", imageUrl: "/images/dishes/drinks-premium.png" }],
      },
      {
        id: "i7",
        type: "fixed",
        options: [{ id: "f6", name: "Աղանդեր", imageUrl: "/images/dishes/dessert.png" }],
      },
    ],
  },
  {
    id: "royal",
    name: "Արքայական",
    pricePerPerson: 25000,
    description: "Լիարժեք շքեղ փաթեթ՝ ձեր հատուկ օրվա համար",
    items: [
      {
        id: "i1",
        type: "choice",
        label: "Ընտրեք աղցան",
        options: [
          { id: "s1", name: "Հայկական սալաթ", imageUrl: "/images/dishes/armenian-salad.png" },
          { id: "s2", name: "Օլիվյե", imageUrl: "/images/dishes/olivier.png" },
          { id: "s3", name: "Կրաբի սալաթ", imageUrl: "/images/dishes/crab-salad.png" },
        ],
      },
      {
        id: "i2",
        type: "choice",
        label: "Ընտրեք հիմնական ուտեստ",
        options: [
          { id: "m1", name: "Խոզի խորոված", imageUrl: "/images/dishes/pork-khorovats.png" },
          { id: "m2", name: "Հավի խորոված", imageUrl: "/images/dishes/chicken-khorovats.png" },
          { id: "m3", name: "Ձկան ուտեստ", imageUrl: "/images/dishes/fish.png" },
        ],
      },
      {
        id: "i3",
        type: "fixed",
        options: [{ id: "f4", name: "Դոլմա", imageUrl: "/images/dishes/dolma.png" }],
      },
      {
        id: "i4",
        type: "fixed",
        options: [{ id: "f7", name: "Խավիար", imageUrl: "/images/dishes/caviar.png" }],
      },
      {
        id: "i5",
        type: "fixed",
        options: [{ id: "f1", name: "Թարմ բանջարեղեն", imageUrl: "/images/dishes/vegetables.png" }],
      },
      {
        id: "i6",
        type: "fixed",
        options: [{ id: "f2", name: "Հաց և լավաշ", imageUrl: "/images/dishes/bread-lavash.png" }],
      },
      {
        id: "i7",
        type: "fixed",
        options: [{ id: "f8", name: "Ալկոհոլային խմիչքներ (պրեմիում տեսականի)", imageUrl: "/images/dishes/drinks-royal.png" }],
      },
      {
        id: "i8",
        type: "fixed",
        options: [{ id: "f6", name: "Աղանդեր", imageUrl: "/images/dishes/dessert.png" }],
      },
      {
        id: "i9",
        type: "fixed",
        options: [{ id: "f9", name: "Սալյուտ", imageUrl: "/images/dishes/fireworks.png" }],
      },
      {
        id: "i10",
        type: "fixed",
        options: [{ id: "f10", name: "Ուղիղ երաժշտություն (DJ)", imageUrl: "/images/dishes/dj.png" }],
      },
    ],
  },
];
