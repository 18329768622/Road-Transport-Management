import React, { useState } from 'react'
import { Plus, Sparkles, CheckCircle, AlertTriangle, Users, BookOpen, GraduationCap, Award, Clock } from 'lucide-react'
import DataTable from '../components/DataTable'
import { FilterBar, Pagination } from '../components/FilterBar'
import Modal, { DetailSection, FieldGrid, FieldItem } from '../components/Modal'
import StatusBadge, { AIBadge, RiskBadge } from '../components/StatusBadge'
import AIPanel from '../components/AIPanel'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

type TTab = '培训机构' | '学员管理' | '考核管理'

const institutions = [
  { id: 'PX001', name: '安驾驾驶培训学校', certNo: 'PX2020001', type: '一类学校', legalPerson: '张安驾', phone: '13812340020', coaches: 28, students: 320, address: '开发区驾培路1号', status: '正常', passRate: 92.5, aiScore: 91, certExpiry: '2028-05-19', monthlyGrad: 85 },
  { id: 'PX002', name: '捷达驾驶培训中心', certNo: 'PX2021002', type: '二类学校', legalPerson: '李捷达', phone: '13987650020', coaches: 15, students: 185, address: '北区培训大道88号', status: '正常', passRate: 88.2, aiScore: 85, certExpiry: '2027-08-14', monthlyGrad: 42 },
  { id: 'PX003', name: '远程道路运输驾培中心', certNo: 'PX2019003', type: '一类学校', legalPerson: '王远程', phone: '15678900020', coaches: 22, students: 260, address: '南部新城培训区', status: '警告', passRate: 71.8, aiScore: 58, certExpiry: '2026-11-30', monthlyGrad: 38 },
  { id: 'PX004', name: '新华驾驶培训学校', certNo: 'PX2022004', type: '一类学校', legalPerson: '陈新华', phone: '18923450020', coaches: 32, students: 410, address: '西区驾培基地', status: '正常', passRate: 94.1, aiScore: 96, certExpiry: '2030-03-09', monthlyGrad: 98 },
]

const students = [
  { id: 'ST001', name: '张学员', idCard: '110101200001011234', phone: '13812341001', institution: '安驾驾驶培训学校', course: '道路货物运输从业资格', enrollDate: '2024-03-15', planHours: 40, completedHours: 36, faceCheckins: 35, status: '学习中', aiStatus: '正常', aiRisk: '低' },
  { id: 'ST002', name: '李学员', idCard: '110101199901021234', phone: '13987651001', institution: '新华驾驶培训学校', course: '旅客运输从业资格', enrollDate: '2024-02-20', planHours: 40, completedHours: 40, faceCheckins: 38, status: '待考核', aiStatus: '正常', aiRisk: '低' },
  { id: 'ST003', name: '王学员', idCard: '110101200203031234', phone: '15678901001', institution: '远程道路运输驾培中心', course: '危险货物运输从业资格', enrollDate: '2024-04-01', planHours: 60, completedHours: 18, faceCheckins: 8, status: '学习中', aiStatus: '异常', aiRisk: '高' },
  { id: 'ST004', name: '赵学员', idCard: '110101199801041234', phone: '18923451001', institution: '捷达驾驶培训中心', course: '道路货物运输从业资格', enrollDate: '2024-01-10', planHours: 40, completedHours: 40, faceCheckins: 40, status: '已结业', aiStatus: '正常', aiRisk: '低' },
  { id: 'ST005', name: '陈学员', idCard: '110101200105051234', phone: '13567891001', institution: '安驾驾驶培训学校', course: '旅客运输从业资格', enrollDate: '2024-05-08', planHours: 40, completedHours: 22, faceCheckins: 20, status: '学习中', aiStatus: '正常', aiRisk: '低' },
]

