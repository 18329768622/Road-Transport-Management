import React, { useState } from 'react'
import { Users, Award, TrendingUp, Sparkles, Plus, Star, BookOpen } from 'lucide-react'
import DataTable from '../components/DataTable'
import { FilterBar } from '../components/FilterBar'
import Modal, { DetailSection, FieldGrid, FieldItem } from '../components/Modal'
import StatusBadge, { RiskBadge, AIBadge } from '../components/StatusBadge'
import AIPanel from '../components/AIPanel'
import { personnel } from '../data/mockData'

type PTab = '人员档案' | '资格证管理' | '诚信考核' | '考试管理'

export default function Personnel({ initialTab }: { initialTab?: PTab }) {
  const [tab, setTab] = useState<PTab>(initialTab ?? '人员档案')
  const [selected, setSelected] = useState<any>(null)

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-gov-800">道路运输从业人员管理</h1>
            <p className="text-xs text-gray-500 mt-0.5">第十一章 · 从业条件校验、资格证发放、诚信考核、考试管理</p>
          </div>
          <div className="flex items-center gap-2">
            <AIBadge label="AI行为画像" />
            <button className="btn-primary"><Plus size={14} />新增人员</button>
          </div>
        </div>
        <div className="flex gap-1 mt-4 border-b border-gray-100 -mb-4">
          {(['人员档案', '资格证管理', '诚信考核', '考试管理'] as PTab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${tab === t ? 'border-gov-500 text-gov-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {tab === '人员档案' && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: '在册从业人员', value: '45,600', sub: '持有效资格证', color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: '即将到期证件', value: 820, sub: '90天内到期', color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: '高风险从业人员', value: 156, sub: 'AI风险预测', color: 'text-red-600', bg: 'bg-red-50' },
                { label: '本月新增', value: 238, sub: '通过资格考试', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              ].map(s => (
                <div key={s.label} className={`card p-4 ${s.bg}`}>
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-sm text-gray-600 mt-1">{s.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="card-header">
                <FilterBar
                  searchPlaceholder="搜索姓名/身份证号/证件号..."
                  filters={[
                    { label: '资格类型', options: [{value:'全部',label:'全部'},{value:'普通货运',label:'普通货运'},{value:'旅客运输',label:'旅客运输'},{value:'危险货物运输',label:'危货运输'}], value: '全部', onChange: () => {} },
                    { label: '诚信等级', options: [{value:'全部',label:'全部'},{value:'AA',label:'AA'},{value:'A',label:'A'},{value:'B',label:'B'}], value: '全部', onChange: () => {} },
                  ]}
                />
              </div>
              <DataTable
                columns={[
                  { key: 'id', title: '人员编号', width: 90 },
                  { key: 'name', title: '姓名', render: (v: string) => <span className="font-medium">{v}</span> },
                  { key: 'age', title: '年龄', align: 'center' as const },
                  { key: 'driverLicense', title: '驾驶证类型' },
                  { key: 'licenseYears', title: '驾龄(年)', align: 'center' as const },
                  { key: 'certType', title: '从业资格类型', render: (v: string) => (
                    <span className="text-xs bg-gov-50 text-gov-600 px-2 py-0.5 rounded">{v}</span>
                  )},
                  { key: 'certNo', title: '资格证编号' },
                  { key: 'certExpiry', title: '证件到期' },
                  { key: 'company', title: '所属单位' },
                  { key: 'integrityLevel', title: '诚信等级', render: (v: string) => (
                    <StatusBadge label={v} variant={v === 'AA' ? 'success' : v === 'A' ? 'info' : 'warning'} />
                  )},
                  { key: 'integrityScore', title: '诚信分', render: (v: number) => (
                    <div className="flex items-center gap-1.5">
                      <Star size={11} className={v >= 90 ? 'text-amber-400' : 'text-gray-300'} fill={v >= 90 ? 'currentColor' : 'none'} />
                      <span className="text-sm font-semibold">{v}</span>
                    </div>
                  )},
                  { key: 'aiRisk', title: 'AI风险', render: (v: string) => <RiskBadge level={v as any} /> },
                ]}
                data={personnel}
                rowKey="id"
                onRowClick={setSelected}
              />
            </div>
          </div>
        )}

        {tab === '资格证管理' && <CertificateManagement />}
        {tab === '诚信考核' && <IntegrityAssessment />}
        {tab === '考试管理' && <ExamManagement />}
      </div>

      {/* Person Detail */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={`从业人员档案 — ${selected?.name}`}
        subtitle={`人员编号：${selected?.id}`}
        width="xl"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setSelected(null)}>关闭</button>
            <button className="btn-primary"><Sparkles size={13} />AI从业条件校验</button>
            <button className="btn-primary"><Award size={13} />诚信考核详情</button>
          </>
        }
      >
        {selected && (
          <div className="flex gap-5">
            <div className="flex-1 space-y-4">
              <DetailSection title="个人基本信息">
                <FieldGrid cols={3}>
                  <FieldItem label="姓名" value={selected.name} highlight />
                  <FieldItem label="年龄" value={`${selected.age} 岁`} />
                  <FieldItem label="驾驶证类型" value={selected.driverLicense} />
                  <FieldItem label="驾龄" value={`${selected.licenseYears} 年`} />
                  <FieldItem label="身份证号" value={`${selected.idCard.slice(0, 6)}****${selected.idCard.slice(-4)}`} />
                  <FieldItem label="所属单位" value={selected.company} />
                </FieldGrid>
              </DetailSection>

              <DetailSection title="从业资格信息">
                <FieldGrid cols={3}>
                  <FieldItem label="资格证类型" value={selected.certType} highlight />
                  <FieldItem label="资格证编号" value={selected.certNo} />
                  <FieldItem label="证件到期" value={selected.certExpiry} />
                </FieldGrid>
              </DetailSection>

              <DetailSection title="AI从业条件校验" icon={<Sparkles size={14} className="text-indigo-500" />}>
                <div className="space-y-1.5">
                  {[
                    { cond: '持有合法驾驶证', ok: true, note: `${selected.driverLicense}类驾驶证，有效期内` },
                    { cond: '驾龄满要求', ok: selected.licenseYears >= 3, note: `驾龄${selected.licenseYears}年，符合3年以上要求` },
                    { cond: '年龄未超60周岁', ok: selected.age < 60, note: `${selected.age}岁，符合要求` },
                    { cond: '3年内无重大事故', ok: selected.lastViolation === '无', note: selected.lastViolation === '无' ? '3年内无重大交通事故记录' : `发现违规记录：${selected.lastViolation}` },
                    { cond: '通过从业资格考试', ok: true, note: '考试合格，资格证有效' },
                  ].map((c, i) => (
                    <div key={i} className={`flex items-center gap-2 p-2 rounded text-xs ${c.ok ? 'bg-emerald-50' : 'bg-red-50'}`}>
                      <span className={c.ok ? 'text-emerald-500' : 'text-red-500'}>{c.ok ? '✓' : '✗'}</span>
                      <span className={`font-medium w-36 shrink-0 ${c.ok ? 'text-emerald-700' : 'text-red-700'}`}>{c.cond}</span>
                      <span className={c.ok ? 'text-emerald-600' : 'text-red-600'}>{c.note}</span>
                    </div>
                  ))}
                </div>
              </DetailSection>

              <DetailSection title="诚信考核记录">
                <FieldGrid cols={3}>
                  <FieldItem label="诚信等级" value={<StatusBadge label={selected.integrityLevel} variant={selected.integrityLevel === 'AA' ? 'success' : 'info'} size="md" />} highlight />
                  <FieldItem label="诚信评分" value={`${selected.integrityScore} / 100`} />
                  <FieldItem label="最近违规" value={selected.lastViolation} />
                </FieldGrid>
              </DetailSection>
            </div>
            <div className="w-64 shrink-0">
              <AIPanel
                title="AI 从业人员画像"
                items={[
                  { label: '综合风险评估', value: `风险等级：${selected.aiRisk}，评估维度：驾驶行为/违规记录/证件状态/执业年限`, type: selected.aiRisk === '低' ? 'success' : 'warning' },
                  { label: '驾驶行为分析', value: selected.aiRisk === '低' ? '驾驶行为规范，无超速疲劳驾驶记录，行为模式良好' : '发现异常驾驶行为，近期违规频率上升，建议加强教育', type: selected.aiRisk === '低' ? 'success' : 'warning' },
                  { label: '证件到期提醒', value: `资格证到期时间：${selected.certExpiry}，请提前60天办理换证`, type: 'info' },
                  { label: 'AI学习推荐', value: '推荐学习：《道路运输安全驾驶手册》第3章、《疲劳驾驶预防指南》', type: 'normal' },
                ]}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function CertificateManagement() {
  const certs = [
    { id: 'CZ001', certNo: 'CZ2020001', name: '李建军', type: '普通货运', issueDate: '2020-05-20', expiry: '2026-05-19', status: '有效', aiOcr: '已验证', blockHash: '0x7a3f...c8d2' },
    { id: 'CZ002', certNo: 'HZ-DR-2020001', name: '张志远', type: '危险货物运输', issueDate: '2020-08-15', expiry: '2026-08-14', status: '有效', aiOcr: '已验证', blockHash: '0x2b1e...a5f3' },
    { id: 'CZ003', certNo: 'CZ2018022', name: '赵小华', type: '普通货运', issueDate: '2018-09-30', expiry: '2024-09-29', status: '即将到期', aiOcr: '已验证', blockHash: '0x9c4d...b7e1' },
    { id: 'CZ004', certNo: 'KY-DR-2021005', name: '陈海波', type: '旅客运输', issueDate: '2021-03-20', expiry: '2027-03-19', status: '有效', aiOcr: '已验证', blockHash: '0x3f7a...d9c4' },
  ]
  return (
    <div className="card">
      <div className="card-header">
        <FilterBar searchPlaceholder="搜索姓名/证件号..." filters={[
          { label: '资格类型', options: [{value:'全部',label:'全部'},{value:'普通货运',label:'货运'},{value:'旅客运输',label:'客运'},{value:'危险货物运输',label:'危货'}], value: '全部', onChange: () => {} },
        ]} />
      </div>
      <DataTable
        columns={[
          { key: 'certNo', title: '资格证编号' },
          { key: 'name', title: '持证人员', render: (v: string) => <span className="font-medium">{v}</span> },
          { key: 'type', title: '资格类型', render: (v: string) => <span className="text-xs bg-gov-50 text-gov-600 px-2 py-0.5 rounded">{v}</span> },
          { key: 'issueDate', title: '发证日期' },
          { key: 'expiry', title: '到期日期' },
          { key: 'aiOcr', title: 'AI区块链验证', render: (v: string, row: any) => (
            <div className="flex items-center gap-1.5 text-xs">
              <Sparkles size={10} className="text-indigo-400" />
              <span className="text-emerald-600">{v}</span>
              <span className="text-gray-400 font-mono text-[10px]">{row.blockHash}</span>
            </div>
          )},
          { key: 'status', title: '状态', render: (v: string) => <StatusBadge label={v} variant={v === '有效' ? 'success' : 'warning'} /> },
        ]}
        data={certs}
        rowKey="id"
      />
    </div>
  )
}

function IntegrityAssessment() {
  const assessments = [
    { id: 'IA001', name: '李建军', year: 2024, score: 95, level: 'AA', violations: 0, deductions: 0, status: '已完成' },
    { id: 'IA002', name: '张志远', year: 2024, score: 88, level: 'A', violations: 1, deductions: 5, status: '已完成' },
    { id: 'IA003', name: '王大明', year: 2024, score: 72, level: 'B', violations: 3, deductions: 20, status: '已完成' },
    { id: 'IA004', name: '赵小华', year: 2024, score: 55, level: 'B', violations: 5, deductions: 35, status: '已完成' },
    { id: 'IA005', name: '陈海波', year: 2024, score: 98, level: 'AA', violations: 0, deductions: 0, status: '已完成' },
  ]
  const [selected, setSelected] = useState<any>(null)

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="card-header">
          <div className="card-title">诚信考核管理（2024年度）</div>
          <AIBadge label="AI自动计分" />
        </div>
        <DataTable
          columns={[
            { key: 'id', title: '编号', width: 80 },
            { key: 'name', title: '姓名', render: (v: string) => <span className="font-medium">{v}</span> },
            { key: 'year', title: '考核年度', align: 'center' as const },
            { key: 'violations', title: '违规次数', align: 'center' as const, render: (v: number) => <span className={v > 0 ? 'text-red-600 font-semibold' : 'text-gray-500'}>{v}</span> },
            { key: 'deductions', title: 'AI扣分', align: 'center' as const, render: (v: number) => <span className={v > 0 ? 'text-red-600' : 'text-emerald-600'}>-{v}</span> },
            { key: 'score', title: '诚信分', render: (v: number) => (
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-100 rounded-full h-2">
                  <div className={`h-2 rounded-full ${v >= 90 ? 'bg-emerald-500' : v >= 70 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${v}%` }} />
                </div>
                <span className={`font-semibold ${v >= 90 ? 'text-emerald-600' : v >= 70 ? 'text-amber-600' : 'text-red-600'}`}>{v}</span>
              </div>
            )},
            { key: 'level', title: '考核等级', render: (v: string) => (
              <StatusBadge label={v} variant={v === 'AA' ? 'success' : v === 'A' ? 'info' : 'warning'} />
            )},
            { key: 'status', title: '状态', render: (v: string) => <StatusBadge label={v} variant="success" /> },
          ]}
          data={assessments}
          rowKey="id"
          onRowClick={setSelected}
        />
      </div>
      <Modal open={!!selected} onClose={() => setSelected(null)} title={`诚信考核详情 — ${selected?.name}`} width="lg">
        {selected && (
          <div className="flex gap-4">
            <div className="flex-1 space-y-3">
              <DetailSection title="考核基本情况">
                <FieldGrid cols={2}>
                  <FieldItem label="考核年度" value={selected.year} />
                  <FieldItem label="最终诚信分" value={`${selected.score} / 100`} highlight />
                  <FieldItem label="违规次数" value={selected.violations} />
                  <FieldItem label="AI扣分合计" value={`-${selected.deductions} 分`} />
                  <FieldItem label="考核等级" value={<StatusBadge label={selected.level} variant={selected.level === 'AA' ? 'success' : 'info'} />} />
                  <FieldItem label="状态" value="已完成" />
                </FieldGrid>
              </DetailSection>
            </div>
            <div className="w-52 shrink-0">
              <AIPanel title="AI考核分析" items={[
                { label: 'AI计分明细', value: `违规扣分：-${selected.deductions}分（共${selected.violations}次违规）`, type: selected.deductions > 0 ? 'warning' : 'success' },
                { label: '同业对标', value: `本等级平均分${selected.level === 'AA' ? 96.2 : selected.level === 'A' ? 88.5 : 68.3}分，${selected.score >= 88 ? '高于' : '低于'}平均水平`, type: 'info' },
                { label: 'AI改进建议', value: selected.level === 'B' ? '建议加强安全教育培训，规范驾驶行为，避免再次违规' : '继续保持良好驾驶习惯，建议年内完成1次继续教育', type: selected.level === 'B' ? 'warning' : 'success' },
              ]} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function ExamManagement() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="card p-5 space-y-4">
        <div className="font-semibold text-gov-700">考点管理</div>
        {[
          { name: '市交通运输局考试中心', capacity: 200, status: '正常运营' },
          { name: '南区职业技能鉴定所', capacity: 120, status: '正常运营' },
          { name: '东区驾培考试基地', capacity: 80, status: '维修暂停' },
        ].map(cp => (
          <div key={cp.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="text-sm font-medium">{cp.name}</div>
              <div className="text-xs text-gray-400 mt-0.5">容纳 {cp.capacity} 人/场次</div>
            </div>
            <StatusBadge label={cp.status} variant={cp.status === '正常运营' ? 'success' : 'warning'} />
          </div>
        ))}
      </div>
      <div className="card p-5 space-y-4">
        <div className="font-semibold text-gov-700 flex items-center gap-2">
          <Sparkles size={14} className="text-indigo-500" />
          AI智能命题系统
        </div>
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-xs text-indigo-700">
          AI可根据考核大纲自动生成试题，包含理论知识、法规条款、案例分析三类题型，支持难度控制和知识点均衡分布
        </div>
        <div className="grid grid-cols-3 gap-2">
          {['货运题库 8,523题', '客运题库 6,218题', '危货题库 4,892题'].map(t => (
            <div key={t} className="text-center p-3 bg-gov-50 rounded-lg">
              <div className="text-xs text-gov-600 font-medium">{t}</div>
            </div>
          ))}
        </div>
        <button className="btn-primary w-full justify-center"><Plus size={13} />AI生成本期试卷</button>
      </div>
    </div>
  )
}
