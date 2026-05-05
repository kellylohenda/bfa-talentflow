'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Filter, Download, Plus, DollarSign, TrendingUp } from 'lucide-react';

const samplePayments = [
  {
    id: '1',
    talentName: 'Lwini Capemba',
    amount: '25,000.00',
    month: 'Maio 2024',
    status: 'completed',
    method: 'Transferência Bancária',
  },
  {
    id: '2',
    talentName: 'Joaquim Tchindemba',
    amount: '25,000.00',
    month: 'Maio 2024',
    status: 'processing',
    method: 'SWIFT',
  },
  {
    id: '3',
    talentName: 'Nzinga Matondo',
    amount: '25,000.00',
    month: 'Maio 2024',
    status: 'pending',
    method: 'Cheque',
  },
];

const statusColors: Record<string, any> = {
  pending: 'warning',
  processing: 'info',
  completed: 'success',
  failed: 'danger',
};

const statusLabels: Record<string, string> = {
  pending: '⏳ Pendente',
  processing: '⚙️ Processando',
  completed: '✓ Concluído',
  failed: '✗ Falhou',
};

export default function PaymentsPage() {
  const [payments] = useState(samplePayments);
  const [filter, setFilter] = useState('all');

  const filteredPayments = filter === 'all' 
    ? payments 
    : payments.filter(p => p.status === filter);

  const totalAmount = payments.reduce((sum, p) => sum + parseFloat(p.amount.replace('.', '')), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Pagamentos</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Processamento e rastreamento de pagamentos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="md">
            <Download size={16} className="mr-2" />
            Relatório
          </Button>
          <Button variant="primary" size="md">
            <Plus size={16} className="mr-2" />
            Novo Pagamento
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Montante Total</p>
              <p className="text-3xl font-bold mt-2">Kz {totalAmount.toLocaleString('pt-PT')}</p>
            </div>
            <DollarSign className="w-8 h-8 text-brand-orange" />
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Processados</p>
              <p className="text-3xl font-bold mt-2">1</p>
            </div>
            <TrendingUp className="w-8 h-8 text-brand-green" />
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Pendentes</p>
              <p className="text-3xl font-bold mt-2">{payments.filter(p => p.status === 'pending').length}</p>
            </div>
            <Filter className="w-8 h-8 text-brand-blue" />
          </CardBody>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardBody className="flex gap-2">
          {['all', 'pending', 'processing', 'completed'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-brand-orange text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-text-dark dark:text-text-light hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {status === 'all' ? 'Todos' : statusLabels[status]}
            </button>
          ))}
        </CardBody>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardBody className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-900">
                <th className="px-6 py-4 text-left font-semibold">Talento</th>
                <th className="px-6 py-4 text-left font-semibold">Mês</th>
                <th className="px-6 py-4 text-right font-semibold">Montante</th>
                <th className="px-6 py-4 text-left font-semibold">Método</th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
                <th className="px-6 py-4 text-center font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-b border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  <td className="px-6 py-4 font-medium">{payment.talentName}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{payment.month}</td>
                  <td className="px-6 py-4 text-right font-semibold">Kz {payment.amount}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{payment.method}</td>
                  <td className="px-6 py-4">
                    <Badge variant={statusColors[payment.status]} size="sm">
                      {statusLabels[payment.status]}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-brand-orange hover:text-orange-700 transition-colors text-sm font-medium">
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}
