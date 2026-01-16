// forms/fhirRJSF.ts

export const formOptionsFhir = {
    "Condition.clinical-status": ["active","recurrence","relapse","inactive","remission","resolved"],
    "Condition.verification-status": ["unconfirmed","provisional","differential","confirmed","refuted","entered-in-error"],
    "Condition.category": ["problem-list-item","encounter-diagnosis"],
    "AllergyIntolerance.clinical-status": ["active","inactive","resolved"],
    "AllergyIntolerance.verification-status": ["unconfirmed","confirmed","refuted","entered-in-error"],
    "AllergyIntolerance.category": ["food","medication","environment","biologic"],
    "MedicationStatement.status": ["active","completed","entered-in-error","intended","stopped","on-hold","unknown"],
    "MedicationStatement.category": ["inpatient","outpatient","community","patientspecified"],
    "Immunization.status": ["completed","entered-in-error","not-done"],
    "Observation.status": ["registered","preliminary","final","amended","corrected","cancelled","entered-in-error","unknown"],
    "Observation.category": ["social-history","vital-signs","imaging","laboratory","procedure","survey","exam","therapy","activity"],
}

export const FormConditionFhirApi = {
    formSchema: {
        "title": "Condition",
        "type": "object",
        "properties": {
            "org.hl7.fhir.api.Condition.code": {
                "title": "Code",
                "type": "string",
                "description": "SNOMED or ICD",
                "oneOf": [{
                    "const": "foo",
                    "title": "Foo"
                },
                {
                    "const": "bar",
                    "title": "Bar"
                }]              
            },
            "org.hl7.fhir.api.Condition.category": { "title": "Category", "type": "string" },
            "org.hl7.fhir.api.Condition.clinical-status": { "title": "Clinical Status", "type": "string" },
            "org.hl7.fhir.api.Condition.verification-status": { "title": "Verification Status", "type": "string" },
            "org.hl7.fhir.api.Condition.severity": { "title": "Severity", "type": "string" },
            "org.hl7.fhir.api.Condition.onset-date": { "title": "Onset Date", "type": "string", "format": "date" }
        }
    },
    uiSchema: {
        "ui:order": [
            "org.hl7.fhir.api.Condition.code",
            "org.hl7.fhir.api.Condition.category",
            "org.hl7.fhir.api.Condition.clinical-status",
            "org.hl7.fhir.api.Condition.verification-status",
            "org.hl7.fhir.api.Condition.severity",
            "org.hl7.fhir.api.Condition.onset-date"
        ],
        "org.hl7.fhir.api.Condition.code": {
            "ui:widget": "CodePicker",
            // "ui:options": { "baseUrl": "https://cdn.example.com/codes", "locale": "es", "system": "org.snomed.ips" }
        }        
    }
}

export const FormAllergyFhirApi = {
    formSchema: {
        "title": "AllergyIntolerance",
        "type": "object",
        "properties": {
            "org.hl7.fhir.api.AllergyIntolerance.code": { "title": "Substance", "type": "string" },
            "org.hl7.fhir.api.AllergyIntolerance.category": { "title": "Category", "type": "string", "enum": ["food","medication","environment","biologic"] },
            "org.hl7.fhir.api.AllergyIntolerance.clinical-status": { "title": "Clinical Status", "type": "string" },
            "org.hl7.fhir.api.AllergyIntolerance.verification-status": { "title": "Verification Status", "type": "string" },
            "org.hl7.fhir.api.AllergyIntolerance.criticality": { "title": "Criticality", "type": "string", "enum": ["low","high","unable-to-assess"] },
            "org.hl7.fhir.api.AllergyIntolerance.onset-date": { "title": "Onset Date", "type": "string", "format": "date" }
        }
    },
    uiSchema: {
        "ui:order": [
            "org.hl7.fhir.api.AllergyIntolerance.code",
            "org.hl7.fhir.api.AllergyIntolerance.category",
            "org.hl7.fhir.api.AllergyIntolerance.clinical-status",
            "org.hl7.fhir.api.AllergyIntolerance.verification-status",
            "org.hl7.fhir.api.AllergyIntolerance.criticality",
            "org.hl7.fhir.api.AllergyIntolerance.onset-date"
        ]
    }
}

