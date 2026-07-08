import React, { useState } from 'react'
import { Shield, FileText, AlertCircle, CheckCircle, Sparkles, Plus, Clock, Scale } from 'lucide-react'
import DataTable from '../components/DataTable'
import { FilterBar } from '../components/FilterBar'
import Modal, { DetailSection, FieldGrid, FieldItem } from '../components/Modal'
import StatusBadge, { RiskBadge, AIBadge } from '../components/StatusBadge'
import AIPanel from '../components/AIPanel'
import { enforcementCases, checkpoints } from '../data/mockData'

type ETab = '案件管理' | '监督检查' | '检查站' | '移动执法'

export default function Enforcement({ initialTab }: { initialTab?: ETab }) {
  const [tab, setTab] = useState<ETab>(initialTab ?? '案件管理')
  const [selected, setSelected] = useState<any>(null)

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-gov-800">道路运输行政执法</h1>
            <p className="text-xs text-gray-500 mt-0.5">第十五章 · 监督检查、行政处罚、执法证据、检查站管理</p>
          </div>
          <div className="flex items-center gap-2">
            <AIBadge label="AI类案推送" />
            <button className="btn-primary"><Plus size={14} />新立案件</button>
          </div>
        </div>
        <div className="flex gap-1 mt-4 border-b border-gray-100 -mb-4">
          {(['案件管理', '监督检查', '检查站', '移动执法'] as ETab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${tab === t ? 'border-gov-500 text-gov-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {t}
              {t === '案件管理' && (
                <span className="ml-1.5 px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-xs">{enforcementCases.filter(c => c.status !== '已结案').length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {tab === '案件管理' && (
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-4">
              {[
                { label: '处理中案件', value: 160, color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: '已结案', value: 2180, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: '罚款金额(万元)', value: '1285', color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'AI立案建议', value: 12, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: '类案匹配', value: 89, color: 'text-purple-600', bg: 'bg-purple-50' },
              ].map(s => (
                <div key={s.label} className={`card p-4 ${s.bg}`}>
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-sm text-gray-600 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="card-header">
                <FilterBar
                  searchPlaceholder="搜索案件编号/当事人..."
                  filters={[
                    { label: '违法类型', options: [{value:'全部',label:'全部'},{value:'无证运输',label:'无证运输'},{value:'超限运输',label:'超限运输'},{value:'非法营运',label:'非法营运'}], value: '全部', onChange: () => {} },
                    { label: '阶段', options: [{value:'全部',label:'全部'},{value:'立案审批',label:'立案'},{value:'调查取证',label:'调查'},{value:'执行',label:'执行'}], value: '全部', onChange: () => {} },
                  ]}
                />
              </div>
              <DataTable
                columns={[
                  { key: 'id', title: '案件编号', width: 110 },
                  { key: 'violationType', title: '违法类型', render: (v: string) => (
                    <span className="text-xs bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded">{v}</span>
                  )},
                  { key: 'person', title: '当事人' },
                  { key: 'checkDate', title: '发现日期' },
                  { key: 'location', title: '发现地点' },
                  { key: 'officer', title: '执法人员' },
                  { key: 'penaltyAmount', title: '罚款金额', render: (v: number) => `¥${v.toLocaleString()}` },
                  { key: 'aiRisk', title: 'AI风险', render: (v: string) => <RiskBadge level={v as any} /> },
                  { key: 'aiSimilar', title: 'AI类案', render: (v: number) => (
                    <div className="flex items-center gap-1 text-xs text-indigo-600"><Sparkles size={10} />{v}个相似案件</div>
                  )},
                  { key: 'stage', title: '当前阶段', render: (v: string) => (
                    <span className="text-xs bg-gov-50 text-gov-600 px-2 py-0.5 rounded">{v}</span>
                  )},
                  { key: 'status', title: '状态', render: (v: string) => (
                    <StatusBadge label={v} variant={v === '已结案' ? 'success' : v === '已决定' ? 'info' : 'warning'} />
                  )},
                ]}
                data={enforcementCases}
                rowKey="id"
                onRowClick={setSelected}
              />
            </div>
          </div>
        )}

        {tab === '监督检查' && <InspectionTab />}
        {tab === '检查站' && <CheckpointTab />}
        {tab === '移动执法' && <MobileEnforcement />}
      </div>

      {/* Case Detail Modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={`案件详情 — ${selected?.id}`}
        subtitle={`违法类型：${selected?.violationType}`}
        width="2xl"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setSelected(null)}>关闭</button>
            <button className="btn-primary"><FileText size={13} />AI生成调查报告</button>
            <button className="btn-primary"><Scale size={13} />AI处罚建议</button>
            <button className="btn-primary"><CheckCircle size={13} />推进案件</button>
          </>
        }
      >
        {selected && <CaseDetail case_={selected} />}
      </Modal>
    </div>
  )
}

function CaseDetail({ case_ }: { case_: any }) {
  const stages = ['线索发现', '立案审批', '调查取证', '告知听证', '处罚决定', '执行', '结案']
  const currentIdx = stages.indexOf(case_.stage)

  return (
    <div className="flex gap-5">
      <div className="flex-1 space-y-4">
        <DetailSection title="案件基本信息">
          <FieldGrid cols={3}>
            <FieldItem label="案件编号" value={case_.id} highlight />
            <FieldItem label="违法类型" value={case_.violationType} />
            <FieldItem label="当事人" value={case_.person} />
            <FieldItem label="发现日期" value={case_.checkDate} />
            <FieldItem label="发现地点" value={case_.location} />
            <FieldItem label="执法人员" value={case_.officer} />
            <FieldItem label="拟处罚金额" value={`¥${case_.penaltyAmount.toLocaleString()}`} />
            <FieldItem label="当前状态" value={<StatusBadge label={case_.status} variant={case_.status === '已结案' ? 'success' : 'warning'} />} />
            <FieldItem label="AI风险" value={<RiskBadge level={case_.aiRisk} />} />
          </FieldGrid>
        </DetailSection>

        {/* Case flow */}
        <DetailSection title="办案进度">
          <div className="flex items-center gap-1.5">
            {stages.map((s, i) => {
              const done = i < currentIdx
              const curr = i === currentIdx
              return (
                <React.Fragment key={s}>
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${done ? 'bg-emerald-500 text-white' : curr ? 'bg-gov-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {done ? '✓' : i + 1}
                    </div>
                    <span className={`text-[10px] whitespace-nowrap ${curr ? 'text-gov-600 font-semibold' : done ? 'text-emerald-600' : 'text-gray-400'}`}>{s}</span>
                  </div>
                  {i < stages.length - 1 && <div className={`flex-1 h-0.5 ${done ? 'bg-emerald-400' : 'bg-gray-200'}`} />}
                </React.Fragment>
              )
            })}
          </div>
        </DetailSection>

        {/* Evidence */}
        <DetailSection title="证据材料" icon={<FileText size={14} className="text-gov-500" />}>
          <div className="space-y-1.5">
            {['现场照片（3张）', '执法记录仪视频', '车辆信息查询截图', '驾驶员陈述笔录（ASR转写）'].map(e => (
              <div key={e} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
                <CheckCircle size={12} className="text-emerald-500" />
                <span className="flex-1">{e}</span>
                <div className="flex items-center gap-1 text-xs text-indigo-500"><Sparkles size={10} />AI识别完成</div>
              </div>
            ))}
          </div>
        </DetailSection>

        {/* Penalty draft */}
        <DetailSection title="AI处罚决定书草稿" icon={<Sparkles size={14} className="text-indigo-500" />}>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs text-gray-700 leading-relaxed">
            <div className="font-semibold text-gov-700 mb-2">道路运输行政处罚决定书</div>
            <div className="mb-1">当事人：{case_.person}</div>
            <div className="mb-1">违法事实：{case_.checkDate}，在{case_.location}，经执法人员现场检查，发现当事人{case_.violationType}，违反《道路运输条例》第×条规定。</div>
            <div className="mb-1">处罚依据：《道路运输条例》第×条，《道路运输违规处罚规定》第×条。</div>
            <div className="text-amber-700 font-medium">拟处罚内容：警告，罚款人民币{case_.penaltyAmount}元整。</div>
            <div className="mt-2 flex items-center gap-1 text-indigo-500"><Sparkles size={10} />本文书由AI辅助生成，请执法人员审核修改后使用</div>
          </div>
        </DetailSection>
      </div>

      <div className="w-64 shrink-0 space-y-3">
        <AIPanel
          title="AI 执法助手"
          items={[
            { label: 'AI类案分析', value: `发现${case_.aiSimilar}个相似案件，平均处罚金额：¥${Math.round(case_.penaltyAmount * 0.95).toLocaleString()}`, type: 'info' },
            { label: '处罚幅度建议', value: `依据自由裁量基准，建议处罚幅度：¥${Math.round(case_.penaltyAmount * 0.8).toLocaleString()} ~ ¥${Math.round(case_.penaltyAmount * 1.2).toLocaleString()}`, type: 'info' },
            { label: '法规依据', value: '《道路运输条例》第×条、《行政处罚法》第×条，适用一般程序', type: 'normal' },
            { label: '证据完整性', value: '4份证据材料，AI校验证据链完整度92分，可支撑处罚决定', type: 'success' },
            { label: '办案时限', value: '已立案12天，按规定须60天内结案，剩余48天，请及时推进', type: case_.status !== '已结案' ? 'warning' : 'success' },
          ]}
        />
      </div>
    </div>
  )
}

function InspectionTab() {
  const [selected, setSelected] = useState<any>(null)
  const inspections = [
    { id: 'JC2024001', target: '恒通物流运输有限公司', type: '常规检查', date: '2024-06-20', officer: '张执法', findings: 2, rectified: 2, status: '已整改', aiPlan: '风险预测触发' },
    { id: 'JC2024002', target: '危化品物流有限公司', type: '专项检查', date: '2024-06-18', officer: '李执法', findings: 5, rectified: 3, status: '整改中', aiPlan: 'AI重点推荐' },
    { id: 'JC2024003', target: '城际客运集团', type: '常规检查', date: '2024-06-15', officer: '王执法', findings: 0, rectified: 0, status: '合格', aiPlan: '定期检查' },
    { id: 'JC2024004', target: '天龙货运公司', type: '随机检查', date: '2024-06-12', officer: '赵执法', findings: 1, rectified: 0, status: '待整改', aiPlan: '随机抽查' },
  ]
  return (
    <div className="space-y-4">
      <div className="card">
        <div className="card-header">
          <div className="card-title">监督检查计划与记录</div>
          <AIBadge label="AI智能排查计划" />
        </div>
        <DataTable
          columns={[
            { key: 'id', title: '检查单号', width: 110 },
            { key: 'target', title: '被检查对象' },
            { key: 'type', title: '检查类型', render: (v: string) => <StatusBadge label={v} variant={v === '专项检查' ? 'warning' : 'info'} /> },
            { key: 'date', title: '检查日期' },
            { key: 'officer', title: '检查人员' },
            { key: 'findings', title: '发现问题', align: 'center' as const },
            { key: 'rectified', title: '已整改', align: 'center' as const },
            { key: 'aiPlan', title: 'AI触发原因', render: (v: string) => (
              <div className="flex items-center gap-1 text-xs text-indigo-600"><Sparkles size={10} />{v}</div>
            )},
            { key: 'status', title: '整改状态', render: (v: string) => <StatusBadge label={v} variant={v === '合格' || v === '已整改' ? 'success' : 'warning'} /> },
          ]}
          data={inspections}
          rowKey="id"
          onRowClick={setSelected}
        />
      </div>
      <Modal open={!!selected} onClose={() => setSelected(null)} title={`检查详情 — ${selected?.target}`} width="lg">
        {selected && (
          <div className="flex gap-4">
            <div className="flex-1 space-y-3">
              <DetailSection title="检查基本信息">
                <FieldGrid cols={2}>
                  <FieldItem label="被检查对象" value={selected.target} highlight />
                  <FieldItem label="检查类型" value={selected.type} />
                  <FieldItem label="检查日期" value={selected.date} />
                  <FieldItem label="检查人员" value={selected.officer} />
                  <FieldItem label="发现问题数" value={selected.findings} />
                  <FieldItem label="整改状态" value={<StatusBadge label={selected.status} variant={selected.status === '合格' ? 'success' : 'warning'} />} />
                </FieldGrid>
              </DetailSection>
            </div>
            <div className="w-52 shrink-0">
              <AIPanel title="AI检查助手" items={[
                { label: 'AI触发原因', value: selected.aiPlan, type: 'info' },
                { label: '整改追踪', value: `${selected.rectified}/${selected.findings}项已整改，${selected.findings - selected.rectified}项待整改`, type: selected.findings === selected.rectified ? 'success' : 'warning' },
              ]} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function CheckpointTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {checkpoints.map(cp => (
          <div key={cp.id} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-gov-700 text-sm">{cp.name}</div>
              <StatusBadge label={cp.status} variant="success" />
            </div>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between"><span>位置</span><span className="text-gray-800">{cp.location}</span></div>
              <div className="flex justify-between"><span>执法人员</span><span className="text-gray-800">{cp.officers} 人</span></div>
              <div className="flex justify-between"><span>月过车量</span><span className="text-gray-800">{cp.vehicles30.toLocaleString()} 辆</span></div>
              <div className="flex justify-between"><span>月查处量</span><span className="text-red-600 font-medium">{cp.violations30} 起</span></div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
              <div className="flex-1 text-xs">
                <div className="flex justify-between text-gray-500 mb-1"><span>违规率</span><span>{((cp.violations30 / cp.vehicles30) * 100).toFixed(2)}%</span></div>
                <div className="w-full bg-gray-100 rounded h-1.5">
                  <div className="bg-amber-500 h-1.5 rounded" style={{ width: `${Math.min((cp.violations30 / cp.vehicles30) * 100 * 30, 100)}%` }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="card p-5">
        <div className="card-title mb-4">AI 高风险车辆预警列表（实时）</div>
        <div className="space-y-2">
          {[
            { plate: '粤D45678', type: '危险品运输车', company: '危化品物流', risk: '极高', alert: '路线偏离，罐体异常' },
            { plate: '粤G89012', type: '重型货车', company: '鑫鹏物流', risk: '高', alert: '超载记录5次，驾驶员近期违规' },
            { plate: '粤B23456', type: '重型货车', company: '快速物流', risk: '中', alert: '里程偏高，近期超速1次' },
          ].map(v => (
            <div key={v.plate} className="flex items-center gap-4 p-3 bg-red-50 border border-red-100 rounded-lg">
              <span className="font-mono font-bold text-gov-700 text-sm w-20 shrink-0">{v.plate}</span>
              <span className="text-sm text-gray-600 flex-1">{v.company} — {v.type}</span>
              <div className="flex items-center gap-1 text-xs text-indigo-500"><Sparkles size={10} />{v.alert}</div>
              <RiskBadge level={v.risk as any} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MobileEnforcement() {
  const [query, setQuery] = useState('')
  const [aiReply, setAiReply] = useState('')

  const handleQuery = () => {
    if (!query.trim()) return
    setAiReply(`根据《道路运输条例》第××条及《道路运输违规行为处罚规定》：对于"${query}"情形，执法程序如下：1. 现场亮证执法，出示执法证件；2. 告知当事人违法事实及依据；3. 询问当事人陈述意见；4. 制作现场检查记录或实施简易程序；5. 当场处罚需符合简易程序条件（违法事实确凿、有法定依据、对公民处以200元以下罚款）。如情节严重建议予以立案处理，适用一般程序。`)
  }

  return (
    <div className="grid grid-cols-2 gap-5">
      <div className="space-y-4">
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={15} className="text-indigo-500" />
            <div className="font-semibold text-gov-700 text-sm">AI 执法法规查询助手</div>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-xs text-indigo-700 mb-4">
            支持自然语言查询道路运输相关法规，语音输入（ASR），实时给出执法建议
          </div>
          <div className="flex gap-2 mb-3">
            <input
              className="form-input flex-1 text-sm"
              placeholder="输入执法问题，如：发现货车超载如何处理..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleQuery()}
            />
            <button onClick={handleQuery} className="btn-primary">查询</button>
          </div>
          {aiReply && (
            <div className="bg-gov-950 border border-indigo-800 rounded-lg p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles size={12} className="text-indigo-300" />
                <span className="text-xs text-indigo-300 font-medium">AI执法助手</span>
              </div>
              <div className="text-xs text-gray-300 leading-relaxed">{aiReply}</div>
            </div>
          )}
        </div>

        <div className="card p-5">
          <div className="font-semibold text-gov-700 text-sm mb-3">现场OCR取证</div>
          <div className="border-2 border-dashed border-gov-200 rounded-lg p-8 text-center">
            <FileText size={32} className="text-gov-300 mx-auto mb-2" />
            <div className="text-sm text-gray-500 mb-3">点击上传现场证据照片</div>
            <div className="text-xs text-indigo-500 flex items-center justify-center gap-1 mb-3">
              <Sparkles size={11} />AI-OCR自动识别证件信息
            </div>
            <button className="btn-primary mx-auto"><Plus size={13} />上传证据</button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="card p-5">
          <div className="font-semibold text-gov-700 text-sm mb-3">今日执法统计</div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: '今日检查车辆', value: 48, color: 'text-blue-600' },
              { label: '发现违规', value: 6, color: 'text-red-600' },
              { label: '现场处罚', value: 4, color: 'text-amber-600' },
              { label: '立案处理', value: 2, color: 'text-indigo-600' },
            ].map(s => (
              <div key={s.label} className="bg-gray-50 rounded-lg p-3 text-center">
                <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="font-semibold text-gov-700 text-sm mb-3">AI类案推送</div>
          <div className="space-y-2">
            {[
              { title: '类似无证运营案例(2024)', outcome: '罚款5000元，没收违法所得', similarity: 96 },
              { title: '超限运输处罚参考(2023)', outcome: '罚款15000元，责令改正', similarity: 91 },
              { title: '非法营运典型案例(2024)', outcome: '罚款10000元，吊销许可证', similarity: 85 },
            ].map((c, i) => (
              <div key={i} className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-indigo-700">{c.title}</span>
                  <span className="text-xs text-indigo-500">{c.similarity}%相似</span>
                </div>
                <div className="text-xs text-gray-600">{c.outcome}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
