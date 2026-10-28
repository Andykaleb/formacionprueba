/* Datos de contenido. Fuente: Checklist Crédito (Guía para BDOs), Temas Clave para Agilizar el Onboarding, TOP situaciones que retrasan el Onboarding.
   Los elementos con sug:true son propuestas de contenido (no vienen en los documentos). */

const KYC_ITEMS = [
  { t: "Descripción del negocio", ic: "🏭", q: [
    "¿A qué se dedica la empresa realmente? Más allá del giro registrado, ¿cuál es su operación cotidiana?",
    "¿Cuántos años lleva operando y cuál ha sido su trayectoria?",
    "¿Cuál es su modelo de negocio? ¿Fabrica, distribuye, trading, presta servicios, importa, exporta, comercializa, cosecha, acopia, brokerage, maquila…?" ] },
  { t: "Líneas de negocio o servicios", ic: "🧱", q: [
    "¿Cuántas líneas de negocio o servicio tiene? ¿Cuál representa el mayor volumen de ventas?",
    "¿Existen líneas secundarias o complementarias relevantes?" ] },
  { t: "Instalaciones y capacidad operativa", ic: "🏗️", q: [
    "¿Con qué infraestructura cuenta? (plantas, bodegas, oficinas, flota, maquinaria, etc.)",
    "¿Son instalaciones propias o arrendadas?" ] },
  { t: "Mercado meta y base de clientes", ic: "🎯", q: [
    "¿A quién le vende? ¿Son empresas privadas, gobierno, retail, industria?",
    "¿Opera en un mercado local, regional o nacional? ¿Exporta?",
    "¿Cuántos clientes activos tiene?" ] },
  { t: "Estacionalidad", ic: "📆", q: [
    "¿El negocio tiene temporadas altas y bajas? ¿En qué meses y por qué razón?",
    "¿Cómo impacta la estacionalidad en sus flujos de caja y en sus necesidades de financiamiento?" ] },
  { t: "Planes y perspectivas", ic: "🔭", q: [
    "¿Tiene contratos nuevos, órdenes de compra recientes o proyectos en desarrollo?",
    "¿Está en proceso de expansión, apertura de nuevos mercados o incorporación de nuevos clientes?" ] },
  { t: "Visita al prospecto (si aplica)", ic: "🚪", q: [
    "Si el BDO visitó las instalaciones, debe reportarlo con el mayor detalle posible:",
    "• Fecha de la visita y personas con quienes se reunió (nombre y cargo).",
    "• Descripción de las instalaciones observadas: tamaño, condición, actividad visible, equipos, personal.",
    "• Cualquier observación relevante sobre la operación real del negocio.",
    "• Cualquier comentario o situación que llamó la atención, positiva o de alerta.",
    "Una visita bien documentada aporta un elemento diferenciador al análisis y genera mayor confianza en el expediente." ] }
];

const COUNTRIES = [
  { k: "mx-l", label: "🇲🇽 México · deudores locales", who: "exp", out: "ExpoCredit descarga el historial directamente desde Ekatena/SAT. No es necesario que el BDO lo proporcione." },
  { k: "mx-f", label: "🇲🇽 México · deudores fuera de México", who: "bdo", out: "El BDO debe proporcionar el historial en el formato de ExpoCredit, ya que no es posible descargarlo desde SAT." },
  { k: "all", label: "🌎 Todos los demás países", who: "bdo", out: "El BDO debe proporcionar el historial de pagos de todos los deudores en el formato de ExpoCredit." },
  { k: "fact", label: "🏦 Deudores bajo factoraje o pronto pago activo", who: "bdo", out: "Cuando los deudores ya están siendo financiados bajo un programa existente y no es posible ver el historial directamente, el BDO debe solicitar: (1) un historial de pagos emitido por la entidad financiera actual y (2) un reporte de dilución. Alternativa: si el programa tiene portal, dar los accesos para que ExpoCredit valide directamente. Sin historial de pagos no hay análisis de patrones de pago ni de dilución, y se imposibilita el avance." }
];
/* Extras por país: declaraciones de renta */
const COUNTRY_TAX = {
  "mx-l": "Declaraciones de renta (México): ExpoCredit las descarga desde el SAT/Ekatena.",
  "mx-f": "Declaraciones de renta (México): ExpoCredit las descarga desde el SAT/Ekatena.",
  "all": "Declaraciones de renta (todos los países excepto México): el prospecto aporta las de los últimos 2 años fiscales.",
  "fact": "Recuerda: el reporte de dilución es un insumo para Crédito. El BDO solo lo solicita, no lo calcula."
};

