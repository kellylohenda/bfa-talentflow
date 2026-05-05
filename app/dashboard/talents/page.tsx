'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Search, Filter, Plus, Download, Eye } from 'lucide-react';

const sampleTalents = [
  {
    id: '1',
    name: 'Lwini Capemba',
    email: 'lwini.capemba@example.ao',
    institution: 'Universidade Agostinho Neto',
    course: 'Engenharia de Sistemas',
    location: 'Luanda',
    status: 'active',
    gpa: '4.2/5.0',
    program: 'Futuro BFA',
  },
  {
    id: '2',
    name: 'Joaquim Tchindemba',
    email: 'joaquim.tchindemba@example.ao',
    institution: 'ISCTE - Instituto Universitário de Lisboa',
    course: 'Gestão de Empresas',
    location: 'Lisboa',
    status: 'active',
    gpa: '3.8/5.0',
    program: 'Bolsa Internacional',
  },
  {
    id: '3',
    name: 'Nzinga Matondo',
    email: 'nzinga.matondo@example.ao',
    institution: 'Universidade Católica Portuguesa',
    course: 'Economia',
    location: 'Lisboa',
    status: 'active',
    gpa: '3.9/5.0',
    program: 'Bolsa Internacional',
  },
];

const statusColors: Record<string, any> = {
  active: 'success',
  candidate: 'info',
  onboarding: 'warning',
  completed: 'default',
  rejected: 'danger',
};

export default function TalentsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [talents, setTalents] = useState(sampleTalents);

  const filteredTalents = talents.filter((talent) => {
    const matchesSearch = talent.name.toLowerCase().includes(search.toLowerCase()) ||
      talent.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || talent.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Talentos</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gerencie todos os talentos e bolseiros
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="md">
            <Download size={16} className="mr-2" />
            Exportar
          </Button>
          <Button variant="primary" size="md">
            <Plus size={16} className="mr-2" />
            Novo Talento
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardBody>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="search"
                placeholder="Procurar por nome ou email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white dark:bg-gray-800"
            >
              <option value="all">Todos os Status</option>
              <option value="candidate">Candidatos</option>
              <option value="active">Ativos</option>
              <option value="onboarding">Onboarding</option>
              <option value="completed">Concluído</option>
            </select>
          </div>
        </CardBody>
      </Card>

      {/* Talents Table */}
      <Card>
        <CardBody className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-900">
                <th className="px-6 py-4 text-left font-semibold">Nome</th>
                <th className="px-6 py-4 text-left font-semibold">Email</th>
                <th className="px-6 py-4 text-left font-semibold">Instituição</th>
                <th className="px-6 py-4 text-left font-semibold">Programa</th>
                <th className="px-6 py-4 text-left font-semibold">GPA</th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
                <th className="px-6 py-4 text-center font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredTalents.map((talent) => (
                <tr
                  key={talent.id}
                  className="border-b border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  <td className="px-6 py-4 font-medium">{talent.name}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{talent.email}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{talent.institution}</td>
                  <td className="px-6 py-4">
                    <Badge variant="info" size="sm">
                      {talent.program}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 font-semibold">{talent.gpa}</td>
                  <td className="px-6 py-4">
                    <Badge variant={statusColors[talent.status]} size="sm">
                      {talent.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-brand-orange hover:text-orange-700 transition-colors">
                      <Eye size={18} />
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
