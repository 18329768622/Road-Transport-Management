import React, { useState } from 'react'
import { BookOpen, Sparkles, Search } from 'lucide-react'
import DataTable from '../components/DataTable'
import { FilterBar } from '../components/FilterBar'
import StatusBadge, { AIBadge } from '../components/StatusBadge'
import Modal, { DetailSection, FieldGrid, FieldItem } from '../components/Modal'
import AIPanel from '../components/AIPanel'

const laws = [
  { id: 'LW001', no: '国务院令第406号', name: '道路运输条例', org: '国务院', issueDate: '2004-05-01', effectDate: '2004-07-01', reviseDate: '2022-03-29', status: '现行有效', aiSummary: '共7章71条，规定道路货物运输、旅客运输、危险货物运输的许可条件、经营管理及监督检查', type: '行政法规' },
  { id: 'LW002', no: '交运便字[2014]181号', name: '道路运输管理工作规范', org: '交通运输部', issueDate: '2014-09-01', effectDate: '2014-10-01', reviseDate: null, status: '现行有效', aiSummary: '共17章，全面规定道路运输各业务管理工作规范与流程，是本系统核心依据', type: '部门规章' },
  { id: 'LW003', no: '交通运输部令2019年第35号', name: '道路运输驾驶员诚信考核办法', org: '交通运输部', issueDate: '2019-12-01', effectDate: '2020-01-01', reviseDate: null, status: '现行有效', aiSummary: '规定驾驶员诚信考核的计分标准、等级认定、结果应用', type: '部门规章' },
  { id: 'LW004', no: 'GB 18344-2016', name: '汽车维护、检测、诊断技术规范', org: '国家标准委', issueDate: '2016-01-01', effectDate: '2017-01-01', reviseDate: null, status: '现行有效', aiSummary: '规定汽车维护作业项目、技术标准及检测诊断方法', type: '国家标准' },
]

export default function LawKnowledgeBase() {
  const [selected, setSelected] = useState<any>(null)
  const [query, setQuery] = useState('')
  const [aiAnswer, setAiAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  const handleQuery = () => {
    if (!query.trim()) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setAiAnswer(`根据知识图谱检索结果：

关于"${query}"，相关法规规定如下：

1. 《道路运输条例》（国务院令第406号）第22条：申请从事道路货物运输经营的，应当向所在地的县级道路运输管理机构提出申请，并附送相关证明材料。

2. 《道路运输管理工作规范》（交运便字[2014]181号）第三章：道路运输管理机构应当自受理申请之日起20个工作日内作出决定。

3. 申请条件：(1)有与其经营业务相适应并经检测合格的车辆；(2)有符合本条例第二十三条规定条件的驾驶人员；(3)有健全的安全生产管理制度。

AI解读置信度：96.5%，知识来源：《道路运输条例》《道路运输管理工作规范》`)
    }, 1200)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-gov-800">法规知识库</h1>
            <p className="text-xs text-gray-500 mt-0.5">第一章 · 道路运输法规体系、RAG智能检索、AI法规解读</p>
          </div>
          <AIBadge label="RAG知识图谱" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2 space-y-4">
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={14} className="text-indigo-500" />
                <span className="text-sm font-semibold text-gov-700">AI法规智能检索</span>
              </div>
              <div className="flex gap-2 mb-3">
                <input className="form-input flex-1" placeholder="用自然语言描述法规问题，如：道路货物运输经营许可需满足哪些条件..." value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleQuery()} />
                <button className="btn-primary" onClick={handleQuery} disabled={loading}><Search size={14} />{loading ? '检索中...' : '智能查询'}</button>
              </div>
              {aiAnswer && (
                <div className="bg-gov-950 border border-indigo-800 rounded-lg p-4">
                  <div className="flex items-center gap-1.5 mb-2"><Sparkles size={12} className="text-indigo-300" /><span className="text-xs text-indigo-300 font-medium">AI检索结果</span></div>
                  <div className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">{aiAnswer}</div>
                </div>
              )}
            </div>
            <div className="card">
              <div className="card-header">
                <div className="card-title">法规文件库</div>
                <AIBadge label="AI摘要+修订追踪" />
              </div>
              <DataTable columns={[
                { key: 'no', title: '法规文号', width: 160 },
                { key: 'name', title: '法规名称', render: (v: string) => <span className="font-medium text-gov-600">{v}</span> },
                { key: 'type', title: '类型', render: (v: string) => <StatusBadge label={v} variant="info" /> },
                { key: 'org', title: '发布机关' },
                { key: 'effectDate', title: '施行日期' },
                { key: 'status', title: '状态', render: (v: string) => <StatusBadge label={v} variant="success" /> },
              ]} data={laws} rowKey="id" onRowClick={setSelected} />
            </div>
          </div>
          <div className="space-y-4">
            <div className="card p-4">
              <div className="text-sm font-semibold text-gov-700 mb-3">知识图谱统计</div>
              <div className="space-y-2">
                {[{ label: '法规文件', value: 248 }, { label: '关联实体', value: '52万+' }, { label: '知识关系', value: '215万+' }, { label: '属性数据', value: '1080万+' }].map(s => (
                  <div key={s.label} className="flex items-center justify-between p-2 bg-gov-50 rounded">
                    <span className="text-xs text-gray-600">{s.label}</span>
                    <span className="text-sm font-bold text-gov-600">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-4">
              <div className="text-sm font-semibold text-gov-700 mb-3">热门查询</div>
              <div className="space-y-1.5">
                {['货运许可申请条件', '危货从业人员资格', '驾驶员诚信计分标准', '客运班线招标条件', '维修企业许可条件', '行政处罚程序'].map((q, i) => (
                  <button key={i} onClick={() => setQuery(q)} className="w-full text-left text-xs text-gov-500 hover:text-gov-400 hover:bg-gov-50 px-2 py-1.5 rounded transition-colors">{i + 1}. {q}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ''} subtitle={selected?.no} width="lg"
        footer={<button className="btn-secondary" onClick={() => setSelected(null)}>关闭</button>}>
        {selected && (
          <div className="flex gap-4">
            <div className="flex-1 space-y-3">
              <DetailSection title="法规基本信息">
                <FieldGrid cols={2}>
                  <FieldItem label="法规名称" value={selected.name} highlight />
                  <FieldItem label="文号" value={selected.no} />
                  <FieldItem label="发布机关" value={selected.org} />
                  <FieldItem label="类型" value={selected.type} />
                  <FieldItem label="施行日期" value={selected.effectDate} />
                  <FieldItem label="修订日期" value={selected.reviseDate || '未修订'} />
                </FieldGrid>
              </DetailSection>
              <DetailSection title="AI法规摘要" icon={<Sparkles size={14} className="text-indigo-500" />}>
                <div className="bg-indigo-50 rounded-lg p-3 text-sm text-indigo-800 leading-relaxed">{selected.aiSummary}</div>
              </DetailSection>
            </div>
            <div className="w-52 shrink-0">
              <AIPanel title="AI解读" items={[
                { label: '适用业务', value: '货运许可、客运许可、危货许可、从业人员管理、执法处罚等全章节', type: 'info' },
                { label: '修订追踪', value: selected.reviseDate ? `最近修订：${selected.reviseDate}，已更新知识库` : '暂无修订记录，为原始版本', type: 'success' },
              ]} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