const KYC_STAGES = [
  { ic: "📨", t: "Orden de compra / Inicio de la operación", q: [
      "¿Cómo realiza el pedido cada deudor?",
      "¿El pedido se recibe mediante OC formal, portal, correo, forecast, contrato o verbalmente?",
      "¿Existe documentación formal que respalde el pedido?",
      "¿Hay contratos?" ],
    gen: "“Reciben orden de compra.”",
    good: "“El deudor A genera la OC en su portal Ariba; el deudor B envía OC por correo con contrato marco anual.”" },
  { ic: "🚚", t: "Entrega y logística", q: [
      "¿El cliente entrega directamente o el deudor recoge mercancía?",
      "¿Se utiliza un transportista o transporte propio?",
      "¿La operación es doméstica o internacional?",
      "¿Qué documento sirve como evidencia de entrega según cada deudor? (BOL, remisión firmada, POD, acuse, warehouse release, confirmación e-portal…)" ],
    gen: "“Entregan el producto y se firma el Bill of Lading.”",
    good: "“El deudor recoge en el warehouse del cliente; la evidencia es el warehouse release firmado, no un BOL.”" },
  { ic: "🧾", t: "Proceso de facturación", q: [
      "¿Cuándo se emite la factura?",
      "¿La factura debe cargarse en un portal o enviarse por correo?",
      "¿Existe un proceso adicional de validación o aprobación?",
      "¿La factura cambia de estatus en portal? → Solicitar screenshots." ],
    gen: "“Facturan.”",
    good: "“Facturan al despachar; se carga al portal del deudor, pasa a ‘Aprobada’ en ~5 días. Adjunto screenshots del estatus.”" },
  { ic: "💵", t: "Proceso de pago", q: [
      "¿Qué evento activa el conteo de los términos de pago?",
      "¿Los términos comienzan desde entrega, carga en portal, aprobación o recepción? ¿Tienen programa de pronto pago?",
      "¿Cómo se reciben y reconcilian los pagos?" ],
    gen: "“Pagan a 30 días.”",
    good: "“Net 30 desde la carga en portal; pagan por transferencia a la cuenta de Bank X; el cliente concilia con remesas por correo.”" },
  { ic: "🧩", t: "Validación específica por deudor", q: [
      "¿Todos los deudores operan bajo el mismo proceso? Si no, explicar el flujo operativo individual de cada deudor relevante.",
      "Validar que los samples y documentos cargados correspondan específicamente al deudor analizado y al tipo real de operación." ],
    gen: "Una sola explicación para todos los deudores.",
    good: "Un flujo por deudor relevante; si varios procesos son idénticos, uno explicado correctamente sirve de referencia." }
];

