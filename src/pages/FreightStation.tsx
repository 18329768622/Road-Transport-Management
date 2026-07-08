import React, { useState } from 'react'
import { Plus, Sparkles, MapPin, BarChart3, Star, CheckCircle, AlertTriangle, Building2, TrendingUp } from 'lucide-react'
import DataTable from '../components/DataTable'
import { FilterBar, Pagination } from '../components/FilterBar'
import Modal, { DetailSection, FieldGrid, FieldItem } from '../components/Modal'
import StatusBadge, { AIBadge, RiskBadge } from '../components/StatusBadge'
import AIPanel from '../components/AIPanel'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts'

type STab = '站场档案' | '等级评定' | 'AI选址分析'

const stations = [
  { id: 'GY001', name: '市中央货运物流中心', grade: '一级', area: 85000, parkingCap: 320, address: '经济开发区物流大道1号', legalPerson: '张建军', phone: '13812340001', status: '正常运营', aiScore: 92, riskLevel: '低', openDate: '2018-05-20', certNo: 'GY2018001', certExpiry: '2028-05-19', dailyCargo: 2850, storageCap: 12000, loadingBays: 24 },
  { id: 'GY002', name: '北区货运综合站场', grade: '二级', area: 42000, parkingCap: 180, address: '工业北区货运路88号', legalPerson: '李文涛', phone: '13987650001', status: '正常运营', aiScore: 85, riskLevel: '低', openDate: '2019-08-15', certNo: 'GY2019002', certExpiry: '2029-08-14', dailyCargo: 1520, storageCap: 6500, loadingBays: 12 },
  { id: 'GY003', name: '南部物流分拨中心', grade: '一级', area: 63000, parkingCap: 250, address: '南部新城物流园B区', legalPerson: '王志强', phone: '15678900001', status: '正常运营', aiScore: 88, riskLevel: '低', openDate: '2020-03-10', certNo: 'GY2020003', certExpiry: '2030-03-09', dailyCargo: 2100, storageCap: 9800, loadingBays: 18 },
  { id: 'GY004', name: '东站公路货运站', grade: '三级', area: 18000, parkingCap: 80, address: '市区东路货运站广场', legalPerson: '赵建平', phone: '18923450002', status: '警告', aiScore: 52, riskLevel: '高', openDate: '2015-06-01', certNo: 'GY2015004', certExpiry: '2025-05-31', dailyCargo: 680, storageCap: 2200, loadingBays: 6 },
  { id: 'GY005', name: '西区冷链物流基地', grade: '二级', area: 35000, parkingCap: 140, address: '西部产业园冷链区', legalPerson: '陈冷链', phone: '13567890002', status: '正常运营', aiScore: 90, riskLevel: '低', openDate: '2021-11-20', certNo: 'GY2021005', certExpiry: '2031-11-19', dailyCargo: 980, storageCap: 4500, loadingBays: 10 },
]

const gradeItems = [
  { id: 'GR001', station: '市中央货运物流中心', currentGrade: '一级', applyGrade: '一级（续期）', applyDate: '2026-03-15', status: '审查中', aiScore: 94, evaluator: '李审核员', items: { area: true, parking: true, loading: true, info: true, safety: true, environ: true } },
  { id: 'GR002', station: '东站公路货运站', currentGrade: '三级', applyGrade: '二级', applyDate: '2026-04-10', status: '不通过', aiScore: 48, evaluator: '张审核员', items: { area: false, parking: false, loading: true, info: false, safety: true, environ: true } },
  { id: 'GR003', station: '西区冷链物流基地', currentGrade: '二级', applyGrade: '一级', applyDate: '2026-05-02', status: '待审查', aiScore: 88, evaluator: '未分配', items: { area: true, parking: true, loading: true, info: true, safety: true, environ: false } },
]

