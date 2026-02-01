'use client';

import React, { useState, useEffect, useMemo, FC, PropsWithChildren } from 'react';
import {
    AlertCircle, BarChart3, Building2, Calendar, Check, CheckCircle, ChevronDown, ChevronRight,
    CreditCard, DollarSign, Download, Edit, Eye, FileText, Filter, FolderOpen,
    HelpCircle, Key, LayoutDashboard, LogOut, Menu, Moon, MoreVertical,
    Paperclip, Plus, RefreshCw, Search, Send, Settings, Sun, Trash2, TrendingUp, Upload,
    Users, X, Zap, PieChart, Activity, Award, Lock, Unlock, Package, BookOpen, Landmark, ArrowRightLeft, Repeat, Smartphone, Share2, MessageCircle, Layers, ScanBarcode, QrCode, File, Clock, AlertTriangle, ThumbsUp, ThumbsDown, Ticket, List, Wallet, Loader2
} from 'lucide-react';
import { api } from '@/lib/api';

// =================================================================================
// 1. TYPE DEFINITIONS
// =================================================================================

type ScreenId =
    'dashboard' | 'vendas' | 'influenciadores' | 'agentes' | 'payouts' | 'dre' | 'cashFlow' |
    'unitEconomics' | 'custosInfra' | 'settings' | 'help' | 'treasury' | 'lancamentos' | 'chartOfAccounts' | 'costCenters' | 'suppliers' | 'documents';

type ModalType = 'addSale' | 'addInfluencer' | 'addAgent' | 'processPayout' | 'addLancamento' | 'addAccount' | 'addCostCenter' | 'addSupplier' | 'addTransaction' | 'uploadDocument' | 'viewDocument' | 'reviewPayout' | 'viewExtract' | null;

interface AccountNode {
    id: string;
    code: string;
    name: string;
    type: 'Ativo' | 'Passivo' | 'Receita' | 'Despesa';
    natureza: 'Fixa' | 'Variável';
    defaultCostCenterId?: string;
    isGroup: boolean;
    children?: AccountNode[];
}

interface CostCenter {
    id: string;
    code: string;
    name: string;
    manager: string;
    status: 'Ativo' | 'Inativo';
}

interface Lancamento {
    id: string;
    data: string;
    accountId: string;
    costCenterId: string;
    description: string;
    parceiro: string;
    valorBruto: number;
    valorLiquido: number;
    status: 'Confirmado' | 'Pendente' | 'Estornado';
    type: 'Receita' | 'Despesa';
}

interface BankAccount {
    id: string;
    bankName: string;
    accountNumber: string;
    balance: number;
    currency: 'BRL' | 'USD';
}

interface TreasuryTransaction {
    id: string;
    date: string;
    description: string;
    type: 'Entrada' | 'Saída';
    value: number;
    originAccount: string;
    status: 'Concluído' | 'Pendente';
    method?: 'Pix' | 'Boleto' | 'Cartão' | 'TED';
}

interface GeneralSupplier {
    id: string;
    name: string;
    category: 'Infraestrutura' | 'Marketing' | 'Serviços' | 'Escritório';
    status: 'Ativo' | 'Inativo';
}

interface PayableItem {
    id: string;
    supplierName: string;
    description: string;
    dueDate: string;
    amount: number;
    method: 'Pix' | 'Boleto' | 'Cartão' | 'TED';
    status: 'Aprovado';
    category: string;
}

interface DocumentFile {
    id: string;
    name: string;
    type: string;
    uploadDate: string;
    size: number;
    category: 'Contrato' | 'Nota Fiscal' | 'Recibo' | 'Outro';
    relatedEntity: string;
}

interface Venda {
    id: string;
    data: string;
    userId: string;
    packageType: '8_creditos' | '15_creditos' | '30_creditos';
    valorBruto: number;
    storeFee: number;
    influencerId?: string;
    agentId?: string;
    comissaoInfluencer: number;
    comissaoAgent: number;
    status: 'Aprovado' | 'Pendente' | 'Estornado';
    paymentMethod: 'Credit Card' | 'Pix' | 'In-App Purchase';
}

interface Influencer {
    id: string;
    name: string;
    couponCode: string;
    instagramHandle: string;
    status: 'Ativo' | 'Inativo';
    agentId?: string;
    totalSales: number;
    balanceAvailable: number;
    registrationDate: string;
}

