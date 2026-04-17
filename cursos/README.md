# Módulos de Inducción y Reinducción - INFIBAGUÉ

## 📋 Descripción

Sistema integrado de inducción y reinducción para el personal de INFIBAGUÉ, diseñado para capacitar a ~200 servidores públicos en diferentes áreas institucionales con evidencia certificable para auditoría ICONTEC.

## 🎯 Características Principales

### ✨ Interactivo y Visual
- **Tarjetas expandibles** con información detallada
- **Estadísticas animadas** con efectos visuales
- **Personaje guía "Luminito"** que asiste durante el recorrido
- **Líneas de tiempo interactivas** para procesos
- **Animaciones suaves** y transiciones profesionales

### 📊 Evaluación Diferenciada
- **Personal Administrativo**: 5 preguntas complejas (500 puntos máx)
- **Personal Operativo**: 3 preguntas adaptadas (300 puntos máx)
- Aprobación mínima: **75%**
- Feedback inmediato por pregunta

### 🎓 Certificación Automática
- Generación automática de certificado PDF al aprobar
- Código único de verificación
- Datos del servidor y fecha de realización
- Válido como evidencia para auditoría ICONTEC

### 🔄 Flujo Inteligente
1. **Selección de perfil** (Administrativo/Operativo)
2. **Contenido interactivo** (6 módulos)
3. **Evaluación integrada** (diferenciada por perfil)
4. **Resultados y certificado** o **Reiniciar contenido** si no aprueba

## 📁 Estructura de Archivos

```
CAMPUS/
├── cursos/
│   ├── index.html                          # Índice de módulos disponibles
│   └── induccion-atencion-ciudadano.html   # Módulo de Atención al Ciudadano
├── css/
│   ├── main.css                            # Estilos globales del CAMPUS
│   ├── components.css                      # Componentes reutilizables
│   └── induccion.css                       # Estilos específicos de inducción
├── js/
│   └── induccion.js                        # Lógica completa del módulo
└── assets/
    ├── logo-entidad.png                    # Logo institucional
    └── plantilla-certificado.jpg           # (Futuro) Plantilla de certificado
```

## 🚀 Módulos Disponibles

### ✅ Atención al Ciudadano (Disponible)
- Atributos de buena atención
- Trámite de PQRSD (Ley 1755/2015)
- Comunicaciones oficiales
- Canales de atención
- Horarios institucionales
- **Duración**: ~45 minutos

### 🔧 Próximos Módulos (En Desarrollo)

1. **Gestión Humana**
   - Políticas de talento humano
   - Evaluación de desempeño
   - Desarrollo profesional

2. **Gestión Ambiental**
   - Políticas institucionales
   - Manejo de residuos
   - Uso eficiente de recursos

3. **Seguridad y Salud en el Trabajo**
   - Normas de seguridad
   - Prevención de riesgos
   - Protocolos de emergencia

4. **Planeación Estratégica**
   - Objetivos institucionales
   - Metas e indicadores
   - Alineación estratégica

## 💻 Uso del Sistema

### Para el Servidor:

1. **Acceder al índice de módulos**:
   ```
   /cursos/index.html
   ```

2. **Seleccionar módulo disponible** (ej: Atención al Ciudadano)

3. **Elegir perfil**:
   - 👨‍💼 Personal Administrativo
   - 👷‍♀️ Personal Operativo

4. **Completar el contenido**:
   - Navegar por los 6 módulos
   - Interactuar con tarjetas y elementos
   - Tomar apuntes si es necesario

5. **Realizar la evaluación**:
   - Responder todas las preguntas
   - Revisar feedback inmediato
   - Ver resultados finales

6. **Opciones según resultado**:
   - ✅ **Aprobado (≥75%)**: Descargar certificado PDF
   - ❌ **No aprobado (<75%)**: Revisar contenido nuevamente

### Para el Administrador:

- El progreso se guarda en `localStorage`
- Clave: `induccionINFIBAGUE`
- Estructura:
  ```javascript
  {
    modulo: 'atencion-ciudadano',
    perfil: 'administrativo' | 'operativo',
    aprobado: true | false,
    porcentaje: 85,
    puntuacion: 425,
    fecha: '2026-02-05T14:30:00Z',
    usuario: 'Nombre del Servidor'
  }
  ```

## 🎨 Paleta de Colores (Integrada con CAMPUS)

| Color | Variable CSS | Uso |
|-------|-------------|-----|
| **Azul Primario** | `--color-primary: #1e3a8a` | Headers, títulos principales |
| **Azul Claro** | `--color-primary-light: #3b82f6` | Gradientes, acentos |
| **Verde** | `--color-secondary: #059669` | Éxito, aprobación |
| **Naranja** | `--color-accent: #f59e0b` | Alertas, progreso |
| **Rojo** | `--color-error: #ef4444` | Errores, reprobación |

## 📱 Responsive

El sistema es completamente responsive y se adapta a:
- 💻 **Desktop** (1200px+)
- 📱 **Tablet** (768px - 1199px)
- 📱 **Móvil** (<768px)

## 🔐 Seguridad y Privacidad

- Los datos se guardan localmente (localStorage)
- No se envía información a servidores externos
- Los certificados incluyen código único de verificación
- Futuro: Integración con Supabase para persistencia en servidor

## 📈 Métricas y Reportes

### Datos Recopilados:
- Fecha y hora de realización
- Perfil seleccionado
- Puntuación obtenida
- Porcentaje de aprobación
- Estado (Aprobado/No aprobado)

### Futuras Implementaciones:
- Dashboard de administración
- Reportes por dependencia
- Estadísticas de aprobación
- Exportación a Excel/PDF
- Integración con ICONTEC

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Animaciones y diseño moderno
- **JavaScript (Vanilla)**: Lógica de negocio
- **jsPDF**: Generación de certificados PDF
- **Google Fonts**: Tipografía (Poppins, Inter)

## 📞 Soporte

Para problemas técnicos o dudas:
- **Oficina de Comunicaciones**: correspondencia@infibague.gov.co
- **Sistemas**: [Contacto interno]

## 📝 Notas Importantes

> [!IMPORTANT]
> - El certificado solo se genera si se aprueba con ≥75%
> - Si no se aprueba, se debe revisar nuevamente el contenido
> - Los datos se guardan localmente en el navegador
> - Recomendado usar Chrome, Firefox o Edge (última versión)

> [!WARNING]
> - No cerrar el navegador durante la evaluación
> - Completar la evaluación en una sola sesión
> - Guardar el certificado PDF inmediatamente al descargarlo

## 🏆 Evidencia para Auditoría ICONTEC

El sistema genera evidencia válida:
1. Certificado PDF con datos del servidor
2. Registro en localStorage con timestamp
3. Código único de verificación
4. Puntuación y porcentaje de aprobación

---

**Desarrollado para INFIBAGUÉ - 2026**  
*Sistema de Inducción y Reinducción Interactivo*
