import { Link, usePage } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';
import { ShieldCheck } from 'lucide-react';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props as any;

    return (
        <div className="relative grid min-h-screen grid-cols-1 lg:grid-cols-2 overflow-hidden">
            
            {/* Right Side: Form */}
            <div className="flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white">
                <div className="w-full max-w-[380px] space-y-8">
                    {/* Mobile Logo */}
                    <Link href={home().url} className="lg:hidden flex justify-center mb-8">
                         <img src="/images/logo-bfa.png" alt="BFA Logo" className="h-10 w-auto" />
                    </Link>

                    <div className="space-y-3">
                        <h1 className="text-3xl font-bold tracking-tight text-[#231F5E]">{title}</h1>
                        <p className="text-slate-500 text-sm leading-relaxed font-medium">
                            {description}
                        </p>
                    </div>

                    <div className="pt-2">
                        {children}
                    </div>

                    <p className="text-center text-xs text-slate-400 pt-8 font-medium">
                        © {new Date().getFullYear()} Banco de Fomento Angola. <br/>
                        Gestão de Talentos · Acesso Reservado BFA.
                    </p>
                </div>
            </div>

            {/* Left Side: Visual Impact */}
            <div className="relative hidden lg:flex flex-col items-center justify-center p-12 overflow-hidden bg-[#231F5E]">
                {/* Background Image with Overlay */}
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 hover:scale-105 opacity-40" 
                    style={{ backgroundImage: 'url("/images/login-bg.png")' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#10162F] via-[#231F5E]/60 to-transparent" />
                
                {/* Content */}
                <div className="relative z-10 w-full max-w-lg space-y-8">
                    <div className="flex items-center gap-4 mb-8">
                         <img src="/images/logo-bfa.png" alt="BFA Logo" className="h-12 w-auto filter brightness-0 invert" />
                         <div className="h-8 w-[1px] bg-white/20 mx-1" />
                         <span className="text-white font-bold text-xl tracking-tight">{name || 'Talento'}</span>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-5xl font-bold text-white leading-[1.1] tracking-tight">
                            A moldar o futuro da banca em Angola.
                        </h2>
                        <div className="w-20 h-1.5 bg-[#FF6600] rounded-full" />
                    </div>

                    <p className="text-slate-200 text-xl font-light leading-relaxed max-w-md">
                        "O programa BFA Talento é o pilar da nossa excelência corporativa. Identificamos hoje os líderes de amanhã."
                    </p>
                    
                    <div className="flex items-center gap-4 pt-6">
                        <div className="flex -space-x-3">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#231F5E] bg-slate-800 flex items-center justify-center overflow-hidden shadow-xl">
                                    <div className="w-full h-full bg-[#FF6600]/20" />
                                </div>
                            ))}
                        </div>
                        <span className="text-slate-300 text-sm font-medium">Junte-se a +2,400 talentos BFA.</span>
                    </div>
                </div>

                {/* Glassmorphism Badge */}
                <div className="absolute bottom-12 left-12 right-12 z-20">
                     <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-between shadow-2xl">
                         <div>
                             <p className="text-white font-bold tracking-tight">Conformidade APD</p>
                             <p className="text-white/60 text-xs font-medium">Dados protegidos (Lei 22/11)</p>
                         </div>
                         <div className="text-[#FF6600] font-bold text-sm flex items-center gap-2">
                             <ShieldCheck size={20} /> Acesso Seguro
                         </div>
                     </div>
                </div>
            </div>

        </div>
    );
}
