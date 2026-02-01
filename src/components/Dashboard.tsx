'use client';

import React, { useState, useEffect, useMemo, FC, PropsWithChildren } from 'react';
import {
  AlertCircle, BarChart3, Building2, Calendar, Check, CheckCircle, ChevronDown, ChevronRight,
  CreditCard, DollarSign, Download, Edit, Eye, FileText, Filter, FolderOpen,
  HelpCircle, Key, LayoutDashboard, LogOut, Menu, Moon, MoreVertical,
  Paperclip, Plus, RefreshCw, Search, Send, Settings, Sun, Trash2, TrendingUp, Upload,
  Users, X, Zap, PieChart, Activity, Award, Lock, Unlock, Package, BookOpen, Landmark, ArrowRightLeft, Repeat, Smartphone, Share2, MessageCircle, Layers, ScanBarcode, QrCode, File, Clock, AlertTriangle, ThumbsUp, ThumbsDown, Ticket, List, Wallet
} from 'lucide-react';

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
// 2. MOCK DATA & GENERATORS
// =================================================================================

const PACKAGE_PRICES = { '8_creditos': 14.90, '15_creditos': 24.90, '30_creditos': 39.90 };
const STORE_FEE_PERCENTAGE = 0.15;

const generateCostCenters = (): CostCenter[] => [
    { id: 'cc_1', code: '100', name: 'Administrativo', manager: 'CEO', status: 'Ativo' },
    { id: 'cc_2', code: '200', name: 'Comercial & Marketing', manager: 'CMO', status: 'Ativo' },
    { id: 'cc_3', code: '300', name: 'Tecnologia & Produto', manager: 'CTO', status: 'Ativo' },
    { id: 'cc_4', code: '400', name: 'Infraestrutura', manager: 'DevOps', status: 'Ativo' },
    { id: 'cc_5', code: '500', name: 'Financeiro', manager: 'CFO', status: 'Ativo' },
];

const chartOfAccountsData: AccountNode[] = [
    { id: '1', code: '1', name: 'Ativos', type: 'Ativo', isGroup: true, natureza: 'Variável', children: [
        { id: '1.1', code: '1.1', name: 'Disponível (Caixa/Bancos)', type: 'Ativo', isGroup: false, natureza: 'Variável', defaultCostCenterId: 'cc_5' },
    ]},
    { id: '3', code: '3', name: 'Receitas', type: 'Receita', isGroup: true, natureza: 'Variável', children: [
        { id: '3.1', code: '3.1', name: 'Venda de Créditos (App)', type: 'Receita', isGroup: false, natureza: 'Variável', defaultCostCenterId: 'cc_2' },
    ]},
    { id: '4', code: '4', name: 'Despesas', type: 'Despesa', isGroup: true, natureza: 'Variável', children: [
        { id: '4.1', code: '4.1', name: 'Custo do Serviço Vendido (CSV)', type: 'Despesa', isGroup: true, natureza: 'Variável', children: [
             { id: '4.1.1', code: '4.1.1', name: 'Infraestrutura de Mensageria (SMS/Twilio)', type: 'Despesa', isGroup: false, natureza: 'Variável', defaultCostCenterId: 'cc_4' },
             { id: '4.1.2', code: '4.1.2', name: 'Comissões de Influenciadores', type: 'Despesa', isGroup: false, natureza: 'Variável', defaultCostCenterId: 'cc_2' },
             { id: '4.1.3', code: '4.1.3', name: 'Taxas de Loja (Apple/Google)', type: 'Despesa', isGroup: false, natureza: 'Variável', defaultCostCenterId: 'cc_5' },
        ]},
        { id: '4.2', code: '4.2', name: 'Despesas Operacionais (OpEx)', type: 'Despesa', isGroup: true, natureza: 'Fixa', children: [
             { id: '4.2.1', code: '4.2.1', name: 'Servidores & Cloud (AWS)', type: 'Despesa', isGroup: false, natureza: 'Fixa', defaultCostCenterId: 'cc_3' },
             { id: '4.2.2', code: '4.2.2', name: 'Pessoal & Salários', type: 'Despesa', isGroup: false, natureza: 'Fixa', defaultCostCenterId: 'cc_1' },
             { id: '4.2.3', code: '4.2.3', name: 'Marketing Institucional', type: 'Despesa', isGroup: false, natureza: 'Variável', defaultCostCenterId: 'cc_2' },
        ]}
    ]}
];

