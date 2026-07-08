import React, { useState } from 'react'
import { Plus, Sparkles, FileSearch, CheckCircle, AlertCircle, TrendingUp, Shield, Clock } from 'lucide-react'
import DataTable from '../components/DataTable'
import { FilterBar, Pagination } from '../components/FilterBar'
import Modal, { DetailSection, FieldGrid, FieldItem } from '../components/Modal'
import StatusBadge, { RiskBadge, AIBadge } from '../components/StatusBadge'
import AIPanel from '../components/AIPanel'
import { freightCompanies, applications } from '../data/mockData'

type Tab = '业户档案' | '申请管理' | '车辆风险'

type Company = typeof freightCompanies[0]
type Application = typeof applications[0]

export default function FreightTransport() {
  const [tab, setTab] = useState<Tab>('业户档案')
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [showApply, setShowApply] = useState(false)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('全部')
  const [creditFilter, setCreditFilter] = useState('全部')

  const filteredCompanies = freightCompanies.filter(c => {
    if (statusFilter !== '全部' && c.status !== statusFilter) return false
    if (creditFilter !== '全部' && c.creditLevel !== creditFilter) return false
    return true
  })

  const companyColumns = [
    { key: 'id', title: '业户编号', width: 90 },
    { key: 'name', title: '企业名称', render: (_: any, row: Company) => (
      <div>
        <div className="font-medium text-gray-800 text-sm">{row.name}</div>
        <div className="text-xs text-gray-400">{row.licenseNo}</div>
      </div>
    )},
    { key: 'legalPerson', title: '法人代表' },
    { key: 'businessScope', title: '经营范围', render: (v: string) => (
      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{v}</span>
    )},
    { key: 'vehicles', title: '车辆数', align: 'center' as const },
    { key: 'creditLevel', title: '信用等级', render: (v: string) => (
      <StatusBadge label={v} variant={v === 'AA' ? 'success' : v === 'A' ? 'info' : 'warning'} />
    )},
    { key: 'aiRisk', title: 'AI风险', render: (_: any, row: Company) => (
      <RiskBadge level={row.aiRisk as any} />
    )},
    { key: 'aiScore', title: 'AI综合分', render: (v: number) => (
      <div className="flex items-center gap-1.5">
        <div className="w-16 bg-gray-100 rounded-full h-1.5">
          <div className={`h-1.5 rounded-full ${v >= 80 ? 'bg-emerald-500' : v >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${v}%` }} />
        </div>
        <span className="text-xs font-medium text-gray-700">{v}</span>
      </div>
    )},
    { key: 'status', title: '状态', render: (v: string) => (
      <StatusBadge label={v} variant={v === '正常' ? 'success' : 'warning'} />
    )},
    { key: 'expireDate', title: '有效期至' },
    { key: 'action', title: '操作', render: (_: any, row: Company) => (
      <div className="flex items-center gap-1">
        <button className="text-xs text-gov-500 hover:text-gov-400 px-2 py-1 rounded hover:bg-gov-50" onClick={e => { e.stopPropagation(); setSelectedCompany(row) }}>详情</button>
        <button className="text-xs text-amber-600 hover:text-amber-500 px-2 py-1 rounded hover:bg-amber-50">年审</button>
      </div>
    )},
  ]

  const appColumns = [
    { key: 'id', title: '申请编号', width: 110 },
    { key: 'company', title: '申请企业', render: (v: string) => <span className="font-medium">{v}</span> },
    { key: 'type', title: '申请类型', render: (v: string) => (
      <StatusBadge label={v} variant={v === '新申请' ? 'info' : 'default'} />
    )},
    { key: 'businessScope', title: '经营范围' },
    { key: 'vehicles', title: '拟投入车辆', align: 'center' as const },
    { key: 'submitDate', title: '提交日期' },
    { key: 'aiScore', title: 'AI预审分', render: (v: number) => (
      <span className={`font-semibold text-sm ${v >= 80 ? 'text-emerald-600' : v >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{v}</span>
    )},
    { key: 'aiPreview', title: 'AI预审意见', render: (v: string, row: Application) => (
      <div className="flex items-center gap-1.5">
        <Sparkles size={11} className="text-indigo-400 shrink-0" />
        <span className="text-xs text-gray-600">{v}</span>
      </div>
    )},
    { key: 'stage', title: '当前阶段', render: (v: string) => (
      <span className="text-xs bg-gov-50 text-gov-600 px-2 py-0.5 rounded">{v}</span>
    )},
    { key: 'status', title: '状态', render: (v: string) => (
      <StatusBadge label={v} variant={v === '已批准' ? 'success' : v === '待审查' ? 'info' : 'warning'} />
    )},
  ]

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Page Header */}
      <div className="px-6 py-4 bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-gov-800">道路货物运输管理</h1>
            <p className="text-xs text-gray-500 mt-0.5">第三章 · 货物运输经营许可、业户档案、车辆管理、质量信誉考核</p>
          </div>
          <div className="flex items-center gap-2">
            <AIBadge label="AI预审在线" />
            <button onClick={() => setShowApply(true)} className="btn-primary">
              <Plus size={14} />
              新增许可申请
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex gap-1 mt-4 border-b border-gray-100 -mb-4 -mx-0">
          {(['业户档案', '申请管理', '车辆风险'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                tab === t
                  ? 'border-gov-500 text-gov-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t}
              {t === '申请管理' && (
                <span className="ml-1.5 px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-xs">{applications.filter(a => a.status !== '已批准').length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {tab === '业户档案' && (
          <div className="card">
            <div className="card-header">
              <FilterBar
                searchPlaceholder="搜索企业名称/编号/法人..."
                filters={[
                  { label: '状态', options: [{value:'全部',label:'全部'},{value:'正常',label:'正常'},{value:'警告',label:'警告'}], value: statusFilter, onChange: setStatusFilter },
                  { label: '信用等级', options: [{value:'全部',label:'全部'},{value:'AA',label:'AA'},{value:'A',label:'A'},{value:'B',label:'B'}], value: creditFilter, onChange: setCreditFilter },
                ]}
                onExport={() => {}}
                onRefresh={() => {}}
              />
            </div>
            <DataTable
              columns={companyColumns}
              data={filteredCompanies}
              rowKey="id"
              onRowClick={setSelectedCompany}
            />
            <div className="px-4">
              <Pagination total={filteredCompanies.length} page={page} pageSize={10} onChange={setPage} />
            </div>
          </div>
        )}

        {tab === '申请管理' && (
          <div className="card">
            <div className="card-header">
              <FilterBar
                searchPlaceholder="搜索申请编号/企业..."
                filters={[
                  { label: '状态', options: [{value:'全部',label:'全部'},{value:'待审查',label:'待审查'},{value:'形式审查中',label:'形式审查中'},{value:'已批准',label:'已批准'}], value: '全部', onChange: () => {} },
                ]}
                actions={
                  <button onClick={() => setShowApply(true)} className="btn-primary">
                    <Plus size={13} />AI辅助新申请
                  </button>
                }
              />
            </div>
            <DataTable
              columns={appColumns}
              data={applications}
              rowKey="id"
              onRowClick={setSelectedApp}
            />
          </div>
        )}

        {tab === '车辆风险' && <VehicleRisk />}
      </div>

      {/* Company Detail Modal */}
      <Modal
        open={!!selectedCompany}
        onClose={() => setSelectedCompany(null)}
        title={selectedCompany?.name ?? ''}
        subtitle={`许可证编号：${selectedCompany?.licenseNo} · 货运经营业户档案`}
        width="xl"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setSelectedCompany(null)}>关闭</button>
            <button className="btn-primary"><FileSearch size={13} />AI合规检查</button>
            <button className="btn-primary">年审办理</button>
          </>
        }
      >
        {selectedCompany && (
          <div className="flex gap-5">
            <div className="flex-1 space-y-4">
              <DetailSection title="基本信息">
                <FieldGrid cols={3}>
                  <FieldItem label="业户名称" value={selectedCompany.name} highlight />
                  <FieldItem label="许可证编号" value={selectedCompany.licenseNo} />
                  <FieldItem label="法人代表" value={selectedCompany.legalPerson} />
                  <FieldItem label="联系电话" value={selectedCompany.phone} />
                  <FieldItem label="经营范围" value={selectedCompany.businessScope} />
                  <FieldItem label="在营车辆数" value={`${selectedCompany.vehicles} 辆`} />
                  <FieldItem label="注册地址" value={selectedCompany.address} />
                  <FieldItem label="申请日期" value={selectedCompany.applyDate} />
                  <FieldItem label="有效期至" value={selectedCompany.expireDate} />
                </FieldGrid>
              </DetailSection>

              <DetailSection title="信用与状态">
                <FieldGrid cols={3}>
                  <FieldItem label="质量信誉等级" value={<StatusBadge label={selectedCompany.creditLevel} variant={selectedCompany.creditLevel === 'AA' ? 'success' : 'info'} size="md" />} highlight />
                  <FieldItem label="经营状态" value={<StatusBadge label={selectedCompany.status} variant={selectedCompany.status === '正常' ? 'success' : 'warning'} size="md" />} />
                  <FieldItem label="风险等级" value={<RiskBadge level={selectedCompany.riskLevel as any} />} />
                </FieldGrid>
              </DetailSection>

              <DetailSection title="违章记录" icon={<Shield size={14} className="text-gov-500" />}>
                <div className="bg-emerald-50 border border-emerald-200 rounded-md p-3 text-sm text-emerald-700">
                  近1年内无重大违章记录，良好经营记录
                </div>
              </DetailSection>
            </div>

            {/* AI Panel */}
            <div className="w-64 shrink-0">
              <AIPanel
                title="AI 业户画像分析"
                items={[
                  { label: 'AI综合评分', value: <div className="text-2xl font-bold text-indigo-300">{selectedCompany.aiScore}<span className="text-sm ml-1">分</span></div>, type: selectedCompany.aiScore >= 80 ? 'success' : 'warning' },
                  { label: '风险等级判定', value: `经AI综合评估，该业户${selectedCompany.aiRisk}风险，主要评估维度：信用记录、车辆状况、历史违规`, type: selectedCompany.aiRisk === '低' ? 'success' : selectedCompany.aiRisk === '中' ? 'warning' : 'warning' },
                  { label: '合规建议', value: selectedCompany.status === '警告' ? '⚠ 发现2项违规隐患，建议责令整改，加强监督检查频次' : '✓ 企业合规经营，建议维持现有监管频次', type: selectedCompany.status === '警告' ? 'warning' : 'success' },
                  { label: '年审预提醒', value: `距到期 ${Math.max(0, Math.round((new Date(selectedCompany.expireDate).getTime() - Date.now()) / 86400000))} 天，建议提前60天办理年审`, type: 'info' },
                ]}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Application Detail Modal */}
      <Modal
        open={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title={`申请详情 — ${selectedApp?.company}`}
        subtitle={`申请编号：${selectedApp?.id}`}
        width="xl"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setSelectedApp(null)}>关闭</button>
            <button className="btn-primary"><Sparkles size={13} />AI辅助审查</button>
            <button className="btn-primary"><CheckCircle size={13} />受理</button>
          </>
        }
      >
        {selectedApp && (
          <div className="flex gap-5">
            <div className="flex-1 space-y-4">
              <DetailSection title="申请基本信息">
                <FieldGrid cols={3}>
                  <FieldItem label="申请编号" value={selectedApp.id} />
                  <FieldItem label="申请类型" value={selectedApp.type} />
                  <FieldItem label="申请企业" value={selectedApp.company} highlight />
                  <FieldItem label="法人代表" value={selectedApp.legalPerson} />
                  <FieldItem label="经营范围" value={selectedApp.businessScope} />
                  <FieldItem label="拟投入车辆" value={`${selectedApp.vehicles} 辆`} />
                  <FieldItem label="提交日期" value={selectedApp.submitDate} />
                  <FieldItem label="当前阶段" value={selectedApp.stage} />
                  <FieldItem label="经办人员" value={selectedApp.handler} />
                </FieldGrid>
              </DetailSection>

              <DetailSection title="材料清单">
                <div className="space-y-2">
                  {[
                    { name: '营业执照复印件', status: '已提交', ai: 'OCR识别完成，字段匹配' },
                    { name: '道路运输经营申请表', status: '已提交', ai: 'AI填报，完整性98%' },
                    { name: '车辆行驶证复印件', status: '已提交', ai: 'OCR识别，发现VIN码' },
                    { name: '驾驶员从业资格证', status: '已提交', ai: '校验通过' },
                    { name: '停车场地证明材料', status: '已提交', ai: '面积符合要求' },
                    { name: '法人身份证复印件', status: '已提交', ai: 'OCR识别完成' },
                  ].map((m, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded bg-gray-50 border border-gray-100">
                      <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                      <span className="text-sm text-gray-700 flex-1">{m.name}</span>
                      <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{m.status}</span>
                      <div className="flex items-center gap-1 text-xs text-indigo-500">
                        <Sparkles size={10} />
                        {m.ai}
                      </div>
                    </div>
                  ))}
                </div>
              </DetailSection>

              <DetailSection title="审查进度">
                <div className="flex items-center gap-2">
                  {['提交申请', '形式审查', '实质审查', '许可决定', '证件发放'].map((step, i) => {
                    const stages = ['提交申请', '形式审查', '实质审查', '许可决定', '证件发放']
                    const currentIdx = stages.indexOf(selectedApp.stage)
                    const isDone = i < currentIdx
                    const isCurrent = i === currentIdx
                    return (
                      <React.Fragment key={step}>
                        <div className="flex flex-col items-center gap-1">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${isDone ? 'bg-emerald-500 text-white' : isCurrent ? 'bg-gov-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                            {isDone ? '✓' : i + 1}
                          </div>
                          <span className={`text-[10px] whitespace-nowrap ${isCurrent ? 'text-gov-600 font-semibold' : isDone ? 'text-emerald-600' : 'text-gray-400'}`}>{step}</span>
                        </div>
                        {i < 4 && <div className={`flex-1 h-0.5 ${i < currentIdx ? 'bg-emerald-400' : 'bg-gray-200'}`} />}
                      </React.Fragment>
                    )
                  })}
                </div>
              </DetailSection>
            </div>

            <div className="w-64 shrink-0">
              <AIPanel
                title="AI 审查助手"
                items={[
                  { label: '材料预审评分', value: <div className="text-2xl font-bold text-indigo-300">{selectedApp.aiScore}<span className="text-sm ml-1">/ 100</span></div>, type: selectedApp.aiScore >= 80 ? 'success' : 'warning' },
                  { label: '材料完整性', value: '6/6 份材料已提交，AI-OCR识别率 98.5%', type: 'success' },
                  { label: '合规性分析', value: selectedApp.aiPreview + '。符合《道路运输条例》第22条申请条件。', type: selectedApp.aiScore >= 80 ? 'success' : 'warning' },
                  { label: '风险提示', value: selectedApp.aiRisk === '低' ? '未发现明显风险点，历史无违规记录' : '发现以下风险点：近3年有超载违规记录2次，建议重点核查', type: selectedApp.aiRisk === '低' ? 'success' : 'warning' },
                  { label: '审查建议', value: '综合评估建议：受理并进入实质审查', type: 'info' },
                ]}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Apply Modal */}
      <ApplyModal open={showApply} onClose={() => setShowApply(false)} />
    </div>
  )
}

function VehicleRisk() {
  const [selected, setSelected] = useState<any>(null)
  const risks = [
    { plate: '粤A12345', company: '恒通物流', type: '重型货车', score: 28, level: '低', factors: '良好驾驶记录，车况优', prediction: '0.2%', lastCheck: '2024-06-15' },
    { plate: '粤B23456', company: '快速物流', type: '重型货车', score: 56, level: '中', factors: '里程偏高，近期有超速记录', prediction: '1.8%', lastCheck: '2024-06-14' },
    { plate: '粤D45678', company: '危化品物流', type: '危险品运输车', score: 72, level: '高', factors: '罐体健康度下降，驾驶员近期违规', prediction: '4.5%', lastCheck: '2024-06-13' },
    { plate: '粤F78901', company: '天龙货运', type: '重型货车', score: 45, level: '中', factors: '技术等级下降至二级', prediction: '1.2%', lastCheck: '2024-06-12' },
    { plate: '粤G89012', company: '鑫鹏物流', type: '重型货车', score: 88, level: '极高', factors: '多次超载、驾驶员疲劳驾驶，超速记录5次', prediction: '8.9%', lastCheck: '2024-06-11' },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '低风险', count: 28540, pct: '74.1%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: '中风险', count: 7820, pct: '20.3%', color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: '高风险', count: 1850, pct: '4.8%', color: 'text-red-600', bg: 'bg-red-50' },
          { label: '极高风险', count: 290, pct: '0.8%', color: 'text-red-800', bg: 'bg-red-100' },
        ].map(s => (
          <div key={s.label} className={`card p-4 ${s.bg}`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.count.toLocaleString()}</div>
            <div className="text-sm text-gray-600 mt-1">{s.label}车辆</div>
            <div className={`text-xs ${s.color} mt-1`}>占比 {s.pct}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-header">
          <div className="card-title">高风险车辆清单（AI预测）</div>
          <AIBadge label="模型版本 v2.3" />
        </div>
        <DataTable
          columns={[
            { key: 'plate', title: '车牌号', render: (v: string) => <span className="font-mono font-semibold text-gov-700">{v}</span> },
            { key: 'company', title: '所属公司' },
            { key: 'type', title: '车辆类型' },
            { key: 'score', title: '风险评分', render: (v: number) => (
              <div className="flex items-center gap-2">
                <div className="w-16 bg-gray-100 rounded-full h-2">
                  <div className={`h-2 rounded-full ${v >= 70 ? 'bg-red-500' : v >= 40 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${v}%` }} />
                </div>
                <span className="text-sm font-semibold">{v}</span>
              </div>
            )},
            { key: 'level', title: 'AI风险等级', render: (v: string) => <RiskBadge level={v as any} /> },
            { key: 'factors', title: 'AI风险因素', render: (v: string) => (
              <div className="flex items-center gap-1 text-xs text-gray-600"><Sparkles size={10} className="text-indigo-400 shrink-0" />{v}</div>
            )},
            { key: 'prediction', title: '事故概率预测' },
            { key: 'action', title: '操作', render: (_: any, row: any) => (
              <button onClick={() => setSelected(row)} className="text-xs text-gov-500 hover:text-gov-400 px-2 py-1 rounded hover:bg-gov-50">干预建议</button>
            )},
          ]}
          data={risks}
          rowKey="plate"
          onRowClick={setSelected}
        />
      </div>
      <Modal open={!!selected} onClose={() => setSelected(null)} title={`车辆风险详情 — ${selected?.plate}`} width="md">
        {selected && (
          <AIPanel title="AI 干预建议" items={[
            { label: '风险评分', value: `${selected.score} 分 / 100分，风险等级：${selected.level}`, type: selected.level === '低' ? 'success' : 'warning' },
            { label: '主要风险因素', value: selected.factors, type: 'warning' },
            { label: '事故概率预测', value: `预测未来30天内发生事故概率：${selected.prediction}`, type: 'info' },
            { label: 'AI干预建议', value: selected.level === '极高' ? '立即约谈驾驶员，要求整改超速超载问题；加强重点检查频次至每周一次；建议暂停高风险驾驶员出车资格' : selected.level === '高' ? '安排近期检查；约谈企业负责人；重点核查罐体检测合格证及驾驶员资质' : '纳入重点关注名单，适当增加巡查频次', type: 'warning' },
          ]} />
        )}
      </Modal>
    </div>
  )
}

function ApplyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({ name: '', legalPerson: '', phone: '', address: '', scope: '普通货物运输', vehicles: '' })
  const [aiAnalyzing, setAiAnalyzing] = useState(false)
  const [aiResult, setAiResult] = useState(false)

  const handleAIFill = () => {
    setAiAnalyzing(true)
    setTimeout(() => {
      setAiAnalyzing(false)
      setAiResult(true)
      setFormData({ name: '智远物流运输有限公司', legalPerson: '郑志远', phone: '13812349999', address: '本市开发区物流园C区12号', scope: '普通货物运输', vehicles: '10' })
    }, 1500)
  }

  return (
    <Modal
      open={open}
      onClose={() => { onClose(); setStep(1); setAiResult(false) }}
      title="AI辅助申请 — 道路货物运输经营许可"
      subtitle="通过AI对话完成申请表填写，OCR自动识别证件材料"
      width="xl"
      footer={
        <>
          <button className="btn-secondary" onClick={() => step > 1 ? setStep(s => s - 1) : onClose()}>
            {step > 1 ? '上一步' : '取消'}
          </button>
          {step < 3 ? (
            <button className="btn-primary" onClick={() => setStep(s => s + 1)}>下一步</button>
          ) : (
            <button className="btn-primary" onClick={onClose}><CheckCircle size={13} />提交申请</button>
          )}
        </>
      }
    >
      {/* Steps */}
      <div className="flex items-center gap-2 mb-6">
        {['填写基本信息', '上传申请材料', 'AI预审确认'].map((s, i) => (
          <React.Fragment key={s}>
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step > i + 1 ? 'bg-emerald-500 text-white' : step === i + 1 ? 'bg-gov-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className={`text-sm ${step === i + 1 ? 'text-gov-600 font-medium' : 'text-gray-400'}`}>{s}</span>
            </div>
            {i < 2 && <div className={`flex-1 h-0.5 ${step > i + 1 ? 'bg-emerald-400' : 'bg-gray-200'}`} />}
          </React.Fragment>
        ))}
      </div>

      {step === 1 && (
        <div className="flex gap-5">
          <div className="flex-1 space-y-4">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 flex items-start gap-3">
              <Sparkles size={16} className="text-indigo-500 mt-0.5 shrink-0" />
              <div>
                <div className="text-sm font-medium text-indigo-700">AI填报助手</div>
                <div className="text-xs text-indigo-500 mt-0.5">支持通过对话方式自动填写申请表，或一键识别营业执照自动填入</div>
                <button onClick={handleAIFill} disabled={aiAnalyzing} className="mt-2 text-xs bg-indigo-500 text-white px-3 py-1.5 rounded flex items-center gap-1.5 hover:bg-indigo-600 disabled:opacity-50">
                  <Sparkles size={11} />
                  {aiAnalyzing ? 'AI分析中...' : 'AI一键填报'}
                </button>
              </div>
            </div>

            {aiResult && (
              <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
                <CheckCircle size={14} />
                AI已自动识别营业执照，表单已填写完成
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">企业名称 *</label>
                <input className="form-input" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="请输入企业全称" />
              </div>
              <div>
                <label className="form-label">法定代表人 *</label>
                <input className="form-input" value={formData.legalPerson} onChange={e => setFormData(p => ({ ...p, legalPerson: e.target.value }))} placeholder="法人姓名" />
              </div>
              <div>
                <label className="form-label">联系电话 *</label>
                <input className="form-input" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} placeholder="手机号码" />
              </div>
              <div>
                <label className="form-label">经营范围 *</label>
                <select className="form-select" value={formData.scope} onChange={e => setFormData(p => ({ ...p, scope: e.target.value }))}>
                  <option>普通货物运输</option>
                  <option>大件货物运输</option>
                  <option>冷链货物运输</option>
                  <option>危险货物运输</option>
                </select>
              </div>
              <div>
                <label className="form-label">拟投入车辆数 *</label>
                <input className="form-input" type="number" value={formData.vehicles} onChange={e => setFormData(p => ({ ...p, vehicles: e.target.value }))} placeholder="辆数" />
              </div>
              <div>
                <label className="form-label">注册地址 *</label>
                <input className="form-input" value={formData.address} onChange={e => setFormData(p => ({ ...p, address: e.target.value }))} placeholder="经营场所地址" />
              </div>
            </div>
          </div>
          <div className="w-56 shrink-0">
            <div className="text-xs font-semibold text-gray-600 mb-2">所需材料清单</div>
            {['营业执照复印件', '申请表（AI可代填）', '车辆行驶证复印件', '从业资格证复印件', '停车场地证明', '保险凭证'].map((m, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5 text-xs text-gray-600 border-b border-gray-50">
                <span className="w-4 h-4 rounded-full bg-gov-50 text-gov-500 text-[10px] flex items-center justify-center font-bold shrink-0">{i + 1}</span>
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <div className="text-sm text-gray-600 mb-4">请上传申请所需材料，AI将自动OCR识别并校验材料真实性</div>
          {['营业执照复印件', '车辆行驶证复印件（共10辆）', '驾驶员从业资格证', '停车场地租赁合同', '法人身份证复印件'].map((m, i) => (
            <div key={i} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-gov-300 transition-colors">
              <div className="w-8 h-8 bg-gov-50 rounded-lg flex items-center justify-center text-gov-400 shrink-0">
                <FileSearch size={14} />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-700 font-medium">{m}</div>
                <div className="text-xs text-gray-400 mt-0.5">支持 PDF / JPG / PNG，AI自动OCR识别</div>
              </div>
              <button className="text-xs bg-gov-500 text-white px-3 py-1.5 rounded hover:bg-gov-400">上传文件</button>
            </div>
          ))}
        </div>
      )}

      {step === 3 && (
        <div className="flex gap-5">
          <div className="flex-1">
            <DetailSection title="申请信息确认">
              <FieldGrid cols={3}>
                <FieldItem label="企业名称" value={formData.name || '智远物流运输有限公司'} highlight />
                <FieldItem label="法定代表人" value={formData.legalPerson || '郑志远'} />
                <FieldItem label="经营范围" value={formData.scope} />
                <FieldItem label="拟投入车辆" value={`${formData.vehicles || '10'} 辆`} />
                <FieldItem label="申请类型" value="新许可申请" />
                <FieldItem label="联系电话" value={formData.phone || '13812349999'} />
              </FieldGrid>
            </DetailSection>
            <DetailSection title="材料完整性验证">
              <div className="space-y-1.5">
                {['营业执照', '申请表', '行驶证（×10）', '从业资格证', '停车场合同'].map(m => (
                  <div key={m} className="flex items-center gap-2 text-sm">
                    <CheckCircle size={13} className="text-emerald-500" />
                    <span className="text-gray-700">{m}</span>
                    <span className="ml-auto text-xs text-indigo-500 flex items-center gap-1"><Sparkles size={10} />OCR验证通过</span>
                  </div>
                ))}
              </div>
            </DetailSection>
          </div>
          <div className="w-64 shrink-0">
            <AIPanel title="AI 预审报告" items={[
              { label: '材料完整性', value: '5/5 份材料已验证，完整性 100%', type: 'success' },
              { label: '合规性评分', value: '92 / 100分，符合《道路运输条例》第22条全部要求', type: 'success' },
              { label: '风险评估', value: '低风险 — 法人无违法记录，历史合规', type: 'success' },
              { label: '预审结论', value: '建议受理，预计5个工作日完成审批', type: 'info' },
            ]} />
          </div>
        </div>
      )}
    </Modal>
  )
}
