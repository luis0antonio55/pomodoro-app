# Pomodoro con Análisis de Productividad

Aplicación web SPA desarrollada en JavaScript ES6+, HTML5 y CSS3. Implementa un temporizador Pomodoro configurable con categorías, historial, estadísticas, mapa de calor y reporte semanal, siguiendo la Especificación del Diseño del Sistema del proyecto.

## Características

- Temporizador para trabajo, descanso corto y descanso largo.
- Estados del temporizador: inactivo, en ejecución y pausado.
- Pausa visualmente evidente: badge amarillo, borde resaltado, fondo rayado y aviso textual.
- Configuración de duraciones entre 1 y 60 minutos.
- Gestión de categorías con color.
- Asignación de categoría a la sesión activa.
- Guardado automático de sesiones completadas.
- Cancelación sin guardar sesión.
- Historial persistente por fecha, hora, categoría y duración.
- Dashboard con:
  - Pomodoros por día.
  - Distribución por categoría.
  - Franjas horarias productivas.
  - Mapa de calor mensual.
- Reporte semanal con comparativa e insights personalizados.
- Notificaciones visuales con Web Notifications API.
- Notificación sonora con AudioContext API.
- Almacenamiento local sin servidor.
- Diseño responsivo para móvil, tableta y escritorio.
- Pruebas unitarias con Jest.

## Tecnologías

- JavaScript ES6+
- HTML5
- CSS3 con custom properties
- Chart.js 4.x
- localStorage
- Vite
- Jest + jsdom

## Estructura

```text
pomodoro-app/
├── index.html
├── css/
│   ├── main.css
│   ├── timer.css
│   └── stats.css
├── js/
│   ├── app.js
│   ├── config.js
│   ├── controllers/
│   │   ├── TimerController.js
│   │   ├── TaskController.js
│   │   └── StatsController.js
│   ├── models/
│   │   ├── TimerModel.js
│   │   ├── SessionModel.js
│   │   ├── TaskModel.js
│   │   └── ConfigModel.js
│   ├── modules/
│   │   ├── EventEmitter.js
│   │   ├── StorageModule.js
│   │   ├── StatsModule.js
│   │   ├── ReportModule.js
│   │   └── NotificationModule.js
│   └── views/
│       ├── TimerView.js
│       └── StatsView.js
├── tests/
│   ├── TimerModel.test.js
│   ├── StatsModule.test.js
│   └── StorageModule.test.js
└── docs/
    └── PLAN_IMPLEMENTACION.md
```

## Instalación

Requisitos:

- Node.js 18 o superior.
- npm.

Instalar dependencias:

```bash
npm install
```

Ejecutar en modo desarrollo:

```bash
npm run dev
```

Abrir la URL que indique Vite, normalmente:

```text
http://localhost:5173
```

## Ejecutar pruebas

```bash
npm test
```

## Uso

1. Abre la aplicación.
2. Selecciona una categoría activa.
3. Elige el modo: Trabajo, Descanso corto o Descanso largo.
4. Presiona **Iniciar**.
5. Usa **Pausar** para detener el conteo temporalmente. La pantalla mostrará claramente que está en pausa.
6. Usa **Reanudar** para continuar.
7. Al terminar, la sesión se guarda automáticamente y actualiza estadísticas y reporte.
8. En **Configuración** puedes ajustar duraciones, sonido, auto inicio y reiniciar datos.

## Almacenamiento

La aplicación guarda datos en el navegador usando estas claves:

```text
pomodoro:config
pomodoro:categories
pomodoro:sessions:AAAA-MM
```

No se envían datos a servidores externos.

## Módulos principales

### TimerModule

Gestiona inicio, pausa, reanudación, cancelación, reinicio y finalización del temporizador.

### TaskModule

Permite crear, editar y eliminar categorías. También alimenta el selector de categoría activa.

### SessionModule

Persiste sesiones completadas con metadatos: UUID, inicio, fin, duración, categoría, tipo y estado completado.

### StatsModule

Calcula métricas de productividad:

- Pomodoros por día.
- Distribución por categoría.
- Productividad por franja horaria.
- Mapa de calor mensual.
- Tiempo total productivo.

### ReportModule

Genera resumen semanal, comparación contra la semana anterior e insights personalizados.

### StorageModule

Abstrae operaciones de lectura, escritura, listado y eliminación en localStorage.

### NotificationModule

Emite alertas sonoras y visuales al finalizar intervalos.

## Notas de compatibilidad

- La Web Notifications API puede pedir permiso al navegador.
- Si el navegador no soporta notificaciones o audio, la app sigue funcionando sin interrupciones.
- Una vez cargada, la app funciona con datos locales del navegador.

## Validación contra casos de prueba del SDS

| ID | Estado |
|---|---|
| CP-01 Iniciar temporizador y finalizar | Cubierto |
| CP-02 Pausar y reanudar | Cubierto |
| CP-03 Cancelar sesión activa | Cubierto |
| CP-04 Crear categoría y asignarla | Cubierto |
| CP-05 Cambiar duración a 1 minuto | Cubierto |
| CP-06 Dashboard con cero sesiones | Cubierto |
| CP-07 Persistencia tras recargar | Cubierto |

## Autor

Luis Antonio Ávila Mares
