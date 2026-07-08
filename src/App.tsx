import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import FreightTransport from './pages/FreightTransport'
import HazardousGoods from './pages/HazardousGoods'
import PassengerTransport from './pages/PassengerTransport'
import Enforcement from './pages/Enforcement'
import Personnel from './pages/Personnel'
import Certificates from './pages/Certificates'
import Statistics from './pages/Statistics'
import RepairManagement from './pages/RepairManagement'
import LawKnowledgeBase from './pages/LawKnowledgeBase'
import PlaceholderPage from './pages/PlaceholderPage'
import VehicleManagement from './pages/VehicleManagement'
import FreightStation from './pages/FreightStation'
import PassengerStation from './pages/PassengerStation'
import DriverTraining from './pages/DriverTraining'
import ForeignInvestment from './pages/ForeignInvestment'
import InternationalTransport from './pages/InternationalTransport'
import SystemManagement from './pages/SystemManagement'
import AIServices from './pages/AIServices'

type PageKey = string

interface PageConfig {
  breadcrumbs: { label: string; key?: string }[]
  component: React.ComponentType<any>
  props?: Record<string, any>
}

const getPageConfig = (key: PageKey, navigate: (k: string) => void): PageConfig => {
  switch (key) {
    case 'dashboard':
      return { breadcrumbs: [{ label: '道路运输管理系统' }, { label: '数据驾驶舱' }], component: Dashboard, props: { onNavigate: navigate } }
    case 'freight':
      return { breadcrumbs: [{ label: '许可管理' }, { label: '道路货物运输管理' }], component: FreightTransport }
    case 'hazmat':
      return { breadcrumbs: [{ label: '许可管理' }, { label: '道路危险货物运输管理' }], component: HazardousGoods }
    case 'passenger':
      return { breadcrumbs: [{ label: '许可管理' }, { label: '道路旅客运输管理' }], component: PassengerTransport }
    case 'station':
      return { breadcrumbs: [{ label: '许可管理' }, { label: '道路货运站场管理' }], component: FreightStation }
    case 'passenger-station':
      return { breadcrumbs: [{ label: '许可管理' }, { label: '道路客运站管理' }], component: PassengerStation }
    case 'repair':
      return { breadcrumbs: [{ label: '许可管理' }, { label: '机动车维修管理' }], component: RepairManagement }
    case 'training':
      return { breadcrumbs: [{ label: '许可管理' }, { label: '驾驶员培训管理' }], component: DriverTraining }
    case 'foreign':
      return { breadcrumbs: [{ label: '许可管理' }, { label: '外商投资运输管理' }], component: ForeignInvestment }
    case 'international':
      return { breadcrumbs: [{ label: '许可管理' }, { label: '国际道路运输管理' }], component: InternationalTransport }
    case 'personnel-list':
      return { breadcrumbs: [{ label: '从业人员管理' }, { label: '从业人员档案' }], component: Personnel, props: { initialTab: '人员档案' } }
    case 'license-issue':
      return { breadcrumbs: [{ label: '从业人员管理' }, { label: '从业资格证管理' }], component: Personnel, props: { initialTab: '资格证管理' } }
    case 'integrity':
      return { breadcrumbs: [{ label: '从业人员管理' }, { label: '诚信考核管理' }], component: Personnel, props: { initialTab: '诚信考核' } }
    case 'exam':
      return { breadcrumbs: [{ label: '从业人员管理' }, { label: '考试管理' }], component: Personnel, props: { initialTab: '考试管理' } }
    case 'vehicle-file':
      return { breadcrumbs: [{ label: '车辆技术管理' }, { label: '车辆档案管理' }], component: VehicleManagement, props: { initialTab: '车辆档案管理' } }
    case 'vehicle-inspect':
      return { breadcrumbs: [{ label: '车辆技术管理' }, { label: '车辆技术审查' }], component: VehicleManagement, props: { initialTab: '车辆技术审查' } }
    case 'vehicle-risk':
      return { breadcrumbs: [{ label: '车辆技术管理' }, { label: '车辆风险预测' }], component: VehicleManagement, props: { initialTab: '车辆风险预测' } }
    case 'cert-issue':
      return { breadcrumbs: [{ label: '证件管理' }, { label: '证件核发' }], component: Certificates, props: { initialTab: '证件核发' } }
    case 'cert-renew':
      return { breadcrumbs: [{ label: '证件管理' }, { label: '换发补发管理' }], component: Certificates, props: { initialTab: '换发补发' } }
    case 'cert-destroy':
      return { breadcrumbs: [{ label: '证件管理' }, { label: '证件销毁管理' }], component: Certificates, props: { initialTab: '证件销毁' } }
    case 'inspection':
      return { breadcrumbs: [{ label: '行政执法' }, { label: '监督检查' }], component: Enforcement, props: { initialTab: '监督检查' } }
    case 'checkpoint':
      return { breadcrumbs: [{ label: '行政执法' }, { label: '检查站管理' }], component: Enforcement, props: { initialTab: '检查站' } }
    case 'case':
      return { breadcrumbs: [{ label: '行政执法' }, { label: '行政处罚案件' }], component: Enforcement, props: { initialTab: '案件管理' } }
    case 'evidence':
      return { breadcrumbs: [{ label: '行政执法' }, { label: '执法证据管理' }], component: Enforcement, props: { initialTab: '案件管理' } }
    case 'stat-report':
      return { breadcrumbs: [{ label: '统计管理' }, { label: '统计报表' }], component: Statistics, props: { initialTab: '统计报表' } }
    case 'industry-analysis':
      return { breadcrumbs: [{ label: '统计管理' }, { label: '行业运行分析' }], component: Statistics, props: { initialTab: '行业分析' } }
    case 'law-list':
      return { breadcrumbs: [{ label: '法规知识库' }, { label: '法规文件管理' }], component: LawKnowledgeBase }
    case 'standard':
      return { breadcrumbs: [{ label: '法规知识库' }, { label: '技术标准管理' }], component: LawKnowledgeBase }
    case 'org':
      return { breadcrumbs: [{ label: '系统管理' }, { label: '机构人员管理' }], component: SystemManagement, props: { initialTab: '机构人员管理' } }
    case 'it-assess':
      return { breadcrumbs: [{ label: '系统管理' }, { label: '信息化考核' }], component: SystemManagement, props: { initialTab: '信息化考核' } }
    case 'data-gov':
      return { breadcrumbs: [{ label: '系统管理' }, { label: '数据治理' }], component: SystemManagement, props: { initialTab: '数据治理' } }
    case 'ai-approval':
      return { breadcrumbs: [{ label: 'AI服务在线' }, { label: 'AI智能审批助手' }], component: AIServices, props: { initialTab: 'AI智能审批助手' } }
    case 'ai-risk-warn':
      return { breadcrumbs: [{ label: 'AI服务在线' }, { label: 'AI风险预警中心' }], component: AIServices, props: { initialTab: 'AI风险预警中心' } }
    case 'ai-qa':
      return { breadcrumbs: [{ label: 'AI服务在线' }, { label: 'AI知识问答' }], component: AIServices, props: { initialTab: 'AI知识问答' } }
    case 'ai-decision':
      return { breadcrumbs: [{ label: 'AI服务在线' }, { label: 'AI辅助决策分析' }], component: AIServices, props: { initialTab: 'AI辅助决策分析' } }
    case 'ai-monitor':
      return { breadcrumbs: [{ label: 'AI服务在线' }, { label: 'AI能力监控平台' }], component: AIServices, props: { initialTab: 'AI能力监控平台' } }
    default:
      return { breadcrumbs: [{ label: '道路运输管理系统' }], component: Dashboard, props: { onNavigate: navigate } }
  }
}

export default function App() {
  const [activePage, setActivePage] = useState<PageKey>('dashboard')

  const navigate = (key: PageKey) => setActivePage(key)

  const pageConfig = getPageConfig(activePage, navigate)
  const PageComponent = pageConfig.component

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
      <Sidebar active={activePage} onSelect={navigate} />
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Header breadcrumbs={pageConfig.breadcrumbs} onBreadcrumbClick={navigate} onNavigate={navigate} />
        <main className="flex-1 overflow-hidden">
          <PageComponent key={activePage} {...(pageConfig.props ?? {})} />
        </main>
      </div>
    </div>
  )
}
