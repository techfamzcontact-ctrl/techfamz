"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface CategoryFilterProps {
  categories: string[];
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  const handleFilter = (category: string | null) => {
    if (category) {
      router.push(`/blog?category=${encodeURIComponent(category)}`, { scroll: false });
    } else {
      router.push("/blog", { scroll: false });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => handleFilter(null)}
        className={`py-1.5 px-3.5 rounded-full text-sm font-medium border transition-colors duration-150 cursor-pointer ${
          !activeCategory
            ? "bg-text-primary text-bg-primary border-text-primary"
            : "bg-transparent text-text-secondary border-border-glass hover:text-text-primary hover:border-border-glass-hover"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => handleFilter(cat)}
          className={`py-1.5 px-3.5 rounded-full text-sm font-medium border transition-colors duration-150 cursor-pointer ${
            activeCategory === cat
              ? "bg-text-primary text-bg-primary border-text-primary"
              : "bg-transparent text-text-secondary border-border-glass hover:text-text-primary hover:border-border-glass-hover"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
