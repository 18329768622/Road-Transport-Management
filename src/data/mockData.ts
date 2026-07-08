// Mock data for all modules

export const freightCompanies = [
  { id: 'FR001', name: '恒通物流运输有限公司', legalPerson: '张建国', phone: '13812345678', address: '本市经济开发区物流园A区', licenseNo: 'YZ2023001', businessScope: '普通货物运输', vehicles: 28, status: '正常', creditLevel: 'AA', riskLevel: '低', applyDate: '2023-03-15', expireDate: '2027-03-14', aiScore: 92, aiRisk: '低' },
  { id: 'FR002', name: '顺达货运集团有限公司', legalPerson: '李建华', phone: '13987654321', address: '本市工业新区运输基地', licenseNo: 'YZ2023002', businessScope: '普通货物运输', vehicles: 56, status: '正常', creditLevel: 'A', riskLevel: '低', applyDate: '2023-05-20', expireDate: '2027-05-19', aiScore: 88, aiRisk: '低' },
  { id: 'FR003', name: '天龙货物运输公司', legalPerson: '王大为', phone: '15678901234', address: '本市南部物流中心', licenseNo: 'YZ2023003', businessScope: '大件货物运输', vehicles: 12, status: '正常', creditLevel: 'B', riskLevel: '中', applyDate: '2023-07-10', expireDate: '2027-07-09', aiScore: 71, aiRisk: '中' },
  { id: 'FR004', name: '鑫鹏物流运输有限公司', legalPerson: '赵明辉', phone: '18523456789', address: '本市西区货运站旁', licenseNo: 'YZ2022010', businessScope: '普通货物运输', vehicles: 8, status: '警告', creditLevel: 'B', riskLevel: '高', applyDate: '2022-09-01', expireDate: '2024-08-31', aiScore: 45, aiRisk: '高' },
  { id: 'FR005', name: '快速物流运输公司', legalPerson: '陈晓峰', phone: '13567890123', address: '本市北区工业园', licenseNo: 'YZ2024001', businessScope: '普通货物运输', vehicles: 35, status: '正常', creditLevel: 'AA', riskLevel: '低', applyDate: '2024-01-15', expireDate: '2028-01-14', aiScore: 95, aiRisk: '低' },
  { id: 'FR006', name: '中远货运有限公司', legalPerson: '刘建平', phone: '13745678901', address: '本市港区物流基地', licenseNo: 'YZ2023008', businessScope: '普通货物运输', vehicles: 42, status: '正常', creditLevel: 'A', riskLevel: '低', applyDate: '2023-08-20', expireDate: '2027-08-19', aiScore: 85, aiRisk: '低' },
  { id: 'FR007', name: '远通运输服务有限公司', legalPerson: '孙志远', phone: '15812345678', address: '本市东区货运园区', licenseNo: 'YZ2023012', businessScope: '冷链货物运输', vehicles: 18, status: '正常', creditLevel: 'A', riskLevel: '低', applyDate: '2023-10-05', expireDate: '2027-10-04', aiScore: 87, aiRisk: '低' },
  { id: 'FR008', name: '华运物流集团', legalPerson: '吴海涛', phone: '13698765432', address: '本市中央物流园区', licenseNo: 'YZ2022015', businessScope: '普通货物运输', vehicles: 65, status: '正常', creditLevel: 'AA', riskLevel: '低', applyDate: '2022-11-10', expireDate: '2026-11-09', aiScore: 94, aiRisk: '低' },
]

export const applications = [
  { id: 'APP2024001', company: '兴达货运有限公司', legalPerson: '马建国', type: '新申请', businessScope: '普通货物运输', vehicles: 5, submitDate: '2024-06-20', status: '待审查', aiPreview: '材料齐全，建议受理', aiScore: 88, aiRisk: '低', stage: '形式审查', handler: '李审核员' },
  { id: 'APP2024002', company: '运通物流公司', legalPerson: '周建伟', type: '新申请', businessScope: '冷链货物运输', vehicles: 8, submitDate: '2024-06-18', status: '形式审查中', aiPreview: '发现2项缺失材料', aiScore: 62, aiRisk: '中', stage: '形式审查', handler: '张审核员' },
  { id: 'APP2024003', company: '顺风运输服务公司', legalPerson: '赵晓红', type: '变更申请', businessScope: '普通货物运输', vehicles: 3, submitDate: '2024-06-15', status: '实质审查中', aiPreview: '符合许可条件', aiScore: 91, aiRisk: '低', stage: '实质审查', handler: '王审核员' },
  { id: 'APP2024004', company: '远大物流有限公司', legalPerson: '陈志强', type: '新申请', businessScope: '大件货物运输', vehicles: 4, submitDate: '2024-06-12', status: '待批准', aiPreview: '综合评估良好，建议准予', aiScore: 85, aiRisk: '低', stage: '许可决定', handler: '刘局长' },
  { id: 'APP2024005', company: '通达快运公司', legalPerson: '林海燕', type: '年审申请', businessScope: '普通货物运输', vehicles: 12, submitDate: '2024-06-10', status: '已批准', aiPreview: '年审合格', aiScore: 93, aiRisk: '低', stage: '已完成', handler: '李审核员' },
]

