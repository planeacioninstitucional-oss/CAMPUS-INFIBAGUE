import React, { useState, useEffect } from 'react';
import { StarIcon } from './ui';

// 1. ACCIONISTAS
export const GameShareholders = ({ onComplete }) => {
    const [items, setItems] = useState([
        { id: 'p1', type: 'pct', val: '99.82%', correctTower: 't1' },
        { id: 'p2', type: 'pct', val: '7.14%', correctTower: 't2' },
        { id: 'p3', type: 'pct', val: '5.0%', correctTower: 't3' },
        { id: 'p4', type: 'pct', val: '1.07%', correctTower: 't4' },
        { id: 'n1', type: 'name', val: 'IBAL', correctTower: 't1' },
        { id: 'n2', type: 'name', val: 'Terminal', correctTower: 't2' },
        { id: 'n3', type: 'name', val: 'Ibagué Limpia', correctTower: 't3' },
        { id: 'n4', type: 'name', val: 'Fondo Regional', correctTower: 't4' },
    ].sort(() => Math.random() - 0.5));

    const [towers, setTowers] = useState({
        t1: { color: 'bg-infi-blue', height: 'h-64', nameSlot: null, pctSlot: null },
        t2: { color: 'bg-infi-yellow', height: 'h-32', nameSlot: null, pctSlot: null },
        t3: { color: 'bg-infi-pink', height: 'h-24', nameSlot: null, pctSlot: null },
        t4: { color: 'bg-infi-green', height: 'h-16', nameSlot: null, pctSlot: null },
    });

    const [selectedItem, setSelectedItem] = useState(null);

    const handleTowerClick = (towerId) => {
        if (!selectedItem) return;
        if (selectedItem.correctTower === towerId) {
            setTowers(prev => ({
                ...prev,
                [towerId]: {
                    ...prev[towerId],
                    [selectedItem.type === 'name' ? 'nameSlot' : 'pctSlot']: selectedItem
                }
            }));
            setItems(prev => prev.filter(i => i.id !== selectedItem.id));
            setSelectedItem(null);
        } else {
            setSelectedItem(null);
        }
    };

    useEffect(() => {
        const allFilled = Object.values(towers).every(t => t.nameSlot && t.pctSlot);
        if (allFilled) setTimeout(() => onComplete(100), 500);
    }, [towers, onComplete]);

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-infi-blue mb-2 text-center">Organiza los Accionistas</h2>
            <p className="text-gray-500 text-sm mb-6 text-center">Selecciona un elemento y toca la torre correspondiente según el tamaño de la participación.</p>

            <div className="flex items-end justify-center gap-2 md:gap-6 h-80 mb-8 w-full px-2">
                {Object.entries(towers).map(([id, t]) => (
                    <div key={id} onClick={() => handleTowerClick(id)} className="relative flex flex-col items-center justify-end w-20 md:w-32 cursor-pointer group">
                        <div className={`mb-2 p-1 md:p-2 rounded-lg text-xs md:text-sm font-bold bg-white shadow-md border-2 border-dashed border-gray-300 w-full text-center truncate ${t.pctSlot ? 'border-solid border-green-500 text-green-700 bg-green-50' : 'text-gray-400'}`}>
                            {t.pctSlot ? t.pctSlot.val : '%'}
                        </div>
                        <div className={`${t.color} ${t.height} w-full rounded-t-xl shadow-lg relative overflow-hidden group-hover:brightness-110 transition-all border-b-4 border-black/10`}>
                            <div className="absolute inset-0 bg-white/20 skew-x-12 -ml-4"></div>
                        </div>
                        <div className={`mt-2 p-1 md:p-2 rounded-lg text-[10px] md:text-sm font-bold bg-white shadow-md border-2 border-dashed border-gray-300 w-full text-center min-h-[40px] flex items-center justify-center ${t.nameSlot ? 'border-solid border-infi-blue text-infi-blue bg-blue-50' : 'text-gray-400'}`}>
                            {t.nameSlot ? t.nameSlot.val : 'Entidad'}
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-inner border border-gray-100 w-full flex flex-wrap gap-3 justify-center min-h-[100px]">
                {items.length === 0 ? <span className="text-green-500 font-bold flex items-center gap-2">¡Completado!</span> : items.map(item => (
                    <button key={item.id} onClick={() => setSelectedItem(item)} className={`px-4 py-2 rounded-full shadow-md text-xs md:text-sm font-bold transition-all hover:scale-105 active:scale-95 ${selectedItem?.id === item.id ? 'bg-infi-blue text-white ring-4 ring-blue-200 -translate-y-1' : 'bg-white text-gray-700 border border-gray-200'}`}>
                        {item.val}
                    </button>
                ))}
            </div>
        </div>
    );
};

// 2. PROYECTOS
export const GameProjects = ({ onComplete }) => {
    const categories = [
        { id: 'plazas', name: 'Plazas de Mercado', color: 'bg-infi-orange', icon: '🏪' },
        { id: 'alumbrado', name: 'Alumbrado Público', color: 'bg-red-500', icon: '💡' },
        { id: 'parques', name: 'Parques y Zonas', color: 'bg-infi-green', icon: '🌳' },
        { id: 'otros', name: 'Otros Proyectos', color: 'bg-infi-purple', icon: '🚀' },
    ];

    const [items, setItems] = useState([
        { id: 1, text: 'Mantenimiento de Plazas', cat: 'plazas' },
        { id: 2, text: 'Contratos de Uso', cat: 'plazas' },
        { id: 3, text: 'Modernización LED', cat: 'alumbrado' },
        { id: 4, text: 'Ampliación Cobertura', cat: 'alumbrado' },
        { id: 5, text: 'Talas y Podas', cat: 'parques' },
        { id: 6, text: 'Parques Biosaludables', cat: 'parques' },
        { id: 7, text: 'Bicicletas Públicas', cat: 'otros' },
        { id: 8, text: 'Eventos Feriales', cat: 'otros' },
    ].sort(() => Math.random() - 0.5));

    const [selected, setSelected] = useState(null);
    const [placed, setPlaced] = useState({ plazas: [], alumbrado: [], parques: [], otros: [] });

    const handleDrop = (catId) => {
        if (!selected) return;
        if (selected.cat === catId) {
            setPlaced(prev => ({ ...prev, [catId]: [...prev[catId], selected] }));
            setItems(prev => prev.filter(i => i.id !== selected.id));
            setSelected(null);
        } else {
            setSelected(null);
        }
    };

    useEffect(() => {
        if (items.length === 0) setTimeout(() => onComplete(100), 500);
    }, [items, onComplete]);

    return (
        <div className="max-w-5xl mx-auto w-full flex flex-col items-center">
            <h2 className="text-xl md:text-2xl font-bold text-infi-blue mb-2 text-center">Clasifica los Proyectos</h2>
            <p className="text-gray-500 text-sm mb-6 text-center">Selecciona una actividad y toca la categoría correcta.</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 w-full">
                {categories.map(cat => (
                    <div key={cat.id} onClick={() => handleDrop(cat.id)} className={`${cat.color} rounded-2xl p-3 md:p-4 text-white shadow-lg cursor-pointer transition-transform active:scale-95 relative min-h-[160px] flex flex-col`}>
                        <div className="text-2xl md:text-3xl mb-2 text-center drop-shadow-md">{cat.icon}</div>
                        <h3 className="font-bold leading-tight mb-3 text-center text-sm md:text-base">{cat.name}</h3>
                        <div className="bg-white/20 rounded-xl flex-1 p-2 space-y-1 overflow-y-auto max-h-[120px]">
                            {placed[cat.id].map(p => (
                                <div key={p.id} className="bg-white text-gray-800 text-[10px] md:text-xs p-1 px-2 rounded shadow-sm fade-in font-medium">{p.text}</div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white p-4 rounded-xl shadow border border-gray-200 min-h-[80px] flex flex-wrap gap-2 justify-center w-full">
                {items.length === 0 ? <span className="text-green-500 font-bold">¡Todas clasificadas!</span> : items.map(item => (
                    <button key={item.id} onClick={() => setSelected(item)} className={`px-3 py-2 rounded-lg text-xs md:text-sm font-semibold shadow-sm border transition-all ${selected?.id === item.id ? 'bg-gray-800 text-white transform scale-105 ring-2 ring-gray-400' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}>
                        {item.text}
                    </button>
                ))}
            </div>
        </div>
    );
};

// 3. ESTRUCTURA
export const GameStructure = ({ onComplete }) => {
    const [slots, setSlots] = useState({ top: null, manager: null, control: null, operational: null, financial: null });
    const [options, setOptions] = useState([
        { id: 'opt1', label: 'Consejo Directivo', target: 'top' },
        { id: 'opt2', label: 'Gerencia General', target: 'manager' },
        { id: 'opt3', label: 'Control Interno', target: 'control' },
        { id: 'opt4', label: 'Dirección Operativa', target: 'operational' },
        { id: 'opt5', label: 'Dirección Financiera', target: 'financial' }
    ].sort(() => Math.random() - 0.5));
    const [selected, setSelected] = useState(null);

    const placeItem = (target) => {
        if (!selected) return;
        if (selected.target === target) {
            setSlots(prev => ({ ...prev, [target]: selected }));
            setOptions(prev => prev.filter(o => o.id !== selected.id));
            setSelected(null);
        } else {
            setSelected(null);
        }
    };

    useEffect(() => {
        if (Object.values(slots).every(s => s !== null)) setTimeout(() => onComplete(100), 500);
    }, [slots, onComplete]);

    const Slot = ({ id, label, isWide }) => (
        <div onClick={() => !slots[id] && placeItem(id)} className={`border-2 border-dashed transition-all cursor-pointer flex items-center justify-center text-center p-2 rounded-lg font-bold text-xs md:text-sm ${slots[id] ? 'bg-infi-blue text-white border-transparent shadow-md scale-105' : 'border-gray-300 bg-gray-50 text-gray-400 hover:border-infi-blue hover:bg-blue-50'} ${isWide ? 'w-48 md:w-64 h-12 md:h-16' : 'w-24 md:w-32 h-16 md:h-20'}`}>
            {slots[id] ? slots[id].label : label}
        </div>
    );

    return (
        <div className="flex flex-col items-center w-full">
            <h2 className="text-xl md:text-2xl font-bold text-infi-blue mb-2">Completa la Estructura</h2>
            <p className="text-gray-500 text-sm mb-6">Selecciona el cargo y toca su ubicación en el organigrama.</p>

            <div className="flex flex-col items-center gap-4 md:gap-6 mb-8 relative p-4 bg-white/50 rounded-2xl border border-gray-100 shadow-sm">
                <Slot id="top" label="Máxima Autoridad" isWide />
                <div className="h-6 w-0.5 bg-gray-300"></div>
                <Slot id="manager" label="Cabeza Administrativa" isWide />
                <div className="w-full h-0.5 bg-gray-300 w-3/4 mt-2"></div>
                <div className="flex gap-2 md:gap-4 items-start pt-4">
                    <div className="flex flex-col items-center gap-2"><div className="h-4 w-0.5 bg-gray-300 -mt-4"></div><Slot id="control" label="Control y Gestión" /></div>
                    <div className="flex flex-col items-center gap-2"><div className="h-4 w-0.5 bg-gray-300 -mt-4"></div><Slot id="operational" label="Operaciones" /></div>
                    <div className="flex flex-col items-center gap-2"><div className="h-4 w-0.5 bg-gray-300 -mt-4"></div><Slot id="financial" label="Finanzas" /></div>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
                {options.map(opt => (
                    <button key={opt.id} onClick={() => setSelected(opt)} className={`px-3 py-2 rounded-lg shadow-sm font-medium transition-all text-xs md:text-sm ${selected?.id === opt.id ? 'bg-infi-blue text-white ring-2 ring-offset-2 ring-infi-blue' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

// 4. VALORES
export const GameValues = ({ onComplete }) => {
    const values = [
        { id: 'v1', name: 'Honestidad', def: 'Actuamos con la verdad y transparencia en el manejo de recursos públicos.' },
        { id: 'v2', name: 'Respeto', def: 'Reconocemos el valor de los demás y tratamos a todos con dignidad.' },
        { id: 'v3', name: 'Justicia', def: 'Tomamos decisiones imparciales dando a cada quien lo que corresponde.' },
        { id: 'v4', name: 'Compromiso', def: 'Damos más de lo esperado para cumplir los objetivos institucionales.' },
        { id: 'v5', name: 'Diligencia', def: 'Cumplimos nuestros deberes con atención, prontitud y eficiencia.' }
    ];

    const [currentIdx, setCurrentIdx] = useState(0);
    const [shuffledOptions, setShuffledOptions] = useState([]);
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        if (currentIdx < values.length) {
            setShuffledOptions(values.map(v => v.name).sort(() => Math.random() - 0.5));
        } else {
            setTimeout(() => onComplete(100), 500);
        }
    }, [currentIdx, onComplete]);

    const handleGuess = (valName) => {
        if (valName === values[currentIdx].name) {
            setFeedback('correct');
            setTimeout(() => { setFeedback(null); setCurrentIdx(prev => prev + 1); }, 1000);
        } else {
            setFeedback('wrong');
            setTimeout(() => setFeedback(null), 800);
        }
    };

    if (currentIdx >= values.length) return <div className="text-center text-2xl text-green-600 font-bold">¡Valores Completados!</div>;

    return (
        <div className="w-full max-w-2xl mx-auto text-center">
            <h2 className="text-xl md:text-2xl font-bold text-infi-blue mb-2">Valores Corporativos</h2>
            <p className="text-gray-500 mb-6 text-sm">¿A qué valor corresponde esta definición?</p>

            <div className="bg-white p-6 md:p-10 rounded-2xl shadow-xl border-t-8 border-infi-yellow mb-8 relative overflow-hidden min-h-[150px] flex items-center justify-center">
                <div className="absolute top-0 right-0 p-4 opacity-5 text-infi-blue"><StarIcon size={120} /></div>
                <h3 className="text-lg md:text-xl text-gray-800 font-medium italic relative z-10">"{values[currentIdx].def}"</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {shuffledOptions.map(opt => (
                    <button key={opt} onClick={() => handleGuess(opt)} disabled={feedback !== null} className={`p-4 rounded-xl font-bold text-sm md:text-lg transition-all shadow-sm border-b-4 ${feedback === 'correct' && opt === values[currentIdx].name ? 'bg-green-500 text-white border-green-700 scale-105' : ''} ${feedback === 'wrong' && opt !== values[currentIdx].name ? 'opacity-30' : ''} ${feedback === null ? 'bg-white text-infi-blue border-blue-100 hover:bg-blue-50 hover:border-blue-200 active:scale-95' : ''}`}>
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
};

// 5. MAPA DE PROCESOS
export const GameProcessPuzzle = ({ onComplete }) => {
    const [items, setItems] = useState([
        { id: 1, text: 'Gestión Estratégica', zone: 'strategic' },
        { id: 2, text: 'Gestión de TICs', zone: 'strategic' },
        { id: 3, text: 'Op. Financieras', zone: 'mission' },
        { id: 4, text: 'Promoción y Desarrollo', zone: 'mission' },
        { id: 5, text: 'Gestión Humana', zone: 'support' },
        { id: 6, text: 'Gestión Jurídica', zone: 'support' }
    ].sort(() => Math.random() - 0.5));

    const [placed, setPlaced] = useState({ strategic: [], mission: [], support: [] });
    const [selected, setSelected] = useState(null);

    const handleDrop = (zoneId) => {
        if (!selected) return;
        if (selected.zone === zoneId) {
            setPlaced(prev => ({ ...prev, [zoneId]: [...prev[zoneId], selected] }));
            setItems(prev => prev.filter(i => i.id !== selected.id));
            setSelected(null);
        } else {
            setSelected(null);
        }
    };

    useEffect(() => {
        if (items.length === 0) setTimeout(() => onComplete(100), 500);
    }, [items, onComplete]);

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
            <h2 className="text-xl md:text-2xl font-bold text-infi-blue mb-2 text-center">Arma el Mapa de Procesos</h2>
            <p className="text-gray-500 text-sm mb-6 text-center">Ubica cada proceso en su zona correspondiente.</p>

            <div className="relative w-full h-72 md:h-96 bg-gray-100 rounded-xl shadow-inner mb-6 overflow-hidden border-2 border-gray-200 select-none">
                <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 pointer-events-none opacity-10">
                    {[...Array(72)].map((_, i) => <div key={i} className="border border-gray-300"></div>)}
                </div>

                <div onClick={() => handleDrop('strategic')} className="absolute top-2 md:top-4 left-2 md:left-4 w-1/3 h-28 md:h-40 border-2 border-dashed border-gray-400 rounded-lg bg-gray-50 hover:bg-white flex flex-col items-center justify-start p-2 text-center cursor-pointer">
                    <span className="text-gray-500 font-bold mb-2 text-[10px] md:text-xs uppercase tracking-widest bg-gray-200 px-2 rounded-full">Estratégicos</span>
                    <div className="flex flex-wrap gap-1 justify-center w-full">
                        {placed.strategic.map(p => <div key={p.id} className="w-full bg-gray-600 text-white text-[9px] md:text-xs p-1 rounded font-medium shadow-sm">{p.text}</div>)}
                    </div>
                </div>

                <div onClick={() => handleDrop('mission')} className="absolute top-2 md:top-4 right-2 md:right-4 left-[38%] bottom-20 border-2 border-dashed border-orange-400 bg-orange-50/50 rounded-lg hover:bg-orange-50 flex flex-col items-center justify-center p-2 cursor-pointer">
                    <span className="text-orange-500 font-bold mb-2 text-[10px] md:text-xs uppercase tracking-widest bg-orange-100 px-2 rounded-full">Misionales</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full px-2">
                        {placed.mission.map(p => <div key={p.id} className="bg-orange-500 text-white text-[9px] md:text-xs p-2 rounded text-center shadow-sm font-medium">{p.text}</div>)}
                    </div>
                </div>

                <div onClick={() => handleDrop('support')} className="absolute bottom-2 md:bottom-4 left-2 md:left-4 right-2 md:right-4 h-16 md:h-20 border-2 border-dashed border-blue-400 bg-blue-50/50 rounded-lg hover:bg-blue-50 flex items-center justify-center gap-2 px-2 cursor-pointer">
                    <span className="text-blue-500 font-bold text-[10px] md:text-xs uppercase tracking-widest bg-blue-100 px-2 rounded-full mr-2">Apoyo</span>
                    <div className="flex gap-2 overflow-x-auto">
                        {placed.support.map(p => <div key={p.id} className="bg-blue-500 text-white text-[9px] md:text-xs p-1 px-2 rounded font-medium shadow-sm whitespace-nowrap">{p.text}</div>)}
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-center min-h-[80px] w-full">
                {items.length === 0 ? <span className="text-green-500 font-bold">¡Mapa Completado!</span> : items.map(item => (
                    <button key={item.id} onClick={() => setSelected(item)} className={`px-4 py-2 rounded-lg shadow-sm text-xs md:text-sm font-semibold transition-transform active:scale-95 ${selected?.id === item.id ? 'bg-gray-800 text-white ring-2 ring-gray-400 scale-105' : 'bg-white text-gray-700 border border-gray-200'}`}>
                        {item.text}
                    </button>
                ))}
            </div>
        </div>
    );
};
