import React, { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import {
  Truck, Users, FileText, ShieldAlert, AlertTriangle, TrendingUp,
  CheckCircle, Sparkles, ArrowUpRight, ArrowDownRight, Activity,
  Zap, Eye, ChevronRight, Award
} from 'lucide-react'
import { statData, monthlyStats, riskDistribution, aiCapabilities } from '../data/mockData'

interface StatCardProps {
  title: string
  value: string | number
  sub?: string
  yoy?: number
  icon: React.ReactNode
  iconBg: string
  onClick?: () => void
}

function StatCard({ title, value, sub, yoy, icon, iconBg, onClick }: StatCardProps) {
  return (
    <div
      className="card p-4 cursor-pointer hover:shadow-md transition-shadow group"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
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

export default function Dashboard({ onNavigate }: { onNavigate: (key: string) => void }) {
  const [selectedPeriod, setSelectedPeriod] = useState('月度')

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-gray-100 shrink-0">
        <div>
          <h1 className="text-base font-bold text-gov-800">AI 数据驾驶舱</h1>
          <p className="text-xs text-gray-500 mt-0.5">道路运输行业实时运行态势 · 数据更新时间：{new Date().toLocaleString('zh-CN')}</p>
        </div>
        <div className="flex items-center gap-2">
          {['月度', '季度', '年度'].map(p => (
            <button
              key={p}
              onClick={() => setSelectedPeriod(p)}
              className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${selectedPeriod === p ? 'bg-gov-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Stats Row 1 */}
        <div className="grid grid-cols-6 gap-4">
          <StatCard title="货运许可证" value={statData.freight.total.toLocaleString()} sub={`有效：${statData.freight.valid}`} yoy={statData.freight.yoy} icon={<Truck size={18} className="text-blue-600" />} iconBg="bg-blue-50" onClick={() => onNavigate('freight')} />
          <StatCard title="客运许可证" value={statData.passenger.total.toLocaleString()} sub={`有效：${statData.passenger.valid}`} yoy={statData.passenger.yoy} icon={<Users size={18} className="text-indigo-600" />} iconBg="bg-indigo-50" onClick={() => onNavigate('passenger')} />
          <StatCard title="危货许可证" value={statData.hazmat.total.toLocaleString()} sub={`有效：${statData.hazmat.valid}`} yoy={statData.hazmat.yoy} icon={<AlertTriangle size={18} className="text-amber-600" />} iconBg="bg-amber-50" onClick={() => onNavigate('hazmat')} />
          <StatCard title="从业人员" value={statData.personnel.total.toLocaleString()} sub={`持证有效：${statData.personnel.valid}`} yoy={statData.personnel.yoy} icon={<Users size={18} className="text-green-600" />} iconBg="bg-green-50" onClick={() => onNavigate('personnel-list')} />
          <StatCard title="在营车辆" value={statData.vehicles.total.toLocaleString()} sub={`技术合格：${statData.vehicles.valid}`} yoy={statData.vehicles.yoy} icon={<Truck size={18} className="text-cyan-600" />} iconBg="bg-cyan-50" onClick={() => onNavigate('vehicle-file')} />
          <StatCard title="执法案件" value={statData.cases.total.toLocaleString()} sub={`处理中：${statData.cases.pending}`} yoy={statData.cases.yoy} icon={<ShieldAlert size={18} className="text-red-600" />} iconBg="bg-red-50" onClick={() => onNavigate('case')} />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-12 gap-5">
          {/* License trend */}
          <div className="col-span-5 card">
            <div className="card-header">
              <div className="card-title">许可办理趋势（件/月）</div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />货运</div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />客运</div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />危货</div>
              </div>
            </div>
            <div className="p-4 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyStats} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
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

          {/* Risk distribution */}
          <div className="col-span-3 card">
            <div className="card-header">
              <div className="card-title">AI 风险分布</div>
              <span className="text-xs text-gray-400">全量车辆</span>
            </div>
            <div className="p-4 h-48 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskDistribution} cx="50%" cy="45%" innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value">
                    {riskDistribution.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => [`${v}%`, '']} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cases bar */}
          <div className="col-span-4 card">
            <div className="card-header">
              <div className="card-title">执法案件趋势</div>
              <div className="flex items-center gap-1 text-xs text-emerald-600">
                <ArrowDownRight size={12} />
                同比降15.3%
              </div>
            </div>
            <div className="p-4 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyStats} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
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
                    <CheckCircle size={11} />
                    {cap.status}
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
                <button
                  key={item.key}
                  onClick={() => onNavigate(item.key)}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${item.color}`}>
                    {item.icon}
                  </div>
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
