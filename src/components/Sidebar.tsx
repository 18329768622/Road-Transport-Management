import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import {
  LayoutDashboard, Truck, AlertTriangle, Bus, Wrench, GraduationCap, Globe, Globe2,
  Users, FileText, ShieldAlert, BarChart3, Settings, ChevronDown, ChevronRight,
  Building2, BookOpen, Activity, FileSearch, Award, ClipboardList, Sparkles
} from 'lucide-react'

interface MenuItem {
  key: string
  label: string
  icon: React.ReactNode
  children?: { key: string; label: string }[]
}

const menuItems: MenuItem[] = [
  { key: 'dashboard', label: '数据驾驶舱', icon: <LayoutDashboard size={16} /> },
  {
    key: 'license', label: '许可管理', icon: <FileText size={16} />,
    children: [
      { key: 'freight', label: '道路货物运输管理' },
      { key: 'hazmat', label: '道路危险货物运输管理' },
      { key: 'passenger', label: '道路旅客运输管理' },
      { key: 'station', label: '道路货运站场管理' },
      { key: 'passenger-station', label: '道路客运站管理' },
      { key: 'repair', label: '机动车维修管理' },
      { key: 'training', label: '驾驶员培训管理' },
      { key: 'foreign', label: '外商投资运输管理' },
      { key: 'international', label: '国际道路运输管理' },
    ]
  },
  {
    key: 'personnel', label: '从业人员管理', icon: <Users size={16} />,
    children: [
      { key: 'personnel-list', label: '从业人员档案' },
      { key: 'license-issue', label: '从业资格证管理' },
      { key: 'integrity', label: '诚信考核管理' },
      { key: 'exam', label: '考试管理' },
    ]
  },
  {
    key: 'vehicle', label: '车辆技术管理', icon: <Truck size={16} />,
    children: [
      { key: 'vehicle-file', label: '车辆档案管理' },
      { key: 'vehicle-inspect', label: '车辆技术审查' },
      { key: 'vehicle-risk', label: '车辆风险预测' },
    ]
  },
  {
    key: 'certificate', label: '证件管理', icon: <Award size={16} />,
    children: [
      { key: 'cert-issue', label: '证件核发' },
      { key: 'cert-renew', label: '换发补发管理' },
      { key: 'cert-destroy', label: '证件销毁管理' },
    ]
  },
  {
    key: 'enforcement', label: '行政执法', icon: <ShieldAlert size={16} />,
    children: [
      { key: 'inspection', label: '监督检查' },
      { key: 'checkpoint', label: '检查站管理' },
      { key: 'case', label: '行政处罚案件' },
      { key: 'evidence', label: '执法证据管理' },
    ]
  },
  {
    key: 'statistics', label: '统计管理', icon: <BarChart3 size={16} />,
    children: [
      { key: 'stat-report', label: '统计报表' },
      { key: 'industry-analysis', label: '行业运行分析' },
    ]
  },
  {
    key: 'law', label: '法规知识库', icon: <BookOpen size={16} />,
    children: [
      { key: 'law-list', label: '法规文件管理' },
      { key: 'standard', label: '技术标准管理' },
    ]
  },
  {
    key: 'ai-service', label: 'AI服务在线', icon: <Sparkles size={16} />,
    children: [
      { key: 'ai-approval', label: 'AI智能审批助手' },
      { key: 'ai-risk-warn', label: 'AI风险预警中心' },
      { key: 'ai-qa', label: 'AI知识问答' },
      { key: 'ai-decision', label: 'AI辅助决策分析' },
      { key: 'ai-monitor', label: 'AI能力监控平台' },
    ]
  },
  {
    key: 'sysadmin', label: '系统管理', icon: <Settings size={16} />,
    children: [
      { key: 'org', label: '机构人员管理' },
      { key: 'it-assess', label: '信息化考核' },
      { key: 'data-gov', label: '数据治理' },
    ]
  },
]

interface SidebarProps {
  active: string
  onSelect: (key: string) => void
}

export default function Sidebar({ active, onSelect }: SidebarProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    // Pre-expand whichever group contains the initial active child
    const init: Record<string, boolean> = { license: true, enforcement: true }
    for (const item of menuItems) {
      if (item.children && item.children.some(c => c.key === active)) {
        init[item.key] = true
      }
    }
    return init
  })

  // Auto-expand the parent group when navigation targets one of its children
  useEffect(() => {
    for (const item of menuItems) {
      if (item.children && item.children.some(c => c.key === active)) {
        setExpanded(prev => ({ ...prev, [item.key]: true }))
        break
      }
    }
  }, [active])

  const toggle = (key: string) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const isParentActive = (item: MenuItem) => {
    if (item.children) return item.children.some(c => c.key === active)
    return item.key === active
  }

  return (
    <div className="w-56 bg-gov-800 flex flex-col h-full shrink-0">
      {/* Logo area */}
      <div className="px-4 py-4 border-b border-gov-700 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gov-400 rounded-lg flex items-center justify-center shrink-0">
            <Truck size={16} className="text-white" />
          </div>
          <div>
            <div className="text-white text-xs font-bold leading-tight">道路运输管理系统</div>
            <div className="text-gov-300 text-[10px] mt-0.5">AI赋能智慧政务平台</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {menuItems.map(item => (
          <div key={item.key}>
            {item.children ? (
              <>
                <button
                  onClick={() => toggle(item.key)}
                  className={clsx(
                    'sidebar-item w-full text-left',
                    isParentActive(item) ? 'text-white' : 'text-gov-200',
                    expanded[item.key] && 'text-white'
                  )}
                >
                  <span className={clsx('shrink-0', isParentActive(item) ? 'text-gov-300' : 'text-gov-400')}>
                    {item.icon}
                  </span>
                  <span className="flex-1 text-xs font-medium">{item.label}</span>
                  {expanded[item.key]
                    ? <ChevronDown size={12} className="text-gov-400 shrink-0" />
                    : <ChevronRight size={12} className="text-gov-400 shrink-0" />
                  }
                </button>
                {expanded[item.key] && (
                  <div className="mt-0.5 space-y-0.5 mb-1">
                    {item.children.map(child => (
                      <button
                        key={child.key}
                        onClick={() => onSelect(child.key)}
                        className={clsx('sidebar-sub-item w-full text-left', active === child.key && 'active')}
                      >
                        <span className="w-1 h-1 rounded-full bg-current shrink-0" />
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => onSelect(item.key)}
                className={clsx(
                  'sidebar-item w-full text-left',
                  active === item.key ? 'active text-white' : 'text-gov-200'
                )}
              >
                <span className="text-gov-400 shrink-0">{item.icon}</span>
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom user info */}
      <div className="px-4 py-3 border-t border-gov-700 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-gov-500 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
            管
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-xs font-medium truncate">系统管理员</div>
            <div className="text-gov-400 text-[10px] truncate">XX市交通运输局</div>
          </div>
        </div>
      </div>
    </div>
  )
}
