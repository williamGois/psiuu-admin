'use client';

import React, { useState, useEffect, FC } from 'react';
import { Menu, LayoutDashboard, CreditCard, Users, Share2, Send, Landmark, ArrowRightLeft, Activity, BarChart3, Key, Layers, PieChart, Smartphone, Building2, FolderOpen, Settings, Loader2 } from 'lucide-react';
import {
  Sidebar, Modal,
  generateAgents, generateInfluencers, generateVendas, generateInfraCosts,
  generateBankAccounts, generateSuppliers, generatePayables, generateCardRecurrences,
  generateLancamentos, generateTreasuryTransactions, generateDocuments, generatePayouts,
  generateCostCenters, chartOfAccountsData
} from './Dashboard';
import type { ScreenId, ModalType, Venda, BankAccount, InfraCost, Lancamento, Influencer, Agent, Payout, TreasuryTransaction, PayableItem, DocumentFile, GeneralSupplier, AccountNode, CostCenter } from './Dashboard';
import {
  DashboardScreen, VendasScreen, InfluencersScreen, AgentesScreen, PayoutsScreen,
  TreasuryScreen, LancamentosScreen, ChartOfAccountsScreen, CostCentersScreen,
  SuppliersScreen, DocumentsScreen, CashFlowScreen, DREScreen, UnitEconomicsScreen,
  InfraCostsScreen, SettingsScreen,
  AddSupplierForm, AddCostCenterForm, AddAccountForm, AddTransactionForm, AddLancamentoForm,
  CommissionExtractModal, ReviewPayoutModal, ViewDocumentModal
} from './Screens';

const navItems: { id: ScreenId; label: string; icon: any; group: string }[] = [
  { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard, group: 'Gestão' },
  { id: 'vendas', label: 'Vendas & Créditos', icon: CreditCard, group: 'Gestão' },
  { id: 'influenciadores', label: 'Influenciadores', icon: Users, group: 'Gestão' },
  { id: 'agentes', label: 'Agentes (Squads)', icon: Share2, group: 'Gestão' },
  { id: 'payouts', label: 'Pagamentos (Split)', icon: Send, group: 'Gestão' },

  { id: 'treasury', label: 'Tesouraria', icon: Landmark, group: 'Financeiro' },
  { id: 'lancamentos', label: 'Operacional (OpEx)', icon: ArrowRightLeft, group: 'Financeiro' },
  { id: 'cashFlow', label: 'Fluxo de Caixa', icon: Activity, group: 'Financeiro' },
  { id: 'dre', label: 'DRE Gerencial', icon: BarChart3, group: 'Financeiro' },
  { id: 'chartOfAccounts', label: 'Plano de Contas', icon: Key, group: 'Financeiro' },
  { id: 'costCenters', label: 'Centros de Custo', icon: Layers, group: 'Financeiro' },

  { id: 'unitEconomics', label: 'Unit Economics', icon: PieChart, group: 'Análise' },
  { id: 'custosInfra', label: 'Custos Mensageria', icon: Smartphone, group: 'Análise' },

  { id: 'suppliers', label: 'Fornecedores', icon: Building2, group: 'Cadastros' },
  { id: 'documents', label: 'Documentos (GED)', icon: FolderOpen, group: 'Cadastros' },

  { id: 'settings', label: 'Sistema', icon: Settings, group: 'Configurações' },
];

const LoadingScreen: FC = () => (
  <div className="flex items-center justify-center h-64">
    <Loader2 className="w-8 h-8 animate-spin text-[#7F00FF]" />
    <span className="ml-3 text-zinc-400">Carregando dados...</span>
  </div>
);