const generateBankAccounts = (): BankAccount[] => [
    { id: 'bk_1', bankName: 'Banco Inter PJ', accountNumber: '0001-9', balance: 45200.50, currency: 'BRL' },
    { id: 'bk_2', bankName: 'Silicon Valley Bridge', accountNumber: 'US-8821', balance: 12500.00, currency: 'USD' },
    { id: 'bk_3', bankName: 'Conta Recebimento (Stripe/AppStore)', accountNumber: 'VIRTUAL', balance: 15800.00, currency: 'BRL' },
];

const generateSuppliers = (): GeneralSupplier[] => [
    { id: 'sup_1', name: 'Twilio Inc.', category: 'Infraestrutura', status: 'Ativo' },
    { id: 'sup_2', name: 'Amazon Web Services', category: 'Infraestrutura', status: 'Ativo' },
    { id: 'sup_3', name: 'Google Cloud Platform', category: 'Infraestrutura', status: 'Ativo' },
    { id: 'sup_4', name: 'WeWork Coworking', category: 'Escritório', status: 'Ativo' },
];

const generatePayables = (): PayableItem[] => [
    { id: 'pay_1', supplierName: 'Fornecedor A (TI)', description: 'Suporte Técnico Mensal', dueDate: new Date().toISOString(), amount: 1500.00, method: 'Pix', status: 'Aprovado', category: 'Serviços' },
    { id: 'pay_2', supplierName: 'Limpeza Corp LTDA', description: 'Limpeza Escritório', dueDate: new Date().toISOString(), amount: 800.00, method: 'Boleto', status: 'Aprovado', category: 'Escritório' },
    { id: 'pay_3', supplierName: 'Agência Marketing X', description: 'Gestão de Tráfego', dueDate: new Date(new Date().getTime() + 86400000).toISOString(), amount: 3200.00, method: 'Pix', status: 'Aprovado', category: 'Marketing' },
];

const generateCardRecurrences = (): PayableItem[] => [
    { id: 'card_1', supplierName: 'Amazon Web Services', description: 'Cloud Infrastructure', dueDate: 'Todo dia 05', amount: 1250.00, method: 'Cartão', status: 'Aprovado', category: 'Infraestrutura' },
    { id: 'card_2', supplierName: 'Twilio Inc.', description: 'Recarga SMS Auto', dueDate: 'Gatilho Saldo', amount: 500.00, method: 'Cartão', status: 'Aprovado', category: 'Infraestrutura' },
    { id: 'card_3', supplierName: 'Adobe Creative Cloud', description: 'Licenças Design', dueDate: 'Todo dia 15', amount: 350.00, method: 'Cartão', status: 'Aprovado', category: 'Marketing' },
];

const generateLancamentos = (count: number): Lancamento[] => {
    return Array.from({ length: count }, (_, i) => {
        const isDespesa = Math.random() > 0.3;
        const valor = Math.random() * 2000 + 500;
        return {
            id: `lanc_${i}`,
            data: new Date(2025, 4, Math.floor(Math.random() * 30)).toISOString(),
            accountId: isDespesa ? '4.2.1' : '3.1',
            costCenterId: 'cc_3',
            description: isDespesa ? 'Pagamento AWS Mensal' : 'Aporte de Capital',
            parceiro: isDespesa ? 'Amazon Web Services' : 'Investidor Anjo',
            valorBruto: valor,
            valorLiquido: valor,
            status: 'Confirmado',
            type: isDespesa ? 'Despesa' : 'Receita',
        };
    });
};

const generateTreasuryTransactions = (count: number): TreasuryTransaction[] =>
    Array.from({ length: count }, (_, i) => ({
        id: `tr_${i}`,
        date: new Date(2025, 4, i + 1).toISOString(),
        description: ['Resgate Aplicação', 'Pagamento Fatura Cartão Corp', 'Transferência Influencer', 'Recebimento Apple'][i % 4],
        type: i % 2 === 0 ? 'Saída' : 'Entrada',
        value: Math.random() * 5000 + 100,
        originAccount: 'Banco Inter PJ',
        status: 'Concluído',
        method: (['Pix', 'Boleto', 'Cartão', 'TED'] as const)[i % 4]
    }));

const generateAgents = (): Agent[] => [
    { id: 'ag_1', name: 'Roberto Sales', email: 'roberto@psiuu.app', influencersCount: 12, balanceAvailable: 1250.00, status: 'Ativo' },
    { id: 'ag_2', name: 'Carla Marketing', email: 'carla@psiuu.app', influencersCount: 8, balanceAvailable: 890.50, status: 'Ativo' },
];

