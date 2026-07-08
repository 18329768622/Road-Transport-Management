import React from 'react'
import { Construction } from 'lucide-react'
import { AIBadge } from '../components/StatusBadge'

interface PlaceholderPageProps {
  title: string
  chapter: string
  description: string
  features?: string[]
}

export default function PlaceholderPage({ title, chapter, description, features = [] }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-gov-800">{title}</h1>
            <p className="text-xs text-gray-500 mt-0.5">{chapter} · {description}</p>
          </div>
          <AIBadge label="AI赋能模块" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        <div className="card p-8 flex flex-col items-center justify-center min-h-64">
          <Construction size={40} className="text-gov-300 mb-4" />
          <div className="text-base font-semibold text-gray-700 mb-2">{title}</div>
          <div className="text-sm text-gray-500 mb-6 text-center max-w-sm">{description}</div>
          {features.length > 0 && (
            <div className="grid grid-cols-2 gap-2 max-w-md w-full">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 bg-gov-50 rounded-lg text-xs text-gov-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-gov-400 shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
