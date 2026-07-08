import React, { useState } from 'react'
import { Plus, Sparkles, CheckCircle, AlertTriangle, Bus, Camera, Calendar, TrendingUp } from 'lucide-react'
import DataTable from '../components/DataTable'
import { FilterBar } from '../components/FilterBar'
import Modal, { DetailSection, FieldGrid, FieldItem } from '../components/Modal'
import StatusBadge, { AIBadge } from '../components/StatusBadge'
import AIPanel from '../components/AIPanel'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

type PTab = '站场档案' | '进出站管理' | '发班调度'

const pStations = [
  { id: 'KY001', name: '市汽车客运中心站', grade: '一级', address: '中心城区交通大道1号', legalPerson: '刘文海', phone: '13812340010', status: '正常', certNo: 'KY2018001', certExpiry: '2028-05-19', dailyPassengers: 12800, platforms: 20, routes: 28, aiScore: 95, cameras: 48 },
  { id: 'KY002', name: '北部公路客运站', grade: '二级', address: '北城区汽车站路55号', legalPerson: '张国华', phone: '13987650010', status: '正常', certNo: 'KY2019002', certExpiry: '2029-08-14', dailyPassengers: 5600, platforms: 12, routes: 15, aiScore: 88, cameras: 24 },
  { id: 'KY003', name: '东站旅游客运站', grade: '二级', address: '东区旅游路18号', legalPerson: '王旅游', phone: '15678900010', status: '正常', certNo: 'KY2020003', certExpiry: '2030-03-09', dailyPassengers: 3200, platforms: 8, routes: 10, aiScore: 82, cameras: 16 },
  { id: 'KY004', name: '南郊公路客运站', grade: '三级', address: '南郊公路货运路31号', legalPerson: '陈南郊', phone: '18923450010', status: '警告', certNo: 'KY2015004', certExpiry: '2025-09-30', dailyPassengers: 980, platforms: 4, routes: 5, aiScore: 54, cameras: 8 },
]

const entryRecords = [
  { id: 'EN001', plate: '粤C34567', company: '城际客运集团', route: '本市→省城', driver: '张志远', entryTime: '07:23:15', status: '进站', passengers: 42, plateConfidence: 99.8 },
  { id: 'EN002', plate: '粤E56789', company: '蓝天客运', route: '本市→市内景区', driver: '陈海波', entryTime: '07:31:42', status: '进站', passengers: 38, plateConfidence: 99.5 },
  { id: 'EN003', plate: '粤A78901', company: '快捷旅游客运', route: '本市→邻市', driver: '李旅游', entryTime: '07:45:08', status: '发车', passengers: 45, plateConfidence: 98.9 },
  { id: 'EN004', plate: '粤B89012', company: '城际客运集团', route: '本市→省城', driver: '赵城际', entryTime: '07:52:31', status: '到站', passengers: 39, plateConfidence: 99.2 },
  { id: 'EN005', plate: '粤D90123', company: '蓝天客运', route: '本市→临港', driver: '刘大海', entryTime: '08:02:15', status: '进站', passengers: 0, plateConfidence: 97.8 },
  { id: 'EN006', plate: '未识别', company: '—', route: '—', driver: '—', entryTime: '08:15:33', status: '异常', passengers: 0, plateConfidence: 41.2 },
]

const schedules = [
  { id: 'SC001', route: '本市→省城汽车北站', company: '城际客运集团', plate: '粤C34567', driver: '张志远', planTime: '08:00', actualTime: '08:02', status: '正常发班', seats: 45, booked: 42, aiAlert: '' },
  { id: 'SC002', route: '本市→市内各景区', company: '蓝天客运', plate: '粤E56789', driver: '陈海波', planTime: '08:30', actualTime: '—', status: '待发班', seats: 49, booked: 38, aiAlert: '' },
  { id: 'SC003', route: '本市→邻市汽车站', company: '快捷旅游客运', plate: '粤F01234', driver: '王快捷', planTime: '09:00', actualTime: '—', status: '待发班', seats: 45, booked: 45, aiAlert: '满员，建议加班' },
  { id: 'SC004', route: '本市→省城汽车北站', company: '城际客运集团', plate: '粤G12345', driver: '李志城', planTime: '09:30', actualTime: '—', status: '待发班', seats: 45, booked: 28, aiAlert: '' },
  { id: 'SC005', route: '本市→临港新区', company: '蓝天客运', plate: '粤H23456', driver: '刘大海', planTime: '10:00', actualTime: '—', status: '待发班', seats: 49, booked: 12, aiAlert: '客座率偏低，AI建议合班' },
]

