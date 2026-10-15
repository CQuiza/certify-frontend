import { useState, type ReactNode } from 'react'
import {
  Shield,
  Star,
  ChevronDown,
  ChevronRight,
  BookOpen,
  GraduationCap,
  LayoutGrid,
  Workflow,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react'
import { config } from '../config'

type RoleKey = 'superuser' | 'admin' | 'teacher' | 'student'

interface ManualItem {
  title: string
  icon?: typeof BookOpen
  content: ReactNode
}

interface RoleSection {
  title: string
  icon: typeof BookOpen
  color: string
  bg: string
  border: string
  items: ManualItem[]
}

const TabsList = ({ tabs }: { tabs: string[] }) => (
  <div className="flex flex-wrap gap-1.5">
    {tabs.map((t) => (
      <span
        key={t}
        className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600"
      >
        {t}
      </span>
    ))}
  </div>
)

const Note = ({ children }: { children: ReactNode }) => (
  <p className="rounded-lg border border-indigo-100 bg-indigo-50/60 px-3 py-2 text-sm text-indigo-900">
    {children}
  </p>
)

const Warn = ({ children }: { children: ReactNode }) => (
  <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
    <div>{children}</div>
  </div>
)

const sections: Record<RoleKey, RoleSection> = {
  superuser: {
    title: 'Superusuario',
    icon: Star,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    items: [
      {
        title: 'Pestañas disponibles',
        icon: LayoutGrid,
        content: (
          <div className="space-y-3">
            <p>El superusuario tiene acceso a todas las pestañas de la plataforma:</p>
            <TabsList
              tabs={[
                'Inicio',
                'Dashboard',
                'Usuarios',
                'Cursos',
                'Certificados',
                'Progreso',
                'Tipos de Certificado',
                'Auditoría',
                'Monitoreo',
                'Organizaciones',
                'Reportes',
                'Manual',
                'Configuración',
                'FAQ',
              ]}
            />
            <Note>
              El superusuario puede además <strong>actuar como otra organización</strong> (impersonación)
              desde la pestaña Organizaciones; mientras está activo verá un aviso y podrá volver a la
              plataforma con un clic.
            </Note>
          </div>
        ),
      },
      {
        title: 'Organizaciones (multitenant)',
        icon: Shield,
        content: (
          <div className="space-y-2">
            <p>Cada organización (tenant) es un espacio white-label aislado con su marca, usuarios, cursos y datos.</p>
            <ul className="list-disc list-inside ml-2 text-sm text-slate-600 space-y-1">
              <li><strong>Crear organización:</strong> define nombre, subdominio (slug), correo y nombre del administrador. Se genera un administrador y una contraseña inicial (se muestra una sola vez).</li>
              <li><strong>Activar / desactivar:</strong> una organización inactiva no permite acceso a sus usuarios.</li>
              <li><strong>Reset de administrador:</strong> regenera la contraseña del administrador de la organización.</li>
              <li><strong>Ver como (impersonar):</strong> el superusuario entra al contexto de esa organización.</li>
              <li><strong>Backup SQL:</strong> descarga un respaldo completo de la base de datos (PostgreSQL).</li>
            </ul>
          </div>
        ),
      },
      {
        title: 'Configuración de la plataforma',
        icon: BookOpen,
        content: (
          <div className="space-y-2">
            <p>Desde <strong>Configuración</strong> el superusuario personaliza por organización:</p>
            <ul className="list-disc list-inside ml-2 text-sm text-slate-600 space-y-1">
              <li><strong>Organización / marca:</strong> nombre, mensaje del dashboard, datos de contacto y logo.</li>
              <li><strong>Correo saliente (SMTP):</strong> host, puerto, usuario, contraseña (cifrada), TLS y remitente, con envío de prueba.</li>
              <li><strong>Plantillas de correo:</strong> asunto y cuerpo para credenciales, certificado emitido y certificado expirado.</li>
              <li><strong>Plantilla de certificado:</strong> subir un PDF base propio y previsualizarlo.</li>
              <li><strong>Pagos:</strong> habilitar Mercado Pago y el identificador de marketplace (split de comisión).</li>
            </ul>
          </div>
        ),
      },
      {
        title: 'Usuarios y roles',
        icon: Shield,
        content: (
          <div className="space-y-2">
            <p><strong>Crear usuario:</strong> el sistema envía las credenciales por correo. Solo un superusuario puede crear a otro superusuario.</p>
            <p><strong>Desactivar</strong> (recomendado) en lugar de eliminar: el usuario no puede iniciar sesión pero conserva certificados, progreso e inscripciones.</p>
            <p><strong>Eliminar usuario:</strong> guarda un volcado JSON completo en la auditoría de usuarios y elimina en cascada certificados, inscripciones y progreso. No se permite si tiene tipos de certificado o auditoría asociados.</p>
            <Warn>Los superusuarios no pueden eliminarse; debe existir al menos uno activo.</Warn>
          </div>
        ),
      },
      {
        title: 'Certificados: manual y automático',
        icon: Workflow,
        content: (
          <div className="space-y-2">
            <p><strong>Emisión manual:</strong> Certificados → "Adicionar Nuevo Certificado": elegir usuario y tipo de certificado (fecha de emisión opcional). El sistema genera UUID, QR y PDF.</p>
            <p><strong>Emisión automática ("en proceso"):</strong> al crear un certificado pendiente ligado a un curso, el estudiante queda inscrito y el certificado se emite solo cuando completa el 100% (todas las evaluaciones aprobadas y todas las tareas entregadas). Puede forzarse antes con "Emitir ahora".</p>
            <p><strong>Revocar / Reactivar:</strong> cambiar el estado del certificado. Revocar mantiene el registro histórico y marca el PDF.</p>
            <p><strong>Renovar:</strong> reasigna el curso y reinicia el progreso; el mismo certificado (mismo UUID) se reactiva al recompletar el curso. También puede emitirse en lote.</p>
          </div>
        ),
      },
      {
        title: 'Auditoría y Monitoreo',
        icon: Shield,
        content: (
          <div className="space-y-2">
            <p><strong>Auditoría</strong> (solo lectura, 4 pestañas): Certificados (emisiones, revocaciones, expiraciones), Trabajos (expiración de certificados, backups), Usuarios eliminados (volcado JSON) y Correos (estado de envío).</p>
            <p><strong>Monitoreo</strong> (solo superusuario): eventos y errores de la API, workers y frontend, con niveles y correlación por <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">request_id</code>.</p>
          </div>
        ),
      },
      {
        title: 'Permisos y alcances',
        icon: Shield,
        content: (
          <div className="space-y-2">
            <p>El superusuario es el rol de mayor privilegio y tiene <strong>alcance global</strong> (todas las organizaciones):</p>
            <ul className="list-disc list-inside ml-2 text-sm text-slate-600 space-y-1">
              <li>Crear, activar/desactivar organizaciones y actuar dentro de ellas (impersonación).</li>
              <li>Crear y editar otros superusuarios (privilegio exclusivo).</li>
              <li>Configurar la plataforma por organización (marca, correo, plantillas, pagos).</li>
              <li>Gestionar cualquier usuario, curso, tipo de certificado y certificado.</li>
              <li>Emitir, revocar, renovar y eliminar certificados; emitir en lote y forzar pendientes.</li>
              <li>Ver reportes, dashboard, auditoría y monitoreo; descargar backups de base de datos.</li>
            </ul>
            <Warn>
              Por su alcance, el superusuario puede ver y modificar información de cualquier organización.
              Asigne este rol solo a personal técnico de confianza y mínimo indispensable.
            </Warn>
          </div>
        ),
      },
      {
        title: 'Disclaimer y responsabilidad',
        icon: AlertTriangle,
        content: (
          <div className="space-y-2 text-sm text-slate-600">
            <p>
              Acreditapp es una <strong>herramienta tecnológica</strong> de gestión, emisión y verificación de
              constancias y certificados de educación complementaria e informal. <strong>No es una institución
              de educación formal</strong> ni otorga títulos o certificaciones ocupacionales.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>La validez, veracidad y contenido de cada certificado son responsabilidad exclusiva de la organización que lo emite.</li>
              <li>El uso de datos personales debe cumplir la Ley 1581 de 2012 (Habeas Data); la organización es la responsable del tratamiento.</li>
              <li>La plataforma no sustituye asesoría legal, académica ni regulatoria.</li>
              <li>El uso indebido de la marca, de datos de terceros o la emisión de certificados sin respaldo es responsabilidad del usuario.</li>
            </ul>
          </div>
        ),
      },
      {
        title: 'Buenas prácticas',
        icon: Lightbulb,
        content: (
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
            <li>Desactivar usuarios en lugar de eliminarlos para preservar historial.</li>
            <li>Revocar certificados en lugar de eliminarlos.</li>
            <li>Mantener mínimo el número de superusuarios y auditarlos.</li>
            <li>Configurar SPF/DKIM del dominio de correo antes de producción.</li>
            <li>Revisar Monitoreo y Auditoría periódicamente.</li>
          </ul>
        ),
      },
    ],
  },
  admin: {
    title: 'Administrador',
    icon: Shield,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    items: [
      {
        title: 'Pestañas disponibles',
        icon: LayoutGrid,
        content: (
          <div className="space-y-3">
            <TabsList
              tabs={[
                'Inicio',
                'Dashboard',
                'Usuarios',
                'Cursos',
                'Certificados',
                'Progreso',
                'Tipos de Certificado',
                'Auditoría',
                'Reportes',
                'Manual',
                'FAQ',
              ]}
            />
            <Note>
              El administrador opera <strong>solo dentro de su organización</strong>. No accede a
              Organizaciones, Configuración de plataforma ni Monitoreo (reservados al superusuario).
            </Note>
          </div>
        ),
      },
      {
        title: 'Gestión de usuarios',
        icon: Shield,
        content: (
          <div className="space-y-2">
            <p><strong>Crear usuario:</strong> todos los campos obligatorios excepto el segundo apellido. Se envía correo con credenciales. No puede crear superusuarios.</p>
            <p><strong>Editar / desactivar:</strong> puede modificar cualquier campo (salvo convertir a superusuario) y desactivar usuarios.</p>
            <p><strong>Eliminar:</strong> guarda un volcado JSON en auditoría. No se permite si el usuario tiene tipos de certificado o auditoría asociados.</p>
          </div>
        ),
      },
      {
        title: 'Cursos, contenido y venta',
        icon: GraduationCap,
        content: (
          <div className="space-y-2">
            <p><strong>Crear curso:</strong> título, descripción, estado, tipo de certificado asociado, docente (opcional) e imagen de portada.</p>
            <p><strong>Estados:</strong> borrador (no visible), publicado (visible en el catálogo) y archivado (oculto, conserva accesos).</p>
            <p><strong>Venta:</strong> con "Disponible para compra" y precio &gt; 0, el curso aparece en el catálogo con carrito y pago en línea (COP). El precio de renovación es opcional.</p>
            <p><strong>Módulos y lecciones:</strong> cada curso tiene módulos, y cada módulo lecciones con texto, imagen, video y archivos. Se pueden crear tareas y una evaluación por módulo.</p>
          </div>
        ),
      },
      {
        title: 'Certificados: workflows',
        icon: Workflow,
        content: (
          <div className="space-y-2">
            <p><strong>Manual:</strong> emitir seleccionando usuario + tipo (y fecha opcional).</p>
            <p><strong>Automático ("en proceso"):</strong> crear un pendiente ligado a un curso; se emite al completar el 100% (evaluaciones aprobadas + tareas entregadas) o al forzarlo.</p>
            <p><strong>Revocar / reactivar / renovar:</strong> igual que en el detalle de certificados.</p>
            <p><strong>Tipos de certificado:</strong> definen horas y vigencia (básico, avanzado, diplomado o personalizados).</p>
          </div>
        ),
      },
      {
        title: 'Progreso y reportes',
        icon: BookOpen,
        content: (
          <div className="space-y-2">
            <p><strong>Progreso:</strong> consultar el avance de cada estudiante por curso y módulo, con evaluaciones y tareas.</p>
            <p><strong>Reportes:</strong> certificados, contenido por docente, intentos de evaluación, calificaciones de tareas, etc., exportables a CSV.</p>
          </div>
        ),
      },
      {
        title: 'Límites',
        icon: AlertTriangle,
        content: (
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
            <li>No puede ver, crear ni editar superusuarios.</li>
            <li>No gestiona organizaciones (tenants) ni la configuración de plataforma.</li>
            <li>No accede a Monitoreo ni a backups de base de datos.</li>
          </ul>
        ),
      },
      {
        title: 'Buenas prácticas',
        icon: Lightbulb,
        content: (
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
            <li>Desactivar en lugar de eliminar; revocar en lugar de eliminar certificados.</li>
            <li>Archivar cursos en lugar de eliminarlos.</li>
            <li>Verificar horas y vigencia del tipo de certificado antes de emitir.</li>
            <li>Mantener la imagen y el precio de los cursos actualizados.</li>
          </ul>
        ),
      },
    ],
  },
  teacher: {
    title: 'Docente',
    icon: GraduationCap,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    items: [
      {
        title: 'Pestañas disponibles',
        icon: LayoutGrid,
        content: (
          <div className="space-y-3">
            <TabsList tabs={['Inicio', 'Dashboard', 'Cursos', 'Certificados', 'Progreso', 'FAQ']} />
            <Note>
              El rol de docente puede estar oculto según la configuración de la plataforma
              (<code className="text-xs bg-slate-100 px-1 py-0.5 rounded">VITE_SHOW_TEACHER_ROLE</code>).
            </Note>
          </div>
        ),
      },
      {
        title: 'Qué puede hacer',
        icon: Workflow,
        content: (
          <div className="space-y-2">
            <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
              <li><strong>Crear cursos:</strong> al crear un curso, el docente queda como su responsable.</li>
              <li><strong>Gestionar contenido</strong> de sus cursos: módulos, lecciones (texto, imagen, video, archivos) y adjuntos.</li>
              <li><strong>Tareas:</strong> crear tareas por lección (archivo o enlace de Google Drive) y calificar las entregas de sus cursos con nota y retroalimentación.</li>
              <li><strong>Evaluaciones:</strong> configurar la evaluación por módulo (preguntas de opción múltiple o verdadero/falso, puntaje mínimo de aprobación).</li>
              <li><strong>Estudiantes:</strong> inscribir y desinscribir estudiantes en sus cursos.</li>
              <li><strong>Progreso:</strong> ver el avance de los estudiantes de sus cursos.</li>
            </ul>
          </div>
        ),
      },
      {
        title: 'Workflows (manual y automático)',
        icon: Workflow,
        content: (
          <div className="space-y-2 text-sm text-slate-600">
            <p><strong>Manual:</strong> crear/editar módulos, lecciones, tareas y la evaluación; calificar entregas; inscribir estudiantes.</p>
            <p><strong>Automático:</strong> al aprobar la evaluación y entregar todas las tareas, el módulo se marca completado y el curso llega al 100%; si el curso tiene un certificado pendiente, se <strong>emite automáticamente</strong>.</p>
            <p><strong>Estados:</strong> las entregas quedan "Pendiente" hasta que el docente las califica; los certificados pueden estar "En proceso" (pendiente de completar el curso) o emitidos.</p>
          </div>
        ),
      },
      {
        title: 'Límites',
        icon: AlertTriangle,
        content: (
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
            <li>Solo gestiona <strong>sus propios cursos</strong>; no puede editar cursos de otros docentes.</li>
            <li>No gestiona usuarios a nivel global, tipos de certificado, ni emite certificados.</li>
            <li>No accede a Auditoría, Monitoreo, Reportes globales ni Configuración.</li>
          </ul>
        ),
      },
      {
        title: 'Buenas prácticas',
        icon: Lightbulb,
        content: (
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
            <li>Definir el puntaje mínimo de aprobación según el tipo de curso (en cursos de salud, superior a 80).</li>
            <li>Marcar siempre la respuesta correcta en preguntas de opción múltiple (es obligatorio para guardar).</li>
            <li>Revisar y calificar las entregas con retroalimentación clara.</li>
            <li>Subir videos/archivos compatibles (MP4, PDF, DOCX, PPTX, XLSX, JPG, PNG).</li>
          </ul>
        ),
      },
    ],
  },
  student: {
    title: 'Estudiante',
    icon: GraduationCap,
    color: 'text-sky-600',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    items: [
      {
        title: 'Pestañas disponibles',
        icon: LayoutGrid,
        content: (
          <div className="space-y-3">
            <TabsList tabs={['Inicio', 'Cursos', 'Certificados', 'Progreso', 'Perfil', 'FAQ']} />
            <Note>El estudiante solo ve los cursos en los que está inscrito (o que compró).</Note>
          </div>
        ),
      },
      {
        title: 'Qué puede hacer',
        icon: Workflow,
        content: (
          <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
            <li><strong>Comprar cursos</strong> desde el catálogo (carrito + pago en línea) o ser inscrito por un docente/administrador.</li>
            <li><strong>Consumir lecciones:</strong> texto, imágenes, videos y archivos adjuntos.</li>
            <li><strong>Entregar tareas:</strong> un único archivo PDF por tarea (un solo intento).</li>
            <li><strong>Presentar evaluaciones</strong> por módulo (intentos ilimitados).</li>
            <li><strong>Ver su progreso</strong> y los comentarios/notas de sus tareas.</li>
            <li><strong>Consultar y renovar</strong> sus certificados (si están vencidos y el curso lo permite).</li>
          </ul>
        ),
      },
      {
        title: 'Límites',
        icon: AlertTriangle,
        content: (
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
            <li>No puede editar cursos, contenidos ni evaluaciones.</li>
            <li>Las tareas son de un solo intento y solo en PDF.</li>
            <li>No puede renovar un certificado que no esté vencido, ni renovar dos veces el mismo certificado sin completar el curso de nuevo.</li>
          </ul>
        ),
      },
      {
        title: 'Buenas prácticas',
        icon: Lightbulb,
        content: (
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
            <li>Revisar el material antes de presentar la evaluación.</li>
            <li>Verificar que el PDF de la tarea esté completo antes de enviarlo (no se puede reemplazar).</li>
            <li>Completar evaluaciones y tareas para que el certificado se emita automáticamente.</li>
          </ul>
        ),
      },
    ],
  },
}

const roleOrder: RoleKey[] = ['superuser', 'admin', 'teacher', 'student']

export default function ManualPage() {
  const [role, setRole] = useState<RoleKey>('superuser')
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0]))

  function selectRole(r: RoleKey) {
    setRole(r)
    setOpenItems(new Set([0]))
  }

  function toggleItem(idx: number) {
    setOpenItems((prev) => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  const current = sections[role]

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manual de Uso</h1>
          <p className="mt-1 text-sm text-slate-500">Guía completa de la plataforma {config.appName}</p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1">
        {roleOrder.map((r) => {
          const s = sections[r]
          const Icon = s.icon
          const active = role === r
          return (
            <button
              key={r}
              onClick={() => selectRole(r)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                active ? `bg-white ${s.color} shadow-sm` : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              {s.title}
            </button>
          )
        })}
      </div>

      <div className="space-y-3">
        {current.items.map((item, i) => {
          const open = openItems.has(i)
          const Icon = item.icon || current.icon
          return (
            <div key={`${role}-${i}`} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <button
                onClick={() => toggleItem(i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-slate-50"
              >
                <span className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${current.color}`} />
                  <span className="font-semibold text-slate-900">{item.title}</span>
                </span>
                {open ? (
                  <ChevronDown className="h-5 w-5 shrink-0 text-slate-400" />
                ) : (
                  <ChevronRight className="h-5 w-5 shrink-0 text-slate-400" />
                )}
              </button>
              {open && (
                <div className="border-t border-slate-100 px-5 py-4 text-sm text-slate-700 leading-relaxed">
                  {item.content}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
