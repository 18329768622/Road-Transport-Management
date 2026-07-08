import React, { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts'
import { Sparkles, TrendingUp, TrendingDown, FileText, Download, Plus } from 'lucide-react'
import { AIBadge } from '../components/StatusBadge'
import AIPanel from '../components/AIPanel'
import { monthlyStats, statData } from '../data/mockData'

type STab = '统计报表' | '行业分析' | '数据质量'

export default function Statistics({ initialTab }: { initialTab?: STab }) {
  const [tab, setTab] = useState<STab>(initialTab ?? '统计报表')

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-gov-800">道路运输统计管理</h1>
            <p className="text-xs text-gray-500 mt-0.5">第十六章 · 行业统计报表、运行分析、AI数据质量治理</p>
          </div>
          <div className="flex items-center gap-2">
            <AIBadge label="AI自动汇总" />
            <button className="btn-secondary"><Download size={14} />导出报表</button>
            <button className="btn-primary"><Plus size={14} />生成分析报告</button>
          </div>
        </div>
        <div className="flex gap-1 mt-4 border-b border-gray-100 -mb-4">
          {(['统计报表', '行业分析', '数据质量'] as STab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${tab === t ? 'border-gov-500 text-gov-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {tab === '统计报表' && <ReportTab />}
        {tab === '行业分析' && <AnalysisTab />}
        {tab === '数据质量' && <DataQualityTab />}
      </div>
    </div>
  )
}

function ReportTab() {
  const [period, setPeriod] = useState('月度')
  const [selectedMonth, setSelectedMonth] = useState('2024-06')

  const reports = [
    { name: '行业基本情况', data: [{ label: '货运经营企业', value: '1,250家', yoy: '+8.5%', up: true }, { label: '客运经营企业', value: '328家', yoy: '+3.2%', up: true }, { label: '危货运输企业', value: '156家', yoy: '+5.8%', up: true }, { label: '道路运输车辆', value: '38,500辆', yoy: '+6.3%', up: true }] },
    { name: '运输生产', data: [{ label: '货运量', value: '3,285万吨', yoy: '+12.1%', up: true }, { label: '货物周转量', value: '185.2亿吨公里', yoy: '+9.8%', up: true }, { label: '旅客运量', value: '285万人次', yoy: '+3.2%', up: true }, { label: '旅客周转量', value: '21.5亿人公里', yoy: '+2.8%', up: true }] },
    { name: '许可监督检查', data: [{ label: '新发许可证', value: '342件', yoy: '-5.2%', up: false }, { label: '监督检查次数', value: '1,856次', yoy: '+15.3%', up: true }, { label: '行政处罚案件', value: '2,340件', yoy: '-15.3%', up: false }, { label: '罚款金额', value: '1,285万元', yoy: '-18.5%', up: false }] },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-gray-500">统计周期：</label>
            <div className="flex">
              {['月度', '季度', '年度'].map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 text-xs border-y border-r first:border-l first:rounded-l last:rounded-r transition-colors ${period === p ? 'bg-gov-500 text-white border-gov-500' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <input type="month" className="form-input text-sm py-1.5 w-40" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} />
        </div>
        <div className="flex items-center gap-1 text-xs text-indigo-500">
          <Sparkles size={11} />
          <span>AI已自动汇总 {new Date().toLocaleString('zh-CN')} 的数据</span>
        </div>
      </div>

      {reports.map(section => (
        <div key={section.name} className="card">
          <div className="card-header">
            <div className="card-title">{section.name} — {selectedMonth}</div>
            <div className="flex items-center gap-1 text-xs text-indigo-500"><Sparkles size={11} />AI自动汇总</div>
          </div>
          <div className="grid grid-cols-4 gap-0 divide-x divide-gray-100">
            {section.data.map(item => (
              <div key={item.label} className="p-5">
                <div className="text-xs text-gray-500 mb-1">{item.label}</div>
                <div className="text-xl font-bold text-gov-800 mb-1">{item.value}</div>
                <div className={`flex items-center gap-1 text-xs font-medium ${item.up ? 'text-emerald-600' : 'text-red-500'}`}>
                  {item.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  同比 {item.yoy}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Charts */}
      <div className="grid grid-cols-2 gap-5">
        <div className="card">
          <div className="card-header"><div className="card-title">许可办理月度趋势</div></div>
          <div className="p-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyStats} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="freight" name="货运" fill="#3B82F6" radius={[2, 2, 0, 0]} />
                <Bar dataKey="passenger" name="客运" fill="#6366F1" radius={[2, 2, 0, 0]} />
                <Bar dataKey="hazmat" name="危货" fill="#F59E0B" radius={[2, 2, 0, 0]} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">执法案件趋势</div></div>
          <div className="p-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyStats} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="gCases" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Area type="monotone" dataKey="cases" name="案件数" stroke="#EF4444" fill="url(#gCases)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

function AnalysisTab() {
  const [generating, setGenerating] = useState(false)
  const [report, setReport] = useState('')

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      setReport(`2024年6月道路运输行业运行分析报告

一、基本情况
  截至2024年6月底，全市道路运输经营企业共1,734家，同比增长6.8%。其中货运企业1,250家（占72.1%），客运企业328家（占18.9%），危货企业156家（占9.0%）。

二、运输生产情况
  本月货运量3,285万吨，同比增长12.1%，环比增长4.3%；货物周转量185.2亿吨公里，同比增长9.8%。旅客运量285万人次，同比增长3.2%，受暑运旺季影响，预计7月旅客运量将继续增长。

三、监管执法情况
  本月开展监督检查1,856次，发现问题586件，整改率达91.8%。行政处罚案件2,340件，同比减少15.3%，罚款金额1,285万元，同比减少18.5%，违规行为发生率持续下降，监管效能提升明显。

四、AI赋能分析
  AI风险预测系统共标记高风险车辆2,140辆（占比5.6%），其中极高风险290辆已全部进行重点检查；AI辅助审批完成1,523件，平均审批时限从5天缩短至1.2天。

五、问题与建议
  1. 部分危货企业罐体健康度下降，建议加强专项整治；
  2. 暑运高峰临近，建议增加客运专项检查频次；
  3. AI预测7月份货运量将较本月增加约8%，运力总体充足。`)
    }, 2000)
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 card">
          <div className="card-header">
            <div className="card-title">行业运行趋势（近6个月）</div>
          </div>
          <div className="p-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyStats} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Line type="monotone" dataKey="freight" name="货运许可" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="passenger" name="客运许可" stroke="#6366F1" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="cases" name="执法案件" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="4 2" />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-5">
          <div className="card-title mb-3">AI 行业分析报告生成</div>
          <div className="text-xs text-gray-500 mb-4 leading-relaxed">
            AI将从各业务系统自动汇聚数据，综合分析行业运行情况、热点问题、风险预警，自动撰写分析报告
          </div>
          <div className="flex gap-2 mb-3">
            <select className="form-select flex-1 text-sm py-1.5">
              <option>2024年6月</option>
              <option>2024年Q2</option>
              <option>2024年上半年</option>
            </select>
          </div>
          <button
            className="btn-primary w-full justify-center"
            onClick={handleGenerate}
            disabled={generating}
          >
            <Sparkles size={14} />
            {generating ? 'AI生成中...' : 'AI生成分析报告'}
          </button>
        </div>
      </div>

      {report && (
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-2 card-title">
              <Sparkles size={14} className="text-indigo-500" />
              AI生成的行业分析报告
            </div>
            <div className="flex items-center gap-2">
              <AIBadge label="AI辅助生成" />
              <button className="btn-secondary btn-sm flex items-center gap-1.5"><Download size={12} />下载</button>
            </div>
          </div>
          <div className="p-5">
            <div className="prose max-w-none text-sm text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 rounded-lg p-4 border border-gray-100">
              {report}
            </div>
            <div className="mt-3 text-xs text-indigo-500 flex items-center gap-1">
              <Sparkles size={10} />
              本报告由AI辅助生成，数据来源于业务系统实时数据，请经办人员审核后正式发布
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function DataQualityTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '数据完整率', value: '98.2%', target: '≥95%', ok: true },
          { label: '数据准确率', value: '97.8%', target: '≥97%', ok: true },
          { label: '数据及时率', value: '99.1%', target: '≥98%', ok: true },
          { label: '异常数据占比', value: '0.8%', target: '≤2%', ok: true },
        ].map(s => (
          <div key={s.label} className={`card p-4 ${s.ok ? 'bg-emerald-50' : 'bg-red-50'}`}>
            <div className={`text-2xl font-bold ${s.ok ? 'text-emerald-600' : 'text-red-600'}`}>{s.value}</div>
            <div className="text-sm text-gray-600 mt-1">{s.label}</div>
            <div className="text-xs text-gray-400 mt-0.5">目标：{s.target}</div>
          </div>
        ))}
      </div>
      <div className="card p-5">
        <div className="flex items-center gap-2 card-title mb-4">
          <Sparkles size={14} className="text-indigo-500" />
          AI数据问题清单
        </div>
        <div className="space-y-2">
          {[
            { issue: '5条货运业户信息电话号码格式异常', level: '低', source: '货运业户表', status: '待处理' },
            { issue: '12条车辆里程数据明显偏高（疑似录入错误）', level: '中', source: '车辆档案表', status: '已修正' },
            { issue: '3条从业人员年龄超出正常范围（>80岁）', level: '中', source: '从业人员表', status: '核查中' },
            { issue: '8份证件已到期但状态未更新', level: '高', source: '证件管理表', status: '已修正' },
          ].map((d, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${d.level === '高' ? 'bg-red-100 text-red-700' : d.level === '中' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>{d.level}</span>
              <span className="flex-1 text-sm text-gray-700">{d.issue}</span>
              <span className="text-xs text-gray-400">{d.source}</span>
              <span className={`text-xs px-2 py-0.5 rounded ${d.status === '已修正' ? 'bg-emerald-100 text-emerald-700' : d.status === '核查中' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>{d.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
