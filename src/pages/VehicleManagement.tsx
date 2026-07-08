import React, { useState } from 'react'
import { Car, Sparkles, Plus, CheckCircle, AlertTriangle, Activity, Wrench, FileSearch, TrendingUp, Shield } from 'lucide-react'
import DataTable from '../components/DataTable'
import { FilterBar, Pagination } from '../components/FilterBar'
import Modal, { DetailSection, FieldGrid, FieldItem } from '../components/Modal'
import StatusBadge, { RiskBadge, AIBadge } from '../components/StatusBadge'
import AIPanel from '../components/AIPanel'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { vehicles } from '../data/mockData'

type VTab = '车辆档案管理' | '车辆技术审查' | '车辆风险预测'

const extendedVehicles = [
  { id: 'VH001', plateNo: '粤A12345', vin: 'LGBH2EF02K1234567', brand: '东风天龙', model: 'DFL4251A18', type: '重型货车', year: 2020, techLevel: '一级', company: '恒通物流运输有限公司', owner: '张建国', phone: '13812345678', inspectDate: '2024-03-20', nextInspect: '2025-03-19', mileage: 185000, status: '正常运营', riskScore: 28, aiRisk: '低', fuelStd: '达标', gpsInstalled: true, platformLinked: true, engineNo: 'ISM12-400E50', color: '白色', seats: 2, loadCapacity: 25, purchaseDate: '2020-06-15', insuranceExpiry: '2025-06-14', maintenanceCount: 8, repairCount: 2, accidents: 0, residualValue: 85 },
  { id: 'VH002', plateNo: '粤B23456', vin: 'LGBH2EF02K2345678', brand: '解放J6', model: 'CA4250P66K24T1A1E5', type: '重型货车', year: 2019, techLevel: '二级', company: '快速物流运输公司', owner: '陈晓峰', phone: '13567890123', inspectDate: '2024-01-15', nextInspect: '2025-01-14', mileage: 265000, status: '正常运营', riskScore: 56, aiRisk: '中', fuelStd: '达标', gpsInstalled: true, platformLinked: true, engineNo: 'CA6DM3E6', color: '红色', seats: 2, loadCapacity: 25, purchaseDate: '2019-08-20', insuranceExpiry: '2025-08-19', maintenanceCount: 14, repairCount: 5, accidents: 1, residualValue: 62 },
  { id: 'VH003', plateNo: '粤C34567', vin: 'LGBH2EF02K3456789', brand: '宇通客车', model: 'ZK6120HQ', type: '大型客车', year: 2021, techLevel: '一级', company: '城际客运集团', owner: '张志远', phone: '15698768888', inspectDate: '2024-05-10', nextInspect: '2025-05-09', mileage: 125000, status: '正常运营', riskScore: 18, aiRisk: '低', fuelStd: '达标', gpsInstalled: true, platformLinked: true, engineNo: 'YC6K380-50', color: '黄色', seats: 45, loadCapacity: 0, purchaseDate: '2021-03-10', insuranceExpiry: '2025-03-09', maintenanceCount: 6, repairCount: 1, accidents: 0, residualValue: 78 },
  { id: 'VH004', plateNo: '粤D45678', vin: 'LGBH2EF02K4567890', brand: '中集罐箱', model: 'ZJV5313GYQ', type: '危险品运输车', year: 2018, techLevel: '二级', company: '危化品物流有限公司', owner: '王大明', phone: '18923450001', inspectDate: '2024-02-20', nextInspect: '2025-02-19', mileage: 320000, status: '正常运营', riskScore: 72, aiRisk: '高', fuelStd: '不达标', gpsInstalled: true, platformLinked: false, engineNo: 'WD615.96E', color: '橙色', seats: 2, loadCapacity: 20, purchaseDate: '2018-11-05', insuranceExpiry: '2025-11-04', maintenanceCount: 22, repairCount: 9, accidents: 2, residualValue: 38 },
  { id: 'VH005', plateNo: '粤E56789', vin: 'LGBH2EF02K5678901', brand: '大宇客车', model: 'GDW6120HKD', type: '大型客车', year: 2022, techLevel: '一级', company: '蓝天客运有限公司', owner: '陈海波', phone: '13812348888', inspectDate: '2024-06-01', nextInspect: '2025-05-31', mileage: 88000, status: '正常运营', riskScore: 12, aiRisk: '低', fuelStd: '达标', gpsInstalled: true, platformLinked: true, engineNo: 'WP7.270E53', color: '白色', seats: 49, loadCapacity: 0, purchaseDate: '2022-01-20', insuranceExpiry: '2025-01-19', maintenanceCount: 4, repairCount: 0, accidents: 0, residualValue: 91 },
  { id: 'VH006', plateNo: '粤F67890', vin: 'LGBH2EF02K6789012', brand: '陕汽德龙', model: 'SX4255JR385', type: '重型货车', year: 2019, techLevel: '二级', company: '天龙货运公司', owner: '王大为', phone: '15678901234', inspectDate: '2023-11-10', nextInspect: '2024-11-09', mileage: 298000, status: '待年检', riskScore: 65, aiRisk: '高', fuelStd: '达标', gpsInstalled: false, platformLinked: false, engineNo: 'WP12.430E', color: '蓝色', seats: 2, loadCapacity: 25, purchaseDate: '2019-05-15', insuranceExpiry: '2024-05-14', maintenanceCount: 18, repairCount: 7, accidents: 1, residualValue: 45 },
]

