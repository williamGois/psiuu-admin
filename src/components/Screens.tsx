'use client';

import React, { useState, useMemo, FC } from 'react';
import {
  Download, Edit, Eye, FileText, Filter, Plus, Search, Send, TrendingUp,
  Upload, Zap, PieChart, Landmark, Smartphone, Layers, File, Clock, CheckCircle, CreditCard,
  ThumbsUp, ThumbsDown, Ticket, List, MessageCircle, AlertTriangle, Loader2
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
    const [error, setError] = useState<string | null>(null);
    
    // Form fields
    const [personType, setPersonType] = useState<'cpf' | 'cnpj'>('cnpj');
    const [name, setName] = useState('');
    const [tradeName, setTradeName] = useState('');
    const [document, setDocument] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [bankName, setBankName] = useState('');
    const [bankAgency, setBankAgency] = useState('');
    const [bankAccount, setBankAccount] = useState('');
    const [pixKey, setPixKey] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            await api.createSupplier({
                name,
                trade_name: tradeName || undefined,
                document,
                document_type: personType,
                email: email || undefined,
                phone: phone || undefined,
                address: address || undefined,
                city: city || undefined,
                state: state || undefined,
                zip_code: zipCode || undefined,
                bank_name: bankName || undefined,
                bank_agency: bankAgency || undefined,
                bank_account: bankAccount || undefined,
                pix_key: pixKey || undefined,
                notes: notes || undefined,
            });
            onSuccess?.();
            onClose();
        } catch (err: any) {
            console.error('Failed to create supplier:', err);
            setError(err.message || 'Erro ao criar fornecedor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    {error}
                </div>
            )}
            
            <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Tipo de Pessoa</label>
                <div className="flex gap-4 mt-3">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input 
                            type="radio" 
                            name="personType" 
                            className="appearance-none w-4 h-4 rounded-full border border-zinc-600 bg-zinc-900 checked:bg-[#7F00FF] checked:border-[#7F00FF]" 
                            checked={personType === 'cnpj'} 
                            onChange={() => setPersonType('cnpj')} 
                        />
                        <span className={`text-sm font-medium ${personType === 'cnpj' ? 'text-white' : 'text-zinc-500'}`}>Pessoa Jurídica</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input 
                            type="radio" 
                            name="personType" 
                            className="appearance-none w-4 h-4 rounded-full border border-zinc-600 bg-zinc-900 checked:bg-[#7F00FF] checked:border-[#7F00FF]" 
                            checked={personType === 'cpf'} 
                            onChange={() => setPersonType('cpf')} 
                        />
                        <span className={`text-sm font-medium ${personType === 'cpf' ? 'text-white' : 'text-zinc-500'}`}>Pessoa Física</span>
                    </label>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputGroup 
                    label={personType === 'cnpj' ? "CNPJ" : "CPF"} 
                    placeholder={personType === 'cnpj' ? "00.000.000/0000-00" : "000.000.000-00"} 
                    value={document}
                    onChange={(e) => setDocument(e.target.value)}
                    
                />
                <InputGroup 
                    label="Email" 
                    type="email" 
                    placeholder="email@empresa.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputGroup 
                    label={personType === 'cnpj' ? "Razão Social" : "Nome Completo"} 
                    placeholder={personType === 'cnpj' ? "Empresa LTDA" : "João da Silva"} 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    
                />
                <InputGroup 
                    label={personType === 'cnpj' ? "Nome Fantasia" : "Apelido"} 
                    placeholder="Nome de Mercado" 
                    value={tradeName}
                    onChange={(e) => setTradeName(e.target.value)}
                />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputGroup 
                    label="Telefone" 
                    type="tel" 
                    placeholder="(00) 00000-0000" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                <InputGroup 
                    label="CEP" 
                    placeholder="00000-000" 
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                />
            </div>
            
            <InputGroup 
                label="Endereço" 
                placeholder="Rua, número, complemento" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputGroup 
                    label="Cidade" 
                    placeholder="Cidade" 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <InputGroup 
                    label="Estado" 
                    placeholder="UF" 
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                />
            </div>

            <div className="border-t border-zinc-800 pt-4">
                <h4 className="text-sm font-bold text-zinc-300 mb-4">Dados Bancários (Opcional)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputGroup 
                        label="Banco" 
                        placeholder="Ex: Bradesco" 
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                    />
                    <InputGroup 
                        label="Agência" 
                        placeholder="0000" 
                        value={bankAgency}
                        onChange={(e) => setBankAgency(e.target.value)}
                    />
                    <InputGroup 
                        label="Conta" 
                        placeholder="00000-0" 
                        value={bankAccount}
                        onChange={(e) => setBankAccount(e.target.value)}
                    />
                </div>
                <div className="mt-4">
                    <InputGroup 
                        label="Chave Pix" 
                        placeholder="CPF, email, celular ou chave aleatória" 
                        value={pixKey}
                        onChange={(e) => setPixKey(e.target.value)}
                    />
                </div>
            </div>
            
            <InputGroup 
                label="Observações" 
                placeholder="Notas adicionais sobre o fornecedor" 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
            />
            
            <div className="flex justify-end gap-3 pt-6 border-t border-zinc-800">
                <Button variant="ghost" onClick={onClose} disabled={loading}>Cancelar</Button>
                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Salvando...
                        </>
                    ) : 'Salvar Fornecedor'}
                </Button>
            </div>
        </form>
    );
};

