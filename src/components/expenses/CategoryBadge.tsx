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
    colorClass: 'text-[#0075de]',
    bgClass: 'bg-[#e6f3fe]',
    borderClass: 'border-[#0075de]/20',
  },
  Food: {
    label: 'Dining',
    icon: Utensils,
    colorClass: 'text-[#000000]',
    bgClass: 'bg-[#ffb110]/20',
    borderClass: 'border-[#ffb110]/40',
  },
  Transportation: {
    label: 'Transit',
    icon: Car,
    colorClass: 'text-[#0075de]',
    bgClass: 'bg-[#62aef0]/15',
    borderClass: 'border-[#62aef0]/30',
  },
  Shopping: {
    label: 'Shopping',
    icon: ShoppingBag,
    colorClass: 'text-[#f64932]',
    bgClass: 'bg-[#f64932]/10',
    borderClass: 'border-[#f64932]/25',
  },
  Activities: {
    label: 'Activities',
    icon: Compass,
    colorClass: 'text-[#000000]',
    bgClass: 'bg-[#f6f5f4]',
    borderClass: 'border-[rgba(0,0,0,0.12)]',
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
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${config.bgClass} ${config.colorClass} ${config.borderClass} ${sizeClasses}`}
    >
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{config.label}</span>
    </span>
  );
};
