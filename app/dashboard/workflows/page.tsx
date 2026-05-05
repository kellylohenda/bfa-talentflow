'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function WorkflowsPage() {
  const [workflows] = useState([
    {
      id: '1',
      title: 'Aprovação de Nova Candidatura',
      pending: 3,
      stages: ['Submissão', 'Triagem', 'Aprovação RH', 'Aprovação Direção'],
      status: 'active',
    },
    {
      id: '2',
      title: 'Processamento de Pagamentos',
      pending: 5,
      stages: ['Solicitação', 'Validação', 'Processamento', 'Confirmação'],
      status: 'active',
    },
    {
      id: '3',
      title: 'Onboarding de Bolseiro',
      pending: 1,
      stages: ['Documentação', 'Treinamento', 'Ativação', 'Confirmação'],
      status: 'active',
    },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Workflows de Aprovação</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Processos de autorização e controle
        </p>
      </div>

      {workflows.map((workflow) => (
        <Card key={workflow.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">{workflow.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  {workflow.pending} itens pendentes
                </p>
              </div>
              <Badge variant="warning">{workflow.pending}</Badge>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {workflow.stages.map((stage, i) => (
                  <React.Fragment key={i}>
                    <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium whitespace-nowrap">
                      {stage}
                    </div>
                    {i < workflow.stages.length - 1 && (
                      <div className="text-2xl text-gray-400">→</div>
                    )}
                  </React.Fragment>
                ))}
              </div>
              <Button variant="outline" className="w-full">
                Ver Detalhes
              </Button>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
