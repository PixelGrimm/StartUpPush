"use client"

import { cn } from '@/lib/utils'

interface FilterTabsProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
}

export function FilterTabs({ activeFilter, onFilterChange }: FilterTabsProps) {
  const filters = [
    { id: 'top', label: 'Top' },
    { id: 'new', label: 'New' },
    { id: 'recently-updated', label: 'Recently Updated' },
  ]

  return (
    <div className="flex justify-center mb-8">
      <div className="flex bg-muted rounded-lg p-1">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-colors",
              activeFilter === filter.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  )
}
