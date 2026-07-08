import React, { useState } from 'react'
import { Plus, Sparkles, CheckCircle, AlertTriangle, Globe, FileSearch, Scan, MapPin, TrendingUp } from 'lucide-react'
import DataTable from '../components/DataTable'
import { FilterBar } from '../components/FilterBar'
import Modal, { DetailSection, FieldGrid, FieldItem } from '../components/Modal'
import StatusBadge, { AIBadge, RiskBadge } from '../components/StatusBadge'
import AIPanel from '../components/AIPanel'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

type ITab = '许可管理' | '口岸查验' | '车辆管理'

const intlPermits = [
  { id: 'GJ001', company: '丝路国际运输有限公司', country: '中国', routeType: '中俄', routes: 3, vehicles: 12, drivers: 15, certNo: 'GJ2022001', certExpiry: '2027-05-19', status: '有效', aiScore: 92, riskLevel: '低', legalPerson: '张丝路', phone: '13812340040' },
  { id: 'GJ002', company: '亚欧物流运输公司', country: '中国', routeType: '中哈', routes: 2, vehicles: 8, drivers: 10, certNo: 'GJ2023002', certExpiry: '2028-08-14', status: '有效', aiScore: 88, riskLevel: '低', legalPerson: '李亚欧', phone: '13987650040' },
  { id: 'GJ003', company: '边境货运专业公司', country: '中国', routeType: '中越', routes: 4, vehicles: 18, drivers: 22, certNo: 'GJ2021003', certExpiry: '2026-12-31', status: '即将到期', aiScore: 82, riskLevel: '中', legalPerson: '王边境', phone: '15678900040' },
  { id: 'GJ004', company: '国际快运物流集团', country: '中国', routeType: '中蒙', routes: 5, vehicles: 25, drivers: 30, certNo: 'GJ2023004', certExpiry: '2028-03-09', status: '有效', aiScore: 95, riskLevel: '低', legalPerson: '陈国际', phone: '18923450040' },
]

const inspectionRecords = [
  { id: 'QY001', plate: '粤A12399', company: '丝路国际运输', nationality: '中国', checkpoint: '皇岗口岸', direction: '出境', time: '2024-06-20 08:32', cargo: '机械零件', weight: 18.5, docStatus: '正常', aiResult: '通过', riskLevel: '低', aiConfidence: 98.5 },
  { id: 'QY002', plate: '俄ABX1234', company: '俄方车辆', nationality: '俄罗斯', checkpoint: '满洲里口岸', direction: '入境', time: '2024-06-20 09:15', cargo: '原材料', weight: 22.0, docStatus: '正常', aiResult: '通过', riskLevel: '低', aiConfidence: 97.2 },
  { id: 'QY003', plate: '粤B23499', company: '亚欧物流', nationality: '中国', checkpoint: '霍尔果斯口岸', direction: '出境', time: '2024-06-20 10:42', cargo: '化工品', weight: 16.8, docStatus: '缺失文件', aiResult: '待核查', riskLevel: '高', aiConfidence: 85.1 },
  { id: 'QY004', plate: '越HA45678', company: '越方车辆', nationality: '越南', checkpoint: '友谊关口岸', direction: '入境', time: '2024-06-20 11:20', cargo: '农产品', weight: 8.5, docStatus: '正常', aiResult: '通过', riskLevel: '低', aiConfidence: 99.1 },
  { id: 'QY005', plate: '粤C34599', company: '边境货运', nationality: '中国', checkpoint: '友谊关口岸', direction: '出境', time: '2024-06-20 13:05', cargo: '电子产品', weight: 12.3, docStatus: '异常', aiResult: '拦截', riskLevel: '极高', aiConfidence: 62.4 },
]

