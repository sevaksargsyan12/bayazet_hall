import { packages } from "@/data/packages";
import PackageCard from "@/components/PackageCard";

export default function PackagesGrid() {
  return (
    <div className="no-scrollbar -mx-6 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pt-6 scroll-px-6 px-6 pb-2 sm:mx-0 sm:mt-12 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pt-0 sm:pb-0 lg:grid-cols-3">
      {packages.map((pkg) => (
        <div
          key={pkg.id}
          className="package-card-slot w-[90%] shrink-0 snap-start sm:w-auto sm:shrink"
        >
          <PackageCard pkg={pkg} />
        </div>
      ))}
    </div>
  );
}
