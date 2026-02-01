'use client';

import React, { useState, useEffect, FC } from 'react';
import { Menu, LayoutDashboard, CreditCard, Users, Share2, Send, Landmark, ArrowRightLeft, Activity, BarChart3, Key, Layers, PieChart, Smartphone, Building2, FolderOpen, Settings, Loader2 } from 'lucide-react';
import {
  Modal, Sidebar,
  generateAgents, generateInfluencers, generateVendas, generateInfraCosts, generateBankAccounts,
  generateSuppliers, generatePayables, generateCardRecurrences, generateLancamentos,
  generateTreasuryTransactions, generateDocuments, generatePayouts, generateCostCenters, chartOfAccountsData
} from './Dashboard';
import type { ScreenId, ModalType, PayableItem, DocumentFile, Payout, NavItem } from './Dashboard';
import {
  DashboardScreen, VendasScreen, InfluencersScreen, AgentesScreen, PayoutsScreen,
  TreasuryScreen, LancamentosScreen, ChartOfAccountsScreen, CostCentersScreen,
  SuppliersScreen, DocumentsScreen, CashFlowScreen, DREScreen, UnitEconomicsScreen,
  InfraCostsScreen, SettingsScreen,
  AddTransactionForm, AddLancamentoForm, AddAccountForm, AddCostCenterForm, AddSupplierForm,
  ViewDocumentModal, ReviewPayoutModal, CommissionExtractModal
} from './Screens';
import {
  useFinanceDashboard, useSales, useInfluencersFinancial, useAgentsFinancial,
  usePayouts, useBankAccounts, useEntries, useChartOfAccounts, useCostCenters,
  useSuppliers, useDocuments, useAuth
} from '@/hooks/useFinance';
import api from '@/lib/api';

// Loading component
const LoadingScreen: FC = () => (
  <div className="flex items-center justify-center h-64">
    <Loader2 className="w-8 h-8 animate-spin text-[#7F00FF]" />
    <span className="ml-3 text-zinc-400">Carregando...</span>
  </div>
);

