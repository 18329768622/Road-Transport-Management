import React from 'react'
import clsx from 'clsx'

interface BadgeProps {
  label: string
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default' | 'purple'
  size?: 'sm' | 'md'
}

const variants = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  default: 'bg-gray-50 text-gray-600 border-gray-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
}

export default function StatusBadge({ label, variant = 'default', size = 'sm' }: BadgeProps) {
  return (
    <span className={clsx(
      'inline-flex items-center border rounded-full font-medium',
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
      variants[variant]
    )}>
      {label}
    </span>
  )
}

export function RiskBadge({ level }: { level: '低' | '中' | '高' | '极高' }) {
  const map = {
    低: { cls: 'bg-green-50 text-green-700 border-green-200', dot: 'bg-green-500' },
    中: { cls: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
    高: { cls: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
    极高: { cls: 'bg-red-100 text-red-800 border-red-300', dot: 'bg-red-600' },
  }
  const { cls, dot } = map[level]
  return (
    <span className={clsx('inline-flex items-center gap-1 border rounded-full px-2 py-0.5 text-xs font-medium', cls)}>
      <span className={clsx('w-1.5 h-1.5 rounded-full', dot)} />
      风险{level}
    </span>
  )
}

export function AIBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M12 2L13.09 8.26L19 6L15.45 11.09L22 12L15.45 12.91L19 18L13.09 15.74L12 22L10.91 15.74L5 18L8.55 12.91L2 12L8.55 11.09L5 6L10.91 8.26L12 2Z" />
      </svg>
      {label}
    </span>
  )
}
