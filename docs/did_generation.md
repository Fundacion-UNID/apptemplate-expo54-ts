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

## Identificador de Individuo (para Familias)

El `did:web` de un individuo está vinculado al proveedor de servicios (organización) que elige durante su registro. Este proveedor forma la base (el prefijo) de su identificador digital.

**Formato:**
`did:web:<provider_domain>:individual:multibase:z<multibase58_encoded_uuid>`

**Desglose de componentes:**
-   `<provider_domain>`: El dominio del proveedor de servicios elegido por el individuo. Este es el mismo dominio que se usaría para un empleado de esa organización.
-   `individual`: Un segmento de ruta estático que indica que el tipo de identidad es individual.
-   `multibase:z<...>`: Un identificador único para el individuo, generado a partir de un UUID, y codificado en `base58btc` (prefijo `z`) para cumplir con el estándar Multibase.

**Ejemplo:**
Si un individuo se registra bajo el proveedor `api.proveedor.org` y se genera un UUID, su `did:web` sería:
`did:web:api.proveedor.org:individual:multibase:z7922d37279c14480b435a222872c57d7e4c73f4e2e2a`