const lifecycleEvents = [
  { date: '2020-06-15', type: '购置', desc: '完成车辆购置，缴纳购置税', icon: '🚛' },
  { date: '2020-07-01', type: '上牌', desc: '完成车辆登记上牌，车牌：粤A12345', icon: '📋' },
  { date: '2021-03-20', type: '维护', desc: '完成一级维护，更换机油滤清器', icon: '🔧' },
  { date: '2022-03-15', type: '年检', desc: '完成年检，技术等级评定：一级', icon: '✅' },
  { date: '2022-09-10', type: '维修', desc: '发动机进气管故障维修，历时2天', icon: '⚠️' },
  { date: '2023-03-18', type: '年检', desc: '完成年检，技术等级评定：一级', icon: '✅' },
  { date: '2023-08-22', type: '维护', desc: '完成二级维护，更换制动蹄片', icon: '🔧' },
  { date: '2024-03-20', type: '年检', desc: '完成年检，技术等级评定：一级', icon: '✅' },
]

const riskVehicles = [
  { plate: '粤D45678', company: '危化品物流', type: '危险品运输车', score: 72, level: '高', trend: '上升', engineRisk: 68, brakeRisk: 55, tireRisk: 72, bodyRisk: 40, electricRisk: 35, driverRisk: 65, mileage: 320000, accidents: 2 },
  { plate: '粤F67890', company: '天龙货运', type: '重型货车', score: 65, level: '高', trend: '稳定', engineRisk: 60, brakeRisk: 70, tireRisk: 55, bodyRisk: 45, electricRisk: 60, driverRisk: 50, mileage: 298000, accidents: 1 },
  { plate: '粤B23456', company: '快速物流', type: '重型货车', score: 56, level: '中', trend: '上升', engineRisk: 50, brakeRisk: 45, tireRisk: 60, bodyRisk: 35, electricRisk: 30, driverRisk: 55, mileage: 265000, accidents: 1 },
  { plate: '粤G89012', company: '鑫鹏物流', type: '重型货车', score: 88, level: '极高', trend: '上升', engineRisk: 80, brakeRisk: 85, tireRisk: 90, bodyRisk: 70, electricRisk: 65, driverRisk: 88, mileage: 410000, accidents: 3 },
  { plate: '粤H90123', company: '远通运输', type: '冷链运输车', score: 45, level: '中', trend: '下降', engineRisk: 40, brakeRisk: 48, tireRisk: 42, bodyRisk: 30, electricRisk: 55, driverRisk: 38, mileage: 195000, accidents: 0 },
]

const inspectVehicles = [
  { id: 'VH001', plateNo: '粤A12345', brand: '东风天龙', type: '重型货车', company: '恒通物流', techLevel: '一级', fuelStd: '达标', gpsInstalled: true, platformLinked: true, lastInspect: '2024-03-20', result: '通过', aiCheckScore: 96, status: '合格' },
  { id: 'VH002', plateNo: '粤B23456', brand: '解放J6', type: '重型货车', company: '快速物流', techLevel: '二级', fuelStd: '达标', gpsInstalled: true, platformLinked: true, lastInspect: '2024-01-15', result: '通过', aiCheckScore: 82, status: '合格' },
  { id: 'VH003', plateNo: '粤C34567', brand: '宇通客车', type: '大型客车', company: '城际客运集团', techLevel: '一级', fuelStd: '达标', gpsInstalled: true, platformLinked: true, lastInspect: '2024-05-10', result: '通过', aiCheckScore: 98, status: '合格' },
  { id: 'VH004', plateNo: '粤D45678', brand: '中集罐箱', type: '危险品运输车', company: '危化品物流', techLevel: '二级', fuelStd: '不达标', gpsInstalled: true, platformLinked: false, lastInspect: '2024-02-20', result: '未通过', aiCheckScore: 54, status: '不合格' },
  { id: 'VH005', plateNo: '粤E56789', brand: '大宇客车', type: '大型客车', company: '蓝天客运', techLevel: '一级', fuelStd: '达标', gpsInstalled: true, platformLinked: true, lastInspect: '2024-06-01', result: '通过', aiCheckScore: 99, status: '合格' },
  { id: 'VH006', plateNo: '粤F67890', brand: '陕汽德龙', type: '重型货车', company: '天龙货运', techLevel: '二级', fuelStd: '达标', gpsInstalled: false, platformLinked: false, lastInspect: '2023-11-10', result: '未通过', aiCheckScore: 48, status: '不合格' },
]

