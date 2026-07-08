import React, { useState, useRef, useEffect } from 'react'
import clsx from 'clsx'
import {
  Bot, Send, Sparkles, AlertTriangle, BookOpen, BarChart3, Activity,
  CheckCircle, Clock, XCircle, ChevronRight, MessageSquare, Zap,
  TrendingUp, TrendingDown, Shield, Eye, FileText, RefreshCw,
  Download, Bell, BellOff, Cpu, Database, Server, Wifi, WifiOff,
  ThumbsUp, ThumbsDown, Copy, RotateCcw, Search, Filter,
  ArrowUpRight, ArrowDownRight, Star, MoreHorizontal
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

interface AIServicesProps {
  initialTab?: string
}

// ──────────────────────────────────────────────
// Shared helpers
// ──────────────────────────────────────────────
const AIChip = ({ label }: { label: string }) => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-sky-100 text-sky-700 rounded-full text-[10px] font-medium">
    <Sparkles size={9} />
    {label}
  </span>
)

const SectionCard = ({ title, children, extra }: { title: string; children: React.ReactNode; extra?: React.ReactNode }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
    <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      {extra}
    </div>
    <div className="p-5">{children}</div>
  </div>
)

// ──────────────────────────────────────────────
// 1. AI智能审批助手
// ──────────────────────────────────────────────
const approvalCases = [
  { id: 'AP2024001', type: '道路货运许可', company: '顺达物流有限公司', submittedAt: '2024-06-25 09:12', status: 'pending', aiScore: 94, materials: 6, issues: 0 },
  { id: 'AP2024002', type: '危险品运输许可', company: '安全运输集团', submittedAt: '2024-06-25 10:30', status: 'review', aiScore: 71, materials: 8, issues: 2 },
  { id: 'AP2024003', type: '驾培机构设立', company: '精英驾驶培训学校', submittedAt: '2024-06-24 14:20', status: 'approved', aiScore: 98, materials: 10, issues: 0 },
  { id: 'AP2024004', type: '外商投资运输', company: '中外联运（合资）', submittedAt: '2024-06-24 11:05', status: 'rejected', aiScore: 45, materials: 12, issues: 5 },
  { id: 'AP2024005', type: '国际道路运输', company: '丝路运通国际物流', submittedAt: '2024-06-23 16:44', status: 'approved', aiScore: 96, materials: 9, issues: 0 },
]

const materialChecks = [
  { name: '营业执照', status: 'pass', confidence: 99, note: '有效期至2027-08-31' },
  { name: '法人身份证', status: 'pass', confidence: 97, note: '证件清晰，信息匹配' },
  { name: '安全生产许可证', status: 'pass', confidence: 95, note: '有效期内' },
  { name: '车辆行驶证（示例）', status: 'warn', confidence: 78, note: '部分图像模糊，建议重传' },
  { name: '驾驶员资格证', status: 'pass', confidence: 93, note: '共6份，全部有效' },
  { name: '运输合同样本', status: 'fail', confidence: 42, note: '格式不符合规范，需修改' },
]

const flowSteps = ['材料接收', 'AI预审', '规则校验', '人工复核', '审批决定', '证件核发']

interface ChatMsg { role: 'user' | 'ai'; content: string; ts: string }

const INIT_MESSAGES: ChatMsg[] = [
  { role: 'ai', content: '您好！我是AI智能审批助手。我可以帮您快速查询审批进度、解读材料要求、预判审批结果，或辅助您填写申请表单。请问有什么可以帮到您？', ts: '09:00' },
]

const AI_QUICK_REPLIES = [
  '申请道路货运许可需要哪些材料？',
  '危险品运输许可审批流程是什么？',
  'AP2024002 的审批问题如何整改？',
  '帮我预判这批材料能否通过审批',
]

const AI_ANSWER_MAP: Record<string, string> = {
  '申请道路货运许可需要哪些材料？': '申请道路货运许可需提交以下材料：\n① 企业营业执照（有效期内）\n② 法定代表人身份证明\n③ 安全生产管理制度文本\n④ 车辆行驶证及技术合格证明\n⑤ 驾驶员从业资格证（每车一份）\n⑥ 停车场地使用证明\n\nAI建议：请确保所有证件图像清晰、信息完整，避免材料模糊导致OCR识别失败。',
  '危险品运输许可审批流程是什么？': '危险品运输许可审批流程共6个环节：\n材料接收 → AI预审（1小时内）→ 规则校验 → 人工复核（3个工作日）→ 审批决定 → 证件核发\n\nAI预审会重点核查：危险品专项资质、安全培训记录、应急预案完整性。建议提前准备完整的安全管理体系文件。',
  'AP2024002 的审批问题如何整改？': '针对案件 AP2024002（安全运输集团），AI识别出2处问题：\n\n问题1：安全生产许可证上的注册地址与营业执照不一致\n→ 整改建议：提交地址变更备案证明或重新核发最新证件\n\n问题2：危险品运输专项培训记录缺少2024年度记录\n→ 整改建议：补充2024年度培训照片、签到表及考核结果\n\n完成整改后可重新提交，AI将优先处理。',
  '帮我预判这批材料能否通过审批': '根据您描述的材料情况，AI进行综合评估：\n\n综合通过概率：约78%\n\n潜在风险点：\n• 车辆行驶证图像质量偏低（建议重新拍摄）\n• 运输合同样本格式需参照最新模板修改\n• 建议补充近6个月安全自查记录\n\n若完成上述优化，预计通过概率可提升至94%以上。',
}

