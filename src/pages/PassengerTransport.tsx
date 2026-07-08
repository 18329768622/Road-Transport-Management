import React, { useState } from 'react'
import { Bus, MapPin, Users, Clock, Sparkles, Plus, TrendingUp } from 'lucide-react'
import DataTable from '../components/DataTable'
import { FilterBar } from '../components/FilterBar'
import Modal, { DetailSection, FieldGrid, FieldItem } from '../components/Modal'
import StatusBadge, { RiskBadge, AIBadge } from '../components/StatusBadge'
import AIPanel from '../components/AIPanel'
import { passengers, routes } from '../data/mockData'

type PTab = '运营企业' | '客运班线' | '招投标管理' | '运单管理'

export default function PassengerTransport() {
  const [tab, setTab] = useState<PTab>('运营企业')
  const [selectedCompany, setSelectedCompany] = useState<any>(null)
  const [selectedRoute, setSelectedRoute] = useState<any>(null)

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-gov-800">道路旅客运输管理</h1>
            <p className="text-xs text-gray-500 mt-0.5">第六章 · 旅客运输许可、客运班线管理、票价监管、智能调度</p>
          </div>
          <div className="flex items-center gap-2">
            <AIBadge label="AI客流预测" />
            <button className="btn-primary"><Plus size={14} />新增班线申请</button>
          </div>
        </div>
        <div className="flex gap-1 mt-4 border-b border-gray-100 -mb-4">
          {(['运营企业', '客运班线', '招投标管理', '运单管理'] as PTab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${tab === t ? 'border-gov-500 text-gov-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {tab === '运营企业' && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: '客运营运企业', value: 328, sub: '持有效许可证', color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: '在营班线', value: 1256, sub: '跨省+省内+旅游', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: '在营客车', value: 8940, sub: '各类型客运车辆', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: '本月旅客运量', value: '285万', sub: '同比+3.2%', color: 'text-amber-600', bg: 'bg-amber-50' },
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
                <FilterBar searchPlaceholder="搜索企业名称/许可证号..." filters={[
                  { label: '状态', options: [{value:'全部',label:'全部'},{value:'正常',label:'正常'},{value:'警告',label:'警告'}], value: '全部', onChange: () => {} },
                  { label: '信用等级', options: [{value:'全部',label:'全部'},{value:'AA',label:'AA'},{value:'A',label:'A'},{value:'B',label:'B'}], value: '全部', onChange: () => {} },
                ]} />
              </div>
              <DataTable
                columns={[
                  { key: 'id', title: '编号', width: 80 },
                  { key: 'name', title: '企业名称', render: (v: string, row: any) => (
                    <div><div className="font-medium">{v}</div><div className="text-xs text-gray-400">{row.licenseNo}</div></div>
                  )},
                  { key: 'legalPerson', title: '法人代表' },
                  { key: 'routes', title: '班线数', align: 'center' as const },
                  { key: 'vehicles', title: '车辆数', align: 'center' as const },
                  { key: 'seats', title: '座位数', align: 'center' as const },
                  { key: 'creditLevel', title: '信用等级', render: (v: string) => <StatusBadge label={v} variant={v === 'AA' ? 'success' : v === 'A' ? 'info' : 'warning'} /> },
                  { key: 'aiScore', title: 'AI综合分', render: (v: number) => (
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 bg-gray-100 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${v >= 80 ? 'bg-emerald-500' : v >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${v}%` }} />
                      </div>
                      <span className="text-xs font-medium">{v}</span>
                    </div>
                  )},
                  { key: 'status', title: '状态', render: (v: string) => <StatusBadge label={v} variant={v === '正常' ? 'success' : 'warning'} /> },
                  { key: 'expireDate', title: '有效期至' },
                ]}
                data={passengers}
                rowKey="id"
                onRowClick={setSelectedCompany}
              />
            </div>
          </div>
        )}

        {tab === '客运班线' && (
          <div className="space-y-4">
            <div className="card">
              <div className="card-header">
                <FilterBar searchPlaceholder="搜索班线/起终点..." filters={[
                  { label: '线路类型', options: [{value:'全部',label:'全部'},{value:'高速',label:'高速'},{value:'旅游线路',label:'旅游'}], value: '全部', onChange: () => {} },
                  { label: '状态', options: [{value:'全部',label:'全部'},{value:'正常',label:'正常'},{value:'暂停',label:'暂停'}], value: '全部', onChange: () => {} },
                ]} actions={<button className="btn-primary"><Plus size={13} />新增班线</button>} />
              </div>
              <DataTable
                columns={[
                  { key: 'id', title: '班线编号', width: 90 },
                  { key: 'company', title: '经营企业' },
                  { key: 'from', title: '起始站', render: (v: string) => (
                    <div className="flex items-center gap-1"><MapPin size={11} className="text-gov-400" />{v}</div>
                  )},
                  { key: 'to', title: '终到站', render: (v: string) => (
                    <div className="flex items-center gap-1"><MapPin size={11} className="text-red-400" />{v}</div>
                  )},
                  { key: 'distance', title: '里程(km)', align: 'center' as const },
                  { key: 'km', title: '线路类型' },
                  { key: 'frequency', title: '班次/天', align: 'center' as const },
                  { key: 'vehicles', title: '配车数', align: 'center' as const },
                  { key: 'fare', title: '票价(元)', align: 'center' as const },
                  { key: 'passengers30', title: '月旅客量', render: (v: number) => v.toLocaleString() },
                  { key: 'status', title: '状态', render: (v: string) => <StatusBadge label={v} variant={v === '正常' ? 'success' : 'warning'} /> },
                ]}
                data={routes}
                rowKey="id"
                onRowClick={setSelectedRoute}
              />
            </div>
          </div>
        )}

        {tab === '招投标管理' && <BidManagement />}
        {tab === '运单管理' && <WaybillManagement />}
      </div>

      {/* Company Detail */}
      <Modal open={!!selectedCompany} onClose={() => setSelectedCompany(null)}
        title={selectedCompany?.name ?? ''} subtitle={`许可证：${selectedCompany?.licenseNo}`}
        width="xl"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setSelectedCompany(null)}>关闭</button>
            <button className="btn-primary"><Sparkles size={13} />AI运营分析</button>
          </>
        }
      >
        {selectedCompany && (
          <div className="flex gap-5">
            <div className="flex-1 space-y-4">
              <DetailSection title="企业基本信息">
                <FieldGrid cols={3}>
                  <FieldItem label="企业名称" value={selectedCompany.name} highlight />
                  <FieldItem label="许可证编号" value={selectedCompany.licenseNo} />
                  <FieldItem label="法人代表" value={selectedCompany.legalPerson} />
                  <FieldItem label="联系电话" value={selectedCompany.phone} />
                  <FieldItem label="班线数量" value={`${selectedCompany.routes} 条`} />
                  <FieldItem label="在营车辆" value={`${selectedCompany.vehicles} 辆`} />
                  <FieldItem label="核定座位数" value={`${selectedCompany.seats} 席`} />
                  <FieldItem label="信用等级" value={<StatusBadge label={selectedCompany.creditLevel} variant={selectedCompany.creditLevel === 'AA' ? 'success' : 'info'} size="md" />} />
                  <FieldItem label="有效期至" value={selectedCompany.expireDate} />
                </FieldGrid>
              </DetailSection>
              <DetailSection title="AI客流预测" icon={<TrendingUp size={14} className="text-gov-500" />}>
                <div className="grid grid-cols-3 gap-3">
                  {['近7日', '近30日', '近90日'].map((p, i) => (
                    <div key={p} className="bg-blue-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">{p}旅客量</div>
                      <div className="text-lg font-bold text-blue-600">{[42580, 185200, 528400][i].toLocaleString()}</div>
                      <div className="text-xs text-emerald-600 mt-0.5">↑ {[3.2, 5.1, 8.7][i]}%</div>
                    </div>
                  ))}
                </div>
              </DetailSection>
            </div>
            <div className="w-60 shrink-0">
              <AIPanel title="AI 运营分析" items={[
                { label: 'AI综合评分', value: `${selectedCompany.aiScore} / 100分`, type: selectedCompany.aiScore >= 80 ? 'success' : 'warning' },
                { label: '客流量预测', value: '预测下月旅客量环比增长4.2%，建议高峰时段适当增班', type: 'info' },
                { label: '运力匹配度', value: '当前运力配置合理，平均上座率78.5%，高峰时段可适当增加班次', type: 'success' },
                { label: '安全状态', value: selectedCompany.status === '警告' ? '存在安全隐患，建议立即整改' : '近90天无安全事故，安全状态良好', type: selectedCompany.status === '警告' ? 'warning' : 'success' },
              ]} />
            </div>
          </div>
        )}
      </Modal>

      {/* Route Detail */}
      <Modal open={!!selectedRoute} onClose={() => setSelectedRoute(null)}
        title={`班线详情 — ${selectedRoute?.from} → ${selectedRoute?.to}`}
        subtitle={`班线编号：${selectedRoute?.id}`}
        width="lg"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setSelectedRoute(null)}>关闭</button>
            <button className="btn-primary"><Sparkles size={13} />AI调度优化</button>
          </>
        }
      >
        {selectedRoute && (
          <div className="flex gap-4">
            <div className="flex-1 space-y-3">
              <DetailSection title="班线基本信息">
                <FieldGrid cols={2}>
                  <FieldItem label="起始站" value={selectedRoute.from} highlight />
                  <FieldItem label="终到站" value={selectedRoute.to} highlight />
                  <FieldItem label="行驶里程" value={`${selectedRoute.distance} km`} />
                  <FieldItem label="线路类型" value={selectedRoute.km} />
                  <FieldItem label="日发班次" value={`${selectedRoute.frequency} 班`} />
                  <FieldItem label="配置车辆" value={`${selectedRoute.vehicles} 辆`} />
                  <FieldItem label="核定票价" value={`¥${selectedRoute.fare}`} />
                  <FieldItem label="经营企业" value={selectedRoute.company} />
                </FieldGrid>
              </DetailSection>
              <DetailSection title="运营数据">
                <FieldGrid cols={2}>
                  <FieldItem label="本月旅客量" value={`${selectedRoute.passengers30.toLocaleString()} 人次`} />
                  <FieldItem label="状态" value={<StatusBadge label={selectedRoute.status} variant={selectedRoute.status === '正常' ? 'success' : 'warning'} />} />
                </FieldGrid>
              </DetailSection>
            </div>
            <div className="w-52 shrink-0">
              <AIPanel title="AI调度建议" items={[
                { label: '客流预测', value: '预测本周末客流量将达到工作日2.8倍，建议周末增班3班', type: 'info' },
                { label: '票价合规', value: selectedRoute.status === '暂停' ? '⚠ 发现票价违规行为，已生成整改通知' : '✓ 票价符合核定标准，未发现违规', type: selectedRoute.status === '暂停' ? 'warning' : 'success' },
                { label: '运力建议', value: `建议将配车数调整为 ${selectedRoute.vehicles + 1} 辆，以满足高峰需求`, type: 'info' },
              ]} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function BidManagement() {
  const [selected, setSelected] = useState<any>(null)
  const bids = [
    { id: 'BID2024001', route: '本市→省城（北线）', deadline: '2024-07-15', bidders: 5, status: '评标中', aiCollude: false },
    { id: 'BID2024002', route: '本市→旅游景区群', deadline: '2024-07-20', bidders: 3, status: '公告期', aiCollude: false },
    { id: 'BID2024003', route: '本市→邻市（南线）', deadline: '2024-06-30', bidders: 4, status: '已定标', aiCollude: true },
  ]
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">客运班线招投标管理</div>
        <AIBadge label="AI辅助评标" />
      </div>
      <DataTable
        columns={[
          { key: 'id', title: '招标编号', width: 110 },
          { key: 'route', title: '招标班线' },
          { key: 'deadline', title: '截止日期' },
          { key: 'bidders', title: '投标方数', align: 'center' as const },
          { key: 'aiCollude', title: 'AI围串标检测', render: (v: boolean) => (
            <div className="flex items-center gap-1">
              {v ? <><span className="w-2 h-2 bg-red-500 rounded-full" /><span className="text-xs text-red-600 font-medium">发现异常</span></> : <><span className="w-2 h-2 bg-emerald-500 rounded-full" /><span className="text-xs text-emerald-600">未发现异常</span></>}
            </div>
          )},
          { key: 'status', title: '状态', render: (v: string) => <StatusBadge label={v} variant={v === '已定标' ? 'success' : v === '评标中' ? 'warning' : 'info'} /> },
          { key: 'action', title: '操作', render: (_: any, row: any) => (
            <button onClick={() => setSelected(row)} className="text-xs text-gov-500 hover:underline">评标助手</button>
          )},
        ]}
        data={bids}
        rowKey="id"
        onRowClick={setSelected}
      />
      <Modal open={!!selected} onClose={() => setSelected(null)} title={`评标详情 — ${selected?.route}`} width="md">
        {selected && (
          <AIPanel title="AI评标助手" items={[
            { label: '投标方评分', value: '已完成5家投标方资质智能评分，推荐：城际客运集团（92分）> 蓝天客运（87分）> 快捷旅游（72分）', type: 'info' },
            { label: '围串标检测', value: selected.aiCollude ? '⚠ 发现两家投标方IP地址相同，疑似串标，建议人工核查' : '✓ 未发现围标/串标风险，投标行为正常', type: selected.aiCollude ? 'warning' : 'success' },
            { label: 'AI推荐中标', value: '综合评分建议：城际客运集团（总分第一）作为中标候选人', type: 'info' },
          ]} />
        )}
      </Modal>
    </div>
  )
}

function WaybillManagement() {
  const waybills = [
    { id: 'WB2024001', plate: '粤C34567', route: '本市→省城', date: '2024-06-20', driver: '张志远', passengers: 42, capacity: 45, fare: 68, status: '合规', aiAlert: '无异常' },
    { id: 'WB2024002', plate: '粤E56789', route: '本市→旅游景区', date: '2024-06-20', driver: '陈海波', passengers: 38, capacity: 38, fare: 25, status: '合规', aiAlert: '无异常' },
    { id: 'WB2024003', plate: '粤F67890', route: '本市→邻市', date: '2024-06-19', driver: '王运客', passengers: 52, capacity: 45, fare: 52, status: '违规', aiAlert: '超载7人' },
  ]
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">客运运单管理</div>
        <AIBadge label="AI智能核验" />
      </div>
      <DataTable
        columns={[
          { key: 'id', title: '运单编号', width: 110 },
          { key: 'plate', title: '车牌号', render: (v: string) => <span className="font-mono font-semibold text-gov-700">{v}</span> },
          { key: 'route', title: '运行线路' },
          { key: 'date', title: '运行日期' },
          { key: 'driver', title: '驾驶员' },
          { key: 'passengers', title: '实载人数', align: 'center' as const },
          { key: 'capacity', title: '核定人数', align: 'center' as const },
          { key: 'fare', title: '票价(元)', align: 'center' as const },
          { key: 'aiAlert', title: 'AI核验结果', render: (v: string) => (
            <div className="flex items-center gap-1.5">
              <Sparkles size={11} className="text-indigo-400" />
              <span className={`text-xs ${v === '无异常' ? 'text-emerald-600' : 'text-red-600 font-semibold'}`}>{v}</span>
            </div>
          )},
          { key: 'status', title: '合规状态', render: (v: string) => <StatusBadge label={v} variant={v === '合规' ? 'success' : 'danger'} /> },
        ]}
        data={waybills}
        rowKey="id"
      />
    </div>
  )
}