const exams = [
  { id: 'EX001', name: '张学员', institution: '安驾驾驶培训学校', course: '道路货物运输从业资格', examDate: '2024-07-05', examType: '理论考试', score: 88, result: '通过', aiMonitor: '未发现异常', aiConfidence: 98 },
  { id: 'EX002', name: '李学员', institution: '新华驾驶培训学校', course: '旅客运输从业资格', examDate: '2024-07-03', examType: '理论考试', score: 92, result: '通过', aiMonitor: '未发现异常', aiConfidence: 99 },
  { id: 'EX003', name: '刘学员', institution: '远程道路运输驾培中心', course: '危险货物运输从业资格', examDate: '2024-07-01', examType: '理论考试', score: 54, result: '不通过', aiMonitor: '发现可疑操作，已记录', aiConfidence: 72 },
  { id: 'EX004', name: '周学员', institution: '新华驾驶培训学校', course: '道路货物运输从业资格', examDate: '2024-06-28', examType: '理论考试', score: 76, result: '通过', aiMonitor: '未发现异常', aiConfidence: 97 },
  { id: 'EX005', name: '吴学员', institution: '安驾驾驶培训学校', course: '旅客运输从业资格', examDate: '2024-06-25', examType: '理论+实操', score: 95, result: '通过', aiMonitor: '未发现异常', aiConfidence: 99 },
]

const passRateTrend = [
  { month: '1月', rate: 88.5 }, { month: '2月', rate: 87.2 }, { month: '3月', rate: 89.8 },
  { month: '4月', rate: 91.2 }, { month: '5月', rate: 90.5 }, { month: '6月', rate: 92.1 },
]

const hourAnomalies = [
  { institution: '远程道路运输驾培中心', student: '王学员', anomaly: '签到频率异常，短时间重复签到', date: '2024-06-28', severity: '高' },
  { institution: '远程道路运输驾培中心', student: '孙学员', anomaly: '学时完成度严重偏低（仅30%）', date: '2024-07-01', severity: '中' },
  { institution: '捷达驾驶培训中心', student: '周学员', anomaly: '课时完成质量低，AI识别挂机嫌疑', date: '2024-06-30', severity: '中' },
]