function ApprovalAssistant() {
  const [selected, setSelected] = useState(approvalCases[0])
  const [messages, setMessages] = useState<ChatMsg[]>(INIT_MESSAGES)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const statusMap: Record<string, { label: string; cls: string }> = {
    pending: { label: 'AI预审中', cls: 'bg-blue-50 text-blue-700' },
    review: { label: '人工复核', cls: 'bg-amber-50 text-amber-700' },
    approved: { label: '已批准', cls: 'bg-green-50 text-green-700' },
    rejected: { label: '已拒绝', cls: 'bg-red-50 text-red-700' },
  }

  const sendMsg = (text?: string) => {
    const q = text ?? input.trim()
    if (!q) return
    const ts = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    setMessages(prev => [...prev, { role: 'user', content: q, ts }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      const answer = AI_ANSWER_MAP[q] ?? 'AI正在分析您的问题，请稍候……根据系统数据，建议您参考相关法规要求并准备完整材料，如有疑问可联系业务窗口进一步咨询。'
      setMessages(prev => [...prev, { role: 'ai', content: answer, ts: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) }])
      setTyping(false)
    }, 1200)
  }

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, typing])

  return (
    <div className="flex gap-4 h-full">
      {/* Left: case list + material check */}
      <div className="w-80 flex flex-col gap-4 shrink-0">
        <SectionCard title="待审批案件" extra={<AIChip label="AI预审" />}>
          <div className="space-y-2">
            {approvalCases.map(c => (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className={clsx(
                  'w-full text-left rounded-lg border p-3 transition-all',
                  selected.id === c.id ? 'border-sky-400 bg-sky-50' : 'border-gray-100 hover:border-gray-200 bg-gray-50'
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-700">{c.id}</span>
                  <span className={clsx('text-[10px] px-2 py-0.5 rounded-full font-medium', statusMap[c.status].cls)}>
                    {statusMap[c.status].label}
                  </span>
                </div>
                <div className="text-[11px] text-gray-500 truncate">{c.type}</div>
                <div className="text-[10px] text-gray-400 mt-0.5 truncate">{c.company}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] text-gray-400">{c.materials}份材料</span>
                  <span className={clsx('text-xs font-bold', c.aiScore >= 85 ? 'text-green-600' : c.aiScore >= 70 ? 'text-amber-600' : 'text-red-600')}>
                    AI评分 {c.aiScore}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="AI材料核验" extra={<span className="text-[10px] text-gray-400">{selected.id}</span>}>
          <div className="space-y-2">
            {materialChecks.map((m, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className={clsx(
                  'mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0',
                  m.status === 'pass' ? 'bg-green-100' : m.status === 'warn' ? 'bg-amber-100' : 'bg-red-100'
                )}>
                  {m.status === 'pass' ? <CheckCircle size={10} className="text-green-600" /> :
                    m.status === 'warn' ? <AlertTriangle size={10} className="text-amber-600" /> :
                      <XCircle size={10} className="text-red-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-gray-700">{m.name}</span>
                    <span className={clsx('text-[10px] font-semibold', m.confidence >= 90 ? 'text-green-600' : m.confidence >= 70 ? 'text-amber-600' : 'text-red-600')}>
                      {m.confidence}%
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{m.note}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
            <div className="flex-1 bg-green-50 rounded-lg p-2 text-center">
              <div className="text-base font-bold text-green-700">4</div>
              <div className="text-[10px] text-green-600">通过</div>
            </div>
            <div className="flex-1 bg-amber-50 rounded-lg p-2 text-center">
              <div className="text-base font-bold text-amber-700">1</div>
              <div className="text-[10px] text-amber-600">警告</div>
            </div>
            <div className="flex-1 bg-red-50 rounded-lg p-2 text-center">
              <div className="text-base font-bold text-red-700">1</div>
              <div className="text-[10px] text-red-600">不通过</div>
            </div>
          </div>
        </SectionCard>

        {/* Approval flow */}
        <SectionCard title="审批流程进度">
          <div className="flex items-center gap-0">
            {flowSteps.map((step, i) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center">
                  <div className={clsx(
                    'w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold',
                    i < 2 ? 'bg-sky-500 text-white' : i === 2 ? 'bg-sky-200 text-sky-700 ring-2 ring-sky-400 ring-offset-1' : 'bg-gray-100 text-gray-400'
                  )}>{i + 1}</div>
                  <div className={clsx('text-[9px] mt-1 text-center w-10', i < 3 ? 'text-sky-700 font-medium' : 'text-gray-400')}>{step}</div>
                </div>
                {i < flowSteps.length - 1 && (
                  <div className={clsx('flex-1 h-px mb-4', i < 2 ? 'bg-sky-400' : 'bg-gray-200')} />
                )}
              </React.Fragment>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Right: chat */}
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-sky-50 to-white">
          <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
            <Bot size={16} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-800">AI智能审批助手</div>
            <div className="flex items-center gap-1 text-[10px] text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              在线 · 已处理 1,284 件审批
            </div>
          </div>
          <div className="ml-auto flex gap-2">
            <button className="text-[10px] text-sky-600 border border-sky-200 rounded-lg px-2.5 py-1 hover:bg-sky-50 transition-colors">
              查看审批规则
            </button>
            <button className="text-[10px] text-gray-500 border border-gray-200 rounded-lg px-2.5 py-1 hover:bg-gray-50 transition-colors">
              导出记录
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={clsx('flex gap-2', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}>
              {msg.role === 'ai' && (
                <div className="w-7 h-7 bg-sky-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <Bot size={13} className="text-white" />
                </div>
              )}
              <div className={clsx('max-w-[72%] rounded-2xl px-4 py-2.5', msg.role === 'ai' ? 'bg-gray-50 text-gray-800' : 'bg-sky-500 text-white')}>
                <p className="text-xs whitespace-pre-line leading-relaxed">{msg.content}</p>
                <p className={clsx('text-[10px] mt-1', msg.role === 'ai' ? 'text-gray-400' : 'text-sky-200')}>{msg.ts}</p>
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex gap-2">
              <div className="w-7 h-7 bg-sky-500 rounded-full flex items-center justify-center shrink-0">
                <Bot size={13} className="text-white" />
              </div>
              <div className="bg-gray-50 rounded-2xl px-4 py-3 flex gap-1 items-center">
                {[0, 1, 2].map(i => (
                  <span key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick replies */}
        <div className="px-4 py-2 border-t border-gray-100 flex gap-2 flex-wrap">
          {AI_QUICK_REPLIES.map((q, i) => (
            <button
              key={i}
              onClick={() => sendMsg(q)}
              className="text-[10px] text-sky-600 border border-sky-200 rounded-full px-3 py-1 hover:bg-sky-50 transition-colors whitespace-nowrap"
            >
              {q}
            </button>
          ))}
        </div>

        <div className="p-3 border-t border-gray-100">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMsg()}
              placeholder="输入问题或审批相关指令…"
              className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent"
            />
            <button
              onClick={() => sendMsg()}
              disabled={!input.trim()}
              className="w-9 h-9 bg-sky-500 hover:bg-sky-600 disabled:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
            >
              <Send size={14} className={input.trim() ? 'text-white' : 'text-gray-400'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────
// 2. AI风险预警中心
// ──────────────────────────────────────────────
const riskAlerts = [
  { id: 'R001', level: 'critical', type: '超速超载', target: '粤A·88888（刘某）', location: '广州绕城高速K23', time: '2分钟前', desc: '连续3次超速120%，GPS轨迹异常', handled: false, pushed: true },
  { id: 'R002', level: 'high', type: '驾驶员疲劳', target: '粤B·55678（张某）', location: '京港澳高速K157', time: '8分钟前', desc: '连续驾驶4.2小时未停车休息', handled: false, pushed: true },
  { id: 'R003', level: 'high', type: '证件即将到期', target: '广州快运集团（30辆）', location: '—', time: '15分钟前', desc: '30辆车辆行驶证将于7日内到期', handled: false, pushed: false },
  { id: 'R004', level: 'medium', type: '轨迹偏离', target: '粤C·22456（王某）', location: '国道G107 K88', time: '22分钟前', desc: '实际行驶路线偏离申报路线2.1km', handled: true, pushed: true },
  { id: 'R005', level: 'medium', type: '安全评分下降', target: '迅捷物流（李某）', location: '—', time: '35分钟前', desc: '近30日安全评分从82降至67', handled: false, pushed: false },
  { id: 'R006', level: 'low', type: '维保到期提醒', target: '顺达车队（8辆）', location: '—', time: '1小时前', desc: '8辆车例行维保超期未处理', handled: true, pushed: false },
]

const riskTrendData = [
  { h: '00:00', critical: 1, high: 3, medium: 5 },
  { h: '02:00', critical: 0, high: 2, medium: 4 },
  { h: '04:00', critical: 0, high: 1, medium: 3 },
  { h: '06:00', critical: 2, high: 4, medium: 7 },
  { h: '08:00', critical: 3, high: 6, medium: 9 },
  { h: '10:00', critical: 2, high: 5, medium: 8 },
  { h: '12:00', critical: 1, high: 4, medium: 6 },
  { h: '14:00', critical: 4, high: 7, medium: 10 },
  { h: '16:00', critical: 3, high: 5, medium: 8 },
  { h: '18:00', critical: 5, high: 8, medium: 11 },
  { h: '20:00', critical: 2, high: 6, medium: 7 },
  { h: '22:00', critical: 1, high: 3, medium: 5 },
]

const riskCategoryData = [
  { name: '超速超载', value: 34, color: '#ef4444' },
  { name: '疲劳驾驶', value: 22, color: '#f97316' },
  { name: '证件到期', value: 18, color: '#eab308' },
  { name: '轨迹偏离', value: 15, color: '#3b82f6' },
  { name: '其他', value: 11, color: '#9ca3af' },
]

function RiskWarningCenter() {
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all')
  const [pushEnabled, setPushEnabled] = useState(true)

  const levelConfig: Record<string, { label: string; cls: string; dotCls: string }> = {
    critical: { label: '紧急', cls: 'bg-red-50 text-red-700 border border-red-200', dotCls: 'bg-red-500' },
    high: { label: '高风险', cls: 'bg-orange-50 text-orange-700 border border-orange-200', dotCls: 'bg-orange-500' },
    medium: { label: '中风险', cls: 'bg-amber-50 text-amber-700 border border-amber-200', dotCls: 'bg-amber-400' },
    low: { label: '低风险', cls: 'bg-blue-50 text-blue-700 border border-blue-200', dotCls: 'bg-blue-400' },
  }

  const filtered = filter === 'all' ? riskAlerts : riskAlerts.filter(a => a.level === filter)

  const counts = { critical: 1, high: 2, medium: 2, low: 1 }

  return (
    <div className="flex gap-4 h-full">
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { level: 'critical', label: '紧急预警', count: 1, icon: <AlertTriangle size={16} />, bg: 'bg-red-50', text: 'text-red-700', iconBg: 'bg-red-100' },
            { level: 'high', label: '高风险', count: 2, icon: <Shield size={16} />, bg: 'bg-orange-50', text: 'text-orange-700', iconBg: 'bg-orange-100' },
            { level: 'medium', label: '中风险', count: 2, icon: <Eye size={16} />, bg: 'bg-amber-50', text: 'text-amber-700', iconBg: 'bg-amber-100' },
            { level: 'low', label: '待处理合计', count: 4, icon: <Bell size={16} />, bg: 'bg-blue-50', text: 'text-blue-700', iconBg: 'bg-blue-100' },
          ].map(s => (
            <div key={s.level} className={clsx('rounded-xl p-4', s.bg)}>
              <div className="flex items-center justify-between mb-2">
                <span className={clsx('text-xs font-medium', s.text)}>{s.label}</span>
                <div className={clsx('w-7 h-7 rounded-lg flex items-center justify-center', s.iconBg)}>
                  <span className={s.text}>{s.icon}</span>
                </div>
              </div>
              <div className={clsx('text-2xl font-bold', s.text)}>{s.count}</div>
              <div className={clsx('text-[10px] mt-1', s.text)}>今日新增</div>
            </div>
          ))}
        </div>

        {/* Trend chart */}
        <SectionCard title="24小时预警趋势" extra={<AIChip label="实时监控" />}>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={riskTrendData}>
                <defs>
                  <linearGradient id="critical" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="high" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="h" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="critical" stroke="#ef4444" fill="url(#critical)" name="紧急" strokeWidth={2} />
                <Area type="monotone" dataKey="high" stroke="#f97316" fill="url(#high)" name="高风险" strokeWidth={2} />
                <Area type="monotone" dataKey="medium" stroke="#eab308" fill="none" name="中风险" strokeWidth={2} strokeDasharray="4 2" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        {/* Alert list */}
        <SectionCard
          title="预警事件列表"
          extra={
            <div className="flex gap-1">
              {(['all', 'critical', 'high', 'medium', 'low'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={clsx(
                    'text-[10px] px-2 py-0.5 rounded-full border transition-colors',
                    filter === f ? 'bg-sky-500 text-white border-sky-500' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                  )}
                >
                  {f === 'all' ? '全部' : levelConfig[f].label}
                </button>
              ))}
            </div>
          }
        >
          <div className="space-y-2">
            {filtered.map(alert => (
              <div
                key={alert.id}
                className={clsx('rounded-lg p-3 border transition-all', alert.handled ? 'opacity-50 bg-gray-50 border-gray-100' : 'bg-white border-gray-200 hover:border-sky-200 hover:shadow-sm')}
              >
                <div className="flex items-start gap-3">
                  <div className={clsx('w-2 h-2 rounded-full mt-1.5 shrink-0', levelConfig[alert.level].dotCls,
                    !alert.handled && alert.level === 'critical' ? 'animate-pulse' : ''
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={clsx('text-[10px] px-2 py-0.5 rounded-full font-medium', levelConfig[alert.level].cls)}>
                        {levelConfig[alert.level].label}
                      </span>
                      <span className="text-xs font-semibold text-gray-800">{alert.type}</span>
                      <span className="text-[10px] text-gray-400 ml-auto shrink-0">{alert.time}</span>
                    </div>
                    <div className="text-[11px] text-gray-600 font-medium">{alert.target}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{alert.desc}</div>
                    {alert.location !== '—' && (
                      <div className="text-[10px] text-sky-600 mt-0.5">位置: {alert.location}</div>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {!alert.handled && (
                      <button className="text-[10px] bg-sky-500 text-white rounded-lg px-2.5 py-1 hover:bg-sky-600 transition-colors">处理</button>
                    )}
                    {alert.handled && (
                      <span className="text-[10px] text-green-600 flex items-center gap-1"><CheckCircle size={10} /> 已处理</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Right sidebar */}
      <div className="w-64 flex flex-col gap-4 shrink-0">
        <SectionCard title="风险分布" extra={<AIChip label="AI分析" />}>
          <div className="flex justify-center mb-3">
            <div className="w-32 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskCategoryData} cx="50%" cy="50%" innerRadius={32} outerRadius={56} dataKey="value" paddingAngle={2}>
                    {riskCategoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-1.5">
            {riskCategoryData.map(d => (
              <div key={d.name} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-[11px] text-gray-600 flex-1">{d.name}</span>
                <span className="text-[11px] font-semibold text-gray-800">{d.value}%</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="预警推送配置">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">实时推送</span>
              <button
                onClick={() => setPushEnabled(!pushEnabled)}
                className={clsx('w-9 h-5 rounded-full transition-colors relative', pushEnabled ? 'bg-green-500' : 'bg-gray-300')}
              >
                <span className={clsx('absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform', pushEnabled ? 'translate-x-4' : 'translate-x-0.5')} />
              </button>
            </div>
            {[
              { label: '短信通知', enabled: true },
              { label: '邮件通知', enabled: false },
              { label: '系统弹窗', enabled: true },
              { label: '微信推送', enabled: true },
            ].map(c => (
              <div key={c.label} className="flex items-center justify-between">
                <span className="text-[11px] text-gray-500">{c.label}</span>
                <div className={clsx('text-[10px] px-2 py-0.5 rounded-full', c.enabled ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400')}>
                  {c.enabled ? '已开启' : '已关闭'}
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-medium rounded-lg transition-colors">
            配置推送规则
          </button>
        </SectionCard>

        <SectionCard title="AI风险预判">
          <div className="space-y-2 text-[11px]">
            <div className="bg-red-50 rounded-lg p-2.5 border border-red-100">
              <div className="font-semibold text-red-700 mb-1">高概率风险</div>
              <div className="text-red-600">今日17:00-19:00高峰期，预计紧急预警+40%</div>
            </div>
            <div className="bg-amber-50 rounded-lg p-2.5 border border-amber-100">
              <div className="font-semibold text-amber-700 mb-1">需关注</div>
              <div className="text-amber-600">广州绕城G15路段近期超速高发，建议加强巡查</div>
            </div>
            <div className="bg-sky-50 rounded-lg p-2.5 border border-sky-100">
              <div className="font-semibold text-sky-700 mb-1">AI建议</div>
              <div className="text-sky-600">可启用自动拦截规则：连续超速2次触发强制停运</div>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────
// 3. AI知识问答
// ──────────────────────────────────────────────
const lawCategories = ['全部', '货运许可', '危险品运输', '道路客运', '驾驶员管理', '行政处罚', '国际运输']

const hotQuestions = [
  '道路危险货物运输许可证有效期是多久？',
  '驾驶员从业资格证被吊销后可以重新申请吗？',
  '货运车辆年检不合格如何处理？',
  '外商投资道路运输企业有哪些限制条件？',
  '道路客运班线经营许可申请需要几个工作日？',
  '超载处罚标准是什么？',
]

const qaHistory: ChatMsg[] = [
  { role: 'ai', content: '欢迎使用AI法规知识问答系统！我已收录道路运输相关法规 286 部，可为您精准解答许可申请、行政处罚、经营资质等问题。', ts: '09:00' },
  { role: 'user', content: '道路危险货物运输许可证有效期是多久？', ts: '09:01' },
  { role: 'ai', content: '根据《道路危险货物运输管理规定》（交通运输部令2016年第36号）第二十三条：\n\n道路危险货物运输许可证有效期为**3年**。\n\n许可证到期前30日，经营者应当向原许可机关申请换发许可证。逾期未申请换证的，不得继续从事道路危险货物运输经营。\n\n法规来源：《道路危险货物运输管理规定》第二十三条\n适用地区：全国统一执行', ts: '09:01' },
]

const QA_ANSWERS: Record<string, string> = {
  '驾驶员从业资格证被吊销后可以重新申请吗？': '根据《道路运输从业人员管理规定》第四十七条：\n\n从业资格证被吊销的人员，自吊销之日起**3年内**不得重新申请同类从业资格证。\n\n3年期满后，可按照正常程序重新报名参加考试，通过后方可申请补发。\n\n注意：若因犯罪被吊销，则终身不得重新申请。\n\n法规来源：《道路运输从业人员管理规定》第四十七条',
  '货运车辆年检不合格如何处理？': '根据《道路货物运输及站场管理规定》，货运车辆年检不合格处理流程：\n\n① 对不合格项目进行维修整改（期限通常为30日内）\n② 整改完成后重新申请年检复检\n③ 复检仍不合格的，暂停该车辆营运资格\n④ 6个月内无法通过年检的，吊销该车辆营运证\n\n期间不得继续从事营运活动，违者按无证经营处罚。\n\n法规来源：《道路货物运输及站场管理规定》第三十六条',
}

function KnowledgeQA() {
  const [category, setCategory] = useState('全部')
  const [messages, setMessages] = useState<ChatMsg[]>(qaHistory)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const sendMsg = (text?: string) => {
    const q = text ?? input.trim()
    if (!q) return
    const ts = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    setMessages(prev => [...prev, { role: 'user', content: q, ts }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      const answer = QA_ANSWERS[q] ?? '根据相关法规规定，该问题涉及多项条款。AI正在检索最新法规库……建议您参阅《道路运输条例》及各专项管理规定，或联系业务窗口获取权威解答。\n\n法规来源：《道路运输条例》（国务院令第406号）'
      setMessages(prev => [...prev, { role: 'ai', content: answer, ts: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) }])
      setTyping(false)
    }, 1400)
  }

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, typing])

  return (
    <div className="flex gap-4 h-full">
      {/* Left sidebar */}
      <div className="w-60 flex flex-col gap-4 shrink-0">
        <SectionCard title="知识库统计">
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: '法规总数', value: '286', unit: '部' },
              { label: '条款总数', value: '14,820', unit: '条' },
              { label: '问答记录', value: '38,642', unit: '次' },
              { label: '准确率', value: '97.3', unit: '%' },
            ].map(s => (
              <div key={s.label} className="bg-gray-50 rounded-lg p-2.5 text-center">
                <div className="text-sm font-bold text-sky-700">{s.value}<span className="text-[10px] font-normal text-gray-400">{s.unit}</span></div>
                <div className="text-[10px] text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="法规分类">
          <div className="space-y-1">
            {lawCategories.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={clsx(
                  'w-full text-left text-xs px-3 py-1.5 rounded-lg transition-colors',
                  category === c ? 'bg-sky-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="热门问题">
          <div className="space-y-1.5">
            {hotQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => sendMsg(q)}
                className="w-full text-left flex items-start gap-2 hover:bg-sky-50 rounded-lg p-1.5 transition-colors group"
              >
                <span className="text-[10px] text-gray-400 mt-0.5 shrink-0">#{i + 1}</span>
                <span className="text-[10px] text-gray-600 group-hover:text-sky-700 leading-relaxed">{q}</span>
              </button>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-white">
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
            <BookOpen size={16} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-800">AI法规知识问答</div>
            <div className="flex items-center gap-1 text-[10px] text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              已收录 286 部法规 · 14,820 条款
            </div>
          </div>
          <div className="ml-auto">
            <button className="text-[10px] text-emerald-600 border border-emerald-200 rounded-lg px-2.5 py-1 hover:bg-emerald-50 transition-colors">
              查看法规全文
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={clsx('flex gap-2', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}>
              {msg.role === 'ai' && (
                <div className="w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <BookOpen size={12} className="text-white" />
                </div>
              )}
              <div className={clsx('max-w-[75%] rounded-2xl px-4 py-2.5', msg.role === 'ai' ? 'bg-gray-50 text-gray-800' : 'bg-emerald-500 text-white')}>
                <p className="text-xs whitespace-pre-line leading-relaxed">{msg.content}</p>
                <div className={clsx('flex items-center gap-2 mt-1.5', msg.role === 'ai' ? 'text-gray-400' : 'text-emerald-200')}>
                  <span className="text-[10px]">{msg.ts}</span>
                  {msg.role === 'ai' && (
                    <div className="flex gap-1 ml-auto">
                      <button className="hover:text-emerald-600 transition-colors"><ThumbsUp size={10} /></button>
                      <button className="hover:text-red-400 transition-colors"><ThumbsDown size={10} /></button>
                      <button className="hover:text-sky-500 transition-colors"><Copy size={10} /></button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex gap-2">
              <div className="w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
                <BookOpen size={12} className="text-white" />
              </div>
              <div className="bg-gray-50 rounded-2xl px-4 py-3 flex gap-1 items-center">
                {[0, 1, 2].map(i => (
                  <span key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="p-3 border-t border-gray-100">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMsg()}
              placeholder="输入法规问题，AI为您精准解答…"
              className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent"
            />
            <button
              onClick={() => sendMsg()}
              disabled={!input.trim()}
              className="w-9 h-9 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
            >
              <Send size={14} className={input.trim() ? 'text-white' : 'text-gray-400'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────
// 4. AI辅助决策分析
// ──────────────────────────────────────────────
const industryTrendData = [
  { month: '1月', freight: 8420, passenger: 3210, revenue: 5200 },
  { month: '2月', freight: 7800, passenger: 2980, revenue: 4800 },
  { month: '3月', freight: 9100, passenger: 3540, revenue: 5700 },
  { month: '4月', freight: 9850, passenger: 3890, revenue: 6100 },
  { month: '5月', freight: 10200, passenger: 4120, revenue: 6450 },
  { month: '6月', freight: 11350, passenger: 4560, revenue: 7200 },
]

const forecastData = [
  { month: '7月', freight: 11800, passenger: 4700, revenue: 7500, forecast: true },
  { month: '8月', freight: 12200, passenger: 4900, revenue: 7800, forecast: true },
  { month: '9月', freight: 11500, passenger: 4600, revenue: 7300, forecast: true },
]

const decisionReports = [
  { title: '2024年H1道路运输行业运行分析报告', date: '2024-06-30', status: 'ready', pages: 28 },
  { title: '危险品运输安全态势评估报告', date: '2024-06-28', status: 'ready', pages: 15 },
  { title: '驾驶员队伍结构优化建议报告', date: '2024-06-25', status: 'generating', pages: 22 },
  { title: '货运市场价格指数分析报告', date: '2024-06-20', status: 'ready', pages: 11 },
]

const aiInsights = [
  { type: 'trend', icon: <TrendingUp size={14} />, color: 'text-green-600 bg-green-50', title: '增长预测', content: '7-9月货运量预计同比增长12.3%，建议提前部署审批窗口扩容方案' },
  { type: 'risk', icon: <AlertTriangle size={14} />, color: 'text-amber-600 bg-amber-50', title: '风险预警', content: '危险品运输许可证到期量Q3将达峰值，预计集中续期申请增加37%' },
  { type: 'opportunity', icon: <Sparkles size={14} />, color: 'text-sky-600 bg-sky-50', title: '政策建议', content: '建议Q3启动驾培机构年度评级，可结合AI评分系统实现自动化评定' },
  { type: 'efficiency', icon: <Zap size={14} />, color: 'text-purple-600 bg-purple-50', title: '效率优化', content: '当前审批平均耗时5.2天，引入AI预审后预计可缩短至2.8天' },
]

function DecisionAnalysis() {
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleGenerate = () => {
    setGenerating(true)
    setProgress(0)
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(timer); setGenerating(false); return 100 }
        return p + 8
      })
    }, 200)
  }

  const allData = [...industryTrendData, ...forecastData]

  return (
    <div className="flex gap-4 h-full">
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {/* AI Insights */}
        <div className="grid grid-cols-2 gap-3">
          {aiInsights.map((insight, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={clsx('w-7 h-7 rounded-lg flex items-center justify-center', insight.color.split(' ')[1])}>
                  <span className={insight.color.split(' ')[0]}>{insight.icon}</span>
                </div>
                <span className="text-xs font-semibold text-gray-800">{insight.title}</span>
                <AIChip label="AI洞察" />
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed">{insight.content}</p>
            </div>
          ))}
        </div>

        {/* Trend + Forecast */}
        <SectionCard
          title="行业运行趋势 & AI预测（7-9月）"
          extra={
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[10px] text-gray-400">
                <span className="w-6 h-px bg-gray-300 inline-block" /> 实际
              </span>
              <span className="flex items-center gap-1 text-[10px] text-sky-500">
                <span className="w-6 h-px border-t-2 border-dashed border-sky-400 inline-block" /> 预测
              </span>
            </div>
          }
        >
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={allData}>
                <defs>
                  <linearGradient id="freightGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="freight" stroke="#0ea5e9" fill="url(#freightGrad)" strokeWidth={2} name="货运量(万吨)" />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="url(#revenueGrad)" strokeWidth={2} name="收入(万元)" strokeDasharray="5 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        {/* Report generation */}
        <SectionCard title="AI决策报告生成" extra={<AIChip label="智能生成" />}>
          <div className="mb-4 grid grid-cols-3 gap-3">
            {['行业运行分析报告', '安全态势评估报告', '政策执行效果报告'].map((t, i) => (
              <button
                key={i}
                onClick={handleGenerate}
                className="border-2 border-dashed border-gray-200 hover:border-sky-300 rounded-xl p-3 text-center transition-all group hover:bg-sky-50"
              >
                <FileText size={18} className="text-gray-400 group-hover:text-sky-500 mx-auto mb-1.5 transition-colors" />
                <div className="text-[11px] text-gray-600 group-hover:text-sky-700">{t}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">点击生成</div>
              </button>
            ))}
          </div>

          {generating && (
            <div className="mb-4 bg-sky-50 rounded-lg p-3 border border-sky-100">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-sky-700 font-medium">AI正在生成报告…</span>
                <span className="text-xs font-bold text-sky-700">{Math.min(progress, 100)}%</span>
              </div>
              <div className="w-full bg-sky-100 rounded-full h-1.5">
                <div className="bg-sky-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          <div className="space-y-2">
            {decisionReports.map((r, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors bg-gray-50">
                <FileText size={14} className="text-sky-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-700 truncate">{r.title}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{r.date} · {r.pages}页</div>
                </div>
                {r.status === 'ready' ? (
                  <button className="flex items-center gap-1 text-[10px] text-sky-600 hover:text-sky-700 shrink-0">
                    <Download size={12} /> 下载
                  </button>
                ) : (
                  <span className="text-[10px] text-amber-600 flex items-center gap-1">
                    <RefreshCw size={10} className="animate-spin" /> 生成中
                  </span>
                )}
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Right: KPI panel */}
      <div className="w-64 flex flex-col gap-4 shrink-0">
        <SectionCard title="核心指标 vs 目标">
          <div className="space-y-3">
            {[
              { label: '货运量完成率', value: 94.2, target: 100, color: 'bg-sky-500' },
              { label: '许可证审批及时率', value: 98.7, target: 95, color: 'bg-green-500', exceed: true },
              { label: '安全事故下降率', value: 12.4, target: 15, color: 'bg-amber-500' },
              { label: '数字化服务覆盖', value: 87.3, target: 90, color: 'bg-purple-500' },
            ].map(k => (
              <div key={k.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-gray-600">{k.label}</span>
                  <span className={clsx('text-[11px] font-semibold', k.exceed ? 'text-green-600' : k.value / k.target >= 0.9 ? 'text-sky-600' : 'text-amber-600')}>
                    {k.value}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className={clsx('h-1.5 rounded-full transition-all', k.color)} style={{ width: `${Math.min(k.value, 100)}%` }} />
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">目标 {k.target}%</div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="月度预警摘要">
          <div className="space-y-2">
            {[
              { label: '证件到期预警', count: 127, trend: 'up', delta: '+15' },
              { label: '超期未年检车辆', count: 43, trend: 'down', delta: '-8' },
              { label: '违规操作记录', count: 18, trend: 'down', delta: '-3' },
              { label: '待整改问题', count: 56, trend: 'up', delta: '+9' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                <div className="flex-1">
                  <div className="text-[11px] text-gray-600">{s.label}</div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-gray-800">{s.count}</span>
                  <span className={clsx('text-[10px] flex items-center', s.trend === 'up' ? 'text-red-500' : 'text-green-500')}>
                    {s.trend === 'up' ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                    {s.delta}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="智能推荐行动">
          <div className="space-y-2">
            {[
              { priority: 1, action: '启动Q3证件批量续期专项行动', urgency: '高' },
              { priority: 2, action: '对43辆超期未年检车辆发送督办通知', urgency: '高' },
              { priority: 3, action: '优化危险品许可审批表单简化材料', urgency: '中' },
            ].map(a => (
              <div key={a.priority} className="flex gap-2 p-2 rounded-lg border border-gray-100">
                <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 text-[10px] font-bold flex items-center justify-center shrink-0">{a.priority}</span>
                <div className="flex-1">
                  <div className="text-[11px] text-gray-700">{a.action}</div>
                  <span className={clsx('text-[10px]', a.urgency === '高' ? 'text-red-500' : 'text-amber-500')}>优先级：{a.urgency}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────
// 5. AI能力监控平台
// ──────────────────────────────────────────────
const aiModels = [
  { name: 'OCR材料识别模型', version: 'v2.4.1', accuracy: 97.3, calls: 48620, latency: 280, status: 'running', category: '文字识别', updateDate: '2024-06-15' },
  { name: '人脸识别引擎', version: 'v3.1.0', accuracy: 99.1, calls: 32410, latency: 150, status: 'running', category: '图像识别', updateDate: '2024-06-20' },
  { name: '风险预警预测模型', version: 'v1.8.2', accuracy: 91.5, calls: 18240, latency: 420, status: 'running', category: '预测分析', updateDate: '2024-06-10' },
  { name: '法规语义理解模型', version: 'v2.0.0', accuracy: 94.8, calls: 23180, latency: 380, status: 'running', category: 'NLP', updateDate: '2024-05-28' },
  { name: '审批决策辅助模型', version: 'v1.5.3', accuracy: 88.2, calls: 9840, latency: 560, status: 'updating', category: '决策支持', updateDate: '2024-06-25' },
  { name: '车牌自动识别模型', version: 'v4.0.1', accuracy: 99.6, calls: 125680, latency: 85, status: 'running', category: '图像识别', updateDate: '2024-06-22' },
]

const apiCallData = [
  { day: '周一', ocr: 6820, face: 4310, risk: 2240, nlp: 3180 },
  { day: '周二', ocr: 7240, face: 4890, risk: 2640, nlp: 3490 },
  { day: '周三', ocr: 6980, face: 4560, risk: 2380, nlp: 3210 },
  { day: '周四', ocr: 7800, face: 5120, risk: 2890, nlp: 3870 },
  { day: '周五', ocr: 8400, face: 5680, risk: 3140, nlp: 4210 },
  { day: '周六', ocr: 5240, face: 3440, risk: 1820, nlp: 2460 },
  { day: '周日', ocr: 4860, face: 3020, risk: 1560, nlp: 2180 },
]

function AIMonitorPlatform() {
  const [selectedModel, setSelectedModel] = useState(aiModels[0])

  return (
    <div className="flex gap-4 h-full">
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {/* Model grid */}
        <div className="grid grid-cols-3 gap-3">
          {aiModels.map(m => (
            <button
              key={m.name}
              onClick={() => setSelectedModel(m)}
              className={clsx(
                'text-left rounded-xl border p-3 transition-all',
                selectedModel.name === m.name ? 'border-sky-400 bg-sky-50 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={clsx(
                  'text-[10px] px-2 py-0.5 rounded-full font-medium',
                  m.status === 'running' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                )}>
                  {m.status === 'running' ? '运行中' : '更新中'}
                </span>
                <span className="text-[10px] text-gray-400">{m.version}</span>
              </div>
              <div className="text-xs font-semibold text-gray-800 mb-1 leading-tight">{m.name}</div>
              <div className="text-[10px] text-sky-600 mb-2">{m.category}</div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-base font-bold text-gray-800">{m.accuracy}%</div>
                  <div className="text-[9px] text-gray-400">准确率</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-700">{m.latency}ms</div>
                  <div className="text-[9px] text-gray-400">平均延迟</div>
                </div>
              </div>
              <div className="mt-2 w-full bg-gray-100 rounded-full h-1">
                <div
                  className={clsx('h-1 rounded-full', m.accuracy >= 95 ? 'bg-green-500' : m.accuracy >= 90 ? 'bg-sky-500' : 'bg-amber-500')}
                  style={{ width: `${m.accuracy}%` }}
                />
              </div>
            </button>
          ))}
        </div>

        {/* API call trend */}
        <SectionCard title="本周API调用量趋势" extra={<AIChip label="实时监控" />}>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={apiCallData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 11 }} />
                <Bar dataKey="ocr" stackId="a" fill="#0ea5e9" name="OCR识别" />
                <Bar dataKey="face" stackId="a" fill="#10b981" name="人脸识别" />
                <Bar dataKey="risk" stackId="a" fill="#f59e0b" name="风险预警" />
                <Bar dataKey="nlp" stackId="a" fill="#8b5cf6" name="语义理解" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Right: Model detail + API status */}
      <div className="w-72 flex flex-col gap-4 shrink-0">
        <SectionCard title="模型详情" extra={<span className="text-[10px] text-gray-400">{selectedModel.version}</span>}>
          <div className="space-y-2">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm font-semibold text-gray-800 mb-1">{selectedModel.name}</div>
              <div className="text-[10px] text-sky-600">{selectedModel.category} · 更新于 {selectedModel.updateDate}</div>
            </div>
            {[
              { label: '准确率', value: `${selectedModel.accuracy}%`, good: selectedModel.accuracy >= 90 },
              { label: '平均延迟', value: `${selectedModel.latency}ms`, good: selectedModel.latency <= 400 },
              { label: '今日调用', value: selectedModel.calls.toLocaleString(), good: true },
              { label: '运行状态', value: selectedModel.status === 'running' ? '正常运行' : '更新中', good: selectedModel.status === 'running' },
            ].map(d => (
              <div key={d.label} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                <span className="text-[11px] text-gray-500">{d.label}</span>
                <span className={clsx('text-[11px] font-semibold', d.good ? 'text-green-600' : 'text-amber-600')}>{d.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <button className="flex-1 py-1.5 text-[11px] bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors">评估报告</button>
            <button className="flex-1 py-1.5 text-[11px] bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">重新训练</button>
          </div>
        </SectionCard>

        <SectionCard title="API服务状态">
          <div className="space-y-2">
            {[
              { name: 'OCR识别接口', endpoint: '/api/v1/ocr', status: 'up', uptime: '99.98%', calls: '48.6K' },
              { name: '人脸识别接口', endpoint: '/api/v1/face', status: 'up', uptime: '99.95%', calls: '32.4K' },
              { name: '风险预警接口', endpoint: '/api/v1/risk', status: 'up', uptime: '99.87%', calls: '18.2K' },
              { name: '知识问答接口', endpoint: '/api/v1/qa', status: 'up', uptime: '99.92%', calls: '23.2K' },
              { name: '审批决策接口', endpoint: '/api/v1/approve', status: 'degraded', uptime: '97.4%', calls: '9.8K' },
            ].map(api => (
              <div key={api.name} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                <div className={clsx('w-1.5 h-1.5 rounded-full shrink-0', api.status === 'up' ? 'bg-green-500' : 'bg-amber-500', api.status === 'up' ? 'animate-pulse' : '')
                } />
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-medium text-gray-700 truncate">{api.name}</div>
                  <div className="text-[9px] text-gray-400 truncate">{api.endpoint}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] font-semibold text-gray-700">{api.uptime}</div>
                  <div className="text-[9px] text-gray-400">{api.calls}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="资源使用率">
          {[
            { label: 'CPU使用率', value: 67, color: 'bg-sky-500', warn: false },
            { label: 'GPU使用率', value: 84, color: 'bg-purple-500', warn: true },
            { label: '内存使用率', value: 72, color: 'bg-green-500', warn: false },
            { label: '模型存储', value: 56, color: 'bg-amber-500', warn: false },
          ].map(r => (
            <div key={r.label} className="mb-2.5 last:mb-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-gray-600">{r.label}</span>
                <span className={clsx('text-[11px] font-semibold', r.warn ? 'text-amber-600' : 'text-gray-700')}>{r.value}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className={clsx('h-1.5 rounded-full', r.color)} style={{ width: `${r.value}%` }} />
              </div>
            </div>
          ))}
        </SectionCard>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────
// Main component
// ──────────────────────────────────────────────
const TABS = [
  { key: 'AI智能审批助手', icon: <Bot size={14} />, label: 'AI智能审批助手' },
  { key: 'AI风险预警中心', icon: <AlertTriangle size={14} />, label: 'AI风险预警中心' },
  { key: 'AI知识问答', icon: <BookOpen size={14} />, label: 'AI知识问答' },
  { key: 'AI辅助决策分析', icon: <BarChart3 size={14} />, label: 'AI辅助决策分析' },
  { key: 'AI能力监控平台', icon: <Activity size={14} />, label: 'AI能力监控平台' },
]

export default function AIServices({ initialTab = 'AI智能审批助手' }: AIServicesProps) {
  const [activeTab, setActiveTab] = useState(initialTab)

  useEffect(() => { setActiveTab(initialTab) }, [initialTab])

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header banner */}
      <div className="bg-gradient-to-r from-sky-600 to-cyan-500 px-6 py-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-sm">AI服务在线平台</div>
            <div className="text-sky-100 text-[11px]">智能审批 · 风险预警 · 知识问答 · 辅助决策 · 模型监控</div>
          </div>
          <div className="ml-auto flex items-center gap-4 text-[11px] text-sky-100">
            <span className="flex items-center gap-1"><Cpu size={12} /> 6个AI模型在线</span>
            <span className="flex items-center gap-1"><Zap size={12} /> 今日调用 258,770次</span>
            <span className="flex items-center gap-1"><Star size={12} /> 综合准确率 95.3%</span>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="bg-white border-b border-gray-200 px-6 shrink-0">
        <div className="flex gap-0">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={clsx(
                'flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 transition-all whitespace-nowrap',
                activeTab === tab.key
                  ? 'border-sky-500 text-sky-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {activeTab === 'AI智能审批助手' && <ApprovalAssistant />}
        {activeTab === 'AI风险预警中心' && <RiskWarningCenter />}
        {activeTab === 'AI知识问答' && <KnowledgeQA />}
        {activeTab === 'AI辅助决策分析' && <DecisionAnalysis />}
        {activeTab === 'AI能力监控平台' && <AIMonitorPlatform />}
      </div>
    </div>
  )
}
