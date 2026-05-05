'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Star, MessageCircle, Calendar, Plus } from 'lucide-react';

const sampleMentors = [
  {
    id: '1',
    name: 'Carlos Mendes',
    specialization: 'Banking & Finance',
    bio: 'Senior banker with 15+ years experience in international banking',
    experience: '15 anos',
    availability: 'available',
    rating: 4.8,
    mentees: 3,
  },
  {
    id: '2',
    name: 'Ana Silva',
    specialization: 'Risk Management',
    bio: 'Expert in risk analysis and compliance frameworks',
    experience: '12 anos',
    availability: 'limited',
    rating: 4.6,
    mentees: 2,
  },
  {
    id: '3',
    name: 'João Costa',
    specialization: 'Leadership & Strategy',
    bio: 'Former head of strategic planning at major financial institutions',
    experience: '18 anos',
    availability: 'available',
    rating: 4.9,
    mentees: 5,
  },
];

const sampleSessions = [
  {
    id: '1',
    talentName: 'Lwini Capemba',
    mentorName: 'Carlos Mendes',
    date: '2024-05-10',
    time: '14:00',
    duration: '60 min',
    status: 'scheduled',
  },
  {
    id: '2',
    talentName: 'Joaquim Tchindemba',
    mentorName: 'Ana Silva',
    date: '2024-05-08',
    time: '10:00',
    duration: '45 min',
    status: 'completed',
  },
];

export default function MentorsPage() {
  const [activeTab, setActiveTab] = useState('mentors');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mentoria</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gerenciamento de mentores e sessões
          </p>
        </div>
        <Button variant="primary" size="md">
          <Plus size={16} className="mr-2" />
          Agendar Sessão
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border-light dark:border-border-dark">
        <button
          onClick={() => setActiveTab('mentors')}
          className={`px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'mentors'
              ? 'border-brand-orange text-brand-orange'
              : 'border-transparent text-gray-600 dark:text-gray-400'
          }`}
        >
          Mentores
        </button>
        <button
          onClick={() => setActiveTab('sessions')}
          className={`px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'sessions'
              ? 'border-brand-orange text-brand-orange'
              : 'border-transparent text-gray-600 dark:text-gray-400'
          }`}
        >
          Sessões
        </button>
        <button
          onClick={() => setActiveTab('matching')}
          className={`px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'matching'
              ? 'border-brand-orange text-brand-orange'
              : 'border-transparent text-gray-600 dark:text-gray-400'
          }`}
        >
          Matching IA
        </button>
      </div>

      {/* Mentors Tab */}
      {activeTab === 'mentors' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sampleMentors.map((mentor) => (
            <Card key={mentor.id} className="hover:shadow-lg">
              <CardBody>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{mentor.name}</h3>
                    <p className="text-sm text-brand-orange font-semibold">
                      {mentor.specialization}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold text-sm">{mentor.rating}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {mentor.bio}
                </p>

                <div className="space-y-2 text-sm mb-4">
                  <p>
                    <span className="text-gray-500 dark:text-gray-400">Experiência:</span>{' '}
                    <span className="font-semibold">{mentor.experience}</span>
                  </p>
                  <p>
                    <span className="text-gray-500 dark:text-gray-400">Mentorandos:</span>{' '}
                    <span className="font-semibold">{mentor.mentees}</span>
                  </p>
                </div>

                <div className="flex gap-2">
                  <Badge
                    variant={mentor.availability === 'available' ? 'success' : 'warning'}
                    size="sm"
                  >
                    {mentor.availability === 'available' ? '✓ Disponível' : '⏳ Limitado'}
                  </Badge>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageCircle size={16} className="mr-1" />
                    Contactar
                  </Button>
                  <Button variant="primary" size="sm" className="flex-1">
                    <Calendar size={16} className="mr-1" />
                    Agendar
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Sessions Tab */}
      {activeTab === 'sessions' && (
        <Card>
          <CardBody className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-900">
                  <th className="px-6 py-4 text-left font-semibold">Talento</th>
                  <th className="px-6 py-4 text-left font-semibold">Mentor</th>
                  <th className="px-6 py-4 text-left font-semibold">Data & Hora</th>
                  <th className="px-6 py-4 text-left font-semibold">Duração</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {sampleSessions.map((session) => (
                  <tr
                    key={session.id}
                    className="border-b border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium">{session.talentName}</td>
                    <td className="px-6 py-4">{session.mentorName}</td>
                    <td className="px-6 py-4">
                      {new Date(session.date).toLocaleDateString('pt-PT')} às {session.time}
                    </td>
                    <td className="px-6 py-4">{session.duration}</td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={session.status === 'completed' ? 'success' : 'info'}
                        size="sm"
                      >
                        {session.status === 'completed' ? '✓ Concluído' : '📅 Agendado'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      )}

      {/* Matching IA Tab */}
      {activeTab === 'matching' && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Sistema de Matching IA</h2>
          </CardHeader>
          <CardBody>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Nosso algoritmo de IA recomenda as melhores combinações de mentor/mentorando baseado em:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-semibold mb-2">Especialização</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Alinhamento entre área de estudo/trabalho do talento e especialização do mentor
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-semibold mb-2">Disponibilidade</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Compatibilidade de horários e capacidade de mentoria
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-semibold mb-2">Experiência</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Nível de experiência adequado para o estágio de desenvolvimento
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-semibold mb-2">Compatibilidade</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Score de compatibilidade baseado em históricos de sucesso
                </p>
              </div>
            </div>
            <Button variant="primary" className="mt-6">
              Executar Matching
            </Button>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
