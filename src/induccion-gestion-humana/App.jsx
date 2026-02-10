import React, { useState, useEffect } from 'react';
import { ModuleTheory } from './components/Theory';
import { GameShareholders, GameProjects, GameStructure, GameValues, GameProcessPuzzle } from './components/Games';
import { ModuleEvaluation } from './components/Evaluation';
import { Button, Modal, UsersIcon, LayersIcon, ActivityIcon, StarIcon, PuzzleIcon, ClipboardCheckIcon, BookIcon, PlayIcon } from './components/ui';

// --- APP PRINCIPAL ---
const App = () => {
    const [gameState, setGameState] = useState('intro');
    const [currentModule, setCurrentModule] = useState(0);
    const [scores, setScores] = useState([0, 0, 0, 0, 0, 0, 0]);
    const [completedModules, setCompletedModules] = useState(new Set());
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const modules = [
        { id: 0, title: "Teoría Institucional", component: ModuleTheory, icon: BookIcon },
        { id: 1, title: "Accionistas", component: GameShareholders, icon: UsersIcon },
        { id: 2, title: "Líneas de Proyecto", component: GameProjects, icon: LayersIcon },
        { id: 3, title: "Estructura Org.", component: GameStructure, icon: ActivityIcon },
        { id: 4, title: "Valores", component: GameValues, icon: StarIcon },
        { id: 5, title: "Mapa de Procesos", component: GameProcessPuzzle, icon: PuzzleIcon },
        { id: 6, title: "Evaluación Final", component: ModuleEvaluation, icon: ClipboardCheckIcon }
    ];

    // Validar acceso al módulo al cargar
    useEffect(() => {
        const initModule = async () => {
            try {
                console.log('🔄 Iniciando Gestión Humana...');

                // 1. Validar Acceso
                let accessible = true;
                if (window.SupabaseProgress && window.SupabaseProgress.validateModuleAccess) {
                    accessible = await window.SupabaseProgress.validateModuleAccess('gestion_humana');
                } else if (typeof window.validateModuleAccess === 'function') {
                    accessible = await window.validateModuleAccess('gestion_humana');
                }

                if (!accessible) {
                    console.warn('⛔ Acceso denegado, redirigiendo...');
                    return; // validateModuleAccess maneja la redirección
                }

                // 2. Iniciar Módulo (Marcar como visto/en progreso)
                if (window.SupabaseProgress && window.SupabaseProgress.startModule) {
                    await window.SupabaseProgress.startModule('gestion_humana');
                } else if (typeof window.startModule === 'function') {
                    await window.startModule('gestion_humana');
                }

                console.log('✅ Módulo iniciado correctamente');

                // 3. Cargar progreso guardado
                try {
                    const progressKey = `gestion_humana_progress`;
                    const savedProgress = JSON.parse(localStorage.getItem(progressKey) || '{}');
                    const completed = new Set();
                    Object.keys(savedProgress).forEach(title => {
                        if (savedProgress[title].completed) {
                            const moduleIndex = modules.findIndex(m => m.title === title);
                            if (moduleIndex !== -1) {
                                completed.add(moduleIndex);
                            }
                        }
                    });
                    setCompletedModules(completed);
                    console.log('✅ Progreso cargado:', completed);
                } catch (err) {
                    console.error('Error cargando progreso:', err);
                }
            } catch (error) {
                console.error('❌ Error fatal inicializando módulo:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initModule();
    }, []);

    const handleModuleComplete = async (score) => {
        const newScores = [...scores];
        newScores[currentModule] = score;
        setScores(newScores);

        const currentModuleData = modules[currentModule];

        // Guardar en localStorage como respaldo
        try {
            const progressKey = `gestion_humana_progress`;
            const savedProgress = JSON.parse(localStorage.getItem(progressKey) || '{}');
            savedProgress[currentModuleData.title] = {
                completed: true,
                score: score,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem(progressKey, JSON.stringify(savedProgress));
            console.log(`✅ Progreso guardado: ${currentModuleData.title}`);
        } catch (err) {
            console.error('Error guardando en localStorage:', err);
        }

        // Guardar paso actual en Supabase
        if (typeof window.saveCurrentStep === 'function') {
            try {
                await window.saveCurrentStep('gestion_humana', currentModule, currentModuleData.title);
                console.log(`✅ Paso guardado en Supabase: ${currentModuleData.title}`);
            } catch (err) {
                console.error('Error guardando en Supabase:', err);
            }
        }

        // Actualizar estado de módulos completados
        setCompletedModules(prev => {
            const newCompleted = new Set(prev);
            newCompleted.add(currentModule);
            return newCompleted;
        });

        // Si es la evaluación final, el componente maneja todo internamente
        if (modules[currentModule].title === "Evaluación Final") {
            return;
        }

        setShowSuccessModal(true);
    };

    const nextModule = () => {
        setShowSuccessModal(false);
        if (currentModule < modules.length - 1) {
            setCurrentModule(prev => prev + 1);
        } else {
            setGameState('results'); // Not reachable normally due to new final evaluation logic
        }
    };

    const CurrentGame = modules[currentModule].component;
    const CurrentIcon = modules[currentModule].icon;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-infi-blue"></div>
            </div>
        );
    }

    if (gameState === 'intro') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 max-w-4xl w-full text-center relative overflow-hidden fade-in border border-white/50">
                    <div className="mb-8 flex justify-center relative z-10">
                        <div className="bg-gradient-to-r from-infi-blue to-blue-700 text-white p-6 rounded-2xl shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                            <h1 className="text-4xl font-black tracking-widest">INFIBAGUÉ</h1>
                            <p className="text-[10px] tracking-[0.2em] opacity-80 mt-1">INSTITUTO DE FINANCIAMIENTO</p>
                        </div>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-gray-800 mb-4 tracking-tight relative z-10">Inducción Gestión Humana</h2>
                    <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed relative z-10">
                        Bienvenido. Este módulo interactivo te guiará por nuestra teoría, estructura y valores, finalizando con una evaluación certificable.
                    </p>
                    <Button onClick={() => setGameState('playing')} className="mx-auto text-lg w-full md:w-auto relative z-10">Iniciar Recorrido <PlayIcon size={20} /></Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <header className="bg-white shadow-sm sticky top-0 z-30 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-infi-blue rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-md">IB</div>
                        <h1 className="font-bold text-gray-800 hidden md:block tracking-tight">Inducción Institucional</h1>
                    </div>
                    <div className="flex-1 max-w-md mx-4 md:mx-12">
                        <div className="flex justify-between text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-wider"><span>Progreso</span><span>{currentModule + 1} / {modules.length}</span></div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-infi-blue to-blue-400 transition-all duration-500 ease-out" style={{ width: `${((currentModule) / modules.length) * 100}%` }}></div></div>
                    </div>
                    <div className="text-sm font-bold text-infi-blue bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full shadow-sm flex items-center gap-2"><span className="hidden md:inline">{modules[currentModule].title}</span><CurrentIcon size={16} /></div>
                </div>
            </header>
            <main className="flex-1 p-4 md:p-6 flex items-center justify-center relative">
                <div className="absolute top-10 left-10 w-32 h-32 bg-infi-blue/5 rounded-full blur-2xl"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-infi-green/5 rounded-full blur-2xl"></div>
                <div className="w-full max-w-5xl glass-panel rounded-[2rem] p-4 md:p-8 fade-in min-h-[60vh] flex flex-col justify-center relative z-10">
                    <CurrentGame onComplete={handleModuleComplete} />
                </div>
            </main>
            <Modal isOpen={showSuccessModal} type="success" message={`Has completado: ${modules[currentModule].title}`} onNext={nextModule} />
        </div>
    );
};

export default App;
