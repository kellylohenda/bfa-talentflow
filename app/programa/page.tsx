'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChevronRight, Award, Globe, Zap, Users } from 'lucide-react';

const programs = [
  {
    id: 1,
    name: 'Futuro BFA',
    description: 'Programa de formação e desenvolvimento para talentos em Angola',
    duration: '12 meses',
    stipend: 'Kz 25,000/mês',
    icon: '🇦🇴',
  },
  {
    id: 2,
    name: 'Bolsa Internacional',
    description: 'Oportunidade de estudo em universidades de excelência na Europa',
    duration: '24 meses',
    stipend: 'Até Kz 60,000/mês',
    icon: '🌍',
  },
  {
    id: 3,
    name: 'Bolsa Nacional',
    description: 'Apoio financeiro para estudantes em instituições nacionais',
    duration: '12 meses',
    stipend: 'Kz 15,000/mês',
    icon: '🎓',
  },
  {
    id: 4,
    name: 'Liderança+',
    description: 'Desenvolvimento de competências de liderança e gestão',
    duration: '6 meses',
    stipend: 'Programa + Bolsa',
    icon: '⭐',
  },
];

const requirements = [
  { title: 'Nacionalidade', description: 'Cidadão angolano ou residente' },
  { title: 'Idade', description: 'Mínimo 18 anos no momento da candidatura' },
  { title: 'Académico', description: 'Diploma de ensino secundário completo' },
  { title: 'Idiomas', description: 'Proficiência em português e/ou inglês' },
];

const timeline = [
  { step: 1, label: 'Candidatura', date: 'Envie seu formulário' },
  { step: 2, label: 'Triagem', date: 'Análise de documentos' },
  { step: 3, label: 'Entrevista', date: 'Avaliação pessoal' },
  { step: 4, label: 'Resultado', date: 'Decisão final' },
];

export default function ProgramaPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-brand-orange to-orange-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">BFA TalentFlow</h1>
          <p className="text-xl text-orange-100 mb-8">
            Programa de Desenvolvimento de Talentos & Bolsas Bancárias
          </p>
          <Link href="/inscricao">
            <Button variant="primary" className="bg-white text-brand-orange hover:bg-gray-100">
              Candidatar-se Agora <ChevronRight size={18} className="ml-2" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Sobre os Programas */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Nossos Programas</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Descubra oportunidades de desenvolvimento profissional e bolsas de estudo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((program) => (
              <Card key={program.id} className="hover:shadow-lg">
                <CardBody>
                  <div className="text-4xl mb-4">{program.icon}</div>
                  <h3 className="text-lg font-bold mb-2">{program.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {program.description}
                  </p>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-semibold">Duração:</span> {program.duration}
                    </p>
                    <p>
                      <span className="font-semibold">Bolsa:</span> {program.stipend}
                    </p>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </section>

        {/* Requisitos */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Requisitos de Elegibilidade</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              O que você precisa para se candidatar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requirements.map((req, i) => (
              <Card key={i} className="hover:shadow-lg">
                <CardBody className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-brand-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-brand-orange" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{req.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {req.description}
                    </p>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </section>

        {/* Processo de Candidatura */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Processo de Candidatura</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              4 passos simples para se candidatar
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-2">
            {timeline.map((item, i) => (
              <React.Fragment key={i}>
                <Card className="flex-1 hover:shadow-lg">
                  <CardBody className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-orange text-white rounded-full font-bold text-lg mb-4">
                      {item.step}
                    </div>
                    <h3 className="font-bold text-lg">{item.label}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
                      {item.date}
                    </p>
                  </CardBody>
                </Card>
                {i < timeline.length - 1 && (
                  <ChevronRight className="hidden md:block text-gray-400" size={24} />
                )}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* CTA Final */}
        <section className="bg-gradient-to-r from-brand-orange/10 to-brand-blue/10 rounded-xl p-12 text-center border border-brand-orange/20">
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Submeta sua candidatura hoje e junte-se a uma comunidade de talentos em crescimento
          </p>
          <Link href="/inscricao">
            <Button variant="primary" size="lg">
              Candidatar-se Agora
            </Button>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-400">
          <p>&copy; 2024 BFA TalentFlow. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