export const hazmatCompanies = [
  { id: 'HZ001', name: '安全化工运输公司', legalPerson: '张安全', phone: '13812340001', licenseNo: 'HZ2023001', hazType: '普通危货', vehicles: 15, drivers: 18, escorts: 18, status: '正常', riskLevel: '中', expireDate: '2027-03-14', aiRisk: '中', tankHealth: 85 },
  { id: 'HZ002', name: '危化品物流有限公司', legalPerson: '王化工', phone: '15698760001', licenseNo: 'HZ2023002', hazType: '剧毒化学品', vehicles: 8, drivers: 10, escorts: 10, status: '正常', riskLevel: '高', expireDate: '2027-05-20', aiRisk: '高', tankHealth: 92 },
  { id: 'HZ003', name: '爆炸品运输专业公司', legalPerson: '李守法', phone: '18923450001', licenseNo: 'HZ2023003', hazType: '爆炸品', vehicles: 5, drivers: 6, escorts: 6, status: '警告', riskLevel: '高', expireDate: '2026-12-31', aiRisk: '极高', tankHealth: 61 },
  { id: 'HZ004', name: '气体运输专业公司', legalPerson: '陈气体', phone: '13567890009', licenseNo: 'HZ2022008', hazType: '压缩气体', vehicles: 22, drivers: 25, escorts: 22, status: '正常', riskLevel: '中', expireDate: '2026-08-15', aiRisk: '中', tankHealth: 88 },
  { id: 'HZ005', name: '易燃液体运输公司', legalPerson: '赵燃运', phone: '13745670001', licenseNo: 'HZ2024001', hazType: '易燃液体', vehicles: 18, drivers: 20, escorts: 18, status: '正常', riskLevel: '中', expireDate: '2028-01-20', aiRisk: '低', tankHealth: 95 },
]

export const passengers = [
  { id: 'PT001', name: '蓝天客运有限公司', legalPerson: '刘文海', phone: '13812348888', licenseNo: 'KY2023001', routes: 5, vehicles: 32, seats: 1580, status: '正常', creditLevel: 'AA', expireDate: '2027-03-14', aiScore: 93 },
  { id: 'PT002', name: '快捷旅游客运公司', legalPerson: '李旅游', phone: '15698768888', licenseNo: 'KY2023002', routes: 3, vehicles: 18, seats: 810, status: '正常', creditLevel: 'A', expireDate: '2027-06-20', aiScore: 87 },
  { id: 'PT003', name: '城际客运集团', legalPerson: '张城际', phone: '18923458888', licenseNo: 'KY2023003', routes: 8, vehicles: 55, seats: 2970, status: '正常', creditLevel: 'AA', expireDate: '2027-09-15', aiScore: 96 },
  { id: 'PT004', name: '豪华旅游大巴公司', legalPerson: '陈豪华', phone: '13567898888', licenseNo: 'KY2022005', routes: 2, vehicles: 12, seats: 600, status: '警告', creditLevel: 'B', expireDate: '2025-12-31', aiScore: 58 },
]

export const routes = [
  { id: 'RT001', company: '城际客运集团', from: '本市汽车站', to: '省城汽车北站', distance: 245, km: '高速', frequency: 12, vehicles: 8, fare: 68, status: '正常', passengers30: 18420 },
  { id: 'RT002', company: '蓝天客运有限公司', from: '本市客运中心', to: '市内各景区', distance: 35, km: '旅游线路', frequency: 6, vehicles: 5, fare: 25, status: '正常', passengers30: 5600 },
  { id: 'RT003', company: '快捷旅游客运公司', from: '本市东站', to: '邻市汽车站', distance: 185, km: '高速', frequency: 8, vehicles: 6, fare: 52, status: '正常', passengers30: 12300 },
  { id: 'RT004', company: '豪华旅游大巴公司', from: '本市南站', to: '旅游景区群', distance: 80, km: '旅游线路', frequency: 3, vehicles: 4, fare: 45, status: '暂停', passengers30: 1200 },
]

