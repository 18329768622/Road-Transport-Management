import React, { useState } from 'react'
import {
  Users, Settings, Database, Sparkles, Plus, CheckCircle, AlertTriangle,
  TrendingUp, TrendingDown, Download, RefreshCw, Shield, Activity,
  BookOpen, Award, BarChart3, GitBranch, Search, FileText, Cpu
} from 'lucide-react'
import DataTable from '../components/DataTable'
import { FilterBar, Pagination } from '../components/FilterBar'
import Modal, { DetailSection, FieldGrid, FieldItem } from '../components/Modal'
import StatusBadge, { AIBadge, RiskBadge } from '../components/StatusBadge'
import AIPanel from '../components/AIPanel'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts'

type SMTab = '机构人员管理' | '信息化考核' | '数据治理'

// ──────────────────────────── Mock Data ────────────────────────────

const departments = [
  { id: 'DEP001', name: '运输许可科', head: '张建国', headTitle: '科长', staff: 12, itLevel: '良好', avgSkill: 82, systemsUsed: 5, trainingDue: 2, status: '正常', phone: '13812340050', responsibilities: '货运、客运、危货许可审批' },
  { id: 'DEP002', name: '运输市场科', head: '李文涛', headTitle: '科长', staff: 8, itLevel: '优秀', avgSkill: 91, systemsUsed: 4, trainingDue: 0, status: '正常', phone: '13987650050', responsibilities: '市场监管、价格监督' },
  { id: 'DEP003', name: '行政执法支队', head: '王执法', headTitle: '支队长', staff: 28, itLevel: '合格', avgSkill: 68, systemsUsed: 6, trainingDue: 8, status: '正常', phone: '15678900050', responsibilities: '路面执法、稽查检查' },
  { id: 'DEP004', name: '科技信息科', head: '陈信息', headTitle: '科长', staff: 6, itLevel: '优秀', avgSkill: 96, systemsUsed: 8, trainingDue: 0, status: '正常', phone: '18923450050', responsibilities: '信息系统建设、维护、数据管理' },
  { id: 'DEP005', name: '安全监管科', head: '赵安全', headTitle: '科长', staff: 10, itLevel: '合格', avgSkill: 72, systemsUsed: 3, trainingDue: 5, status: '正常', phone: '13567890050', responsibilities: '行业安全监管、隐患排查' },
  { id: 'DEP006', name: '综合办公室', head: '孙办公', headTitle: '主任', staff: 15, itLevel: '合格', avgSkill: 65, systemsUsed: 4, trainingDue: 6, status: '正常', phone: '13745670050', responsibilities: '综合协调、文件收发、档案管理' },
]

const staffList = [
  { id: 'ST001', name: '张建国', dept: '运输许可科', title: '科长', age: 45, skillScore: 85, trainingHours: 32, certCount: 3, systems: ['业务系统', 'OA', '统计平台', '执法系统', '证件系统'], status: '在岗', aiNeed: '数据分析', lastTraining: '2024-03-15', riskLevel: '低' },
  { id: 'ST002', name: '李文涛', dept: '运输市场科', title: '科长', age: 38, skillScore: 92, trainingHours: 48, certCount: 4, systems: ['业务系统', 'OA', '统计平台', '监管平台'], status: '在岗', aiNeed: '无', lastTraining: '2024-05-20', riskLevel: '低' },
  { id: 'ST003', name: '赵执法', dept: '行政执法支队', title: '执法员', age: 32, skillScore: 58, trainingHours: 12, certCount: 1, systems: ['移动执法APP', 'OA'], status: '在岗', aiNeed: '移动执法系统', lastTraining: '2023-10-10', riskLevel: '高' },
  { id: 'ST004', name: '陈信息', dept: '科技信息科', title: '科长', age: 41, skillScore: 97, trainingHours: 80, certCount: 6, systems: ['全部系统'], status: '在岗', aiNeed: '无', lastTraining: '2024-06-01', riskLevel: '低' },
  { id: 'ST005', name: '孙志远', dept: '综合办公室', title: '主任', age: 50, skillScore: 62, trainingHours: 8, certCount: 1, systems: ['OA', '档案系统'], status: '在岗', aiNeed: 'OA系统深度应用', lastTraining: '2023-08-20', riskLevel: '中' },
  { id: 'ST006', name: '王大明', dept: '行政执法支队', title: '执法员', age: 28, skillScore: 74, trainingHours: 24, certCount: 2, systems: ['移动执法APP', 'OA', '执法系统'], status: '在岗', aiNeed: '数据分析入门', lastTraining: '2024-04-08', riskLevel: '中' },
]

const sysMonitor = [
  { name: '道路运输综合业务系统', uptime: 99.95, avgResp: 0.32, activeUsers: 186, alerts: 0, status: '正常' },
  { name: '移动执法平台', uptime: 99.82, avgResp: 0.45, activeUsers: 52, alerts: 1, status: '预警' },
  { name: '车辆动态监控平台', uptime: 100.00, avgResp: 0.18, activeUsers: 28, alerts: 0, status: '正常' },
  { name: '统计分析平台', uptime: 99.50, avgResp: 0.85, activeUsers: 15, alerts: 2, status: '预警' },
  { name: 'AI智能审批引擎', uptime: 99.98, avgResp: 1.20, activeUsers: 94, alerts: 0, status: '正常' },
  { name: 'OA办公自动化', uptime: 99.90, avgResp: 0.38, activeUsers: 215, alerts: 0, status: '正常' },
]

const skillRadarData = [
  { subject: '系统操作', A: 82 }, { subject: '数据分析', A: 65 },
  { subject: '业务知识', A: 88 }, { subject: '信息安全', A: 71 },
  { subject: 'AI工具应用', A: 58 }, { subject: '报表处理', A: 79 },
]

const trainingPlan = [
  { dept: '行政执法支队', course: '移动执法系统深度培训', staff: 8, urgency: '紧急', date: '2024-07', aiPredicted: true },
  { dept: '综合办公室', course: 'OA系统高级功能', staff: 6, urgency: '本季度', date: '2024-08', aiPredicted: true },
  { dept: '安全监管科', course: '信息安全意识培训', staff: 5, urgency: '本季度', date: '2024-08', aiPredicted: true },
  { dept: '运输许可科', course: '数据分析与Excel进阶', staff: 3, urgency: '下季度', date: '2024-09', aiPredicted: true },
]

// ────────── IT Assessment Data ──────────

const assessItems = [
  { id: 'AI001', name: '信息系统建设完成率', category: '基础设施', weight: 15, target: 95, actual: 98.5, autoCollect: true, score: 15, trend: '上升' },
  { id: 'AI002', name: '数据上报及时率', category: '数据管理', weight: 12, target: 98, actual: 96.2, autoCollect: true, score: 10.8, trend: '稳定' },
  { id: 'AI003', name: '业务系统在线率', category: '系统运维', weight: 15, target: 99.5, actual: 99.95, autoCollect: true, score: 15, trend: '上升' },
  { id: 'AI004', name: '人员信息化培训覆盖率', category: '人员能力', weight: 10, target: 90, actual: 83.5, autoCollect: false, score: 8.2, trend: '下降' },
  { id: 'AI005', name: 'AI应用覆盖业务比例', category: 'AI应用', weight: 15, target: 80, actual: 91.2, autoCollect: true, score: 15, trend: '上升' },
  { id: 'AI006', name: '网络安全等保合规率', category: '信息安全', weight: 15, target: 100, actual: 100, autoCollect: true, score: 15, trend: '稳定' },
  { id: 'AI007', name: '数据质量综合评分', category: '数据质量', weight: 10, target: 90, actual: 87.3, autoCollect: true, score: 9.1, trend: '上升' },
  { id: 'AI008', name: '群众满意度调查', category: '服务质量', weight: 8, target: 90, actual: 88.5, autoCollect: false, score: 7.1, trend: '稳定' },
]

const assessHistory = [
  { year: '2021', score: 78.5, rank: 3, grade: '合格' },
  { year: '2022', score: 82.3, rank: 2, grade: '良好' },
  { year: '2023', score: 87.6, rank: 2, grade: '良好' },
  { year: '2024Q1', score: 91.2, rank: 1, grade: '优秀' },
]

const categoryScores = [
  { category: '基础设施', score: 98.5, weight: 15, max: 100 },
  { category: '数据管理', score: 80.2, weight: 12, max: 100 },
  { category: '系统运维', score: 99.9, weight: 15, max: 100 },
  { category: '人员能力', score: 83.5, weight: 10, max: 100 },
  { category: 'AI应用', score: 91.2, weight: 15, max: 100 },
  { category: '信息安全', score: 100, weight: 15, max: 100 },
  { category: '数据质量', score: 87.3, weight: 10, max: 100 },
  { category: '服务质量', score: 88.5, weight: 8, max: 100 },
]