export const AddCostCenterForm: FC<{ onClose: () => void; onSuccess?: () => void }> = ({ onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Form fields
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            await api.createCostCenter({
                code,
                name,
                description: description || undefined,
                budget: budget ? parseFloat(budget) : undefined,
            });
            onSuccess?.();
            onClose();
        } catch (err: any) {
            console.error('Failed to create cost center:', err);
            setError(err.message || 'Erro ao criar centro de custo');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    {error}
                </div>
            )}
            
            <InputGroup 
                label="Código" 
                placeholder="Ex: 200" 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                
            />
            <InputGroup 
                label="Nome do Centro de Custo" 
                placeholder="Ex: Marketing Digital" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                
            />
            <InputGroup 
                label="Descrição" 
                placeholder="Ex: Despesas com campanhas de marketing" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <InputGroup 
                label="Orçamento Mensal (R$)" 
                type="number" 
                placeholder="0,00" 
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
            />
            
            <div className="flex justify-end gap-3 pt-6 border-t border-zinc-800">
                <Button variant="ghost" onClick={onClose} disabled={loading}>Cancelar</Button>
                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Salvando...
                        </>
                    ) : 'Salvar Centro'}
                </Button>
            </div>
        </form>
    );
};

export const AddAccountForm: FC<{ onClose: () => void; costCenters: CostCenter[]; onSuccess?: () => void }> = ({ onClose, costCenters, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Form fields
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [type, setType] = useState('despesa');
    const [nature, setNature] = useState<'debit' | 'credit'>('debit');
    const [description, setDescription] = useState('');
    const [allowsEntries, setAllowsEntries] = useState(true);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            await api.createChartOfAccount({
                code,
                name,
                type,
                nature,
                description: description || undefined,
                allows_entries: allowsEntries,
            });
            onSuccess?.();
            onClose();
        } catch (err: any) {
            console.error('Failed to create account:', err);
            setError(err.message || 'Erro ao criar conta');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    {error}
                </div>
            )}
            
            <InputGroup 
                label="Código da Conta" 
                placeholder="Ex: 1.1.1.05" 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                
            />
            <InputGroup 
                label="Nome da Conta" 
                placeholder="Ex: Banco Santander" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                
            />
            <div className="grid grid-cols-2 gap-4">
                <SelectGroup 
                    label="Tipo" 
                    value={type} 
                    onChange={(e) => setType(e.target.value)}
                >
                    <option value="ativo">Ativo</option>
                    <option value="passivo">Passivo</option>
                    <option value="receita">Receita</option>
                    <option value="despesa">Despesa</option>
                    <option value="patrimonio">Patrimônio</option>
                </SelectGroup>
                <SelectGroup 
                    label="Natureza" 
                    value={nature} 
                    onChange={(e) => setNature(e.target.value as 'debit' | 'credit')}
                >
                    <option value="debit">Devedora</option>
                    <option value="credit">Credora</option>
                </SelectGroup>
            </div>
            <InputGroup 
                label="Descrição" 
                placeholder="Descrição opcional da conta" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex items-center gap-2">
                <input 
                    type="checkbox" 
                    id="allowsEntries" 
                    checked={allowsEntries}
                    onChange={(e) => setAllowsEntries(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-600 bg-zinc-900 text-[#7F00FF]"
                />
                <label htmlFor="allowsEntries" className="text-sm text-zinc-300">Permite lançamentos</label>
            </div>
            
            <div className="flex justify-end gap-3 pt-6 border-t border-zinc-800">
                <Button variant="ghost" onClick={onClose} disabled={loading}>Cancelar</Button>
                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Salvando...
                        </>
                    ) : 'Salvar Conta'}
                </Button>
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Form fields
    const [transactionType, setTransactionType] = useState<'saida' | 'entrada'>('saida');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [bankAccountId, setBankAccountId] = useState('');
    const [method, setMethod] = useState<string>(initialData?.method || 'Pix');
    const [pixKey, setPixKey] = useState('');
    const [description, setDescription] = useState(initialData ? `${initialData.description} - ${initialData.supplierName}` : '');
    const [amount, setAmount] = useState(initialData?.amount?.toFixed(2) || '');
    const [costCenterId, setCostCenterId] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            // Create as financial entry
            await api.createEntry({
                type: transactionType === 'entrada' ? 'receita' : 'despesa',
                entry_type: transactionType === 'entrada' ? 'recebido' : 'pago',
                description,
                amount: parseFloat(amount),
                due_date: date,
                competence_date: date,
                bank_account_id: bankAccountId || undefined,
                cost_center_id: costCenterId || undefined,
                payment_method: method.toLowerCase(),
                notes: pixKey ? `Chave Pix: ${pixKey}` : undefined,
            });
            onSuccess?.();
            onClose();
        } catch (err: any) {
            console.error('Failed to create transaction:', err);
            setError(err.message || 'Erro ao criar movimentação');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    {error}
                </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
                <SelectGroup 
                    label="Tipo de Movimentação" 
                    value={transactionType} 
                    onChange={(e) => setTransactionType(e.target.value as 'saida' | 'entrada')}
                >
                    <option value="saida">Saída (Pagamento)</option>
                    <option value="entrada">Entrada (Recebimento)</option>
                </SelectGroup>
                <InputGroup 
                    label="Data" 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <SelectGroup 
                    label="Conta Bancária" 
                    value={bankAccountId} 
                    onChange={(e) => setBankAccountId(e.target.value)}
                >
                    <option value="">Selecione...</option>
                    {bankAccounts.map(acc => (
                        <option key={acc.id} value={acc.id}>{acc.bankName} - {acc.currency}</option>
                    ))}
                </SelectGroup>
                <SelectGroup 
                    label="Método" 
                    value={method} 
                    onChange={(e) => setMethod(e.target.value)}
                >
                    <option value="Pix">Pix</option>
                    <option value="Boleto">Boleto</option>
                    <option value="TED">TED</option>
                    <option value="Cartao">Cartão</option>
                    <option value="Dinheiro">Dinheiro</option>
                </SelectGroup>
            </div>
            {method === 'Pix' && (
                <div className="p-4 bg-[#7F00FF]/10 rounded-xl border border-[#7F00FF]/30">
                    <label className="text-xs font-bold text-[#7F00FF] mb-3 uppercase flex items-center gap-2">
                        <Zap className="w-4 h-4" /> Chave Pix
                    </label>
                    <input 
                        type="text" 
                        placeholder="Chave pix..." 
                        className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-lg py-2 px-3 text-sm"
                        value={pixKey}
                        onChange={(e) => setPixKey(e.target.value)}
                    />
                </div>
            )}
            <InputGroup 
                label="Descrição" 
                placeholder="Ex: Pagamento Fornecedor" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                
            />
            <div className="grid grid-cols-2 gap-4">
                <InputGroup 
                    label="Valor (R$)" 
                    type="number" 
                    placeholder="0,00" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    
                />
                <SelectGroup 
                    label="Centro de Custo" 
                    value={costCenterId} 
                    onChange={(e) => setCostCenterId(e.target.value)}
                >
                    <option value="">Selecione...</option>
                    {costCenters.map(cc => (
                        <option key={cc.id} value={cc.id}>{cc.name}</option>
                    ))}
                </SelectGroup>
            </div>
            
            <div className="flex justify-end gap-3 pt-6 border-t border-zinc-800">
                <Button variant="ghost" onClick={onClose} disabled={loading}>Cancelar</Button>
                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Salvando...
                        </>
                    ) : 'Confirmar'}
                </Button>
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Form fields
    const [type, setType] = useState<'despesa' | 'receita'>('despesa');
    const [entryType, setEntryType] = useState<'a_pagar' | 'a_receber'>('a_pagar');
    const [supplierId, setSupplierId] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [competenceDate, setCompetenceDate] = useState(new Date().toISOString().split('T')[0]);
    const [accountId, setAccountId] = useState('');
    const [costCenterId, setCostCenterId] = useState('');
    const [documentNumber, setDocumentNumber] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [installments, setInstallments] = useState('1');
    const [notes, setNotes] = useState('');

    // Flatten accounts for select
    const flatAccounts: AccountNode[] = [];
    const traverse = (nodes: AccountNode[]) => {
        nodes.forEach(node => {
            flatAccounts.push(node);
            if (node.children) traverse(node.children);
        });
    };
    traverse(accounts);

    // Update entry type when type changes
    const handleTypeChange = (newType: 'despesa' | 'receita') => {
        setType(newType);
        setEntryType(newType === 'despesa' ? 'a_pagar' : 'a_receber');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            await api.createEntry({
                type,
                entry_type: entryType,
                description,
                amount: parseFloat(amount),
                due_date: dueDate,
                competence_date: competenceDate,
                account_id: accountId || undefined,
                cost_center_id: costCenterId || undefined,
                supplier_id: supplierId || undefined,
                document_number: documentNumber || undefined,
                payment_method: paymentMethod || undefined,
                installments: parseInt(installments) > 1 ? parseInt(installments) : undefined,
                notes: notes || undefined,
            });
            onSuccess?.();
            onClose();
        } catch (err: any) {
            console.error('Failed to create entry:', err);
            setError(err.message || 'Erro ao criar lançamento');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    {error}
                </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Tipo</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="radio" 
                                name="tipo" 
                                checked={type === 'despesa'}
                                onChange={() => handleTypeChange('despesa')}
                                className="text-[#FF3366]" 
                            />
                            <span className="text-sm text-white">Despesa</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="radio" 
                                name="tipo" 
                                checked={type === 'receita'}
                                onChange={() => handleTypeChange('receita')}
                                className="text-green-500" 
                            />
                            <span className="text-sm text-white">Receita</span>
                        </label>
                    </div>
                </div>
                <SelectGroup 
                    label="Fornecedor/Parceiro" 
                    value={supplierId} 
                    onChange={(e) => setSupplierId(e.target.value)}
                >
                    <option value="">Selecione...</option>
                    {suppliers.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </SelectGroup>
            </div>
            
            <InputGroup 
                label="Descrição" 
                placeholder="Ex: Pagamento AWS Mensal" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                
            />
            
            <div className="grid grid-cols-2 gap-4">
                <InputGroup 
                    label="Valor (R$)" 
                    type="number" 
                    placeholder="0,00" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    
                />
                <InputGroup 
                    label="Nº Documento" 
                    placeholder="NF, Boleto, etc" 
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <InputGroup 
                    label="Vencimento" 
                    type="date" 
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    
                />
                <InputGroup 
                    label="Competência" 
                    type="date" 
                    value={competenceDate}
                    onChange={(e) => setCompetenceDate(e.target.value)}
                    
                />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <SelectGroup 
                    label="Conta Contábil" 
                    value={accountId} 
                    onChange={(e) => setAccountId(e.target.value)}
                >
                    <option value="">Selecione...</option>
                    {flatAccounts.map(acc => (
                        <option key={acc.id} value={acc.id} disabled={acc.isGroup}>
                            {acc.code} - {acc.name}
                        </option>
                    ))}
                </SelectGroup>
                <SelectGroup 
                    label="Centro de Custo" 
                    value={costCenterId} 
                    onChange={(e) => setCostCenterId(e.target.value)}
                >
                    <option value="">Selecione...</option>
                    {costCenters.map(cc => (
                        <option key={cc.id} value={cc.id}>{cc.name}</option>
                    ))}
                </SelectGroup>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <SelectGroup 
                    label="Forma de Pagamento" 
                    value={paymentMethod} 
                    onChange={(e) => setPaymentMethod(e.target.value)}
                >
                    <option value="">Selecione...</option>
                    <option value="pix">Pix</option>
                    <option value="boleto">Boleto</option>
                    <option value="cartao">Cartão</option>
                    <option value="transferencia">Transferência</option>
                    <option value="dinheiro">Dinheiro</option>
                    <option value="debito_automatico">Débito Automático</option>
                </SelectGroup>
                <InputGroup 
                    label="Parcelas" 
                    type="number" 
                    placeholder="1" 
                    value={installments}
                    onChange={(e) => setInstallments(e.target.value)}
                    
                    
                />
            </div>
            
            <InputGroup 
                label="Observações" 
                placeholder="Notas adicionais" 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
            />
            
            <div className="flex justify-end gap-3 pt-6 border-t border-zinc-800">
                <Button variant="ghost" onClick={onClose} disabled={loading}>Cancelar</Button>
                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Salvando...
                        </>
                    ) : 'Salvar'}
                </Button>
            </div>
        </form>
    );
};

