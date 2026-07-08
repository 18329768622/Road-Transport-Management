import React, { useState } from 'react'
import { Wrench, Sparkles, Plus, CheckCircle } from 'lucide-react'
import DataTable from '../components/DataTable'
import { FilterBar } from '../components/FilterBar'
import Modal, { DetailSection, FieldGrid, FieldItem } from '../components/Modal'
import StatusBadge, { AIBadge } from '../components/StatusBadge'
import AIPanel from '../components/AIPanel'

const repairs = [
  { id: 'RP001', name: '安达汽车维修厂', type: '一类维修企业', legalPerson: '张维修', phone: '13812341111', techHead: '李工程师', inspectors: 3, workers: 12, status: '正常', licenseNo: 'WX2022001', expiry: '2026-05-20', aiScore: 88 },
  { id: 'RP002', name: '腾飞汽车服务中心', type: '二类维修企业', legalPerson: '王腾飞', phone: '15698761111', techHead: '陈工程师', inspectors: 2, workers: 8, status: '正常', licenseNo: 'WX2023005', expiry: '2027-08-15', aiScore: 92 },
  { id: 'RP003', name: '众合维修服务有限公司', type: '一类维修企业', legalPerson: '赵众合', phone: '18923451111', techHead: '刘工程师', inspectors: 4, workers: 20, status: '警告', licenseNo: 'WX2021012', expiry: '2025-12-31', aiScore: 52 },
]

export default function RepairManagement() {
  const [selected, setSelected] = useState<any>(null)
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-gov-800">机动车维修管理</h1>
            <p className="text-xs text-gray-500 mt-0.5">第八章 · 维修经营许可、业务登记、质量保证、维修纠纷</p>
          </div>
          <div className="flex items-center gap-2">
            <AIBadge label="AI维修审核" />
            <button className="btn-primary"><Plus size={14} />新增许可申请</button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <div className="card">
          <div className="card-header">
            <FilterBar searchPlaceholder="搜索维修企业名称..." filters={[
              { label: '类型', options: [{value:'全部',label:'全部'},{value:'一类',label:'一类'},{value:'二类',label:'二类'}], value: '全部', onChange: () => {} },
            ]} />
          </div>
          <DataTable
            columns={[
              { key: 'id', title: '编号', width: 80 },
              { key: 'name', title: '维修企业', render: (v: string, row: any) => (<div><div className="font-medium">{v}</div><div className="text-xs text-gray-400">{row.licenseNo}</div></div>) },
              { key: 'type', title: '企业类型', render: (v: string) => <StatusBadge label={v} variant="info" /> },
              { key: 'legalPerson', title: '法人代表' },
              { key: 'techHead', title: '技术负责人' },
              { key: 'inspectors', title: '质检员数', align: 'center' as const },
              { key: 'workers', title: '技工数', align: 'center' as const },
              { key: 'aiScore', title: 'AI合规分', render: (v: number) => (
                <div className="flex items-center gap-1.5">
                  <div className="w-16 bg-gray-100 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${v >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${v}%` }} /></div>
                  <span className="text-xs">{v}</span>
                </div>
              )},
              { key: 'status', title: '状态', render: (v: string) => <StatusBadge label={v} variant={v === '正常' ? 'success' : 'warning'} /> },
              { key: 'expiry', title: '有效期至' },
            ]}
            data={repairs}
            rowKey="id"
            onRowClick={setSelected}
          />
        </div>
      </div>
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ''} subtitle={`维修经营许可证：${selected?.licenseNo}`} width="xl"
        footer={<><button className="btn-secondary" onClick={() => setSelected(null)}>关闭</button><button className="btn-primary"><Sparkles size={13} />AI条件审查</button></>}>
        {selected && (
          <div className="flex gap-5">
            <div className="flex-1 space-y-4">
              <DetailSection title="基本信息">
                <FieldGrid cols={3}>
                  <FieldItem label="企业名称" value={selected.name} highlight />
                  <FieldItem label="类型" value={selected.type} />
                  <FieldItem label="法人代表" value={selected.legalPerson} />
                  <FieldItem label="技术负责人" value={selected.techHead} />
                  <FieldItem label="质量检验员" value={`${selected.inspectors} 名`} />
                  <FieldItem label="技工人数" value={`${selected.workers} 名`} />
                </FieldGrid>
              </DetailSection>
              <DetailSection title="AI许可条件符合性">
                <div className="space-y-1.5">
                  {[
                    { cond: '场地租赁≥1年', ok: true }, { cond: '技术负责人配备', ok: true },
                    { cond: '质量检验员配备', ok: selected.inspectors >= 2 }, { cond: '各工种技工配置', ok: selected.workers >= 5 },
                    { cond: '维修设备符合标准', ok: selected.status !== '警告' }, { cond: '消防安全合规', ok: selected.status !== '警告' },
                  ].map((c, i) => (
                    <div key={i} className={`flex items-center gap-2 p-2 rounded text-xs ${c.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                      <span>{c.ok ? '✓' : '✗'}</span><span className="font-medium">{c.cond}</span>
                    </div>
                  ))}
                </div>
              </DetailSection>
            </div>
            <div className="w-60 shrink-0">
              <AIPanel title="AI维修监管分析" items={[
                { label: 'AI合规评分', value: `${selected.aiScore} / 100分`, type: selected.aiScore >= 80 ? 'success' : 'warning' },
                { label: '质量监督', value: selected.status === '警告' ? '近期质量投诉增多，建议开展专项检查' : '近期无质量投诉，维修质量良好', type: selected.status === '警告' ? 'warning' : 'success' },
              ]} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