const improvements = [
  { item: '人员信息化培训覆盖率未达标', impact: '高', action: '制定执法支队和综合办公室专项培训计划，本季度完成覆盖率提升至90%', dept: '科技信息科' },
  { item: '数据上报及时率低于目标', impact: '中', action: '优化数据上报流程，设置自动提醒，减少人工环节', dept: '运输许可科' },
  { item: '群众满意度距目标差距1.5分', impact: '中', action: '开展服务质量提升专项活动，增设网上服务渠道', dept: '综合办公室' },
]

// ────────── Data Governance Data ──────────

const dataModules = [
  { id: 'DM001', name: '货运经营管理', records: 125000, qualityScore: 92.5, completeness: 98.2, accuracy: 94.8, timeliness: 96.5, consistency: 88.3, issues: 3, status: '良好' },
  { id: 'DM002', name: '客运经营管理', records: 32800, qualityScore: 95.1, completeness: 99.1, accuracy: 96.3, timeliness: 98.2, consistency: 92.4, issues: 1, status: '优秀' },
  { id: 'DM003', name: '危货运输管理', records: 15600, qualityScore: 88.7, completeness: 96.5, accuracy: 91.2, timeliness: 88.5, consistency: 85.2, issues: 8, status: '合格' },
  { id: 'DM004', name: '从业人员档案', records: 456000, qualityScore: 91.3, completeness: 97.8, accuracy: 93.6, timeliness: 92.1, consistency: 90.5, issues: 5, status: '良好' },
  { id: 'DM005', name: '车辆技术档案', records: 385000, qualityScore: 89.2, completeness: 95.2, accuracy: 90.8, timeliness: 87.3, consistency: 86.8, issues: 12, status: '合格' },
  { id: 'DM006', name: '行政执法案件', records: 23400, qualityScore: 93.8, completeness: 97.5, accuracy: 95.2, timeliness: 94.1, consistency: 91.8, issues: 4, status: '良好' },
]

const dataIssues = [
  { id: 'DI001', module: '危货运输管理', type: '数据缺失', field: '车辆检验日期', count: 245, severity: '高', aiDetect: true, suggestion: '从车辆档案系统自动补全缺失字段' },
  { id: 'DI002', module: '车辆技术档案', type: '格式不一致', field: 'VIN码格式', count: 1820, severity: '高', aiDetect: true, suggestion: '统一VIN码校验规则，批量格式化处理' },
  { id: 'DI003', module: '从业人员档案', type: '重复数据', field: '身份证号', count: 128, severity: '中', aiDetect: true, suggestion: '启动去重程序，保留最新记录并归档重复项' },
  { id: 'DI004', module: '车辆技术档案', type: '逻辑错误', field: '里程数据', count: 382, severity: '中', aiDetect: true, suggestion: '里程数存在倒退情况，设置单调递增约束' },
  { id: 'DI005', module: '危货运输管理', type: '数据缺失', field: '驾驶员从业资格证', count: 58, severity: '高', aiDetect: true, suggestion: '联动从业人员系统自动核验并补全' },
  { id: 'DI006', module: '从业人员档案', type: '时效性异常', field: '证件到期日期', count: 312, severity: '中', aiDetect: true, suggestion: '触发自动到期预警通知，同步更新状态' },
]

const dataStandards = [
  { id: 'DS001', name: '道路运输企业数据标准', version: 'v2.1', fields: 128, compliant: 121, nonCompliant: 7, lastUpdate: '2024-01-15', status: '已发布' },
  { id: 'DS002', name: '从业人员信息数据标准', version: 'v1.8', fields: 86, compliant: 85, nonCompliant: 1, lastUpdate: '2024-03-20', status: '已发布' },
  { id: 'DS003', name: '车辆技术档案数据标准', version: 'v2.0', fields: 95, compliant: 82, nonCompliant: 13, lastUpdate: '2024-02-10', status: '修订中' },
  { id: 'DS004', name: '行政执法数据标准', version: 'v1.5', fields: 72, compliant: 72, nonCompliant: 0, lastUpdate: '2023-11-05', status: '已发布' },
]

const lineageNodes = [
  { id: 'N1', name: '业务申请数据', type: 'source', downstream: ['N2', 'N3'] },
  { id: 'N2', name: '许可证管理库', type: 'storage', downstream: ['N4', 'N5'] },
  { id: 'N3', name: 'AI审批引擎', type: 'process', downstream: ['N2'] },
  { id: 'N4', name: '统计报表模块', type: 'output', downstream: [] },
  { id: 'N5', name: '证件核发系统', type: 'output', downstream: ['N6'] },
  { id: 'N6', name: '区块链存证', type: 'output', downstream: [] },
]

const qualityTrend = [
  { month: '1月', score: 85.2 }, { month: '2月', score: 86.1 }, { month: '3月', score: 87.5 },
  { month: '4月', score: 88.3 }, { month: '5月', score: 89.8 }, { month: '6月', score: 91.2 },
]

// ────────── Role & Permission Data ──────────

type RoleCategory = '管理层' | '行政管理' | '执法人员' | '市场主体' | '从业人员' | '第三方机构' | '社会组织' | '社会公众'

interface RoleItem {
  id: string; name: string; level: string; levelNum: number
  category: RoleCategory; userCount: number; description: string
  modules: string[]; canCreate: boolean; canEdit: boolean; canDelete: boolean; canQuery: boolean
  cardColor: string; badgeColor: string
}

