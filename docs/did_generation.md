# Documentación de Generación de `did:web`

## Introducción

Este documento detalla el proceso de generación de identificadores descentralizados (`did:web`) para los usuarios de la plataforma, incluyendo representantes de organizaciones y miembros de familias (individuos). El formato `did:web` permite que los identificadores sean resueltos a través de HTTPS, vinculando la identidad digital a un dominio web.

## Identificador de Empleado de Organización

El `did:web` para un empleado puede presentarse en dos modelos de despliegue, pero ambos utilizan un formato de rol estandarizado para permitir una lógica de resolución de servicios unificada.

### Caso 1: DID Hosteado (Organización sin Dominio Propio)

Cuando la organización utiliza la infraestructura del proveedor de servicios, su DID se construye sobre el dominio del host, cualificado por el identificador de la organización.

**Formato:**
`did:web:<host>:<org_identifier>:employee:<employee_email>:isco-08|<code>`

**Desglose de componentes:**
-   `<host>`: El nombre de host del servicio de pasarela (ej. `gateway.example.com`).
-   `<org_identifier>`: El identificador único de la organización dentro del host (ej. `acme-health`).
-   `employee:<employee_email>`: Identifica al usuario como un empleado a través de su email.
-   `isco-08|<code>`: Especifica el rol del empleado usando el formato `system|code` compatible con FHIR.

**Ejemplo:**
`did:web:gateway.example.com:acme-health:employee:alice.physician@acme.org:isco-08|2211.02`

### Caso 2: DID con Dominio Propio

Si la organización dispone de su propio dominio para servicios de identidad, el formato es más directo.

**Formato:**
`did:web:<org_domain>:employee:<employee_email>:isco-08|<code>`

**Desglose de componentes:**
-   `<org_domain>`: El dominio específico de la organización (ej. `identity.acme.org`).
-   `employee:<employee_email>`: Identifica al usuario como un empleado a través de su email.
-   `isco-08|<code>`: Especifica el rol del empleado.

**Ejemplo:**
`did:web:identity.acme.org:employee:bob.paramedic@acme.org:isco-08|2240`

---

### Principio Clave: Resolución de Servicios Unificada

**Independientemente del modelo de despliegue (hosteado o con dominio propio), la lógica para construir el identificador de servicio (`service.id`) dentro del `did.json` es siempre la misma.**

El `service.id` se construye concatenando el DID base con un fragmento (`#`) que describe el servicio (ej. `#v1-health-care-org.schema-Person-_discovery`).

Esto es fundamental, ya que permite que el SDK utilice una única función (`generateServiceId`) y una única lógica de búsqueda para encontrar los endpoints de servicio, sin necesidad de tener casos especiales para DIDs hosteados o con dominio propio. El SDK trata ambos tipos de DID de manera idéntica a la hora de interactuar con ellos.


---

## Identificador de Miembro de Familia

El `did:web` de un miembro de familia debe estar anclado al `familyId`, al identificador hash multibase derivado del email, y al rol de parentesco/profesión.

**Formato objetivo:**
`did:web:<provider_domain>:family:<family_id>:z<multibase_multihash_email>:<role_system>|<role_code>`

**Desglose de componentes:**
-   `<provider_domain>`: Dominio del proveedor (o `did:web` provider configurado).
-   `family:<family_id>`: Identifica la unidad familiar/tenant.
-   `z<multibase_multihash_email>`: Hash multibase del email del miembro (no UUID aleatorio).
-   `<role_system>|<role_code>`: Rol HL7/ISCO en formato `system|code`.

**Ejemplo:**
`did:web:api.proveedor.org:family:zFam1234:zQmX...:HL7|MTH`

### Nota de compatibilidad

Actualmente parte del SDK aún genera el DID legacy:
`did:web:<provider_domain>:individual:multibase:z<uuid>`

Mientras se completa la migración del SDK, las pantallas de Family deben tratar ese formato como transitorio y priorizar el formato objetivo anterior en nuevas integraciones.
