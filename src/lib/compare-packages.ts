import type { Package } from "@/data/packages";

export interface CategoryPresence {
  packageId: string;
  included: boolean;
}

export interface DishDiff {
  dishId: string;
  name: string;
  presentIn: string[]; // packageIds — subset of the packages that include this category
}

export interface CategoryComparisonGroup {
  categoryId: string; // == PackageItem.id (WordPress category slug)
  label: string;
  presence: CategoryPresence[]; // one entry per package, in `packages` order
  dishDiffs: DishDiff[]; // only dishes NOT present in every package that has this category
}

export interface PackageComparison {
  packages: { id: string; name: string }[];
  groups: CategoryComparisonGroup[]; // only categories with an actual difference
}

/**
 * Builds a "differences only" comparison across every package's items.
 *
 * Categories are matched across packages by `PackageItem.id` (the shared
 * WordPress dish-category slug — see groupDishesByCategory in
 * lib/queries/packages.ts), and dishes within a shared category are
 * matched by `DishOption.id` (the underlying WP Dish post id), not by
 * name — correct as long as the same physical dish is reused as the same
 * WP post across packages rather than duplicated per package.
 *
 * A category that's 100% identical across every package that has it
 * (same presence, same exact dish set) is omitted entirely — the point is
 * to surface differences, not re-list everything.
 */
export function buildPackageComparison(packages: Package[]): PackageComparison {
  const categoryOrder: string[] = [];
  const categoryLabels = new Map<string, string>();
  // categoryId -> packageId -> PackageItem
  const byCategory = new Map<string, Map<string, Package["items"][number]>>();

  for (const pkg of packages) {
    for (const item of pkg.items) {
      if (item.type === "fixed" && item.options.length === 0) continue;
      if (!byCategory.has(item.id)) {
        byCategory.set(item.id, new Map());
        categoryOrder.push(item.id);
        categoryLabels.set(item.id, item.label ?? item.id);
      }
      byCategory.get(item.id)!.set(pkg.id, item);
    }
  }

  const groups: CategoryComparisonGroup[] = [];

  for (const categoryId of categoryOrder) {
    const perPackage = byCategory.get(categoryId)!;
    const presentPackageIds = packages
      .map((pkg) => pkg.id)
      .filter((id) => perPackage.has(id));
    const categoryPresenceDiffers = presentPackageIds.length !== packages.length;

    // Tally dishes only among packages that actually have this category.
    const dishTally = new Map<string, { name: string; presentIn: string[] }>();
    for (const packageId of presentPackageIds) {
      const item = perPackage.get(packageId)!;
      for (const option of item.options) {
        if (!dishTally.has(option.id)) {
          dishTally.set(option.id, { name: option.name, presentIn: [] });
        }
        dishTally.get(option.id)!.presentIn.push(packageId);
      }
    }

    const dishDiffs: DishDiff[] = Array.from(dishTally.entries())
      .filter(([, dish]) => dish.presentIn.length !== presentPackageIds.length)
      .map(([dishId, dish]) => ({
        dishId,
        name: dish.name,
        presentIn: dish.presentIn,
      }));

    if (!categoryPresenceDiffers && dishDiffs.length === 0) continue;

    groups.push({
      categoryId,
      label: categoryLabels.get(categoryId)!,
      presence: packages.map((pkg) => ({
        packageId: pkg.id,
        included: perPackage.has(pkg.id),
      })),
      dishDiffs,
    });
  }

  return {
    packages: packages.map((pkg) => ({ id: pkg.id, name: pkg.name })),
    groups,
  };
}
