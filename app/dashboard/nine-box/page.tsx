'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const nineBoxData = [
  { name: 'Lwini Capemba', performance: 4.2, potential: 4.5 },
  { name: 'Joaquim Tchindemba', performance: 3.8, potential: 4.0 },
  { name: 'Nzinga Matondo', performance: 3.9, potential: 3.7 },
  { name: 'João Silva', performance: 3.5, potential: 3.2 },
  { name: 'Maria Costa', performance: 4.0, potential: 4.3 },
  { name: 'Pedro Mendes', performance: 3.2, potential: 3.8 },
];

const getQuadrantInfo = (performance: number, potential: number) => {
  if (performance >= 3.5 && potential >= 3.5) {
    if (performance >= 4.0 && potential >= 4.0) return { label: 'Star', color: 'bg-brand-orange', action: 'Promote/Develop' };
    if (performance >= 4.0) return { label: 'High Performer', color: 'bg-brand-green', action: 'Retain' };
    if (potential >= 4.0) return { label: 'High Potential', color: 'bg-brand-blue', action: 'Develop' };
    return { label: 'Core Talent', color: 'bg-brand-purple', action: 'Engage' };
  }
  if (performance < 3.0) return { label: 'Underperformer', color: 'bg-red-500', action: 'PIP' };
  if (potential < 3.0) return { label: 'Specialist', color: 'bg-yellow-500', action: 'Retain' };
  return { label: 'Developing', color: 'bg-gray-500', action: 'Develop' };
};

export default function NineBoxPage() {
  const [selectedTalent, setSelectedTalent] = useState<any>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Matriz 9-Box - Sucessão & Desenvolvimento</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Posicionamento de talentos por desempenho vs. potencial
        </p>
      </div>

      {/* Matrix */}
      <Card>
        <CardBody className="p-8">
          <div className="grid grid-cols-3 gap-1 bg-gray-200 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto">
            {/* Header rows/cols */}
            <div className="bg-white dark:bg-gray-800 p-4 text-center font-bold text-sm border border-gray-300 dark:border-gray-600">
              Potencial →
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 text-center font-bold text-xs border border-gray-300 dark:border-gray-600">
              Baixo
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 text-center font-bold text-xs border border-gray-300 dark:border-gray-600">
              Alto
            </div>

            {/* Row 1 - Low performance */}
            <div className="bg-white dark:bg-gray-800 p-4 text-center font-bold text-xs border border-gray-300 dark:border-gray-600">
              Baixo
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 border border-gray-300 dark:border-gray-600 flex items-center justify-center min-h-32">
              <div className="text-center">
                <p className="font-bold text-red-600">Underperformer</p>
                <p className="text-xs text-gray-500 mt-2">Ação: PIP</p>
              </div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 border border-gray-300 dark:border-gray-600 flex items-center justify-center min-h-32">
              <div className="text-center">
                <p className="font-bold text-yellow-600">Potencial Elevado</p>
                <p className="text-xs text-gray-500 mt-2">Ação: Develop</p>
              </div>
            </div>

            {/* Row 2 - Medium performance */}
            <div className="bg-white dark:bg-gray-800 p-4 text-center font-bold text-xs border border-gray-300 dark:border-gray-600">
              Médio
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 border border-gray-300 dark:border-gray-600 flex items-center justify-center min-h-32">
              <div className="text-center">
                <p className="font-bold text-gray-600">Especialista</p>
                <p className="text-xs text-gray-500 mt-2">Ação: Retain</p>
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 border border-gray-300 dark:border-gray-600 flex items-center justify-center min-h-32">
              <div className="text-center">
                <p className="font-bold text-blue-600">High Potential</p>
                <p className="text-xs text-gray-500 mt-2">Ação: Develop</p>
              </div>
            </div>

            {/* Row 3 - High performance */}
            <div className="bg-white dark:bg-gray-800 p-4 text-center font-bold text-xs border border-gray-300 dark:border-gray-600">
              Alto
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 border border-gray-300 dark:border-gray-600 flex items-center justify-center min-h-32">
              <div className="text-center">
                <p className="font-bold text-green-600">High Performer</p>
                <p className="text-xs text-gray-500 mt-2">Ação: Retain</p>
              </div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 border border-gray-300 dark:border-gray-600 flex items-center justify-center min-h-32">
              <div className="text-center">
                <p className="font-bold text-orange-600">⭐ Star</p>
                <p className="text-xs text-gray-500 mt-2">Ação: Promote</p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            <p className="mb-2 font-semibold">Legenda:</p>
            <p>Desempenho = Resultado alcançado vs. objetivos</p>
            <p>Potencial = Capacidade de crescimento futuro e promoção</p>
          </div>
        </CardBody>
      </Card>

      {/* Talents positioning */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Posicionamento de Talentos</h2>
        </CardHeader>
        <CardBody className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-900">
                <th className="px-6 py-4 text-left font-semibold">Talento</th>
                <th className="px-6 py-4 text-center font-semibold">Desempenho</th>
                <th className="px-6 py-4 text-center font-semibold">Potencial</th>
                <th className="px-6 py-4 text-left font-semibold">Categoria</th>
                <th className="px-6 py-4 text-left font-semibold">Ação Recomendada</th>
              </tr>
            </thead>
            <tbody>
              {nineBoxData.map((talent) => {
                const quadrant = getQuadrantInfo(talent.performance, talent.potential);
                return (
                  <tr
                    key={talent.name}
                    className="border-b border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer"
                    onClick={() => setSelectedTalent(talent)}
                  >
                    <td className="px-6 py-4 font-medium">{talent.name}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-semibold">
                        {talent.performance.toFixed(1)}/5.0
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-block bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-semibold">
                        {talent.potential.toFixed(1)}/5.0
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className="capitalize" variant="primary">
                        {quadrant.label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {quadrant.action}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {/* Development Actions */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Planos de Ação Recomendados</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: '⭐ Stars',
                description: 'Promover para posições de liderança',
                talents: ['Lwini Capemba'],
                color: 'bg-orange-50 dark:bg-orange-900/20',
              },
              {
                title: '🎯 High Potentials',
                description: 'Programas de desenvolvimento executivo',
                talents: ['Maria Costa'],
                color: 'bg-blue-50 dark:bg-blue-900/20',
              },
              {
                title: '⚙️ Core Talent',
                description: 'Manter engajado com oportunidades',
                talents: ['Joaquim Tchindemba', 'Nzinga Matondo'],
                color: 'bg-purple-50 dark:bg-purple-900/20',
              },
              {
                title: '🔧 Specialists',
                description: 'Reter expertise específica',
                talents: ['João Silva'],
                color: 'bg-yellow-50 dark:bg-yellow-900/20',
              },
            ].map((group) => (
              <div key={group.title} className={`p-6 rounded-lg border border-gray-200 dark:border-gray-700 ${group.color}`}>
                <h3 className="font-bold text-lg mb-2">{group.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{group.description}</p>
                <div className="space-y-1">
                  {group.talents.map((talent) => (
                    <p key={talent} className="text-sm font-medium">• {talent}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
