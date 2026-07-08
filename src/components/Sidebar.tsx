import React, { useState, useEffect, useRef } from 'react'
import clsx from 'clsx'
import {
  LayoutDashboard, Truck, FileText, ShieldAlert, BarChart3, Settings,
  ChevronDown, ChevronRight, BookOpen, Award, Sparkles, Users, ChevronUp, X, LogIn
} from 'lucide-react'

// ─────────────────────────── Menu Definition ───────────────────────────

interface MenuItem {
  key: string
  label: string
  icon: React.ReactNode
  children?: { key: string; label: string }[]
}

const ALL_MENU_ITEMS: MenuItem[] = [
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

// ─────────────────────────── Role Definitions ───────────────────────────

export interface RoleDef {
  id: string
  name: string
  level: string
  category: string
  description: string
  avatarBg: string
  avatarText: string
  unit: string
  badgeColor: string
}

export const ROLES: RoleDef[] = [
  { id: 'R001', name: '系统管理员', level: '系统级', category: '管理层',
    description: '系统配置、用户管理、权限分配、日志审计',
    avatarBg: 'bg-red-500', avatarText: '管', unit: 'XX市交通运输局', badgeColor: 'bg-red-900/40 text-red-200' },
  { id: 'R002', name: '省级管理员', level: '省级', category: '行政管理',
    description: '省内许可审批、质量信誉考核、数据上报',
    avatarBg: 'bg-blue-500', avatarText: '省', unit: 'XX省交通运输厅', badgeColor: 'bg-blue-900/40 text-blue-200' },
  { id: 'R003', name: '市级管理员', level: '市级', category: '行政管理',
    description: '业户许可、车辆管理、行业监督检查',
    avatarBg: 'bg-indigo-500', avatarText: '市', unit: 'XX市交通运输局', badgeColor: 'bg-indigo-900/40 text-indigo-200' },
  { id: 'R004', name: '县级管理员', level: '县级', category: '行政管理',
    description: '受理、审查、发证、档案管理',
    avatarBg: 'bg-sky-600', avatarText: '县', unit: 'XX县交通运输局', badgeColor: 'bg-sky-900/40 text-sky-200' },
  { id: 'R006', name: '检查站执法人员', level: '执法级', category: '执法人员',
    description: '路面检查、违法处理、案件办理',
    avatarBg: 'bg-orange-500', avatarText: '执', unit: 'XX交通检查站', badgeColor: 'bg-orange-900/40 text-orange-200' },
  { id: 'R007', name: '道路运输业户', level: '企业级', category: '市场主体',
    description: '网上申报、年审、企业信息管理',
    avatarBg: 'bg-emerald-600', avatarText: '企', unit: 'XX运输有限公司', badgeColor: 'bg-emerald-900/40 text-emerald-200' },
  { id: 'R008', name: '个体运输户', level: '个体级', category: '市场主体',
    description: '个体经营业务办理和信息查询',
    avatarBg: 'bg-green-600', avatarText: '个', unit: '个体经营户', badgeColor: 'bg-green-900/40 text-green-200' },
  { id: 'R009', name: '从业人员', level: '个人级', category: '从业人员',
    description: '资格证申办、诚信记录查询',
    avatarBg: 'bg-cyan-600', avatarText: '员', unit: '道路运输从业人员', badgeColor: 'bg-cyan-900/40 text-cyan-200' },
  { id: 'R010', name: '检验检测机构', level: '机构级', category: '第三方机构',
    description: '检测报告上传、结果查询',
    avatarBg: 'bg-purple-600', avatarText: '检', unit: 'XX检测服务有限公司', badgeColor: 'bg-purple-900/40 text-purple-200' },
  { id: 'R011', name: '行业协会', level: '协会级', category: '社会组织',
    description: '行业自律、信息统计、诚信评价',
    avatarBg: 'bg-amber-600', avatarText: '协', unit: 'XX道路运输协会', badgeColor: 'bg-amber-900/40 text-amber-200' },
  { id: 'R012', name: '社会公众', level: '公众级', category: '社会公众',
    description: '政务公开查询、投诉举报',
    avatarBg: 'bg-gray-500', avatarText: '众', unit: '社会公众', badgeColor: 'bg-gray-700 text-gray-300' },
]

// ─────────────────────────── Role Access Map ───────────────────────────

interface RoleAccess {
  groups: string[]
  children?: Record<string, string[]>
}

const ROLE_ACCESS: Record<string, RoleAccess> = {
  R001: { groups: ['dashboard', 'license', 'personnel', 'vehicle', 'certificate', 'enforcement', 'statistics', 'law', 'ai-service', 'sysadmin'] },
  R002: { groups: ['dashboard', 'license', 'personnel', 'vehicle', 'certificate', 'enforcement', 'statistics', 'law', 'ai-service', 'sysadmin'] },
  R003: { groups: ['dashboard', 'license', 'personnel', 'vehicle', 'certificate', 'statistics', 'ai-service'] },
  R004: { groups: ['dashboard', 'license', 'personnel', 'vehicle', 'certificate', 'statistics'],
    children: {
      license: ['freight', 'hazmat', 'passenger', 'station', 'passenger-station', 'repair', 'training'],
      personnel: ['personnel-list', 'license-issue', 'integrity'],
    }
  },
  R006: { groups: ['dashboard', 'enforcement', 'personnel'],
    children: {
      personnel: ['personnel-list', 'license-issue'],
    }
  },
  R007: { groups: ['dashboard', 'license', 'personnel', 'vehicle', 'certificate'],
    children: {
      license: ['freight', 'hazmat', 'passenger', 'repair', 'training', 'foreign'],
      personnel: ['personnel-list'],
      vehicle: ['vehicle-file'],
      certificate: ['cert-issue', 'cert-renew'],
    }
  },
  R008: { groups: ['dashboard', 'license', 'vehicle', 'certificate'],
    children: {
      license: ['freight', 'passenger'],
      vehicle: ['vehicle-file'],
      certificate: ['cert-issue'],
    }
  },
  R009: { groups: ['dashboard', 'personnel', 'certificate'],
    children: {
      personnel: ['personnel-list', 'license-issue', 'integrity'],
      certificate: ['cert-issue'],
    }
  },
  R010: { groups: ['dashboard', 'vehicle'],
    children: {
      vehicle: ['vehicle-file', 'vehicle-inspect'],
    }
  },
  R011: { groups: ['dashboard', 'statistics', 'law', 'personnel'],
    children: {
      personnel: ['integrity'],
    }
  },
  R012: { groups: ['law', 'statistics'],
    children: {
      statistics: ['stat-report'],
      law: ['law-list'],
    }
  },
}

function getFilteredMenu(roleId: string): MenuItem[] {
  const access = ROLE_ACCESS[roleId] ?? ROLE_ACCESS['R001']
  return ALL_MENU_ITEMS
    .filter(item => access.groups.includes(item.key))
    .map(item => {
      if (!item.children) return item
      const childFilter = access.children?.[item.key]
      if (!childFilter) return item
      return { ...item, children: item.children.filter(c => childFilter.includes(c.key)) }
    })
}

// ─────────────────────────── Sidebar Component ───────────────────────────

interface SidebarProps {
  active: string
  onSelect: (key: string) => void
  currentRole: string
  onRoleChange: (roleId: string) => void
}

export default function Sidebar({ active, onSelect, currentRole, onRoleChange }: SidebarProps) {
  const role = ROLES.find(r => r.id === currentRole) ?? ROLES[0]
  const menuItems = getFilteredMenu(currentRole)

  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = { license: true }
    for (const item of menuItems) {
      if (item.children?.some(c => c.key === active)) init[item.key] = true
    }
    return init
  })

  const [showSwitcher, setShowSwitcher] = useState(false)
  const switcherRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    for (const item of menuItems) {
      if (item.children?.some(c => c.key === active)) {
        setExpanded(prev => ({ ...prev, [item.key]: true }))
        break
      }
    }
  }, [active])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setShowSwitcher(false)
      }
    }
    if (showSwitcher) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showSwitcher])

  const toggle = (key: string) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }))

  const isParentActive = (item: MenuItem) =>
    item.children ? item.children.some(c => c.key === active) : item.key === active

  const handleRoleSelect = (roleId: string) => {
    onRoleChange(roleId)
    setShowSwitcher(false)
    // Re-expand first group of new role
    const newMenu = getFilteredMenu(roleId)
    if (newMenu.length > 0) {
      const first = newMenu.find(m => m.children)
      if (first) setExpanded({ [first.key]: true })
    }
  }

  return (
    <div className="w-56 bg-gov-800 flex flex-col h-full shrink-0">
      {/* Logo */}
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
                    : <ChevronRight size={12} className="text-gov-400 shrink-0" />}
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

      {/* Bottom role switcher */}
      <div className="relative shrink-0" ref={switcherRef}>
        {/* Role selector popup */}
        {showSwitcher && (
          <div className="absolute bottom-full left-0 right-0 bg-gov-900 border border-gov-600 rounded-t-xl shadow-2xl overflow-hidden">
            {/* Popup header */}
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-gov-700">
              <div className="flex items-center gap-1.5">
                <LogIn size={13} className="text-gov-300" />
                <span className="text-xs font-semibold text-white">切换角色登录</span>
              </div>
              <button onClick={() => setShowSwitcher(false)}
                className="text-gov-400 hover:text-white transition-colors">
                <X size={14} />
              </button>
            </div>
            {/* Role level groups */}
            <div className="max-h-72 overflow-y-auto py-1">
              {/* Group: 行政管理 */}
              {[
                { label: '行政管理', ids: ['R001', 'R002', 'R003', 'R004'] },
                { label: '执法人员', ids: ['R006'] },
                { label: '市场主体', ids: ['R007', 'R008'] },
                { label: '从业/机构/组织', ids: ['R009', 'R010', 'R011'] },
                { label: '社会公众', ids: ['R012'] },
              ].map(group => (
                <div key={group.label}>
                  <div className="px-3 pt-2 pb-0.5">
                    <span className="text-[9px] font-semibold text-gov-500 uppercase tracking-wider">{group.label}</span>
                  </div>
                  {group.ids.map(id => {
                    const r = ROLES.find(x => x.id === id)!
                    const isCurrent = currentRole === id
                    return (
                      <button key={id} onClick={() => handleRoleSelect(id)}
                        className={clsx(
                          'w-full flex items-center gap-2.5 px-3 py-2 transition-colors text-left',
                          isCurrent
                            ? 'bg-gov-600/50'
                            : 'hover:bg-gov-700/60'
                        )}>
                        <div className={clsx('w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0', r.avatarBg)}>
                          {r.avatarText}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className={clsx('text-xs font-medium', isCurrent ? 'text-white' : 'text-gov-100')}>{r.name}</span>
                            {isCurrent && <span className="text-[9px] px-1 py-0.5 rounded bg-gov-400/50 text-gov-200">当前</span>}
                          </div>
                          <div className="text-[10px] text-gov-400 truncate">{r.level} · {r.description.slice(0, 16)}…</div>
                        </div>
                        <span className={clsx('text-[9px] font-bold px-1 py-0.5 rounded border shrink-0', r.badgeColor)}>{id}</span>
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trigger bar */}
        <button
          onClick={() => setShowSwitcher(v => !v)}
          className={clsx(
            'w-full px-4 py-3 border-t border-gov-700 flex items-center gap-2.5 transition-colors',
            showSwitcher ? 'bg-gov-700' : 'hover:bg-gov-700/50'
          )}
        >
          <div className={clsx('w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0', role.avatarBg)}>
            {role.avatarText}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-white text-xs font-medium truncate">{role.name}</span>
              <span className={clsx('text-[9px] font-bold px-1 rounded shrink-0', role.badgeColor)}>{role.id}</span>
            </div>
            <div className="text-gov-400 text-[10px] truncate">{role.unit}</div>
          </div>
          {showSwitcher
            ? <ChevronDown size={12} className="text-gov-400 shrink-0" />
            : <ChevronUp size={12} className="text-gov-400 shrink-0" />}
        </button>
      </div>
    </div>
  )
}
