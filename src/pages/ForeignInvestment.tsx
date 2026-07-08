import React, { useState } from 'react'
import { Plus, Sparkles, CheckCircle, AlertTriangle, Globe, FileSearch, Shield, TrendingUp } from 'lucide-react'
import DataTable from '../components/DataTable'
import { FilterBar } from '../components/FilterBar'
import Modal, { DetailSection, FieldGrid, FieldItem } from '../components/Modal'
import StatusBadge, { AIBadge, RiskBadge } from '../components/StatusBadge'
import AIPanel from '../components/AIPanel'

type FTab = '项目申请' | '合规审查' | '项目档案'

const projects = [
  { id: 'WS001', name: '中德快速物流（合资）有限公司', foreignParty: '德国DHL物流集团', country: '德国', investAmount: 5800, shareholding: 49, type: '中外合资', business: '普通货物运输', stage: '开业许可', status: '已批准', certNo: 'WS2022001', certExpiry: '2027-05-19', aiScore: 94, riskLevel: '低', legalPerson: '张中德', phone: '13812340030' },
  { id: 'WS002', name: '中美跨境运输服务（合资）公司', foreignParty: '美国UPS供应链', country: '美国', investAmount: 3200, shareholding: 35, type: '中外合资', business: '冷链运输', stage: '组建许可', status: '审查中', certNo: 'WS2024002', certExpiry: '—', aiScore: 78, riskLevel: '中', legalPerson: '李中美', phone: '13987650030' },
  { id: 'WS003', name: '港澳联运物流（外资）有限公司', foreignParty: '香港联运集团', country: '香港', investAmount: 2100, shareholding: 100, type: '外商独资', business: '大件运输', stage: '立项审批', status: '待审查', certNo: 'WS2024003', certExpiry: '—', aiScore: 65, riskLevel: '中', legalPerson: '陈联运', phone: '15678900030' },
  { id: 'WS004', name: '中日冷链物流（合资）有限公司', foreignParty: '日本冷链株式会社', country: '日本', investAmount: 4500, shareholding: 45, type: '中外合资', business: '冷链运输', stage: '开业许可', status: '已批准', certNo: 'WS2021004', certExpiry: '2026-08-14', aiScore: 91, riskLevel: '低', legalPerson: '王中日', phone: '18923450030' },
]

const reviewItems = [
  {
    id: 'RV001', project: '中德快速物流（合资）有限公司', stage: '开业许可', reviewDate: '2022-03-10',
    items: { creditCheck: true, investorQual: true, businessPlan: true, capitalVerify: true, complianceCheck: true, securityReview: true },
    conclusion: '通过', aiScore: 94
  },
  {
    id: 'RV002', project: '中美跨境运输服务（合资）公司', stage: '组建许可', reviewDate: '2024-05-20',
    items: { creditCheck: true, investorQual: true, businessPlan: false, capitalVerify: true, complianceCheck: false, securityReview: true },
    conclusion: '补充材料', aiScore: 68
  },
]

const stageFlow = ['立项审批', '组建许可', '开业许可']

