import React, { useState } from 'react'
import { Bell, Search, HelpCircle, ChevronRight, Sparkles } from 'lucide-react'

interface Breadcrumb { label: string; key?: string }

interface HeaderProps {
  breadcrumbs: Breadcrumb[]
  onBreadcrumbClick?: (key: string) => void
  onNavigate?: (key: string) => void
}

export default function Header({ breadcrumbs, onBreadcrumbClick, onNavigate }: HeaderProps) {
  const [notices] = useState(5)

  return (
    <div className="h-12 bg-gov-700 border-b border-gov-600 flex items-center px-5 gap-4 shrink-0">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 flex-1 min-w-0">
        {breadcrumbs.map((b, i) => (
          <React.Fragment key={i}>
            {i > 0 && <ChevronRight size={12} className="text-gov-400 shrink-0" />}
            <span
              onClick={() => b.key && onBreadcrumbClick?.(b.key)}
              className={`text-xs truncate ${
                i === breadcrumbs.length - 1
                  ? 'text-white font-medium'
                  : 'text-gov-300 hover:text-white cursor-pointer'
              }`}
            >
              {b.label}
            </span>
          </React.Fragment>
        ))}
      </nav>

      {/* AI Status */}
      <button
        onClick={() => onNavigate?.('ai-approval')}
        className="flex items-center gap-1.5 bg-gov-800/60 hover:bg-gov-600 rounded-full px-3 py-1 border border-gov-600 hover:border-indigo-400 transition-colors cursor-pointer"
      >
        <Sparkles size={11} className="text-indigo-300" />
        <span className="text-[11px] text-indigo-200 font-medium">AI服务在线</span>
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
      </button>

      {/* Date */}
      <div className="text-[11px] text-gov-300 shrink-0">
        {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' })}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-gov-800/60 rounded-md px-3 py-1.5 border border-gov-600 w-48">
        <Search size={13} className="text-gov-400" />
        <input
          className="bg-transparent text-xs text-gov-200 placeholder-gov-500 outline-none w-full"
          placeholder="搜索业务/证件/人员..."
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-md hover:bg-gov-600 text-gov-300 hover:text-white transition-colors">
          <Bell size={15} />
          {notices > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">
              {notices}
            </span>
          )}
        </button>
        <button className="p-2 rounded-md hover:bg-gov-600 text-gov-300 hover:text-white transition-colors">
          <HelpCircle size={15} />
        </button>
      </div>
    </div>
  )
}
