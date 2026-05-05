'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Zap, Users, Award, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem('user');
    if (userStr) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-border-light dark:border-border-dark bg-white dark:bg-gray-900">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-brand-orange">BFA TalentFlow</h1>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/programa">
              <Button variant="primary">Conhecer Programas</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Desenvolva seu <span className="text-brand-orange">Talento</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Sistema moderno de gestão de talentos e bolsas bancárias em Angola
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/inscricao">
              <Button variant="primary" size="lg">
                Candidatar-se <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Link href="/programa">
              <Button variant="outline" size="lg">
                Saber Mais
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-orange/10 rounded-lg mb-4">
              <Users className="w-8 h-8 text-brand-orange" />
            </div>
            <h3 className="font-bold text-lg mb-2">Gestão de Talentos</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Plataforma completa para identificar e desenvolver talento
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-blue/10 rounded-lg mb-4">
              <Award className="w-8 h-8 text-brand-blue" />
            </div>
            <h3 className="font-bold text-lg mb-2">Programas de Bolsas</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Múltiplas oportunidades de bolsas para estudos e desenvolvimento
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-green/10 rounded-lg mb-4">
              <TrendingUp className="w-8 h-8 text-brand-green" />
            </div>
            <h3 className="font-bold text-lg mb-2">Mentoria & Coaching</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Desenvolvimento profissional orientado por especialistas
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-purple/10 rounded-lg mb-4">
              <Zap className="w-8 h-8 text-brand-purple" />
            </div>
            <h3 className="font-bold text-lg mb-2">Avaliação Contínua</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Acompanhamento e feedback constante do seu desenvolvimento
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-orange text-white py-16 mt-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para transformar sua carreira?
          </h3>
          <p className="text-lg text-orange-100 mb-8">
            Junte-se a centenas de talentos que já beneficiaram dos nossos programas
          </p>
          <Link href="/inscricao">
            <Button variant="primary" size="lg" className="bg-white text-brand-orange hover:bg-gray-100">
              Candidatar-se Agora
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-lg mb-4">BFA TalentFlow</h4>
              <p className="text-gray-400">
                Desenvolvendo talentos para o futuro do banking angolano
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Links Rápidos</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/programa" className="hover:text-white transition-colors">Programas</Link></li>
                <li><Link href="/inscricao" className="hover:text-white transition-colors">Candidatar</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="mailto:info@bfa.ao" className="hover:text-white transition-colors">info@bfa.ao</a></li>
                <li><a href="tel:+244224123456" className="hover:text-white transition-colors">+244 22 412 3456</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BFA TalentFlow. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