const intlVehicles = [
  { id: 'IV001', plate: '粤A12399', vin: 'LBEV4EF02K1234001', brand: '东风天龙', nationality: '中国', company: '丝路国际运输', permitType: '中俄运输', permitNo: 'ZE2024001', permitExpiry: '2025-06-30', status: '有效', crossings30: 8, lastCrossing: '2024-06-20' },
  { id: 'IV002', plate: '粤B23499', vin: 'LBEV4EF02K2345002', brand: '解放J6', nationality: '中国', company: '亚欧物流', permitType: '中哈运输', permitNo: 'ZH2024002', permitExpiry: '2025-08-31', status: '有效', crossings30: 5, lastCrossing: '2024-06-18' },
  { id: 'IV003', plate: '粤C34599', vin: 'LBEV4EF02K3456003', brand: '陕汽德龙', nationality: '中国', company: '边境货运', permitType: '中越运输', permitNo: 'ZY2024003', permitExpiry: '2024-12-31', status: '即将到期', crossings30: 12, lastCrossing: '2024-06-20' },
  { id: 'IV004', plate: '俄ABX1234', vin: 'RUAB1EF02K4567004', brand: 'KAMAZ', nationality: '俄罗斯', company: '俄方合作商', permitType: '中俄运输', permitNo: 'EZR2024004', permitExpiry: '2025-03-31', status: '有效', crossings30: 6, lastCrossing: '2024-06-20' },
]

const checkpointStats = [
  { name: '皇岗口岸', vehicles: 185, inspected: 185, passed: 182, intercepted: 3 },
  { name: '满洲里口岸', vehicles: 142, inspected: 142, passed: 140, intercepted: 2 },
  { name: '霍尔果斯口岸', vehicles: 98, inspected: 98, passed: 95, intercepted: 3 },
  { name: '友谊关口岸', vehicles: 76, inspected: 76, passed: 74, intercepted: 2 },
]

