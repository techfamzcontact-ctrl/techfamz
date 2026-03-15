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
    <div className="flex flex-wrap items-center gap-2 justify-center">
      <button
        onClick={() => handleFilter(null)}
        className={`py-2 px-4 rounded-full text-sm font-medium border transition-all duration-300 cursor-pointer ${
          !activeCategory
            ? "bg-accent-blue text-white border-accent-blue shadow-[0_0_15px_var(--color-accent-blue-glow-soft)]"
            : "bg-transparent text-text-secondary border-border-glass hover:text-text-primary hover:border-border-glass-hover"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => handleFilter(cat)}
          className={`py-2 px-4 rounded-full text-sm font-medium border transition-all duration-300 cursor-pointer ${
            activeCategory === cat
              ? "bg-accent-blue text-white border-accent-blue shadow-[0_0_15px_var(--color-accent-blue-glow-soft)]"
              : "bg-transparent text-text-secondary border-border-glass hover:text-text-primary hover:border-border-glass-hover"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