interface Agent {
    id: string;
    name: string;
    email: string;
    influencersCount: number;
    balanceAvailable: number;
    status: 'Ativo' | 'Inativo';
}

interface InfraCost {
    id: string;
    date: string;
    type: 'SMS' | 'WhatsApp' | 'Email';
    provider: 'Twilio' | 'SendGrid' | 'Meta';
    quantity: number;
    unitCost: number;
    totalCostBRL: number;
}

type PayoutStatus = 'Aguardando Nota' | 'Em Análise' | 'Aprovado' | 'Pago' | 'Rejeitado';

interface Payout {
    id: string;
    beneficiaryName: string;
    beneficiaryType: 'Influencer' | 'Agent';
    amount: number;
    status: PayoutStatus;
    dateCreated: string;
    dueDate: string;
    invoiceUrl?: string;
    rejectionReason?: string;
    ticketId?: string;
}

interface CommissionExtractItem {
    id: string;
    date: string;
    originUser: string;
    package: string;
    amount: number;
    percentage: string;
}

interface NavItem {
    id: ScreenId;
    label: string;
    icon: React.ElementType;
    group?: string;
}

// =================================================================================
// 2. DATA GENERATORS & API MAPPING
// =================================================================================

// Helper to generate extract for demo purposes if backend doesn't support it yet
const generateCommissionExtract = (payout: Payout): CommissionExtractItem[] => {
    // Falls back to mock generation if no API endpoint for specific payout detail
    const count = Math.floor(Math.random() * 5) + 3;
    const avgAmount = payout.amount / count;

    return Array.from({ length: count }, (_, i) => ({
        id: `com_${payout.id}_${i}`,
        date: new Date(new Date(payout.dateCreated).getTime() - (i * 86400000)).toISOString(),
        originUser: `user_${Math.floor(Math.random() * 1000)}`,
        package: ['8 Créditos', '15 Créditos', '30 Créditos'][Math.floor(Math.random() * 3)],
        amount: parseFloat((avgAmount + (Math.random() * 2 - 1)).toFixed(2)),
        percentage: payout.beneficiaryType === 'Influencer' ? '20%' : '5%'
    }));
};

// =================================================================================
// 3. UTILITY FUNCTIONS & STYLES (UINK DESIGN SYSTEM V1.0)
// =================================================================================

const formatCurrency = (value: number, currency = 'BRL') =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: currency });

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR');

const getStatusChipClass = (status: string) => {
    const base = "px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 w-fit";
    switch (status) {
        case 'Pago': case 'Concluído': case 'Ativo': case 'Confirmado': case 'Aprovado':
            return `${base} bg-green-500/10 text-green-400 border-green-500/20`;
        case 'Em Análise': case 'Nota Enviada':
            return `${base} bg-blue-500/10 text-blue-400 border-blue-500/20`;
        case 'Aguardando Nota': case 'Pendente':
            return `${base} bg-yellow-500/10 text-yellow-400 border-yellow-500/20`;
        case 'Rejeitado': case 'Estornado': case 'Inativo': case 'Falha': case 'Saída':
            return `${base} bg-red-500/10 text-red-500 border-red-500/20`;
        default: return `${base} bg-zinc-500/10 text-zinc-400 border-zinc-500/20`;
    }
};

// =================================================================================
// 4. COMPONENTS (DESIGN SYSTEM IMPLEMENTATION)
// =================================================================================

const Card: FC<PropsWithChildren<{ className?: string }>> = ({ children, className = '' }) => (
    <div className={`bg-zinc-900 rounded-2xl border border-zinc-800 p-6 transition-all duration-300 hover:border-[#7F00FF]/30 ${className}`}>
        {children}
    </div>
);

const PageHeader: FC<{ title: string; subtitle: string; children?: React.ReactNode }> = ({ title, subtitle, children }) => (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">{title}</h1>
            <p className="text-zinc-400 mt-1 font-normal">{subtitle}</p>
        </div>
        <div className="flex items-center gap-3">{children}</div>
    </div>
);

