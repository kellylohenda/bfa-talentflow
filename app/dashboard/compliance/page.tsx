'use client';

import React from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function CompliancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Compliance & Auditoria</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Lei 22/11, Conformidade e Relatórios de Auditoria
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardBody className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Conformidade Geral</p>
              <p className="text-3xl font-bold mt-2">95%</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Alertas Ativos</p>
              <p className="text-3xl font-bold mt-2">2</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Última Auditoria</p>
              <p className="text-xl font-bold mt-2">Há 15 dias</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-blue-600" />
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Verificações de Conformidade</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {[
              { name: 'Lei 22/11 - Conformidade', status: 'compliant', desc: 'Todos os registros em conformidade' },
              { name: 'GDPR/DPA - Privacidade de Dados', status: 'compliant', desc: 'Proteção de dados implementada' },
              { name: 'Auditoria Anual', status: 'compliant', desc: 'Última auditoria concluída' },
              { name: 'Documentação', status: 'warning', desc: '1 arquivo pendente de revisão' },
              { name: 'Permissões RLS', status: 'compliant', desc: 'Controle de acesso por função' },
            ].map((check, i) => (
              <div
                key={i}
                className="flex items-start justify-between p-4 border border-border-light dark:border-border-dark rounded-lg"
              >
                <div>
                  <h4 className="font-semibold">{check.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{check.desc}</p>
                </div>
                <Badge variant={check.status === 'compliant' ? 'success' : 'warning'}>
                  {check.status === 'compliant' ? '✓ Conforme' : '⚠️ Atenção'}
                </Badge>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Log de Auditoria (Últimas 5)</h2>
        </CardHeader>
        <CardBody className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-900">
                <th className="px-6 py-4 text-left font-semibold">Data/Hora</th>
                <th className="px-6 py-4 text-left font-semibold">Ação</th>
                <th className="px-6 py-4 text-left font-semibold">Usuário</th>
                <th className="px-6 py-4 text-left font-semibold">Resultado</th>
              </tr>
            </thead>
            <tbody>
              {[
                { time: '2024-05-05 14:30', action: 'Login', user: 'rh@bfa.ao', result: 'Sucesso' },
                { time: '2024-05-05 13:45', action: 'Modificação de Talento', user: 'director@bfa.ao', result: 'Sucesso' },
                { time: '2024-05-05 12:15', action: 'Exportação de Relatório', user: 'rh@bfa.ao', result: 'Sucesso' },
                { time: '2024-05-04 18:00', action: 'Login Falhado', user: 'unknown@bfa.ao', result: 'Falha' },
                { time: '2024-05-04 14:20', action: 'Aprovação de Pagamento', user: 'director@bfa.ao', result: 'Sucesso' },
              ].map((log, i) => (
                <tr key={i} className="border-b border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="px-6 py-4 font-medium">{log.time}</td>
                  <td className="px-6 py-4">{log.action}</td>
                  <td className="px-6 py-4">{log.user}</td>
                  <td className="px-6 py-4">
                    <Badge variant={log.result === 'Sucesso' ? 'success' : 'danger'}>
                      {log.result}
                    </Badge>
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