export default function ForeignInvestment() {
  const [tab, setTab] = useState<FTab>('项目申请')
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-gov-800">外商投资道路运输管理</h1>
            <p className="text-xs text-gray-500 mt-0.5">第十二章 · 外商投资立项审批、三阶段许可流程、资信审查、AI合规检查</p>
          </div>
          <div className="flex items-center gap-2">
            <AIBadge label="AI投资风险评估" />
            <button className="btn-primary"><Plus size={14} />新增外商投资申请</button>
          </div>
        </div>
        <div className="flex gap-1 mt-4 border-b border-gray-100 -mb-4">
          {(['项目申请', '合规审查', '项目档案'] as FTab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${tab === t ? 'border-gov-500 text-gov-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {t}
              {t === '项目申请' && <span className="ml-1.5 px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-xs">2待审</span>}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        {tab === '项目申请' && <ProjectApplications />}
        {tab === '合规审查' && <ComplianceReview />}
        {tab === '项目档案' && <ProjectArchives />}
      </div>
    </div>
  )
}

function ProjectApplications() {
  const [selected, setSelected] = useState<typeof projects[0] | null>(null)
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '外商投资项目总数', value: '24', sub: '持有效许可证', color: 'text-gov-600', bg: 'bg-gov-50' },
          { label: '合资企业', value: '18', sub: '含港澳台', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: '外商独资', value: '6', sub: '已批准', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: '待审申请', value: '2', sub: '需处理', color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(s => (
          <div key={s.label} className={`card p-4 ${s.bg}`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-sm text-gray-600 mt-1">{s.label}</div>
            <div className={`text-xs ${s.color} mt-1`}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Globe size={16} className="text-blue-500 mt-0.5 shrink-0" />
        <div>
          <div className="text-sm font-semibold text-blue-700">三阶段许可说明</div>
          <div className="flex items-center gap-6 mt-2">
            {stageFlow.map((s, i) => (
              <React.Fragment key={s}>
                <div className="flex items-center gap-2 text-xs text-blue-600">
                  <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</div>
                  <span className="font-medium">{s}</span>
                </div>
                {i < stageFlow.length - 1 && <div className="text-blue-300">→</div>}
              </React.Fragment>
            ))}
            <div className="text-xs text-blue-400 ml-2">依次审批，逐阶放行</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <FilterBar searchPlaceholder="搜索企业名称/投资方..."
            filters={[
              { label: '类型', options: [{value:'全部',label:'全部'},{value:'中外合资',label:'中外合资'},{value:'外商独资',label:'外商独资'}], value: '全部', onChange: () => {} },
              { label: '阶段', options: [{value:'全部',label:'全部'},{value:'立项审批',label:'立项审批'},{value:'组建许可',label:'组建许可'},{value:'开业许可',label:'开业许可'}], value: '全部', onChange: () => {} },
            ]}
            onExport={() => {}} onRefresh={() => {}}
          />
        </div>
        <DataTable
          columns={[
            { key: 'id', title: '项目编号', width: 90 },
            { key: 'name', title: '项目企业', render: (v: string, row: any) => (
              <div><div className="font-medium text-sm">{v}</div><div className="text-xs text-gray-400">{row.foreignParty} · {row.country}</div></div>
            )},
            { key: 'type', title: '投资类型', render: (v: string) => <StatusBadge label={v} variant="info" /> },
            { key: 'investAmount', title: '投资额(万元)', render: (v: number) => v.toLocaleString() },
            { key: 'shareholding', title: '外方股比', render: (v: number) => `${v}%` },
            { key: 'business', title: '经营范围' },
            { key: 'stage', title: '当前阶段', render: (v: string) => (
              <span className="text-xs bg-gov-50 text-gov-600 px-2 py-0.5 rounded">{v}</span>
            )},
            { key: 'aiScore', title: 'AI评估分', render: (v: number) => (
              <span className={`font-bold text-sm ${v >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>{v}</span>
            )},
            { key: 'riskLevel', title: 'AI风险', render: (v: string) => <RiskBadge level={v as any} /> },
            { key: 'status', title: '状态', render: (v: string) => <StatusBadge label={v} variant={v === '已批准' ? 'success' : v === '审查中' ? 'warning' : 'default'} /> },
          ]}
          data={projects} rowKey="id" onRowClick={setSelected}
        />
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ''} subtitle={`外方投资方：${selected?.foreignParty} · ${selected?.country}`} width="xl"
        footer={<><button className="btn-secondary" onClick={() => setSelected(null)}>关闭</button><button className="btn-primary"><Sparkles size={13} />AI资信审查</button><button className="btn-primary"><CheckCircle size={13} />许可决定</button></>}>
        {selected && (
          <div className="flex gap-5">
            <div className="flex-1 space-y-4">
              <DetailSection title="项目基本信息">
                <FieldGrid cols={3}>
                  <FieldItem label="企业名称" value={selected.name} highlight />
                  <FieldItem label="投资类型" value={selected.type} />
                  <FieldItem label="外方投资方" value={selected.foreignParty} />
                  <FieldItem label="国籍/地区" value={selected.country} />
                  <FieldItem label="投资额" value={`${selected.investAmount.toLocaleString()} 万元`} />
                  <FieldItem label="外方股权比例" value={`${selected.shareholding}%`} />
                  <FieldItem label="经营范围" value={selected.business} />
                  <FieldItem label="法定代表人" value={selected.legalPerson} />
                  <FieldItem label="联系电话" value={selected.phone} />
                </FieldGrid>
              </DetailSection>
              <DetailSection title="三阶段许可进度">
                <div className="flex items-center gap-3 mt-2">
                  {stageFlow.map((s, i) => {
                    const currentIdx = stageFlow.indexOf(selected.stage)
                    const isDone = i < currentIdx
                    const isCurrent = i === currentIdx
                    return (
                      <React.Fragment key={s}>
                        <div className="flex flex-col items-center gap-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isDone ? 'bg-emerald-500 text-white' : isCurrent ? 'bg-gov-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                            {isDone ? '✓' : i + 1}
                          </div>
                          <span className={`text-xs whitespace-nowrap ${isCurrent ? 'text-gov-600 font-semibold' : isDone ? 'text-emerald-600' : 'text-gray-400'}`}>{s}</span>
                        </div>
                        {i < stageFlow.length - 1 && <div className={`flex-1 h-0.5 ${i < currentIdx ? 'bg-emerald-400' : 'bg-gray-200'}`} />}
                      </React.Fragment>
                    )
                  })}
                </div>
              </DetailSection>
              <DetailSection title="AI资信证明核验">
                <div className="space-y-2">
                  {[
                    { label: '外方营业执照', status: 'OCR识别完成，信息匹配', ok: true },
                    { label: '银行资信证明', status: selected.aiScore >= 80 ? 'AI验真通过，资信良好' : 'AI识别异常，建议人工复核', ok: selected.aiScore >= 80 },
                    { label: '无犯罪记录证明', status: '联网核查通过', ok: true },
                    { label: '企业年报财务数据', status: selected.aiScore >= 80 ? '财务数据真实，符合投资规模' : '部分数据异常，需补充说明', ok: selected.aiScore >= 80 },
                  ].map((m, i) => (
                    <div key={i} className={`flex items-center gap-3 p-2.5 rounded border ${m.ok ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
                      {m.ok ? <CheckCircle size={13} className="text-emerald-500 shrink-0" /> : <AlertTriangle size={13} className="text-amber-500 shrink-0" />}
                      <span className="text-xs font-medium text-gray-700 flex-1">{m.label}</span>
                      <div className="flex items-center gap-1 text-xs text-indigo-500"><Sparkles size={10} />{m.status}</div>
                    </div>
                  ))}
                </div>
              </DetailSection>
            </div>
            <div className="w-60 shrink-0">
              <AIPanel title="AI 投资风险评估" items={[
                { label: 'AI综合评分', value: <div className="text-2xl font-bold text-indigo-300">{selected.aiScore}<span className="text-sm ml-1">/ 100</span></div>, type: selected.aiScore >= 80 ? 'success' : 'warning' },
                { label: '投资风险评级', value: `${selected.riskLevel}风险。基于外方资信记录、股权结构、经营范围等综合评估`, type: selected.riskLevel === '低' ? 'success' : 'warning' },
                { label: '合规性评估', value: selected.status === '已批准' ? '符合《外商投资法》和《道路运输条例》相关要求' : '仍需完善材料，请按要求补充后重新审查', type: selected.status === '已批准' ? 'success' : 'warning' },
                { label: '审批建议', value: selected.aiScore >= 80 ? '材料完整，外方资信良好，建议按程序推进审批' : '发现风险点，建议要求外方补充说明材料', type: selected.aiScore >= 80 ? 'success' : 'warning' },
              ]} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function ComplianceReview() {
  const [selected, setSelected] = useState<typeof reviewItems[0] | null>(null)
  return (
    <div className="space-y-4">
      <div className="card">
        <div className="card-header">
          <div className="card-title flex items-center gap-2"><Shield size={14} className="text-gov-500" />合规审查记录</div>
          <AIBadge label="AI合规核验" />
        </div>
        <DataTable
          columns={[
            { key: 'id', title: '审查编号', width: 90 },
            { key: 'project', title: '项目名称', render: (v: string) => <span className="font-medium">{v}</span> },
            { key: 'stage', title: '审查阶段', render: (v: string) => <span className="text-xs bg-gov-50 text-gov-600 px-2 py-0.5 rounded">{v}</span> },
            { key: 'reviewDate', title: '审查日期' },
            { key: 'aiScore', title: 'AI合规分', render: (v: number) => (
              <span className={`font-bold text-sm ${v >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>{v}</span>
            )},
            { key: 'conclusion', title: '审查结论', render: (v: string) => <StatusBadge label={v} variant={v === '通过' ? 'success' : 'warning'} /> },
          ]}
          data={reviewItems} rowKey="id" onRowClick={setSelected}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4">
          <div className="text-sm font-semibold text-gray-700 mb-3">AI合规审查六项指标</div>
          <div className="space-y-2.5">
            {[
              { label: '投资方资信证明核验', desc: 'OCR识别+联网核查' },
              { label: '股权结构合规性', desc: '符合《外商投资准入负面清单》' },
              { label: '注册资本充足性', desc: '注册资本不低于经营规模要求' },
              { label: '经营范围合规', desc: '符合道路运输许可范围' },
              { label: '安全生产条件', desc: '符合安全生产基本要求' },
              { label: '投资方背景调查', desc: 'AI联网核查无不良记录' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-xs">
                <div className="w-5 h-5 rounded bg-gov-100 text-gov-600 flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</div>
                <div className="flex-1"><span className="font-medium text-gray-700">{item.label}</span></div>
                <span className="text-gray-400">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-4">
          <div className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"><TrendingUp size={14} className="text-gov-500" />外商投资审批统计</div>
          <div className="space-y-3">
            {[
              { label: '本年新增申请', value: 6, color: 'text-gov-600' },
              { label: '审批通过', value: 4, color: 'text-emerald-600' },
              { label: '审批不通过', value: 1, color: 'text-red-600' },
              { label: '审查中', value: 1, color: 'text-amber-600' },
              { label: '平均审批时长', value: '18 个工作日', color: 'text-gray-600' },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                <span className="text-gray-500">{item.label}</span>
                <span className={`font-bold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={`合规审查详情 — ${selected?.project}`} subtitle={`审查阶段：${selected?.stage}`} width="lg"
        footer={<><button className="btn-secondary" onClick={() => setSelected(null)}>关闭</button><button className="btn-primary"><Sparkles size={13} />生成审查报告</button></>}>
        {selected && (
          <div className="flex gap-5">
            <div className="flex-1">
              <DetailSection title="逐项审查结果">
                <div className="space-y-2">
                  {[
                    { key: 'creditCheck', label: '投资方资信证明核验' },
                    { key: 'investorQual', label: '投资方资质审查' },
                    { key: 'businessPlan', label: '经营方案合规性' },
                    { key: 'capitalVerify', label: '注册资本核实' },
                    { key: 'complianceCheck', label: '行业准入合规检查' },
                    { key: 'securityReview', label: '安全生产条件审查' },
                  ].map((item) => {
                    const ok = selected.items[item.key as keyof typeof selected.items]
                    return (
                      <div key={item.key} className={`flex items-center gap-3 p-2.5 rounded border ${ok ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                        {ok ? <CheckCircle size={14} className="text-emerald-500 shrink-0" /> : <AlertTriangle size={14} className="text-red-500 shrink-0" />}
                        <span className={`text-sm font-medium ${ok ? 'text-emerald-700' : 'text-red-700'}`}>{item.label}</span>
                        <span className="ml-auto text-xs text-gray-500">{ok ? 'AI审查通过' : '需补充材料'}</span>
                      </div>
                    )
                  })}
                </div>
              </DetailSection>
            </div>
            <div className="w-56 shrink-0">
              <AIPanel title="AI 审查结论" items={[
                { label: 'AI合规评分', value: <div className="text-2xl font-bold text-indigo-300">{selected.aiScore}<span className="text-sm ml-1">/ 100</span></div>, type: selected.aiScore >= 80 ? 'success' : 'warning' },
                { label: '审查结论', value: selected.conclusion === '通过' ? '全部合规项审查通过，符合外商投资许可条件' : '存在不符合项，请补充相关材料后重新提交', type: selected.conclusion === '通过' ? 'success' : 'warning' },
              ]} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function ProjectArchives() {
  const approved = projects.filter(p => p.status === '已批准')
  return (
    <div className="space-y-4">
      <div className="card">
        <div className="card-header">
          <div className="card-title">已批准外商投资项目档案</div>
          <AIBadge label="AI持续监管" />
        </div>
        <FilterBar searchPlaceholder="搜索项目名称..."
          filters={[{ label: '国别', options: [{value:'全部',label:'全部'},{value:'德国',label:'德国'},{value:'日本',label:'日本'}], value: '全部', onChange: () => {} }]}
          onExport={() => {}}
        />
        <DataTable
          columns={[
            { key: 'id', title: '项目编号', width: 90 },
            { key: 'name', title: '企业名称', render: (v: string) => <span className="font-medium">{v}</span> },
            { key: 'foreignParty', title: '外方投资方' },
            { key: 'country', title: '国别' },
            { key: 'investAmount', title: '投资额(万)', render: (v: number) => v.toLocaleString() },
            { key: 'shareholding', title: '股比', render: (v: number) => `${v}%` },
            { key: 'certNo', title: '许可证号' },
            { key: 'certExpiry', title: '有效期至' },
            { key: 'aiScore', title: 'AI监管分', render: (v: number) => (
              <span className={`font-bold text-sm ${v >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>{v}</span>
            )},
            { key: 'status', title: '状态', render: (v: string) => <StatusBadge label={v} variant="success" /> },
          ]}
          data={approved} rowKey="id"
        />
      </div>
    </div>
  )
}
