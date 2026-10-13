import type { DecisionOption, RealWorldPrecedent, TaskTemplate } from "@/types/tasks";
import { BOSS_NAME } from "./narrativeDialogs";

/** Tupla compacta de impacto: [saludMental, integridadEtica, riesgoDespido]. */
type MetricImpactTuple = readonly [number, number, number];

/** Remitente de los tickets que vienen directamente del jefe. */
const BOSS_REQUESTER = `${BOSS_NAME} · Dirección`;

/**
 * Pool de tareas procedurales inspiradas en casos reales de outsourcing extremo.
 *
 * Convención de opciones (en este orden):
 *  1. Sacrificio Personal: protege la ética y reduce el riesgo, drena la salud mental.
 *  2. Delegación Tóxica / Atajo: preserva la salud mental, degrada la ética y sube un poco el riesgo.
 *  3. Rebeldía / Confrontación: mantiene la ética, dispara el riesgo de despido.
 *
 * Los impactos se expresan como tuplas [saludMental, integridadEtica, riesgoDespido].
 */

/** Precedentes reales reutilizables (resúmenes en español). */
const PRECEDENTS = {
  disney: {
    badge: "Disney IT · 2015",
    summary:
      "Cientos de trabajadores de TI de Disney en Florida fueron despedidos y, según reportes, debieron capacitar a sus reemplazos de consultoras externas como condición para recibir su indemnización.",
  },
  sce: {
    badge: "Southern California Edison · 2015",
    summary:
      "SCE eliminó cientos de puestos de TI y trasladó el trabajo a proveedores como Infosys y Tata; empleados declararon haber capacitado a quienes los sustituirían.",
  },
  boeing: {
    badge: "Boeing · 2019",
    summary:
      "Bloomberg reportó que Boeing y sus proveedores subcontrataron desarrollo y pruebas de software a ingenieros externos pagados desde unos 9 USD por hora, en plena crisis del 737 MAX.",
  },
  ucsf: {
    badge: "UCSF · 2017",
    summary:
      "La Universidad de California en San Francisco tercerizó parte de su TI a HCL; trabajadores afectados denunciaron haber tenido que entrenar a sus reemplazos.",
  },
  northeast: {
    badge: "Northeast Utilities · 2014",
    summary:
      "La eléctrica de Nueva Inglaterra despidió a cerca de 200 trabajadores de TI y transfirió sus funciones a firmas offshore, tras un periodo de transferencia de conocimiento.",
  },
  toysrus: {
    badge: "Toys \"R\" Us · 2015",
    summary:
      "The New York Times documentó que empleados de TI de Toys \"R\" Us capacitaron a trabajadores de Tata Consultancy Services que luego asumieron sus funciones.",
  },
  abbott: {
    badge: "Abbott Laboratories · 2016",
    summary:
      "Extrabajadores de TI de Abbott demandaron a la empresa alegando que fueron reemplazados por personal de HCL al que tuvieron que capacitar.",
  },
} satisfies Record<string, RealWorldPrecedent>;

/** Convierte una tupla de impacto en el objeto tipado. */
function toImpact([mentalHealth, ethicalIntegrity, firingRisk]: MetricImpactTuple) {
  return { mentalHealth, ethicalIntegrity, firingRisk };
}

/** Construye la opción de Sacrificio Personal. */
function sacrifice(
  label: string,
  description: string,
  impact: MetricImpactTuple,
  feedback: string,
): DecisionOption {
  return { strategy: "sacrifice", label, description, impact: toImpact(impact), feedback };
}

/** Construye la opción de Delegación Tóxica / Atajo. */
function shortcut(
  label: string,
  description: string,
  impact: MetricImpactTuple,
  feedback: string,
): DecisionOption {
  return { strategy: "shortcut", label, description, impact: toImpact(impact), feedback };
}

/** Construye la opción de Rebeldía / Confrontación. */
function rebellion(
  label: string,
  description: string,
  impact: MetricImpactTuple,
  feedback: string,
): DecisionOption {
  return { strategy: "rebellion", label, description, impact: toImpact(impact), feedback };
}

