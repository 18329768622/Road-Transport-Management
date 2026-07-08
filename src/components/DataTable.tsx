import React from 'react'
import clsx from 'clsx'

interface Column<T> {
  key: keyof T | string
  title: string
  width?: number | string
  render?: (val: any, row: T) => React.ReactNode
  align?: 'left' | 'center' | 'right'
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  rowKey: keyof T
  onRowClick?: (row: T) => void
  loading?: boolean
  emptyText?: string
}

export default function DataTable<T extends Record<string, any>>({
  columns, data, rowKey, onRowClick, loading, emptyText = '暂无数据'
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full data-table">
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={String(col.key)}
                style={{ width: col.width }}
                className={clsx(col.align === 'center' && 'text-center', col.align === 'right' && 'text-right')}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={columns.length} className="py-12 text-center text-gray-400 text-sm">加载中...</td></tr>
          ) : data.length === 0 ? (
            <tr><td colSpan={columns.length} className="py-12 text-center text-gray-400 text-sm">{emptyText}</td></tr>
          ) : data.map((row, i) => (
            <tr
              key={String(row[rowKey]) + i}
              onClick={() => onRowClick?.(row)}
              className={clsx(onRowClick && 'cursor-pointer')}
            >
              {columns.map(col => {
                const val = col.key.toString().includes('.')
                  ? col.key.toString().split('.').reduce((o, k) => o?.[k], row)
                  : row[col.key as keyof T]
                return (
                  <td
                    key={String(col.key)}
                    className={clsx(col.align === 'center' && 'text-center', col.align === 'right' && 'text-right')}
                  >
                    {col.render ? col.render(val, row) : String(val ?? '—')}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