const NOS = [
  { t: "Términos de pago: CONTADO", ex: "Un taller cobra al momento de entregar el vehículo reparado: no hay crédito que financiar." },
  { t: "Producto en CONSIGNACIÓN", ex: "El distribuidor deja mercancía en tienda y solo se le paga cuando el retailer la vende." },
  { t: "Facturación progresiva o por avances de obra (progress billing / milestone invoicing)", ex: "Una constructora factura 30% al inicio, 40% al avance y 30% al terminar." },
  { t: "Facturación anticipada, antes de la entrega real del bien o servicio", ex: "Se emite la factura en enero para un equipo que se entregará en marzo." },
  { t: "Operaciones de contado o pagos inmediatos sin términos de crédito claros", ex: "Ventas de mostrador pagadas en efectivo o con tarjeta." },
  { t: "Facturación 100% al completar el trabajo = cash", ex: "Un servicio de instalación que se factura y se cobra el mismo día de terminar." },
  { t: "Términos abiertos o ambiguos", ex: "“10 días después de arribo”, “contra aceptación”, “contra instalación”, “contra puesta en marcha”." },
  { t: "Operaciones donde el pago depende de la aceptación de un tercero", ex: "El deudor solo paga cuando su propio cliente final aprueba el entregable." },
  { t: "Esquemas “pay when paid” o pagos condicionados a que un tercero pague primero", ex: "El contratista paga al subcontratista únicamente cuando el dueño de la obra le paga a él." },
  { t: "Operaciones manejadas únicamente vía WhatsApp o llamadas, sin PO formal ni soporte documental", ex: "Los pedidos se confirman por mensaje y no existe ninguna OC ni contrato." },
  { t: "Facturación intercompañía o entre partes relacionadas", ex: "El prospecto le factura a una empresa de su mismo grupo accionario." }
];

/* Casos de práctica del semáforo (ficticios, sugeridos) */
const SWIPE = [
  { e: "🛒", c: "Distribuidor de empaques vende a un retailer. OC por portal, factura Net 45 al despachar, entrega con BOL firmado.", v: true, x: "Modelo de crédito claro, términos definidos y documentación de entrega. Viable (a validar dilución con Crédito por ser retailer)." },
  { e: "🏬", c: "Vende mercancía en tienda del cliente. Solo cobra cuando el cliente la vende al público.", v: false, x: "Producto en CONSIGNACIÓN: uno de los grandes NO." },
  { e: "🏗️", c: "Constructora factura 30% de anticipo, 40% por avance y 30% al terminar la obra.", v: false, x: "Facturación progresiva / por avances de obra: gran NO." },
  { e: "🚗", c: "Proveedor automotriz con OC formal, factura al despacho, Net 60 y POD en portal del deudor.", v: true, x: "Términos claros, soporte formal y evidencia de entrega definida." },
  { e: "💬", c: "Los pedidos se acuerdan por WhatsApp y llamadas; no hay OC ni contrato.", v: false, x: "Operación solo por WhatsApp o llamadas sin PO formal ni soporte documental: gran NO." },
  { e: "🧰", c: "Su factura dice “pago 10 días después de arribo” y depende de la aceptación del cliente.", v: false, x: "Términos abiertos o ambiguos y pago sujeto a aceptación: gran NO." },
  { e: "🏢", c: "Le factura a otra empresa del mismo grupo accionario.", v: false, x: "Facturación intercompañía o partes relacionadas: gran NO." },
  { e: "🌐", c: "Exportador con contrato, OC formal, factura Net 30 desde la entrega y BOL.", v: true, x: "Tiene términos claros y evidencia de entrega. Viable, sujeto al análisis de Crédito." },
  { e: "⛓️", c: "Subcontratista cobra solo cuando el dueño de la obra le paga al contratista principal.", v: false, x: "Esquema “pay when paid”: gran NO." }
];

const SEGS = [
  { k: "simp", big: "≤ USD 350K", name: "Formato simplificado", pts: [
      "Para prospectos cuya línea de factoring sea de hasta USD 350,000 existe un formato simplificado específico para este segmento.",
      "El BDO debe utilizar ese formato y no el estándar.",
      "Aun así debe llegar completo, con respuestas de calidad y firmado." ] },
  { k: "std", big: "Estándar", name: "Formato estándar", pts: [
      "Factoring Application Form estándar, diligenciado en su totalidad y firmado.",
      "KYC con información de valor y expediente completo según el checklist (Bloque 10).",
      "Ante dudas, consultar al equipo de Crédito antes de enviar." ] },
  { k: "btb", big: "≥ USD 250K", name: "Política By The Book", pts: [
      "Aplica a prospectos pequeños con líneas desde USD 250K. Monto mínimo: USD 250K.",
      "No se aceptan excepciones: el cliente debe cumplir todos los requisitos desde el inicio.",
      "Payment histories robustos: no se aceptan experiencias limitadas de una, dos o tres facturas. Se espera un historial sólido, idealmente de 8 experiencias o más.",
      "Estados financieros organizados y completos: P&L y Balance Sheet al mismo corte.",
      "Notificación completa a los deudores, salvo deudor blue chip aprobado por Crédito.",
      "Mínimo dos deudores elegibles, con calidad crediticia adecuada y capacidad de pago.",
      "Si hay restricciones para compartir clave CIEC, estados bancarios u otra documentación básica, el negocio no debe presentarse: será automáticamente negado.",
      "“Si el negocio no cumple estos requisitos mínimos, no debe presentarse a Crédito ni a Comité.”" ] }
];

