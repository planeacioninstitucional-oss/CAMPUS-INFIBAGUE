import React, { useState } from 'react';
import { BookIcon, TargetIcon, ActivityIcon, EyeIcon, ArrowRightIcon, PlayIcon, Button } from './ui';

// --- MÓDULO DE TEORÍA ---
export const ModuleTheory = ({ onComplete }) => {
    const [slide, setSlide] = useState(0);
    const slides = [
        {
            title: "¿Qué es INFIBAGUÉ?",
            icon: BookIcon,
            content: (
                <div className="space-y-4 text-left">
                    <p className="text-gray-700 leading-relaxed">
                        El <span className="font-bold text-infi-blue">Instituto de Financiamiento, Promoción y Desarrollo de Ibagué – INFIBAGUÉ</span>, es un establecimiento público del orden municipal.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600">
                        <li>Dotado de personería jurídica.</li>
                        <li>Autonomía administrativa y presupuestal.</li>
                        <li>Patrimonio propio e independiente.</li>
                    </ul>
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-infi-blue mt-4">
                        <p className="text-sm text-infi-blue font-semibold">Marco Legal</p>
                        <p className="text-xs text-gray-600">Se rige por la Constitución Política, la Ley 489 de 1998, Decreto 0183 de 2001 y sus modificaciones.</p>
                    </div>
                </div>
            )
        },
        {
            title: "Misión",
            icon: TargetIcon,
            content: (
                <div className="space-y-4 text-center">
                    <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 text-infi-blue">
                        <ActivityIcon size={40} />
                    </div>
                    <p className="text-gray-700 text-lg font-medium">
                        "Ser generador de desarrollo para la comunidad Ibaguereña."
                    </p>
                    <p className="text-gray-600 text-sm">
                        Mediante la oferta de productos financieros, creación de esquemas empresariales y prestación eficaz de servicios públicos con compromiso social.
                    </p>
                </div>
            )
        },
        {
            title: "Visión 2025",
            icon: EyeIcon,
            content: (
                <div className="space-y-4 text-center">
                    <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 text-infi-green">
                        <EyeIcon size={40} />
                    </div>
                    <p className="text-gray-700 text-lg font-medium">
                        "Núcleo de excelencia de la Administración Municipal."
                    </p>
                    <p className="text-gray-600 text-sm">
                        Generador y Promotor de esquemas empresariales para el desarrollo social, económico y ambiental del Municipio de Ibagué.
                    </p>
                </div>
            )
        }
    ];

    return (
        <div className="flex flex-col items-center w-full max-w-3xl mx-auto text-center h-full justify-center">
            <div className="mb-6 flex space-x-2">
                {slides.map((_, i) => (
                    <div key={i} className={`h-2 w-8 rounded-full transition-colors ${i === slide ? 'bg-infi-blue' : 'bg-gray-200'}`} />
                ))}
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl w-full relative overflow-hidden min-h-[400px] flex flex-col slide-left">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                    {React.createElement(slides[slide].icon, { size: 150, className: "text-infi-blue" })}
                </div>

                <h2 className="text-3xl font-bold text-infi-blue mb-8 flex items-center justify-center gap-3">
                    {React.createElement(slides[slide].icon, { size: 32 })}
                    {slides[slide].title}
                </h2>

                <div className="flex-1 flex flex-col justify-center relative z-10">
                    {slides[slide].content}
                </div>

                <div className="mt-8 flex justify-end">
                    {slide < slides.length - 1 ? (
                        <Button onClick={() => setSlide(s => s + 1)}>
                            Siguiente <ArrowRightIcon size={20} />
                        </Button>
                    ) : (
                        <Button variant="success" onClick={() => onComplete(100)}>
                            Ir a los Juegos <PlayIcon size={20} />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