const riskDistData = [
  { name: '低风险', value: 28540, color: '#10B981' },
  { name: '中风险', value: 7820, color: '#F59E0B' },
  { name: '高风险', value: 1850, color: '#EF4444' },
  { name: '极高风险', value: 290, color: '#7F1D1D' },
]

const monthlyRiskTrend = [
  { month: '1月', low: 29200, mid: 8100, high: 2050, extreme: 320 },
  { month: '2月', low: 28900, mid: 7980, high: 1980, extreme: 310 },
  { month: '3月', low: 28700, mid: 8050, high: 1920, extreme: 300 },
  { month: '4月', low: 28600, mid: 7900, high: 1880, extreme: 295 },
  { month: '5月', low: 28550, mid: 7850, high: 1860, extreme: 292 },
  { month: '6月', low: 28540, mid: 7820, high: 1850, extreme: 290 },
]

export default function VehicleManagement({ initialTab }: { initialTab?: VTab }) {
  const [tab, setTab] = useState<VTab>(initialTab ?? '车辆档案管理')

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-gov-800">车辆技术管理</h1>
            <p className="text-xs text-gray-500 mt-0.5">第九章 · 车辆档案一车一档、技术审查、AI风险预测与干预</p>
          </div>
          <div className="flex items-center gap-2">
            <AIBadge label="AI技术审查在线" />
            <button className="btn-primary"><Plus size={14} />新增车辆档案</button>
          </div>
        </div>
        <div className="flex gap-1 mt-4 border-b border-gray-100 -mb-4">
          {(['车辆档案管理', '车辆技术审查', '车辆风险预测'] as VTab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${tab === t ? 'border-gov-500 text-gov-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {tab === '车辆档案管理' && <VehicleArchive />}
        {tab === '车辆技术审查' && <VehicleInspection />}
        {tab === '车辆风险预测' && <VehicleRiskPrediction />}
      </div>
    </div>
  )
}

function VehicleArchive() {
  const [selected, setSelected] = useState<typeof extendedVehicles[0] | null>(null)
  const [typeFilter, setTypeFilter] = useState('全部')
  const [riskFilter, setRiskFilter] = useState('全部')
  const [page, setPage] = useState(1)
  const [activeLifecycle, setActiveLifecycle] = useState<null | typeof lifecycleEvents[0]>(null)

  const filtered = extendedVehicles.filter(v => {
    if (typeFilter !== '全部' && v.type !== typeFilter) return false
    if (riskFilter !== '全部' && v.aiRisk !== riskFilter) return false
    return true
  })

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '登记车辆总数', value: '38,500', sub: '较上月 +128', color: 'text-gov-600', bg: 'bg-gov-50' },
          { label: '正常运营', value: '37,200', sub: '96.6%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: '待年检', value: '850', sub: '需尽快处理', color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: '异常预警', value: '450', sub: 'AI识别异常', color: 'text-red-600', bg: 'bg-red-50' },
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
          <FilterBar
            searchPlaceholder="搜索车牌号/VIN/所属企业..."
            filters={[
              { label: '车辆类型', options: [{value:'全部',label:'全部'},{value:'重型货车',label:'重型货车'},{value:'大型客车',label:'大型客车'},{value:'危险品运输车',label:'危险品运输车'}], value: typeFilter, onChange: setTypeFilter },
              { label: 'AI风险', options: [{value:'全部',label:'全部'},{value:'低',label:'低'},{value:'中',label:'中'},{value:'高',label:'高'}], value: riskFilter, onChange: setRiskFilter },
            ]}
            onExport={() => {}}
            onRefresh={() => {}}
          />
        </div>
        <DataTable
          columns={[
            { key: 'plateNo', title: '车牌号', render: (v: string) => <span className="font-mono font-semibold text-gov-700">{v}</span> },
            { key: 'brand', title: '品牌型号', render: (v: string, row: any) => (
              <div><div className="font-medium text-sm">{v}</div><div className="text-xs text-gray-400">{row.model}</div></div>
            )},
            { key: 'type', title: '车辆类型', render: (v: string) => <StatusBadge label={v} variant="info" /> },
            { key: 'year', title: '出厂年份' },
            { key: 'company', title: '所属企业', render: (v: string) => <span className="text-xs">{v}</span> },
            { key: 'techLevel', title: '技术等级', render: (v: string) => <StatusBadge label={v} variant={v === '一级' ? 'success' : 'warning'} /> },
            { key: 'mileage', title: '行驶里程', render: (v: number) => <span>{v.toLocaleString()} km</span> },
            { key: 'nextInspect', title: '下次年检' },
            { key: 'riskScore', title: 'AI风险分', render: (v: number) => (
              <div className="flex items-center gap-1.5">
                <div className="w-14 bg-gray-100 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full ${v >= 70 ? 'bg-red-500' : v >= 40 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${v}%` }} />
                </div>
                <span className="text-xs font-medium">{v}</span>
              </div>
            )},
            { key: 'aiRisk', title: 'AI风险', render: (v: string) => <RiskBadge level={v as any} /> },
            { key: 'status', title: '状态', render: (v: string) => <StatusBadge label={v} variant={v === '正常运营' ? 'success' : 'warning'} /> },
          ]}
          data={filtered}
          rowKey="id"
          onRowClick={setSelected}
        />
        <div className="px-4">
          <Pagination total={filtered.length} page={page} pageSize={10} onChange={setPage} />
        </div>
      </div>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={`${selected?.plateNo} — 车辆档案`}
        subtitle={`VIN：${selected?.vin} · ${selected?.brand} ${selected?.model}`}
        width="2xl"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setSelected(null)}>关闭</button>
            <button className="btn-primary"><Wrench size={13} />维修记录</button>
            <button className="btn-primary"><Sparkles size={13} />AI画像分析</button>
          </>
        }
      >
        {selected && (
          <div className="flex gap-5">
            <div className="flex-1 space-y-4">
              <DetailSection title="车辆基本信息">
                <FieldGrid cols={3}>
                  <FieldItem label="车牌号码" value={selected.plateNo} highlight />
                  <FieldItem label="车辆识别代码(VIN)" value={selected.vin} />
                  <FieldItem label="车辆品牌" value={`${selected.brand} ${selected.model}`} />
                  <FieldItem label="车辆类型" value={selected.type} />
                  <FieldItem label="出厂年份" value={`${selected.year} 年`} />
                  <FieldItem label="车身颜色" value={selected.color} />
                  <FieldItem label="发动机号" value={selected.engineNo} />
                  <FieldItem label="核定载质量" value={selected.loadCapacity > 0 ? `${selected.loadCapacity} 吨` : '—'} />
                  <FieldItem label="核定座位数" value={selected.seats > 2 ? `${selected.seats} 座` : '—'} />
                </FieldGrid>
              </DetailSection>

              <DetailSection title="运营与检验信息">
                <FieldGrid cols={3}>
                  <FieldItem label="所属企业" value={selected.company} highlight />
                  <FieldItem label="负责人" value={selected.owner} />
                  <FieldItem label="联系电话" value={selected.phone} />
                  <FieldItem label="技术等级" value={<StatusBadge label={selected.techLevel} variant={selected.techLevel === '一级' ? 'success' : 'warning'} size="md" />} />
                  <FieldItem label="上次年检" value={selected.inspectDate} />
                  <FieldItem label="下次年检" value={selected.nextInspect} />
                  <FieldItem label="累计行驶里程" value={`${selected.mileage.toLocaleString()} km`} />
                  <FieldItem label="购置日期" value={selected.purchaseDate} />
                  <FieldItem label="保险到期日" value={selected.insuranceExpiry} />
                </FieldGrid>
              </DetailSection>

              <DetailSection title="AI合规审查项">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: '燃料消耗量达标', ok: selected.fuelStd === '达标', detail: selected.fuelStd === '达标' ? '符合国家燃耗限值标准' : '超出限值，需整改' },
                    { label: '技术等级评定', ok: true, detail: `当前技术等级：${selected.techLevel}` },
                    { label: '卫星定位装置', ok: selected.gpsInstalled, detail: selected.gpsInstalled ? 'GPS装置安装正常' : 'GPS未安装，违规' },
                    { label: '平台接入状态', ok: selected.platformLinked, detail: selected.platformLinked ? '已接入运营监管平台' : '未接入监管平台' },
                  ].map((c, i) => (
                    <div key={i} className={`flex items-start gap-2 p-2.5 rounded text-xs ${c.ok ? 'bg-emerald-50 border border-emerald-100' : 'bg-red-50 border border-red-100'}`}>
                      <span className={`mt-0.5 ${c.ok ? 'text-emerald-500' : 'text-red-500'}`}>{c.ok ? <CheckCircle size={13} /> : <AlertTriangle size={13} />}</span>
                      <div>
                        <div className={`font-semibold ${c.ok ? 'text-emerald-700' : 'text-red-700'}`}>{c.label}</div>
                        <div className="text-gray-500 mt-0.5">{c.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </DetailSection>

              <DetailSection title="生命周期时间轴" icon={<Activity size={14} className="text-gov-500" />}>
                <div className="space-y-0">
                  {lifecycleEvents.map((ev, i) => (
                    <div
                      key={i}
                      className="flex gap-3 cursor-pointer group"
                      onClick={() => setActiveLifecycle(activeLifecycle?.date === ev.date ? null : ev)}
                    >
                      <div className="flex flex-col items-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm border-2 transition-colors ${
                          activeLifecycle?.date === ev.date ? 'bg-gov-500 border-gov-500' :
                          ev.type === '年检' ? 'bg-emerald-50 border-emerald-400' :
                          ev.type === '维修' ? 'bg-red-50 border-red-400' :
                          'bg-gray-50 border-gray-300'
                        }`}>{ev.icon}</div>
                        {i < lifecycleEvents.length - 1 && <div className="w-0.5 h-5 bg-gray-200" />}
                      </div>
                      <div className={`pb-4 flex-1 transition-all ${activeLifecycle?.date === ev.date ? 'bg-gov-50 rounded px-2 -mx-2' : ''}`}>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                            ev.type === '年检' ? 'bg-emerald-100 text-emerald-700' :
                            ev.type === '维修' ? 'bg-red-100 text-red-700' :
                            ev.type === '维护' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                          }`}>{ev.type}</span>
                          <span className="text-xs text-gray-400">{ev.date}</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">{ev.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </DetailSection>
            </div>

            <div className="w-64 shrink-0 space-y-3">
              <AIPanel
                title="AI 车辆画像"
                items={[
                  { label: 'AI风险评分', value: <div className="text-2xl font-bold text-indigo-300">{selected.riskScore}<span className="text-sm ml-1">/ 100</span></div>, type: selected.riskScore >= 70 ? 'warning' : 'success' },
                  { label: 'AI残值评估', value: `当前残值率约 ${selected.residualValue}%，预计使用寿命剩余 ${Math.max(0, 8 - (2024 - selected.year))} 年`, type: selected.residualValue >= 70 ? 'success' : selected.residualValue >= 50 ? 'info' : 'warning' },
                  { label: '维修历史分析', value: `累计维护 ${selected.maintenanceCount} 次，大修 ${selected.repairCount} 次，事故 ${selected.accidents} 次`, type: selected.accidents > 1 ? 'warning' : 'success' },
                  { label: 'AI异常事件聚合', value: selected.riskScore >= 70 ? '近期发现异常：燃耗超标、平台断线，建议立即整改' : selected.riskScore >= 40 ? '存在轻微隐患：里程偏高，建议增加维护频次' : '近期无异常事件，车辆状态良好', type: selected.riskScore >= 70 ? 'warning' : selected.riskScore >= 40 ? 'info' : 'success' },
                  { label: '淘汰预警', value: selected.year <= 2019 && selected.mileage >= 250000 ? '车辆使用年限和里程均接近限值，建议纳入淘汰计划' : '暂无淘汰风险，继续正常运营', type: selected.year <= 2019 && selected.mileage >= 250000 ? 'warning' : 'success' },
                ]}
              />
              <div className="card p-3">
                <div className="text-xs font-semibold text-gray-600 mb-2">维修维护统计</div>
                <div className="space-y-2">
                  {[
                    { label: '一级维护', count: Math.round(selected.maintenanceCount * 0.6), color: 'bg-blue-400' },
                    { label: '二级维护', count: Math.round(selected.maintenanceCount * 0.4), color: 'bg-gov-400' },
                    { label: '大修记录', count: selected.repairCount, color: 'bg-amber-400' },
                    { label: '事故记录', count: selected.accidents, color: 'bg-red-400' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${item.color}`} />
                      <span className="text-xs text-gray-500 flex-1">{item.label}</span>
                      <span className="text-xs font-semibold text-gray-700">{item.count} 次</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function VehicleInspection() {
  const [selected, setSelected] = useState<typeof inspectVehicles[0] | null>(null)
  const [statusFilter, setStatusFilter] = useState('全部')
  const [aiRunning, setAiRunning] = useState(false)
  const [aiDone, setAiDone] = useState(false)

  const handleAICheck = () => {
    setAiRunning(true)
    setTimeout(() => { setAiRunning(false); setAiDone(true) }, 2000)
  }

  const filtered = inspectVehicles.filter(v => {
    if (statusFilter !== '全部' && v.status !== statusFilter) return false
    return true
  })

  const passCount = inspectVehicles.filter(v => v.status === '合格').length
  const failCount = inspectVehicles.filter(v => v.status === '不合格').length

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '本月审查车辆', value: '1,248', sub: '已完成审查', color: 'text-gov-600', bg: 'bg-gov-50' },
          { label: '审查通过', value: `${passCount}`, sub: `通过率 ${Math.round(passCount / inspectVehicles.length * 100)}%`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: '审查不合格', value: `${failCount}`, sub: '需整改', color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'AI自动审查覆盖', value: '98.5%', sub: 'AI审查效率', color: 'text-indigo-600', bg: 'bg-indigo-50' },
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
            <div className="card-title">AI自动审查结果清单</div>
            <div className="flex items-center gap-2">
              <AIBadge label="AI审查引擎 v3.1" />
              <button
                onClick={handleAICheck}
                disabled={aiRunning}
                className="btn-primary text-xs py-1.5"
              >
                <Sparkles size={12} />
                {aiRunning ? 'AI批量审查中...' : '批量AI审查'}
              </button>
            </div>
          </div>
          {aiDone && (
            <div className="mx-4 mb-3 flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
              <CheckCircle size={14} />
              AI批量审查完成：6辆已审查，4辆合格，2辆不合格，详情见下表
            </div>
          )}
          <FilterBar
            searchPlaceholder="搜索车牌号..."
            filters={[
              { label: '审查结果', options: [{value:'全部',label:'全部'},{value:'合格',label:'合格'},{value:'不合格',label:'不合格'}], value: statusFilter, onChange: setStatusFilter },
            ]}
          />
          <DataTable
            columns={[
              { key: 'plateNo', title: '车牌号', render: (v: string) => <span className="font-mono font-semibold text-gov-700">{v}</span> },
              { key: 'brand', title: '品牌', render: (v: string, row: any) => <div><div className="text-sm font-medium">{v}</div><div className="text-xs text-gray-400">{row.type}</div></div> },
              { key: 'company', title: '所属企业' },
              { key: 'techLevel', title: '技术等级', render: (v: string) => <StatusBadge label={v} variant={v === '一级' ? 'success' : 'warning'} /> },
              { key: 'fuelStd', title: '燃耗达标', render: (v: string) => (
                <span className={`flex items-center gap-1 text-xs ${v === '达标' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {v === '达标' ? <CheckCircle size={12} /> : <AlertTriangle size={12} />} {v}
                </span>
              )},
              { key: 'gpsInstalled', title: '卫星定位', render: (v: boolean) => (
                <span className={`text-xs ${v ? 'text-emerald-600' : 'text-red-600'}`}>{v ? '已安装' : '未安装'}</span>
              )},
              { key: 'platformLinked', title: '平台接入', render: (v: boolean) => (
                <span className={`text-xs ${v ? 'text-emerald-600' : 'text-red-600'}`}>{v ? '已接入' : '未接入'}</span>
              )},
              { key: 'aiCheckScore', title: 'AI审查分', render: (v: number) => (
                <span className={`font-semibold text-sm ${v >= 80 ? 'text-emerald-600' : v >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{v}</span>
              )},
              { key: 'status', title: '审查结论', render: (v: string) => <StatusBadge label={v} variant={v === '合格' ? 'success' : 'danger'} /> },
            ]}
            data={filtered}
            rowKey="id"
            onRowClick={setSelected}
          />
        </div>

        <div className="space-y-4">
          <div className="card p-4">
            <div className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Shield size={14} className="text-gov-500" />
              AI审查四项指标通过率
            </div>
            {[
              { label: '燃料消耗量达标', pass: 83, total: 100, color: 'bg-gov-500' },
              { label: '技术等级评定', pass: 91, total: 100, color: 'bg-emerald-500' },
              { label: '卫星定位装置', pass: 88, total: 100, color: 'bg-blue-500' },
              { label: '监管平台接入', pass: 79, total: 100, color: 'bg-amber-500' },
            ].map(item => (
              <div key={item.label} className="mb-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>{item.label}</span>
                  <span className="font-semibold">{item.pass}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.pass}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="card p-4">
            <div className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <TrendingUp size={14} className="text-gov-500" />
              企业级维护需求预测
            </div>
            <div className="space-y-2">
              {[
                { company: '恒通物流', need: '一级维护', urgency: '本月', color: 'bg-blue-100 text-blue-700' },
                { company: '危化品物流', need: '罐体检测', urgency: '紧急', color: 'bg-red-100 text-red-700' },
                { company: '天龙货运', need: '年检', urgency: '本月', color: 'bg-amber-100 text-amber-700' },
                { company: '快速物流', need: '二级维护', urgency: '下月', color: 'bg-gray-100 text-gray-600' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded bg-gray-50 text-xs">
                  <div className="flex-1">
                    <span className="font-medium text-gray-700">{item.company}</span>
                    <span className="text-gray-400 ml-1">· {item.need}</span>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded text-[11px] font-medium ${item.color}`}>{item.urgency}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <div className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <AlertTriangle size={14} className="text-amber-500" />
              AI淘汰预警清单
            </div>
            <div className="space-y-2">
              {[
                { plate: '粤D45678', reason: '里程超32万km', year: 2018 },
                { plate: '粤F67890', reason: '使用年限≥5年', year: 2019 },
              ].map((item, i) => (
                <div key={i} className="p-2 rounded bg-amber-50 border border-amber-100 text-xs">
                  <div className="font-mono font-semibold text-gov-700">{item.plate}</div>
                  <div className="text-amber-700 mt-0.5">{item.reason}（{item.year}年购置）</div>
                </div>
              ))}
              <div className="text-xs text-gray-400 text-center mt-1">基于AI模型预测，共 2 辆建议淘汰</div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={`技术审查详情 — ${selected?.plateNo}`}
        subtitle={`${selected?.brand} · ${selected?.type} · ${selected?.company}`}
        width="lg"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setSelected(null)}>关闭</button>
            <button className="btn-primary"><Sparkles size={13} />生成审查报告</button>
          </>
        }
      >
        {selected && (
          <div className="flex gap-5">
            <div className="flex-1 space-y-4">
              <DetailSection title="AI四项审查指标">
                <div className="space-y-2">
                  {[
                    { label: '燃料消耗量达标审查', ok: selected.fuelStd === '达标', detail: selected.fuelStd === '达标' ? '经AI核验，燃耗数据符合国标GB27999-2019要求' : '燃耗超标，违反节能减排标准，需限期整改' },
                    { label: '技术等级评定', ok: true, detail: `当前技术等级：${selected.techLevel}，符合《道路运输车辆技术管理规定》` },
                    { label: '卫星定位装置安装', ok: selected.gpsInstalled, detail: selected.gpsInstalled ? 'GPS/北斗定位装置安装规范，信号正常' : '未安装卫星定位装置，违反强制性要求' },
                    { label: '运营监管平台接入', ok: selected.platformLinked, detail: selected.platformLinked ? '已成功接入道路运输综合业务管理平台，实时传输正常' : '未接入监管平台，无法实时监控，存在监管盲区' },
                  ].map((c, i) => (
                    <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${c.ok ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                      <div className={`mt-0.5 shrink-0 ${c.ok ? 'text-emerald-500' : 'text-red-500'}`}>
                        {c.ok ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                      </div>
                      <div>
                        <div className={`text-sm font-semibold ${c.ok ? 'text-emerald-700' : 'text-red-700'}`}>{c.label}</div>
                        <div className="text-xs text-gray-600 mt-0.5">{c.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </DetailSection>

              <DetailSection title="审查结论">
                <div className={`p-3 rounded-lg border text-sm font-medium ${selected.status === '合格' ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-red-50 border-red-300 text-red-700'}`}>
                  {selected.status === '合格'
                    ? `AI综合审查通过，评分 ${selected.aiCheckScore} 分，车辆符合全部技术要求，可继续运营。`
                    : `AI综合审查不合格，评分 ${selected.aiCheckScore} 分，发现 ${[!selected.gpsInstalled, !selected.platformLinked, selected.fuelStd !== '达标'].filter(Boolean).length} 项不符合项，需限期整改后方可继续运营。`
                  }
                </div>
              </DetailSection>
            </div>
            <div className="w-60 shrink-0">
              <AIPanel title="AI 审查助手" items={[
                { label: 'AI综合评分', value: <div className="text-2xl font-bold text-indigo-300">{selected.aiCheckScore}<span className="text-sm ml-1">/ 100</span></div>, type: selected.aiCheckScore >= 80 ? 'success' : 'warning' },
                { label: '审查用时', value: 'AI自动审查耗时 2.3 秒，替代人工审查约 45 分钟', type: 'info' },
                { label: '建议措施', value: selected.status === '合格' ? '车辆状态良好，建议常规监管，下次审查按期进行' : '责令企业限期整改不符合项，整改完成后重新提交审查', type: selected.status === '合格' ? 'success' : 'warning' },
              ]} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function VehicleRiskPrediction() {
  const [selected, setSelected] = useState<typeof riskVehicles[0] | null>(null)
  const [levelFilter, setLevelFilter] = useState('全部')

  const filtered = riskVehicles.filter(v => {
    if (levelFilter !== '全部' && v.level !== levelFilter) return false
    return true
  })

  const radarData = selected ? [
    { subject: '发动机', A: selected.engineRisk },
    { subject: '制动系统', A: selected.brakeRisk },
    { subject: '轮胎状况', A: selected.tireRisk },
    { subject: '车身结构', A: selected.bodyRisk },
    { subject: '电气系统', A: selected.electricRisk },
    { subject: '驾驶行为', A: selected.driverRisk },
  ] : []

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '低风险', count: '28,540', pct: '74.1%', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
          { label: '中风险', count: '7,820', pct: '20.3%', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
          { label: '高风险', count: '1,850', pct: '4.8%', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
          { label: '极高风险', count: '290', pct: '0.8%', color: 'text-red-900', bg: 'bg-red-100', border: 'border-red-300' },
        ].map(s => (
          <div key={s.label} className={`card p-4 ${s.bg} border ${s.border}`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.count}</div>
            <div className="text-sm text-gray-600 mt-1">{s.label}车辆</div>
            <div className={`text-xs ${s.color} font-medium mt-1`}>占比 {s.pct}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          <div className="card">
            <div className="card-header">
              <div className="card-title">高风险车辆清单（AI预测）</div>
              <AIBadge label="预测模型 v2.3" />
            </div>
            <FilterBar
              searchPlaceholder="搜索车牌号..."
              filters={[
                { label: '风险等级', options: [{value:'全部',label:'全部'},{value:'极高',label:'极高'},{value:'高',label:'高'},{value:'中',label:'中'}], value: levelFilter, onChange: setLevelFilter },
              ]}
            />
            <DataTable
              columns={[
                { key: 'plate', title: '车牌号', render: (v: string) => <span className="font-mono font-semibold text-gov-700">{v}</span> },
                { key: 'company', title: '所属企业' },
                { key: 'type', title: '车辆类型' },
                { key: 'mileage', title: '行驶里程', render: (v: number) => <span className="text-xs">{v.toLocaleString()} km</span> },
                { key: 'score', title: 'AI风险评分', render: (v: number) => (
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-100 rounded-full h-2">
                      <div className={`h-2 rounded-full ${v >= 70 ? 'bg-red-500' : v >= 40 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${v}%` }} />
                    </div>
                    <span className={`text-sm font-bold ${v >= 70 ? 'text-red-600' : 'text-amber-600'}`}>{v}</span>
                  </div>
                )},
                { key: 'level', title: 'AI风险等级', render: (v: string) => <RiskBadge level={v as any} /> },
                { key: 'trend', title: '风险趋势', render: (v: string) => (
                  <span className={`flex items-center gap-1 text-xs font-medium ${v === '上升' ? 'text-red-600' : v === '下降' ? 'text-emerald-600' : 'text-gray-500'}`}>
                    {v === '上升' ? '↑' : v === '下降' ? '↓' : '→'} {v}
                  </span>
                )},
                { key: 'accidents', title: '历史事故', render: (v: number) => <span className={v > 0 ? 'text-red-600 font-semibold' : 'text-gray-400'}>{v} 次</span> },
                { key: 'action', title: '操作', render: (_: any, row: any) => (
                  <button onClick={e => { e.stopPropagation(); setSelected(row) }} className="text-xs text-gov-500 hover:text-gov-400 px-2 py-1 rounded hover:bg-gov-50">详情</button>
                )},
              ]}
              data={filtered}
              rowKey="plate"
              onRowClick={setSelected}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-4">
            <div className="text-sm font-semibold text-gray-700 mb-3">风险分布占比</div>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={riskDistData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value">
                  {riskDistData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v: number) => [v.toLocaleString() + ' 辆', '']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-1 mt-2">
              {riskDistData.map(d => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-gray-500">{d.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <div className="text-sm font-semibold text-gray-700 mb-3">风险趋势（近6月）</div>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={monthlyRiskTrend} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="high" fill="#EF4444" name="高风险" stackId="a" />
                <Bar dataKey="extreme" fill="#7F1D1D" name="极高" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {selected && (
            <div className="card p-4">
              <div className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Sparkles size={13} className="text-indigo-500" />
                {selected.plate} 风险雷达
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                  <Radar name="风险" dataKey="A" stroke="#EF4444" fill="#EF4444" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={`风险详情 — ${selected?.plate}`}
        subtitle={`${selected?.company} · ${selected?.type}`}
        width="xl"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setSelected(null)}>关闭</button>
            <button className="btn-primary"><Sparkles size={13} />生成干预方案</button>
          </>
        }
      >
        {selected && (
          <div className="flex gap-5">
            <div className="flex-1 space-y-4">
              <DetailSection title="多维度风险评估">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: '发动机风险', score: selected.engineRisk },
                    { label: '制动系统', score: selected.brakeRisk },
                    { label: '轮胎状况', score: selected.tireRisk },
                    { label: '车身结构', score: selected.bodyRisk },
                    { label: '电气系统', score: selected.electricRisk },
                    { label: '驾驶行为', score: selected.driverRisk },
                  ].map((d, i) => (
                    <div key={i} className="p-2.5 rounded bg-gray-50 border border-gray-100">
                      <div className="text-xs text-gray-500 mb-1">{d.label}</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${d.score >= 70 ? 'bg-red-500' : d.score >= 40 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${d.score}%` }} />
                        </div>
                        <span className={`text-xs font-bold ${d.score >= 70 ? 'text-red-600' : d.score >= 40 ? 'text-amber-600' : 'text-emerald-600'}`}>{d.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </DetailSection>

              <div className="card p-4 bg-gray-50">
                <div className="text-sm font-semibold text-gray-700 mb-3">风险雷达图</div>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                    <Radar name="风险分值" dataKey="A" stroke="#EF4444" fill="#EF4444" fillOpacity={0.25} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="w-64 shrink-0">
              <AIPanel
                title="AI 干预建议"
                items={[
                  { label: '综合风险评分', value: <div className="text-2xl font-bold text-indigo-300">{selected.score}<span className="text-sm ml-1">/ 100</span></div>, type: selected.score >= 70 ? 'warning' : 'info' },
                  { label: '风险趋势', value: `近30天风险趋势：${selected.trend}，需${selected.trend === '上升' ? '立即' : '持续'}关注`, type: selected.trend === '上升' ? 'warning' : 'info' },
                  { label: '历史事故', value: `记录事故 ${selected.accidents} 次，${selected.accidents > 1 ? '频次偏高，建议深度检查' : selected.accidents === 1 ? '有1次事故记录，需关注' : '无事故记录'}`, type: selected.accidents > 1 ? 'warning' : 'success' },
                  { label: 'AI干预建议', value: selected.level === '极高'
                    ? '立即停运，强制送检；约谈驾驶员，暂停高风险驾驶资格；要求企业提交整改方案'
                    : selected.level === '高'
                    ? '限期整改：完成罐体/制动检测；加密检查至每周一次；约谈企业负责人'
                    : '纳入重点监控名单，每月专项检查，持续跟踪风险变化',
                    type: selected.level === '极高' || selected.level === '高' ? 'warning' : 'info'
                  },
                  { label: '预计干预效果', value: '实施干预后，预计风险评分可降低 20-30 分，事故率下降约 60%', type: 'success' },
                ]}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