const TOP = [
  { n: 1, t: "Información del deudor incompleta o errónea",
    p: "No se diligencia correctamente el Excel con la información del deudor, omitiendo o ingresando datos incorrectos como razón social o ID fiscal. El deudor no puede ser encontrado en las bases de datos de las aseguradoras, lo que obliga a iniciar un proceso desde cero o abrir una investigación adicional.",
    i: ["Retrasos de hasta 15 días hábiles en la validación del deudor.", "Pérdida de interés del cliente debido a la demora."],
    s: ["Validación obligatoria antes del envío: implementar una revisión interna en ventas para garantizar que el Excel esté completo antes de someterlo."] },
  { n: 2, t: "Falta de profundidad en el KYC",
    p: "El KYC operativo es demasiado general y carece de detalle sobre cómo funciona realmente la operación con cada deudor. Solo se describe “reciben orden de compra, entregan producto y facturan”. Además, se usa una explicación genérica para todos los deudores, cuando cada uno puede tener un proceso distinto (p. ej., se menciona “Bill of Lading” pero el deudor recoge directamente en el warehouse del cliente). Otros problemas: no considerar programas de pronto pago ni factoring existentes; en retailers, no entender descuentos, rebates, promociones, devoluciones, penalidades y notas de crédito (dilución); y no revisar los samples.",
    i: ["Incremento de reprocesos y preguntas posteriores al cliente.", "Retrasos en onboarding.", "Riesgo de interpretar incorrectamente la operación real.", "Dificultad para validar asegurabilidad y elegibilidad documental.", "Problemas posteriores en desembolsos por falta de claridad documental.", "Procesos de audit más complejos (factoring y pronto pago).", "Riesgo operativo al asumir que todos los deudores operan bajo la misma lógica."],
    s: ["El BDO realiza preguntas operativas específicas durante el onboarding para construir un KYC detallado, alineado con la operación real de cada deudor y validado con documentación y samples reales (ver constructor de KYC operativo en el módulo 6)."] },
  { n: 3, t: "Documentación incompleta",
    p: "Los prospectos entregan o cargan documentos incompletos o con errores, lo que genera reprocesos y demoras en el Underwriting.",
    i: ["Atrasos y reprocesos en el cierre de la operación.", "Puede darle al cliente la sensación de un proceso largo y tedioso, con pérdida de interés."],
    s: ["Hacer uso de los checklists y revisar la información a medida que el cliente va cargando.", "Implementar un “document checker”: revisar que todo esté en orden antes de enviarlo a Underwriting."] },
  { n: 4, t: "Falta de claridad en los términos de las transacciones",
    p: "No se indagan a fondo los términos bajo los cuales opera el cliente antes de avanzar. Se descubre tarde que su modelo de negocio no encaja con las transacciones que ExpoCredit realiza, como venta en consignación o facturación progresiva.",
    i: ["Se pierde tiempo en prospectos que no califican o que al final no van a fondearse.", "Expectativas incorrectas en el cliente, que pueden afectar la confianza.", "Se desperdician recursos operativos en solicitudes inviables.", "Se somete en póliza errónea (ejemplo: CAD)."],
    s: ["Check de viabilidad temprana: preguntas clave en la primera llamada para detectar si el cliente opera bajo modelos compatibles.", "Guía de términos comerciales: lista de criterios claros sobre los tipos de transacciones que ExpoCredit financia (ver “Los grandes NO”)."] },
  { n: 5, t: "Entrega tardía del contrato de Factoring al cliente",
    p: "A veces los clientes reciben el ejemplo del contrato de factoring solo después de ser aprobados, y pueden tardar semanas analizándolo con sus asesores jurídicos antes de firmarlo. Esto retrasa el cierre y el fondeo.",
    i: ["Retrasos innecesarios en la firma, prolongando el tiempo entre aprobación y fondeo.", "Pérdida de interés del cliente o riesgo de que busque opciones en la competencia.", "Mayor carga operativa en seguimientos, ajustes y reprocesos."],
    s: ["Enviar el contrato desde el día 1: incluir el ejemplo del contrato en la etapa inicial de negociación para que el cliente y su equipo legal lo analicen con anticipación.", "Mencionar los poderes necesarios para la firma: Poder para actos de dominio, Actos de Administración y Avalar Títulos de Crédito."] },
  { n: 6, t: "Cuello de botella para el primer fondeo",
    p: "Una vez aprobado y enviado el contrato para firma, el cliente deja de responder, generando un cuello de botella entre la aprobación y el primer fondeo. Puede deberse a dudas legales, falta de sentido de urgencia o cambios internos en la empresa del cliente.",
    i: ["Pérdida de clientes potenciales que, al no concretar rápido, pueden reconsiderar su decisión o buscar alternativas.", "Mayor carga operativa en seguimientos innecesarios, alargando el ciclo de ventas y disminuyendo la eficiencia del equipo comercial."],
    s: ["Contrato y poderes desde el día 1 (ver situación #5), para que lo legal no sea la sorpresa del final.", "Acordar por escrito una fecha objetivo de firma y de primer fondeo en el momento de la aprobación.", "Identificar un interlocutor responsable (y un respaldo) en el cliente, además de su asesor legal.", "Seguimiento programado (por ejemplo semanal) con un próximo paso claro en cada contacto.", "Explicar al cliente el beneficio concreto de fondear pronto: qué facturas puede financiar y cuándo."],
    sug: true }
];

