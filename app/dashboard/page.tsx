'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Users, TrendingUp, Award, Clock } from 'lucide-react';

const KPICard = ({ icon: Icon, label, value, change, color = 'text-brand-orange' }: any) => (
  <Card className="hover:shadow-lg">
    <CardBody className="flex items-start justify-between">
      <div>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{label}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
        <p className={`text-sm mt-2 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
        </p>
      </div>
      <Icon className={`w-8 h-8 ${color}`} />
    </CardBody>
  </Card>
);

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-text-dark dark:text-text-light">
          Bem-vindo, {user?.name || 'User'}!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          {new Date().toLocaleDateString('pt-PT', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          icon={Users}
          label="Total de Talentos"
          value="248"
          change={12}
          color="text-brand-orange"
        />
        <KPICard
          icon={TrendingUp}
          label="Candidaturas Ativas"
          value="42"
          change={8}
          color="text-brand-blue"
        />
        <KPICard
          icon={Award}
          label="Bolseiros Ativos"
          value="156"
          change={5}
          color="text-brand-green"
        />
        <KPICard
          icon={Clock}
          label="Sessões Pendentes"
          value="18"
          change={-3}
          color="text-brand-purple"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Ações Rápidas</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-center">
              ➕ Novo Talento
            </Button>
            <Button variant="outline" className="justify-center">
              📝 Nova Candidatura
            </Button>
            <Button variant="outline" className="justify-center">
              💰 Processar Pagamentos
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Atividades Recentes</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {[
              { label: 'Novo talento adicionado', status: 'completed', time: '2 horas atrás' },
              { label: 'Candidatura aprovada', status: 'completed', time: '5 horas atrás' },
              { label: 'Pagamento processado', status: 'completed', time: '1 dia atrás' },
              { label: 'Relatório pendente', status: 'pending', time: '3 dias atrás' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between pb-3 border-b border-border-light dark:border-border-dark last:border-0">
                <div>
                  <p className="font-medium">{activity.label}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                </div>
                <Badge variant={activity.status === 'completed' ? 'success' : 'warning'}>
                  {activity.status === 'completed' ? '✓ Concluído' : '⏳ Pendente'}
                </Badge>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