export const ViewDocumentModal: FC<{ onClose: () => void, doc: DocumentFile | null }> = ({ onClose, doc }) => {
    if(!doc) return null;
    return (
        <div className="space-y-6">
            <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 flex items-center gap-4">
                <div className="p-4 bg-[#7F00FF]/10 rounded-full"><FileText className="w-8 h-8 text-[#7F00FF]" /></div>
                <div>
                    <h3 className="text-lg font-bold text-white">{doc.name}</h3>
                    <p className="text-zinc-500 text-sm">{(doc.size/1024).toFixed(0)} KB • {doc.category}</p>
                </div>
            </div>
            <div className="h-48 bg-zinc-900 rounded-lg border border-zinc-800 border-dashed flex items-center justify-center">
                 <p className="text-zinc-500 text-sm">Pré-visualização não disponível.</p>
            </div>
            <div className="flex justify-end gap-3 pt-6 border-t border-zinc-800">
                <Button variant="ghost" onClick={onClose}>Fechar</Button>
                <Button variant="primary" icon={Download}>Baixar</Button>
            </div>
        </div>
    );
};

export const CommissionExtractModal: FC<{ payout: Payout; onClose: () => void }> = ({ payout, onClose }) => {
    const extractItems = useMemo(() => generateCommissionExtract(payout), [payout]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                <div>
                    <p className="text-zinc-500 text-xs font-bold uppercase">Beneficiário</p>
                    <h3 className="text-xl font-bold text-white">{payout.beneficiaryName}</h3>
                </div>
                <div className="text-right">
                    <p className="text-zinc-500 text-xs font-bold uppercase">Total</p>
                    <h3 className="text-2xl font-bold text-[#7F00FF]">{formatCurrency(payout.amount)}</h3>
                </div>
            </div>
            <div className="max-h-64 overflow-y-auto border border-zinc-800 rounded-xl">
                <table className="w-full">
                    <thead className="sticky top-0 bg-zinc-900 border-b border-zinc-800">
                        <tr className="text-left text-xs font-bold uppercase text-zinc-500">
                            <th className="p-4">Data</th>
                            <th className="p-4">Usuário</th>
                            <th className="p-4">Pacote</th>
                            <th className="p-4 text-right">Comissão</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50 bg-zinc-950">
                        {extractItems.map(item => (
                            <tr key={item.id}>
                                <td className="p-4 text-sm text-zinc-400">{formatDate(item.date)}</td>
                                <td className="p-4 text-sm text-white">{item.originUser}</td>
                                <td className="p-4 text-sm"><span className="bg-zinc-800 px-2 py-1 rounded text-xs">{item.package}</span></td>
                                <td className="p-4 text-sm text-right font-bold text-green-400">{formatCurrency(item.amount)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Button variant="primary" onClick={onClose} className="w-full">Fechar</Button>
        </div>
    );
};

export const ReviewPayoutModal: FC<{ payout: Payout; onClose: () => void; onUpdate: (p: Payout) => void }> = ({ payout, onClose, onUpdate }) => {
    const [reason, setReason] = useState('');

    const handleApprove = () => { onUpdate({ ...payout, status: 'Aprovado' }); onClose(); };
    const handleReject = () => {
        if (!reason) return alert("Informe o motivo.");
        onUpdate({ ...payout, status: 'Rejeitado', rejectionReason: reason });
        onClose();
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-4 flex flex-col justify-center items-center text-center">
                <FileText className="w-16 h-16 text-zinc-600 mb-4" />
                <h4 className="text-white font-bold">{payout.invoiceUrl || "Nenhum arquivo"}</h4>
                <Button variant="secondary" icon={Download} className="mt-4">Baixar Nota</Button>
            </div>
            <div className="flex flex-col gap-4">
                <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                    <label className="block text-xs font-bold text-zinc-500 uppercase">Beneficiário</label>
                    <p className="text-lg font-bold text-white">{payout.beneficiaryName}</p>
                </div>
                <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                    <label className="block text-xs font-bold text-zinc-500 uppercase">Valor</label>
                    <p className="text-2xl font-bold text-green-400">{formatCurrency(payout.amount)}</p>
                </div>
                <textarea
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-white resize-none"
                    rows={3}
                    placeholder="Motivo da rejeição..."
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                />
                <div className="flex gap-3">
                    <Button variant="danger" icon={ThumbsDown} onClick={handleReject} className="flex-1">Rejeitar</Button>
                    <Button variant="primary" icon={ThumbsUp} onClick={handleApprove} className="flex-1">Aprovar</Button>
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

    const kpis = [
        { label: 'Receita Vendas', value: formatCurrency(salesRevenue), icon: TrendingUp, color: 'text-green-400' },
        { label: 'Custos Infra', value: formatCurrency(infraTotal), icon: Smartphone, color: 'text-red-400' },
        { label: 'Despesas OpEx', value: formatCurrency(opExTotal), icon: Landmark, color: 'text-red-400' },
        { label: 'Caixa Global', value: formatCurrency(totalBalance), icon: Landmark, color: 'text-[#7F00FF]' },
    ];

    return (
        <div className="space-y-6">
            <PageHeader title="Visão Geral" subtitle="Dashboard financeiro consolidado." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi, idx) => (
                    <Card key={idx}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-bold text-zinc-500 uppercase">{kpi.label}</p>
                                <h3 className="text-2xl font-bold mt-2 text-white">{kpi.value}</h3>
                            </div>
                            <div className={`p-3 bg-zinc-950 rounded-xl border border-zinc-800 ${kpi.color}`}><kpi.icon className="w-5 h-5" /></div>
                        </div>
                    </Card>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <h3 className="text-lg font-bold text-white mb-6">Resultado Estimado</h3>
                    <div className="flex items-center justify-center h-64 bg-zinc-950/50 rounded-xl border border-dashed border-zinc-800">
                        <div className="text-center">
                            <p className="text-zinc-500 mb-3">Lucro Líquido Projetado</p>
                            <span className={`text-5xl font-bold ${salesRevenue - infraTotal - opExTotal >= 0 ? 'text-green-500' : 'text-red-500'}`}>{formatCurrency(salesRevenue - infraTotal - opExTotal)}</span>
                        </div>
                    </div>
                </Card>
                <Card>
                    <h3 className="text-lg font-bold text-white mb-6">Contas Bancárias</h3>
                    <div className="space-y-4">
                        {bankAccounts.map(bk => (
                            <div key={bk.id} className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-sm text-white">{bk.bankName}</p>
                                    <p className="text-xs text-zinc-500 font-mono">{bk.accountNumber}</p>
                                </div>
                                <p className="font-bold text-white">{bk.currency} {bk.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
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
                <div className="mb-6"><InputGroup label="Buscar Usuário" icon={Search} value={searchUser} onChange={e => setSearchUser(e.target.value)} placeholder="ID do usuário..." /></div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead><tr className="border-b border-zinc-800 text-left text-xs font-bold uppercase text-zinc-500"><th className="pb-4">Data</th><th className="pb-4">Usuário</th><th className="pb-4">Pacote</th><th className="pb-4 text-right">Valor</th><th className="pb-4 text-center">Status</th></tr></thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {filteredVendas.slice(0, 20).map(v => (
                                <tr key={v.id} className="hover:bg-zinc-800/30">
                                    <td className="py-4 text-sm text-zinc-400">{formatDate(v.data)}</td>
                                    <td className="py-4 text-sm font-medium text-white">{v.userId}</td>
                                    <td className="py-4 text-sm"><span className="bg-zinc-800 px-3 py-1 rounded-full text-xs">{v.packageType.replace('_', ' ')}</span></td>
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
        <PageHeader title="Agentes" subtitle="Supervisores (5% comissão)."><Button icon={Plus} variant="primary">Novo</Button></PageHeader>
        <Card>
             <table className="w-full">
                <thead><tr className="border-b border-zinc-800 text-left text-xs font-bold uppercase text-zinc-500"><th className="pb-4">Nome</th><th className="pb-4">Email</th><th className="pb-4 text-center">Time</th><th className="pb-4 text-right">Comissão</th></tr></thead>
                <tbody className="divide-y divide-zinc-800/50">
                    {agents.map(ag => (
                        <tr key={ag.id} className="hover:bg-zinc-800/30">
                            <td className="py-4 text-sm font-bold text-white">{ag.name}</td>
                            <td className="py-4 text-sm text-zinc-400">{ag.email}</td>
                            <td className="py-4 text-center"><span className="bg-[#7F00FF]/10 text-[#7F00FF] px-2 py-1 rounded-full text-xs font-bold">{ag.influencersCount}</span></td>
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

    const counts = useMemo(() => ({
        aguardando: payouts.filter(p => p.status === 'Aguardando Nota').length,
        analise: payouts.filter(p => p.status === 'Em Análise').length,
        aprovado: payouts.filter(p => p.status === 'Aprovado').length,
        total: payouts.length
    }), [payouts]);

    const filteredPayouts = useMemo(() => filterStatus === 'Todos' ? payouts : payouts.filter(p => p.status === filterStatus), [payouts, filterStatus]);

    const handleSelectOne = (id: string) => {
        const newSelection = new Set(selectedPayouts);
        if (newSelection.has(id)) newSelection.delete(id);
        else newSelection.add(id);
        setSelectedPayouts(newSelection);
    };

    return (
        <div className="space-y-6">
            <PageHeader title="Gestão de Pagamentos" subtitle="Controle de comissões.">
                {selectedPayouts.size > 0 && <Button icon={Send} variant="primary" onClick={() => { onProcess(Array.from(selectedPayouts)); setSelectedPayouts(new Set()); }}>Pagar {selectedPayouts.size}</Button>}
            </PageHeader>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Aguardando Nota', 'Em Análise', 'Aprovado', 'Todos'].map(status => {
                    const countVal = status === 'Aguardando Nota' ? counts.aguardando : status === 'Em Análise' ? counts.analise : status === 'Aprovado' ? counts.aprovado : counts.total;
                    return (
                        <button key={status} onClick={() => setFilterStatus(status)} className={`p-4 rounded-xl border text-left ${filterStatus === status ? 'bg-[#7F00FF]/10 border-[#7F00FF]/50' : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800'}`}>
                            <div className="flex justify-between items-center mb-2">
                                {status === 'Aguardando Nota' ? <Clock className="w-5 h-5 text-yellow-500" /> : status === 'Em Análise' ? <Search className="w-5 h-5 text-blue-500" /> : status === 'Aprovado' ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Layers className="w-5 h-5 text-[#7F00FF]" />}
                                <span className="text-xl font-bold text-white">{countVal}</span>
                            </div>
                            <p className="text-xs text-zinc-400 font-bold uppercase">{status}</p>
                        </button>
                    );
                })}
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
        <PageHeader title="Tesouraria" subtitle="Gestão de liquidez."><Button icon={Plus} variant="primary" onClick={() => setModal('addTransaction')}>Nova Movimentação</Button></PageHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bankAccounts.map(account => (
                <Card key={account.id}>
                    <h3 className="font-bold text-zinc-400">{account.bankName}</h3>
                    <p className="text-3xl font-bold mt-4 text-white">{account.currency} {account.balance.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                    <p className="text-xs text-zinc-500 mt-2 font-mono">Conta: {account.accountNumber}</p>
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
                                    <td className="py-4"><p className="text-sm font-bold text-white">{item.supplierName}</p><p className="text-xs text-zinc-500">{item.description}</p></td>
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
                            <div><p className="text-sm font-bold text-zinc-300">{item.supplierName}</p><p className="text-xs text-zinc-500">{item.dueDate}</p></div>
                            <span className="text-sm font-bold text-white">{formatCurrency(item.amount)}</span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
        <Card>
            <h3 className="text-lg font-bold text-white mb-4">Extrato</h3>
            <table className="w-full">
                <thead><tr className="border-b border-zinc-800 text-left text-xs font-bold uppercase text-zinc-500"><th className="pb-4">Data</th><th className="pb-4">Descrição</th><th className="pb-4">Método</th><th className="pb-4 text-right">Valor</th></tr></thead>
                <tbody className="divide-y divide-zinc-800/50">
                    {transactions.map(t => (
                        <tr key={t.id} className="hover:bg-zinc-800/30">
                            <td className="py-4 text-sm text-zinc-400">{formatDate(t.date)}</td>
                            <td className="py-4 text-sm font-medium text-white">{t.description}</td>
                            <td className="py-4"><span className={`px-2 py-1 rounded text-xs font-bold ${t.method === 'Pix' ? 'bg-[#32BCAD]/10 text-[#32BCAD]' : 'bg-zinc-800 text-zinc-400'}`}>{t.method || 'TED'}</span></td>
                            <td className={`py-4 text-sm text-right font-bold ${t.type === 'Entrada' ? 'text-green-400' : 'text-red-400'}`}>{t.type === 'Entrada' ? '+' : '-'} {formatCurrency(t.value)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    </div>
);

export const LancamentosScreen: FC<{ lancamentos: Lancamento[], setModal: (t: ModalType) => void }> = ({ lancamentos, setModal }) => (
    <div className="space-y-6">
        <PageHeader title="Contas a Pagar" subtitle="Lançamentos manuais."><Button icon={Plus} variant="primary" onClick={() => setModal('addLancamento')}>Novo</Button></PageHeader>
        <Card>
            <table className="w-full">
                <thead><tr className="border-b border-zinc-800 text-left text-xs font-bold uppercase text-zinc-500"><th className="pb-4">Data</th><th className="pb-4">Descrição</th><th className="pb-4">Conta</th><th className="pb-4 text-right">Valor</th><th className="pb-4 text-center">Status</th></tr></thead>
                <tbody className="divide-y divide-zinc-800/50">
                    {lancamentos.map(l => (
                        <tr key={l.id} className="hover:bg-zinc-800/30">
                            <td className="py-4 text-sm text-zinc-400">{formatDate(l.data)}</td>
                            <td className="py-4 text-sm font-medium text-white">{l.description}</td>
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
        <PageHeader title="Centros de Custo" subtitle="Unidades de negócio."><Button icon={Plus} variant="primary" onClick={() => setModal('addCostCenter')}>Novo</Button></PageHeader>
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
        <PageHeader title="Fornecedores" subtitle="Cadastro de parceiros."><Button icon={Plus} variant="primary" onClick={() => setModal('addSupplier')}>Novo</Button></PageHeader>
        <Card>
            <table className="w-full">
                <thead><tr className="border-b border-zinc-800 text-left text-xs font-bold uppercase text-zinc-500"><th className="pb-4">Nome</th><th className="pb-4">Categoria</th><th className="pb-4 text-center">Status</th><th className="pb-4 text-right">Ações</th></tr></thead>
                <tbody className="divide-y divide-zinc-800/50">
                    {suppliers.map(s => (
                        <tr key={s.id} className="hover:bg-zinc-800/30">
                            <td className="py-4 text-sm font-bold text-white">{s.name}</td>
                            <td className="py-4 text-sm text-zinc-400">{s.category}</td>
                            <td className="py-4 text-center"><span className={getStatusChipClass(s.status)}>{s.status}</span></td>
                            <td className="py-4 text-right"><Edit className="w-4 h-4 inline cursor-pointer text-zinc-500 hover:text-[#7F00FF]"/></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    </div>
);

export const DocumentsScreen: FC<{ documents: DocumentFile[], onView: (doc: DocumentFile) => void }> = ({ documents, onView }) => (
    <div className="space-y-6">
        <PageHeader title="Documentos" subtitle="Gestão de arquivos."><Button icon={Upload} variant="primary">Upload</Button></PageHeader>
        <Card>
            <table className="w-full">
                <thead><tr className="border-b border-zinc-800 text-left text-xs font-bold uppercase text-zinc-500"><th className="pb-4">Arquivo</th><th className="pb-4">Categoria</th><th className="pb-4">Entidade</th><th className="pb-4 text-right">Tamanho</th><th className="pb-4 text-right">Ações</th></tr></thead>
                <tbody className="divide-y divide-zinc-800/50">
                    {documents.map(d => (
                        <tr key={d.id} className="hover:bg-zinc-800/30 group">
                            <td className="py-4 text-sm font-medium text-white flex items-center gap-3"><File className="w-5 h-5 text-zinc-500 group-hover:text-[#7F00FF]"/> {d.name}</td>
                            <td className="py-4 text-sm"><span className="bg-zinc-950 border border-zinc-800 px-2 py-1 rounded text-xs">{d.category}</span></td>
                            <td className="py-4 text-sm text-zinc-300">{d.relatedEntity}</td>
                            <td className="py-4 text-sm text-right text-zinc-500 font-mono">{(d.size/1024).toFixed(0)} KB</td>
                            <td className="py-4 text-right"><button onClick={() => onView(d)} className="p-2 rounded hover:bg-[#7F00FF]/10 text-zinc-500 hover:text-[#7F00FF]"><Eye className="w-4 h-4"/></button></td>
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
                 <Card className="bg-blue-500/5"><h4 className="text-xs font-bold text-blue-500 uppercase">Saldo Projetado</h4><p className="text-2xl font-bold text-blue-400 mt-1">{formatCurrency(totalEntradas - totalSaidas)}</p></Card>
            </div>
            <Card>
                <h3 className="text-lg font-bold text-white mb-8">Projeção Mensal</h3>
                <div className="h-64 flex items-end gap-3 pb-6 px-2">
                    {chartData.map((d, i) => (
                        <div key={i} className="flex-1 flex flex-col justify-end items-center gap-2 group">
                            <div className="w-full flex gap-1 justify-center items-end h-full">
                                <div className="w-2 bg-green-500 rounded-t-sm" style={{ height: `${(d.entradas / maxValue) * 100}%` }}></div>
                                <div className="w-2 bg-red-500 rounded-t-sm" style={{ height: `${(d.saidas / maxValue) * 100}%` }}></div>
                            </div>
                            <span className="text-[10px] text-zinc-500 uppercase font-bold">{d.label}</span>
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
                <thead className="bg-zinc-950/50 border-b border-zinc-800"><tr><th className="py-3 px-4 text-left text-xs font-bold uppercase text-zinc-500">Estrutura</th><th className="py-3 px-4 text-right text-xs font-bold uppercase text-zinc-500">Valor</th><th className="py-3 px-4 text-right text-xs font-bold uppercase text-zinc-500">%</th></tr></thead>
                <tbody className="divide-y divide-zinc-800/30 text-sm">
                    <tr className="font-bold text-white"><td className="py-4 px-4">(=) Receita Bruta</td><td className="text-right">R$ 250.000,00</td><td className="text-right text-zinc-400">100%</td></tr>
                    <tr className="text-red-400"><td className="py-3 px-4 pl-8">(-) Impostos</td><td className="text-right">-R$ 20.000,00</td><td className="text-right text-zinc-500">8.0%</td></tr>
                    <tr className="font-bold bg-zinc-950 text-white border-y border-zinc-800"><td className="py-4 px-4">(=) Receita Líquida</td><td className="text-right">R$ 230.000,00</td><td className="text-right text-zinc-400">92.0%</td></tr>
                    <tr className="text-red-400"><td className="py-3 px-4 pl-8">(-) Taxas Loja</td><td className="text-right">-R$ 37.500,00</td><td className="text-right text-zinc-500">15.0%</td></tr>
                    <tr className="font-bold text-green-400 text-lg border-t border-zinc-700 bg-green-500/5"><td className="py-5 px-4">(=) EBITDA</td><td className="text-right">R$ 87.500,00</td><td className="text-right text-green-600">35.0%</td></tr>
                </tbody>
            </table>
        </Card>
    </div>
);

export const UnitEconomicsScreen: FC = () => (
    <div className="space-y-6">
        <PageHeader title="Unit Economics" subtitle="Análise de margem." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <h3 className="text-lg font-bold text-white mb-6">Waterfall de Receita</h3>
                <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-zinc-800 rounded-xl"><span className="font-bold text-white">Preço Venda</span><span className="font-bold text-white">R$ 14,90</span></div>
                    <div className="pl-4 space-y-2 border-l-2 border-zinc-800">
                        <div className="flex justify-between text-sm text-zinc-400"><span>App Store (15%)</span><span className="text-red-400">-R$ 2,24</span></div>
                        <div className="flex justify-between text-sm text-zinc-400"><span>Impostos (8%)</span><span className="text-red-400">-R$ 1,19</span></div>
                        <div className="flex justify-between text-sm text-zinc-400"><span>Influencer (20%)</span><span className="text-red-400">-R$ 2,98</span></div>
                        <div className="flex justify-between text-sm text-zinc-400"><span>Infra (8 SMS)</span><span className="text-red-500 font-bold">-R$ 2,64</span></div>
                    </div>
                    <div className="flex justify-between p-4 rounded-xl font-bold border bg-blue-500/10 text-blue-400 border-blue-500/20"><span>Margem Contribuição</span><span>R$ 5,10 (34.2%)</span></div>
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-bold text-white mb-4">Sensibilidade</h3>
                <div className="space-y-6">
                    <div><div className="flex justify-between text-xs mb-2 font-bold uppercase text-zinc-400"><span>100% SMS</span><span className="text-red-500">34%</span></div><div className="w-full bg-zinc-950 h-2 rounded-full"><div className="bg-red-500 h-2 rounded-full" style={{width: '34%'}}></div></div></div>
                    <div><div className="flex justify-between text-xs mb-2 font-bold uppercase text-zinc-400"><span>Misto (50/50)</span><span className="text-yellow-500">42%</span></div><div className="w-full bg-zinc-950 h-2 rounded-full"><div className="bg-yellow-500 h-2 rounded-full" style={{width: '42%'}}></div></div></div>
                    <div><div className="flex justify-between text-xs mb-2 font-bold uppercase text-zinc-400"><span>100% Push</span><span className="text-green-500">51%</span></div><div className="w-full bg-zinc-950 h-2 rounded-full"><div className="bg-green-500 h-2 rounded-full" style={{width: '51%'}}></div></div></div>
                </div>
            </Card>
        </div>
    </div>
);

export const InfraCostsScreen: FC<{ costs: InfraCost[] }> = ({ costs }) => (
    <div className="space-y-6">
        <PageHeader title="Custos Infraestrutura" subtitle="Monitoramento de gastos." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <Card><h3 className="text-zinc-500 text-xs font-bold uppercase">Total Gasto</h3><p className="text-2xl font-bold mt-1 text-red-400">{formatCurrency(costs.reduce((acc,c)=>acc+c.totalCostBRL,0))}</p></Card>
             <Card><h3 className="text-zinc-500 text-xs font-bold uppercase">SMS Enviados</h3><p className="text-2xl font-bold mt-1 text-white">{costs.filter(c=>c.type==='SMS').reduce((acc,c)=>acc+c.quantity,0).toLocaleString()}</p></Card>
             <Card><h3 className="text-zinc-500 text-xs font-bold uppercase">WhatsApp</h3><p className="text-2xl font-bold mt-1 text-white">{costs.filter(c=>c.type==='WhatsApp').reduce((acc,c)=>acc+c.quantity,0).toLocaleString()}</p></Card>
        </div>
        <Card>
            <table className="w-full">
                <thead><tr className="border-b border-zinc-800 text-left text-xs font-bold uppercase text-zinc-500"><th className="pb-4">Data</th><th className="pb-4">Tipo</th><th className="pb-4">Provedor</th><th className="pb-4 text-right">Qtd</th><th className="pb-4 text-right">Total</th></tr></thead>
                <tbody className="divide-y divide-zinc-800/50">
                    {costs.map(c => (
                        <tr key={c.id} className="hover:bg-zinc-800/30">
                            <td className="py-4 text-sm text-zinc-400">{formatDate(c.date)}</td>
                            <td className="py-4 text-sm"><span className={`px-2 py-1 rounded text-xs font-bold ${c.type==='SMS'?'bg-yellow-500/10 text-yellow-500':'bg-green-500/10 text-green-500'}`}>{c.type}</span></td>
                            <td className="py-4 text-sm text-white">{c.provider}</td>
                            <td className="py-4 text-sm text-right font-mono text-zinc-300">{c.quantity}</td>
                            <td className="py-4 text-sm text-right font-bold text-red-400">{formatCurrency(c.totalCostBRL)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    </div>
);

export const SettingsScreen: FC = () => (
    <div className="space-y-6">
        <PageHeader title="Configurações" subtitle="Parâmetros do sistema." />
        <Card>
            <h3 className="text-lg font-bold text-white mb-6">Integrações de API</h3>
            <div className="space-y-4 max-w-lg">
                <InputGroup label="Twilio Account SID" placeholder="ACxxxxxxxx" />
                <InputGroup label="Stripe Secret Key" placeholder="sk_live_xxxxxxxx" />
            </div>
        </Card>
    </div>
);