export const enforcementCases = [
  { id: 'ZF2024001', company: '无证运输个人', person: '王五', violationType: '无证运输', checkDate: '2024-06-20', location: '国道G351K245处', officer: '张执法', status: '处理中', stage: '调查取证', penaltyAmount: 8000, aiRisk: '高', aiSimilar: 3 },
  { id: 'ZF2024002', company: '超载货运', person: '快达运输公司', violationType: '超限运输', checkDate: '2024-06-18', location: '省道S101入城口', officer: '李执法', status: '已立案', stage: '告知听证', penaltyAmount: 15000, aiRisk: '高', aiSimilar: 7 },
  { id: 'ZF2024003', company: '天龙货运公司', person: '天龙货运', violationType: '车辆技术不达标', checkDate: '2024-06-15', location: '市区检查站', officer: '王执法', status: '已决定', stage: '执行', penaltyAmount: 3000, aiRisk: '中', aiSimilar: 12 },
  { id: 'ZF2024004', company: '非法运营黑车', person: '周七', violationType: '非法营运', checkDate: '2024-06-12', location: '高铁站广场', officer: '赵执法', status: '已结案', stage: '结案', penaltyAmount: 5000, aiRisk: '中', aiSimilar: 8 },
  { id: 'ZF2024005', company: '危货违规运输', person: '危运公司', violationType: '危货运输违规', checkDate: '2024-06-10', location: '市区路段', officer: '陈执法', status: '处理中', stage: '立案审批', penaltyAmount: 30000, aiRisk: '极高', aiSimilar: 2 },
]

export const personnel = [
  { id: 'RS001', name: '李建军', idCard: '110101199001011234', driverLicense: 'A2', age: 34, licenseYears: 10, company: '恒通物流运输有限公司', certType: '普通货运', certNo: 'CZ2020001', certExpiry: '2026-05-20', integrityScore: 95, integrityLevel: 'AA', status: '在职', lastViolation: '无', aiRisk: '低' },
  { id: 'RS002', name: '张志远', idCard: '110101198506121234', driverLicense: 'A1', age: 39, licenseYears: 15, company: '城际客运集团', certType: '旅客运输', certNo: 'CZ2019015', certExpiry: '2025-12-31', integrityScore: 88, integrityLevel: 'A', status: '在职', lastViolation: '2023-11超速', aiRisk: '低' },
  { id: 'RS003', name: '王大明', idCard: '110101199203031234', driverLicense: 'A2', age: 32, licenseYears: 8, company: '危化品物流有限公司', certType: '危险货物运输', certNo: 'HZ2021008', certExpiry: '2026-08-15', integrityScore: 72, integrityLevel: 'B', status: '在职', lastViolation: '2024-02疲劳驾驶', aiRisk: '中' },
  { id: 'RS004', name: '赵小华', idCard: '110101198801091234', driverLicense: 'B2', age: 36, licenseYears: 12, company: '快速物流运输公司', certType: '普通货运', certNo: 'CZ2018022', certExpiry: '2024-09-30', integrityScore: 55, integrityLevel: 'B', status: '在职', lastViolation: '2024-04超速闯红灯', aiRisk: '高' },
  { id: 'RS005', name: '陈海波', idCard: '110101197905151234', driverLicense: 'A1', age: 45, licenseYears: 20, company: '蓝天客运有限公司', certType: '旅客运输', certNo: 'CZ2017005', certExpiry: '2027-03-20', integrityScore: 98, integrityLevel: 'AA', status: '在职', lastViolation: '无', aiRisk: '低' },
]

export const certificates = [
  { id: 'CERT001', certNo: 'YZ2023001', certType: '道路运输经营许可证', holder: '恒通物流运输有限公司', issueDate: '2023-03-15', expireDate: '2027-03-14', issueOrg: '市交通运输局', status: '有效', blockchainHash: '0x7a3f...c8d2', aiVerified: true },
  { id: 'CERT002', certNo: 'CZ2020001', certType: '道路运输从业资格证', holder: '李建军', issueDate: '2020-05-20', expireDate: '2026-05-19', issueOrg: '市交通运输局', status: '有效', blockchainHash: '0x2b1e...a5f3', aiVerified: true },
  { id: 'CERT003', certNo: 'HZ2023002', certType: '危险货物运输经营许可证', holder: '危化品物流有限公司', issueDate: '2023-06-10', expireDate: '2027-06-09', issueOrg: '省交通厅', status: '有效', blockchainHash: '0x9c4d...b7e1', aiVerified: true },
  { id: 'CERT004', certNo: 'YZ2022010', certType: '道路运输经营许可证', holder: '鑫鹏物流运输有限公司', issueDate: '2022-09-01', expireDate: '2024-08-31', issueOrg: '市交通运输局', status: '即将到期', blockchainHash: '0x3f7a...d9c4', aiVerified: true },
  { id: 'CERT005', certNo: 'KY2023003', certType: '道路运输经营许可证', holder: '城际客运集团', issueDate: '2023-09-15', expireDate: '2027-09-14', issueOrg: '市交通运输局', status: '有效', blockchainHash: '0x6d8b...e2f7', aiVerified: true },
  { id: 'CERT006', certNo: 'CZ2018022', certType: '道路运输从业资格证', holder: '赵小华', issueDate: '2018-09-30', expireDate: '2024-09-29', issueOrg: '市交通运输局', status: '即将到期', blockchainHash: '0x1a5c...f4b8', aiVerified: false },
]

