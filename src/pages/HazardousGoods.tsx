import React, { useState } from 'react'
import { AlertTriangle, Sparkles, MapPin, Shield, Activity, Eye, Truck } from 'lucide-react'
import DataTable from '../components/DataTable'
import { FilterBar } from '../components/FilterBar'
import Modal, { DetailSection, FieldGrid, FieldItem } from '../components/Modal'
import StatusBadge, { RiskBadge, AIBadge } from '../components/StatusBadge'
import AIPanel from '../components/AIPanel'
import { hazmatCompanies } from '../data/mockData'

type HazTab = '企业档案' | '车辆监控' | '从业人员' | '许可申请'

type HazCompany = typeof hazmatCompanies[0]

export default function HazardousGoods() {
  const [tab, setTab] = useState<HazTab>('企业档案')
  const [selected, setSelected] = useState<HazCompany | null>(null)

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-gov-800">道路危险货物运输管理</h1>
            <p className="text-xs text-gray-500 mt-0.5">第四章 · 危险货物运输许可、车辆实时监控、专用设备、从业人员</p>
          </div>
          <div className="flex items-center gap-2">
            <AIBadge label="实时监控在线" />
            <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-md">
              <AlertTriangle size={12} />
              <span>3辆危货车辆高风险预警</span>
            </div>
          </div>
        </div>
        <div className="flex gap-1 mt-4 border-b border-gray-100 -mb-4">
          {(['企业档案', '车辆监控', '从业人员', '许可申请'] as HazTab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${tab === t ? 'border-gov-500 text-gov-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {tab === '企业档案' && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: '危货运营企业', value: 156, sub: '有效许可', color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: '在营危货车辆', value: 1248, sub: '已接入联网联控', color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: '持证押运人员', value: 1536, sub: '普通类+特殊类', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: '高风险预警车辆', value: 18, sub: '需立即处置', color: 'text-red-600', bg: 'bg-red-50' },
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
                  searchPlaceholder="搜索企业名称/许可证号..."
                  filters={[
                    { label: '危货类型', options: [{value:'全部',label:'全部'},{value:'剧毒化学品',label:'剧毒化学品'},{value:'爆炸品',label:'爆炸品'},{value:'普通危货',label:'普通危货'}], value: '全部', onChange: () => {} },
                    { label: '风险等级', options: [{value:'全部',label:'全部'},{value:'低',label:'低'},{value:'中',label:'中'},{value:'高',label:'高'}], value: '全部', onChange: () => {} },
                  ]}
                />
              </div>
              <DataTable
                columns={[
                  { key: 'id', title: '编号', width: 80 },
                  { key: 'name', title: '企业名称', render: (v: string, row: HazCompany) => (
                    <div><div className="font-medium">{v}</div><div className="text-xs text-gray-400">{row.licenseNo}</div></div>
                  )},
                  { key: 'hazType', title: '经营类型', render: (v: string) => (
                    <span className={`text-xs px-2 py-0.5 rounded border ${v.includes('剧毒') ? 'bg-red-50 text-red-700 border-red-200' : v.includes('爆炸') ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>{v}</span>
                  )},
                  { key: 'vehicles', title: '车辆数', align: 'center' as const },
                  { key: 'drivers', title: '驾驶员', align: 'center' as const },
                  { key: 'escorts', title: '押运员', align: 'center' as const },
                  { key: 'tankHealth', title: 'AI罐体健康度', render: (v: number) => (
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-100 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${v >= 80 ? 'bg-emerald-500' : v >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${v}%` }} />
                      </div>
                      <span className="text-xs">{v}%</span>
                    </div>
                  )},
                  { key: 'aiRisk', title: 'AI风险', render: (v: string) => <RiskBadge level={v as any} /> },
                  { key: 'status', title: '状态', render: (v: string) => <StatusBadge label={v} variant={v === '正常' ? 'success' : 'warning'} /> },
                  { key: 'expireDate', title: '有效期至' },
                ]}
                data={hazmatCompanies}
                rowKey="id"
                onRowClick={setSelected}
              />
            </div>
          </div>
        )}

        {tab === '车辆监控' && <HazVehicleMonitor />}
        {tab === '从业人员' && <HazPersonnel />}
        {tab === '许可申请' && <HazApplication />}
      </div>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name ?? ''}
        subtitle={`许可证编号：${selected?.licenseNo} · 危险货物运输企业档案`}
        width="xl"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setSelected(null)}>关闭</button>
            <button className="btn-primary"><Shield size={13} />AI条件审查</button>
            <button className="btn-primary">查看监控</button>
          </>
        }
      >
        {selected && (
          <div className="flex gap-5">
            <div className="flex-1 space-y-4">
              <DetailSection title="危货许可基本信息">
                <FieldGrid cols={3}>
                  <FieldItem label="企业名称" value={selected.name} highlight />
                  <FieldItem label="许可证编号" value={selected.licenseNo} />
                  <FieldItem label="危货经营类型" value={selected.hazType} />
                  <FieldItem label="法定代表人" value={selected.legalPerson} />
                  <FieldItem label="联系电话" value={selected.phone} />
                  <FieldItem label="有效期至" value={selected.expireDate} />
                  <FieldItem label="在营车辆" value={`${selected.vehicles} 辆`} />
                  <FieldItem label="驾驶员人数" value={`${selected.drivers} 人`} />
                  <FieldItem label="押运员人数" value={`${selected.escorts} 人`} />
                </FieldGrid>
              </DetailSection>

              <DetailSection title="AI许可条件符合性矩阵" icon={<Sparkles size={14} className="text-indigo-500" />}>
                <div className="space-y-2">
                  {[
                    { cond: '专用车辆数量达标', ok: true, note: `${selected.vehicles}辆专用危货车辆，符合最低5辆要求` },
                    { cond: '专用车辆技术等级', ok: true, note: '全部达到二级以上技术等级' },
                    { cond: '驾驶员资格证', ok: true, note: `${selected.drivers}名驾驶员持有危货从业资格证` },
                    { cond: '押运人员配置', ok: true, note: '每辆危货车均配备持证押运员' },
                    { cond: '停车场地面积', ok: selected.id !== 'HZ003', note: selected.id === 'HZ003' ? '⚠ 停车场地面积不足1.5倍正投影面积' : '停车场地面积符合要求' },
                    { cond: '联网联控系统接入', ok: true, note: '全部车辆已接入部级联网联控系统' },
                    { cond: '承运人责任险', ok: selected.id !== 'HZ003', note: selected.id === 'HZ003' ? '⚠ 部分车辆保险已过期' : '全部车辆保险有效' },
                    { cond: '罐体检测合格证', ok: selected.id !== 'HZ003', note: selected.id === 'HZ003' ? '⚠ 1辆车罐体检测即将到期' : 'AI-OCR验证全部合格' },
                  ].map((c, i) => (
                    <div key={i} className={`flex items-start gap-2 p-2 rounded-md text-xs ${c.ok ? 'bg-emerald-50' : 'bg-red-50'}`}>
                      <span className={c.ok ? 'text-emerald-500' : 'text-red-500'}>{c.ok ? '✓' : '✗'}</span>
                      <span className={`font-medium ${c.ok ? 'text-emerald-700' : 'text-red-700'} w-40 shrink-0`}>{c.cond}</span>
                      <span className={c.ok ? 'text-emerald-600' : 'text-red-600'}>{c.note}</span>
                    </div>
                  ))}
                </div>
              </DetailSection>
            </div>
            <div className="w-64 shrink-0">
              <AIPanel title="AI 危货监管分析" items={[
                { label: '罐体健康度', value: `${selected.tankHealth}% — ${selected.tankHealth >= 80 ? '良好' : '需关注'}`, type: selected.tankHealth >= 80 ? 'success' : 'warning' },
                { label: 'AI风险评估', value: `综合风险等级：${selected.aiRisk}。主要关注：车辆健康度及驾驶员资质`, type: selected.aiRisk === '低' ? 'success' : selected.aiRisk === '中' ? 'warning' : 'warning' },
                { label: '实时监控状态', value: '全部车辆GPS信号正常，无偏离路线告警', type: 'success' },
                { label: '监管建议', value: selected.status === '警告' ? '存在不符合项，建议限期整改，加强日常巡查频次（每月2次）' : '建议维持每季度常规检查频次', type: selected.status === '警告' ? 'warning' : 'info' },
              ]} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function HazVehicleMonitor() {
  const vehicles = [
    { plate: '粤A危001', company: '安全化工运输公司', hazType: '压缩气体', driver: '张安驾', location: '省道S213 K85处', deviation: false, speed: 68, tankPressure: '正常', tankTemp: '22°C', risk: '低', gpsStatus: '在线', lastUpdate: '2分钟前' },
    { plate: '粤B危002', company: '危化品物流有限公司', hazType: '剧毒化学品', driver: '王化驾', location: '国道G351 K245处', deviation: false, speed: 72, tankPressure: '正常', tankTemp: '20°C', risk: '高', gpsStatus: '在线', lastUpdate: '1分钟前' },
    { plate: '粤C危003', company: '爆炸品运输专业公司', hazType: '爆炸品', driver: '李爆驾', location: '偏离路线2.3km', deviation: true, speed: 0, tankPressure: '异常', tankTemp: '—', risk: '极高', gpsStatus: '在线', lastUpdate: '5分钟前' },
    { plate: '粤D危004', company: '气体运输专业公司', hazType: '易燃气体', driver: '陈气驾', location: '高速G7511 K123', deviation: false, speed: 95, tankPressure: '正常', tankTemp: '18°C', risk: '中', gpsStatus: '在线', lastUpdate: '刚刚' },
    { plate: '粤E危005', company: '易燃液体运输公司', hazType: '易燃液体', driver: '赵燃驾', location: '市区路段停车场', deviation: false, speed: 0, tankPressure: '正常', tankTemp: '25°C', risk: '低', gpsStatus: '在线', lastUpdate: '3分钟前' },
  ]

  const [selected, setSelected] = useState<any>(null)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 col-span-2">
          <div className="card-title mb-3 flex items-center gap-2">
            <Activity size={14} className="text-gov-500" />
            实时车辆位置监控
            <span className="text-xs text-gray-400 font-normal">（模拟地图视图）</span>
          </div>
          <div className="bg-gov-900 rounded-lg h-52 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: 'linear-gradient(rgba(0,102,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,102,255,0.3) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-gov-300 text-sm">地图加载区域（生产环境接入百度/高德地图API）</div>
            </div>
            {vehicles.map((v, i) => (
              <div key={v.plate} className="absolute flex flex-col items-center" style={{ left: `${15 + i * 18}%`, top: `${25 + (i % 2) * 30}%` }}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold cursor-pointer hover:scale-110 transition-transform ${v.deviation ? 'bg-red-500 animate-pulse' : v.risk === '高' ? 'bg-amber-500' : 'bg-gov-400'}`}
                  onClick={() => setSelected(v)}>
                  <Truck size={10} />
                </div>
                <div className="text-[9px] text-gov-200 mt-0.5 whitespace-nowrap">{v.plate}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-4">
          <div className="card-title mb-3">实时告警</div>
          <div className="space-y-2">
            {vehicles.filter(v => v.deviation || v.risk === '极高' || v.risk === '高').map(v => (
              <div key={v.plate} onClick={() => setSelected(v)}
                className={`p-2.5 rounded-lg text-xs cursor-pointer hover:opacity-80 ${v.deviation ? 'bg-red-900/80 border border-red-500' : 'bg-amber-900/50 border border-amber-600'}`}>
                <div className={`font-semibold ${v.deviation ? 'text-red-300' : 'text-amber-300'}`}>
                  {v.deviation ? '🔴 路线偏离' : '🟡 高风险预警'} — {v.plate}
                </div>
                <div className="text-gray-400 mt-0.5">{v.company}</div>
                <div className="text-gray-300">{v.location}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">危货车辆运行状态一览</div>
          <AIBadge label="AI实时监控" />
        </div>
        <DataTable
          columns={[
            { key: 'plate', title: '车牌号', render: (v: string) => <span className="font-mono font-semibold text-gov-700">{v}</span> },
            { key: 'company', title: '所属公司' },
            { key: 'hazType', title: '危货类型' },
            { key: 'driver', title: '当班驾驶员' },
            { key: 'location', title: '当前位置', render: (v: string, row: any) => (
              <div className="flex items-center gap-1">
                <MapPin size={11} className={row.deviation ? 'text-red-500' : 'text-gray-400'} />
                <span className={row.deviation ? 'text-red-600 font-medium' : ''}>{v}</span>
              </div>
            )},
            { key: 'speed', title: '速度(km/h)', align: 'center' as const },
            { key: 'tankPressure', title: '罐体压力', render: (v: string) => (
              <StatusBadge label={v} variant={v === '正常' ? 'success' : 'danger'} />
            )},
            { key: 'risk', title: 'AI风险', render: (v: string) => <RiskBadge level={v as any} /> },
            { key: 'lastUpdate', title: '更新时间' },
          ]}
          data={vehicles}
          rowKey="plate"
          onRowClick={setSelected}
        />
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={`车辆详情 — ${selected?.plate}`} width="lg">
        {selected && (
          <div className="flex gap-4">
            <div className="flex-1 space-y-3">
              <DetailSection title="车辆运行信息">
                <FieldGrid cols={2}>
                  <FieldItem label="所属公司" value={selected.company} />
                  <FieldItem label="危货类型" value={selected.hazType} />
                  <FieldItem label="当班驾驶员" value={selected.driver} />
                  <FieldItem label="当前速度" value={`${selected.speed} km/h`} />
                  <FieldItem label="当前位置" value={selected.location} highlight={selected.deviation} />
                  <FieldItem label="GPS状态" value={selected.gpsStatus} />
                  <FieldItem label="罐体压力" value={selected.tankPressure} />
                  <FieldItem label="罐体温度" value={selected.tankTemp} />
                </FieldGrid>
              </DetailSection>
            </div>
            <div className="w-52 shrink-0">
              <AIPanel title="AI监控分析" items={[
                { label: '路线状态', value: selected.deviation ? '⚠ 偏离预定路线，偏离距离2.3km，正在联系驾驶员' : '✓ 按规定路线行驶，未发现异常', type: selected.deviation ? 'warning' : 'success' },
                { label: '疲劳驾驶', value: '车内AI摄像头监测：驾驶员精神状态正常，眼部闭合频率正常', type: 'success' },
                { label: '风险等级', value: `当前风险：${selected.risk}。${selected.risk === '极高' ? '建议立即联系处置，通知安全监管部门' : '保持常规监控'}`, type: selected.risk === '低' ? 'success' : 'warning' },
              ]} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function HazPersonnel() {
  const data = [
    { id: 'HP001', name: '张安全', idCard: '110101199001011234', type: '驾驶员', certType: '普通危货', certNo: 'HZ-DR-2020001', certExpiry: '2026-05-20', age: 34, company: '安全化工运输公司', status: '有效' },
    { id: 'HP002', name: '王押运', idCard: '110101198506121234', type: '押运员', certType: '剧毒化学品押运', certNo: 'HZ-ES-2019015', certExpiry: '2025-12-31', age: 39, company: '危化品物流有限公司', status: '即将到期' },
    { id: 'HP003', name: '李爆安', idCard: '110101199203031234', type: '押运员', certType: '爆炸品押运', certNo: 'HZ-ES-2021008', certExpiry: '2027-08-15', age: 32, company: '爆炸品运输专业公司', status: '有效' },
  ]

  return (
    <div className="card">
      <div className="card-header">
        <FilterBar searchPlaceholder="搜索姓名/证件号..." filters={[
          { label: '人员类型', options: [{value:'全部',label:'全部'},{value:'驾驶员',label:'驾驶员'},{value:'押运员',label:'押运员'}], value: '全部', onChange: () => {} },
        ]} />
      </div>
      <DataTable
        columns={[
          { key: 'id', title: '编号', width: 90 },
          { key: 'name', title: '姓名' },
          { key: 'type', title: '人员类型', render: (v: string) => <StatusBadge label={v} variant={v === '驾驶员' ? 'info' : 'purple'} /> },
          { key: 'certType', title: '资格证类别', render: (v: string) => (
            <span className={`text-xs px-2 py-0.5 rounded border ${v.includes('剧毒') || v.includes('爆炸') ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>{v}</span>
          )},
          { key: 'certNo', title: '资格证编号' },
          { key: 'age', title: '年龄', align: 'center' as const },
          { key: 'certExpiry', title: '到期时间' },
          { key: 'company', title: '所属单位' },
          { key: 'status', title: '状态', render: (v: string) => <StatusBadge label={v} variant={v === '有效' ? 'success' : 'warning'} /> },
        ]}
        data={data}
        rowKey="id"
      />
    </div>
  )
}

function HazApplication() {
  return (
    <div className="card p-8 flex flex-col items-center justify-center">
      <AlertTriangle size={40} className="text-amber-400 mb-3" />
      <div className="text-base font-semibold text-gray-700 mb-2">危险货物运输许可申请</div>
      <div className="text-sm text-gray-500 mb-4 text-center max-w-sm">
        危货运输许可需满足17项强制性条件，AI将逐项核验并给出符合性分析报告
      </div>
      <button className="btn-primary">
        <Sparkles size={14} />AI辅助发起申请
      </button>
    </div>
  )
}
