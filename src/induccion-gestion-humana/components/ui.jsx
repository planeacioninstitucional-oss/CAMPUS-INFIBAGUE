import React from 'react';

// --- ICONOS SVG INTEGRADOS ---
export const Icon = ({ children, className, size = 24 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        {children}
    </svg>
);

export const UsersIcon = (p) => <Icon {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></Icon>;
export const LayersIcon = (p) => <Icon {...p}><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></Icon>;
export const ActivityIcon = (p) => <Icon {...p}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></Icon>;
export const StarIcon = (p) => <Icon {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></Icon>;
export const PuzzleIcon = (p) => <Icon {...p}><path d="M20.5 11H22a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1.5" /><path d="M8 22V20.5a2.5 2.5 0 0 1 5 0V22" /><path d="M2 13v-2a2 2 0 0 1 2-2h1.5" /><path d="M13 2a2.5 2.5 0 0 1 0 5H11" /><rect x="2" y="6" width="18" height="14" rx="2" /></Icon>;
export const PlayIcon = (p) => <Icon {...p}><polygon points="5 3 19 12 5 21 5 3" /></Icon>;
export const CheckIcon = (p) => <Icon {...p}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></Icon>;
export const XIcon = (p) => <Icon {...p}><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></Icon>;
export const TrophyIcon = (p) => <Icon {...p}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></Icon>;
export const BookIcon = (p) => <Icon {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></Icon>;
export const TargetIcon = (p) => <Icon {...p}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></Icon>;
export const EyeIcon = (p) => <Icon {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></Icon>;
export const ClipboardCheckIcon = (p) => <Icon {...p}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></Icon>;
export const ArrowRightIcon = (p) => <Icon {...p}><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></Icon>;
export const RefreshIcon = (p) => <Icon {...p}><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></Icon>;

// --- COMPONENTES UI GENÉRICOS ---

export const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
    const baseClass = "px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
        primary: "bg-gradient-to-r from-infi-blue to-blue-600 text-white hover:shadow-blue-500/30",
        secondary: "bg-white text-infi-blue border-2 border-infi-blue hover:bg-blue-50",
        success: "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-green-500/30",
        warning: "bg-infi-yellow text-gray-900 hover:shadow-yellow-500/30",
        danger: "bg-red-500 text-white hover:bg-red-600"
    };
    return <button onClick={onClick} disabled={disabled} className={`${baseClass} ${variants[variant]} ${className}`}>{children}</button>;
};

export const Modal = ({ isOpen, type, message, onNext }) => {
    if (!isOpen) return null;
    const isSuccess = type === 'success';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm fade-in p-4">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border-4 border-white bounce-in relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-2 ${isSuccess ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div className="mb-4 flex justify-center">
                    {isSuccess ?
                        <div className="p-4 bg-green-100 rounded-full text-green-600"><CheckIcon size={48} /></div> :
                        <div className="p-4 bg-red-100 rounded-full text-red-600"><XIcon size={48} /></div>
                    }
                </div>
                <h3 className="text-2xl font-bold mb-2 text-gray-800">{isSuccess ? '¡Excelente!' : 'Inténtalo de nuevo'}</h3>
                <p className="text-gray-600 mb-6">{message}</p>
                <Button onClick={onNext} variant={isSuccess ? 'success' : 'primary'} className="w-full">
                    {isSuccess ? 'Continuar' : 'Reintentar'}
                </Button>
            </div>
        </div>
    );
};