const CHECK = [
  "Factoring Application Form diligenciado y firmado (formato estándar o formato hasta USD 350K según corresponda).",
  "KYC del BDO diligenciado con información de valor: descripción del negocio, líneas de servicio, instalaciones, mercado meta, estacionalidad, planes y programas de financiamiento existentes. Incluir reporte de visita si aplica.",
  "Términos de pago registrados en el KYC coinciden con los de las facturas, PO o contratos actuales.",
  "Necesidades de financiamiento justificadas y consistentes con el historial o respaldadas con contratos/forecast.",
  "Cuadro de deudores con nombre completo, dirección y años de relación comercial.",
  "Autorización para consulta de buró de crédito, diligenciada y firmada por el RL.",
  "Estados financieros de los últimos 2 años y del último trimestre: P&L y Balance General por cada período.",
  "Historiales de pago por cada deudor en el formato de ExpoCredit, con parcialidades y notas de crédito debidamente registradas (excepto deudores mexicanos que ExpoCredit descarga de SAT).",
  "Declaraciones de renta de los últimos 2 años (excepto México). Si hay extensiones, incluirlas.",
  "Reporte de Cuentas por Cobrar y Cuentas por Pagar por vencimiento: fecha de corte y moneda especificadas, con antigüedad no mayor a 30 días.",
  "Detalle de deuda financiera: entidad, saldo, tipo de facilidad, vencimiento, tasa y garantías.",
  "Estados de cuenta bancarios de los últimos 3 meses: True PDF, sin intervenciones, de las cuentas donde pagan los deudores."
];

