# **Términos y Condiciones de Uso - Formativa**

El presente documento establece los términos y condiciones bajo los cuales Formativa (en adelante, "la Plataforma") proporciona su infraestructura tecnológica a las organizaciones, empresas de capacitación o academias (en adelante, "el Tenant") y a los usuarios finales inscritos en los cursos (en adelante, "los Estudiantes").

Al utilizar Formativa, las partes aceptan sujetarse a los siguientes lineamientos, en estricto apego a la normativa legal y comercial vigente en la República de Colombia.

## **1. Naturaleza del Servicio y Rol Tecnológico**
Formativa opera exclusivamente como un proveedor de infraestructura tecnológica SaaS (Software as a Service) bajo un modelo B2B Multitenant. La Plataforma facilita un espacio de trabajo (Tenant) para que las organizaciones alojen, gestionen, vendan y certifiquen procesos de formación corporativa y cursos en línea.

Formativa actúa estrictamente como proveedor tecnológico. La Plataforma **no es una institución educativa**, ni un **marketplace**, no diseña planes de estudio ni es responsable directa de los contenidos impartidos por los Tenants.

## **2. Ámbito Educativo y Certificación (Normatividad Colombiana)**
En cumplimiento con el **Artículo 43 de la Ley 115 de 1994** y el **Decreto 1075 de 2015**, la formación ofrecida a través de las organizaciones (Tenants) alojadas en Formativa se clasifica como Educación Informal, definida como todo conocimiento libre y espontáneamente adquirido con una duración inferior a 160 horas.

Por lo tanto:
- Los cursos impartidos no conducen a títulos profesionales ni a certificados de aptitud ocupacional.
- Únicamente dan lugar a la expedición de una **constancia de asistencia** o certificado de finalización, cuya emisión, veracidad y calidad académica recae de forma exclusiva sobre el Tenant que lo otorga.

## **3. Cesión y Exención de Responsabilidad Legal**
El Tenant es responsable de la oferta educativa, sus contenidos, condiciones comerciales, prestación académica y certificaciones que emita. Formativa actúa como proveedor de infraestructura tecnológica y no asume las obligaciones académicas o comerciales propias del Tenant, sin perjuicio de las responsabilidades que correspondan a Formativa por sus propios servicios y actuaciones conforme a la legislación aplicable.
**Es responsabilidad del Tenant:**
1. **Calidad y Propiedad Intelectual:** La calidad pedagógica, idoneidad y los derechos de autor de los contenidos multimedia, evaluaciones y textos cargados en su espacio de trabajo.
2. **Promesas de Valor:** Cualquier garantía de aprendizaje, mejora laboral, u oferta engañosa promocionada a los Estudiantes por parte del Tenant.
3. **Disputas y Reclamaciones:** Conflictos legales, académicos o comerciales con Estudiantes. El Tenant se hace responsable ante cualquier reclamación de la Superintendencia de Industria y Comercio (SIC), el Ministerio de Educación Nacional o entidades equivalentes.

## **4. Pagos, Transacciones y Facturación**
Para facilitar la compra autónoma de cursos, la Plataforma cuenta con integración a pasarelas de pago autorizadas (ej. Mercado Pago).
- **Rol de Facilitador:** Formativa facilita de manera no obligatoria el recaudo tecnológico y podrá percibir por concepto de uso de pasarela una fracción del pago por transacción acordadas previamente con el Tenant.
- **Responsabilidad Tributaria y Facturación:** El Tenant es el vendedor final del servicio frente al Estudiante y es el único responsable de emitir la factura electrónica o documento equivalente por el valor total de la capacitación.
- **Política de Reembolsos y Contracargos:** La gestión de solicitudes de devolución de dinero, insatisfacción del curso o contracargos bancarios es responsabilidad exclusiva del Tenant. Formativa no asume devoluciones hacia el Estudiante final.
- **Seguridad Financiera (PCI-DSS):** Formativa no almacena números, vencimientos, ni CVV de tarjetas de crédito o débito; todo el procesamiento sensible es manejado directamente por la pasarela de pago.

## **5. Tratamiento de Datos Personales (Ley 1581 de 2012 - Habeas Data)**
El manejo de los datos personales (incluyendo nombre, documentos de identidad y correos electrónicos) operará de la siguiente forma:
- **Rol de las Partes:** El Tenant actúa como el **Responsable del Tratamiento** frente al Estudiante, decidiendo la finalidad y alcance de los datos. Formativa actúa únicamente como el **Encargado del Tratamiento**, resguardando la información bajo la arquitectura de base de datos aislada (Row-Level Security en PostgreSQL).
- **Retención y Purga de Datos (Data Retention):** Dado que la educación informal no forma parte del sistema educativo formal sancionado por el Estado, no aplica la Ley General de Archivos ni las Tablas de Retención Documental oficiales para el mantenimiento histórico de exámenes o tareas. Formativa está facultada para aplicar políticas de limpieza o purga, eliminando tareas, respuestas de evaluaciones y archivos subidos por los estudiantes tras el vencimiento de la certificación, conservando únicamente el UUID de registro del certificado para fines de verificación pública y los datos pertinentes solicitados en el registro para la adquisición de la cuenta como usuario con rol de estudiante.
- **Consentimiento:** El Tenant es responsable de recolectar el consentimiento informado de sus Estudiantes para la transferencia de sus datos a los servidores e infraestructura de Formativa.

## **6. Aceptación y Actualización**
El uso continuado de la plataforma implica la aceptación de estos términos. Formativa se reserva el derecho de modificarlos, notificando a los Tenants con antelación razonable sobre los cambios relevantes.

## **7. Verificación de Identidad y Legitimidad Comercial (KYC)**
Con el fin de garantizar la transparencia, prevenir el fraude y evitar la celebración de contratos con entidades falsas o "fachadas", Formativa se reserva el derecho de exigir al Tenant la presentación de documentación legal y corporativa que acredite su legitimidad, ya sea al inicio de la relación comercial o en cualquier momento durante la vigencia del servicio.
Esta documentación podrá incluir, de manera enunciativa pero no limitativa:
- **Certificado de Existencia y Representación Legal expedido por la Cámara de Comercio (o entidad equivalente).**
- **Copia del Registro Único Tributario (RUT).**
- **Documento de identidad del representante legal de la organización.**
Licencias, resoluciones o permisos especiales que acrediten su idoneidad para prestar los servicios de capacitación bajo la razón social o marca comercial utilizada en la Plataforma.
En caso de que el Tenant se niegue a aportar la documentación requerida, o si Formativa detecta irregularidades, información falsa o inconsistencias que sugieran actividad ilícita o fraudulenta, Formativa estará facultada para suspender de manera inmediata o terminar unilateralmente el servicio y la suscripción del Tenant sin lugar a reembolso, liberándose de cualquier responsabilidad frente al Tenant y sus Estudiantes.