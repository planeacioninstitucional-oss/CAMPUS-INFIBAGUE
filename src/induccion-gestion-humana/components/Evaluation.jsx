import { saveModuleProgress } from '../utils/db';
import React, { useState, useEffect } from 'react';
import { ClipboardCheckIcon, CheckIcon, XIcon, TrophyIcon, RefreshIcon, ArrowRightIcon, Button } from './ui';
import { supabase } from '@/lib/supabase';

// --- MÓDULO DE EVALUACIÓN ---
export const ModuleEvaluation = ({ onComplete }) => {
    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [markedAsDone, setMarkedAsDone] = useState(false);
    const [saving, setSaving] = useState(false);

    const questions = [
        {
            q: "¿Cuál es la misión principal de Infibagué?",
            options: [
                "Proporcionar servicios de alumbrado público y limpieza",
                "Ser generadora de desarrollo para la comunidad Ibaguereña",
                "Gestionar los parques y zonas verdes",
                "Administrar las plazas de mercado"
            ],
            correct: 1
        },
        {
            q: "¿Cuáles son los valores del Código de Integridad?",
            options: [
                "Honestidad, Respeto, Justicia, Diligencia y Compromiso",
                "Responsabilidad, Puntualidad y Respeto",
                "Solidaridad, Amor y Paz",
                "Eficacia, Eficiencia y Economía"
            ],
            correct: 0
        },
        {
            q: "Mencione alguna de las funciones de Infibagué:",
            options: [
                "Prestación de Servicios Financieros y de Garantía",
                "Recolección de basuras",
                "Vigilancia de tránsito",
                "Educación escolar"
            ],
            correct: 0
        },
        {
            q: "¿Cuáles son las Actividades Transitorias (Decreto 183 de 2001)?",
            options: [
                "Alumbrado Público, Plazas de Mercado, Parques y Zonas Verdes",
                "Transporte masivo y terminales",
                "Salud y saneamiento",
                "Cultura y deporte"
            ],
            correct: 0
        },
        {
            q: "Según el Mapa de Procesos, los procesos son:",
            options: [
                "Estratégicos, Misionales, Evaluación y Apoyo",
                "Gerenciales, Operativos y Financieros",
                "Internos y Externos",
                "Primarios y Secundarios"
            ],
            correct: 0
        },
        {
            q: "Planes que maneja la Oficina de Gestión Humana:",
            options: [
                "Plan de Bienestar, Capacitación, Estímulos e Incentivos",
                "Plan de Desarrollo Municipal",
                "Plan de Ordenamiento Territorial",
                "Plan de Compras"
            ],
            correct: 0
        },
        {
            q: "Indica las cuatro Direcciones que componen la estructura:",
            options: [
                "Dir. Proyectos",
                "Dir. Servicios Administrativos",
                "Dir. Financiera",
                "Todas las anteriores (incluye Operativa y Comercial)"
            ],
            correct: 3
        }
    ];

    const handleAnswer = (index) => {
        if (selectedOption !== null) return;
        setSelectedOption(index);

        const correct = index === questions[currentQ].correct;
        setIsCorrect(correct);
        if (correct) setScore(s => s + 1);

        setTimeout(() => {
            if (currentQ < questions.length - 1) {
                setCurrentQ(prev => prev + 1);
                setSelectedOption(null);
                setIsCorrect(null);
            } else {
                setFinished(true);
            }
        }, 1500);
    };

    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 70; // 70% threshold as requested

    const saveProgress = async () => {
        setSaving(true);
        try {
            // Priority 1: Use the robust helper from db.js
            const saved = await saveModuleProgress(percentage);

            if (saved) {
                setMarkedAsDone(true);
                console.log('✅ Progreso guardado correctamente en Supabase (DB Helper)');
                return;
            }

            // Priority 2: Fallback to global progress system if db helper failed or returned false
            if (window.SupabaseProgress && window.SupabaseProgress.finishModuleAndNavigate) {
                await window.SupabaseProgress.finishModuleAndNavigate('gestion_humana', score, questions.length, false);
                setMarkedAsDone(true);
            } else {
                console.warn('⚠️ No se pudo guardar el progreso por ningún método.');
            }
        } catch (error) {
            console.error('❌ Error guardando progreso:', error);
        } finally {
            setSaving(false);
        }
    };

    // Guardar progreso automáticamente si aprueba
    useEffect(() => {
        if (finished && passed && !markedAsDone && !saving) {
            saveProgress();
        }
    }, [finished, passed]);

    const handleRetry = () => {
        setCurrentQ(0);
        setScore(0);
        setFinished(false);
        setSelectedOption(null);
        setIsCorrect(null);
        setMarkedAsDone(false);
    };

    const handleContinue = async () => {
        // FIX DEFINITIVO: Validar guardado antes de redirigir
        if (window.completeModule) {
            const success = await window.completeModule('gestion_humana');

            if (!success) {
                alert('Error guardando progreso. Por favor verifica tu conexión e intenta de nuevo.');
                return;
            }
        }

        // Redirigir al siguiente módulo solo si se guardó
        window.location.href = 'induccion-gestion-ambiental.html';
    };

    if (finished) {
        return (
            <div className="w-full max-w-2xl mx-auto text-center bounce-in">
                <div className="bg-white p-10 rounded-3xl shadow-2xl relative overflow-hidden">
                    {passed ? (
                        <>
                            <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500"></div>
                            <div className="mb-6 inline-block p-4 rounded-full bg-emerald-100 text-emerald-600 scale-110">
                                <TrophyIcon size={64} />
                            </div>

                            <h2 id="result-title" className="text-3xl font-bold text-gray-800 mb-2">
                                ¡Felicitaciones!
                            </h2>
                            <p id="result-message" className="text-gray-600 mb-4">
                                Has aprobado la evaluación de Gestión Humana. Tu progreso ha sido guardado.
                            </p>

                            <h1 id="final-score" className="text-5xl font-black mb-4 text-emerald-600">
                                {percentage}%
                            </h1>

                            <div className="fade-in">
                                {/* Visual Confirmation */}
                                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-5 mb-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 opacity-10">
                                        <CheckIcon size={80} className="text-emerald-500" />
                                    </div>
                                    <div className="flex items-center justify-center gap-3 mb-2">
                                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                                        <span className="text-emerald-700 font-bold text-lg">Módulo Completado</span>
                                    </div>
                                    <p className="text-emerald-600 text-sm">
                                        Se ha registrado tu aprobación en el sistema.
                                    </p>
                                </div>

                                <button
                                    id="continue-btn"
                                    onClick={handleContinue}
                                    className="w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white hover:shadow-green-500/40 hover:shadow-2xl border-b-4 border-emerald-700"
                                >
                                    Continuar a Gestión Ambiental <ArrowRightIcon />
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="absolute top-0 left-0 w-full h-4 bg-red-500"></div>
                            <div className="mb-6 inline-block p-4 bg-red-100 text-red-600 rounded-full">
                                <RefreshIcon size={64} />
                            </div>

                            <h2 id="result-title" className="text-3xl font-bold text-gray-800 mb-2">Inténtalo de nuevo</h2>
                            <p id="result-message" className="text-gray-600 mb-2">
                                Necesitas un 70% para aprobar y avanzar.
                            </p>

                            <h1 id="final-score" className="text-5xl font-black text-red-500 mb-4">
                                {percentage}%
                            </h1>

                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                                <p className="text-red-700 text-sm font-medium">⚠️ No has alcanzado el puntaje mínimo. Debes repetir la evaluación.</p>
                            </div>

                            <button
                                id="retry-btn"
                                onClick={handleRetry}
                                className="w-full py-3 px-6 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg bg-red-500 text-white hover:bg-red-600 flex items-center justify-center gap-2"
                            >
                                Repetir Evaluación <RefreshIcon />
                            </button>
                        </>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-infi-blue flex gap-2 items-center">
                    <ClipboardCheckIcon /> Evaluación Final
                </h2>
                <span className="bg-blue-100 text-infi-blue px-3 py-1 rounded-full text-sm font-bold">
                    {currentQ + 1} / {questions.length}
                </span>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden min-h-[300px]">
                <h3 className="text-xl font-semibold text-gray-800 mb-8">{questions[currentQ].q}</h3>

                <div className="space-y-3">
                    {questions[currentQ].options.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            disabled={selectedOption !== null}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all flex justify-between items-center
                                ${selectedOption === null ? 'border-gray-200 hover:border-infi-blue hover:bg-blue-50' : ''}
                                ${selectedOption === idx && isCorrect ? 'border-green-500 bg-green-50 text-green-700' : ''}
                                ${selectedOption === idx && !isCorrect ? 'border-red-500 bg-red-50 text-red-700' : ''}
                                ${selectedOption !== null && idx === questions[currentQ].correct ? 'border-green-500 bg-green-50 text-green-700 ring-2 ring-green-200' : ''}
                            `}
                        >
                            <span className="font-medium">{opt}</span>
                            {selectedOption !== null && idx === questions[currentQ].correct && <CheckIcon className="text-green-600" />}
                            {selectedOption === idx && !isCorrect && <XIcon className="text-red-600" />}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