export const FormMedicationStatementFhirApi = {
    formSchema: {
        "title": "MedicationStatement",
        "type": "object",
        "properties": {
            "org.hl7.fhir.api.MedicationStatement.code": { "title": "Medication Code", "type": "string" },
            "org.hl7.fhir.api.MedicationStatement.status": { "title": "Status", "type": "string" },
            "org.hl7.fhir.api.MedicationStatement.category": { "title": "Category", "type": "string" },
            "org.hl7.fhir.api.MedicationStatement.effective": { "title": "Effective Date or Period", "type": "string" }
        }
    },
    uiSchema: {
        "ui:order": [
        ]
    }
}

/*
{
  "org.hl7.fhir.api.Immunization.vaccine-code": "CVX#210",
  "org.hl7.fhir.api.Immunization.target-disease": "COVID-19",
  "org.hl7.fhir.api.Immunization.date": "2024-11-15",
  "org.hl7.fhir.api.Immunization.status": "completed",
  "org.hl7.fhir.api.Immunization.lot-number": "AB1234",
  "org.hl7.fhir.api.Immunization.performer": "PHSA Clinic 22",
  "org.hl7.fhir.api.Immunization.location": "Vancouver"
}
*/

export const FormImmunizationFhirApi = {
    formSchema: {
        "title": "Immunization",
        "type": "object",
        "properties": {
            "org.hl7.fhir.api.Immunization.vaccine-code": { "title": "Vaccine Code", "type": "string" },
            "org.hl7.fhir.api.Immunization.target-disease": { "title": "Target Disease", "type": "string" },
            "org.hl7.fhir.api.Immunization.date": { "title": "Date", "type": "string", "format": "date" },
            "org.hl7.fhir.api.Immunization.status": { "title": "Status", "type": "string" },
            "org.hl7.fhir.api.Immunization.lot-number": { "title": "Lot Number", "type": "string" },
            "org.hl7.fhir.api.Immunization.performer": { "title": "Performer", "type": "string" },
            "org.hl7.fhir.api.Immunization.location": { "title": "Location", "type": "string" }
        }
    },
    uiSchema: {
        "ui:order": [
        ]
    }
}

export const FormObservationFhirApi = {
    formSchema: {
        "title": "Observation",
        "type": "object",
        "properties": {
            "org.hl7.fhir.api.Observation.category": { "title": "Category", "type": "string" },
            "org.hl7.fhir.api.Observation.code": { "title": "Code", "type": "string", "description": "LOINC or local code" },
            "org.hl7.fhir.api.Observation.status": { "title": "Status", "type": "string" },
            "org.hl7.fhir.api.Observation.date": { "title": "Date", "type": "string", "format": "date" },
            "org.hl7.fhir.api.Observation.performer": { "title": "Performer", "type": "string" }
        }
    },
    uiSchema: {
        "ui:order": [
        ]
    }
}

export const FormVitalSignsFhirApi = {
    formSchema: {
        "title": "Observation",
        "type": "object",
        "properties": {
            "org.hl7.fhir.api.Observation.category": { "title": "Category", "type": "string" },
            "org.hl7.fhir.api.Observation.code": { "title": "Code", "type": "string", "description": "LOINC or local code" },
            "org.hl7.fhir.api.Observation.status": { "title": "Status", "type": "string" },
            "org.hl7.fhir.api.Observation.date": { "title": "Date", "type": "string", "format": "date" },
            "org.hl7.fhir.api.Observation.performer": { "title": "Performer", "type": "string" }
        }
    },
    uiSchema: {
        "ui:order": [
        ]
    }
}