import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props as any;

    return (
        <div className="relative grid min-h-screen grid-cols-1 lg:grid-cols-2 overflow-hidden">
            
            {/* Right Side: Form (Placed first for mobile priority if needed, or keeping it as is) */}
            <div className="flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white">
                <div className="w-full max-w-[380px] space-y-8">
                    {/* Mobile Logo */}
                    <Link href={home().url} className="lg:hidden flex justify-center mb-8">
                        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center p-2">
                             <AppLogoIcon className="w-full h-full fill-current text-white" />
                        </div>
                    </Link>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            {description}
                        </p>
                    </div>

                    <div className="pt-4">
                        {children}
                    </div>

                    <p className="text-center text-xs text-slate-400 pt-8">
                        © {new Date().getFullYear()} Banco de Fomento Angola. <br/>
                        Gestão de Talentos · Acesso Reservado.
                    </p>
                </div>
            </div>

            {/* Left Side: Visual Impact */}
            <div className="relative hidden lg:flex flex-col items-center justify-center p-12 overflow-hidden">
                {/* Background Image with Overlay */}
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 hover:scale-105" 
                    style={{ backgroundImage: 'url("/images/login-bg.png")' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
                
                {/* Content */}
                <div className="relative z-10 w-full max-w-lg space-y-6">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center p-2 border border-white/20">
                             <AppLogoIcon className="w-full h-full fill-current text-white" />
                        </div>
                        <span className="text-white font-bold text-xl tracking-tight">{name || 'BFA Talento'}</span>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-4xl font-bold text-white leading-tight">
                            A moldar o futuro da banca em Angola.
                        </h2>
                        <div className="w-20 h-1.5 bg-orange-500 rounded-full" />
                    </div>

                    <p className="text-slate-200 text-lg font-light leading-relaxed">
                        "O programa BFA Talento é o pilar da nossa excelência. Aqui, identificamos e potenciamos os líderes de amanhã."
                    </p>
                    
                    <div className="flex items-center gap-4 pt-4">
                        <div className="flex -space-x-2">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden">
                                    <div className="w-full h-full bg-orange-400/20" />
                                </div>
                            ))}
                        </div>
                        <span className="text-slate-400 text-sm">Junte-se a +2,400 talentos em todo o país.</span>
                    </div>
                </div>

                {/* Glassmorphism Badge */}
                <div className="absolute bottom-12 left-12 right-12 z-20">
                     <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-between">
                         <div>
                             <p className="text-white font-medium">Compliance APD</p>
                             <p className="text-white/50 text-xs">Dados protegidos (Lei 22/11)</p>
                         </div>
                         <div className="text-orange-500 font-bold text-sm">🔒 Conexão Segura</div>
                     </div>
                </div>
            </div>

        </div>
    );
}
