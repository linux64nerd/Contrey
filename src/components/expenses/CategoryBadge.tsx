import React from 'react';
import { ExpenseCategory } from '../../types/expense';
import { Hotel, Utensils, Car, ShoppingBag, Compass } from 'lucide-react';

interface CategoryBadgeProps {
  category: ExpenseCategory;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

export const CATEGORY_CONFIG: Record<
  ExpenseCategory,
  { label: string; icon: React.ComponentType<{ className?: string }>; colorClass: string; bgClass: string; borderClass: string }
> = {
  Hotels: {
    label: 'Hotels',
    icon: Hotel,
    colorClass: 'text-indigo-700',
    bgClass: 'bg-indigo-50',
    borderClass: 'border-indigo-200',
  },
  Food: {
    label: 'Food & Dining',
    icon: Utensils,
    colorClass: 'text-amber-700',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-200',
  },
  Transportation: {
    label: 'Transportation',
    icon: Car,
    colorClass: 'text-sky-700',
    bgClass: 'bg-sky-50',
    borderClass: 'border-sky-200',
  },
  Shopping: {
    label: 'Shopping',
    icon: ShoppingBag,
    colorClass: 'text-rose-700',
    bgClass: 'bg-rose-50',
    borderClass: 'border-rose-200',
  },
  Activities: {
    label: 'Activities & Tours',
    icon: Compass,
    colorClass: 'text-emerald-700',
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-200',
  },
};

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  showIcon = true,
  size = 'md',
}) => {
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG['Food'];
  const Icon = config.icon;

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border font-semibold ${config.bgClass} ${config.colorClass} ${config.borderClass} ${sizeClasses}`}
    >
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{config.label}</span>
    </span>
  );
};