const PsiuuFinancialDashboard: FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeScreen, setActiveScreen] = useState<ScreenId>('dashboard');
  const [modal, setModal] = useState<ModalType>(null);
  const [selectedDoc, setSelectedDoc] = useState<DocumentFile | null>(null);
  const [selectedPayoutReview, setSelectedPayoutReview] = useState<Payout | null>(null);
  const [selectedPayoutExtract, setSelectedPayoutExtract] = useState<Payout | null>(null);
  const [transactionInitialData, setTransactionInitialData] = useState<Partial<PayableItem> | undefined>(undefined);

  // API Data Hooks
  const { data: dashboardData, loading: dashboardLoading } = useFinanceDashboard();
  const { data: salesData, loading: salesLoading } = useSales();
  const { data: influencersData, loading: influencersLoading, refetch: refetchInfluencers } = useInfluencersFinancial();
  const { data: agentsData, loading: agentsLoading, refetch: refetchAgents } = useAgentsFinancial();
  const { data: payoutsData, loading: payoutsLoading, refetch: refetchPayouts } = usePayouts();
  const { data: bankAccountsData, loading: bankAccountsLoading } = useBankAccounts();
  const { data: entriesData, loading: entriesLoading, refetch: refetchEntries } = useEntries();
  const { data: chartOfAccountsApiData, loading: chartLoading, refetch: refetchChartOfAccounts } = useChartOfAccounts();
  const { data: costCentersData, loading: costCentersLoading, refetch: refetchCostCenters } = useCostCenters();
  const { data: suppliersData, loading: suppliersLoading, refetch: refetchSuppliers } = useSuppliers();
  const { data: documentsData, loading: documentsLoading, refetch: refetchDocuments } = useDocuments();

  // Fallback to mock data if API fails or loading
  const agents = agentsData?.data || generateAgents();
  const influencers = influencersData?.data || generateInfluencers(agents);
  const vendas = salesData?.sales?.data || generateVendas(100, influencers);
  const infraCosts = generateInfraCosts(20); // Keep mock for now (no API endpoint)
  const bankAccounts = bankAccountsData?.data || generateBankAccounts();
  const generalSuppliers = suppliersData?.data || generateSuppliers();
  const lancamentos = entriesData?.data || generateLancamentos(15);
  const chartOfAccounts = chartOfAccountsApiData?.data || chartOfAccountsData;
  const documents = documentsData?.data || generateDocuments(12);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const costCenters = costCentersData?.data || generateCostCenters();
  const payables = generatePayables(); // Keep mock (derived from entries)
  const cardRecurrences = generateCardRecurrences(); // Keep mock
  const transactions = generateTreasuryTransactions(10); // Keep mock

  // Update payouts when API data changes
  useEffect(() => {
    if (payoutsData?.data) {
      setPayouts(payoutsData.data);
    } else {
      setPayouts(generatePayouts(influencers, agents));
    }
  }, [payoutsData, influencers, agents]);

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard, group: 'Gestão' },
    { id: 'vendas', label: 'Vendas & Créditos', icon: CreditCard, group: 'Gestão' },
    { id: 'influenciadores', label: 'Influenciadores', icon: Users, group: 'Gestão' },
    { id: 'agentes', label: 'Agentes', icon: Share2, group: 'Gestão' },
    { id: 'payouts', label: 'Pagamentos & Notas', icon: Send, group: 'Gestão' },

    { id: 'treasury', label: 'Tesouraria', icon: Landmark, group: 'Financeiro' },
    { id: 'lancamentos', label: 'Contas a Pagar', icon: ArrowRightLeft, group: 'Financeiro' },
    { id: 'cashFlow', label: 'Fluxo de Caixa', icon: Activity, group: 'Financeiro' },
    { id: 'dre', label: 'DRE Gerencial', icon: BarChart3, group: 'Financeiro' },
    { id: 'chartOfAccounts', label: 'Plano de Contas', icon: Key, group: 'Financeiro' },
    { id: 'costCenters', label: 'Centros de Custo', icon: Layers, group: 'Financeiro' },

    { id: 'unitEconomics', label: 'Unit Economics', icon: PieChart, group: 'Análise' },
    { id: 'custosInfra', label: 'Custos Infra', icon: Smartphone, group: 'Análise' },

    { id: 'suppliers', label: 'Fornecedores', icon: Building2, group: 'Cadastros' },
    { id: 'documents', label: 'Documentos', icon: FolderOpen, group: 'Cadastros' },
    { id: 'settings', label: 'Configurações', icon: Settings, group: 'Sistema' },
  ];

  const handleProcessPayouts = async (ids: string[]) => {
    try {
      for (const id of ids) {
        await api.completePayout(id);
      }
      refetchPayouts();
    } catch (error) {
      console.error('Failed to process payouts:', error);
      // Fallback to local state update
      setPayouts(prev => prev.map(p => ids.includes(p.id) ? { ...p, status: 'Pago' } : p));
    }
  };

  const handleUpdatePayout = async (updatedPayout: Payout) => {
    try {
      if (updatedPayout.status === 'Aprovado') {
        await api.processPayout(updatedPayout.id);
      } else if (updatedPayout.status === 'Rejeitado') {
        await api.cancelPayout(updatedPayout.id, updatedPayout.rejectionReason);
      }
      refetchPayouts();
    } catch (error) {
      console.error('Failed to update payout:', error);
      // Fallback to local state update
      setPayouts(prev => prev.map(p => p.id === updatedPayout.id ? updatedPayout : p));
    }
  };

  const handleViewDocument = (doc: DocumentFile) => {
    setSelectedDoc(doc);
    setModal('viewDocument');
  };

  const handleOpenReview = (payout: Payout) => {
    setSelectedPayoutReview(payout);
    setModal('reviewPayout');
  };

  const handleViewExtract = (payout: Payout) => {
    setSelectedPayoutExtract(payout);
    setModal('viewExtract');
  };

  const handlePayItem = (item: PayableItem) => {
    setTransactionInitialData(item);
    setModal('addTransaction');
  };

  const isLoading = (screen: ScreenId) => {
    switch (screen) {
      case 'dashboard': return dashboardLoading;
      case 'vendas': return salesLoading;
      case 'influenciadores': return influencersLoading;
      case 'agentes': return agentsLoading;
      case 'payouts': return payoutsLoading;
      case 'treasury': return bankAccountsLoading;
      case 'lancamentos': return entriesLoading;
      case 'chartOfAccounts': return chartLoading;
      case 'costCenters': return costCentersLoading;
      case 'suppliers': return suppliersLoading;
      case 'documents': return documentsLoading;
      default: return false;
    }
  };

  const renderActiveScreen = () => {
    if (isLoading(activeScreen)) {
      return <LoadingScreen />;
    }

    switch (activeScreen) {
      case 'dashboard': return <DashboardScreen vendas={vendas} bankAccounts={bankAccounts} infraCosts={infraCosts} lancamentos={lancamentos} />;
      case 'vendas': return <VendasScreen vendas={vendas} influencers={influencers} agents={agents} />;
      case 'influenciadores': return <InfluencersScreen influencers={influencers} agents={agents} />;
      case 'agentes': return <AgentesScreen agents={agents} />;
      case 'payouts': return <PayoutsScreen payouts={payouts} onProcess={handleProcessPayouts} onOpenReview={handleOpenReview} onViewExtract={handleViewExtract} />;
      case 'unitEconomics': return <UnitEconomicsScreen />;
      case 'custosInfra': return <InfraCostsScreen costs={infraCosts} />;
      case 'treasury': return <TreasuryScreen bankAccounts={bankAccounts} transactions={transactions} payables={payables} cardRecurrences={cardRecurrences} onPay={handlePayItem} setModal={setModal} />;
      case 'lancamentos': return <LancamentosScreen lancamentos={lancamentos} setModal={setModal} />;
      case 'chartOfAccounts': return <ChartOfAccountsScreen nodes={chartOfAccounts} setModal={setModal} />;
      case 'costCenters': return <CostCentersScreen costCenters={costCenters} setModal={setModal} />;
      case 'suppliers': return <SuppliersScreen suppliers={generalSuppliers} setModal={setModal} />;
      case 'documents': return <DocumentsScreen documents={documents} onView={handleViewDocument} />;
      case 'settings': return <SettingsScreen />;
      case 'cashFlow': return <CashFlowScreen />;
      case 'dre': return <DREScreen />;
      default: return <div className="p-10 text-center text-zinc-500">Tela em desenvolvimento: {activeScreen}</div>;
    }
  };

  const renderModalContent = () => {
    switch(modal) {
      case 'addTransaction': return <AddTransactionForm onClose={() => setModal(null)} bankAccounts={bankAccounts} costCenters={costCenters} initialData={transactionInitialData} onSuccess={refetchEntries} />;
      case 'addLancamento': return <AddLancamentoForm onClose={() => setModal(null)} suppliers={generalSuppliers} accounts={chartOfAccounts} costCenters={costCenters} onSuccess={refetchEntries} />;
      case 'addAccount': return <AddAccountForm onClose={() => setModal(null)} costCenters={costCenters} onSuccess={refetchChartOfAccounts} />;
      case 'addCostCenter': return <AddCostCenterForm onClose={() => setModal(null)} onSuccess={refetchCostCenters} />;
      case 'addSupplier': return <AddSupplierForm onClose={() => setModal(null)} onSuccess={refetchSuppliers} />;
      case 'viewDocument': return <ViewDocumentModal onClose={() => setModal(null)} doc={selectedDoc} />;
      case 'reviewPayout': return selectedPayoutReview ? <ReviewPayoutModal payout={selectedPayoutReview} onClose={() => setModal(null)} onUpdate={handleUpdatePayout} /> : null;
      case 'viewExtract': return selectedPayoutExtract ? <CommissionExtractModal payout={selectedPayoutExtract} onClose={() => setModal(null)} /> : null;
      default: return <div className="p-4 text-center text-zinc-500">Conteúdo não implementado.</div>;
    }
  };

  const getModalTitle = () => {
    switch(modal) {
      case 'addTransaction': return "Nova Movimentação";
      case 'addLancamento': return "Novo Lançamento";
      case 'addAccount': return "Nova Conta Contábil";
      case 'addCostCenter': return "Novo Centro de Custo";
      case 'addSupplier': return "Novo Fornecedor";
      case 'viewDocument': return "Visualizar Documento";
      case 'reviewPayout': return "Auditoria de Nota Fiscal";
      case 'viewExtract': return "Extrato de Comissões";
      default: return "Novo Registro";
    }
  };

  return (
    <div className="h-screen flex bg-black text-white font-sans">
      <aside className="flex-shrink-0 z-20 shadow-2xl">
        <Sidebar navItems={navItems} activeScreen={activeScreen} setActiveScreen={setActiveScreen} isOpen={isSidebarOpen} />
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 bg-black/50 backdrop-blur-xl border-b border-zinc-800 flex items-center justify-between px-8 flex-shrink-0 z-10 sticky top-0">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"><Menu className="w-6 h-6" /></button>
          <div className="flex items-center gap-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7F00FF] to-[#FF3366] flex items-center justify-center text-white font-bold text-sm shadow-[0_0_15px_rgba(127,0,255,0.4)] border border-white/20">AD</div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8 scroll-smooth custom-scrollbar">
          <div className="max-w-7xl mx-auto pb-10">{renderActiveScreen()}</div>
        </main>
      </div>
      <Modal isOpen={!!modal} onClose={() => setModal(null)} title={getModalTitle()}>
        {renderModalContent()}
      </Modal>
    </div>
  );
};

export default PsiuuFinancialDashboard;
