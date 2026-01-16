// locales/es/appFamily.js

export default {
    screens: {
        auth: {
            title: "Acceso familiar",
            subtitle: "Inicia sesión para continuar",
            description: "Elige cómo quieres acceder a tu cuenta familiar."
        },
        login: {
            title: "Acceso familiar",
            subtitle: "Introduce los datos para acceder con tu rol",
            "country-label": "País",
            "country-placeholder": "Selecciona país",
            "provider-label": "Proveedor",
            "provider-placeholder": "-- Selecciona --",
            "domain-placeholder": "Dominio del proveedor (p. ej., api.acme.org)",
            "familyId-label": "Identificador de familia",
            "familyId-placeholder": "Identificador de familia",
            "role-label": "Rol de parentesco",
            "role-placeholder": "-- Selecciona --",
            continue: "Continuar"
        },
        register: {
            title: "Registro familiar",
            subtitle: "Crea o únete a una cuenta familiar",
            description: "Elige cómo quieres iniciar tu cuenta familiar."
        },
        join: {
            title: "Unirse a una familia",
            subtitle: "Introduce los datos para acceder con tu rol",
            "country-label": "País",
            "country-placeholder": "Selecciona país",
            "provider-label": "Proveedor",
            "provider-placeholder": "-- Selecciona --",
            "familyId-label": "Identificador de familia",
            "familyId-placeholder": "Identificador de familia",
            "role-label": "Rol de parentesco",
            "role-placeholder": "-- Selecciona --",
            continue: "Continuar"
        },
        newEntity: {
            title: "Crear nueva familia",
            subtitle: "Introduce los datos para crear la organización familiar",
            "email-label": "Email",
            "email-placeholder": "p. ej. usuario@ejemplo.com",
            "role-label": "Rol de parentesco",
            "role-placeholder": "-- Selecciona --",
            "familyName-label": "Nombre de la familia del individuo",
            "familyName-placeholder": "Familia de <nombre o apodo>",
            "familyId-label": "ID de familia",
            "familyId-placeholder": "ID de familia generado",
            "country-label": "País",
            "country-placeholder": "Selecciona país",
            "provider-label": "Proveedor",
            "provider-placeholder": "-- Selecciona --"
        },
        dashboard: {
            title: "Panel Familiar",
            subtitle: "Gestionar miembros, permisos y citas",
            description: "Resumen y gestión de la familia.",
            options: {
                "myEntity-button-label": "Mi Familia",
                "myEntity-button-description": "Gestionar miembros, permisos y citas de la familia.",
                "consents-button-label": "Consentimientos",
                "consents-button-description": "Gestionar consentimientos de la familia.",
                "appointments-button-label": "Citas",
                "appointments-button-description": "Gestionar citas familiares."
            },
            messages: {
                welcome: "Bienvenida al panel familiar."
            },
            errors: {
                loadFailed: "No se pudieron cargar los datos de la familia."
            }
        },

        entity: {
            title: "Mi Familia",
            subtitle: "Gestionar miembros, permisos, citas",
            description: "Añadir o gestionar miembros de la familia, permisos y citas.",
            options: {
                "members-button-label": "Miembros",
                "members-button-description": "Gestionar miembros de la familia y asignar roles.",
                "permissions-button-label": "Permisos",
                "permissions-button-description": "Controlar permisos de acceso.",
                "appointments-button-label": "Citas",
                "appointments-button-description": "Gestionar citas familiares."
            }
        },

        identityMenu: {
            title: "Gestión de Identidad",
            subtitle: "Gestionar identificadores y credenciales",
            description: "Gestionar identificadores y credenciales de los miembros de la familia.",
            options: {
                "shareId-button-label": "Compartir ID / QR",
                "shareId-button-description": "Pulsar para mostrar el código QR para compartir el identificador.",
                "linkIdentifiers-button-label": "Vincular Identificadores de Individuo",
                "linkIdentifiers-button-description": "Vincular identificadores adicionales relacionados con la misma persona.",
                "issueCredential-button-label": "Emitir Credencial de Individuo",
                "issueCredential-button-description": "Crear y emitir una credencial verificable.",
                "readIdentity-button-label": "Leer Identidad",
                "readIdentity-button-description": "Revisar la información de identidad almacenada."
            },
            messages: {
                successLink: "Identificadores vinculados con éxito."
            },
            errors: {
                failedLink: "Fallo al vincular los identificadores."
            }
        },

        issueCredential: {
            title: "Emitir Credencial",
            subtitle: "Crear una credencial para un individuo",
            description: "Rellenar los datos para emitir una credencial verificable.",
            options: {
                "uuid-input-label": "UUID",
                "uuid-input-description": "Identificador único para el individuo. Dejar en blanco para autogenerar.",
                "uuid-input-placeholder": "Introducir UUID",
                "birthdate-input-label": "Fecha de Nacimiento",
                "birthdate-input-description": "Fecha de nacimiento del individuo (AAAA-MM-DD).",
                "birthdate-input-placeholder": "AAAA-MM-DD",
                "twins-input-label": "Número de gemelos",
                "twins-input-description": "Introducir 0 si no aplica.",
                "twins-input-placeholder": "0",
                "name-input-label": "Nombre completo oficial",
                "name-input-description": "Usado solo para generar el hash, no se almacena.",
                "name-input-placeholder": "Nombre completo (transliterado)",
                "addAuthorized-checkbox-label": "Añadir personas autorizadas para notificaciones",
                "addAuthorized-checkbox-description": "Habilitar para especificar personas autorizadas para notificar.",
                "submit-button-label": "Emitir Credencial",
                "submit-button-description": "Enviar datos para emitir la credencial."
            },
            messages: {
                success: "Credencial emitida con éxito."
            },
            errors: {
                missingEmail: "El correo es obligatorio si no se especifican destinatarios autorizados."
            }
        },

        documents: {
          title: "Documentos del Usuario",
          subtitle: "Gestionar registros y documentos",
          description: "Añadir, visualizar o gestionar documentos y secciones relacionados con esta familia.",
          options: {
              "selectSubject-button-label": "Seleccionar sujeto / Escanear ID",
              "selectSubject-button-description": "Seleccionar una persona o escanear su código QR.",
              "scanId-button-label": "Escanear ID",
              "scanId-button-description": "Escanear y recuperar la información de identidad.",
              "indexSections-button-label": "Navegar índice y secciones",
              "indexSections-button-description": "Navegar por los documentos por secciones.",
              "addDocument-button-label": "Añadir documento",
              "addDocument-button-description": "Subir un nuevo documento o registro.",
              "summaryRecords-button-label": "Resumen de registros",
              "summaryRecords-button-description": "Visualizar los registros resumidos para este sujeto."
          },
          messages: {
              successUpload: "Documento subido con éxito."
          },
          errors: {
              loadFailed: "No se pudieron cargar los datos del documento."
          }
      },

      communications: {
          title: "Comunicaciones",
          subtitle: "Bandeja de entrada, salida, borradores",
          description: "Crear, enviar y revisar comunicaciones relacionadas con esta familia.",
          options: {
              "createCommunication-button-label": "Crear comunicación",
              "createCommunication-button-description": "Iniciar una nueva comunicación o mensaje.",
              "inbox-button-label": "Bandeja de entrada",
              "inbox-button-description": "Visualizar las comunicaciones recibidas.",
              "sent-button-label": "Enviados",
              "sent-button-description": "Visualizar las comunicaciones enviadas.",
              "drafts-button-label": "Borradores",
              "drafts-button-description": "Acceder a las comunicaciones guardadas como borradores.",
              "outbox-button-label": "Bandeja de salida",
              "outbox-button-description": "Pendiente de entrega o firma."
          },
          messages: {
              sentSuccess: "Comunicación enviada con éxito."
          },
          errors: {
              deliveryFailed: "No se pudo entregar la comunicación."
          },
      },
      connections: {
        'Family Health': 'Salud Familiar',
        'Family Doctor': 'Médico de Familia',
      },
      chatMessages: {
        'fam-1-1': 'Hola cariño, ¿te acordaste de recoger la receta?',
        'fam-1-2': 'Sí, la tengo aquí mismo. Además, he programado una cita de seguimiento para el próximo martes.',
        'fam-1-3': '¡Maravilloso, gracias!',
        users: {
          mom: 'Mamá',
          you: 'Tú',
          drSmith: 'Dr. Smith',
          clinicSpecialist: 'Clínica Especialista',
          physiotherapist: 'Fisioterapeuta',
          clinicaLabs: 'ClinicaLabs',
        }
      }
    },
    roles: {
        ONESELF: {
            label: "Usuario personal"
        }
    },
    providers: {
        unidFoundation: "Fundación UNID"
    }
};