export default function DriverTraining() {
  const [tab, setTab] = useState<TTab>('培训机构')
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-gov-800">驾驶员培训管理</h1>
            <p className="text-xs text-gray-500 mt-0.5">第十章 · 驾培经营许可、教练员管理、学员管理、AI学时核验、考核监考</p>
          </div>
          <div className="flex items-center gap-2">
            <AIBadge label="AI学时核验在线" />
            <button className="btn-primary"><Plus size={14} />新增培训申请</button>
          </div>
        </div>
        <div className="flex gap-1 mt-4 border-b border-gray-100 -mb-4">
          {(['培训机构', '学员管理', '考核管理'] as TTab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${tab === t ? 'border-gov-500 text-gov-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {t}
              {t === '学员管理' && <span className="ml-1.5 px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-xs">{hourAnomalies.length}预警</span>}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        {tab === '培训机构' && <InstitutionList />}
        {tab === '学员管理' && <StudentManagement />}
        {tab === '考核管理' && <ExamManagement />}
      </div>
    </div>
  )
}

function InstitutionList() {
  const [selected, setSelected] = useState<typeof institutions[0] | null>(null)
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '驾培机构总数', value: '68', sub: '持有效许可证', color: 'text-gov-600', bg: 'bg-gov-50' },
          { label: '在校学员', value: '12,850', sub: '正在培训', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: '持证教练员', value: '1,285', sub: '有效资质', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: '综合通过率', value: '91.3%', sub: '近半年平均', color: 'text-indigo-600', bg: 'bg-indigo-50' },
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
            <FilterBar searchPlaceholder="搜索培训机构名称..."
              filters={[{ label: '类型', options: [{value:'全部',label:'全部'},{value:'一类学校',label:'一类学校'},{value:'二类学校',label:'二类学校'}], value: '全部', onChange: () => {} }]}
              onExport={() => {}} onRefresh={() => {}}
            />
          </div>
          <DataTable
            columns={[
              { key: 'id', title: '编号', width: 80 },
              { key: 'name', title: '机构名称', render: (v: string, row: any) => (
                <div><div className="font-medium text-sm">{v}</div><div className="text-xs text-gray-400">{row.certNo}</div></div>
              )},
              { key: 'type', title: '类型', render: (v: string) => <StatusBadge label={v} variant="info" /> },
              { key: 'legalPerson', title: '负责人' },
              { key: 'coaches', title: '教练员(人)', align: 'center' as const },
              { key: 'students', title: '在校学员', align: 'center' as const },
              { key: 'passRate', title: '通过率', render: (v: number) => (
                <div className="flex items-center gap-1.5">
                  <div className="w-12 bg-gray-100 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${v >= 85 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${v}%` }} /></div>
                  <span className="text-xs font-medium">{v}%</span>
                </div>
              )},
              { key: 'aiScore', title: 'AI评估分', render: (v: number) => (
                <span className={`font-bold text-sm ${v >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>{v}</span>
              )},
              { key: 'status', title: '状态', render: (v: string) => <StatusBadge label={v} variant={v === '正常' ? 'success' : 'warning'} /> },
            ]}
            data={institutions} rowKey="id" onRowClick={setSelected}
          />
        </div>

        <div className="space-y-4">
          <div className="card p-4">
            <div className="text-sm font-semibold text-gray-700 mb-3">考试通过率趋势</div>
            <ResponsiveContainer width="100%" height={130}>
              <LineChart data={passRateTrend} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => [v + '%', '通过率']} />
                <Line type="monotone" dataKey="rate" stroke="#0052CC" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="card p-4">
            <div className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><AlertTriangle size={13} className="text-amber-500" />AI学时预警</div>
            <div className="space-y-2">
              {hourAnomalies.map((a, i) => (
                <div key={i} className={`p-2.5 rounded text-xs border ${a.severity === '高' ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'}`}>
                  <div className="font-semibold text-gray-700">{a.institution} · {a.student}</div>
                  <div className={`mt-0.5 ${a.severity === '高' ? 'text-red-600' : 'text-amber-600'}`}>{a.anomaly}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ''} subtitle={`经营许可证：${selected?.certNo}`} width="xl"
        footer={<><button className="btn-secondary" onClick={() => setSelected(null)}>关闭</button><button className="btn-primary"><Sparkles size={13} />AI综合评估</button></>}>
        {selected && (
          <div className="flex gap-5">
            <div className="flex-1 space-y-4">
              <DetailSection title="机构基本信息">
                <FieldGrid cols={3}>
                  <FieldItem label="机构名称" value={selected.name} highlight />
                  <FieldItem label="机构类型" value={selected.type} />
                  <FieldItem label="许可证号" value={selected.certNo} />
                  <FieldItem label="负责人" value={selected.legalPerson} />
                  <FieldItem label="联系电话" value={selected.phone} />
                  <FieldItem label="许可证有效期" value={selected.certExpiry} />
                  <FieldItem label="教练员人数" value={`${selected.coaches} 人`} />
                  <FieldItem label="在校学员" value={`${selected.students} 人`} />
                  <FieldItem label="月均结业" value={`${selected.monthlyGrad} 人`} />
                </FieldGrid>
              </DetailSection>
              <DetailSection title="AI许可条件审查">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: '场地面积达标', ok: true },
                    { label: '教练员配置充足', ok: selected.coaches >= 10 },
                    { label: '模拟驾驶器配备', ok: selected.aiScore >= 70 },
                    { label: '车辆技术状况', ok: selected.status !== '警告' },
                    { label: 'AI学时管理系统', ok: selected.aiScore >= 60 },
                    { label: '人脸识别签到', ok: selected.aiScore >= 70 },
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
              <AIPanel title="AI 机构评估" items={[
                { label: 'AI综合评分', value: <div className="text-2xl font-bold text-indigo-300">{selected.aiScore}<span className="text-sm ml-1">/ 100</span></div>, type: selected.aiScore >= 80 ? 'success' : 'warning' },
                { label: '考试通过率', value: `${selected.passRate}%，${selected.passRate >= 85 ? '高于全市平均水平' : '低于全市平均水平，需加强培训质量'}`, type: selected.passRate >= 85 ? 'success' : 'warning' },
                { label: '学时合规性', value: selected.status === '警告' ? '发现学时异常记录，建议专项检查' : '近期学时数据正常，无异常记录', type: selected.status === '警告' ? 'warning' : 'success' },
              ]} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function StudentManagement() {
  const [selected, setSelected] = useState<typeof students[0] | null>(null)
  return (
    <div className="space-y-4">
      <div className="card">
        <div className="card-header">
          <FilterBar searchPlaceholder="搜索学员姓名/身份证..."
            filters={[
              { label: '状态', options: [{value:'全部',label:'全部'},{value:'学习中',label:'学习中'},{value:'待考核',label:'待考核'},{value:'已结业',label:'已结业'}], value: '全部', onChange: () => {} },
              { label: 'AI状态', options: [{value:'全部',label:'全部'},{value:'正常',label:'正常'},{value:'异常',label:'异常'}], value: '全部', onChange: () => {} },
            ]}
            onExport={() => {}} onRefresh={() => {}}
          />
        </div>
        <DataTable
          columns={[
            { key: 'id', title: '学员编号', width: 90 },
            { key: 'name', title: '姓名', render: (v: string) => <span className="font-semibold">{v}</span> },
            { key: 'institution', title: '培训机构', render: (v: string) => <span className="text-xs">{v}</span> },
            { key: 'course', title: '培训课程', render: (v: string) => <StatusBadge label={v.replace('从业资格', '')} variant="info" /> },
            { key: 'enrollDate', title: '入学日期' },
            { key: 'completedHours', title: '已完成/计划学时', render: (v: number, row: any) => (
              <div className="flex items-center gap-1.5">
                <div className="w-14 bg-gray-100 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${v / row.planHours >= 0.9 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(100, v / row.planHours * 100)}%` }} /></div>
                <span className="text-xs">{v}/{row.planHours}</span>
              </div>
            )},
            { key: 'faceCheckins', title: '人脸签到(次)', render: (v: number, row: any) => (
              <div className="flex items-center gap-1">
                <span className={v / row.completedHours < 0.7 ? 'text-red-600 font-semibold' : 'text-gray-600'}>{v}</span>
                {v / row.completedHours < 0.7 && <AlertTriangle size={11} className="text-red-500" />}
              </div>
            )},
            { key: 'aiStatus', title: 'AI学习状态', render: (v: string) => <StatusBadge label={v} variant={v === '正常' ? 'success' : 'danger'} /> },
            { key: 'aiRisk', title: 'AI风险', render: (v: string) => <RiskBadge level={v as any} /> },
            { key: 'status', title: '学员状态', render: (v: string) => <StatusBadge label={v} variant={v === '已结业' ? 'success' : v === '待考核' ? 'info' : 'default'} /> },
          ]}
          data={students} rowKey="id" onRowClick={setSelected}
        />
      </div>
      <Modal open={!!selected} onClose={() => setSelected(null)} title={`学员档案 — ${selected?.name}`} subtitle={`身份证：${selected?.idCard}`} width="lg"
        footer={<><button className="btn-secondary" onClick={() => setSelected(null)}>关闭</button><button className="btn-primary"><Sparkles size={13} />AI学时审核</button></>}>
        {selected && (
          <div className="flex gap-5">
            <div className="flex-1 space-y-4">
              <DetailSection title="学员基本信息">
                <FieldGrid cols={2}>
                  <FieldItem label="姓名" value={selected.name} highlight />
                  <FieldItem label="身份证号" value={selected.idCard} />
                  <FieldItem label="联系电话" value={selected.phone} />
                  <FieldItem label="培训机构" value={selected.institution} />
                  <FieldItem label="培训课程" value={selected.course} />
                  <FieldItem label="入学日期" value={selected.enrollDate} />
                </FieldGrid>
              </DetailSection>
              <DetailSection title="学时完成情况">
                <FieldGrid cols={2}>
                  <FieldItem label="计划学时" value={`${selected.planHours} 课时`} />
                  <FieldItem label="已完成学时" value={`${selected.completedHours} 课时`} />
                  <FieldItem label="人脸识别签到" value={`${selected.faceCheckins} 次`} />
                  <FieldItem label="学时完成度" value={`${Math.round(selected.completedHours / selected.planHours * 100)}%`} highlight />
                </FieldGrid>
                <div className="mt-3 w-full bg-gray-100 rounded-full h-3">
                  <div className={`h-3 rounded-full transition-all ${selected.completedHours / selected.planHours >= 1 ? 'bg-emerald-500' : 'bg-gov-500'}`}
                    style={{ width: `${Math.min(100, selected.completedHours / selected.planHours * 100)}%` }} />
                </div>
              </DetailSection>
            </div>
            <div className="w-56 shrink-0">
              <AIPanel title="AI 学习状态分析" items={[
                { label: 'AI学习状态', value: selected.aiStatus, type: selected.aiStatus === '正常' ? 'success' : 'warning' },
                { label: '签到合规性', value: selected.faceCheckins / selected.completedHours >= 0.9 ? '人脸识别签到率正常，无挂机嫌疑' : '签到率偏低，疑似存在学时造假', type: selected.faceCheckins / selected.completedHours >= 0.9 ? 'success' : 'warning' },
                { label: 'AI干预建议', value: selected.aiStatus === '异常' ? '建议通知培训机构约谈学员，要求补足学时，启动专项审查' : '学习进度正常，请按计划完成培训', type: selected.aiStatus === '异常' ? 'warning' : 'success' },
              ]} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function ExamManagement() {
  const [selected, setSelected] = useState<typeof exams[0] | null>(null)
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '本月考试人次', value: '2,450', sub: '正式考试', color: 'text-gov-600', bg: 'bg-gov-50' },
          { label: '考试通过率', value: '91.3%', sub: '含补考', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'AI监考覆盖', value: '100%', sub: '全程AI监考', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'AI发现异常', value: '12', sub: '本月违规记录', color: 'text-red-600', bg: 'bg-red-50' },
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
          <div className="card-title flex items-center gap-2"><GraduationCap size={14} className="text-gov-500" />考核记录</div>
          <AIBadge label="AI辅助监考在线" />
        </div>
        <FilterBar searchPlaceholder="搜索学员姓名..."
          filters={[{ label: '结果', options: [{value:'全部',label:'全部'},{value:'通过',label:'通过'},{value:'不通过',label:'不通过'}], value: '全部', onChange: () => {} }]}
        />
        <DataTable
          columns={[
            { key: 'id', title: '考试编号', width: 90 },
            { key: 'name', title: '学员姓名', render: (v: string) => <span className="font-semibold">{v}</span> },
            { key: 'institution', title: '培训机构' },
            { key: 'course', title: '考核科目', render: (v: string) => <StatusBadge label={v.replace('从业资格', '')} variant="info" /> },
            { key: 'examDate', title: '考试日期' },
            { key: 'examType', title: '考试类型' },
            { key: 'score', title: '考试成绩', render: (v: number) => (
              <span className={`font-bold text-sm ${v >= 90 ? 'text-emerald-600' : v >= 60 ? 'text-gov-600' : 'text-red-600'}`}>{v} 分</span>
            )},
            { key: 'aiConfidence', title: 'AI监考置信度', render: (v: number) => (
              <span className={`text-xs ${v >= 90 ? 'text-emerald-600' : 'text-amber-600'}`}>{v}%</span>
            )},
            { key: 'aiMonitor', title: 'AI监考结论', render: (v: string) => (
              <div className="flex items-center gap-1 text-xs"><Sparkles size={10} className="text-indigo-400 shrink-0" /><span className="text-gray-600">{v}</span></div>
            )},
            { key: 'result', title: '考试结果', render: (v: string) => <StatusBadge label={v} variant={v === '通过' ? 'success' : 'danger'} /> },
          ]}
          data={exams} rowKey="id" onRowClick={setSelected}
        />
      </div>
      <Modal open={!!selected} onClose={() => setSelected(null)} title={`考核详情 — ${selected?.name}`} subtitle={`考试编号：${selected?.id}`} width="md"
        footer={<><button className="btn-secondary" onClick={() => setSelected(null)}>关闭</button><button className="btn-primary"><Award size={13} />发放结业证书</button></>}>
        {selected && (
          <AIPanel title="AI 监考分析报告" items={[
            { label: '考试信息', value: `科目：${selected.course}，类型：${selected.examType}，日期：${selected.examDate}`, type: 'info' },
            { label: '考试成绩', value: `${selected.score} 分（${selected.result}），${selected.score >= 90 ? '成绩优秀' : selected.score >= 60 ? '达到合格线' : '未达合格线，需补考'}`, type: selected.result === '通过' ? 'success' : 'warning' },
            { label: 'AI监考结论', value: selected.aiMonitor, type: selected.aiMonitor === '未发现异常' ? 'success' : 'warning' },
            { label: 'AI监考置信度', value: `${selected.aiConfidence}%，${selected.aiConfidence >= 90 ? '考试过程可信度高' : '存在可疑行为，建议人工复核录像'}`, type: selected.aiConfidence >= 90 ? 'success' : 'warning' },
          ]} />
        )}
      </Modal>
    </div>
  )
}