const locationCandidates = [
  { id: 'LC001', name: '城西物流新区选址A', area: 55000, score: 91, traffic: 88, source: 95, policy: 94, env: 85, recommend: true, reason: '紧邻高速入口，周边货源密集，政策支持力度大' },
  { id: 'LC002', name: '南部产业园选址B', area: 48000, score: 85, traffic: 82, source: 88, policy: 90, env: 78, recommend: true, reason: '产业园区配套完善，但距离铁路货运站偏远' },
  { id: 'LC003', name: '东区老站改造C', area: 22000, score: 61, traffic: 72, source: 65, policy: 55, env: 52, recommend: false, reason: '改造成本高，面积受限，不符合一级站场标准' },
]

const monthlyData = [
  { month: '1月', cargo: 2100, vehicles: 8500 },
  { month: '2月', cargo: 1850, vehicles: 7200 },
  { month: '3月', cargo: 2350, vehicles: 9100 },
  { month: '4月', cargo: 2580, vehicles: 9800 },
  { month: '5月', cargo: 2720, vehicles: 10200 },
  { month: '6月', cargo: 2850, vehicles: 10850 },
]

export default function FreightStation() {
  const [tab, setTab] = useState<STab>('站场档案')
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-gov-800">道路货运站场管理</h1>
            <p className="text-xs text-gray-500 mt-0.5">第五章 · 货运站场经营许可、等级评定、日常监督、GIS智能选址</p>
          </div>
          <div className="flex items-center gap-2">
            <AIBadge label="AI等级评定在线" />
            <button className="btn-primary"><Plus size={14} />新增站场申请</button>
          </div>
        </div>
        <div className="flex gap-1 mt-4 border-b border-gray-100 -mb-4">
          {(['站场档案', '等级评定', 'AI选址分析'] as STab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${tab === t ? 'border-gov-500 text-gov-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        {tab === '站场档案' && <StationArchive />}
        {tab === '等级评定' && <GradeEvaluation />}
        {tab === 'AI选址分析' && <LocationAnalysis />}
      </div>
    </div>
  )
}

function StationArchive() {
  const [selected, setSelected] = useState<typeof stations[0] | null>(null)
  const [gradeFilter, setGradeFilter] = useState('全部')
  const filtered = stations.filter(s => gradeFilter === '全部' || s.grade === gradeFilter)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '登记站场总数', value: '86', sub: '持有效许可证', color: 'text-gov-600', bg: 'bg-gov-50' },
          { label: '一级站场', value: '28', sub: '高等级站场', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: '二级站场', value: '35', sub: '中等规模', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: '三级站场', value: '23', sub: '含待升级', color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(s => (
          <div key={s.label} className={`card p-4 ${s.bg}`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-sm text-gray-600 mt-1">{s.label}</div>
            <div className={`text-xs ${s.color} mt-1`}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 card">
          <div className="card-header">
            <FilterBar searchPlaceholder="搜索站场名称/编号..."
              filters={[{ label: '等级', options: [{value:'全部',label:'全部'},{value:'一级',label:'一级'},{value:'二级',label:'二级'},{value:'三级',label:'三级'}], value: gradeFilter, onChange: setGradeFilter }]}
              onExport={() => {}} onRefresh={() => {}}
            />
          </div>
          <DataTable
            columns={[
              { key: 'id', title: '编号', width: 80 },
              { key: 'name', title: '站场名称', render: (v: string, row: any) => (
                <div><div className="font-medium text-sm">{v}</div><div className="text-xs text-gray-400">{row.certNo}</div></div>
              )},
              { key: 'grade', title: '站场等级', render: (v: string) => <StatusBadge label={v} variant={v === '一级' ? 'success' : v === '二级' ? 'info' : 'warning'} /> },
              { key: 'area', title: '占地面积(㎡)', render: (v: number) => v.toLocaleString() },
              { key: 'parkingCap', title: '停车位(辆)', align: 'center' as const },
              { key: 'loadingBays', title: '装卸位', align: 'center' as const },
              { key: 'dailyCargo', title: '日均吞吐(吨)', render: (v: number) => v.toLocaleString() },
              { key: 'aiScore', title: 'AI合规分', render: (v: number) => (
                <div className="flex items-center gap-1.5">
                  <div className="w-14 bg-gray-100 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${v >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${v}%` }} /></div>
                  <span className="text-xs font-medium">{v}</span>
                </div>
              )},
              { key: 'status', title: '状态', render: (v: string) => <StatusBadge label={v} variant={v === '正常运营' ? 'success' : 'warning'} /> },
            ]}
            data={filtered} rowKey="id" onRowClick={setSelected}
          />
        </div>

        <div className="space-y-4">
          <div className="card p-4">
            <div className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"><BarChart3 size={14} className="text-gov-500" />货物吞吐量趋势</div>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="cargo" fill="#0052CC" name="货物量(吨)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card p-4">
            <div className="text-sm font-semibold text-gray-700 mb-3">视频AI巡查状态</div>
            <div className="space-y-2">
              {[
                { name: '市中央货运物流中心', cameras: 32, alerts: 0, status: '正常' },
                { name: '北区货运综合站场', cameras: 18, alerts: 1, status: '预警' },
                { name: '南部物流分拨中心', cameras: 24, alerts: 0, status: '正常' },
                { name: '东站公路货运站', cameras: 8, alerts: 3, status: '异常' },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-xs">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${s.status === '正常' ? 'bg-emerald-500' : s.status === '预警' ? 'bg-amber-500' : 'bg-red-500'}`} />
                  <span className="flex-1 text-gray-600 truncate">{s.name}</span>
                  <span className="text-gray-400">{s.cameras}路</span>
                  {s.alerts > 0 && <span className="text-red-600 font-medium">{s.alerts}警</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ''} subtitle={`经营许可证：${selected?.certNo} · 货运站场档案`} width="xl"
        footer={<><button className="btn-secondary" onClick={() => setSelected(null)}>关闭</button><button className="btn-primary"><Sparkles size={13} />AI合规检查</button></>}>
        {selected && (
          <div className="flex gap-5">
            <div className="flex-1 space-y-4">
              <DetailSection title="站场基本信息">
                <FieldGrid cols={3}>
                  <FieldItem label="站场名称" value={selected.name} highlight />
                  <FieldItem label="经营许可证号" value={selected.certNo} />
                  <FieldItem label="等级" value={<StatusBadge label={selected.grade} variant={selected.grade === '一级' ? 'success' : selected.grade === '二级' ? 'info' : 'warning'} size="md" />} />
                  <FieldItem label="法定代表人" value={selected.legalPerson} />
                  <FieldItem label="联系电话" value={selected.phone} />
                  <FieldItem label="许可证有效期" value={selected.certExpiry} />
                  <FieldItem label="注册地址" value={selected.address} />
                  <FieldItem label="开业日期" value={selected.openDate} />
                  <FieldItem label="AI合规评分" value={`${selected.aiScore} 分`} />
                </FieldGrid>
              </DetailSection>
              <DetailSection title="硬件设施指标">
                <FieldGrid cols={3}>
                  <FieldItem label="占地面积" value={`${selected.area.toLocaleString()} ㎡`} highlight />
                  <FieldItem label="停车容量" value={`${selected.parkingCap} 辆`} />
                  <FieldItem label="装卸车位" value={`${selected.loadingBays} 个`} />
                  <FieldItem label="仓储能力" value={`${selected.storageCap.toLocaleString()} 吨`} />
                  <FieldItem label="日均吞吐量" value={`${selected.dailyCargo.toLocaleString()} 吨`} />
                  <FieldItem label="运营状态" value={<StatusBadge label={selected.status} variant={selected.status === '正常运营' ? 'success' : 'warning'} size="md" />} />
                </FieldGrid>
              </DetailSection>
              <DetailSection title="AI等级符合性审查">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: '占地面积达标', ok: selected.area >= 20000 },
                    { label: '停车容量达标', ok: selected.parkingCap >= 80 },
                    { label: '装卸设施配置', ok: selected.loadingBays >= 6 },
                    { label: '信息化系统', ok: selected.aiScore >= 60 },
                    { label: '消防安全合规', ok: selected.status !== '警告' },
                    { label: '环保设施配备', ok: selected.status !== '警告' },
                  ].map((c, i) => (
                    <div key={i} className={`flex items-center gap-2 p-2.5 rounded text-xs ${c.ok ? 'bg-emerald-50 border border-emerald-100 text-emerald-700' : 'bg-red-50 border border-red-100 text-red-700'}`}>
                      {c.ok ? <CheckCircle size={13} /> : <AlertTriangle size={13} />}
                      <span className="font-medium">{c.label}</span>
                    </div>
                  ))}
                </div>
              </DetailSection>
            </div>
            <div className="w-60 shrink-0">
              <AIPanel title="AI 站场监管分析" items={[
                { label: 'AI合规评分', value: <div className="text-2xl font-bold text-indigo-300">{selected.aiScore}<span className="text-sm ml-1">/ 100</span></div>, type: selected.aiScore >= 80 ? 'success' : 'warning' },
                { label: '视频AI巡查', value: selected.status === '警告' ? '近期发现3处违规堆放，建议立即整改' : '视频巡查正常，无违规行为', type: selected.status === '警告' ? 'warning' : 'success' },
                { label: '货源热力分析', value: `周边5km内货源密集度：${selected.aiScore >= 80 ? '高' : '中'}，主要方向：东南向，日均需求量约 ${selected.dailyCargo} 吨`, type: 'info' },
                { label: '许可到期提醒', value: `许可证 ${selected.certExpiry} 到期，请及时办理续期手续`, type: 'info' },
              ]} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function GradeEvaluation() {
  const [selected, setSelected] = useState<typeof gradeItems[0] | null>(null)
  const [aiRunning, setAiRunning] = useState(false)
  const [aiDone, setAiDone] = useState(false)

  const gradeColumns = [
    { key: 'id', title: '评定编号', width: 90 },
    { key: 'station', title: '站场名称', render: (v: string) => <span className="font-medium">{v}</span> },
    { key: 'currentGrade', title: '现等级', render: (v: string) => <StatusBadge label={v} variant="info" /> },
    { key: 'applyGrade', title: '申请等级', render: (v: string) => <StatusBadge label={v} variant="default" /> },
    { key: 'applyDate', title: '申请日期' },
    { key: 'aiScore', title: 'AI评定分', render: (v: number) => (
      <span className={`font-bold text-sm ${v >= 80 ? 'text-emerald-600' : v >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{v}</span>
    )},
    { key: 'evaluator', title: '评定人员' },
    { key: 'status', title: '状态', render: (v: string) => <StatusBadge label={v} variant={v === '通过' ? 'success' : v === '不通过' ? 'danger' : v === '审查中' ? 'warning' : 'default'} /> },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 card">
          <div className="card-header">
            <div className="card-title">等级评定申请</div>
            <div className="flex items-center gap-2">
              <AIBadge label="AI智能评定" />
              <button onClick={() => { setAiRunning(true); setTimeout(() => { setAiRunning(false); setAiDone(true) }, 2000) }}
                disabled={aiRunning} className="btn-primary text-xs py-1.5">
                <Sparkles size={12} />{aiRunning ? 'AI评定中...' : '批量AI评定'}
              </button>
            </div>
          </div>
          {aiDone && (
            <div className="mx-4 mb-3 flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
              <CheckCircle size={14} />AI批量评定完成：3项申请已评定，1项通过，1项不通过，1项需补充材料
            </div>
          )}
          <DataTable columns={gradeColumns} data={gradeItems} rowKey="id" onRowClick={setSelected} />
        </div>

        <div className="card p-4 space-y-4">
          <div className="text-sm font-semibold text-gray-700 flex items-center gap-2"><Star size={14} className="text-amber-500" />AI等级评定标准</div>
          {[
            { label: '一级站场', items: ['占地≥40000㎡', '停车位≥150辆', '信息系统完善', '消防环保达标'] },
            { label: '二级站场', items: ['占地≥20000㎡', '停车位≥80辆', '基础信息化', '安全设施齐全'] },
            { label: '三级站场', items: ['占地≥5000㎡', '停车位≥30辆', '基本功能具备', '消防达标'] },
          ].map(g => (
            <div key={g.label} className="p-3 rounded-lg bg-gray-50 border border-gray-100">
              <div className="text-xs font-semibold text-gov-600 mb-2">{g.label}</div>
              <div className="space-y-1">
                {g.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-gray-600"><div className="w-1 h-1 rounded-full bg-gov-400 shrink-0" />{item}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={`等级评定详情 — ${selected?.station}`} subtitle={`评定编号：${selected?.id}`} width="lg"
        footer={<><button className="btn-secondary" onClick={() => setSelected(null)}>关闭</button><button className="btn-primary"><Sparkles size={13} />生成评定报告</button></>}>
        {selected && (
          <div className="flex gap-5">
            <div className="flex-1 space-y-4">
              <DetailSection title="评定基本信息">
                <FieldGrid cols={2}>
                  <FieldItem label="申请单位" value={selected.station} highlight />
                  <FieldItem label="申请等级" value={selected.applyGrade} />
                  <FieldItem label="申请日期" value={selected.applyDate} />
                  <FieldItem label="评定人员" value={selected.evaluator} />
                </FieldGrid>
              </DetailSection>
              <DetailSection title="AI逐项评定结果">
                <div className="space-y-2">
                  {[
                    { label: '占地面积', ok: selected.items.area, detail: selected.items.area ? '面积符合申请等级要求' : '面积不足，需扩建或降低申请等级' },
                    { label: '停车容量', ok: selected.items.parking, detail: selected.items.parking ? '停车位数量达标' : '停车位数量不足标准要求' },
                    { label: '装卸设施', ok: selected.items.loading, detail: '装卸车位及设备配置符合要求' },
                    { label: '信息化建设', ok: selected.items.info, detail: selected.items.info ? '已建立货运管理信息系统' : '信息系统建设不完善' },
                    { label: '安全消防', ok: selected.items.safety, detail: '消防设施符合规范要求' },
                    { label: '环保设施', ok: selected.items.environ, detail: selected.items.environ ? '环保设施齐全，达标' : '部分环保设施缺失' },
                  ].map((c, i) => (
                    <div key={i} className={`flex items-start gap-3 p-2.5 rounded-lg border ${c.ok ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                      <div className={`mt-0.5 shrink-0 ${c.ok ? 'text-emerald-500' : 'text-red-500'}`}>{c.ok ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}</div>
                      <div><div className={`text-xs font-semibold ${c.ok ? 'text-emerald-700' : 'text-red-700'}`}>{c.label}</div><div className="text-xs text-gray-500 mt-0.5">{c.detail}</div></div>
                    </div>
                  ))}
                </div>
              </DetailSection>
            </div>
            <div className="w-60 shrink-0">
              <AIPanel title="AI 评定结论" items={[
                { label: 'AI综合评分', value: <div className="text-2xl font-bold text-indigo-300">{selected.aiScore}<span className="text-sm ml-1">/ 100</span></div>, type: selected.aiScore >= 80 ? 'success' : 'warning' },
                { label: '评定结论', value: selected.status === '通过' ? `符合${selected.applyGrade}全部条件，建议准予评定` : selected.status === '不通过' ? '存在多项不达标项，不符合申请等级，建议降级或整改后重新申请' : 'AI初步评定中，需补充部分材料后完成评定', type: selected.status === '通过' ? 'success' : 'warning' },
                { label: '改进建议', value: Object.values(selected.items).filter(v => !v).length > 0 ? `共 ${Object.values(selected.items).filter(v => !v).length} 项不达标，请按标准逐项整改` : '全部评定项均已达标', type: Object.values(selected.items).filter(v => !v).length > 0 ? 'warning' : 'success' },
              ]} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function LocationAnalysis() {
  const [selected, setSelected] = useState<typeof locationCandidates[0] | null>(null)

  const radarData = selected ? [
    { subject: '交通便利性', A: selected.traffic },
    { subject: '货源密集度', A: selected.source },
    { subject: '政策支持度', A: selected.policy },
    { subject: '环境适宜性', A: selected.env },
    { subject: 'AI综合评分', A: selected.score },
  ] : []

  return (
    <div className="space-y-4">
      <div className="bg-gov-50 border border-gov-200 rounded-lg p-4 flex items-start gap-3">
        <Sparkles size={16} className="text-gov-500 mt-0.5 shrink-0" />
        <div>
          <div className="text-sm font-semibold text-gov-700">AI智能选址评估系统</div>
          <div className="text-xs text-gov-500 mt-1">基于GIS地理信息、货源热力分析、交通可达性、政策环境等多维度数据，为新建货运站场提供科学选址建议</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 card">
          <div className="card-header">
            <div className="card-title">选址候选方案</div>
            <AIBadge label="GIS多维评分" />
          </div>
          <div className="p-4 space-y-3">
            {locationCandidates.map(lc => (
              <div key={lc.id} onClick={() => setSelected(lc)}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${selected?.id === lc.id ? 'border-gov-400 bg-gov-50' : 'border-gray-200 bg-white hover:border-gov-300'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-gov-500" />
                      <span className="font-semibold text-gray-800 text-sm">{lc.name}</span>
                      {lc.recommend && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">推荐</span>}
                    </div>
                    <div className="text-xs text-gray-500 mt-1.5 ml-5">{lc.reason}</div>
                    <div className="flex items-center gap-4 mt-2 ml-5">
                      {[
                        { label: '交通', val: lc.traffic },
                        { label: '货源', val: lc.source },
                        { label: '政策', val: lc.policy },
                        { label: '环境', val: lc.env },
                      ].map(d => (
                        <div key={d.label} className="flex items-center gap-1 text-xs">
                          <span className="text-gray-400">{d.label}</span>
                          <div className="w-10 bg-gray-100 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${d.val >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${d.val}%` }} /></div>
                          <span className="text-gray-600 font-medium">{d.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-center ml-4">
                    <div className={`text-2xl font-bold ${lc.score >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>{lc.score}</div>
                    <div className="text-xs text-gray-400">AI评分</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {selected ? (
            <>
              <div className="card p-4">
                <div className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"><TrendingUp size={14} className="text-gov-500" />{selected.name}</div>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9 }} />
                    <Radar dataKey="A" stroke="#0052CC" fill="#0052CC" fillOpacity={0.2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <AIPanel title="AI 选址建议" items={[
                { label: 'AI综合评分', value: <div className="text-2xl font-bold text-indigo-300">{selected.score}<span className="text-sm ml-1">/ 100</span></div>, type: selected.score >= 80 ? 'success' : 'warning' },
                { label: 'AI选址评价', value: selected.reason, type: selected.recommend ? 'success' : 'warning' },
                { label: '最优推荐', value: selected.recommend ? '综合评分达标，建议优先考虑此选址方案' : '此方案存在明显短板，不建议作为首选方案', type: selected.recommend ? 'success' : 'warning' },
              ]} />
            </>
          ) : (
            <div className="card p-6 text-center text-gray-400 text-sm">点击左侧方案查看AI雷达分析</div>
          )}
        </div>
      </div>
    </div>
  )
}