export default function InternationalTransport() {
  const [tab, setTab] = useState<ITab>('许可管理')
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-gov-800">国际道路运输管理</h1>
            <p className="text-xs text-gray-500 mt-0.5">第十三章 · 国际运输许可、口岸AI查验、车辆国籍识别、单证OCR核验</p>
          </div>
          <div className="flex items-center gap-2">
            <AIBadge label="AI口岸查验在线" />
            <button className="btn-primary"><Plus size={14} />新增国际运输申请</button>
          </div>
        </div>
        <div className="flex gap-1 mt-4 border-b border-gray-100 -mb-4">
          {(['许可管理', '口岸查验', '车辆管理'] as ITab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${tab === t ? 'border-gov-500 text-gov-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {t}
              {t === '口岸查验' && <span className="ml-1.5 px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-xs">1拦截</span>}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        {tab === '许可管理' && <PermitManagement />}
        {tab === '口岸查验' && <BorderInspection />}
        {tab === '车辆管理' && <IntlVehicleManagement />}
      </div>
    </div>
  )
}

function PermitManagement() {
  const [selected, setSelected] = useState<typeof intlPermits[0] | null>(null)
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '持证经营企业', value: '38', sub: '国际运输许可', color: 'text-gov-600', bg: 'bg-gov-50' },
          { label: '国际运输车辆', value: '485', sub: '已备案', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: '运营线路国别', value: '12', sub: '合作国家/地区', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: '即将到期许可', value: '5', sub: '需续期提醒', color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(s => (
          <div key={s.label} className={`card p-4 ${s.bg}`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-sm text-gray-600 mt-1">{s.label}</div>
            <div className={`text-xs ${s.color} mt-1`}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <FilterBar searchPlaceholder="搜索企业名称/线路..."
            filters={[
              { label: '线路类型', options: [{value:'全部',label:'全部'},{value:'中俄',label:'中俄'},{value:'中哈',label:'中哈'},{value:'中越',label:'中越'},{value:'中蒙',label:'中蒙'}], value: '全部', onChange: () => {} },
              { label: '状态', options: [{value:'全部',label:'全部'},{value:'有效',label:'有效'},{value:'即将到期',label:'即将到期'}], value: '全部', onChange: () => {} },
            ]}
            onExport={() => {}} onRefresh={() => {}}
          />
        </div>
        <DataTable
          columns={[
            { key: 'id', title: '编号', width: 80 },
            { key: 'company', title: '经营企业', render: (v: string, row: any) => (
              <div><div className="font-medium text-sm">{v}</div><div className="text-xs text-gray-400">{row.certNo}</div></div>
            )},
            { key: 'routeType', title: '运营线路', render: (v: string) => <StatusBadge label={v} variant="info" /> },
            { key: 'legalPerson', title: '法人代表' },
            { key: 'routes', title: '运营线路(条)', align: 'center' as const },
            { key: 'vehicles', title: '车辆(辆)', align: 'center' as const },
            { key: 'drivers', title: '驾驶员(人)', align: 'center' as const },
            { key: 'certExpiry', title: '许可证到期' },
            { key: 'aiScore', title: 'AI监管分', render: (v: number) => (
              <span className={`font-bold text-sm ${v >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>{v}</span>
            )},
            { key: 'status', title: '状态', render: (v: string) => <StatusBadge label={v} variant={v === '有效' ? 'success' : 'warning'} /> },
          ]}
          data={intlPermits} rowKey="id" onRowClick={setSelected}
        />
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.company ?? ''} subtitle={`许可证：${selected?.certNo} · ${selected?.routeType}国际运输`} width="xl"
        footer={<><button className="btn-secondary" onClick={() => setSelected(null)}>关闭</button><button className="btn-primary"><Sparkles size={13} />AI合规检查</button></>}>
        {selected && (
          <div className="flex gap-5">
            <div className="flex-1 space-y-4">
              <DetailSection title="许可基本信息">
                <FieldGrid cols={3}>
                  <FieldItem label="企业名称" value={selected.company} highlight />
                  <FieldItem label="运营线路类型" value={selected.routeType} />
                  <FieldItem label="许可证号" value={selected.certNo} />
                  <FieldItem label="法定代表人" value={selected.legalPerson} />
                  <FieldItem label="联系电话" value={selected.phone} />
                  <FieldItem label="许可证有效期" value={selected.certExpiry} />
                  <FieldItem label="运营班线数" value={`${selected.routes} 条`} />
                  <FieldItem label="在运车辆数" value={`${selected.vehicles} 辆`} />
                  <FieldItem label="驾驶员人数" value={`${selected.drivers} 人`} />
                </FieldGrid>
              </DetailSection>
              <DetailSection title="AI许可条件审查">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: '经营资质符合要求', ok: true },
                    { label: '国际线路批复文件', ok: true },
                    { label: '驾驶员国际驾照', ok: selected.aiScore >= 80 },
                    { label: '车辆技术达标', ok: true },
                    { label: '国籍标志规范粘贴', ok: selected.aiScore >= 80 },
                    { label: '口岸通关备案', ok: selected.status === '有效' },
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
              <AIPanel title="AI 国际运输监管" items={[
                { label: 'AI监管评分', value: <div className="text-2xl font-bold text-indigo-300">{selected.aiScore}<span className="text-sm ml-1">/ 100</span></div>, type: selected.aiScore >= 80 ? 'success' : 'warning' },
                { label: '风险评级', value: `${selected.riskLevel}风险，基于通关记录、违规历史、车况综合评估`, type: selected.riskLevel === '低' ? 'success' : 'warning' },
                { label: '许可到期提醒', value: `许可证 ${selected.certExpiry} 到期，请提前90天申请续期`, type: selected.status === '即将到期' ? 'warning' : 'info' },
              ]} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function BorderInspection() {
  const [selected, setSelected] = useState<typeof inspectionRecords[0] | null>(null)
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '今日通关车辆', value: '501', sub: '四口岸合计', color: 'text-gov-600', bg: 'bg-gov-50' },
          { label: 'AI查验通过', value: '491', sub: '98.0%通过率', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: '人工复核', value: '7', sub: '低置信度触发', color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'AI拦截处置', value: '3', sub: '违规/异常拦截', color: 'text-red-600', bg: 'bg-red-50' },
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
            <div className="card-title flex items-center gap-2"><Scan size={14} className="text-gov-500" />口岸AI查验记录</div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              实时更新
            </div>
          </div>
          <FilterBar searchPlaceholder="搜索车牌号/企业..."
            filters={[
              { label: '查验结果', options: [{value:'全部',label:'全部'},{value:'通过',label:'通过'},{value:'待核查',label:'待核查'},{value:'拦截',label:'拦截'}], value: '全部', onChange: () => {} },
              { label: '方向', options: [{value:'全部',label:'全部'},{value:'入境',label:'入境'},{value:'出境',label:'出境'}], value: '全部', onChange: () => {} },
            ]}
          />
          <DataTable
            columns={[
              { key: 'time', title: '查验时间', render: (v: string) => <span className="font-mono text-xs">{v.split(' ')[1]}</span> },
              { key: 'plate', title: '车牌号', render: (v: string, row: any) => (
                <div><span className={`font-mono font-semibold ${row.aiResult === '拦截' ? 'text-red-600' : 'text-gov-700'}`}>{v}</span></div>
              )},
              { key: 'nationality', title: '国籍', render: (v: string) => (
                <div className="flex items-center gap-1 text-xs"><Globe size={11} className="text-gray-400" />{v}</div>
              )},
              { key: 'checkpoint', title: '口岸' },
              { key: 'direction', title: '方向', render: (v: string) => <StatusBadge label={v} variant={v === '入境' ? 'info' : 'default'} /> },
              { key: 'cargo', title: '货物品名' },
              { key: 'weight', title: '重量(吨)', align: 'center' as const },
              { key: 'docStatus', title: '单证状态', render: (v: string) => <StatusBadge label={v} variant={v === '正常' ? 'success' : v === '异常' ? 'danger' : 'warning'} /> },
              { key: 'aiConfidence', title: 'AI置信度', render: (v: number) => (
                <span className={`text-xs font-medium ${v >= 90 ? 'text-emerald-600' : v >= 70 ? 'text-amber-600' : 'text-red-600'}`}>{v}%</span>
              )},
              { key: 'aiResult', title: 'AI查验结论', render: (v: string) => <StatusBadge label={v} variant={v === '通过' ? 'success' : v === '拦截' ? 'danger' : 'warning'} /> },
            ]}
            data={inspectionRecords} rowKey="id" onRowClick={setSelected}
          />
        </div>

        <div className="space-y-4">
          <div className="card p-4">
            <div className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"><MapPin size={14} className="text-gov-500" />口岸今日通关统计</div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={checkpointStats} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 9 }} />
                <Tooltip />
                <Bar dataKey="passed" fill="#10B981" name="通过" stackId="a" />
                <Bar dataKey="intercepted" fill="#EF4444" name="拦截" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card p-4">
            <div className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><AlertTriangle size={13} className="text-red-500" />AI拦截预警</div>
            <div className="space-y-2">
              {inspectionRecords.filter(r => r.aiResult === '拦截' || r.aiResult === '待核查').map((r, i) => (
                <div key={i} className={`p-2.5 rounded text-xs border ${r.aiResult === '拦截' ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'}`}>
                  <div className={`font-mono font-semibold ${r.aiResult === '拦截' ? 'text-red-600' : 'text-amber-600'}`}>{r.plate}</div>
                  <div className="text-gray-600 mt-0.5">{r.checkpoint} · {r.direction} · {r.docStatus === '异常' ? '单证异常' : '缺失文件'}</div>
                  <div className="flex items-center gap-1 mt-1"><Sparkles size={9} className="text-indigo-400" /><span className="text-indigo-500">AI置信度：{r.aiConfidence}%</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={`口岸查验详情 — ${selected?.plate}`} subtitle={`${selected?.checkpoint} · ${selected?.direction}`} width="lg"
        footer={<><button className="btn-secondary" onClick={() => setSelected(null)}>关闭</button>{selected?.aiResult !== '通过' && <button className="btn-primary"><AlertTriangle size={13} />启动人工复核</button>}</>}>
        {selected && (
          <div className="flex gap-5">
            <div className="flex-1 space-y-4">
              <DetailSection title="查验基本信息">
                <FieldGrid cols={2}>
                  <FieldItem label="车牌号码" value={<span className="font-mono font-bold text-gov-700">{selected.plate}</span>} highlight />
                  <FieldItem label="国籍/注册地" value={selected.nationality} />
                  <FieldItem label="所属企业" value={selected.company} />
                  <FieldItem label="通关方向" value={selected.direction} />
                  <FieldItem label="货物品名" value={selected.cargo} />
                  <FieldItem label="货物重量" value={`${selected.weight} 吨`} />
                </FieldGrid>
              </DetailSection>
              <DetailSection title="AI单证OCR核验结果">
                <div className="space-y-2">
                  {[
                    { label: '运输许可证', ok: selected.docStatus === '正常', detail: selected.docStatus === '正常' ? 'OCR识别完成，证件有效期内' : '许可证未提供或识别失败' },
                    { label: '货物清单', ok: selected.docStatus !== '异常', detail: selected.docStatus !== '异常' ? '品名、数量、重量与申报一致' : '货物信息与申报存在差异' },
                    { label: '国籍标志', ok: true, detail: 'AI识别国籍标志，符合规定样式' },
                    { label: '驾驶员证件', ok: selected.docStatus === '正常', detail: selected.docStatus === '正常' ? '国际驾照在有效期内' : '驾驶员证件信息需补充核验' },
                  ].map((c, i) => (
                    <div key={i} className={`flex items-start gap-3 p-2.5 rounded border ${c.ok ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                      {c.ok ? <CheckCircle size={13} className="text-emerald-500 mt-0.5 shrink-0" /> : <AlertTriangle size={13} className="text-red-500 mt-0.5 shrink-0" />}
                      <div>
                        <div className={`text-xs font-semibold ${c.ok ? 'text-emerald-700' : 'text-red-700'}`}>{c.label}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{c.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </DetailSection>
            </div>
            <div className="w-56 shrink-0">
              <AIPanel title="AI 查验分析" items={[
                { label: '查验结论', value: selected.aiResult, type: selected.aiResult === '通过' ? 'success' : selected.aiResult === '拦截' ? 'warning' : 'warning' },
                { label: 'AI置信度', value: `${selected.aiConfidence}%，${selected.aiConfidence >= 90 ? '高置信度，可信' : '置信度偏低，建议人工复核'}`, type: selected.aiConfidence >= 90 ? 'success' : 'warning' },
                { label: '货物风险初筛', value: `${selected.cargo}：${selected.riskLevel === '极高' ? '疑似违禁品，立即拦截查验' : selected.riskLevel === '高' ? '存在风险，建议开箱检查' : 'AI初筛无异常，常规通关'}`, type: selected.riskLevel === '低' ? 'success' : 'warning' },
                { label: '处置建议', value: selected.aiResult === '通过' ? '正常放行，记录通关信息' : selected.aiResult === '拦截' ? '拦截车辆，联系海关配合开箱查验，通报主管部门' : '要求补充缺失单证，人工核查后决定是否放行', type: selected.aiResult === '通过' ? 'success' : 'warning' },
              ]} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function IntlVehicleManagement() {
  const [selected, setSelected] = useState<typeof intlVehicles[0] | null>(null)
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '国际运输车辆', value: '485', sub: '已备案', color: 'text-gov-600', bg: 'bg-gov-50' },
          { label: '中方车辆', value: '412', sub: '持有效通行证', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: '外籍车辆', value: '73', sub: '备案入境', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: '证件即将到期', value: '12', sub: '需续期', color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(s => (
          <div key={s.label} className={`card p-4 ${s.bg}`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-sm text-gray-600 mt-1">{s.label}</div>
            <div className={`text-xs ${s.color} mt-1`}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">国际运输车辆备案清单</div>
          <AIBadge label="AI国籍识别" />
        </div>
        <FilterBar searchPlaceholder="搜索车牌号/VIN..."
          filters={[
            { label: '国籍', options: [{value:'全部',label:'全部'},{value:'中国',label:'中国'},{value:'俄罗斯',label:'俄罗斯'},{value:'哈萨克斯坦',label:'哈萨克斯坦'}], value: '全部', onChange: () => {} },
            { label: '状态', options: [{value:'全部',label:'全部'},{value:'有效',label:'有效'},{value:'即将到期',label:'即将到期'}], value: '全部', onChange: () => {} },
          ]}
          onExport={() => {}} onRefresh={() => {}}
        />
        <DataTable
          columns={[
            { key: 'id', title: '备案编号', width: 80 },
            { key: 'plate', title: '车牌号', render: (v: string) => <span className="font-mono font-semibold text-gov-700">{v}</span> },
            { key: 'brand', title: '车辆品牌' },
            { key: 'nationality', title: '国籍', render: (v: string) => (
              <div className="flex items-center gap-1 text-xs"><Globe size={11} className="text-gray-400" />{v}</div>
            )},
            { key: 'company', title: '所属企业' },
            { key: 'permitType', title: '许可类型', render: (v: string) => <StatusBadge label={v} variant="info" /> },
            { key: 'permitNo', title: '通行证号' },
            { key: 'permitExpiry', title: '通行证到期' },
            { key: 'crossings30', title: '近30天通关', align: 'center' as const },
            { key: 'lastCrossing', title: '最近通关日期' },
            { key: 'status', title: '状态', render: (v: string) => <StatusBadge label={v} variant={v === '有效' ? 'success' : 'warning'} /> },
          ]}
          data={intlVehicles} rowKey="id" onRowClick={setSelected}
        />
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={`车辆档案 — ${selected?.plate}`} subtitle={`${selected?.brand} · ${selected?.nationality} · ${selected?.permitType}`} width="lg"
        footer={<><button className="btn-secondary" onClick={() => setSelected(null)}>关闭</button><button className="btn-primary"><FileSearch size={13} />查询通关记录</button></>}>
        {selected && (
          <div className="flex gap-5">
            <div className="flex-1 space-y-4">
              <DetailSection title="车辆基本信息">
                <FieldGrid cols={2}>
                  <FieldItem label="车牌号码" value={<span className="font-mono font-bold">{selected.plate}</span>} highlight />
                  <FieldItem label="车辆识别代码" value={selected.vin} />
                  <FieldItem label="品牌" value={selected.brand} />
                  <FieldItem label="注册国籍" value={selected.nationality} />
                  <FieldItem label="所属企业" value={selected.company} />
                  <FieldItem label="国际运输许可类型" value={selected.permitType} />
                  <FieldItem label="通行证号" value={selected.permitNo} />
                  <FieldItem label="通行证有效期" value={selected.permitExpiry} />
                </FieldGrid>
              </DetailSection>
              <DetailSection title="通关历史统计">
                <FieldGrid cols={2}>
                  <FieldItem label="近30天通关次数" value={`${selected.crossings30} 次`} highlight />
                  <FieldItem label="最近通关日期" value={selected.lastCrossing} />
                </FieldGrid>
              </DetailSection>
            </div>
            <div className="w-56 shrink-0">
              <AIPanel title="AI 车辆分析" items={[
                { label: '通行证状态', value: selected.status, type: selected.status === '有效' ? 'success' : 'warning' },
                { label: '通关频次分析', value: `近30天通关${selected.crossings30}次，${selected.crossings30 >= 10 ? '频次较高，属于高频跨境车辆' : '频次正常'}`, type: 'info' },
                { label: '国籍标志核验', value: 'AI识别国籍标志规范，符合国际运输要求', type: 'success' },
                { label: '证件到期提醒', value: selected.status === '即将到期' ? '通行证即将到期，请尽快申请续期，避免影响正常通关' : '通行证在有效期内，可正常通关', type: selected.status === '即将到期' ? 'warning' : 'success' },
              ]} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
