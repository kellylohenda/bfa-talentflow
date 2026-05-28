import { Link, usePage } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';
import { ShieldCheck, BadgeCheck } from 'lucide-react';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props as any;

    return (
        <div className="relative grid min-h-screen grid-cols-1 lg:grid-cols-2 overflow-hidden bg-white">
            
            {/* Right Side: Form Content */}
            <div className="flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white z-10">
                <div className="w-full max-w-[400px] space-y-10">
                    {/* Brand Logo */}
                    <Link href={home().url} className="flex justify-start">
                         <img src="/images/logo-bfa.png" alt="BFA Logo" className="h-10 w-auto" />
                    </Link>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-extrabold tracking-tight text-[#333333] leading-tight">{title}</h1>
                        <p className="text-[#6B7280] text-base leading-relaxed font-medium">
                            {description}
                        </p>
                    </div>

                    <div className="pt-2">
                        {children}
                    </div>

                    <div className="pt-12 border-t border-[#F0F0F0] flex items-center justify-between text-[11px] font-bold text-[#9CA3AF] uppercase tracking-widest">
                        <span>© {new Date().getFullYear()} BFA Angola</span>
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={14} /> Conformidade APD
                        </div>
                    </div>
                </div>
            </div>

            {/* Left Side: Institutional Visual Impact */}
            <div className="relative hidden lg:flex flex-col items-center justify-center p-20 overflow-hidden bg-[#F5F5F5]">
                {/* Clean background pattern or human photo */}
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 opacity-20 grayscale" 
                    style={{ backgroundImage: 'url("/images/hero-graduates.png")' }}
                />
                
                <div className="relative z-10 w-full max-w-lg space-y-12">
                    <div className="space-y-6">
                        <div className="w-16 h-2 bg-[#F58220] rounded-full" />
                        <h2 className="text-6xl font-extrabold text-[#333333] leading-[1.1] tracking-tight">
                            A moldar o futuro da banca.
                        </h2>
                    </div>

                    <p className="text-[#4A4A4A] text-2xl font-medium leading-relaxed italic">
                        "O programa BFA Talento é o pilar da nossa excelência corporativa. Identificamos hoje os líderes de amanhã."
                    </p>
                    
                    <div className="flex items-center gap-6 pt-10">
                        <div className="flex -space-x-3">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-[#F58220]/20 flex items-center justify-center overflow-hidden shadow-lg">
                                    <div className="w-full h-full bg-[#F58220]/10" />
                                </div>
                            ))}
                        </div>
                        <span className="text-[#6B7280] text-sm font-bold uppercase tracking-wide">Junte-se a 2,400+ profissionais</span>
                    </div>
                </div>

                {/* Promotional Badge */}
                <div className="absolute bottom-20 left-20 right-20 z-20">
                     <div className="p-8 rounded-[18px] bg-white border border-[#E5E5E5] flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                         <div>
                             <p className="text-[#333333] font-extrabold tracking-tight text-lg mb-1">Rede Institucional</p>
                             <p className="text-[#6B7280] text-sm font-medium">BFA Angola · Excelência Financeira</p>
                         </div>
                         <div className="bg-[#FFF5F0] text-[#F58220] h-12 w-12 rounded-xl flex items-center justify-center">
                             <BadgeCheck size={28} />
                         </div>
                     </div>
                </div>
            </div>

        </div>
    );
}
