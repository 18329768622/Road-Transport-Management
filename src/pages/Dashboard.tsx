import React, { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import {
  Truck, Users, FileText, ShieldAlert, AlertTriangle, TrendingUp,
  CheckCircle, Sparkles, ArrowUpRight, ArrowDownRight, Activity,
  Zap, ChevronRight, Award
} from 'lucide-react'
import { riskDistribution, aiCapabilities } from '../data/mockData'

// ─────────────────────────── Period Data ───────────────────────────

type Period = '月度' | '季度' | '年度'

interface PeriodStats {
  freight:   { total: number; valid: number; yoy: number }
  passenger: { total: number; valid: number; yoy: number }
  hazmat:    { total: number; valid: number; yoy: number }
  personnel: { total: number; valid: number; yoy: number }
  vehicles:  { total: number; valid: number; yoy: number }
  cases:     { total: number; pending: number; yoy: number }
}

const STATS: Record<Period, PeriodStats> = {
  月度: {
    freight:   { total: 1250,  valid: 1180,  yoy:  8.5 },
    passenger: { total: 328,   valid: 312,   yoy:  3.2 },
    hazmat:    { total: 156,   valid: 148,   yoy:  5.8 },
    personnel: { total: 48650, valid: 46200, yoy:  2.1 },
    vehicles:  { total: 12580, valid: 11920, yoy:  4.3 },
    cases:     { total: 2340,  pending: 160, yoy: -15.3 },
  },
  季度: {
    freight:   { total: 3820,  valid: 3641,  yoy:  11.2 },
    passenger: { total: 985,   valid: 940,   yoy:   4.8 },
    hazmat:    { total: 468,   valid: 445,   yoy:   7.3 },
    personnel: { total: 48650, valid: 46200, yoy:   2.4 },
    vehicles:  { total: 12580, valid: 11920, yoy:   5.1 },
    cases:     { total: 7020,  pending: 480, yoy: -18.6 },
  },
  年度: {
    freight:   { total: 14250, valid: 13680,  yoy:   9.8 },
    passenger: { total: 3840,  valid: 3680,   yoy:   5.6 },
    hazmat:    { total: 1820,  valid: 1740,   yoy:   8.2 },
    personnel: { total: 48650, valid: 46200,  yoy:   2.1 },
    vehicles:  { total: 12580, valid: 11920,  yoy:   4.3 },
    cases:     { total: 26850, pending: 1750, yoy: -12.4 },
  },
}

interface TrendPoint { month: string; freight: number; passenger: number; hazmat: number; cases: number }

const TRENDS: Record<Period, TrendPoint[]> = {
  月度: [
    { month: '1月', freight:  98, passenger: 22, hazmat: 12, cases: 185 },
    { month: '2月', freight:  72, passenger: 18, hazmat:  8, cases: 142 },
    { month: '3月', freight: 115, passenger: 28, hazmat: 15, cases: 201 },
    { month: '4月', freight: 108, passenger: 25, hazmat: 14, cases: 190 },
    { month: '5月', freight: 132, passenger: 31, hazmat: 17, cases: 223 },
    { month: '6月', freight: 125, passenger: 29, hazmat: 19, cases: 198 },
  ],
  季度: [
    { month: 'Q1', freight:  285, passenger:  68, hazmat: 35, cases:  528 },
    { month: 'Q2', freight:  342, passenger:  82, hazmat: 48, cases:  598 },
    { month: 'Q3', freight:  318, passenger:  76, hazmat: 42, cases:  562 },
    { month: 'Q4', freight:  295, passenger:  70, hazmat: 38, cases:  485 },
  ],
  年度: [
    { month: '2021', freight: 10200, passenger: 2980, hazmat: 1420, cases: 28500 },
    { month: '2022', freight: 11500, passenger: 3180, hazmat: 1580, cases: 30200 },
    { month: '2023', freight: 12800, passenger: 3520, hazmat: 1680, cases: 29800 },
    { month: '2024', freight: 13600, passenger: 3720, hazmat: 1760, cases: 28100 },
    { month: '2025', freight: 14250, passenger: 3840, hazmat: 1820, cases: 26850 },
  ],
}

const TREND_UNIT: Record<Period, string> = {
  月度: '件/月', 季度: '件/季', 年度: '件/年',
}

// ─────────────────────────── StatCard ───────────────────────────

interface StatCardProps {
  title: string; value: string | number; sub?: string; yoy?: number
  icon: React.ReactNode; iconBg: string; onClick?: () => void
}

function StatCard({ title, value, sub, yoy, icon, iconBg, onClick }: StatCardProps) {
  return (
    <div className="card p-4 cursor-pointer hover:shadow-md transition-shadow group" onClick={onClick}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>{icon}</div>
        {yoy !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${yoy >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {yoy >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(yoy)}%
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-gov-800 mb-0.5">{value}</div>
      <div className="text-xs text-gray-500">{title}</div>
      {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
      <div className="mt-2 flex items-center gap-1 text-gov-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
        <span>查看详情</span><ChevronRight size={11} />
      </div>
    </div>
  )
}

// ─────────────────────────── Dashboard ───────────────────────────

export default function Dashboard({ onNavigate }: { onNavigate: (key: string) => void }) {
  const [period, setPeriod] = useState<Period>('月度')

  const s = STATS[period]
  const trend = TRENDS[period]

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-gray-100 shrink-0">
        <div>
          <h1 className="text-base font-bold text-gov-800">AI 数据驾驶舱</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            道路运输行业实时运行态势 · 数据更新时间：{new Date().toLocaleString('zh-CN')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(['月度', '季度', '年度'] as Period[]).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
                period === p ? 'bg-gov-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Stats Row */}
        <div className="grid grid-cols-6 gap-4">
          <StatCard title="货运许可证" value={s.freight.total.toLocaleString()} sub={`有效：${s.freight.valid.toLocaleString()}`} yoy={s.freight.yoy} icon={<Truck size={18} className="text-blue-600" />} iconBg="bg-blue-50" onClick={() => onNavigate('freight')} />
          <StatCard title="客运许可证" value={s.passenger.total.toLocaleString()} sub={`有效：${s.passenger.valid.toLocaleString()}`} yoy={s.passenger.yoy} icon={<Users size={18} className="text-indigo-600" />} iconBg="bg-indigo-50" onClick={() => onNavigate('passenger')} />
          <StatCard title="危货许可证" value={s.hazmat.total.toLocaleString()} sub={`有效：${s.hazmat.valid.toLocaleString()}`} yoy={s.hazmat.yoy} icon={<AlertTriangle size={18} className="text-amber-600" />} iconBg="bg-amber-50" onClick={() => onNavigate('hazmat')} />
          <StatCard title="从业人员" value={s.personnel.total.toLocaleString()} sub={`持证有效：${s.personnel.valid.toLocaleString()}`} yoy={s.personnel.yoy} icon={<Users size={18} className="text-green-600" />} iconBg="bg-green-50" onClick={() => onNavigate('personnel-list')} />
          <StatCard title="在营车辆" value={s.vehicles.total.toLocaleString()} sub={`技术合格：${s.vehicles.valid.toLocaleString()}`} yoy={s.vehicles.yoy} icon={<Truck size={18} className="text-cyan-600" />} iconBg="bg-cyan-50" onClick={() => onNavigate('vehicle-file')} />
          <StatCard title="执法案件" value={s.cases.total.toLocaleString()} sub={`处理中：${s.cases.pending.toLocaleString()}`} yoy={s.cases.yoy} icon={<ShieldAlert size={18} className="text-red-600" />} iconBg="bg-red-50" onClick={() => onNavigate('case')} />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-12 gap-5">
          {/* License trend */}
          <div className="col-span-5 card">
            <div className="card-header">
              <div className="card-title">许可办理趋势（{TREND_UNIT[period]}）</div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />货运</div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />客运</div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />危货</div>
              </div>
            </div>
            <div className="p-4 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="cFreight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="cPassenger" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }} />
                  <Area type="monotone" dataKey="freight" stroke="#3B82F6" fill="url(#cFreight)" strokeWidth={2} />
                  <Area type="monotone" dataKey="passenger" stroke="#6366F1" fill="url(#cPassenger)" strokeWidth={2} />
                  <Area type="monotone" dataKey="hazmat" stroke="#F59E0B" fill="none" strokeWidth={2} strokeDasharray="4 2" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk distribution — custom legend outside PieChart */}
          <div className="col-span-3 card">
            <div className="card-header">
              <div className="card-title">AI 风险分布</div>
              <span className="text-xs text-gray-400">全量车辆</span>
            </div>
            <div className="px-4 pt-2 pb-4">
              <div style={{ height: 140 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskDistribution}
                      cx="50%" cy="50%"
                      innerRadius={42} outerRadius={64}
                      paddingAngle={3} dataKey="value"
                    >
                      {riskDistribution.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v: number) => [`${v}%`, '']}
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-3">
                {riskDistribution.map(item => (
                  <div key={item.name} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-[11px] text-gray-600 truncate">{item.name}</span>
                    <span className="text-[11px] font-semibold ml-auto" style={{ color: item.color }}>{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cases bar */}
          <div className="col-span-4 card">
            <div className="card-header">
              <div className="card-title">执法案件趋势</div>
              <div className={`flex items-center gap-1 text-xs ${s.cases.yoy < 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {s.cases.yoy < 0 ? <ArrowDownRight size={12} /> : <ArrowUpRight size={12} />}
                同比{s.cases.yoy < 0 ? '降' : '升'}{Math.abs(s.cases.yoy)}%
              </div>
            </div>
            <div className="p-4 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trend} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }} />
                  <Bar dataKey="cases" fill="#EF4444" radius={[3, 3, 0, 0]} opacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-12 gap-5">
          {/* AI Capabilities */}
          <div className="col-span-5 card">
            <div className="card-header">
              <div className="flex items-center gap-2 card-title">
                <Sparkles size={14} className="text-indigo-500" />
                AI 能力运行状态
              </div>
              <span className="text-xs text-emerald-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot inline-block" />
                全部正常
              </span>
            </div>
            <div className="divide-y divide-gray-50">
              {aiCapabilities.map(cap => (
                <div key={cap.name} className="flex items-center gap-3 px-5 py-2.5">
                  <div className="w-24 text-xs text-gray-700 font-medium shrink-0">{cap.name}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">准确率 {cap.accuracy}%</span>
                      <span className="text-xs text-gray-500">今日调用 {cap.usage.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${cap.accuracy}%` }} />
                    </div>
                  </div>
                  <div className="text-xs text-emerald-500 shrink-0 flex items-center gap-1">
                    <CheckCircle size={11} />{cap.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div className="col-span-4 card">
            <div className="card-header">
              <div className="card-title">AI 智能预警</div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600">
                12 条待处理
              </span>
            </div>
            <div className="divide-y divide-gray-50">
              {[
                { type: '极高', text: '危货车辆粤D45678 偏离预定路线 2.3km', time: '5分钟前', color: 'bg-red-100 text-red-700' },
                { type: '高', text: '鑫鹏物流许可证将于60天后到期，请督促续期', time: '32分钟前', color: 'bg-amber-100 text-amber-700' },
                { type: '高', text: '检测到赵小华司机连续驾驶超4小时', time: '1小时前', color: 'bg-red-100 text-red-700' },
                { type: '中', text: '天龙货运公司车辆技术等级下降预警', time: '2小时前', color: 'bg-amber-100 text-amber-700' },
                { type: '中', text: '货运站场监控识别可疑占道行为', time: '3小时前', color: 'bg-amber-100 text-amber-700' },
                { type: '低', text: '6份从业资格证将于90天后到期', time: '今日08:00', color: 'bg-blue-100 text-blue-700' },
              ].map((alert, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer">
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 mt-0.5 ${alert.color}`}>
                    {alert.type}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-700 leading-relaxed">{alert.text}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{alert.time}</div>
                  </div>
                  <ChevronRight size={12} className="text-gray-300 shrink-0 mt-1" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Access */}
          <div className="col-span-3 card">
            <div className="card-header">
              <div className="card-title">快速入口</div>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              {[
                { label: '许可申请', icon: <FileText size={18} />, color: 'bg-blue-50 text-blue-600', key: 'freight' },
                { label: '执法立案', icon: <ShieldAlert size={18} />, color: 'bg-red-50 text-red-600', key: 'case' },
                { label: '危货监控', icon: <AlertTriangle size={18} />, color: 'bg-amber-50 text-amber-600', key: 'hazmat' },
                { label: '证件核发', icon: <Award size={18} />, color: 'bg-emerald-50 text-emerald-600', key: 'cert-issue' },
                { label: '人员管理', icon: <Users size={18} />, color: 'bg-indigo-50 text-indigo-600', key: 'personnel-list' },
                { label: '行业分析', icon: <Activity size={18} />, color: 'bg-cyan-50 text-cyan-600', key: 'industry-analysis' },
                { label: '统计报表', icon: <TrendingUp size={18} />, color: 'bg-violet-50 text-violet-600', key: 'stat-report' },
                { label: '风险预测', icon: <Zap size={18} />, color: 'bg-orange-50 text-orange-600', key: 'vehicle-risk' },
              ].map(item => (
                <button key={item.key} onClick={() => onNavigate(item.key)}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${item.color}`}>{item.icon}</div>
                  <span className="text-xs text-gray-700 font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
