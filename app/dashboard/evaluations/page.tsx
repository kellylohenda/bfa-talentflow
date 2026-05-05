'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function EvaluationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Avaliações 360°</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Feedback de múltiplas perspectivas para desenvolvimento
        </p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Avaliações em Progresso</h2>
        </CardHeader>
        <CardBody>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-light dark:border-border-dark">
                <th className="px-6 py-4 text-left font-semibold">Talento</th>
                <th className="px-6 py-4 text-left font-semibold">Ciclo</th>
                <th className="px-6 py-4 text-left font-semibold">Respostas</th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Lwini Capemba', cycle: '2024 Q2', responses: '8/10', status: 'in_progress' },
                { name: 'Joaquim Tchindemba', cycle: '2024 Q2', responses: '10/10', status: 'completed' },
              ].map((item) => (
                <tr key={item.name} className="border-b border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="px-6 py-4 font-medium">{item.name}</td>
                  <td className="px-6 py-4">{item.cycle}</td>
                  <td className="px-6 py-4">{item.responses}</td>
                  <td className="px-6 py-4">
                    <Badge variant={item.status === 'completed' ? 'success' : 'warning'}>
                      {item.status === 'completed' ? '✓ Completo' : '⏳ Em andamento'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Ações Rápidas</h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <Button variant="outline" className="w-full">
              + Nova Avaliação
            </Button>
            <Button variant="outline" className="w-full">
              📊 Gerar Relatório
            </Button>
            <Button variant="outline" className="w-full">
              🔗 Compartilhar Link
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Estatísticas</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Média de Feedback</p>
                <p className="text-3xl font-bold">4.2/5.0</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Taxa de Conclusão</p>
                <p className="text-3xl font-bold">80%</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