const DOCS = [
  { d: "Factoring Application Form completo y firmado (formato simplificado, línea de USD 300K)", ok: true, x: "Formulario completo, firmado y en el formato correcto para el segmento." },
  { d: "Formulario con respuestas “N/A” y sin firma", ok: false, x: "Debe llegar con todos los campos bien diligenciados y firmado." },
  { d: "Estado de cuenta descargado del portal bancario (True PDF), últimos 3 meses", ok: true, x: "Original del portal, sin intervenciones." },
  { d: "Foto del estado de cuenta tomada con el celular", ok: false, x: "No se aceptan fotografías ni escaneos de estados impresos." },
  { d: "Estado de cuenta con montos subrayados en amarillo", ok: false, x: "Subrayados y marcas: Inscribe lo califica como de alto riesgo (fraudulento)." },
  { d: "P&L y Balance al mismo corte: 2 años cerrados + interino de hace 60 días", ok: true, x: "Ambos estados, mismo corte y interino dentro de 90 días." },
  { d: "Solo el P&L, sin Balance General", ok: false, x: "Ambos son indispensables; uno sin el otro no permite el análisis completo." },
  { d: "Historial de pagos en formato ExpoCredit, con cada abono con su fecha y notas de crédito", ok: true, x: "Formato correcto, parcialidades y notas de crédito registradas." },
  { d: "Historial en formato propio del cliente, con solo el último pago de cada factura", ok: false, x: "Debe usarse el formato de ExpoCredit y registrar cada abono con su fecha." },
  { d: "Autorización de buró firmada por el Representante Legal del acta vigente", ok: true, x: "Debe estar firmada por quien aparece como RL en el acta vigente." },
  { d: "Autorización de buró firmada por el gerente de ventas", ok: false, x: "La firma debe ser del Representante Legal." },
  { d: "Reporte de AR y AP por vencimiento, con fecha de corte y moneda, de hace 15 días", ok: true, x: "Antigüedad menor a 30 días y con corte y moneda." },
  { d: "Reporte de AR de hace 4 meses, sin moneda", ok: false, x: "Debe tener antigüedad no mayor a 30 días e indicar fecha de corte y moneda." },
  { d: "Cuadro de deudores con razón social completa, dirección y años de relación", ok: true, x: "Información mínima completa y consistente." },
  { d: "Cuadro de deudores que dice solo “Protec” como nombre del deudor", ok: false, x: "Se requiere la razón social completa del deudor." },
  { d: "Declaración de renta del último año aún no presentada y sin extensión (país distinto a México)", ok: false, x: "Estaría en incumplimiento fiscal: debe enviarse la extensión oficial." }
];

/* Casos de “encuentra el error” (sugeridos, ficticios) */
const ERRS = [
  { t: "Estado de cuenta bancario",
    h: '<div class="doc"><h5>Estado de cuenta · Banco Ejemplo · Marzo</h5><div class="row"><span>05/03 · Depósito DEUDOR A</span><b><mark>+ 48,200.00</mark></b></div><div class="row"><span>12/03 · Transferencia recibida</span><b>+ 31,750.00</b></div><div class="row"><span>Archivo</span><b>Foto_IMG_2041.jpg</b></div></div>',
    o: ["El saldo no cuadra con el depósito", "Tiene un monto subrayado y no es un True PDF original del portal", "Falta el logo del banco"], c: 1,
    x: "Los estados deben ser True PDF original, sin subrayados ni anotaciones, y no se aceptan fotos. Inscribe los califica de alto riesgo." },
  { t: "KYC vs. factura",
    h: '<div class="doc"><h5>KYC del BDO</h5><div class="row"><span>Términos de pago</span><b>Net 30</b></div></div><div class="doc"><h5>Factura #1184 al deudor</h5><div class="row"><span>Terms</span><b>Net 60 · Due 60 days from invoice</b></div></div>',
    o: ["Los términos del KYC no coinciden con la factura", "La factura no tiene número", "El KYC debería decir “Net 90”"], c: 0,
    x: "Los términos del KYC deben ser los vigentes según facturas, OC o contratos. Si no son los reales, el análisis pierde validez." },
  { t: "Estados financieros",
    h: '<div class="doc"><h5>Archivos recibidos</h5><div class="row"><span>P&amp;L 2024 (corte 31-dic)</span><b>✔</b></div><div class="row"><span>Balance General 2024</span><b>— falta —</b></div><div class="row"><span>P&amp;L 2025 (corte 31-dic)</span><b>✔</b></div><div class="row"><span>Balance General 2025 (corte 30-nov)</span><b>✔</b></div></div>',
    o: ["Todo está correcto", "Falta un Balance y el de 2025 tiene un corte distinto al P&L", "Sobra un P&L"], c: 1,
    x: "Por cada período deben venir P&L y Balance General, ambos al mismo corte." },
  { t: "Historial de pagos",
    h: '<div class="doc"><h5>Factura #2201 · USD 40,000 · pagada en 3 abonos</h5><div class="row"><span>Fecha pago</span><b>20-abr</b></div><div class="row"><span>Monto pagado</span><b>40,000</b></div><div class="row"><span>Formato</span><b>Excel propio del cliente</b></div></div>',
    o: ["Solo se registró el último pago y no está en el formato de ExpoCredit", "El monto es muy alto", "Falta el nombre del BDO"], c: 0,
    x: "Debe usarse el formato de ExpoCredit y registrar cada abono con su fecha exacta; registrar solo el último pago es un error frecuente." },
  { t: "Autorización de buró",
    h: '<div class="doc"><h5>Autorización para consulta de buró</h5><div class="row"><span>Firmada por</span><b>Laura P., Gerente Comercial</b></div><div class="row"><span>Representante Legal (acta vigente)</span><b>Carlos M.</b></div></div>',
    o: ["La firma no es del Representante Legal del acta vigente", "Debe firmarla el BDO", "Está correcta"], c: 0,
    x: "La firma debe corresponder a quien aparece designado como RL en el acta vigente." }
];

