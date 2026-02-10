
import os

file_path = r"c:\Users\Jarold\Desktop\CAMPUS\cursos\induccion-sst.html"

# New content to insert
new_phub_data = """Adaptation) --- */
        const phubData = [{
            id: 'inicio',
            title: 'Portal de Seguridad y Salud en el Trabajo',
            subtitle: 'INFIBAGUÉ',
            type: 'welcome',
            bgClass: 'phub-bg-welcome'
        }, {
            id: 'politica-general',
            title: 'Política de Seguridad y Salud',
            type: 'policy-details',
            bgClass: 'phub-bg-policy',
            description: 'Infibagué reconoce la importancia de su capital humano y adquiere el compromiso al más alto nivel de la organización en proteger el bienestar físico, mental y social.',
            boxes: [{
                icon: 'search',
                color: '#719245',
                title: 'Gestión de Riesgos',
                text: 'Identificar peligros, evaluar riesgos y establecer controles.'
            }, {
                icon: 'users',
                color: '#FFB800',
                title: 'Participación',
                text: 'Garantizar consulta y participación de funcionarios en el SG-SST.'
            }, {
                icon: 'clipboard-list',
                color: '#719245',
                title: 'Recursos',
                text: 'Designar recursos para mantenimiento y mejora del sistema.'
            }]
        }, {
            id: 'objetivos',
            title: 'Objetivos del Sistema',
            type: 'interactive-columns',
            bgClass: 'phub-bg-objectives',
            columns: [{
                title: 'Compromiso',
                color: '#719245',
                points: ['Evidenciar compromiso SST', 'Cumplir plan anual', 'Definir responsabilidades']
            }, {
                title: 'Prevención',
                color: '#FFB800',
                points: ['Identificar peligros', 'Minimizar accidentes', 'Capacitación anual']
            }, {
                title: 'Gestión',
                color: '#719245',
                points: ['Disminuir ausentismo', 'Autoevaluación SG - SST', 'Participación COPASST']
            }, {
                title: 'Mejora',
                color: '#FFB800',
                points: ['Auditoría anual', 'Acciones correctivas', 'Revisión directiva']
            }]
        }, {
            id: 'no-consumo',
            title: 'Política de No Consumo',
            tag: 'Alcohol y Drogas',
            type: 'warning-special',
            bgClass: 'phub-bg-noconsumo',
            description: 'Compromiso con la calidad de vida y hábitos saludables. Prohibición absoluta durante la labor.',
            rules: ['Ejemplo de buenas conductas', 'Prohibido consumo de cigarrillo', 'Prohibido alcohol y drogas', 'Participación en prevención', 'Búsqueda de ayuda voluntaria']
        }, {
            id: 'operativa',
            title: 'Seguridad y Protección',
            type: 'dual-cards',
            bgClass: 'phub-bg-operativa',
            sections: [{
                title: 'Seguridad Vial',
                icon: 'car',
                color: '#719245',
                text: 'Implementación del PESV para la prevención de accidentes de tránsito en todos los desplazamientos laborales.'
            }, {
                title: 'Uso de EPP',
                icon: 'hard-hat',
                color: '#FFB800',
                points: ['Suministro de equipos certificados', 'Uso obligatorio y correcto', 'Cuidado y reporte de daños']
            }]
        }];

        let phubStep = 0;

        function phubInit() {
            phubStep = 0;
            phubRender();
        }

        /* Handler for Main Buttons */
        function handlePhubNext() {
            if (phubStep < phubData.length - 1) {
                phubStep++;
                phubRender();
            } else {
                nextSlide(3); // Move to Slide 4
            }
        }

        function handlePhubPrev() {
            if (phubStep > 0) {
                phubStep--;
                phubRender();
            } else {
                prevSlide(3); // Move to Slide 2
            }
        }

        """

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
except UnicodeDecodeError:
    with open(file_path, 'r', encoding='latin-1') as f:
        content = f.read()

# Marcadores para encontrar la sección corrupta
start_marker = "Adaptation) --- */"
end_marker = "/* Initialize the accident module when Slide 7 is active */"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    # Reemplazar el contenido entre los marcadores
    new_content = content[:start_idx] + new_phub_data + content[end_idx:]
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Corrección aplicada exitosamente.")
else:
    print("No se encontraron los marcadores de inicio o fin.")
    print(f"Start index: {start_idx}")
    print(f"End index: {end_idx}")
