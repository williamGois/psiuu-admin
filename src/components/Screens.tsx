'use client';

import React, { useState, useMemo, FC } from 'react';
import {
    Download, Edit, Eye, FileText, Filter, Plus, Search, Send, TrendingUp,
    Upload, Zap, PieChart, Landmark, Smartphone, Building2, Layers, File, Clock, CheckCircle, CreditCard,
    ThumbsUp, ThumbsDown, Ticket, List, MessageCircle, AlertTriangle, Loader2,
} from 'lucide-react';
import {
    Card, PageHeader, Button, InputGroup, SelectGroup, formatCurrency, formatDate, getStatusChipClass,
    generateCommissionExtract
} from './Dashboard';
import type {
    ScreenId, ModalType, AccountNode, CostCenter, Lancamento, BankAccount,
    TreasuryTransaction, GeneralSupplier, PayableItem, DocumentFile, Venda,
    Influencer, Agent, InfraCost, Payout, CommissionExtractItem
} from './Dashboard';
import api from '@/lib/api';

// =================================================================================
// FORMS - INTEGRADOS COM API
// =================================================================================

export const AddSupplierForm: FC<{ onClose: () => void; onSuccess?: () => void }> = ({ onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [personType, setPersonType] = useState<'PF' | 'PJ'>('PJ');

    return (
        <form className="space-y-6">
            <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Tipo de Pessoa</label>
                <div className="flex gap-4 mt-3">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="radio"
                            name="personType"
                            className="appearance-none w-4 h-4 rounded-full border border-zinc-600 bg-zinc-900 checked:bg-[#7F00FF] checked:border-[#7F00FF] focus:ring-offset-0 focus:ring-2 focus:ring-[#7F00FF]/50 transition-all cursor-pointer"
                            checked={personType === 'PJ'}
                            onChange={() => setPersonType('PJ')}
                        />
                        <span className={`text-sm font-medium transition-colors ${personType === 'PJ' ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>Pessoa Jurídica</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="radio"
                            name="personType"
                            className="appearance-none w-4 h-4 rounded-full border border-zinc-600 bg-zinc-900 checked:bg-[#7F00FF] checked:border-[#7F00FF] focus:ring-offset-0 focus:ring-2 focus:ring-[#7F00FF]/50 transition-all cursor-pointer"
                            checked={personType === 'PF'}
                            onChange={() => setPersonType('PF')}
                        />
                        <span className={`text-sm font-medium transition-colors ${personType === 'PF' ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>Pessoa Física</span>
                    </label>
                </div>
            </div>

            <div className="p-5 bg-zinc-950 rounded-xl border border-zinc-800 animate-fadeIn">
                <h4 className="text-xs font-bold text-[#7F00FF] uppercase mb-4 flex items-center gap-2">
                    <Building2 className="w-4 h-4" /> Dados Principais
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <InputGroup
                        label={personType === 'PJ' ? "CNPJ" : "CPF"}
                        placeholder={personType === 'PJ' ? "00.000.000/0000-00" : "000.000.000-00"}
                    />
                    <InputGroup label="Ramo de Atividade / Serviços" placeholder="Ex: Consultoria de TI, Limpeza..." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <InputGroup
                        label={personType === 'PJ' ? "Razão Social" : "Nome Completo"}
                        placeholder={personType === 'PJ' ? "Empresa LTDA" : "João da Silva"}
                    />
                    <InputGroup
                        label={personType === 'PJ' ? "Nome Fantasia" : "Nome Comercial / Apelido"}
                        placeholder={personType === 'PJ' ? "Nome de Mercado" : "João Tech"}
                    />
                </div>
            </div>

            <div className="p-5 bg-zinc-950 rounded-xl border border-zinc-800">
                <h4 className="text-xs font-bold text-[#FF3366] uppercase mb-4 flex items-center gap-2">
                    <Smartphone className="w-4 h-4" /> Contato e Endereço
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <InputGroup label="Email Corporativo" type="email" placeholder="financeiro@empresa.com" />
                    <InputGroup label="Telefone / WhatsApp" type="tel" placeholder="(00) 00000-0000" />
                </div>
                <InputGroup label="Endereço Completo" placeholder="Logradouro, Número, Bairro, Cidade - UF" />
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-zinc-800 mt-6">
                <Button variant="ghost" onClick={onClose} type="button">Cancelar</Button>
                <Button variant="primary" type="button">Salvar Fornecedor</Button>
            </div>
        </form>
    );
};

export const AddCostCenterForm: FC<{ onClose: () => void; onSuccess?: () => void }> = ({ onClose, onSuccess }) => {
    return (
        <form className="space-y-6">
            <InputGroup label="Código" placeholder="Ex: 200" />
            <InputGroup label="Nome do Centro de Custo" placeholder="Ex: Marketing Digital" />
            <InputGroup label="Responsável / Gerente" placeholder="Ex: Diretor de Marketing" />
            <SelectGroup label="Status">
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
            </SelectGroup>

            <div className="flex justify-end gap-3 pt-6 border-t border-zinc-800 mt-6">
                <Button variant="ghost" onClick={onClose} type="button">Cancelar</Button>
                <Button variant="primary" type="button">Salvar Centro</Button>
            </div>
        </form>
    );
};

export const AddAccountForm: FC<{ onClose: () => void; costCenters: CostCenter[]; onSuccess?: () => void }> = ({ onClose, costCenters, onSuccess }) => {
    return (
        <form className="space-y-6">
            <InputGroup label="Código da Conta" placeholder="Ex: 1.1.1.05" />
            <InputGroup label="Nome da Conta" placeholder="Ex: Banco Santander" />
            <div className="grid grid-cols-2 gap-4">
                <SelectGroup label="Tipo">
                    <option value="ativo">Ativo</option>
                    <option value="passivo">Passivo</option>
                    <option value="receita">Receita</option>
                    <option value="despesa">Despesa</option>
                </SelectGroup>
                <SelectGroup label="Natureza">
                    <option value="fixa">Fixa</option>
                    <option value="variavel">Variável</option>
                </SelectGroup>
            </div>
            <div>
                <SelectGroup label="Centro de Custo Padrão">
                    <option value="">Selecione um centro de custo...</option>
                    {costCenters.map(cc => (
                        <option key={cc.id} value={cc.id}>{cc.name} ({cc.code})</option>
                    ))}
                </SelectGroup>
                <p className="text-xs text-zinc-500 mt-2 ml-1">Lançamentos nesta conta virão pré-preenchidos com este centro.</p>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-zinc-800 mt-6">
                <Button variant="ghost" onClick={onClose} type="button">Cancelar</Button>
                <Button variant="primary" type="button">Salvar Conta</Button>
            </div>
        </form>
    );
};

export const AddTransactionForm: FC<{
    onClose: () => void;
    bankAccounts: BankAccount[];
    costCenters: CostCenter[];
    initialData?: Partial<PayableItem>;
    onSuccess?: () => void;
}> = ({ onClose, bankAccounts, costCenters, initialData, onSuccess }) => {
    const [method, setMethod] = useState(initialData?.method || 'Pix');
    const [type, setType] = useState('saida');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState(initialData ? `${initialData.description} - ${initialData.supplierName}` : '');
    const [amount, setAmount] = useState(initialData?.amount ? initialData.amount.toFixed(2) : '');

    return (
        <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <SelectGroup label="Tipo de Movimentação" value={type} onChange={(e: any) => setType(e.target.value)}>
                    <option value="saida">Saída (Pagamento)</option>
                    <option value="entrada">Entrada (Recebimento)</option>
                    <option value="transferencia">Transferência</option>
                </SelectGroup>
                <InputGroup
                    label="Data da Transação"
                    type="date"
                    value={date}
                    onChange={(e: any) => setDate(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <SelectGroup label="Conta Bancária">
                    <option value="">Selecione a conta...</option>
                    {bankAccounts.map(acc => (
                        <option key={acc.id} value={acc.id}>{acc.bankName} - {acc.currency}</option>
                    ))}
                </SelectGroup>
                <SelectGroup label="Método" value={method} onChange={(e: any) => setMethod(e.target.value)}>
                    <option value="Pix">Pix</option>
                    <option value="Boleto">Boleto</option>
                    <option value="TED">TED</option>
                    <option value="Cartão">Cartão</option>
                    <option value="Interno">Interno</option>
                </SelectGroup>
            </div>

            {method === 'Pix' && (
                <div className="p-4 bg-[#7F00FF]/10 rounded-xl border border-[#7F00FF]/30 animate-fadeIn">
                    <label className="text-xs font-bold text-[#7F00FF] mb-3 uppercase flex items-center gap-2">
                        <Zap className="w-4 h-4" /> Chave Pix do Recebedor
                    </label>
                    <div className="flex gap-3">
                        <div className="w-1/3">
                            <select className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#7F00FF]">
                                <option>CNPJ/CPF</option>
                                <option>Email</option>
                                <option>Celular</option>
                                <option>Aleatória</option>
                            </select>
                        </div>
                        <input type="text" placeholder="Insira a chave pix..." className="flex-1 bg-zinc-900 border border-zinc-700 text-white rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#7F00FF]" />
                    </div>
                </div>
            )}

            <InputGroup
                label="Descrição"
                placeholder="Ex: Pagamento Fornecedor XYZ"
                value={description}
                onChange={(e: any) => setDescription(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4">
                <InputGroup
                    label="Valor (R$)"
                    type="number"
                    placeholder="0,00"
                    value={amount}
                    onChange={(e: any) => setAmount(e.target.value)}
                />
                <SelectGroup label="Centro de Custo">
                    <option value="">Selecione...</option>
                    {costCenters.map(cc => <option key={cc.id} value={cc.id}>{cc.name}</option>)}
                </SelectGroup>
            </div>

            <div className="flex items-center gap-3 mt-2">
                <input type="checkbox" id="conciliado" className="w-5 h-5 rounded border-zinc-700 bg-zinc-900 text-[#7F00FF] focus:ring-[#7F00FF] focus:ring-offset-zinc-900" defaultChecked={!!initialData} />
                <label htmlFor="conciliado" className="text-sm text-zinc-400">Marcar como conciliado (Pago)</label>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-zinc-800 mt-6">
                <Button variant="ghost" onClick={onClose} type="button">Cancelar</Button>
                <Button variant="primary" type="button">Confirmar Pagamento</Button>
            </div>
        </form>
    );
};

export const AddLancamentoForm: FC<{
    onClose: () => void;
    suppliers: GeneralSupplier[];
    accounts: AccountNode[];
    costCenters: CostCenter[];
    onSuccess?: () => void;
}> = ({ onClose, suppliers, accounts, costCenters, onSuccess }) => {
    const flatAccounts: AccountNode[] = [];
    const traverse = (nodes: AccountNode[]) => {
        nodes.forEach(node => {
            flatAccounts.push(node);
            if (node.children) traverse(node.children);
        });
    };
    traverse(accounts);

    const [isRecurring, setIsRecurring] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('Boleto');

    return (
        <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Tipo de Lançamento</label>
                    <div className="flex gap-4 mt-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="tipo" className="text-[#FF3366] focus:ring-[#FF3366] bg-zinc-900 border-zinc-700" defaultChecked />
                            <span className="text-sm text-white">Despesa</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="tipo" className="text-green-500 focus:ring-green-500 bg-zinc-900 border-zinc-700" />
                            <span className="text-sm text-white">Receita</span>
                        </label>
                    </div>
                </div>
                <SelectGroup label="Parceiro">
                    <option value="">Selecione...</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name} ({s.category})</option>)}
                </SelectGroup>
            </div>

            <InputGroup label="Descrição Detalhada" placeholder="Ex: Renovação Anual Servidores AWS" />

            <div className="p-5 bg-zinc-950 rounded-xl border border-zinc-800">
                <h4 className="text-xs font-bold text-[#7F00FF] uppercase mb-4 flex items-center gap-2"><DollarSign className="w-3 h-3" /> Detalhamento</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1">Valor Bruto</label>
                        <input type="number" className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-white text-sm" placeholder="0,00" />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1">(-) Descontos</label>
                        <input type="number" className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-red-400 text-sm" placeholder="0,00" />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1">(+) Juros</label>
                        <input type="number" className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-white text-sm" placeholder="0,00" />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase font-bold text-white mb-1">(=) Líquido</label>
                        <input type="number" readOnly className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-white font-bold text-sm" placeholder="0,00" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="Competência" type="date" />
                    <InputGroup label="Vencimento" type="date" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <SelectGroup label="Conta Contábil">
                        <option value="">Selecione...</option>
                        {flatAccounts.map(acc => (
                            <option key={acc.id} value={acc.id} disabled={acc.isGroup} className={acc.isGroup ? 'font-bold bg-zinc-800 text-zinc-300' : ''}>
                                {acc.code} - {acc.name}
                            </option>
                        ))}
                    </SelectGroup>
                    <SelectGroup label="Centro de Custo">
                        <option value="">Selecione...</option>
                        {costCenters.map(cc => <option key={cc.id} value={cc.id}>{cc.name}</option>)}
                    </SelectGroup>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div>
                    <SelectGroup label="Forma de Pagamento" value={paymentMethod} onChange={(e: any) => setPaymentMethod(e.target.value)}>
                        <option value="Boleto">Boleto Bancário</option>
                        <option value="Pix">Pix</option>
                        <option value="Cartao">Cartão de Crédito</option>
                        <option value="TED">Transferência (TED/DOC)</option>
                    </SelectGroup>
                </div>

                <div className={`p-4 rounded-xl border transition-colors ${isRecurring ? 'bg-zinc-900 border-[#7F00FF]/50' : 'bg-zinc-900/50 border-zinc-800'}`}>
                    <label className="flex items-center gap-2 cursor-pointer mb-3">
                        <input
                            type="checkbox"
                            checked={isRecurring}
                            onChange={(e) => setIsRecurring(e.target.checked)}
                            className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-[#7F00FF] focus:ring-[#7F00FF]"
                        />
                        <span className={`text-sm font-bold ${isRecurring ? 'text-white' : 'text-zinc-400'}`}>Pagamento Recorrente</span>
                    </label>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-zinc-800 mt-6">
                <Button variant="ghost" onClick={onClose} type="button">Cancelar</Button>
                <Button variant="primary" type="button">Salvar</Button>
            </div>
        </form>
    );
};

export const ViewDocumentModal: FC<{ onClose: () => void, doc: DocumentFile | null }> = ({ onClose, doc }) => {
    if (!doc) return null;
    return (
        <div className="space-y-6">
            <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 flex items-center gap-4">
                <div className="p-4 bg-[#7F00FF]/10 rounded-full"><FileText className="w-8 h-8 text-[#7F00FF]" /></div>
                <div>
                    <h3 className="text-lg font-bold text-white">{doc.name}</h3>
                    <p className="text-zinc-500 text-sm">{(doc.size / 1024).toFixed(0)} KB • {doc.category}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800">
                    <span className="block text-xs text-zinc-500 uppercase font-bold">Data Upload</span>
                    <span className="text-white">{formatDate(doc.uploadDate)}</span>
                </div>
                <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800">
                    <span className="block text-xs text-zinc-500 uppercase font-bold">Entidade Relacionada</span>
                    <span className="text-white">{doc.relatedEntity}</span>
                </div>
            </div>

            <div className="h-48 bg-zinc-900 rounded-lg border border-zinc-800 border-dashed flex items-center justify-center">
                <p className="text-zinc-500 text-sm">Pré-visualização não disponível.</p>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-zinc-800">
                <Button variant="ghost" onClick={onClose}>Fechar</Button>
                <Button variant="primary" icon={Download}>Baixar Arquivo</Button>
            </div>
        </div>
    )
}

export const CommissionExtractModal: FC<{ payout: Payout; onClose: () => void }> = ({ payout, onClose }) => {
    const extractItems = useMemo(() => generateCommissionExtract(payout), [payout]);

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex justify-between items-start bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                <div>
                    <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Beneficiário</p>
                    <h3 className="text-xl font-bold text-white">{payout.beneficiaryName}</h3>
                    <span className="text-xs text-zinc-400">{payout.beneficiaryType}</span>
                </div>
                <div className="text-right">
                    <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Total</p>
                    <h3 className="text-2xl font-bold text-[#7F00FF]">{formatCurrency(payout.amount)}</h3>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar border border-zinc-800 rounded-xl">
                <table className="w-full">
                    <thead className="sticky top-0 bg-zinc-900 border-b border-zinc-800">
                        <tr className="text-left text-xs font-bold uppercase tracking-wider text-zinc-500">
                            <th className="p-4">Data</th>
                            <th className="p-4">Origem</th>
                            <th className="p-4">Pacote</th>
                            <th className="p-4 text-right">Comissão</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50 bg-zinc-950">
                        {extractItems.map(item => (
                            <tr key={item.id} className="hover:bg-zinc-900/50 transition-colors">
                                <td className="p-4 text-sm text-zinc-400">{formatDate(item.date)}</td>
                                <td className="p-4 text-sm text-white">{item.originUser}</td>
                                <td className="p-4 text-sm"><span className="bg-zinc-800 px-2 py-1 rounded text-xs text-zinc-300">{item.package}</span></td>
                                <td className="p-4 text-sm text-right font-bold text-green-400">{formatCurrency(item.amount)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
                <p className="text-xs text-zinc-500">*Valores com arredondamentos.</p>
                <Button variant="primary" onClick={onClose}>Fechar</Button>
            </div>
        </div>
    );
};

export const ReviewPayoutModal: FC<{ payout: Payout; onClose: () => void; onUpdate: (p: Payout) => void }> = ({ payout, onClose, onUpdate }) => {
    const [reason, setReason] = useState('');

    const handleApprove = () => { onUpdate({ ...payout, status: 'Aprovado' }); onClose(); };
    const handleReject = () => {
        if (!reason) return alert("Motivo necessário.");
        onUpdate({ ...payout, status: 'Rejeitado', rejectionReason: reason });
        onClose();
    };

    return (
        <div className="flex flex-col h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-4 flex flex-col justify-center items-center text-center relative overflow-hidden group">
                    <FileText className="w-16 h-16 text-zinc-600 mb-4" />
                    <h4 className="text-white font-bold text-lg">{payout.invoiceUrl || "Nenhum arquivo"}</h4>
                    <p className="text-zinc-500 text-sm mb-6">Pré-visualização</p>
                    <Button variant="secondary" icon={Download}>Baixar Nota Fiscal</Button>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="space-y-4">
                        <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                            <label className="block text-xs font-bold text-zinc-500 uppercase">Beneficiário</label>
                            <p className="text-lg font-bold text-white">{payout.beneficiaryName}</p>
                        </div>
                        <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                            <label className="block text-xs font-bold text-zinc-500 uppercase">Valor</label>
                            <p className="text-2xl font-bold text-green-400">{formatCurrency(payout.amount)}</p>
                        </div>
                    </div>

                    <div className="mt-auto space-y-4">
                        <textarea
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:border-red-500 focus:outline-none resize-none"
                            rows={3}
                            placeholder="Motivo da rejeição..."
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                        />
                        <div className="flex gap-3">
                            <Button variant="danger" icon={ThumbsDown} onClick={handleReject} className="flex-1">Rejeitar</Button>
                            <Button variant="primary" icon={ThumbsUp} onClick={handleApprove} className="flex-1">Aprovar Nota</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// =================================================================================
// SCREENS
// =================================================================================

export const DashboardScreen: FC<{ vendas: Venda[], bankAccounts: BankAccount[], infraCosts: InfraCost[], lancamentos: Lancamento[] }> = ({ vendas, bankAccounts, infraCosts, lancamentos }) => {
    const salesRevenue = vendas.reduce((acc, v) => v.status === 'Aprovado' ? acc + v.valorBruto : acc, 0);
    const infraTotal = infraCosts.reduce((acc, c) => acc + c.totalCostBRL, 0);
    const opExTotal = lancamentos.filter(l => l.type === 'Despesa').reduce((acc, l) => acc + l.valorLiquido, 0);
    const totalBalance = bankAccounts.reduce((acc, b) => acc + (b.currency === 'BRL' ? b.balance : b.balance * 5.50), 0);
    const estimatedProfit = salesRevenue - infraTotal - opExTotal;

    const kpis = [
        { label: 'Receita Vendas (App)', value: formatCurrency(salesRevenue), icon: TrendingUp, color: 'text-green-400' },
        { label: 'Custos Infra (Twilio)', value: formatCurrency(infraTotal), icon: Smartphone, color: 'text-red-400' },
        { label: 'Despesas OpEx', value: formatCurrency(opExTotal), icon: Building2, color: 'text-red-400' },
        { label: 'Caixa Global', value: formatCurrency(totalBalance), icon: Landmark, color: 'text-[#7F00FF]' },
    ];

    return (
        <div className="space-y-6">
            <PageHeader title="Visão Geral" subtitle="Monitoramento consolidado." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi, idx) => (
                    <Card key={idx} className="relative overflow-hidden group hover:bg-zinc-800/80">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-bold text-zinc-500 uppercase">{kpi.label}</p>
                                <h3 className="text-2xl font-bold mt-2 text-white">{kpi.value}</h3>
                            </div>
                            <div className={`p-3 bg-zinc-950 rounded-xl border border-zinc-800 ${kpi.color}`}>
                                <kpi.icon className="w-5 h-5" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 relative">
                    <h3 className="text-lg font-bold text-white mb-6">Resultado Estimado</h3>
                    <div className="flex items-center justify-center h-64 bg-zinc-950/50 rounded-xl border border-dashed border-zinc-800">
                        <div className="text-center">
                            <p className="text-zinc-500 mb-3 text-sm">Lucro Líquido Projetado</p>
                            <span className={`text-5xl font-bold ${estimatedProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>{formatCurrency(estimatedProfit)}</span>
                        </div>
                    </div>
                </Card>
                <Card>
                    <h3 className="text-lg font-bold text-white mb-6">Contas Bancárias</h3>
                    <div className="space-y-4">
                        {bankAccounts.map(bk => (
                            <div key={bk.id} className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl flex justify-between items-center hover:border-[#7F00FF]/50 transition-colors">
                                <div><p className="font-bold text-sm text-white">{bk.bankName}</p></div>
                                <div className="text-right">
                                    <p className="font-bold text-white">{bk.currency} {bk.balance.toLocaleString('pt-BR')}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export const VendasScreen: FC<{ vendas: Venda[], influencers: Influencer[], agents: Agent[] }> = ({ vendas, influencers }) => {
    const [searchUser, setSearchUser] = useState('');
    const filteredVendas = useMemo(() => vendas.filter(v => !searchUser || v.userId.includes(searchUser)), [vendas, searchUser]);

    return (
        <div className="space-y-6">
            <PageHeader title="Vendas de Créditos" subtitle="Histórico de transações."><Button icon={Download} variant="secondary">Exportar</Button></PageHeader>
            <Card>
                <div className="mb-6"><InputGroup label="Buscar Usuário" icon={Search} value={searchUser} onChange={e => setSearchUser(e.target.value)} placeholder="ID..." /></div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead><tr className="border-b border-zinc-800 text-left text-xs font-bold uppercase text-zinc-500"><th className="pb-4">Data</th><th className="pb-4">Usuário</th><th className="pb-4">Pacote</th><th className="pb-4 text-right">Valor</th><th className="pb-4 text-center">Status</th></tr></thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {filteredVendas.slice(0, 20).map(v => (
                                <tr key={v.id} className="hover:bg-zinc-800/30">
                                    <td className="py-4 text-sm text-zinc-400">{formatDate(v.data)}</td>
                                    <td className="py-4 text-sm text-white">{v.userId}</td>
                                    <td className="py-4 text-sm"><span className="bg-zinc-800 px-3 py-1 rounded-full text-xs">{v.packageType}</span></td>
                                    <td className="py-4 text-sm text-right font-bold text-white">{formatCurrency(v.valorBruto)}</td>
                                    <td className="py-4 text-center"><span className={getStatusChipClass(v.status)}>{v.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export const InfluencersScreen: FC<{ influencers: Influencer[], agents: Agent[] }> = ({ influencers }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filtered = useMemo(() => influencers.filter(inf => inf.name.toLowerCase().includes(searchTerm.toLowerCase())), [influencers, searchTerm]);

    return (
        <div className="space-y-6">
            <PageHeader title="Influenciadores" subtitle="Gestão de parceiros."><Button icon={Plus} variant="primary">Novo</Button></PageHeader>
            <Card>
                <div className="mb-6"><InputGroup label="Buscar" icon={Search} placeholder="Nome..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
                <table className="w-full">
                    <thead><tr className="border-b border-zinc-800 text-left text-xs font-bold uppercase text-zinc-500"><th className="pb-4">Nome</th><th className="pb-4">Cupom</th><th className="pb-4 text-right">Saldo</th><th className="pb-4 text-center">Status</th></tr></thead>
                    <tbody className="divide-y divide-zinc-800/50">
                        {filtered.map(inf => (
                            <tr key={inf.id} className="hover:bg-zinc-800/30">
                                <td className="py-4 text-sm font-bold text-white">{inf.name}</td>
                                <td className="py-4 text-sm"><span className="font-mono bg-zinc-950 border border-zinc-800 px-3 py-1 rounded text-xs">{inf.couponCode}</span></td>
                                <td className="py-4 text-sm text-right font-bold text-green-400">{formatCurrency(inf.balanceAvailable)}</td>
                                <td className="py-4 text-center"><span className={getStatusChipClass(inf.status)}>{inf.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export const AgentesScreen: FC<{ agents: Agent[] }> = ({ agents }) => (
    <div className="space-y-6">
        <PageHeader title="Agentes" subtitle="Supervisores."><Button icon={Plus} variant="primary">Novo</Button></PageHeader>
        <Card>
            <table className="w-full">
                <thead><tr className="border-b border-zinc-800 text-left text-xs font-bold uppercase text-zinc-500"><th className="pb-4">Nome</th><th className="pb-4">Email</th><th className="pb-4 text-right">Comissão</th></tr></thead>
                <tbody className="divide-y divide-zinc-800/50">
                    {agents.map(ag => (
                        <tr key={ag.id} className="hover:bg-zinc-800/30">
                            <td className="py-4 text-sm font-bold text-white">{ag.name}</td>
                            <td className="py-4 text-sm text-zinc-400">{ag.email}</td>
                            <td className="py-4 text-right font-bold text-green-400">{formatCurrency(ag.balanceAvailable)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    </div>
);

export const PayoutsScreen: FC<{ payouts: Payout[], onProcess: (ids: string[]) => void, onOpenReview: (p: Payout) => void, onViewExtract: (p: Payout) => void }> = ({ payouts, onProcess, onOpenReview, onViewExtract }) => {
    const [filterStatus, setFilterStatus] = useState<string>('Todos');
    const [selectedPayouts, setSelectedPayouts] = useState<Set<string>>(new Set());

    const filteredPayouts = useMemo(() => filterStatus === 'Todos' ? payouts : payouts.filter(p => p.status === filterStatus), [payouts, filterStatus]);

    const handleSelectOne = (id: string) => {
        const newSelection = new Set(selectedPayouts);
        if (newSelection.has(id)) newSelection.delete(id);
        else newSelection.add(id);
        setSelectedPayouts(newSelection);
    };

    return (
        <div className="space-y-6">
            <PageHeader title="Gestão de Pagamentos" subtitle="Comissões.">
                {selectedPayouts.size > 0 && <Button icon={Send} variant="primary" onClick={() => { onProcess(Array.from(selectedPayouts)); setSelectedPayouts(new Set()); }}>Pagar {selectedPayouts.size}</Button>}
            </PageHeader>
            <div className="flex gap-2 mb-6">
                {['Todos', 'Aguardando Nota', 'Em Análise', 'Aprovado'].map(status => (
                    <button key={status} onClick={() => setFilterStatus(status)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filterStatus === status ? 'bg-[#7F00FF] text-white' : 'bg-zinc-900 text-zinc-400'}`}>{status}</button>
                ))}
            </div>
            <Card>
                <table className="w-full">
                    <thead><tr className="border-b border-zinc-800 text-left text-xs font-bold uppercase text-zinc-500"><th className="pb-4 w-10"></th><th className="pb-4">Beneficiário</th><th className="pb-4">Valor</th><th className="pb-4">Status</th><th className="pb-4 text-right">Ação</th></tr></thead>
                    <tbody className="divide-y divide-zinc-800/50">
                        {filteredPayouts.map(p => (
                            <tr key={p.id} className="hover:bg-zinc-800/30">
                                <td className="py-4">{p.status === 'Aprovado' && <input type="checkbox" checked={selectedPayouts.has(p.id)} onChange={() => handleSelectOne(p.id)} className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-[#7F00FF]" />}</td>
                                <td className="py-4"><p className="text-sm font-bold text-white">{p.beneficiaryName}</p><p className="text-xs text-zinc-500">{p.beneficiaryType}</p></td>
                                <td className="py-4"><button onClick={() => onViewExtract(p)} className="text-sm font-bold text-green-400 hover:underline flex items-center gap-1">{formatCurrency(p.amount)} <List className="w-3 h-3" /></button></td>
                                <td className="py-4"><span className={getStatusChipClass(p.status)}>{p.status}</span></td>
                                <td className="py-4 text-right">
                                    {p.status === 'Em Análise' && <Button variant="primary" onClick={() => onOpenReview(p)} className="px-3 py-2 text-xs">Analisar</Button>}
                                    {p.status === 'Aguardando Nota' && <button className="text-zinc-500 hover:text-white"><MessageCircle className="w-5 h-5" /></button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export const TreasuryScreen: FC<{ bankAccounts: BankAccount[], transactions: TreasuryTransaction[], payables: PayableItem[], cardRecurrences: PayableItem[], onPay: (item: PayableItem) => void, setModal: (t: ModalType) => void }> = ({ bankAccounts, transactions, payables, cardRecurrences, onPay, setModal }) => (
    <div className="space-y-6">
        <PageHeader title="Tesouraria" subtitle="Liquidez."><Button icon={Plus} variant="primary" onClick={() => setModal('addTransaction')}>Nova Movimentação</Button></PageHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bankAccounts.map(account => (
                <Card key={account.id}>
                    <h3 className="font-bold text-zinc-400">{account.bankName}</h3>
                    <p className="text-3xl font-bold mt-4 text-white">{account.currency} {account.balance.toLocaleString('pt-BR')}</p>
                </Card>
            ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <Card>
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-500" /> Contas a Pagar</h3>
                    <table className="w-full">
                        <thead><tr className="border-b border-zinc-800 text-left text-xs font-bold uppercase text-zinc-500"><th className="pb-4">Vencimento</th><th className="pb-4">Fornecedor</th><th className="pb-4 text-right">Valor</th><th className="pb-4 text-right">Ação</th></tr></thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {payables.map(item => (
                                <tr key={item.id} className="hover:bg-zinc-800/30">
                                    <td className="py-4 text-sm text-zinc-400">{formatDate(item.dueDate)}</td>
                                    <td className="py-4"><p className="text-sm font-bold text-white">{item.supplierName}</p></td>
                                    <td className="py-4 text-sm text-right font-bold text-red-400">{formatCurrency(item.amount)}</td>
                                    <td className="py-4 text-right"><Button variant="secondary" className="px-3 py-2 text-xs" onClick={() => onPay(item)}>Pagar</Button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </div>
            <Card>
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><CreditCard className="w-5 h-5 text-[#7F00FF]" /> Recorrências</h3>
                <div className="space-y-4">
                    {cardRecurrences.map(item => (
                        <div key={item.id} className="flex justify-between items-center p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                            <div><p className="text-sm font-bold text-zinc-300">{item.supplierName}</p></div>
                            <span className="text-sm font-bold text-white">{formatCurrency(item.amount)}</span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    </div>
);

export const LancamentosScreen: FC<{ lancamentos: Lancamento[], setModal: (t: ModalType) => void }> = ({ lancamentos, setModal }) => (
    <div className="space-y-6">
        <PageHeader title="Lançamentos Manuais" subtitle="OpEx e receitas."><Button icon={Plus} variant="primary" onClick={() => setModal('addLancamento')}>Novo</Button></PageHeader>
        <Card>
            <table className="w-full">
                <thead><tr className="border-b border-zinc-800 text-left text-xs font-bold uppercase text-zinc-500"><th className="pb-4">Data</th><th className="pb-4">Descrição</th><th className="pb-4">Conta</th><th className="pb-4 text-right">Valor</th><th className="pb-4 text-center">Status</th></tr></thead>
                <tbody className="divide-y divide-zinc-800/50">
                    {lancamentos.map(l => (
                        <tr key={l.id} className="hover:bg-zinc-800/30">
                            <td className="py-4 text-sm text-zinc-400">{formatDate(l.data)}</td>
                            <td className="py-4 text-sm text-white">{l.description}</td>
                            <td className="py-4 text-sm font-mono text-zinc-500">{l.accountId}</td>
                            <td className={`py-4 text-sm text-right font-bold ${l.type === 'Receita' ? 'text-green-400' : 'text-red-400'}`}>{l.type === 'Receita' ? '+' : '-'} {formatCurrency(l.valorLiquido)}</td>
                            <td className="py-4 text-center"><span className={getStatusChipClass(l.status)}>{l.status}</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    </div>
);

export const ChartOfAccountsScreen: FC<{ nodes: AccountNode[], setModal: (t: ModalType) => void }> = ({ nodes, setModal }) => {
    const renderNode = (node: AccountNode, level: number): React.ReactNode => (
        <div key={node.id}>
            <div className={`flex items-center p-3 hover:bg-zinc-800/30 border-b border-zinc-800/50 ${node.isGroup ? 'bg-zinc-950/50' : ''}`} style={{ paddingLeft: `${level * 24 + 16}px` }}>
                <span className="font-mono text-zinc-500 w-24 text-sm">{node.code}</span>
                <span className={`flex-1 text-sm ${node.isGroup ? 'font-bold text-white' : 'text-zinc-300'}`}>{node.name}</span>
                <span className="text-[10px] uppercase font-bold bg-zinc-800 px-2 py-1 rounded text-zinc-400">{node.type}</span>
            </div>
            {node.children && node.children.map(child => renderNode(child, level + 1))}
        </div>
    );
    return (
        <div className="space-y-6">
            <PageHeader title="Plano de Contas" subtitle="Estrutura contábil."><Button icon={Plus} variant="primary" onClick={() => setModal('addAccount')}>Nova Conta</Button></PageHeader>
            <Card className="p-0 overflow-hidden">{nodes.map(node => renderNode(node, 0))}</Card>
        </div>
    );
};

export const CostCentersScreen: FC<{ costCenters: CostCenter[], setModal: (t: ModalType) => void }> = ({ costCenters, setModal }) => (
    <div className="space-y-6">
        <PageHeader title="Centros de Custo" subtitle="Gerencie unidades de negócio."><Button icon={Plus} variant="primary" onClick={() => setModal('addCostCenter')}>Novo</Button></PageHeader>
        <Card>
            <table className="w-full">
                <thead><tr className="border-b border-zinc-800 text-left text-xs font-bold uppercase text-zinc-500"><th className="pb-4">Código</th><th className="pb-4">Nome</th><th className="pb-4">Responsável</th><th className="pb-4 text-center">Status</th></tr></thead>
                <tbody className="divide-y divide-zinc-800/50">
                    {costCenters.map(cc => (
                        <tr key={cc.id} className="hover:bg-zinc-800/30">
                            <td className="py-4 text-sm font-mono text-zinc-400">{cc.code}</td>
                            <td className="py-4 text-sm font-medium text-white">{cc.name}</td>
                            <td className="py-4 text-sm text-zinc-400">{cc.manager}</td>
                            <td className="py-4 text-center"><span className={getStatusChipClass(cc.status)}>{cc.status}</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    </div>
);

export const SuppliersScreen: FC<{ suppliers: GeneralSupplier[], setModal: (t: ModalType) => void }> = ({ suppliers, setModal }) => (
    <div className="space-y-6">
        <PageHeader title="Fornecedores" subtitle="Infraestrutura e Serviços."><Button icon={Plus} variant="primary" onClick={() => setModal('addSupplier')}>Novo Fornecedor</Button></PageHeader>
        <Card>
            <table className="w-full">
                <thead><tr className="border-b border-zinc-800 text-left text-xs font-bold uppercase text-zinc-500"><th className="pb-4">Nome</th><th className="pb-4">Categoria</th><th className="pb-4 text-center">Status</th><th className="pb-4 text-right">Ações</th></tr></thead>
                <tbody className="divide-y divide-zinc-800/50">
                    {suppliers.map(s => (
                        <tr key={s.id} className="hover:bg-zinc-800/30">
                            <td className="py-4 text-sm font-bold text-white">{s.name}</td>
                            <td className="py-4 text-sm text-zinc-400">{s.category}</td>
                            <td className="py-4 text-center"><span className={getStatusChipClass(s.status)}>{s.status}</span></td>
                            <td className="py-4 text-right"><Edit className="w-4 h-4 inline cursor-pointer text-zinc-500 hover:text-[#7F00FF]" /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    </div>
);

export const DocumentsScreen: FC<{ documents: DocumentFile[], onView: (doc: DocumentFile) => void }> = ({ documents, onView }) => (
    <div className="space-y-6">
        <PageHeader title="Documentos (GED)" subtitle="Arquivos."><Button icon={Upload} variant="primary">Upload</Button></PageHeader>
        <Card>
            <table className="w-full">
                <thead><tr className="border-b border-zinc-800 text-left text-xs font-bold uppercase text-zinc-500"><th className="pb-4">Arquivo</th><th className="pb-4">Categoria</th><th className="pb-4 text-right">Ações</th></tr></thead>
                <tbody className="divide-y divide-zinc-800/50">
                    {documents.map(d => (
                        <tr key={d.id} className="hover:bg-zinc-800/30 group">
                            <td className="py-4 text-sm font-medium text-white flex items-center gap-3"><File className="w-5 h-5 text-zinc-500 group-hover:text-[#7F00FF]" /> {d.name}</td>
                            <td className="py-4 text-sm"><span className="bg-zinc-950 border border-zinc-800 px-2 py-1 rounded text-xs text-zinc-400">{d.category}</span></td>
                            <td className="py-4 text-right"><button onClick={() => onView(d)} className="p-2 rounded hover:bg-[#7F00FF]/10 text-zinc-500 hover:text-[#7F00FF]"><Eye className="w-4 h-4" /></button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    </div>
);

export const CashFlowScreen: FC = () => {
    const chartData = useMemo(() => Array.from({ length: 12 }, (_, i) => ({
        label: new Date(2025, i, 1).toLocaleDateString('pt-BR', { month: 'short' }),
        entradas: Math.floor(Math.random() * 50000) + 10000,
        saidas: Math.floor(Math.random() * 40000) + 5000,
    })), []);

    const totalEntradas = chartData.reduce((acc, d) => acc + d.entradas, 0);
    const totalSaidas = chartData.reduce((acc, d) => acc + d.saidas, 0);
    const maxValue = Math.max(...chartData.map(d => Math.max(d.entradas, d.saidas)));

    return (
        <div className="space-y-6">
            <PageHeader title="Fluxo de Caixa" subtitle="Projeção financeira." />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-green-500/5"><h4 className="text-xs font-bold text-green-500 uppercase">Entradas</h4><p className="text-2xl font-bold text-white mt-1">{formatCurrency(totalEntradas)}</p></Card>
                <Card className="bg-red-500/5"><h4 className="text-xs font-bold text-red-500 uppercase">Saídas</h4><p className="text-2xl font-bold text-white mt-1">{formatCurrency(totalSaidas)}</p></Card>
                <Card className="bg-blue-500/5"><h4 className="text-xs font-bold text-blue-500 uppercase">Saldo</h4><p className="text-2xl font-bold text-blue-400 mt-1">{formatCurrency(totalEntradas - totalSaidas)}</p></Card>
            </div>
            <Card>
                <div className="h-48 flex items-end gap-2">
                    {chartData.map((d, i) => (
                        <div key={i} className="flex-1 flex flex-col justify-end gap-1">
                            <div className="w-full bg-green-500/20 rounded-t" style={{ height: `${(d.entradas / maxValue) * 100}%` }}></div>
                            <div className="w-full bg-red-500/20 rounded-t" style={{ height: `${(d.saidas / maxValue) * 100}%` }}></div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export const DREScreen: FC = () => (
    <div className="space-y-6">
        <PageHeader title="DRE Gerencial" subtitle="Demonstrativo de Resultado." />
        <Card>
            <table className="w-full">
                <thead className="bg-zinc-950/50 border-b border-zinc-800"><tr><th className="py-3 px-4 text-left text-xs font-bold uppercase text-zinc-500">Estrutura</th><th className="py-3 px-4 text-right text-xs font-bold uppercase text-zinc-500">Valor</th></tr></thead>
                <tbody className="divide-y divide-zinc-800/30 text-sm">
                    <tr className="font-bold text-white"><td className="py-4 px-4">(=) Receita Bruta</td><td className="text-right">R$ 250.000,00</td></tr>
                    <tr className="text-red-400"><td className="py-3 px-4 pl-8">(-) Impostos</td><td className="text-right">-R$ 20.000,00</td></tr>
                    <tr className="font-bold text-green-400 text-lg border-t border-zinc-700 bg-green-500/5"><td className="py-5 px-4">(=) EBITDA</td><td className="text-right">R$ 87.500,00</td></tr>
                </tbody>
            </table>
        </Card>
    </div>
);

export const UnitEconomicsScreen: FC = () => (
    <div className="space-y-6">
        <PageHeader title="Unit Economics" subtitle="Margens unitárias." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <h3 className="text-lg font-bold text-white mb-6">Waterfall</h3>
                <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-zinc-800 rounded-xl"><span className="text-white">Preço</span><span className="text-white">R$ 14,90</span></div>
                    <div className="flex justify-between p-4 bg-blue-500/10 text-blue-400 border-blue-500/20"><span>Margem</span><span>R$ 5,10 (34%)</span></div>
                </div>
            </Card>
        </div>
    </div>
);

export const InfraCostsScreen: FC<{ costs: InfraCost[] }> = ({ costs }) => (
    <div className="space-y-6">
        <PageHeader title="Custos Infraestrutura" subtitle="SMS/WhatsApp." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card><h3 className="text-zinc-500 text-xs uppercase">Total</h3><p className="text-2xl font-bold mt-1 text-red-400">{formatCurrency(costs.reduce((acc, c) => acc + c.totalCostBRL, 0))}</p></Card>
        </div>
        <Card>
            <table className="w-full">
                <thead><tr className="border-b border-zinc-800 text-left text-xs font-bold uppercase text-zinc-500"><th className="pb-4">Data</th><th className="pb-4">Tipo</th><th className="pb-4 text-right">Total</th></tr></thead>
                <tbody className="divide-y divide-zinc-800/50">
                    {costs.map(c => (
                        <tr key={c.id} className="hover:bg-zinc-800/30">
                            <td className="py-4 text-zinc-400">{formatDate(c.date)}</td>
                            <td className="py-4 text-white">{c.type}</td>
                            <td className="py-4 text-right font-bold text-red-400">{formatCurrency(c.totalCostBRL)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    </div>
);

export const SettingsScreen: FC = () => (
    <div className="space-y-6">
        <PageHeader title="Configurações" subtitle="Parâmetros." />
        <Card>
            <InputGroup label="API Token" placeholder="sk_live_..." />
        </Card>
    </div>
);