const QUIZ = [
  { q: "¿Hasta qué monto de línea existe un Factoring Application Form simplificado?", o: ["USD 100,000", "USD 250,000", "USD 350,000", "USD 500,000"], c: 2, x: "Para líneas de hasta USD 350,000 el BDO usa el formato simplificado y no el estándar." },
  { q: "¿En qué formato deben entregarse los estados de cuenta bancarios?", o: ["Foto desde el celular", "True PDF original del portal bancario", "Escaneo del estado impreso", "Excel con los movimientos"], c: 1, x: "True PDF, sin intervenciones; Inscribe califica como alto riesgo los editados." },
  { q: "¿Cuál es la antigüedad máxima del interino del último trimestre?", o: ["30 días", "60 días", "90 días", "180 días"], c: 2, x: "El interino no debe ser mayor a 90 días de antigüedad." },
  { q: "¿Cuál es la antigüedad máxima del reporte de AR y AP?", o: ["30 días", "60 días", "90 días", "1 año"], c: 0, x: "Reporte por fecha de vencimiento con antigüedad no mayor a 30 días, con fecha de corte y moneda." },
  { q: "Para accionistas con más del 10% se solicita:", o: ["Solo la identificación", "Identificación, opinión de cumplimiento y constancia de situación fiscal", "Estados financieros personales", "Únicamente el acta constitutiva"], c: 1, x: "Si el accionista es una empresa, se pide otra declaración accionaria hasta llegar a personas naturales." },
  { q: "Deudores locales de México: ¿quién obtiene el historial de pagos?", o: ["El BDO en formato propio", "ExpoCredit lo descarga desde Ekatena/SAT", "El deudor lo envía", "No se necesita"], c: 1, x: "Para deudores fuera de México el BDO sí debe proporcionarlo en el formato de ExpoCredit." },
  { q: "¿Qué NO corresponde al BDO?", o: ["Documentar una visita al prospecto", "Analizar historiales de pago y calcular diluciones", "Verificar que los documentos estén completos", "Entender la operación comercial del cliente"], c: 1, x: "Son temas técnicos de Crédito; el BDO se enfoca en el conocimiento comercial." },
  { q: "¿Cuál de estos es uno de “los grandes NO”?", o: ["Términos Net 45 con OC formal", "Producto en consignación", "Entrega con BOL firmado", "Factura cargada en portal"], c: 1, x: "También: contado, progress billing, facturación anticipada, pay when paid, intercompañía, entre otros." },
  { q: "En la política By The Book, ¿qué historial de pagos se espera idealmente?", o: ["1 experiencia", "3 experiencias", "8 experiencias o más", "No se exige"], c: 2, x: "No se aceptan experiencias limitadas de una, dos o tres facturas." },
  { q: "Los términos de pago que se registran en el KYC deben ser:", o: ["Los que el prospecto desea negociar con el factoraje", "Los vigentes según facturas, OC o contratos actuales", "Un promedio de los últimos años", "Los que fije ExpoCredit"], c: 1, x: "Son la base sobre la cual Crédito analiza el historial de pagos." },
  { q: "¿Cuándo conviene enviar al cliente el ejemplo del contrato de factoring?", o: ["Después del primer fondeo", "Solo tras la aprobación", "Desde el día 1 de la negociación", "Cuando el cliente lo pida"], c: 2, x: "Así el cliente y su equipo legal lo analizan con anticipación. También conviene mencionar los poderes necesarios." },
  { q: "¿Qué retraso puede causar una información de deudor incompleta o errónea?", o: ["Hasta 1 día hábil", "Hasta 15 días hábiles", "Hasta 6 meses", "Ninguno"], c: 1, x: "El deudor no se encuentra en las bases de las aseguradoras y hay que reiniciar o investigar." }
];

