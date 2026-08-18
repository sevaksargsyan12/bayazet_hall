"use client";

import { useState } from "react";
import { Columns } from "lucide-react";
import type { Package } from "@/data/packages";
import ComparePackagesModal from "@/components/ComparePackagesModal";

export default function ComparePackagesButton({ packages }: { packages: Package[] }) {
  const [open, setOpen] = useState(false);

  if (packages.length < 2) return null; // nothing to compare

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-amber-500/40 bg-surface px-4 py-2 text-sm font-medium text-amber-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-500 hover:bg-amber-50 hover:shadow-md hover:shadow-amber-300/40 dark:text-amber-400 dark:hover:bg-amber-500/10 dark:hover:shadow-amber-400/20"
      >
        <Columns className="h-4 w-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
        Համեմատել բոլոր փաթեթները
      </button>
      <ComparePackagesModal
        packages={packages}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
