import React, { useState } from 'react'
import clsx from 'clsx'
import { Sparkles, X, ChevronDown, ChevronUp, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react'

interface AIItem {
  label: string
  value: string | React.ReactNode
  type?: 'normal' | 'warning' | 'success' | 'info'
}

interface AIPanelProps {
  title?: string
  items?: AIItem[]
  onClose?: () => void
  className?: string
}

export default function AIPanel({ title = 'AI 智能分析', items = [], onClose, className }: AIPanelProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={clsx(
      'bg-gradient-to-b from-indigo-950 to-purple-950 rounded-lg border border-indigo-700 text-white overflow-hidden animate-slide-in',
      className
    )}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-indigo-800">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-indigo-300" />
          <span className="text-sm font-medium text-indigo-100">{title}</span>
          <span className="flex gap-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setCollapsed(!collapsed)} className="p-1 rounded hover:bg-indigo-800 text-indigo-300">
            {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
          {onClose && (
            <button onClick={onClose} className="p-1 rounded hover:bg-indigo-800 text-indigo-300">
              <X size={14} />
            </button>
          )}
        </div>
      </div>
      {!collapsed && (
        <div className="p-3 space-y-2.5">
          {items.map((item, i) => (
            <div key={i} className={clsx(
              'rounded-md p-2.5 text-xs',
              item.type === 'warning' && 'bg-amber-900/40 border border-amber-700/50',
              item.type === 'success' && 'bg-emerald-900/40 border border-emerald-700/50',
              item.type === 'info' && 'bg-blue-900/40 border border-blue-700/50',
              (!item.type || item.type === 'normal') && 'bg-indigo-900/40 border border-indigo-700/50',
            )}>
              <div className="flex items-start gap-1.5">
                {item.type === 'warning' && <AlertCircle size={12} className="text-amber-400 mt-0.5 shrink-0" />}
                {item.type === 'success' && <CheckCircle size={12} className="text-emerald-400 mt-0.5 shrink-0" />}
                {item.type === 'info' && <TrendingUp size={12} className="text-blue-400 mt-0.5 shrink-0" />}
                {(!item.type || item.type === 'normal') && <Sparkles size={12} className="text-indigo-400 mt-0.5 shrink-0" />}
                <div className="flex-1">
                  <div className={clsx('font-semibold mb-0.5',
                    item.type === 'warning' ? 'text-amber-300' :
                    item.type === 'success' ? 'text-emerald-300' :
                    item.type === 'info' ? 'text-blue-300' : 'text-indigo-300'
                  )}>{item.label}</div>
                  <div className="text-gray-300 leading-relaxed">{item.value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function AIScoreMeter({ score, label }: { score: number; label: string }) {
  const color = score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444'
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-12 h-12 shrink-0">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          <circle cx="18" cy="18" r="14" fill="none" stroke="#1e1b4b" strokeWidth="3" />
          <circle cx="18" cy="18" r="14" fill="none" stroke={color} strokeWidth="3"
            strokeDasharray={`${score * 0.88} 88`} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold" style={{ color }}>{score}</span>
        </div>
      </div>
      <div className="text-xs text-gray-300">{label}</div>
    </div>
  )
}