const Button: FC<PropsWithChildren<{ onClick?: () => void; variant?: 'primary' | 'secondary' | 'danger' | 'ghost'; icon?: React.ElementType; className?: string, disabled?: boolean, type?: 'button' | 'submit' }>> = ({ children, onClick, variant = 'secondary', icon: Icon, className = '', disabled = false, type = 'button' }) => {
    const baseClasses = 'px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';

    const variantClasses = {
        primary: 'bg-gradient-to-r from-[#7F00FF] to-[#FF3366] text-white shadow-[0_0_20px_rgba(127,0,255,0.3)] hover:shadow-[0_0_30px_rgba(255,51,102,0.5)] border-none',
        secondary: 'bg-transparent border border-[#7F00FF] text-white hover:bg-[#7F00FF]/10',
        danger: 'bg-red-500/10 border border-red-500/50 text-red-500 hover:bg-red-500/20',
        ghost: 'bg-transparent text-zinc-400 hover:text-white hover:bg-white/5',
    };

    return (
        <button onClick={onClick} disabled={disabled} type={type} className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
            {Icon && <Icon className="w-5 h-5" />}
            {children}
        </button>
    );
};

const InputGroup: FC<{ label: string, type?: string, placeholder?: string, value?: string, onChange?: (e: any) => void, icon?: React.ElementType }> = ({ label, type = "text", placeholder, value, onChange, icon: Icon }) => (
    <div className="w-full">
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">{label}</label>
        <div className="relative">
            {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl py-3 ${Icon ? 'pl-24' : 'pl-4'} pr-4 focus:outline-none focus:border-[#7F00FF] transition-colors placeholder-zinc-600`}
            />
        </div>
    </div>
);

const SelectGroup: FC<PropsWithChildren<{ label: string, value?: string, onChange?: (e: any) => void }>> = ({ label, children, value, onChange }) => (
    <div className="w-full">
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">{label}</label>
        <div className="relative">
            <select
                value={value}
                onChange={onChange}
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-[#7F00FF] transition-colors appearance-none"
            >
                {children}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
        </div>
    </div>
);

// =================================================================================
// 5. TELAS, FORMULÁRIOS E MODAIS INTEGRADOS
// =================================================================================

const CommissionExtractModal: FC<{ payout: Payout; onClose: () => void }> = ({ payout, onClose }) => {
    const extractItems = useMemo(() => generateCommissionExtract(payout), [payout]);
    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex justify-between items-start bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                <div>
                    <h3 className="text-xl font-bold text-white">{payout.beneficiaryName}</h3>
                    <span className="text-xs text-zinc-400">{payout.beneficiaryType}</span>
                </div>
                <h3 className="text-2xl font-bold text-[#7F00FF]">{formatCurrency(payout.amount)}</h3>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar border border-zinc-800 rounded-xl">
                <table className="w-full text-left">
                    <thead className="bg-zinc-900 sticky top-0 border-b border-zinc-800 text-xs font-bold uppercase text-zinc-500">
                        <tr><th className="p-4">Data</th><th className="p-4">Origem</th><th className="p-4">Pacote</th><th className="p-4 text-right">Comissão</th></tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50 bg-zinc-950">
                        {extractItems.map(item => (
                            <tr key={item.id} className="text-sm">
                                <td className="p-4 text-zinc-400">{formatDate(item.date)}</td>
                                <td className="p-4 text-white">{item.originUser}</td>
                                <td className="p-4 text-zinc-300">{item.package}</td>
                                <td className="p-4 text-right font-bold text-green-400">{formatCurrency(item.amount)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Button variant="primary" onClick={onClose} className="mt-auto">Fechar</Button>
        </div>
    );
};

const ReviewPayoutModal: FC<{ payout: Payout; onClose: () => void; onUpdate: (p: Payout) => void }> = ({ payout, onClose, onUpdate }) => {
    const [reason, setReason] = useState('');
    const handleReject = async () => {
        try {
            await api.cancelPayout(payout.id, reason);
            onUpdate({ ...payout, status: 'Rejeitado', rejectionReason: reason });
            onClose();
        } catch (e) {
            console.error("Erro ao rejeitar payout", e);
        }
    };
    const handleApprove = async () => {
        try {
            // Em tese aprovar seria 'process', mas aqui é só análise
            onUpdate({ ...payout, status: 'Aprovado' });
            onClose();
        } catch (e) {
            console.error("Erro ao aprovar payout", e);
        }
    };

    return (
        <div className="flex flex-col h-full space-y-6">
            <div className="grid grid-cols-2 gap-6 h-full">
                <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-8 flex flex-col items-center justify-center text-center">
                    <FileText className="w-16 h-16 text-zinc-600 mb-4" />
                    <p className="text-white font-bold">{payout.invoiceUrl ? "Nota Fiscal Anexada" : "Nenhuma NF Enviada"}</p>
                    {payout.invoiceUrl && <Button variant="secondary" icon={Download} className="mt-4">Baixar NF</Button>}
                </div>
                <div className="space-y-4">
                    <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                        <p className="text-xs font-bold text-zinc-500 uppercase">Beneficiário</p>
                        <p className="text-lg font-bold text-white">{payout.beneficiaryName}</p>
                    </div>
                    <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                        <p className="text-xs font-bold text-zinc-500 uppercase">Valor</p>
                        <p className="text-2xl font-bold text-green-400">{formatCurrency(payout.amount)}</p>
                    </div>
                    <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Motivo da rejeição..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-white h-32 focus:outline-none focus:border-red-500 resize-none" />
                    <div className="flex gap-4">
                        <Button variant="danger" icon={ThumbsDown} className="flex-1" onClick={handleReject}>Rejeitar</Button>
                        <Button variant="primary" icon={ThumbsUp} className="flex-1" onClick={handleApprove}>Aprovar</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ... Telas Adicionais conforme necessidade (DashboardScreen, VendasScreen, etc.)

const DashboardScreen: FC<{ vendas: Venda[], bankAccounts: BankAccount[], infraCosts: InfraCost[], lancamentos: Lancamento[] }> = ({ vendas, bankAccounts, infraCosts, lancamentos }) => {
    const salesRevenue = vendas.reduce((acc, v) => v.status === 'Aprovado' ? acc + v.valorBruto : acc, 0);
    const infraTotal = infraCosts.reduce((acc, c) => acc + c.totalCostBRL, 0);
    const opExTotal = lancamentos.filter(l => l.type === 'Despesa').reduce((acc, l) => acc + l.valorLiquido, 0);
    const totalBalance = bankAccounts.reduce((acc, b) => acc + (b.currency === 'BRL' ? b.balance : b.balance * 5.50), 0);
    const estimatedProfit = salesRevenue - infraTotal - opExTotal;

    const kpis = [
        { label: 'Receita Vendas', value: formatCurrency(salesRevenue), icon: TrendingUp, color: 'text-green-400' },
        { label: 'Custos Infra', value: formatCurrency(infraTotal), icon: Smartphone, color: 'text-red-400' },
        { label: 'Despesas OpEx', value: formatCurrency(opExTotal), icon: Building2, color: 'text-red-400' },
        { label: 'Caixa Global', value: formatCurrency(totalBalance), icon: Landmark, color: 'text-[#7F00FF]' },
    ];

    return (
        <div className="space-y-6">
            <PageHeader title="Visão Geral" subtitle="Consolidado do ecossistema." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi, idx) => (
                    <Card key={idx} className="hover:bg-zinc-800/50">
                        <div className="flex justify-between items-start">
                            <div><p className="text-xs font-bold text-zinc-500 uppercase">{kpi.label}</p><h3 className="text-2xl font-bold mt-2 text-white">{kpi.value}</h3></div>
                            <div className={`p-3 bg-zinc-950 rounded-xl border border-zinc-800 ${kpi.color}`}><kpi.icon className="w-5 h-5" /></div>
                        </div>
                    </Card>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 flex flex-col items-center justify-center p-12">
                    <p className="text-zinc-500 mb-2">Lucro Líquido Projetado</p>
                    <h2 className={`text-6xl font-black ${estimatedProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>{formatCurrency(estimatedProfit)}</h2>
                </Card>
                <Card>
                    <h3 className="font-bold mb-4">Contas Bancárias</h3>
                    <div className="space-y-3">
                        {bankAccounts.map(b => (
                            <div key={b.id} className="flex justify-between p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                                <span className="text-sm font-bold text-zinc-300">{b.bankName}</span>
                                <span className="font-bold text-white">{b.currency} {b.balance.toLocaleString('pt-BR')}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

const VendasScreen: FC<{ vendas: Venda[] }> = ({ vendas }) => (
    <div className="space-y-6">
        <PageHeader title="Vendas de Créditos" subtitle="Histórico do App."><Button icon={Download} variant="secondary">Exportar</Button></PageHeader>
        <Card className="overflow-hidden p-0">
            <table className="w-full text-left">
                <thead className="bg-zinc-950 border-b border-zinc-800 text-xs font-bold uppercase text-zinc-500">
                    <tr><th className="p-4">Data</th><th className="p-4">Usuário</th><th className="p-4">Pacote</th><th className="p-4 text-right">Valor</th><th className="p-4 text-center">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                    {vendas.slice(0, 20).map(v => (
                        <tr key={v.id} className="text-sm hover:bg-zinc-800/30">
                            <td className="p-4 text-zinc-400">{formatDate(v.data)}</td>
                            <td className="p-4 text-white font-medium">{v.userId}</td>
                            <td className="p-4"><span className="bg-zinc-800 px-2 py-1 rounded text-xs">{v.packageType}</span></td>
                            <td className="p-4 text-right font-bold text-white">{formatCurrency(v.valorBruto)}</td>
                            <td className="p-4 flex justify-center"><span className={getStatusChipClass(v.status)}>{v.status}</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    </div>
);

const InfluencersScreen: FC<{ influencers: Influencer[] }> = ({ influencers }) => (
    <div className="space-y-6">
        <PageHeader title="Influenciadores" subtitle="Gestão de parceiros."><Button icon={Plus} variant="primary">Novo</Button></PageHeader>
        <Card className="overflow-hidden p-0">
            <table className="w-full text-left text-sm">
                <thead className="bg-zinc-950 border-b border-zinc-800 text-xs font-bold text-zinc-500 uppercase">
                    <tr><th className="p-4">Nome</th><th className="p-4">Cupom</th><th className="p-4">Vendas</th><th className="p-4 text-right">Saldo</th><th className="p-4 text-center">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                    {influencers.map(inf => (
                        <tr key={inf.id} className="hover:bg-zinc-800/30">
                            <td className="p-4 font-bold text-white">{inf.name}</td>
                            <td className="p-4 font-mono text-zinc-400">{inf.couponCode}</td>
                            <td className="p-4 text-zinc-300">{inf.totalSales}</td>
                            <td className="p-4 text-right font-bold text-green-400">{formatCurrency(inf.balanceAvailable)}</td>
                            <td className="p-4 flex justify-center"><span className={getStatusChipClass(inf.status)}>{inf.status}</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    </div>
);

const PayoutsScreen: FC<{ payouts: Payout[], onOpenReview: (p: Payout) => void, onViewExtract: (p: Payout) => void, onProcess: (ids: string[]) => void }> = ({ payouts, onOpenReview, onViewExtract, onProcess }) => {
    const [selectedPayouts, setSelectedPayouts] = useState<Set<string>>(new Set());

    const handleSelectOne = (id: string) => {
        const newSet = new Set(selectedPayouts);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedPayouts(newSet);
    }

    return (
        <div className="space-y-6">
            <PageHeader title="Pagamentos & Notas" subtitle="Gestão de comissões.">
                {selectedPayouts.size > 0 && <Button variant="primary" icon={Send} onClick={() => onProcess(Array.from(selectedPayouts))}>Processar {selectedPayouts.size}</Button>}
            </PageHeader>
            <Card className="overflow-hidden p-0">
                <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-900 border-b border-zinc-800 text-xs font-bold text-zinc-500 uppercase">
                        <tr><th className="p-4"></th><th className="p-4">Beneficiário</th><th className="p-4">Tipo</th><th className="p-4">Valor</th><th className="p-4 text-center">Status</th><th className="p-4 text-right">Ação</th></tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                        {payouts.map(p => (
                            <tr key={p.id} className="hover:bg-zinc-800/30">
                                <td className="p-4"><input type="checkbox" checked={selectedPayouts.has(p.id)} onChange={() => handleSelectOne(p.id)} className="rounded bg-zinc-900 border-zinc-700 text-[#7F00FF]" /></td>
                                <td className="p-4 font-bold text-white">{p.beneficiaryName}</td>
                                <td className="p-4 text-zinc-400">{p.beneficiaryType}</td>
                                <td className="p-4"><button onClick={() => onViewExtract(p)} className="text-green-400 font-bold hover:underline">{formatCurrency(p.amount)}</button></td>
                                <td className="p-4 flex justify-center"><span className={getStatusChipClass(p.status)}>{p.status}</span></td>
                                <td className="p-4 text-right">
                                    {p.status === 'Em Análise' ? <Button onClick={() => onOpenReview(p)} className="px-3 py-1 text-xs">Analisar Nota</Button> : <MessageCircle className="w-5 h-5 inline text-zinc-500 cursor-pointer" />}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

// =================================================================================
// MAIN APPLICATION COMPONENT
// =================================================================================

const UinkFinancialDashboard: FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeScreen, setActiveScreen] = useState<ScreenId>('dashboard');
    const [modal, setModal] = useState<ModalType>(null);
    const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Data States
    const [agents, setAgents] = useState<Agent[]>([]);
    const [influencers, setInfluencers] = useState<Influencer[]>([]);
    const [vendas, setVendas] = useState<Venda[]>([]);
    const [infraCosts, setInfraCosts] = useState<InfraCost[]>([]);
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
    const [payouts, setPayouts] = useState<Payout[]>([]);
    const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);

    // Fetch Data on Mount
    // Fetch Data on Mount
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Parallel fetching for performance
                const [
                    agentsData,
                    influencersData,
                    salesResponse,
                    bankData,
                    payoutsData,
                    entriesData,
                    smsStatsResponse,
                    whatsappStatsResponse
                ] = await Promise.all([
                    api.getAgentsFinancial().catch(() => ({ data: [] })),
                    api.getInfluencersFinancial().catch(() => ({ data: [] })),
                    api.getSales().catch(() => ({ sales: { data: [] } })),
                    api.getBankAccounts().catch(() => []),
                    api.getPayouts().catch(() => ({ data: [] })),
                    api.getEntries().catch(() => ({ data: [] })),
                    api.getSmsStats().catch(() => ({ data: { sent_today: 0, cost_today: 0, avg_cost: 0 } })),
                    api.getWhatsAppStats().catch(() => ({ data: { sent_today: 0, cost_today: 0, avg_cost: 0 } }))
                ]);

                // Map API response to Component Structures - Extracting from Pagination/Wrapper
                setAgents(agentsData.data || []);
                setInfluencers(influencersData.data || []);
                setVendas(salesResponse.sales?.data || []);
                setBankAccounts(Array.isArray(bankData) ? bankData : []);
                setPayouts(payoutsData.data || []);
                setLancamentos(entriesData.data || []);

                // Process Real Infra Costs
                const smsStats = smsStatsResponse.data || {};
                const whatsappStats = whatsappStatsResponse.data || {};

                const realInfraCosts: InfraCost[] = [
                    {
                        id: 'sms-today',
                        date: new Date().toISOString(),
                        type: 'SMS',
                        provider: 'Twilio',
                        quantity: smsStats.sent_today || 0,
                        unitCost: smsStats.avg_cost || 0,
                        totalCostBRL: smsStats.cost_today || 0
                    },
                    {
                        id: 'whatsapp-today',
                        date: new Date().toISOString(),
                        type: 'WhatsApp',
                        provider: 'Meta',
                        quantity: whatsappStats.sent_today || 0,
                        unitCost: whatsappStats.avg_cost || 0,
                        totalCostBRL: whatsappStats.cost_today || 0
                    }
                ];
                setInfraCosts(realInfraCosts);

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const navItems: NavItem[] = [
        { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard, group: 'Gestão' },
        { id: 'vendas', label: 'Vendas & Créditos', icon: CreditCard, group: 'Gestão' },
        { id: 'influenciadores', label: 'Influenciadores', icon: Users, group: 'Gestão' },
        { id: 'payouts', label: 'Pagamentos & Notas', icon: Send, group: 'Gestão' },
        { id: 'treasury', label: 'Tesouraria', icon: Landmark, group: 'Financeiro' },
        { id: 'lancamentos', label: 'Contas a Pagar', icon: ArrowRightLeft, group: 'Financeiro' },
        { id: 'cashFlow', label: 'Fluxo de Caixa', icon: Activity, group: 'Financeiro' },
        { id: 'dre', label: 'DRE Gerencial', icon: BarChart3, group: 'Financeiro' },
        { id: 'settings', label: 'Configurações', icon: Settings, group: 'Sistema' },
    ];

    const handleProcessPayouts = async (ids: string[]) => {
        for (const id of ids) {
            try {
                await api.processPayout(id);
                setPayouts(prev => prev.map(p => p.id === id ? { ...p, status: 'Pago' } : p));
            } catch (e) { console.error(e) }
        }
    };

    const renderActiveScreen = () => {
        if (isLoading) return <div className="h-full flex items-center justify-center text-zinc-500"><Loader2 className="w-8 h-8 animate-spin" /></div>;

        switch (activeScreen) {
            case 'dashboard': return <DashboardScreen vendas={vendas} bankAccounts={bankAccounts} infraCosts={infraCosts} lancamentos={lancamentos} />;
            case 'vendas': return <VendasScreen vendas={vendas} />;
            case 'influenciadores': return <InfluencersScreen influencers={influencers} />;
            case 'payouts': return <PayoutsScreen payouts={payouts} onProcess={handleProcessPayouts} onOpenReview={(p) => { setSelectedPayout(p); setModal('reviewPayout'); }} onViewExtract={(p) => { setSelectedPayout(p); setModal('viewExtract'); }} />;
            default: return <div className="text-zinc-500 text-center py-20">Tela {activeScreen} em desenvolvimento.</div>;
        }
    };

    const handleUpdatePayout = (p: Payout) => {
        setPayouts(prev => prev.map(item => item.id === p.id ? p : item));
    };

    return (
        <div className="h-screen flex bg-black text-white selection:bg-[#7F00FF]/30 font-sans">
            {/* Sidebar Reutilizável Integrada */}
            <aside className={`h-full bg-zinc-900 border-r border-zinc-800 transition-all duration-300 ${isSidebarOpen ? 'w-72' : 'w-24'} flex flex-col`}>
                <div className="h-24 flex items-center px-8 flex-shrink-0 animate-fadeIn">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#7F00FF] to-[#FF3366] rounded-xl shadow-[0_0_20px_rgba(127,0,255,0.4)] flex items-center justify-center text-white font-bold text-xl">U</div>
                    {isSidebarOpen && <span className="ml-4 font-black text-2xl tracking-tighter">Uink<span className="text-[#FF3366]">.</span></span>}
                </div>
                <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-8">
                    {['Gestão', 'Financeiro', 'Sistema'].map(group => (
                        <div key={group}>
                            {isSidebarOpen && <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-4 mb-4">{group}</p>}
                            <div className="space-y-1">
                                {navItems.filter(i => i.group === group).map(item => (
                                    <button key={item.id} onClick={() => setActiveScreen(item.id)} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeScreen === item.id ? 'bg-[#7F00FF]/10 text-white' : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'}`}>
                                        <item.icon className={`w-5 h-5 ${activeScreen === item.id ? 'text-[#7F00FF]' : ''}`} />
                                        {isSidebarOpen && <span>{item.label}</span>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                <header className="h-20 bg-black/50 backdrop-blur-xl border-b border-zinc-800 flex items-center justify-between px-8 z-10 sticky top-0">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800"><Menu className="w-6 h-6" /></button>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block"><p className="text-xs font-bold text-white">Financeiro Admin</p><p className="text-[10px] text-[#7F00FF] font-bold uppercase">Uink HQ</p></div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#7F00FF] to-[#FF3366] p-0.5"><div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center font-bold text-sm">FA</div></div>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="max-w-7xl mx-auto">{renderActiveScreen()}</div>
                </main>
            </div>

            {/* Global Modal System */}
            {modal && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-zinc-900 rounded-3xl border border-zinc-800 w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-scaleIn">
                        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50 rounded-t-3xl">
                            <h2 className="text-xl font-bold text-white">{modal === 'reviewPayout' ? 'Análise de Nota Fiscal' : 'Extrato de Comissões'}</h2>
                            <button onClick={() => setModal(null)} className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white"><X className="w-6 h-6" /></button>
                        </div>
                        <div className="p-8 overflow-y-auto flex-1 h-full">
                            {modal === 'reviewPayout' && selectedPayout ? <ReviewPayoutModal payout={selectedPayout} onClose={() => setModal(null)} onUpdate={handleUpdatePayout} /> : modal === 'viewExtract' && selectedPayout ? <CommissionExtractModal payout={selectedPayout} onClose={() => setModal(null)} /> : null}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UinkFinancialDashboard;
