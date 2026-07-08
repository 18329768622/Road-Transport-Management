import React from 'react'
import clsx from 'clsx'
import { Search, Plus, RefreshCw, Download, Filter } from 'lucide-react'

interface FilterBarProps {
  onSearch?: (v: string) => void
  searchPlaceholder?: string
  filters?: Array<{
    label: string
    options: { value: string; label: string }[]
    value: string
    onChange: (v: string) => void
  }>
  actions?: React.ReactNode
  onRefresh?: () => void
  onExport?: () => void
}

export function FilterBar({ onSearch, searchPlaceholder = '请输入关键词搜索...', filters = [], actions, onRefresh, onExport }: FilterBarProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-2 w-60 hover:border-gov-300 transition-colors">
        <Search size={14} className="text-gray-400 shrink-0" />
        <input
          className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
          placeholder={searchPlaceholder}
          onChange={e => onSearch?.(e.target.value)}
        />
      </div>

      {/* Filters */}
      {filters.map((f, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <label className="text-xs text-gray-500 whitespace-nowrap">{f.label}:</label>
          <select
            value={f.value}
            onChange={e => f.onChange(e.target.value)}
            className="form-select text-sm py-1.5 w-32"
          >
            {f.options.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      ))}

      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {onRefresh && (
          <button onClick={onRefresh} className="btn-secondary btn-sm">
            <RefreshCw size={13} />
          </button>
        )}
        {onExport && (
          <button onClick={onExport} className="btn-secondary btn-sm flex items-center gap-1.5">
            <Download size={13} />
            <span>导出</span>
          </button>
        )}
        {actions}
      </div>
    </div>
  )
}

interface PaginationProps {
  total: number
  page: number
  pageSize: number
  onChange: (page: number) => void
}

export function Pagination({ total, page, pageSize, onChange }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize)
  if (totalPages <= 1) return null
  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1)

  return (
    <div className="flex items-center justify-between py-3 px-1">
      <span className="text-xs text-gray-500">共 {total} 条记录</span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-40"
        >上一页</button>
        {pages.map(p => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={clsx(
              'w-7 h-7 text-xs rounded border',
              page === p
                ? 'bg-gov-500 text-white border-gov-500'
                : 'border-gray-200 hover:bg-gray-50 text-gray-600'
            )}
          >{p}</button>
        ))}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
          className="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-40"
        >下一页</button>
      </div>
    </div>
  )
}