export const TASK_POOL: readonly TaskTemplate[] = [
  {
    templateId: "training-330am",
    title: "Capacitación forzada a las 3:30 AM",
    description:
      "El proveedor offshore solicita una sesión de 3 horas sobre el módulo de facturación. Es la tercera madrugada consecutiva y mañana tienes reunión a las 9:00.",
    urgency: "high",
    requester: "Coordinación de Transición",
    precedent: PRECEDENTS.disney,
    options: [
      sacrifice(
        "Dar la sesión completa",
        "Te conectas, explicas todo con detalle y respondes cada pregunta.",
        [-16, 2, -6],
        "Sesión impecable. Llevas 21 horas despierto.",
      ),
      shortcut(
        "Enviar grabaciones viejas",
        "Compartes videos desactualizados y dices que «cubren todo».",
        [2, -12, 3],
        "El equipo offshore aprende procesos obsoletos. Nadie lo notará... por ahora.",
      ),
      rebellion(
        "Exigir horario laboral",
        "Respondes que solo capacitarás en horario hábil local.",
        [4, 3, 15],
        "Tu correo fue reenviado a RR. HH. con la etiqueta «actitud».",
      ),
    ],
  },
  {
    templateId: "broken-prs",
    title: "Revisión de 120 Pull Requests rotos",
    description:
      "El nuevo equipo subió 120 PRs durante la noche. La mitad no compila y varios borran pruebas para «hacer pasar el pipeline».",
    urgency: "medium",
    requester: "Gerencia de Entrega",
    precedent: PRECEDENTS.sce,
    options: [
      sacrifice(
        "Revisarlos uno por uno",
        "Lees cada cambio, dejas comentarios y corriges lo crítico tú mismo.",
        [-15, 2, -5],
        "120 PRs revisados. Tus ojos arden y el café ya no hace efecto.",
      ),
      shortcut(
        "Aprobar en bloque",
        "Marcas «LGTM» en todos para despejar el tablero.",
        [3, -14, 4],
        "Pipeline verde. Las pruebas eliminadas tampoco protestan.",
      ),
      rebellion(
        "Rechazar y escalar",
        "Rechazas todos y reportas la falta de calidad a la dirección.",
        [1, 3, 14],
        "La dirección responde: «Necesitamos que seas parte de la solución».",
      ),
    ],
  },
  {
    templateId: "untested-deploy",
    title: "Despliegue a producción sin pruebas",
    description:
      "La gerencia quiere desplegar hoy la versión del proveedor para cumplir el hito del contrato. No existe ningún entorno de pruebas configurado.",
    urgency: "critical",
    requester: BOSS_REQUESTER,
    precedent: PRECEDENTS.boeing,
    options: [
      sacrifice(
        "Probar todo manualmente",
        "Te quedas toda la noche ejecutando casos de prueba a mano antes del despliegue.",
        [-18, 3, -4],
        "Encontraste 9 errores críticos. Nadie te lo agradeció.",
      ),
      shortcut(
        "Desplegar y cruzar los dedos",
        "Firmas la aprobación técnica sin validar nada.",
        [2, -15, 5],
        "Desplegado. El monitoreo empieza a mostrar picos extraños.",
      ),
      rebellion(
        "Bloquear el despliegue",
        "Te niegas a firmar y documentas los riesgos por escrito.",
        [0, 4, 18],
        "El hito se retrasa. Tu nombre aparece en el informe de «impedimentos».",
      ),
    ],
  },
  {
    templateId: "legacy-docs-48h",
    title: "Documentar 15 años de código legado en 48 horas",
    description:
      "El contrato exige entregar documentación completa del sistema núcleo antes del viernes. Gran parte del conocimiento solo existe en tu cabeza.",
    urgency: "medium",
    requester: "Oficina de Gestión de Proyectos",
    precedent: PRECEDENTS.northeast,
    options: [
      sacrifice(
        "Escribir todo el fin de semana",
        "Cancelas tus planes y produces un manual exhaustivo.",
        [-14, 1, -6],
        "380 páginas de documentación. Tu familia cenó sin ti otra vez.",
      ),
      shortcut(
        "Generar documentación de relleno",
        "Usas plantillas genéricas que aparentan detalle pero no explican nada.",
        [3, -11, 2],
        "El documento se ve profesional. Es casi inútil.",
      ),
      rebellion(
        "Declarar el plazo inviable",
        "Informas que 48 horas es imposible y propones un calendario realista.",
        [3, 2, 12],
        "«Inviable no está en nuestro vocabulario», responde la PMO.",
      ),
    ],
  },
  {
    templateId: "record-yourself",
    title: "Grábate haciendo tu propio trabajo",
    description:
      "RR. HH. pide que grabes tu pantalla durante toda la jornada para crear «material de transferencia». Tu reemplazo verá los videos.",
    urgency: "low",
    requester: "Recursos Humanos",
    precedent: PRECEDENTS.toysrus,
    options: [
      sacrifice(
        "Grabar y narrar todo",
        "Grabas cada tarea y explicas tus decisiones con paciencia.",
        [-13, 2, -5],
        "Acabas de enseñarle a tu reemplazo a ser tú.",
      ),
      shortcut(
        "Grabar omitiendo lo importante",
        "Grabas solo tareas triviales; los trucos críticos te los guardas.",
        [1, -9, 3],
        "Te sientes un poco más indispensable. Y un poco peor persona.",
      ),
      rebellion(
        "Negarte a ser grabado",
        "Alegas que la vigilancia continua viola tu privacidad.",
        [2, 3, 13],
        "Legal está «revisando tu contrato».",
      ),
    ],
  },
  {
    templateId: "cheap-security-module",
    title: "Módulo de seguridad asignado a contratistas sin experiencia",
    description:
      "Para ahorrar costos, el módulo de autenticación pasa a contratistas recién incorporados. Te piden supervisar «en tus ratos libres».",
    urgency: "high",
    requester: "Compras y Proveedores",
    precedent: PRECEDENTS.boeing,
    options: [
      sacrifice(
        "Reescribir lo crítico tú mismo",
        "Revisas y reescribes las partes sensibles fuera de horario.",
        [-17, 3, -4],
        "El login es seguro gracias a ti. Oficialmente, el mérito es del proveedor.",
      ),
      shortcut(
        "Firmar sin revisar",
        "Apruebas el módulo confiando en que «alguien más» lo auditará.",
        [3, -15, 4],
        "Las contraseñas se guardan en texto plano. Nadie preguntó.",
      ),
      rebellion(
        "Denunciar el riesgo al comité",
        "Envías un informe formal sobre el riesgo de seguridad al comité de auditoría.",
        [-1, 5, 17],
        "El comité agradece tu «perspectiva». Tu jefe no.",
      ),
    ],
  },
  {
    templateId: "retention-bonus",
    title: "Bono de retención con letra pequeña",
    description:
      "Te ofrecen un bono si firmas un acuerdo de no divulgación sobre las condiciones de la transición y te comprometes a no hablar con la prensa.",
    urgency: "low",
    requester: "Recursos Humanos",
    precedent: PRECEDENTS.disney,
    options: [
      sacrifice(
        "Firmar y seguir trabajando",
        "Aceptas en silencio para asegurar tu indemnización.",
        [-10, -2, -8],
        "Firmado. El silencio pesa más de lo que pensabas.",
      ),
      shortcut(
        "Firmar y convencer a otros",
        "Firmas y presionas a excompañeros para que también firmen.",
        [2, -14, -3],
        "RR. HH. te felicita por tu «liderazgo». Tus excompañeros dejaron de hablarte.",
      ),
      rebellion(
        "Rechazar el acuerdo",
        "Te niegas a firmar y consultas con un abogado laboral.",
        [1, 4, 16],
        "El bono desaparece de la mesa. Tu ficha ahora dice «riesgo reputacional».",
      ),
    ],
  },
  {
    templateId: "offshore-overtime",
    title: "Equipo offshore trabajando 14 horas sin pago extra",
    description:
      "Para cumplir tu entrega, el líder offshore propone que su equipo trabaje jornadas de 14 horas. Te piden aprobar el plan.",
    urgency: "medium",
    requester: "Líder del Proveedor",
    precedent: PRECEDENTS.abbott,
    options: [
      sacrifice(
        "Absorber tú la carga",
        "Rechazas el plan y asumes tú las tareas restantes.",
        [-16, 3, -3],
        "Nadie del otro lado trabajó de más. Tú sí.",
      ),
      shortcut(
        "Aprobar el plan",
        "Total, no es tu equipo ni tu responsabilidad.",
        [3, -16, 2],
        "La entrega llegó a tiempo. El costo humano no aparece en ningún reporte.",
      ),
      rebellion(
        "Reportar condiciones abusivas",
        "Escalas el caso a cumplimiento normativo del proveedor y de tu empresa.",
        [0, 5, 15],
        "Compras te acusa de «poner en riesgo la relación con un socio estratégico».",
      ),
    ],
  },
  {
    templateId: "billing-outage",
    title: "Caída del sistema de facturación en fin de semana",
    description:
      "El sistema de facturación cayó un sábado a las 23:00. El equipo offshore no tiene accesos aún y miles de clientes no pueden pagar.",
    urgency: "critical",
    requester: "Centro de Operaciones",
    precedent: PRECEDENTS.sce,
    options: [
      sacrifice(
        "Atender la guardia solo",
        "Te conectas y trabajas hasta restaurar el servicio.",
        [-18, 2, -6],
        "Servicio restaurado a las 06:12. Domingo perdido.",
      ),
      shortcut(
        "Aplicar un parche sucio",
        "Desactivas validaciones para que los pagos pasen, aunque algunos se dupliquen.",
        [1, -13, 4],
        "Los pagos fluyen. Algunos clientes pagaron dos veces.",
      ),
      rebellion(
        "No contestar: no es tu guardia",
        "Silencias el teléfono. Ya no tienes equipo de guardia y nadie te paga por esto.",
        [5, 1, 18],
        "El lunes hay una reunión en tu calendario titulada «Compromiso».",
      ),
    ],
  },
  {
    templateId: "shared-credentials",
    title: "Credenciales de producción compartidas por chat",
    description:
      "El proveedor necesita acceso urgente y la gerencia sugiere compartir tus credenciales de administrador por chat para «agilizar».",
    urgency: "high",
    requester: BOSS_REQUESTER,
    precedent: PRECEDENTS.ucsf,
    options: [
      sacrifice(
        "Configurar accesos correctamente",
        "Pasas la noche creando cuentas con permisos mínimos y auditoría.",
        [-14, 2, -4],
        "Accesos seguros creados. Dormiste 3 horas.",
      ),
      shortcut(
        "Compartir tus credenciales",
        "Pegas usuario y contraseña en el chat corporativo.",
        [3, -13, 3],
        "Ahora 40 personas desconocidas pueden actuar con tu nombre.",
      ),
      rebellion(
        "Negarte por política de seguridad",
        "Citas la política interna y te niegas por escrito.",
        [1, 4, 13],
        "«La política la escribimos nosotros», contesta la gerencia.",
      ),
    ],
  },
  {
    templateId: "medical-data-migration",
    title: "Migración de datos sensibles sin cifrar",
    description:
      "Debes transferir registros con datos personales sensibles a los servidores del proveedor. El plan no contempla cifrado porque «retrasa el cronograma».",
    urgency: "high",
    requester: "Oficina de Gestión de Proyectos",
    precedent: PRECEDENTS.ucsf,
    options: [
      sacrifice(
        "Implementar cifrado por tu cuenta",
        "Programas el cifrado de madrugada sin que figure en el plan.",
        [-16, 3, -3],
        "Datos protegidos. Ese esfuerzo nunca existirá en ningún informe.",
      ),
      shortcut(
        "Migrar tal como está",
        "Sigues el plan al pie de la letra. Si algo pasa, no fue tu decisión.",
        [2, -16, 3],
        "Migración completada. Datos sensibles viajando en texto plano.",
      ),
      rebellion(
        "Notificar al oficial de privacidad",
        "Reportas la falta de cifrado al responsable de protección de datos.",
        [0, 5, 16],
        "La migración se congela. Te culpan del retraso.",
      ),
    ],
  },
  {
    templateId: "fake-metrics",
    title: "Maquillar métricas para el comité directivo",
    description:
      "El director quiere que el informe muestre que la transición «mejoró la calidad un 40%». Los datos reales muestran lo contrario.",
    urgency: "medium",
    requester: BOSS_REQUESTER,
    precedent: PRECEDENTS.northeast,
    options: [
      sacrifice(
        "Preparar dos informes",
        "Haces el informe pedido y otro honesto con contexto, trabajando el doble.",
        [-13, 1, -5],
        "Entregaste ambos. Solo uno llegó al comité.",
      ),
      shortcut(
        "Ajustar los números",
        "Eliges la ventana de tiempo y los indicadores que cuentan la historia deseada.",
        [2, -15, -2],
        "El comité aplaude. Tu jefe te invita a almorzar.",
      ),
      rebellion(
        "Presentar los datos reales",
        "Entregas las cifras sin maquillar y defiendes su veracidad.",
        [1, 5, 17],
        "Te retiran de la lista de distribución del comité.",
      ),
    ],
  },
  {
    templateId: "ex-colleague-help",
    title: "Pedir ayuda gratis a un excompañero despedido",
    description:
      "Solo tu excompañero despedido conoce el módulo de inventario. La gerencia sugiere que lo contactes «informalmente» para que ayude sin cobrar.",
    urgency: "low",
    requester: "Gerencia de Entrega",
    precedent: PRECEDENTS.toysrus,
    options: [
      sacrifice(
        "Descifrar el módulo tú solo",
        "Lees el código durante horas hasta entenderlo.",
        [-14, 2, -4],
        "Lo entendiste. Tu respeto por tu excompañero creció; tu energía no.",
      ),
      shortcut(
        "Pedirle el favor",
        "Le escribes apelando a la amistad para obtener ayuda gratuita.",
        [3, -12, 1],
        "Te ayudó. La empresa ahorró su sueldo por segunda vez.",
      ),
      rebellion(
        "Exigir que lo contraten como consultor",
        "Propones pagarle una consultoría justa por su conocimiento.",
        [1, 4, 12],
        "«No hay presupuesto para eso», dice quien aprobó el bono del director.",
      ),
    ],
  },
  {
    templateId: "fake-demo",
    title: "Demo para el cliente con datos simulados",
    description:
      "El cliente principal verá mañana una demo del nuevo sistema. Aún no funciona, así que te piden simular respuestas con datos fijos.",
    urgency: "critical",
    requester: "Equipo Comercial",
    precedent: PRECEDENTS.abbott,
    options: [
      sacrifice(
        "Hacer funcionar el flujo real",
        "Trabajas toda la noche para que al menos el flujo principal funcione de verdad.",
        [-17, 2, -5],
        "La demo funciona de verdad. Apenas puedes mantener los ojos abiertos.",
      ),
      shortcut(
        "Montar la demo falsa",
        "Programas respuestas fijas que aparentan un sistema terminado.",
        [2, -14, 3],
        "El cliente firma la renovación basándose en algo que no existe.",
      ),
      rebellion(
        "Mostrar el estado real",
        "Propones mostrar el avance honesto con un plan de entrega.",
        [1, 4, 16],
        "Comercial te acusa de «sabotear el pipeline de ventas».",
      ),
    ],
  },
  {
    templateId: "kt-signoff",
    title: "Firmar la conformidad de transferencia de conocimiento",
    description:
      "Debes certificar que el proveedor está «plenamente capacitado». Sabes que todavía no pueden resolver incidentes básicos sin ti.",
    urgency: "medium",
    requester: "Coordinación de Transición",
    precedent: PRECEDENTS.sce,
    options: [
      sacrifice(
        "Extender la capacitación tú mismo",
        "Organizas sesiones extra no remuneradas antes de firmar.",
        [-15, 2, -5],
        "El proveedor mejora. Tú sumas otra semana sin descanso.",
      ),
      shortcut(
        "Firmar la conformidad",
        "Certificas la capacitación para asegurar tu indemnización.",
        [3, -13, -2],
        "Firmado. Cuando algo falle, ya no será tu problema... en teoría.",
      ),
      rebellion(
        "Negarte a certificar",
        "Documentas las carencias y te niegas a firmar algo falso.",
        [0, 4, 17],
        "Tu indemnización entra en «revisión».",
      ),
    ],
  },
  {
    templateId: "wellbeing-survey",
    title: "Encuesta obligatoria de clima laboral",
    description:
      "RR. HH. envía una encuesta «anónima» sobre bienestar. Tu jefe pide que todos respondan «muy satisfecho» para cumplir el objetivo trimestral.",
    urgency: "low",
    requester: "Recursos Humanos",
    precedent: PRECEDENTS.disney,
    options: [
      sacrifice(
        "Responder con honestidad y cargar las consecuencias",
        "Respondes la verdad, pero te ofreces a cubrir más guardias para compensar.",
        [-11, 2, -4],
        "Tu respuesta honesta queda registrada. También tus horas extra.",
      ),
      shortcut(
        "Responder «muy satisfecho»",
        "Marcas lo que te piden. No vale la pena el conflicto.",
        [2, -8, -2],
        "Objetivo trimestral cumplido. Bienestar: «excelente».",
      ),
      rebellion(
        "Denunciar la manipulación",
        "Reportas que la encuesta está siendo manipulada por la jefatura.",
        [2, 4, 12],
        "La encuesta resultó no ser tan anónima.",
      ),
    ],
  },
];
