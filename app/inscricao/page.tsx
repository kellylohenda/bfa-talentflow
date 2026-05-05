'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

const steps = [
  {
    title: 'Informações Pessoais',
    fields: ['first_name', 'last_name', 'email', 'phone', 'date_of_birth', 'nationality'],
  },
  {
    title: 'Informações Académicas',
    fields: ['institution', 'course', 'academic_year', 'gpa'],
  },
  {
    title: 'Detalhes do Programa',
    fields: ['program', 'motivation', 'availability'],
  },
  {
    title: 'Revisão & Envio',
    fields: [],
  },
];

const programs = [
  'Futuro BFA',
  'Bolsa Internacional',
  'Bolsa Nacional',
  'Liderança+',
];

const institutions = [
  'Universidade Agostinho Neto (UAN)',
  'Universidade Católica de Angola (UCAN)',
  'Universidade Lusíada',
  'ISCTE - Instituto Universitário de Lisboa',
  'Universidade de Coimbra',
  'Universidade do Porto',
];

export default function InscricaoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    nationality: 'Angolano',
    institution: '',
    course: '',
    academic_year: '',
    gpa: '',
    program: '',
    motivation: '',
    availability: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCurrentStep(4); // Go to success screen
    } catch (error) {
      console.error('[v0] Submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (currentStep === 4) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-orange/10 to-brand-blue/10 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardBody className="py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-green rounded-full mb-6">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Candidatura Enviada!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Obrigado pela sua candidatura. Receberá um e-mail de confirmação em breve.
            </p>
            <Link href="/programa">
              <Button variant="primary" className="w-full">
                Voltar ao Início
              </Button>
            </Link>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-orange/10 to-brand-blue/10 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {steps.map((step, i) => (
              <div key={i} className="text-center flex-1">
                <div
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold mb-2 ${
                    i <= currentStep
                      ? 'bg-brand-orange text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {i + 1}
                </div>
                <p className="text-xs md:text-sm font-medium">{step.title}</p>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
            <div
              className="bg-brand-orange h-1 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardBody className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-2xl font-bold">{steps[currentStep].title}</h2>

              {/* Step 1: Personal Info */}
              {currentStep === 0 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="first_name"
                      placeholder="Primeiro Nome"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      required
                      className="px-4 py-2 border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                    />
                    <input
                      type="text"
                      name="last_name"
                      placeholder="Sobrenome"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      required
                      className="px-4 py-2 border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                    />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="E-mail"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Telefone (+244...)"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  />
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  />
                  <select
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white dark:bg-gray-800"
                  >
                    <option>Angolano</option>
                    <option>Estrangeiro (UE)</option>
                    <option>Outro</option>
                  </select>
                </div>
              )}

              {/* Step 2: Academic Info */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <select
                    name="institution"
                    value={formData.institution}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white dark:bg-gray-800"
                  >
                    <option value="">Selecione a Instituição</option>
                    {institutions.map((inst) => (
                      <option key={inst} value={inst}>
                        {inst}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    name="course"
                    placeholder="Curso"
                    value={formData.course}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  />
                  <input
                    type="text"
                    name="academic_year"
                    placeholder="Ano Académico (ex: 3º Ano)"
                    value={formData.academic_year}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  />
                  <input
                    type="number"
                    name="gpa"
                    placeholder="Nota Média (GPA)"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.gpa}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  />
                </div>
              )}

              {/* Step 3: Program Details */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <select
                    name="program"
                    value={formData.program}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white dark:bg-gray-800"
                  >
                    <option value="">Selecione o Programa</option>
                    {programs.map((prog) => (
                      <option key={prog} value={prog}>
                        {prog}
                      </option>
                    ))}
                  </select>
                  <textarea
                    name="motivation"
                    placeholder="Por que deseja participar neste programa?"
                    value={formData.motivation}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none"
                  ></textarea>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white dark:bg-gray-800"
                  >
                    <option value="">Disponibilidade</option>
                    <option value="immediate">Imediata</option>
                    <option value="2months">2-3 meses</option>
                    <option value="6months">6 meses</option>
                  </select>
                </div>
              )}

              {/* Step 4: Review */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Nome Completo</p>
                      <p className="font-semibold">
                        {formData.first_name} {formData.last_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">E-mail</p>
                      <p className="font-semibold">{formData.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Instituição</p>
                      <p className="font-semibold">{formData.institution}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Programa</p>
                      <p className="font-semibold">{formData.program}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 px-6 py-2 border border-border-light dark:border-border-dark rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <ChevronLeft size={18} />
                  Anterior
                </button>

                {currentStep === 3 ? (
                  <Button
                    variant="primary"
                    isLoading={loading}
                    onClick={handleSubmit}
                  >
                    Enviar Candidatura
                  </Button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-2 bg-brand-orange text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
                  >
                    Próximo
                    <ChevronRight size={18} />
                  </button>
                )}
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