const PsiuuFinancialDashboard: FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeScreen, setActiveScreen] = useState<ScreenId>('dashboard');
  const [modal, setModal] = useState<ModalType>(null);
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<DocumentFile | null>(null);
  const [loading, setLoading] = useState(true);

  // Data State
  const [agents, setAgents] = useState<Agent[]>([]);
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [infraCosts, setInfraCosts] = useState<InfraCost[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [suppliers, setSuppliers] = useState<GeneralSupplier[]>([]);
  const [payables, setPayables] = useState<PayableItem[]>([]);
  const [cardRecurrences, setCardRecurrences] = useState<PayableItem[]>([]);
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [transactions, setTransactions] = useState<TreasuryTransaction[]>([]);
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);

  useEffect(() => {
    // Init mock data
    const ag = generateAgents();
    const inf = generateInfluencers(ag);
    setAgents(ag);
    setInfluencers(inf);
    setVendas(generateVendas(100, inf));
    setInfraCosts(generateInfraCosts(30));
    setBankAccounts(generateBankAccounts());
    setSuppliers(generateSuppliers());
    setPayables(generatePayables());
    setCardRecurrences(generateCardRecurrences());
    setLancamentos(generateLancamentos(20));
    setTransactions(generateTreasuryTransactions(50));
    setDocuments(generateDocuments(10));
    setPayouts(generatePayouts(inf, ag));
    setCostCenters(generateCostCenters());
    setLoading(false);
  }, []);

  const handlePayItem = (item: PayableItem) => {
    setModal('addTransaction');
  };

  const handleProcessPayouts = (ids: string[]) => {
    alert(`${ids.length} pagamentos enviados via API para processamento.`);
    setPayouts(payouts.map(p => ids.includes(p.id) ? { ...p, status: 'Pago' } : p));
  };

  const updatePayout = (updated: Payout) => {
    setPayouts(payouts.map(p => p.id === updated.id ? updated : p));
  };

  const renderActiveScreen = () => {
    if (loading) return <LoadingScreen />;
    switch (activeScreen) {
      case 'dashboard': return <DashboardScreen vendas={vendas} bankAccounts={bankAccounts} infraCosts={infraCosts} lancamentos={lancamentos} />;
      case 'vendas': return <VendasScreen vendas={vendas} influencers={influencers} agents={agents} />;
      case 'influenciadores': return <InfluencersScreen influencers={influencers} agents={agents} />;
      case 'agentes': return <AgentesScreen agents={agents} />;
      case 'payouts': return <PayoutsScreen payouts={payouts} onProcess={handleProcessPayouts} onOpenReview={(p) => { setSelectedPayout(p); setModal('reviewPayout'); }} onViewExtract={(p) => { setSelectedPayout(p); setModal('viewExtract'); }} />;
      case 'treasury': return <TreasuryScreen bankAccounts={bankAccounts} transactions={transactions} payables={payables} cardRecurrences={cardRecurrences} onPay={handlePayItem} setModal={setModal} />;
      case 'lancamentos': return <LancamentosScreen lancamentos={lancamentos} setModal={setModal} />;
      case 'chartOfAccounts': return <ChartOfAccountsScreen nodes={chartOfAccountsData} setModal={setModal} />;
      case 'costCenters': return <CostCentersScreen costCenters={costCenters} setModal={setModal} />;
      case 'suppliers': return <SuppliersScreen suppliers={suppliers} setModal={setModal} />;
      case 'documents': return <DocumentsScreen documents={documents} onView={(d) => { setSelectedDoc(d); setModal('viewDocument'); }} />;
      case 'cashFlow': return <CashFlowScreen />;
      case 'dre': return <DREScreen />;
      case 'unitEconomics': return <UnitEconomicsScreen />;
      case 'custosInfra': return <InfraCostsScreen costs={infraCosts} />;
      case 'settings': return <SettingsScreen />;
      default: return <DashboardScreen vendas={vendas} bankAccounts={bankAccounts} infraCosts={infraCosts} lancamentos={lancamentos} />;
    }
  };

  const renderModalContent = () => {
    switch (modal) {
      case 'addSupplier': return <AddSupplierForm onClose={() => setModal(null)} />;
      case 'addCostCenter': return <AddCostCenterForm onClose={() => setModal(null)} />;
      case 'addAccount': return <AddAccountForm onClose={() => setModal(null)} costCenters={costCenters} />;
      case 'addTransaction': return <AddTransactionForm onClose={() => setModal(null)} bankAccounts={bankAccounts} costCenters={costCenters} />;
      case 'addLancamento': return <AddLancamentoForm onClose={() => setModal(null)} suppliers={suppliers} accounts={chartOfAccountsData} costCenters={costCenters} />;
      case 'viewExtract': return selectedPayout ? <CommissionExtractModal payout={selectedPayout} onClose={() => setModal(null)} /> : null;
      case 'reviewPayout': return selectedPayout ? <ReviewPayoutModal payout={selectedPayout} onUpdate={updatePayout} onClose={() => setModal(null)} /> : null;
      case 'viewDocument': return <ViewDocumentModal doc={selectedDoc} onClose={() => setModal(null)} />;
      default: return null;
    }
  };

  const getModalTitle = () => {
    switch (modal) {
      case 'addSupplier': return 'Novo Fornecedor [CAD]';
      case 'addCostCenter': return 'Novo Centro de Custo';
      case 'addAccount': return 'Nova Conta Contábil';
      case 'addTransaction': return 'Efetuar Pagamento / Movimentação';
      case 'addLancamento': return 'Novo Lançamento Operacional';
      case 'viewExtract': return 'Extrato de Comissões';
      case 'reviewPayout': return 'Revisar Payout';
      case 'viewDocument': return 'Visualizar Documento';
      default: return '';
    }
  };

  return (
    <div className="h-screen flex bg-black text-white font-sans selection:bg-[#7F00FF]/30">
      <aside className="flex-shrink-0 z-20 shadow-2xl">
        <Sidebar navItems={navItems} activeScreen={activeScreen} setActiveScreen={setActiveScreen} isOpen={isSidebarOpen} />
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 bg-black/50 backdrop-blur-xl border-b border-zinc-800 flex items-center justify-between px-8 flex-shrink-0 z-10 sticky top-0">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <div className="h-6 w-px bg-zinc-800 hidden md:block"></div>
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-zinc-900 rounded-full border border-zinc-800">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Live System Status</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex flex-col text-right">
              <p className="text-xs font-bold text-white leading-none">Uink Admin</p>
              <p className="text-[10px] text-[#7F00FF] font-medium mt-1 uppercase tracking-tighter">Diretoria Financeira</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#7F00FF] to-[#FF3366] p-0.5 shadow-[0_0_15px_rgba(127,0,255,0.3)]">
              <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center font-bold text-sm">AD</div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 scroll-smooth custom-scrollbar">
          <div className="max-w-7xl mx-auto pb-10">
            {renderActiveScreen()}
          </div>
        </main>
      </div>

      <Modal isOpen={!!modal} onClose={() => setModal(null)} title={getModalTitle()}>
        {renderModalContent()}
      </Modal>
    </div>
  );
};

export default PsiuuFinancialDashboard;