export const vehicles = [
  { id: 'VH001', plateNo: '粤A12345', vin: 'LGBH2EF02K1234567', brand: '东风天龙', type: '重型货车', year: 2020, techLevel: '一级', company: '恒通物流运输有限公司', inspectDate: '2024-03-20', nextInspect: '2025-03-19', mileage: 185000, status: '正常运营', riskScore: 28, aiRisk: '低' },
  { id: 'VH002', plateNo: '粤B23456', vin: 'LGBH2EF02K2345678', brand: '解放J6', type: '重型货车', year: 2019, techLevel: '二级', company: '快速物流运输公司', inspectDate: '2024-01-15', nextInspect: '2025-01-14', mileage: 265000, status: '正常运营', riskScore: 56, aiRisk: '中' },
  { id: 'VH003', plateNo: '粤C34567', vin: 'LGBH2EF02K3456789', brand: '宇通客车', type: '大型客车', year: 2021, techLevel: '一级', company: '城际客运集团', inspectDate: '2024-05-10', nextInspect: '2025-05-09', mileage: 125000, status: '正常运营', riskScore: 18, aiRisk: '低' },
  { id: 'VH004', plateNo: '粤D45678', vin: 'LGBH2EF02K4567890', brand: '中集罐箱', type: '危险品运输车', year: 2018, techLevel: '二级', company: '危化品物流有限公司', inspectDate: '2024-02-20', nextInspect: '2025-02-19', mileage: 320000, status: '正常运营', riskScore: 72, aiRisk: '高' },
  { id: 'VH005', plateNo: '粤E56789', vin: 'LGBH2EF02K5678901', brand: '大宇客车', type: '大型客车', year: 2022, techLevel: '一级', company: '蓝天客运有限公司', inspectDate: '2024-06-01', nextInspect: '2025-05-31', mileage: 88000, status: '正常运营', riskScore: 12, aiRisk: '低' },
]

export const statData = {
  freight: { total: 1250, valid: 1180, expired: 35, warning: 35, yoy: 8.5 },
  passenger: { total: 328, valid: 312, expired: 8, warning: 8, yoy: 3.2 },
  hazmat: { total: 156, valid: 148, expired: 4, warning: 4, yoy: 5.8 },
  personnel: { total: 45600, valid: 44200, expired: 820, warning: 580, yoy: 12.1 },
  vehicles: { total: 38500, valid: 37200, expired: 650, warning: 650, yoy: 6.3 },
  cases: { total: 2340, closed: 2180, pending: 160, amount: 12850000, yoy: -15.3 },
}

export const monthlyStats = [
  { month: '1月', freight: 98, passenger: 22, hazmat: 12, cases: 185 },
  { month: '2月', freight: 72, passenger: 18, hazmat: 8, cases: 142 },
  { month: '3月', freight: 115, passenger: 28, hazmat: 15, cases: 201 },
  { month: '4月', freight: 130, passenger: 31, hazmat: 18, cases: 215 },
  { month: '5月', freight: 142, passenger: 35, hazmat: 22, cases: 228 },
  { month: '6月', freight: 125, passenger: 29, hazmat: 19, cases: 198 },
]

export const riskDistribution = [
  { name: '低风险', value: 68, color: '#10B981' },
  { name: '中风险', value: 22, color: '#F59E0B' },
  { name: '高风险', value: 8, color: '#EF4444' },
  { name: '极高风险', value: 2, color: '#7F1D1D' },
]

export const aiCapabilities = [
  { name: 'OCR识别', usage: 2847, accuracy: 98.5, status: '正常' },
  { name: '智能审批', usage: 1523, accuracy: 96.2, status: '正常' },
  { name: '风险预测', usage: 38500, accuracy: 91.8, status: '正常' },
  { name: '人脸识别', usage: 5621, accuracy: 99.1, status: '正常' },
  { name: '车牌识别', usage: 128450, accuracy: 99.6, status: '正常' },
  { name: '智能问答', usage: 3892, accuracy: 94.5, status: '正常' },
]

export const checkpoints = [
  { id: 'CP001', name: '国道G351南入城检查站', location: 'G351K245处', officers: 4, vehicles30: 18500, violations30: 58, status: '运营中' },
  { id: 'CP002', name: '省道S101西检查站', location: 'S101K82处', officers: 3, vehicles30: 12300, violations30: 42, status: '运营中' },
  { id: 'CP003', name: '高速连接线检查点', location: '高速出口处', officers: 2, vehicles30: 8900, violations30: 15, status: '运营中' },
]