const passengerTrend = [
  { hour: '6时', count: 850 }, { hour: '7时', count: 2100 }, { hour: '8时', count: 3200 },
  { hour: '9时', count: 1800 }, { hour: '10时', count: 1200 }, { hour: '11时', count: 980 },
  { hour: '12时', count: 1100 }, { hour: '13时', count: 1350 }, { hour: '14时', count: 1600 },
]

export default function PassengerStation() {
  const [tab, setTab] = useState<PTab>('站场档案')
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-gov-800">道路客运站管理</h1>
            <p className="text-xs text-gray-500 mt-0.5">第七章 · 客运站级核定、进出站管理、智能发班调度、AI安全监控</p>
          </div>
          <div className="flex items-center gap-2">
            <AIBadge label="AI进出站识别在线" />
            <button className="btn-primary"><Plus size={14} />新增客运站</button>
          </div>
        </div>
        <div className="flex gap-1 mt-4 border-b border-gray-100 -mb-4">
          {(['站场档案', '进出站管理', '发班调度'] as PTab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${tab === t ? 'border-gov-500 text-gov-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {t}
              {t === '进出站管理' && <span className="ml-1.5 px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-xs">1异常</span>}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        {tab === '站场档案' && <StationList />}
        {tab === '进出站管理' && <EntryManagement />}
        {tab === '发班调度' && <ScheduleManagement />}
      </div>
    </div>
  )
}

function StationList() {
  const [selected, setSelected] = useState<typeof pStations[0] | null>(null)
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '客运站总数', value: '42', sub: '持有效许可证', color: 'text-gov-600', bg: 'bg-gov-50' },
          { label: '日均旅客量', value: '22,580', sub: '全市合计', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: '一级站场', value: '8', sub: '主枢纽站', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: '安全监控覆盖', value: '96.8%', sub: 'AI视频覆盖率', color: 'text-indigo-600', bg: 'bg-indigo-50' },
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
          <FilterBar searchPlaceholder="搜索客运站名称..."
            filters={[{ label: '等级', options: [{value:'全部',label:'全部'},{value:'一级',label:'一级'},{value:'二级',label:'二级'},{value:'三级',label:'三级'}], value: '全部', onChange: () => {} }]}
            onExport={() => {}} onRefresh={() => {}}
          />
        </div>
        <DataTable
          columns={[
            { key: 'id', title: '编号', width: 80 },
            { key: 'name', title: '客运站名称', render: (v: string, row: any) => (
              <div><div className="font-medium text-sm">{v}</div><div className="text-xs text-gray-400">{row.certNo}</div></div>
            )},
            { key: 'grade', title: '站级', render: (v: string) => <StatusBadge label={v} variant={v === '一级' ? 'success' : v === '二级' ? 'info' : 'warning'} /> },
            { key: 'legalPerson', title: '负责人' },
            { key: 'platforms', title: '发车位(个)', align: 'center' as const },
            { key: 'routes', title: '经营班线(条)', align: 'center' as const },
            { key: 'dailyPassengers', title: '日均旅客量', render: (v: number) => v.toLocaleString() },
            { key: 'cameras', title: '监控摄像头', align: 'center' as const },
            { key: 'aiScore', title: 'AI安全评分', render: (v: number) => (
              <div className="flex items-center gap-1.5">
                <div className="w-14 bg-gray-100 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${v >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${v}%` }} /></div>
                <span className="text-xs">{v}</span>
              </div>
            )},
            { key: 'status', title: '状态', render: (v: string) => <StatusBadge label={v} variant={v === '正常' ? 'success' : 'warning'} /> },
          ]}
          data={pStations} rowKey="id" onRowClick={setSelected}
        />
      </div>
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ''} subtitle={`许可证：${selected?.certNo}`} width="xl"
        footer={<><button className="btn-secondary" onClick={() => setSelected(null)}>关闭</button><button className="btn-primary"><Camera size={13} />查看监控</button><button className="btn-primary"><Sparkles size={13} />AI安全审查</button></>}>
        {selected && (
          <div className="flex gap-5">
            <div className="flex-1 space-y-4">
              <DetailSection title="站场基本信息">
                <FieldGrid cols={3}>
                  <FieldItem label="客运站名称" value={selected.name} highlight />
                  <FieldItem label="站级核定" value={<StatusBadge label={selected.grade} variant={selected.grade === '一级' ? 'success' : 'info'} size="md" />} />
                  <FieldItem label="许可证号" value={selected.certNo} />
                  <FieldItem label="负责人" value={selected.legalPerson} />
                  <FieldItem label="联系电话" value={selected.phone} />
                  <FieldItem label="许可证有效期" value={selected.certExpiry} />
                  <FieldItem label="发车站台数" value={`${selected.platforms} 个`} />
                  <FieldItem label="经营班线数" value={`${selected.routes} 条`} />
                  <FieldItem label="日均旅客量" value={`${selected.dailyPassengers.toLocaleString()} 人次`} />
                </FieldGrid>
              </DetailSection>
              <DetailSection title="安全管理检查项">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: '安全责任制落实', ok: true },
                    { label: '视频监控系统', ok: true },
                    { label: '实名购票系统', ok: true },
                    { label: '安检设备配置', ok: selected.grade !== '三级' || selected.aiScore >= 60 },
                    { label: '消防设施达标', ok: selected.status !== '警告' },
                    { label: '应急预案制定', ok: selected.aiScore >= 60 },
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
              <AIPanel title="AI 客运站分析" items={[
                { label: 'AI安全评分', value: <div className="text-2xl font-bold text-indigo-300">{selected.aiScore}<span className="text-sm ml-1">/ 100</span></div>, type: selected.aiScore >= 80 ? 'success' : 'warning' },
                { label: 'AI视频巡查', value: selected.status === '警告' ? '发现安全隐患2处，建议立即整改' : `${selected.cameras}路摄像头运行正常，未发现异常`, type: selected.status === '警告' ? 'warning' : 'success' },
                { label: '发班准点率', value: `近7日平均准点率 ${selected.aiScore >= 80 ? '97.2' : '89.5'}%，${selected.aiScore >= 80 ? '运营正常' : '部分班次存在延误'}`, type: selected.aiScore >= 80 ? 'success' : 'warning' },
              ]} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function EntryManagement() {
  const [selected, setSelected] = useState<typeof entryRecords[0] | null>(null)
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '今日进站车次', value: '248', sub: '实时统计', color: 'text-gov-600', bg: 'bg-gov-50' },
          { label: '识别成功率', value: '99.3%', sub: 'AI车牌识别', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: '今日旅客量', value: '8,420', sub: '今日已发班', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: '异常记录', value: '3', sub: '需人工核查', color: 'text-red-600', bg: 'bg-red-50' },
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
            <div className="card-title flex items-center gap-2"><Camera size={14} className="text-gov-500" />实时进出站记录（车牌AI识别）</div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              实时更新
            </div>
          </div>
          <DataTable
            columns={[
              { key: 'entryTime', title: '时间', render: (v: string) => <span className="font-mono text-xs">{v}</span> },
              { key: 'plate', title: '车牌号', render: (v: string, row: any) => (
                <span className={`font-mono font-semibold ${row.status === '异常' ? 'text-red-600' : 'text-gov-700'}`}>{v}</span>
              )},
              { key: 'company', title: '所属公司' },
              { key: 'route', title: '班线' },
              { key: 'driver', title: '驾驶员' },
              { key: 'passengers', title: '旅客(人)', align: 'center' as const },
              { key: 'plateConfidence', title: 'AI置信度', render: (v: number) => (
                <span className={`text-xs font-medium ${v >= 90 ? 'text-emerald-600' : v >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{v}%</span>
              )},
              { key: 'status', title: '状态', render: (v: string) => <StatusBadge label={v} variant={v === '异常' ? 'danger' : v === '发车' ? 'success' : 'info'} /> },
            ]}
            data={entryRecords} rowKey="id" onRowClick={setSelected}
          />
        </div>

        <div className="space-y-4">
          <div className="card p-4">
            <div className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"><TrendingUp size={14} className="text-gov-500" />今日旅客流量（按时段）</div>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={passengerTrend} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="hour" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 9 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#0052CC" name="旅客人数" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card p-4">
            <div className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><AlertTriangle size={13} className="text-amber-500" />AI异常预警</div>
            <div className="space-y-2">
              {[
                { time: '08:15:33', desc: '未识别车牌进站，AI置信度41.2%，建议人工核查', level: '高' },
                { time: '07:42:11', desc: '非计划班次车辆进站，班线信息不匹配', level: '中' },
              ].map((alert, i) => (
                <div key={i} className={`p-2.5 rounded text-xs border ${alert.level === '高' ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'}`}>
                  <div className={`font-mono font-semibold mb-1 ${alert.level === '高' ? 'text-red-600' : 'text-amber-600'}`}>{alert.time}</div>
                  <div className="text-gray-600">{alert.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={`进出站记录 — ${selected?.plate}`} width="md"
        footer={<><button className="btn-secondary" onClick={() => setSelected(null)}>关闭</button>{selected?.status === '异常' && <button className="btn-primary"><AlertTriangle size={13} />标记处理</button>}</>}>
        {selected && (
          <AIPanel title="AI 进站核验分析" items={[
            { label: '车牌识别结果', value: `识别车牌：${selected.plate}，AI置信度：${selected.plateConfidence}%`, type: selected.plateConfidence >= 90 ? 'success' : 'warning' },
            { label: '班线核验', value: selected.status !== '异常' ? `班线信息匹配：${selected.route}，驾驶员：${selected.driver}` : '未找到匹配班线信息，需人工核查', type: selected.status !== '异常' ? 'success' : 'warning' },
            { label: '处理建议', value: selected.status === '异常' ? '建议立即派员核查车辆信息，确认是否属于非法营运' : '核验通过，正常放行', type: selected.status === '异常' ? 'warning' : 'success' },
          ]} />
        )}
      </Modal>
    </div>
  )
}

function ScheduleManagement() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '今日计划班次', value: '186', sub: '全站合计', color: 'text-gov-600', bg: 'bg-gov-50' },
          { label: '已发班', value: '52', sub: '准点率97.2%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: '待发班', value: '134', sub: '正常等待', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'AI调度建议', value: '5', sub: '加班/合班建议', color: 'text-amber-600', bg: 'bg-amber-50' },
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
          <div className="card-title flex items-center gap-2"><Calendar size={14} className="text-gov-500" />今日发班计划</div>
          <AIBadge label="智能调度引擎 v2.0" />
        </div>
        <DataTable
          columns={[
            { key: 'id', title: '班次编号', width: 90 },
            { key: 'route', title: '班线', render: (v: string) => <span className="font-medium text-sm">{v}</span> },
            { key: 'company', title: '承运公司' },
            { key: 'plate', title: '车牌号', render: (v: string) => <span className="font-mono font-semibold text-gov-700">{v}</span> },
            { key: 'driver', title: '驾驶员' },
            { key: 'planTime', title: '计划发班时间', align: 'center' as const },
            { key: 'actualTime', title: '实际发班时间', render: (v: string) => <span className={v === '—' ? 'text-gray-300' : 'text-emerald-600 font-medium'}>{v}</span> },
            { key: 'booked', title: '已售/总座', render: (v: number, row: any) => (
              <div className="flex items-center gap-1.5">
                <div className="w-12 bg-gray-100 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${v / row.seats >= 0.9 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${v / row.seats * 100}%` }} /></div>
                <span className="text-xs">{v}/{row.seats}</span>
              </div>
            )},
            { key: 'aiAlert', title: 'AI调度建议', render: (v: string) => v ? (
              <span className="flex items-center gap-1 text-xs text-amber-600"><Sparkles size={10} className="text-indigo-400" />{v}</span>
            ) : <span className="text-gray-300 text-xs">—</span> },
            { key: 'status', title: '状态', render: (v: string) => <StatusBadge label={v} variant={v === '正常发班' ? 'success' : 'info'} /> },
          ]}
          data={schedules} rowKey="id"
        />
      </div>
    </div>
  )
}
