// __tests__/data/appointment.data.js
// Contains test data for FHIR Appointment and Communication workflows.
// Converted from the backend TypeScript data files.

// --- Placeholders ---
// In a full environment, these values would be imported from other data files.
const testExamplesDidWeb = {
  individual: 'did:web:example.com:individual:z...',
  customer: 'did:web:example.com:customer:z...',
};
const testTenant1DidWebExternal = 'did:web:api.acme.org';

// --- Appointment Data ---

export const testAppointmentRequestText = "This is your new appointment. Best regards.";
export const testCalendarICSBase64 = `QkVHSU46VkNBTEVOREFSCgpWRVJTSU9OOjIuMApQUk9ESUQ6LS8vQWNtZS8vZGlkOndlYjphcGkuYWNtZS5vcmcvL0VTCkJFR0lOOlZFVkVOVApVSUQ6PHV1aWQtdjQ+CkRUU1RBTVA6MjAyNTEwMTZUMTIwMDAwWgpEVFNUQVJUOjIwMjUxMDE3VDE1MDAwMFoKRF RFTkQ6MjAyNTEwMTdUMTYwMDAwWgpTVU1NQVJZOlJlc3VtZW4gZGUgY2lטYS4KREVTQ1JJUFRJT046RW5jdWVudHJvIHZpcnR1YWwuCkxPQ0FUSU9OOk9ubGluZQpFTkQ6VkVWRU5UCkVORDpWQ0FMRU5EQVI=`;
export const testAppointmentSourceUrl = `https://url-to-appointment-source.com/<uuid-v4>`;

/**
 * Represents the body of a DIDComm Message Extended for an appointment request.
 * This is the object that will become the `content` of the Communication job.
 */
export const testCommMsgExtAppointmentRequest = {
  thid: "urn:uuid:c26e2a2a-6531-4a1f-a185-8a014a6316f7",
  to: [testExamplesDidWeb.individual],
  from: testTenant1DidWebExternal,
  body: {
    data: [
      { type: "Annotation", id: "<text-uuid-v4>", resource: { text: testAppointmentRequestText } },
      {
        type: "Reference",
        id: "<uuid-v4>",
        resource: {
          reference: testAppointmentSourceUrl,
          type: "Appointment"
        }
      },
      {
        type: "Attachment",
        id: "<attachment-uuid>",
        resource: {
          contentType: "text/calendar",
          data: testCalendarICSBase64,
          title: "appointment-details.ics",
        }
      },
    ]
  }
};