const generateInfluencers = (agents: Agent[]): Influencer[] => Array.from({ length: 15 }, (_, i) => ({
    id: `inf_${i}`,
    name: ['Ana Fit', 'João Gamer', 'Bia Lifestyle', 'Lucas Tech', 'Mari Makeup'][i % 5],
    couponCode: `PSIUU${i+10}`,
    instagramHandle: `@influencer_${i}`,
    status: i % 10 === 0 ? 'Inativo' : 'Ativo',
    agentId: agents[i % agents.length].id,
    totalSales: Math.floor(Math.random() * 5000) + 1000,
    balanceAvailable: parseFloat((Math.random() * 1000).toFixed(2)),
    registrationDate: new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString(),
}));

const generateVendas = (count: number, influencers: Influencer[]): Venda[] => Array.from({ length: count }, (_, i) => {
    const pkgType = (['8_creditos', '15_creditos', '30_creditos'] as const)[Math.floor(Math.random() * 3)];
    const price = PACKAGE_PRICES[pkgType];
    const hasInfluencer = Math.random() > 0.3;
    const influencer = hasInfluencer ? influencers[Math.floor(Math.random() * influencers.length)] : undefined;
    const date = new Date(2025, 4, Math.floor(Math.random() * 30));
    date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

    return {
        id: `venda_${i}`,
        data: date.toISOString(),
        userId: `user_${Math.floor(Math.random() * 1000)}`,
        packageType: pkgType,
        valorBruto: price,
        storeFee: price * STORE_FEE_PERCENTAGE,
        influencerId: influencer?.id,
        agentId: influencer?.agentId,
        comissaoInfluencer: hasInfluencer ? parseFloat((price * 0.20).toFixed(2)) : 0,
        comissaoAgent: hasInfluencer ? parseFloat((price * 0.05).toFixed(2)) : 0,
        status: Math.random() > 0.05 ? 'Aprovado' : 'Estornado',
        paymentMethod: 'In-App Purchase'
    };
});

const generateInfraCosts = (count: number): InfraCost[] => Array.from({ length: count }, (_, i) => ({
    id: `cost_${i}`,
    date: new Date(2025, 4, i + 1).toISOString(),
    type: (['SMS', 'WhatsApp', 'Email'] as const)[i % 3],
    provider: 'Twilio',
    quantity: Math.floor(Math.random() * 5000) + 100,
    unitCost: 0.06,
    totalCostBRL: (Math.floor(Math.random() * 5000) + 100) * 0.06 * 5.50
}));

const generateDocuments = (count: number): DocumentFile[] => Array.from({length: count}, (_, i) => ({
    id: `doc_${i}`,
    name: `Doc_${['Contrato', 'NF', 'Recibo'][i % 3]}_${202500 + i}.pdf`,
    type: 'application/pdf',
    uploadDate: new Date(2025, 4, Math.floor(Math.random() * 30) + 1).toISOString(),
    size: 1024 * (Math.random() * 2000 + 100),
    category: (['Contrato', 'Nota Fiscal', 'Recibo', 'Outro'] as const)[i % 4],
    relatedEntity: ['Amazon AWS', 'Twilio Inc.', 'João Silva', 'Ana Fit', 'Roberto Sales'][Math.floor(Math.random() * 5)]
}));

const generatePayouts = (influencers: Influencer[], agents: Agent[]): Payout[] => {
    const payouts: Payout[] = [];
    const statuses: PayoutStatus[] = ['Aguardando Nota', 'Em Análise', 'Aprovado', 'Pago', 'Rejeitado'];
    const now = new Date();

    influencers.forEach((inf, i) => {
        if(inf.balanceAvailable > 50) {
            const status = statuses[i % statuses.length];
            const dueDate = new Date(now);
            dueDate.setDate(dueDate.getDate() + 5);

            payouts.push({
                id: `pay_inf_${inf.id}`,
                beneficiaryName: inf.name,
                beneficiaryType: 'Influencer',
                amount: inf.balanceAvailable,
                status: status,
                dateCreated: new Date().toISOString(),
                dueDate: dueDate.toISOString(),
                invoiceUrl: status !== 'Aguardando Nota' ? 'fake_url.pdf' : undefined,
                rejectionReason: status === 'Rejeitado' ? 'CNPJ divergente do cadastro.' : undefined
            });
        }
    });
    agents.forEach((ag, i) => {
         if(ag.balanceAvailable > 50) {
            const status = statuses[(i + 2) % statuses.length];
            const dueDate = new Date(now);
            dueDate.setDate(dueDate.getDate() + 3);

             payouts.push({
                id: `pay_ag_${ag.id}`,
                beneficiaryName: ag.name,
                beneficiaryType: 'Agent',
                amount: ag.balanceAvailable,
                status: status,
                dateCreated: new Date().toISOString(),
                dueDate: dueDate.toISOString(),
                invoiceUrl: status !== 'Aguardando Nota' ? 'fake_url.pdf' : undefined
            });
        }
    });
    return payouts;
}

