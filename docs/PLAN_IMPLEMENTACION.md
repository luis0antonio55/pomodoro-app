# Plan de implementación

Este proyecto se construyó siguiendo el SDS/DRS de la Aplicación Web Pomodoro con Análisis de Productividad.

## Objetivo

Entregar una SPA de un solo usuario, sin autenticación, con almacenamiento local, temporizador configurable, categorías, historial, estadísticas y reporte semanal.

## Requisitos cubiertos

| Requisito del documento | Implementación |
|---|---|
| Temporizador configurable trabajo / descanso corto / descanso largo | `TimerModel`, controles de modo y configuración de 1 a 60 minutos. |
| Pausar / reanudar sesión | Estado `PAUSADO`, botón cambia a reanudar, aviso visible y tarjeta con borde/animación. |
| Cancelar sesión | Cancela y descarta la sesión sin guardarla. |
| Gestión de categorías | CRUD básico de categorías con nombre, color y asignación a sesión activa. |
| Registro automático de sesiones | `SessionModel.save()` guarda sesiones completadas con UUID, fechas, duración, tipo y categoría. |
| Historial | Lista por fecha con categoría, hora y duración. |
| Dashboard | Gráfica por día, dona por categoría, barras por franja horaria y mapa de calor mensual. |
| Reporte semanal | Resumen, comparativa con semana anterior y tres insights personalizados. |
| Configuración | Duraciones, sonido, auto inicio y reinicio de datos. |
| Notificaciones | Web Notifications API y AudioContext con degradación si no están disponibles. |
| Almacenamiento local | `localStorage` con claves `pomodoro:config`, `pomodoro:categories`, `pomodoro:sessions:AAAA-MM`. |
| Responsividad | CSS adaptado desde 320 px. |
| Pruebas | Pruebas Jest para TimerModel, StatsModule y StorageModule. |

## Arquitectura

Se respeta el enfoque MVC y arquitectura en capas:

- Vista: `TimerView`, `StatsView`, HTML y CSS.
- Controlador: `TimerController`, `TaskController`, `StatsController`.
- Modelo: `TimerModel`, `SessionModel`, `TaskModel`, `ConfigModel`.
- Módulos: `StorageModule`, `StatsModule`, `ReportModule`, `NotificationModule`, `EventEmitter`.
- Persistencia: `localStorage`.

## Flujo principal

1. Usuario selecciona modo y categoría.
2. Presiona iniciar.
3. El modelo emite `timer:tick` cada segundo.
4. Al finalizar se emite `timer:complete`.
5. El controlador crea la sesión completada.
6. Se guarda en localStorage.
7. Se actualizan historial, estadísticas y reporte semanal.
8. Se muestra notificación visual y sonora.

## Pruebas recomendadas

- CP-01: configurar trabajo en 1 minuto e iniciar hasta finalizar.
- CP-02: iniciar, pausar, confirmar aviso visible y reanudar.
- CP-03: cancelar y verificar que no aparezca en historial.
- CP-04: crear categoría y asignarla a una sesión.
- CP-05: cambiar duración con sliders.
- CP-06: abrir sin datos y revisar dashboard vacío.
- CP-07: recargar navegador y verificar persistencia.