const roles: RoleItem[] = [
  { id: 'R001', name: '系统管理员', level: '系统级', levelNum: 0, category: '管理层', userCount: 3,
    description: '系统整体运行维护、用户角色管理及权限分配，拥有最高操作权限',
    modules: ['系统配置', '用户管理', '权限分配', '日志审计', '数据备份', '参数设置'],
    canCreate: true, canEdit: true, canDelete: true, canQuery: true,
    cardColor: 'border-red-200 bg-red-50', badgeColor: 'bg-red-100 text-red-700 border-red-200' },
  { id: 'R002', name: '省级管理员', level: '省级', levelNum: 1, category: '行政管理', userCount: 12,
    description: '省内许可审批、质量信誉考核公告、车辆审验公告、数据上报',
    modules: ['许可审批', '质量信誉考核', '车辆审验公告', '数据上报', '统计分析', '公告管理'],
    canCreate: true, canEdit: true, canDelete: false, canQuery: true,
    cardColor: 'border-blue-200 bg-blue-50', badgeColor: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: 'R003', name: '市级管理员', level: '市级', levelNum: 2, category: '行政管理', userCount: 48,
    description: '业户许可、车辆管理、站场许可初审、行业监督检查',
    modules: ['业户许可', '车辆管理', '站场许可初审', '行业监督检查', '许可统计'],
    canCreate: true, canEdit: true, canDelete: false, canQuery: true,
    cardColor: 'border-indigo-200 bg-indigo-50', badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  { id: 'R004', name: '县级管理员', level: '县级', levelNum: 3, category: '行政管理', userCount: 186,
    description: '受理、审查、上报、发证、档案管理、业户日常监管',
    modules: ['业务受理', '审查上报', '发证管理', '档案管理', '日常监管', '信息查询'],
    canCreate: true, canEdit: true, canDelete: false, canQuery: true,
    cardColor: 'border-gov-200 bg-gov-50', badgeColor: 'bg-gov-100 text-gov-700 border-gov-200' },
  { id: 'R005', name: '乡镇管理员', level: '乡镇级', levelNum: 4, category: '行政管理', userCount: 324,
    description: '协助县级管理、源头管理、上门服务、信息采集',
    modules: ['源头管理', '上门服务', '信息采集', '辅助审查', '基础查询'],
    canCreate: false, canEdit: true, canDelete: false, canQuery: true,
    cardColor: 'border-teal-200 bg-teal-50', badgeColor: 'bg-teal-100 text-teal-700 border-teal-200' },
  { id: 'R006', name: '检查站执法人员', level: '执法级', levelNum: 2, category: '执法人员', userCount: 89,
    description: '路面监督检查、违法行为处理、证据采集、案件办理',
    modules: ['路面检查', '违法处理', '证据采集', '案件办理', '执法记录', '移动执法'],
    canCreate: true, canEdit: true, canDelete: false, canQuery: true,
    cardColor: 'border-orange-200 bg-orange-50', badgeColor: 'bg-orange-100 text-orange-700 border-orange-200' },
  { id: 'R007', name: '道路运输业户', level: '企业级', levelNum: 5, category: '市场主体', userCount: 2856,
    description: '货运/客运/危货/维修/培训/外商投资业户的网上申报、年审、查询',
    modules: ['网上申报', '年审办理', '证件查询', '车辆管理', '人员管理', '违规记录查询'],
    canCreate: false, canEdit: true, canDelete: false, canQuery: true,
    cardColor: 'border-emerald-200 bg-emerald-50', badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { id: 'R008', name: '个体运输户', level: '个体级', levelNum: 5, category: '市场主体', userCount: 1542,
    description: '个体经营户车辆、人员的业务办理和查询',
    modules: ['业务办理', '信息查询', '车辆登记', '人员管理'],
    canCreate: false, canEdit: true, canDelete: false, canQuery: true,
    cardColor: 'border-green-200 bg-green-50', badgeColor: 'bg-green-100 text-green-700 border-green-200' },
  { id: 'R009', name: '从业人员', level: '个人级', levelNum: 6, category: '从业人员', userCount: 45680,
    description: '客货运驾驶员、危险货运驾驶/装卸/押运人员、维修技术人员的资格证申办、诚信记录查询',
    modules: ['资格证申办', '诚信记录查询', '证件信息查询', '培训记录'],
    canCreate: false, canEdit: false, canDelete: false, canQuery: true,
    cardColor: 'border-cyan-200 bg-cyan-50', badgeColor: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
  { id: 'R010', name: '检验检测机构', level: '机构级', levelNum: 5, category: '第三方机构', userCount: 128,
    description: '机动车综合性能检测业务的报告上传、结果查询',
    modules: ['检测报告上传', '结果查询', '检测机构管理', '数据上报'],
    canCreate: true, canEdit: true, canDelete: false, canQuery: true,
    cardColor: 'border-purple-200 bg-purple-50', badgeColor: 'bg-purple-100 text-purple-700 border-purple-200' },
  { id: 'R011', name: '行业协会', level: '协会级', levelNum: 5, category: '社会组织', userCount: 36,
    description: '行业自律、信息统计、诚信评价辅助',
    modules: ['行业自律管理', '信息统计', '诚信评价辅助', '政策咨询'],
    canCreate: false, canEdit: false, canDelete: false, canQuery: true,
    cardColor: 'border-amber-200 bg-amber-50', badgeColor: 'bg-amber-100 text-amber-700 border-amber-200' },
  { id: 'R012', name: '社会公众', level: '公众级', levelNum: 7, category: '社会公众', userCount: 0,
    description: '政务公开信息查询、投诉举报、政策咨询',
    modules: ['政务公开查询', '投诉举报', '政策咨询', '许可信息公示'],
    canCreate: false, canEdit: false, canDelete: false, canQuery: true,
    cardColor: 'border-gray-200 bg-gray-50', badgeColor: 'bg-gray-100 text-gray-600 border-gray-200' },
]

const categoryFilters: { key: string; label: string }[] = [
  { key: '全部', label: '全部角色' },
  { key: '管理层', label: '管理层' },
  { key: '行政管理', label: '行政管理' },
  { key: '执法人员', label: '执法人员' },
  { key: '市场主体', label: '市场主体' },
  { key: '从业人员', label: '从业人员' },
  { key: '第三方机构', label: '第三方机构' },
  { key: '社会组织', label: '社会组织' },
  { key: '社会公众', label: '社会公众' },
]

// ──────────────────────────── Component ────────────────────────────

export default function SystemManagement({ initialTab }: { initialTab?: SMTab }) {
  const [tab, setTab] = useState<SMTab>(initialTab ?? '机构人员管理')

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-gov-800">系统管理</h1>
            <p className="text-xs text-gray-500 mt-0.5">第十七章 · 信息化机构人员管理、考核评价、AI智能数据治理</p>
          </div>
          <div className="flex items-center gap-2">
            <AIBadge label="AI数据治理引擎" />
          </div>
        </div>
        <div className="flex gap-1 mt-4 border-b border-gray-100 -mb-4">
          {(['机构人员管理', '信息化考核', '数据治理'] as SMTab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${tab === t ? 'border-gov-500 text-gov-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {tab === '机构人员管理' && <OrgPersonnel />}
        {tab === '信息化考核' && <ITAssessment />}
        {tab === '数据治理' && <DataGovernance />}
      </div>
    </div>
  )
}

// ──────────────────────── Tab 1: Org & Personnel ────────────────────────

function OrgPersonnel() {
  const [subtab, setSubtab] = useState<'角色权限管理' | '人员档案' | '系统监控'>('角色权限管理')

  return (
    <div className="space-y-4">
      <div className="flex gap-2 bg-gray-100 rounded-lg p-1 w-fit">
        {(['角色权限管理', '人员档案', '系统监控'] as const).map(t => (
          <button key={t} onClick={() => setSubtab(t)}
            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${subtab === t ? 'bg-white text-gov-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {subtab === '角色权限管理' && <RolePermissions />}
      {subtab === '人员档案' && <PersonnelArchive />}
      {subtab === '系统监控' && <SystemMonitor />}
    </div>
  )
}

// ────── Role Permission Management ──────

function RolePermissions() {
  const [categoryFilter, setCategoryFilter] = useState('全部')
  const [selectedRole, setSelectedRole] = useState<RoleItem | null>(null)

  const totalUsers = roles.reduce((s, r) => s + r.userCount, 0)
  const filtered = categoryFilter === '全部' ? roles : roles.filter(r => r.category === categoryFilter)

  const levelHierarchy = [
    { label: '省级', roles: ['R002'], color: 'bg-blue-500' },
    { label: '市级', roles: ['R003', 'R006'], color: 'bg-indigo-500' },
    { label: '县级', roles: ['R004'], color: 'bg-gov-500' },
    { label: '乡镇级', roles: ['R005'], color: 'bg-teal-500' },
    { label: '企业/社会', roles: ['R007', 'R008', 'R009', 'R010', 'R011', 'R012'], color: 'bg-emerald-500' },
  ]

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '业务角色总数', value: '12 类', sub: '覆盖全业务场景', color: 'text-gov-600', bg: 'bg-gov-50' },
          { label: '授权层级', value: '5 级', sub: '省—市—县—乡—企业/社会', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: '注册用户总数', value: `${(totalUsers / 10000).toFixed(1)}万`, sub: '各角色合计', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: '权限配置完成率', value: '100%', sub: '全部角色已配置', color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(s => (
          <div key={s.label} className={`card p-4 ${s.bg}`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-sm text-gray-600 mt-1">{s.label}</div>
            <div className={`text-xs ${s.color} mt-1`}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* 5-level hierarchy */}
      <div className="card p-4">
        <div className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Shield size={14} className="text-gov-500" />5 级分层授权架构
        </div>
        <div className="flex items-stretch gap-2">
          {/* 系统管理员 special */}
          <div className="flex flex-col items-center gap-1 w-24 shrink-0">
            <div className="w-full p-2 rounded-lg border-2 border-red-200 bg-red-50 text-center">
              <div className="text-[10px] font-bold text-red-600 mb-0.5">R001</div>
              <div className="text-xs font-semibold text-red-700">系统管理员</div>
            </div>
            <div className="text-[10px] text-gray-400 text-center">系统级</div>
          </div>
          <div className="flex items-center text-gray-300 text-lg font-light">→</div>
          {/* 5 levels */}
          {levelHierarchy.map((lvl, i) => (
            <React.Fragment key={lvl.label}>
              <div className="flex-1 min-w-0">
                <div className={`h-1 ${lvl.color} rounded-full mb-2`} />
                <div className="text-[10px] font-semibold text-gray-500 mb-1.5 text-center">{lvl.label}</div>
                <div className="flex flex-wrap gap-1 justify-center">
                  {lvl.roles.map(rid => {
                    const r = roles.find(x => x.id === rid)!
                    return (
                      <button key={rid} onClick={() => setSelectedRole(r)}
                        className={`text-[10px] px-1.5 py-1 rounded border ${r.badgeColor} hover:opacity-80 transition-opacity font-medium`}>
                        {rid} {r.name}
                      </button>
                    )
                  })}
                </div>
              </div>
              {i < levelHierarchy.length - 1 && <div className="flex items-start pt-4 text-gray-300 text-sm font-light">→</div>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {categoryFilters.map(f => {
          const cnt = f.key === '全部' ? 12 : roles.filter(r => r.category === f.key).length
          return (
            <button key={f.key} onClick={() => setCategoryFilter(f.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                categoryFilter === f.key
                  ? 'bg-gov-600 text-white border-gov-600 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gov-400 hover:text-gov-600'
              }`}>
              {f.label}
              <span className={`ml-1.5 px-1 py-0.5 rounded text-[10px] font-bold ${categoryFilter === f.key ? 'bg-white/20' : 'bg-gray-100'}`}>{cnt}</span>
            </button>
          )
        })}
      </div>

      {/* Role cards grid */}
      <div className="grid grid-cols-4 gap-3">
        {filtered.map(role => (
          <button key={role.id} onClick={() => setSelectedRole(role)}
            className={`card p-4 text-left border-2 ${role.cardColor} hover:shadow-md transition-all group`}>
            <div className="flex items-start justify-between mb-2">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${role.badgeColor}`}>{role.id}</span>
              <span className="text-[10px] text-gray-400">{role.level}</span>
            </div>
            <div className="text-sm font-semibold text-gray-800 mb-1.5 group-hover:text-gov-700">{role.name}</div>
            <div className="text-[11px] text-gray-500 leading-relaxed line-clamp-2 mb-3">{role.description}</div>
            <div className="flex flex-wrap gap-1 mb-3">
              {role.modules.slice(0, 3).map(m => (
                <span key={m} className="text-[10px] px-1.5 py-0.5 bg-white/70 border border-gray-200 rounded text-gray-600">{m}</span>
              ))}
              {role.modules.length > 3 && (
                <span className="text-[10px] px-1.5 py-0.5 bg-white/70 border border-gray-200 rounded text-gray-400">+{role.modules.length - 3}</span>
              )}
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/60">
              <div className="flex items-center gap-3 text-[10px]">
                {[
                  { label: '增', ok: role.canCreate },
                  { label: '改', ok: role.canEdit },
                  { label: '删', ok: role.canDelete },
                  { label: '查', ok: role.canQuery },
                ].map(p => (
                  <span key={p.label} className={`font-medium ${p.ok ? 'text-emerald-600' : 'text-gray-300'}`}>{p.label}</span>
                ))}
              </div>
              <span className="text-[10px] text-gray-400 font-medium">
                {role.userCount > 0 ? `${role.userCount.toLocaleString()}人` : '不限'}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Role Detail Modal */}
      <Modal open={!!selectedRole} onClose={() => setSelectedRole(null)}
        title={selectedRole ? `${selectedRole.id} · ${selectedRole.name}` : ''}
        subtitle={selectedRole ? `${selectedRole.level} · ${selectedRole.category}` : ''}
        width="lg"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setSelectedRole(null)}>关闭</button>
            <button className="btn-primary"><Settings size={13} />配置权限</button>
          </>
        }>
        {selectedRole && (
          <div className="flex gap-5">
            <div className="flex-1 space-y-4">
              <DetailSection title="角色基本信息">
                <FieldGrid cols={3}>
                  <FieldItem label="角色编码" value={<span className={`px-2 py-0.5 rounded border text-xs font-bold ${selectedRole.badgeColor}`}>{selectedRole.id}</span>} />
                  <FieldItem label="角色名称" value={selectedRole.name} highlight />
                  <FieldItem label="授权层级" value={selectedRole.level} />
                  <FieldItem label="所属类别" value={selectedRole.category} />
                  <FieldItem label="注册用户数" value={selectedRole.userCount > 0 ? `${selectedRole.userCount.toLocaleString()} 人` : '公众用户（不限）'} highlight />
                  <FieldItem label="权限状态" value={<StatusBadge label="已激活" variant="success" size="md" />} />
                  <FieldItem label="角色描述" value={selectedRole.description} />
                </FieldGrid>
              </DetailSection>

              <DetailSection title="可访问功能模块">
                <div className="flex flex-wrap gap-2">
                  {selectedRole.modules.map(m => (
                    <div key={m} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium ${selectedRole.cardColor}`}>
                      <CheckCircle size={11} className="text-emerald-500 shrink-0" />
                      {m}
                    </div>
                  ))}
                </div>
              </DetailSection>

              <DetailSection title="数据操作权限">
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: '新增', key: 'canCreate' as const, icon: <Plus size={16} /> },
                    { label: '修改', key: 'canEdit' as const, icon: <Settings size={16} /> },
                    { label: '删除', key: 'canDelete' as const, icon: <AlertTriangle size={16} /> },
                    { label: '查询', key: 'canQuery' as const, icon: <Search size={16} /> },
                  ].map(p => (
                    <div key={p.label} className={`p-3 rounded-lg border text-center ${selectedRole[p.key] ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
                      <div className={`flex justify-center mb-1.5 ${selectedRole[p.key] ? 'text-emerald-500' : 'text-gray-300'}`}>{p.icon}</div>
                      <div className={`text-xs font-semibold ${selectedRole[p.key] ? 'text-emerald-700' : 'text-gray-400'}`}>{p.label}</div>
                      <div className={`text-[10px] mt-0.5 ${selectedRole[p.key] ? 'text-emerald-500' : 'text-gray-300'}`}>{selectedRole[p.key] ? '已授权' : '无权限'}</div>
                    </div>
                  ))}
                </div>
              </DetailSection>
            </div>
            <div className="w-56 shrink-0">
              <AIPanel title="AI 权限分析" items={[
                { label: '角色定位', value: `${selectedRole.name}属于${selectedRole.category}，在5级授权体系中处于${selectedRole.level}，${selectedRole.userCount > 0 ? `当前有 ${selectedRole.userCount.toLocaleString()} 名用户持有该角色` : '面向社会公众开放'}`, type: 'info' },
                { label: '权限范围', value: `共授权 ${selectedRole.modules.length} 个功能模块，数据操作权限：${[selectedRole.canCreate && '新增', selectedRole.canEdit && '修改', selectedRole.canDelete && '删除', selectedRole.canQuery && '查询'].filter(Boolean).join('、')}`, type: selectedRole.canDelete ? 'warning' : 'success' },
                { label: '安全建议', value: selectedRole.canDelete ? '该角色拥有删除权限，建议开启操作日志审计，并定期复查权限分配' : '该角色权限配置合理，符合最小权限原则', type: selectedRole.canDelete ? 'warning' : 'success' },
              ]} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

// ────── Personnel Archive ──────

function PersonnelArchive() {
  const [selectedStaff, setSelectedStaff] = useState<typeof staffList[0] | null>(null)

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="card-header">
          <FilterBar searchPlaceholder="搜索人员姓名/科室..."
            filters={[
              { label: '科室', options: [{value:'全部',label:'全部'},...departments.map(d => ({value:d.name,label:d.name}))], value: '全部', onChange: () => {} },
              { label: '风险', options: [{value:'全部',label:'全部'},{value:'低',label:'低'},{value:'中',label:'中'},{value:'高',label:'高'}], value: '全部', onChange: () => {} },
            ]}
            onExport={() => {}}
          />
        </div>
        <DataTable
          columns={[
            { key: 'id', title: '工号', width: 80 },
            { key: 'name', title: '姓名', render: (v: string, row: any) => (
              <div><div className="font-semibold">{v}</div><div className="text-xs text-gray-400">{row.title}</div></div>
            )},
            { key: 'dept', title: '所在科室' },
            { key: 'age', title: '年龄', align: 'center' as const },
            { key: 'skillScore', title: 'AI技能评分', render: (v: number) => (
              <div className="flex items-center gap-1.5">
                <div className="w-16 bg-gray-100 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${v >= 85 ? 'bg-emerald-500' : v >= 70 ? 'bg-gov-500' : 'bg-amber-500'}`} style={{ width: `${v}%` }} /></div>
                <span className={`text-xs font-bold ${v >= 85 ? 'text-emerald-600' : v >= 70 ? 'text-gov-600' : 'text-amber-600'}`}>{v}</span>
              </div>
            )},
            { key: 'trainingHours', title: '培训学时(年)', render: (v: number) => (
              <span className={v < 16 ? 'text-red-600 font-semibold' : 'text-gray-600'}>{v} 课时</span>
            )},
            { key: 'certCount', title: '持证数量', align: 'center' as const },
            { key: 'aiNeed', title: 'AI培训建议', render: (v: string) => v === '无' ? <span className="text-gray-300 text-xs">—</span> : (
              <div className="flex items-center gap-1 text-xs text-amber-600"><AlertTriangle size={11} className="shrink-0" />{v}</div>
            )},
            { key: 'riskLevel', title: '能力风险', render: (v: string) => <RiskBadge level={v as any} /> },
            { key: 'lastTraining', title: '最近培训日期' },
          ]}
          data={staffList} rowKey="id" onRowClick={setSelectedStaff}
        />
      </div>

      <Modal open={!!selectedStaff} onClose={() => setSelectedStaff(null)} title={`人员档案 — ${selectedStaff?.name}`} subtitle={`${selectedStaff?.dept} · ${selectedStaff?.title}`} width="lg"
        footer={<><button className="btn-secondary" onClick={() => setSelectedStaff(null)}>关闭</button><button className="btn-primary"><BookOpen size={13} />安排培训</button></>}>
        {selectedStaff && (
          <div className="flex gap-5">
            <div className="flex-1 space-y-4">
              <DetailSection title="人员基本信息">
                <FieldGrid cols={2}>
                  <FieldItem label="姓名" value={selectedStaff.name} highlight />
                  <FieldItem label="所在科室" value={selectedStaff.dept} />
                  <FieldItem label="职务职称" value={selectedStaff.title} />
                  <FieldItem label="年龄" value={`${selectedStaff.age} 岁`} />
                  <FieldItem label="年度培训学时" value={`${selectedStaff.trainingHours} 课时`} />
                  <FieldItem label="持证数量" value={`${selectedStaff.certCount} 项`} />
                  <FieldItem label="掌握系统" value={selectedStaff.systems.join('、')} />
                  <FieldItem label="最近培训日期" value={selectedStaff.lastTraining} />
                </FieldGrid>
              </DetailSection>
              <DetailSection title="AI技能评估细项">
                <div className="space-y-2">
                  {[
                    { dim: '系统操作能力', score: Math.min(100, selectedStaff.skillScore + 5) },
                    { dim: '数据处理能力', score: Math.max(40, selectedStaff.skillScore - 10) },
                    { dim: '信息安全意识', score: Math.min(100, selectedStaff.skillScore + 2) },
                    { dim: 'AI工具应用', score: Math.max(35, selectedStaff.skillScore - 20) },
                  ].map((d, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-24 shrink-0">{d.dim}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div className={`h-2 rounded-full ${d.score >= 85 ? 'bg-emerald-500' : d.score >= 70 ? 'bg-gov-500' : 'bg-amber-500'}`} style={{ width: `${d.score}%` }} />
                      </div>
                      <span className={`text-xs font-bold w-8 text-right ${d.score >= 85 ? 'text-emerald-600' : d.score >= 70 ? 'text-gov-600' : 'text-amber-600'}`}>{d.score}</span>
                    </div>
                  ))}
                </div>
              </DetailSection>
            </div>
            <div className="w-56 shrink-0">
              <AIPanel title="AI 个人评估" items={[
                { label: 'AI技能综合评分', value: <div className="text-2xl font-bold text-indigo-300">{selectedStaff.skillScore}<span className="text-sm ml-1">/ 100</span></div>, type: selectedStaff.skillScore >= 85 ? 'success' : selectedStaff.skillScore >= 70 ? 'info' : 'warning' },
                { label: '培训建议', value: selectedStaff.aiNeed !== '无' ? `AI建议重点培训：${selectedStaff.aiNeed}，预计提升评分约 10-15 分` : '当前技能良好，按计划参加常规培训即可', type: selectedStaff.aiNeed !== '无' ? 'warning' : 'success' },
                { label: '学时达标', value: selectedStaff.trainingHours >= 24 ? `年度已完成 ${selectedStaff.trainingHours} 课时，达标` : `年度仅完成 ${selectedStaff.trainingHours} 课时，建议补充 ${24 - selectedStaff.trainingHours} 课时`, type: selectedStaff.trainingHours >= 24 ? 'success' : 'warning' },
              ]} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

// ────── System Monitor ──────

function SystemMonitor() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '系统总数', value: '8', sub: '在线运行', color: 'text-gov-600', bg: 'bg-gov-50' },
          { label: '综合在线率', value: '99.86%', sub: '近30天', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: '活跃用户', value: '590', sub: '今日登录', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: '待处理告警', value: '3', sub: '需关注', color: 'text-amber-600', bg: 'bg-amber-50' },
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
          <div className="card-title flex items-center gap-2"><Activity size={14} className="text-gov-500" />系统运行状态监控</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            实时监控
          </div>
        </div>
        <DataTable
          columns={[
            { key: 'name', title: '系统名称', render: (v: string) => <span className="font-medium">{v}</span> },
            { key: 'uptime', title: '在线率(%)', render: (v: number) => (
              <div className="flex items-center gap-1.5">
                <div className="w-16 bg-gray-100 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${v >= 99.9 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(100, v)}%` }} /></div>
                <span className="text-xs font-medium">{v}</span>
              </div>
            )},
            { key: 'avgResp', title: '平均响应(s)', render: (v: number) => (
              <span className={v > 1 ? 'text-amber-600 font-medium' : 'text-gray-600'}>{v}s</span>
            )},
            { key: 'activeUsers', title: '活跃用户', align: 'center' as const },
            { key: 'alerts', title: '告警数', render: (v: number) => (
              <span className={v > 0 ? 'text-red-600 font-bold' : 'text-gray-300'}>{v > 0 ? v : '—'}</span>
            )},
            { key: 'status', title: '运行状态', render: (v: string) => (
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full shrink-0 ${v === '正常' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                <StatusBadge label={v} variant={v === '正常' ? 'success' : 'warning'} />
              </div>
            )},
          ]}
          data={sysMonitor} rowKey="name"
        />
      </div>
    </div>
  )
}

// ──────────────────────── Tab 2: IT Assessment ────────────────────────

function ITAssessment() {
  const [selectedItem, setSelectedItem] = useState<typeof assessItems[0] | null>(null)
  const [collecting, setCollecting] = useState(false)
  const [collected, setCollected] = useState(false)

  const totalScore = assessItems.reduce((s, i) => s + i.score, 0)
  const autoCount = assessItems.filter(i => i.autoCollect).length

  const radarData = categoryScores.map(c => ({ subject: c.category, A: c.score }))

  return (
    <div className="space-y-4">
      {/* Summary banner */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '综合考核评分', value: `${totalScore.toFixed(1)}`, sub: '优秀（全市第1名）', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: '自动采集指标', value: `${autoCount}/${assessItems.length}`, sub: '智能采集覆盖率', color: 'text-gov-600', bg: 'bg-gov-50' },
          { label: '待提升指标', value: `${assessItems.filter(i => i.actual < i.target).length}`, sub: '未达目标值', color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: '同比去年', value: '+3.6分', sub: '持续提升', color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map(s => (
          <div key={s.label} className={`card p-4 ${s.bg}`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-sm text-gray-600 mt-1">{s.label}</div>
            <div className={`text-xs ${s.color} mt-1`}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          <div className="card">
            <div className="card-header">
              <div className="card-title flex items-center gap-2"><BarChart3 size={14} className="text-gov-500" />考核指标评分明细</div>
              <div className="flex items-center gap-2">
                <AIBadge label="AI自动采集" />
                <button onClick={() => { setCollecting(true); setTimeout(() => { setCollecting(false); setCollected(true) }, 2000) }}
                  disabled={collecting} className="btn-primary text-xs py-1.5">
                  <RefreshCw size={12} className={collecting ? 'animate-spin' : ''} />{collecting ? '采集中...' : '立即采集'}
                </button>
              </div>
            </div>
            {collected && (
              <div className="mx-4 mb-3 flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
                <CheckCircle size={14} />指标数据已更新，{autoCount}项自动采集成功，{assessItems.length - autoCount}项需人工填报
              </div>
            )}
            <DataTable
              columns={[
                { key: 'id', title: '编号', width: 70 },
                { key: 'name', title: '考核指标', render: (v: string) => <span className="font-medium text-sm">{v}</span> },
                { key: 'category', title: '指标类别', render: (v: string) => <StatusBadge label={v} variant="info" /> },
                { key: 'weight', title: '权重(%)', align: 'center' as const },
                { key: 'target', title: '目标值', render: (v: number) => <span className="text-gray-500">{v}%</span> },
                { key: 'actual', title: '实际值', render: (v: number, row: any) => (
                  <span className={`font-semibold ${v >= row.target ? 'text-emerald-600' : 'text-amber-600'}`}>{v}%</span>
                )},
                { key: 'autoCollect', title: '采集方式', render: (v: boolean) => (
                  <span className={`text-xs ${v ? 'text-indigo-600' : 'text-gray-500'}`}>{v ? '🤖 AI自动' : '👤 人工'}</span>
                )},
                { key: 'score', title: '得分', render: (v: number, row: any) => (
                  <span className={`font-bold text-sm ${v >= row.weight ? 'text-emerald-600' : 'text-amber-600'}`}>{v.toFixed(1)}</span>
                )},
                { key: 'trend', title: '趋势', render: (v: string) => (
                  <span className={`flex items-center gap-0.5 text-xs font-medium ${v === '上升' ? 'text-emerald-600' : v === '下降' ? 'text-red-600' : 'text-gray-500'}`}>
                    {v === '上升' ? <TrendingUp size={12} /> : v === '下降' ? <TrendingDown size={12} /> : '→'}{v}
                  </span>
                )},
              ]}
              data={assessItems} rowKey="id" onRowClick={setSelectedItem}
            />
          </div>

          <div className="card p-4">
            <div className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"><Sparkles size={13} className="text-indigo-500" />AI改进建议</div>
            <div className="space-y-3">
              {improvements.map((imp, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
                  <AlertTriangle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-amber-700">{imp.item}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${imp.impact === '高' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>影响：{imp.impact}</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{imp.action}</div>
                    <div className="text-xs text-gray-400 mt-1">责任科室：{imp.dept}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-4">
            <div className="text-sm font-semibold text-gray-700 mb-3">考核维度雷达图</div>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9 }} />
                <Radar dataKey="A" stroke="#0052CC" fill="#0052CC" fillOpacity={0.2} />
                <Tooltip formatter={(v: number) => [v + '%', '']} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-4">
            <div className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"><TrendingUp size={14} className="text-gov-500" />历年考核得分</div>
            <div className="space-y-2">
              {assessHistory.map((h, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-14 shrink-0">{h.year}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div className={`h-2 rounded-full ${h.score >= 90 ? 'bg-emerald-500' : 'bg-gov-500'}`} style={{ width: `${h.score}%` }} />
                  </div>
                  <span className={`text-xs font-bold w-10 text-right ${h.score >= 90 ? 'text-emerald-600' : 'text-gov-600'}`}>{h.score}</span>
                  <StatusBadge label={h.grade} variant={h.grade === '优秀' ? 'success' : 'info'} />
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <div className="text-sm font-semibold text-gray-700 mb-2">考核报告</div>
            <div className="space-y-2">
              {['2024年第一季度信息化考核报告', '2023年度信息化考核报告', '2023年第三季度考核报告'].map((r, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                  <div className="flex items-center gap-2"><FileText size={12} className="text-gov-400" /><span>{r}</span></div>
                  <button className="text-gov-500 hover:text-gov-400"><Download size={12} /></button>
                </div>
              ))}
              <button className="btn-primary w-full text-xs py-2 mt-1">
                <Sparkles size={12} />AI生成考核报告
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal open={!!selectedItem} onClose={() => setSelectedItem(null)} title={`指标详情 — ${selectedItem?.name}`} subtitle={`类别：${selectedItem?.category} · 权重：${selectedItem?.weight}%`} width="md"
        footer={<><button className="btn-secondary" onClick={() => setSelectedItem(null)}>关闭</button><button className="btn-primary"><Sparkles size={13} />生成分析报告</button></>}>
        {selectedItem && (
          <AIPanel title="AI 指标分析" items={[
            { label: '指标完成情况', value: `目标：${selectedItem.target}%，实际：${selectedItem.actual}%，${selectedItem.actual >= selectedItem.target ? '已超额完成' : `差距 ${(selectedItem.target - selectedItem.actual).toFixed(1)}%，需改进`}`, type: selectedItem.actual >= selectedItem.target ? 'success' : 'warning' },
            { label: '得分', value: `${selectedItem.score.toFixed(1)} / ${selectedItem.weight} 分（满分），得分率 ${(selectedItem.score / selectedItem.weight * 100).toFixed(1)}%`, type: selectedItem.score >= selectedItem.weight * 0.9 ? 'success' : 'warning' },
            { label: '采集方式', value: selectedItem.autoCollect ? 'AI系统自动采集，数据实时更新，无需人工干预' : '需人工填报，建议在季度末前完成数据更新', type: selectedItem.autoCollect ? 'success' : 'info' },
            { label: '趋势分析', value: `该指标近期趋势：${selectedItem.trend}，${selectedItem.trend === '上升' ? '表现良好，继续保持' : selectedItem.trend === '下降' ? '需要关注，分析下降原因并制定改进措施' : '保持稳定，注意持续跟踪'}`, type: selectedItem.trend === '上升' ? 'success' : selectedItem.trend === '下降' ? 'warning' : 'info' },
          ]} />
        )}
      </Modal>
    </div>
  )
}

// ──────────────────────── Tab 3: Data Governance ────────────────────────

function DataGovernance() {
  const [subtab, setSubtab] = useState<'数据质量' | '问题清单' | '数据标准' | '数据血缘'>('数据质量')
  const [selectedModule, setSelectedModule] = useState<typeof dataModules[0] | null>(null)
  const [selectedIssue, setSelectedIssue] = useState<typeof dataIssues[0] | null>(null)
  const [fixing, setFixing] = useState(false)
  const [fixed, setFixed] = useState(false)

  const totalRecords = dataModules.reduce((s, m) => s + m.records, 0)
  const avgQuality = (dataModules.reduce((s, m) => s + m.qualityScore, 0) / dataModules.length).toFixed(1)
  const totalIssues = dataModules.reduce((s, m) => s + m.issues, 0)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '数据记录总量', value: `${(totalRecords / 10000).toFixed(0)}万条`, sub: '全系统合计', color: 'text-gov-600', bg: 'bg-gov-50' },
          { label: '综合数据质量', value: `${avgQuality}分`, sub: '综合质量评分', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'AI发现问题', value: `${totalIssues}类`, sub: '待处理', color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: '数据标准合规率', value: '94.2%', sub: '字段级合规', color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map(s => (
          <div key={s.label} className={`card p-4 ${s.bg}`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-sm text-gray-600 mt-1">{s.label}</div>
            <div className={`text-xs ${s.color} mt-1`}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 bg-gray-100 rounded-lg p-1 w-fit">
        {(['数据质量', '问题清单', '数据标准', '数据血缘'] as const).map(t => (
          <button key={t} onClick={() => setSubtab(t)}
            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${subtab === t ? 'bg-white text-gov-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {t}
            {t === '问题清单' && <span className="ml-1 px-1 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px]">{totalIssues}</span>}
          </button>
        ))}
      </div>

      {subtab === '数据质量' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 card">
              <div className="card-header">
                <div className="card-title flex items-center gap-2"><Database size={14} className="text-gov-500" />各模块数据质量评分</div>
                <AIBadge label="AI实时检测" />
              </div>
              <DataTable
                columns={[
                  { key: 'name', title: '数据模块', render: (v: string) => <span className="font-medium">{v}</span> },
                  { key: 'records', title: '记录数(条)', render: (v: number) => v.toLocaleString() },
                  { key: 'completeness', title: '完整性(%)', render: (v: number) => (
                    <span className={`text-xs font-medium ${v >= 98 ? 'text-emerald-600' : v >= 95 ? 'text-gov-600' : 'text-amber-600'}`}>{v}</span>
                  )},
                  { key: 'accuracy', title: '准确性(%)', render: (v: number) => (
                    <span className={`text-xs font-medium ${v >= 95 ? 'text-emerald-600' : v >= 90 ? 'text-gov-600' : 'text-amber-600'}`}>{v}</span>
                  )},
                  { key: 'timeliness', title: '时效性(%)', render: (v: number) => (
                    <span className={`text-xs font-medium ${v >= 95 ? 'text-emerald-600' : v >= 88 ? 'text-gov-600' : 'text-amber-600'}`}>{v}</span>
                  )},
                  { key: 'consistency', title: '一致性(%)', render: (v: number) => (
                    <span className={`text-xs font-medium ${v >= 90 ? 'text-emerald-600' : v >= 85 ? 'text-gov-600' : 'text-amber-600'}`}>{v}</span>
                  )},
                  { key: 'qualityScore', title: '综合评分', render: (v: number) => (
                    <div className="flex items-center gap-1.5">
                      <div className="w-14 bg-gray-100 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${v >= 92 ? 'bg-emerald-500' : v >= 88 ? 'bg-gov-500' : 'bg-amber-500'}`} style={{ width: `${v}%` }} /></div>
                      <span className={`text-xs font-bold ${v >= 92 ? 'text-emerald-600' : v >= 88 ? 'text-gov-600' : 'text-amber-600'}`}>{v}</span>
                    </div>
                  )},
                  { key: 'issues', title: 'AI发现问题', render: (v: number) => (
                    <span className={v > 5 ? 'text-red-600 font-bold' : v > 0 ? 'text-amber-600 font-semibold' : 'text-gray-300'}>{v > 0 ? `${v}项` : '—'}</span>
                  )},
                  { key: 'status', title: '质量状态', render: (v: string) => <StatusBadge label={v} variant={v === '优秀' ? 'success' : v === '良好' ? 'info' : 'warning'} /> },
                ]}
                data={dataModules} rowKey="id" onRowClick={setSelectedModule}
              />
            </div>

            <div className="space-y-4">
              <div className="card p-4">
                <div className="text-sm font-semibold text-gray-700 mb-3">质量分趋势（近6月）</div>
                <ResponsiveContainer width="100%" height={130}>
                  <LineChart data={qualityTrend} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis domain={[82, 94]} tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(v: number) => [v + '分', '质量评分']} />
                    <Line type="monotone" dataKey="score" stroke="#0052CC" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="card p-4">
                <div className="text-sm font-semibold text-gray-700 mb-3">各模块质量对比</div>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={dataModules.map(m => ({ name: m.name.replace('管理', '').replace('档案', ''), score: m.qualityScore }))} layout="vertical" margin={{ top: 0, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                    <XAxis type="number" domain={[80, 100]} tick={{ fontSize: 9 }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={60} />
                    <Tooltip />
                    <Bar dataKey="score" fill="#0052CC" radius={[0, 2, 2, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {subtab === '问题清单' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title flex items-center gap-2"><AlertTriangle size={14} className="text-amber-500" />AI数据质量问题清单</div>
            <div className="flex items-center gap-2">
              <AIBadge label="AI自动检测" />
              <button onClick={() => { setFixing(true); setTimeout(() => { setFixing(false); setFixed(true) }, 2000) }}
                disabled={fixing} className="btn-primary text-xs py-1.5">
                <Cpu size={12} className={fixing ? 'animate-spin' : ''} />{fixing ? 'AI修复中...' : 'AI一键修复'}
              </button>
            </div>
          </div>
          {fixed && (
            <div className="mx-4 mb-3 flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
              <CheckCircle size={14} />AI批量修复完成：已处理低风险数据问题，高风险问题已标记，请人工确认后修复
            </div>
          )}
          <FilterBar searchPlaceholder="搜索问题类型/字段名..."
            filters={[
              { label: '严重程度', options: [{value:'全部',label:'全部'},{value:'高',label:'高'},{value:'中',label:'中'}], value: '全部', onChange: () => {} },
              { label: '数据模块', options: [{value:'全部',label:'全部'},...dataModules.map(m => ({value:m.name,label:m.name}))], value: '全部', onChange: () => {} },
            ]}
          />
          <DataTable
            columns={[
              { key: 'id', title: '问题编号', width: 80 },
              { key: 'module', title: '数据模块', render: (v: string) => <StatusBadge label={v.replace('管理', '').replace('档案', '')} variant="info" /> },
              { key: 'type', title: '问题类型', render: (v: string) => <StatusBadge label={v} variant="warning" /> },
              { key: 'field', title: '问题字段', render: (v: string) => <span className="font-mono text-xs text-gray-700">{v}</span> },
              { key: 'count', title: '影响记录数', render: (v: number) => <span className={v > 500 ? 'text-red-600 font-bold' : 'text-amber-600 font-semibold'}>{v.toLocaleString()} 条</span> },
              { key: 'severity', title: '严重程度', render: (v: string) => <StatusBadge label={v} variant={v === '高' ? 'danger' : 'warning'} /> },
              { key: 'aiDetect', title: '发现方式', render: (v: boolean) => (
                <span className="flex items-center gap-1 text-xs text-indigo-500"><Sparkles size={10} />AI自动检测</span>
              )},
              { key: 'suggestion', title: 'AI修复建议', render: (v: string) => (
                <div className="flex items-center gap-1 text-xs text-gray-600 max-w-xs"><Sparkles size={10} className="text-indigo-400 shrink-0" /><span className="truncate">{v}</span></div>
              )},
            ]}
            data={dataIssues} rowKey="id" onRowClick={setSelectedIssue}
          />
        </div>
      )}

      {subtab === '数据标准' && (
        <div className="space-y-4">
          <div className="card">
            <div className="card-header">
              <div className="card-title flex items-center gap-2"><Shield size={14} className="text-gov-500" />数据标准管理</div>
              <button className="btn-primary text-xs py-1.5"><Plus size={12} />发布新标准</button>
            </div>
            <DataTable
              columns={[
                { key: 'id', title: '编号', width: 70 },
                { key: 'name', title: '标准名称', render: (v: string) => <span className="font-medium">{v}</span> },
                { key: 'version', title: '版本', render: (v: string) => <span className="font-mono text-xs text-gov-600">{v}</span> },
                { key: 'fields', title: '字段总数', align: 'center' as const },
                { key: 'compliant', title: '合规字段', render: (v: number, row: any) => (
                  <span className={`font-semibold ${v / row.fields >= 0.95 ? 'text-emerald-600' : 'text-amber-600'}`}>{v}</span>
                )},
                { key: 'nonCompliant', title: '不合规字段', render: (v: number) => (
                  <span className={v > 0 ? 'text-red-600 font-semibold' : 'text-gray-300'}>{v > 0 ? v : '—'}</span>
                )},
                { key: 'lastUpdate', title: '最近更新' },
                { key: 'status', title: '状态', render: (v: string) => <StatusBadge label={v} variant={v === '已发布' ? 'success' : 'warning'} /> },
              ]}
              data={dataStandards} rowKey="id"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="card p-4">
              <div className="text-sm font-semibold text-gray-700 mb-3">数据标准合规率</div>
              <div className="space-y-3">
                {dataStandards.map(s => (
                  <div key={s.id} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 flex-1 truncate">{s.name.replace('数据标准', '')}</span>
                    <div className="w-24 bg-gray-100 rounded-full h-2">
                      <div className={`h-2 rounded-full ${s.compliant / s.fields >= 0.98 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                        style={{ width: `${s.compliant / s.fields * 100}%` }} />
                    </div>
                    <span className={`text-xs font-bold w-10 text-right ${s.compliant / s.fields >= 0.98 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {(s.compliant / s.fields * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-4">
              <div className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"><Sparkles size={13} className="text-indigo-500" />AI元数据管理</div>
              <div className="space-y-2 text-xs">
                {[
                  { label: '已登记元数据', value: '1,285 个字段' },
                  { label: 'AI自动识别', value: '856 个字段（66.6%）' },
                  { label: '数据字典完整度', value: '92.3%' },
                  { label: '跨系统字段映射', value: '已建立 128 条映射关系' },
                  { label: '最近元数据更新', value: '2024-07-01' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between py-1.5 border-b border-gray-50">
                    <span className="text-gray-500">{item.label}</span>
                    <span className="font-semibold text-gray-700">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {subtab === '数据血缘' && (
        <div className="space-y-4">
          <div className="bg-gov-50 border border-gov-200 rounded-lg p-4 flex items-start gap-3">
            <GitBranch size={16} className="text-gov-500 mt-0.5 shrink-0" />
            <div>
              <div className="text-sm font-semibold text-gov-700">数据血缘追踪图</div>
              <div className="text-xs text-gov-500 mt-1">展示道路运输许可业务数据从申请 → 审批 → 存储 → 使用的完整流转路径，支持数据溯源与影响分析</div>
            </div>
          </div>

          <div className="card p-6">
            <div className="text-sm font-semibold text-gray-700 mb-6 flex items-center gap-2"><GitBranch size={14} className="text-gov-500" />许可业务数据血缘图（示意）</div>
            {/* Visual lineage diagram */}
            <div className="relative">
              <div className="flex items-start gap-0">
                {/* Column 1 */}
                <div className="flex flex-col items-center gap-3 w-40">
                  <div className="text-xs font-semibold text-gray-500 mb-1">数据来源</div>
                  {[{ name: '业务申请表单', color: 'bg-blue-100 border-blue-400 text-blue-700' }, { name: 'OCR识别引擎', color: 'bg-purple-100 border-purple-400 text-purple-700' }].map((n, i) => (
                    <div key={i} className={`w-full p-2.5 rounded-lg border-2 text-xs font-medium text-center ${n.color}`}>{n.name}</div>
                  ))}
                </div>
                {/* Arrow */}
                <div className="flex items-center mt-10 mx-2"><div className="w-8 h-0.5 bg-gov-300" /><div className="w-0 h-0 border-t-4 border-b-4 border-l-8 border-transparent border-l-gov-400" /></div>
                {/* Column 2 */}
                <div className="flex flex-col items-center gap-3 w-40">
                  <div className="text-xs font-semibold text-gray-500 mb-1">处理层</div>
                  {[{ name: 'AI智能审批引擎', color: 'bg-indigo-100 border-indigo-400 text-indigo-700' }, { name: '业务逻辑校验层', color: 'bg-indigo-100 border-indigo-400 text-indigo-700' }].map((n, i) => (
                    <div key={i} className={`w-full p-2.5 rounded-lg border-2 text-xs font-medium text-center ${n.color}`}>{n.name}</div>
                  ))}
                </div>
                {/* Arrow */}
                <div className="flex items-center mt-10 mx-2"><div className="w-8 h-0.5 bg-gov-300" /><div className="w-0 h-0 border-t-4 border-b-4 border-l-8 border-transparent border-l-gov-400" /></div>
                {/* Column 3 */}
                <div className="flex flex-col items-center gap-3 w-40">
                  <div className="text-xs font-semibold text-gray-500 mb-1">存储层</div>
                  {[{ name: '许可证管理数据库', color: 'bg-gov-100 border-gov-400 text-gov-700' }].map((n, i) => (
                    <div key={i} className={`w-full p-2.5 rounded-lg border-2 text-xs font-medium text-center ${n.color}`}>{n.name}</div>
                  ))}
                </div>
                {/* Arrow */}
                <div className="flex items-center mt-6 mx-2"><div className="w-8 h-0.5 bg-gov-300" /><div className="w-0 h-0 border-t-4 border-b-4 border-l-8 border-transparent border-l-gov-400" /></div>
                {/* Column 4 */}
                <div className="flex flex-col items-center gap-3 w-40">
                  <div className="text-xs font-semibold text-gray-500 mb-1">应用层</div>
                  {[{ name: '证件核发系统', color: 'bg-emerald-100 border-emerald-400 text-emerald-700' }, { name: '统计报表模块', color: 'bg-emerald-100 border-emerald-400 text-emerald-700' }, { name: '数据共享接口', color: 'bg-emerald-100 border-emerald-400 text-emerald-700' }].map((n, i) => (
                    <div key={i} className={`w-full p-2.5 rounded-lg border-2 text-xs font-medium text-center ${n.color}`}>{n.name}</div>
                  ))}
                </div>
                {/* Arrow */}
                <div className="flex items-center mt-6 mx-2"><div className="w-8 h-0.5 bg-gov-300" /><div className="w-0 h-0 border-t-4 border-b-4 border-l-8 border-transparent border-l-gov-400" /></div>
                {/* Column 5 */}
                <div className="flex flex-col items-center gap-3 w-40">
                  <div className="text-xs font-semibold text-gray-500 mb-1">存证层</div>
                  {[{ name: '区块链存证节点', color: 'bg-amber-100 border-amber-400 text-amber-700' }].map((n, i) => (
                    <div key={i} className={`w-full p-2.5 rounded-lg border-2 text-xs font-medium text-center ${n.color}`}>{n.name}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-start gap-6 text-xs text-gray-500 border-t border-gray-100 pt-4">
              {[
                { color: 'bg-blue-400', label: '数据来源' },
                { color: 'bg-indigo-400', label: 'AI处理层' },
                { color: 'bg-gov-400', label: '存储层' },
                { color: 'bg-emerald-400', label: '应用输出' },
                { color: 'bg-amber-400', label: '区块链存证' },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5"><div className={`w-3 h-3 rounded ${l.color}`} />{l.label}</div>
              ))}
              <div className="ml-auto flex items-center gap-1 text-indigo-500"><Sparkles size={11} />AI自动识别血缘关系，实时追踪数据流向</div>
            </div>
          </div>

          <div className="card p-4">
            <div className="text-sm font-semibold text-gray-700 mb-3">血缘追踪能力统计</div>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: '已追踪数据流', value: '28 条', icon: <GitBranch size={16} className="text-gov-500" /> },
                { label: 'AI自动识别率', value: '96.4%', icon: <Sparkles size={16} className="text-indigo-500" /> },
                { label: '跨系统追踪', value: '8 套系统', icon: <Database size={16} className="text-blue-500" /> },
                { label: '数据溯源成功率', value: '99.1%', icon: <Search size={16} className="text-emerald-500" /> },
              ].map((item, i) => (
                <div key={i} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-center mb-2">{item.icon}</div>
                  <div className="text-lg font-bold text-gray-800">{item.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Module Quality Detail Modal */}
      <Modal open={!!selectedModule} onClose={() => setSelectedModule(null)} title={`数据质量详情 — ${selectedModule?.name}`} width="lg"
        footer={<><button className="btn-secondary" onClick={() => setSelectedModule(null)}>关闭</button><button className="btn-primary"><Sparkles size={13} />AI修复建议</button></>}>
        {selectedModule && (
          <div className="flex gap-5">
            <div className="flex-1 space-y-4">
              <DetailSection title="四维质量指标">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: '完整性', val: selectedModule.completeness, threshold: 98 },
                    { label: '准确性', val: selectedModule.accuracy, threshold: 92 },
                    { label: '时效性', val: selectedModule.timeliness, threshold: 90 },
                    { label: '一致性', val: selectedModule.consistency, threshold: 88 },
                  ].map((d, i) => (
                    <div key={i} className="p-3 rounded bg-gray-50 border border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-500">{d.label}</span>
                        <span className={`text-sm font-bold ${d.val >= d.threshold ? 'text-emerald-600' : 'text-amber-600'}`}>{d.val}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={`h-2 rounded-full ${d.val >= d.threshold ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${d.val}%` }} />
                      </div>
                      <div className="text-xs text-gray-400 mt-1">目标：{d.threshold}%</div>
                    </div>
                  ))}
                </div>
              </DetailSection>
              <DetailSection title="模块基本信息">
                <FieldGrid cols={2}>
                  <FieldItem label="数据记录数" value={`${selectedModule.records.toLocaleString()} 条`} highlight />
                  <FieldItem label="综合质量评分" value={`${selectedModule.qualityScore} 分`} highlight />
                  <FieldItem label="发现问题数" value={`${selectedModule.issues} 类`} />
                  <FieldItem label="质量状态" value={<StatusBadge label={selectedModule.status} variant={selectedModule.status === '优秀' ? 'success' : selectedModule.status === '良好' ? 'info' : 'warning'} size="md" />} />
                </FieldGrid>
              </DetailSection>
            </div>
            <div className="w-56 shrink-0">
              <AIPanel title="AI 质量分析" items={[
                { label: '综合评分', value: <div className="text-2xl font-bold text-indigo-300">{selectedModule.qualityScore}<span className="text-sm ml-1">/ 100</span></div>, type: selectedModule.qualityScore >= 92 ? 'success' : 'warning' },
                { label: '质量评价', value: selectedModule.status === '优秀' ? '数据质量优秀，四维指标均超标，继续保持' : selectedModule.status === '良好' ? '整体质量良好，部分指标有提升空间' : '存在质量问题，建议启动数据清洗流程', type: selectedModule.status === '优秀' ? 'success' : selectedModule.status === '良好' ? 'info' : 'warning' },
                { label: 'AI修复建议', value: selectedModule.issues > 0 ? `发现 ${selectedModule.issues} 类数据问题，建议优先处理高严重性问题，可使用AI一键修复功能` : '未发现数据质量问题', type: selectedModule.issues > 0 ? 'warning' : 'success' },
              ]} />
            </div>
          </div>
        )}
      </Modal>

      {/* Issue Detail Modal */}
      <Modal open={!!selectedIssue} onClose={() => setSelectedIssue(null)} title={`问题详情 — ${selectedIssue?.type}`} subtitle={`${selectedIssue?.module} · ${selectedIssue?.field}`} width="md"
        footer={<><button className="btn-secondary" onClick={() => setSelectedIssue(null)}>关闭</button><button className="btn-primary"><Cpu size={13} />AI修复此问题</button></>}>
        {selectedIssue && (
          <AIPanel title="AI 问题分析与修复方案" items={[
            { label: '问题描述', value: `${selectedIssue.module}·${selectedIssue.field}字段存在${selectedIssue.type}，影响 ${selectedIssue.count.toLocaleString()} 条记录`, type: selectedIssue.severity === '高' ? 'warning' : 'info' },
            { label: '严重程度', value: `${selectedIssue.severity}级，${selectedIssue.severity === '高' ? '影响业务数据可用性，建议优先处理' : '可能影响数据分析准确性，建议本月内处理'}`, type: selectedIssue.severity === '高' ? 'warning' : 'info' },
            { label: 'AI修复方案', value: selectedIssue.suggestion, type: 'success' },
            { label: 'AI自动检测', value: 'AI数据质量引擎定时扫描，本次检测时间：今日 06:00，下次检测：明日 06:00', type: 'info' },
          ]} />
        )}
      </Modal>
    </div>
  )
}