const generateCommissionExtract = (payout: Payout): CommissionExtractItem[] => {
    const count = Math.floor(Math.random() * 10) + 3;
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
// 3. UTILITY FUNCTIONS & STYLES
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
// 4. BASE COMPONENTS
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

const InputGroup: FC<{ label: string, type?: string, placeholder?: string, value?: string, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void, icon?: React.ElementType }> = ({ label, type = "text", placeholder, value, onChange, icon: Icon }) => (
    <div className="w-full">
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">{label}</label>
        <div className="relative">
            {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl py-3 ${Icon ? 'pl-12' : 'pl-4'} pr-4 focus:outline-none focus:border-[#7F00FF] transition-colors placeholder-zinc-600`}
            />
        </div>
    </div>
);

const SelectGroup: FC<PropsWithChildren<{ label: string, value?: string, onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void }>> = ({ label, children, value, onChange }) => (
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

const Modal: FC<PropsWithChildren<{ isOpen: boolean; onClose: () => void; title: string; }>> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-scaleIn border border-zinc-800 ring-1 ring-white/5">
                <header className="flex items-center justify-between p-6 border-b border-zinc-800">
                    <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                </header>
                <div className="p-8 overflow-y-auto custom-scrollbar h-full">{children}</div>
            </div>
        </div>
    );
};

const Sidebar: FC<{ navItems: NavItem[]; activeScreen: ScreenId; setActiveScreen: (id: ScreenId) => void; isOpen: boolean }> = ({ navItems, activeScreen, setActiveScreen, isOpen }) => {
    const groupedItems = navItems.reduce((acc, item) => {
        const group = item.group || 'Outros';
        if (!acc[group]) acc[group] = [];
        acc[group].push(item);
        return acc;
    }, {} as Record<string, NavItem[]>);

    return (
        <div className={`h-full flex flex-col bg-zinc-900 border-r border-zinc-800 transition-all duration-300 ${isOpen ? 'w-72' : 'w-24'}`}>
            <div className={`flex items-center ${isOpen ? 'justify-start pl-8' : 'justify-center'} h-24 border-b border-zinc-800 flex-shrink-0`}>
                <div className={`flex items-center gap-3`}>
                    <div className="w-10 h-10 bg-gradient-to-br from-[#7F00FF] to-[#FF3366] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-[0_0_20px_rgba(127,0,255,0.4)]">U</div>
                    {isOpen && <span className="font-bold text-2xl text-white tracking-tight">Psiuu<span className="text-[#FF3366]">.</span></span>}
                </div>
            </div>
            <nav className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                {Object.entries(groupedItems).map(([group, items]) => (
                    <div key={group} className="mb-8">
                        {isOpen && <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-4 px-3">{group}</h3>}
                        <div className="space-y-1">
                            {items.map(item => {
                                const isActive = activeScreen === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveScreen(item.id)}
                                        title={item.label}
                                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden ${isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'} ${!isOpen && 'justify-center px-0'}`}
                                    >
                                        {isActive && <div className="absolute inset-0 bg-gradient-to-r from-[#7F00FF]/20 to-transparent border-l-2 border-[#7F00FF]"></div>}
                                        <item.icon className={`w-5 h-5 flex-shrink-0 relative z-10 transition-colors ${isActive ? 'text-[#7F00FF]' : 'group-hover:text-white'}`} />
                                        {isOpen && <span className="relative z-10">{item.label}</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>
        </div>
    );
};

// Continuação no próximo arquivo...
// Este arquivo será dividido para facilitar manutenção

export { Card, PageHeader, Button, InputGroup, SelectGroup, Modal, Sidebar, formatCurrency, formatDate, getStatusChipClass };
export { generateAgents, generateInfluencers, generateVendas, generateInfraCosts, generateBankAccounts, generateSuppliers, generatePayables, generateCardRecurrences, generateLancamentos, generateTreasuryTransactions, generateDocuments, generatePayouts, generateCostCenters, generateCommissionExtract, chartOfAccountsData };
export type { ScreenId, ModalType, AccountNode, CostCenter, Lancamento, BankAccount, TreasuryTransaction, GeneralSupplier, PayableItem, DocumentFile, Venda, Influencer, Agent, InfraCost, Payout, PayoutStatus, CommissionExtractItem, NavItem };
