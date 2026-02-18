// locales/es/appOrganization.js
export default {
  "screens": {
    "newEntity": {
      "title": "Registrar organización",
      "subtitle": "Introducir los detalles legales de la organización",
      "options": {
        "jurisdiction-label": "Jurisdicción",
        "jurisdiction-placeholder": "-- Seleccionar --",
        "legalType-label": "Tipo de identificador",
        "legalType-placeholder": "-- Seleccionar --",
        "legalValue-label": "Número de identificación",
        "legalValue-placeholder": "Introducir el identificador legal",
        "sector-label": "Sector",
        "sector-placeholder": "-- Seleccionar --",
        "networkRole-placeholder": "-- Seleccionar rol de red --",
        "legalName-label": "Nombre legal",
        "legalName-placeholder": "Nombre legal",
        "shortName-label": "Nombre corto (para hosting)",
        "shortName-placeholder": "ej., acme-global",
        "shortName-description": "Se utiliza para crear la URL de la organización. Usar solo minúsculas, números y guiones.",
        "domain-label": "Dominio o subdominio específico",
        "domain-placeholder": "opcional: ej., api.acme.org",
        "domain-help": "Dominio opcional. Si se indica, el DID pasa a ser did:web:<dominio> (sin path alojado).",
        "commercialName-label": "Nombre comercial",
        "commercialName-placeholder": "opcional: ej., Acme",
        "address1-label": "Línea de dirección",
        "address1-placeholder": "Dirección y número de portal en edificio",
        "address2-label": "Línea de dirección complementaria",
        "address2-placeholder": "Apartamento, suite, etc.",
        "city-label": "Ciudad",
        "city-placeholder": "Ciudad",
        "region-label": "Estado / Provincia / Región",
        "region-placeholder": "Estado o región",
        "postalCode-label": "Código postal",
        "postalCode-placeholder": "número",
        "provider-help": "El host del proveedor se usa cuando no hay dominio propio (DID alojado con tenant/jurisdiction/sector)."
      }
    },
    "auth": {
      "title": "Autenticación",
      "subtitle": "Acceder mediante dirección de email",
      "description": "Iniciar sesión o registrar organización",
      "googleButton": "Continuar con Google",
      "appleButton": "Continuar con Apple"
    },
    "dashboard": {
      "title": "Panel profesional",
      "subtitle": "Gestionar opciones según el rol",
      "description": "Seleccionar una categoría para continuar.",
      "exitConfirm": {
        "title": "¿Salir de la sesión?",
        "message": "¿Seguro que quieres salir?"
      },
      "options": {
        "identity-button-label": "Gestión de identidad",
        "myEntity-button-label": "Mi organización",
        "documents-button-label": "Documentos",
        "communications-button-label": "Comunicaciones"
      }
    },
    "identityMenu": {
      "title": "Gestión de identidad",
      "subtitle": "Administrar identificadores y credenciales",
      "description": "Seleccionar una opción para gestionar la identidad digital de los individuos.",
      "options": {
        "shareId-button-label": "Compartir ID profesional / QR",
        "linkIdentifiers-button-label": "Enlazar identificadores de individuo",
        "issueCredential-button-label": "Emitir credencial de individuo",
        "readIdentity-button-label": "Leer identidad"
      }
    },
    "communications": {
      "title": "Comunicaciones",
      "subtitle": "Gestionar conexiones y mensajes seguros",
      "connections": {
        "Family Health": "Salud Familiar",
        "Family Doctor": "Médico de Familia",
        "Clinic Specialist": "Clínica Especialista",
        "Physiotherapist": "Fisioterapeuta",
        "ClinicaLabs": "ClinicaLabs"
      },
      "chatMessages": {
        "conn-1-1": "Buenos días. Le recordamos su revisión anual el próximo lunes a las 10:00 AM.",
        "conn-2-1": "Los resultados de su reciente escáner están disponibles en la sección de documentos. Por favor, revíselos a la mayor brevedad.",
        "conn-3-1": "Aquí tiene los ejercicios que comentamos. Si tiene alguna pregunta, no dude en consultarme.",
        "conn-4-1": "Sus resultados de laboratorio del 02-09-2026 están listos. Se ha adjuntado una copia en PDF."
      }
    },
    "orgCodeVerification": {
      "title": "Código de Verificación",
      "subtitle": "Introducir el código enviado al correo",
      "options": {
        "01-code-input-label": "Código de Verificación",
        "01-code-input-placeholder": "Introducir el código",
        "02-next-button-label": "Verificar y Continuar"
      }
    },
    "newRepresentative": {
      "title": "Representante autorizado",
      "subtitle": "Proporcionar el email y el cargo o función en la organización",
      "description": "Se enviará un código para verificar la dirección de email.",
      "options": {
        "email-input-label": "Email del Representante",
        "email-input-placeholder": "ej. director@acme.org",
        "role-picker-label": "Seleccionar Función",
        "role-picker-placeholder": "-- Seleccionar --",
        "terms-link-label": "Leer los Términos y Condiciones",
        "accept-terms-checkbox-label": "Acepto los términos para esta función",
        "sendVerificationCode-button-label": "Enviar Código de Verificación",
        "continue-button-label": "Continuar",
        "submissionSentTitle": "Envío de Registro",
        "submissionSentMessage": "El trabajo se ha enviado y está ahora en la cola.",
        "submissionTracking": "Puede seguir su progreso en la consola de trabajos.",
        "jobIdLabel": "ID de Trabajo:",
        "continueToJoin-button-label": "Continuar para Unirse"
      }
    },
    "newConnection": {
      "title": "Nueva conexión",
      "subtitle": "Buscar un usuario para establecer una conexión",
      "searchByLabel": "Buscar por:",
      "tabs": {
        "email": "Email/Teléfono",
        "document": "Identificador",
        "name": "Nombre"
      },
      "docIdLabel": "Identificador del documento",
      "docSubRegionLabel": "Jurisdicción / Sub-región",
      "docSubRegionPlaceholder": "ej., CA-BC, US-WA, ES",
      "docIdPlaceholder": "ID del documento",
      "nameLabel": "Nombre",
      "namePlaceholder": "Nombre de pila del usuario",
      "lastNameLabel": "Primer apellido",
      "lastNamePlaceholder": "Primer apellido del usuario",
      "secondLastNameLabel": "Segundo apellido adicional",
      "secondLastNamePlaceholder": "Segundo apellido del usuario",
      "dobLabel": "Fecha de nacimiento",
      "searchButton": "Buscar usuario",
      "permissionsTitle": "Solicitar permisos",
      "userFound": "Usuario encontrado",
      "purposeLabel": "Propósito",
      "rolesLabel": "Roles",
      "sectionsLabel": "Secciones",
      "requestButton": "Solicitar conexión"
    },

    "login": {
      "title": "Acceso al espacio de datos",
      "subtitle": "Introducir credenciales para acceder con el conector de su organización",
      "connectorData-header": "Datos del conector del espacio de datos",
      "hasDomain-label": "Dominio propio",
      "isHosted-label": "Usar dominio de un proveedor",
      "email-label": "Email del empleado",
      "role-label": "Función",
      "domain-label": "Dominio del conector",
      "domain-placeholder": "ej. api.acme.org",
      "provider-label": "Proveedor",
      "provider-placeholder": "-- Seleccionar proveedor --",
      "jurisdiction-label": "Jurisdicción de la organización",
      "sector-label": "Sector de la organización",
      "sector-placeholder": "ej. salud",
      "shortName-label": "ID corto de organización",
      "shortName-placeholder": "ej. acme"
    },
    "register": {
      "title": "Registro",
      "subtitle": "Unirse a una organización existente o registrar una nueva",
      "options": {
        "create-button-label": "Registrar organización",
        "join-button-label": "Unirse con un código"
      }
    },
    "join": {
      "title": "Inicio de sesión",
      "subtitle": "Introducir credencial y código",
      "sector-picker-label": "Sector",
      "sector-picker-placeholder": "-- Seleccionar sector --",
      "role-picker-label": "Rol",
      "role-picker-placeholder": "-- Seleccionar rol --",
      "code-input-label": "Código recibido",
      "code-input-placeholder": "Introducir el código",
      "join-button-label": "Unirse",
      "options": {
        "codeInput-label": "Código recibido",
        "codeInput-placeholder": "Introducir el código",
        "nextButton-label": "Unirse"
      }
    },
    "myEntity": {
      "title": "Mi organización",
      "subtitle": "Estructura de la organización",
      "description": "Empleados, grupos, departamentos y ubicaciones.",
      "options": {
        "employees-button-label": "Empleados",
        "groups-button-label": "Grupos",
        "departments-button-label": "Departamentos",
        "locations-button-label": "Ubicaciones"
      }
    },
    "manageLocations": {
      "title": "Gestionar ubicaciones",
      "subtitle": "Definir ubicaciones físicas o virtuales para las actividades de su organización."
    },
    "manageDepartments": {
      "title": "Departamentos",
      "subtitle": "Tipos de departamentos en la organización."
    },
    "manageEmployees": {
      "title": "Empleados",
      "subtitle": "Añadir o eliminar empleados del borrador.",
      "groupsLabel": "Grupos",
      "addEmployee": "Añadir empleado",
      "draftTitle": "Cambios pendientes",
      "noDrafts": "No hay empleados en el borrador.",
      "sendRequest": "Enviar petición"
    },
    "manageGroups": {
      "title": "Grupos",
      "subtitle": "Grupos de profesionales según su rol y ubicación",
      "createNew": "Crear nuevo grupo",
      "noGroups": "No se encontraron grupos. Cree uno para empezar.",
      "loading": "Cargando grupos...",
      "groupName": "Nombre del grupo",
      "editHint": "Pulsar para editar este grupo"
    },
    "groupEditor": {
      "newTitle": "Nuevo grupo",
      "newSubtitle": "Definir los detalles del nuevo grupo",
      "editTitle": "Editar grupo",
      "editSubtitle": "Actualizar los detalles del grupo",
      "nameLabel": "Nombre del grupo",
      "namePlaceholder": "ej. Personal de Enfermería",
      "descriptionLabel": "Descripción (opcional)",
      "descriptionPlaceholder": "ej. Enfermeras y asistentes médicos",
      "nameRequired": "El nombre del grupo es obligatorio.",
      "successTitle": "Grupo guardado",
      "successMessage": "El grupo ha sido guardado y se está sincronizando.",
      "jobNotification": {
        "title": "Gestión de grupos",
        "message": "El grupo {{name}} se ha procesado."
      }
    },
    "registerCustomer": {
      "title": "Registrar nuevo cliente",
      "subtitle": "Crear identificador global e índice unificado de datos.",
      "submissionSentTitle": "Envío de registro",
      "submissionSentMessage": "El trabajo se ha procesado y está en la cola.",
      "submissionTracking": "Puede realizar el seguimiento en la consola de trabajos.",
      "jobIdLabel": "Número de trabajo:",
      "finishButton": "Finalizar",
      "createConnectionButton": "Crear conexión",
      "orSeparator": "- o -",
      "emailLabel": "Correo electrónico",
      "emailPlaceholder": "usuario@ejemplo.com",
      "phoneLabel": "Teléfono",
      "phonePlaceholder": "+1234567890",
      "alternateNameLabel": "Apodo (opcional)",
      "alternateNamePlaceholder": "ej. Pepe",
      "providerLabel": "Proveedor de identidad",
      "termsLabel": "Términos y condiciones firmados (PDF)",
      "attachButton": "Adjuntar PDF",
      "registerButton": "Registrar cliente",
      "addEvidenceButton": "Añadir evidencia de identidad",
      "continueButton": "Continuar",
      "tabs": {
        "digital": "Registro con certificado digital",
        "inPerson": "Registro presencial"
      }
    },
    "documents": {
      "options": {
        "selectSubject-button-label": "Seleccionar Individuo / Escanear ID",
        "scanId-button-label": "Escanear ID",
        "indexSections-button-label": "Navegar índice y secciones",
        "addDocument-button-label": "Añadir documento",
        "summaryRecords-button-label": "Resumen de registros"
      }
    }
  }
};