const FLASH = [
  ["¿Dónde ocurren la mayoría de los retrasos de onboarding?", "No en underwriting, sino en etapas previas de levantamiento, validación y entendimiento operativo."],
  ["¿Qué es “información de valor” en el KYC?", "La que surge de conversaciones directas con el prospecto o el broker, no de páginas web."],
  ["Formato para líneas de hasta USD 350K", "Formato simplificado de Factoring Application Form (no el estándar)."],
  ["Estados financieros: períodos requeridos", "Últimos 2 años fiscales cerrados + interino del último trimestre (≤ 90 días). P&L y Balance al mismo corte."],
  ["Declaraciones de renta", "Últimos 2 años, todos los países excepto México. Selladas, firmadas o con constancia de recepción. Si no se presentó: extensión oficial."],
  ["Campos del historial de pagos", "Nº factura · Monto factura · Fecha factura · Fecha vencimiento · Fecha pago · Monto pagado."],
  ["Pagos en parcialidades", "Registrar cada pago con su fecha exacta; no solo el último."],
  ["Estados de cuenta bancarios", "Últimos 3 meses, de las cuentas donde pagan los deudores, True PDF sin intervenciones."],
  ["Pagador no identificado en la auditoría bancaria", "Comprobante SWIFT, soporte bancario con nombre del ordenante u otro documento oficial del banco."],
  ["Declaración accionaria", "Llegar hasta personas naturales; para >10%: identificación, opinión de cumplimiento y constancia de situación fiscal."],
  ["Reporte de AR / AP", "Por fecha de vencimiento, ≤ 30 días de antigüedad, con fecha de corte y moneda."],
  ["Detalle de deuda financiera", "Entidad, saldo, tipo de facilidad, vencimiento, tasa y garantías."],
  ["Deudor bajo factoraje o pronto pago", "Pedir historial de la entidad financiera actual + reporte de dilución, o accesos al portal. Sin historial no hay avance."],
  ["Dilución en retailers", "Descuentos, rebates, promociones, devoluciones, penalidades y notas de crédito afectan monto neto cobrable, advance rate y viabilidad."],
  ["Poderes necesarios para firmar el contrato", "Poder para actos de dominio, actos de administración y avalar títulos de crédito."],
  ["Prospectos pequeños (desde USD 250K)", "By The Book: sin excepciones, historial robusto (idealmente 8+), mínimo 2 deudores elegibles."],
  ["Manejo de preguntas al cliente", "Revisarlas internamente; no preguntar lo que ya sabemos; simples en llamada; por escrito solo las técnicas; evitar cuestionarios largos."]
];
