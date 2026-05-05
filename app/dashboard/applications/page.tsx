'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ChevronRight } from 'lucide-react';

const stages = ['submitted', 'screening', 'interview', 'assessment', 'offer', 'onboarding'];

const sampleApplications = [
  {
    id: '1',
    name: 'Lwini Capemba',
    program: 'Futuro BFA',
    stage: 'assessment',
    appliedDate: '2024-01-15',
  },
  {
    id: '2',
    name: 'Joaquim Tchindemba',
    program: 'Bolsa Internacional',
    stage: 'interview',
    appliedDate: '2024-01-10',
  },
  {
    id: '3',
    name: 'Nzinga Matondo',
    program: 'Bolsa Internacional',
    stage: 'offer',
    appliedDate: '2024-01-05',
  },
];

const stageLabels: Record<string, string> = {
  submitted: '📬 Enviada',
  screening: '🔍 Triagem',
  interview: '💬 Entrevista',
  assessment: '✍️ Avaliação',
  offer: '🎉 Oferta',
  onboarding: '🚀 Onboarding',
};

export default function ApplicationsPage() {
  const [applications] = useState(sampleApplications);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Candidaturas</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gerencie o funil de candidaturas
          </p>
        </div>
      </div>

      {/* Kanban-style columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stages.map((stage) => {
          const stageApplications = applications.filter((app) => app.stage === stage);
          return (
            <Card key={stage} className="min-h-96">
              <CardHeader className="bg-gray-50 dark:bg-gray-900">
                <h3 className="font-semibold text-lg">
                  {stageLabels[stage]} ({stageApplications.length})
                </h3>
              </CardHeader>
              <CardBody className="space-y-3 max-h-80 overflow-y-auto">
                {stageApplications.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-border-light dark:border-border-dark hover:shadow-md transition-shadow cursor-move"
                  >
                    <h4 className="font-semibold">{app.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {app.program}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Candidatura em: {new Date(app.appliedDate).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                ))}
                {stageApplications.length === 0 && (
                  <p className="text-center text-gray-400 py-8">Nenhuma candidatura</p>
                )}
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Estatísticas</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total</p>
              <p className="text-3xl font-bold mt-2">{applications.length}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Taxa de Conversão</p>
              <p className="text-3xl font-bold mt-2">42%</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Tempo Médio</p>
              <p className="text-3xl font-bold mt-2">28 dias</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
