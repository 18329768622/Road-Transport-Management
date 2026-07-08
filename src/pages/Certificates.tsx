import React, { useState } from 'react'
import { Award, Sparkles, Shield, QrCode, CheckCircle, Clock, AlertCircle, Plus } from 'lucide-react'
import DataTable from '../components/DataTable'
import { FilterBar } from '../components/FilterBar'
import Modal, { DetailSection, FieldGrid, FieldItem } from '../components/Modal'
import StatusBadge, { AIBadge } from '../components/StatusBadge'
import AIPanel from '../components/AIPanel'
import { certificates } from '../data/mockData'

type CTab = '证件一览' | '证件核发' | '换发补发' | '证件销毁'

export default function Certificates({ initialTab }: { initialTab?: CTab }) {
  const [tab, setTab] = useState<CTab>(initialTab ?? '证件一览')
  const [selected, setSelected] = useState<any>(null)
  const [verifyInput, setVerifyInput] = useState('')
  const [verifyResult, setVerifyResult] = useState<null | 'valid' | 'invalid'>(null)

  const handleVerify = () => {
    setVerifyResult(verifyInput.length > 5 ? 'valid' : 'invalid')
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-gov-800">道路运输证件管理</h1>
            <p className="text-xs text-gray-500 mt-0.5">第十四章 · 证件核发、换发补发、电子证照、区块链存证、到期预警</p>
          </div>
          <div className="flex items-center gap-2">
            <AIBadge label="区块链存证" />
            <button className="btn-primary"><Plus size={14} />证件核发</button>
          </div>
        </div>
        <div className="flex gap-1 mt-4 border-b border-gray-100 -mb-4">
          {(['证件一览', '证件核发', '换发补发', '证件销毁'] as CTab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${tab === t ? 'border-gov-500 text-gov-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {tab === '证件一览' && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: '在效证件总数', value: '48,560', sub: '各类运输证件', color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: '30天内到期', value: 128, sub: 'AI预警', color: 'text-red-600', bg: 'bg-red-50' },
                { label: '60天内到期', value: 286, sub: '需提前办理', color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: '本月核发', value: 342, sub: '新证+换证', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              ].map(s => (
                <div key={s.label} className={`card p-4 ${s.bg}`}>
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-sm text-gray-600 mt-1">{s.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Verify widget */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={14} className="text-gov-500" />
                <span className="text-sm font-semibold text-gov-700">证件真伪验证</span>
                <AIBadge label="OCR+区块链三重验证" />
              </div>
              <div className="flex gap-3">
                <input
                  className="form-input flex-1"
                  placeholder="输入证件编号或扫描二维码..."
                  value={verifyInput}
                  onChange={e => { setVerifyInput(e.target.value); setVerifyResult(null) }}
                />
                <button className="btn-primary" onClick={handleVerify}>验证真伪</button>
              </div>
              {verifyResult === 'valid' && (
                <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3">
                  <CheckCircle size={20} className="text-emerald-500 shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-emerald-700">证件有效 — 验证通过</div>
                    <div className="text-xs text-emerald-600 mt-0.5 flex items-center gap-1">
                      <Sparkles size={10} />
                      OCR识别正常 · 区块链存证验证通过 · 证件未被注销
                    </div>
                  </div>
                </div>
              )}
              {verifyResult === 'invalid' && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                  <AlertCircle size={20} className="text-red-500 shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-red-700">证件无效 — 验证失败</div>
                    <div className="text-xs text-red-500 mt-0.5">证件号码不存在或已注销，请核实</div>
                  </div>
                </div>
              )}
            </div>

            <div className="card">
              <div className="card-header">
                <FilterBar searchPlaceholder="搜索证件编号/持证人..." filters={[
                  { label: '证件类型', options: [{value:'全部',label:'全部'},{value:'道路运输经营许可证',label:'经营许可证'},{value:'道路运输从业资格证',label:'从业资格证'}], value: '全部', onChange: () => {} },
                  { label: '状态', options: [{value:'全部',label:'全部'},{value:'有效',label:'有效'},{value:'即将到期',label:'即将到期'}], value: '全部', onChange: () => {} },
                ]} />
              </div>
              <DataTable
                columns={[
                  { key: 'certNo', title: '证件编号', render: (v: string) => <span className="font-mono text-gov-600 font-semibold">{v}</span> },
                  { key: 'certType', title: '证件类型', render: (v: string) => (
                    <span className="text-xs bg-gov-50 text-gov-600 px-2 py-0.5 rounded">{v}</span>
                  )},
                  { key: 'holder', title: '持证人/单位' },
                  { key: 'issueDate', title: '发证日期' },
                  { key: 'expireDate', title: '到期日期' },
                  { key: 'issueOrg', title: '发证机关' },
                  { key: 'aiVerified', title: '区块链存证', render: (v: boolean) => (
                    <div className="flex items-center gap-1.5 text-xs">
                      {v ? <><CheckCircle size={11} className="text-emerald-500" /><span className="text-emerald-600">已存证</span></> : <><AlertCircle size={11} className="text-amber-500" /><span className="text-amber-600">待存证</span></>}
                    </div>
                  )},
                  { key: 'blockchainHash', title: '区块链哈希', render: (v: string) => (
                    <span className="font-mono text-xs text-gray-400">{v}</span>
                  )},
                  { key: 'status', title: '状态', render: (v: string) => (
                    <StatusBadge label={v} variant={v === '有效' ? 'success' : 'warning'} />
                  )},
                ]}
                data={certificates}
                rowKey="id"
                onRowClick={setSelected}
              />
            </div>
          </div>
        )}

        {tab === '证件核发' && <CertIssue />}
        {tab === '换发补发' && <CertRenew />}
        {tab === '证件销毁' && <CertDestroy />}
      </div>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={`证件详情 — ${selected?.certNo}`}
        subtitle={selected?.certType}
        width="lg"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setSelected(null)}>关闭</button>
            <button className="btn-primary"><Shield size={13} />区块链核验</button>
            <button className="btn-primary">办理换发</button>
          </>
        }
      >
        {selected && (
          <div className="flex gap-4">
            <div className="flex-1 space-y-3">
              <DetailSection title="证件基本信息">
                <FieldGrid cols={2}>
                  <FieldItem label="证件编号" value={selected.certNo} highlight />
                  <FieldItem label="证件类型" value={selected.certType} />
                  <FieldItem label="持证人/单位" value={selected.holder} />
                  <FieldItem label="发证机关" value={selected.issueOrg} />
                  <FieldItem label="发证日期" value={selected.issueDate} />
                  <FieldItem label="到期日期" value={selected.expireDate} />
                </FieldGrid>
              </DetailSection>
              <DetailSection title="防伪信息">
                <FieldGrid cols={2}>
                  <FieldItem label="区块链哈希" value={<span className="font-mono text-xs">{selected.blockchainHash}</span>} />
                  <FieldItem label="存证状态" value={selected.aiVerified ? '已上链存证' : '待存证'} highlight={selected.aiVerified} />
                </FieldGrid>
              </DetailSection>
            </div>
            <div className="w-52 shrink-0">
              <AIPanel title="AI证件分析" items={[
                { label: '真伪验证', value: '证件OCR识别正常，区块链存证核验通过，证件为真', type: 'success' },
                { label: '到期预警', value: `距到期还有 ${Math.max(0, Math.round((new Date(selected.expireDate).getTime() - Date.now()) / 86400000))} 天，${Math.round((new Date(selected.expireDate).getTime() - Date.now()) / 86400000) < 90 ? '请尽快办理换发' : '暂无需处理'}`, type: Math.round((new Date(selected.expireDate).getTime() - Date.now()) / 86400000) < 90 ? 'warning' : 'success' },
                { label: '换发建议', value: '建议提前60天办理换发，避免证件过期影响经营', type: 'info' },
              ]} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function CertIssue() {
  return (
    <div className="card p-6">
      <div className="text-sm font-semibold text-gov-700 mb-4">证件核发</div>
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label className="form-label">证件类型 *</label>
          <select className="form-select">
            <option>道路运输经营许可证</option>
            <option>道路运输从业资格证</option>
            <option>危险货物运输经营许可证</option>
            <option>道路运输证</option>
          </select>
        </div>
        <div>
          <label className="form-label">持证人/单位 *</label>
          <input className="form-input" placeholder="搜索关联申请..." />
        </div>
        <div>
          <label className="form-label">关联申请编号</label>
          <input className="form-input" placeholder="许可申请编号" />
        </div>
        <div>
          <label className="form-label">有效期（年）</label>
          <select className="form-select"><option>4</option><option>5</option><option>3</option></select>
        </div>
      </div>
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 flex items-start gap-3 mb-4">
        <Sparkles size={16} className="text-indigo-500 mt-0.5 shrink-0" />
        <div>
          <div className="text-sm font-medium text-indigo-700 mb-1">AI电子证照生成</div>
          <div className="text-xs text-indigo-600">系统将自动生成电子证照，附带防伪二维码，并同步上传至区块链进行存证，同时推送电子证照至业户注册邮箱</div>
        </div>
      </div>
      <button className="btn-primary"><Award size={14} />生成并核发证件</button>
    </div>
  )
}

function CertRenew() {
  return (
    <div className="space-y-4">
      <div className="card p-5">
        <div className="text-sm font-semibold text-gov-700 mb-3">到期预警清单</div>
        <div className="space-y-2">
          {[
            { cert: 'YZ2022010', holder: '鑫鹏物流运输有限公司', type: '经营许可证', expiry: '2024-08-31', days: 55, aiNotified: true },
            { cert: 'CZ2018022', holder: '赵小华', type: '从业资格证', expiry: '2024-09-29', days: 84, aiNotified: true },
            { cert: 'HZ2022015', holder: '某某化工运输公司', type: '危货许可证', expiry: '2024-10-15', days: 100, aiNotified: false },
          ].map(c => (
            <div key={c.cert} className="flex items-center gap-4 p-3 bg-amber-50 border border-amber-100 rounded-lg">
              <Clock size={16} className={c.days < 60 ? 'text-red-500' : 'text-amber-500'} />
              <div className="flex-1">
                <div className="text-sm font-medium">{c.holder}</div>
                <div className="text-xs text-gray-500">{c.type} — {c.cert}</div>
              </div>
              <div className={`text-sm font-bold ${c.days < 60 ? 'text-red-600' : 'text-amber-600'}`}>{c.days}天后到期</div>
              <div className="flex items-center gap-1 text-xs text-indigo-500"><Sparkles size={10} />{c.aiNotified ? '已预警通知' : '待通知'}</div>
              <button className="btn-secondary btn-sm text-xs">办理换发</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CertDestroy() {
  return (
    <div className="card p-6">
      <div className="text-sm font-semibold text-gov-700 mb-4">证件销毁管理</div>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700 mb-4 flex items-start gap-2">
        <AlertCircle size={14} className="mt-0.5 shrink-0" />
        <span>证件销毁须经AI-OCR识别确认、区块链存证注销，并生成销毁证明存档</span>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="form-label">销毁原因</label>
          <select className="form-select">
            <option>证件到期</option><option>许可注销</option><option>证件损毁</option><option>变更换发</option>
          </select>
        </div>
        <div>
          <label className="form-label">证件编号</label>
          <input className="form-input" placeholder="输入待销毁证件号" />
        </div>
      </div>
      <button className="btn-danger">申请销毁</button>
    </div>
  )
}
