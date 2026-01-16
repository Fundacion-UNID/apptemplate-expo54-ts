export const FormNewOrgSchema = {
    formSchema: {
        "title": "Condition",
        "type": "object",
        "properties": {
            "org.schema.Service.category": {
                "title": "Sector",
                "type": "string",
                "description": "",
                "oneOf": [{
                    "const": "org.schema.Service.category.emergency",
                    "title": "Emergency"
                },
                {
                    "const": "org.schema.Service.category.health-care",
                    "title": "Health Care"
                }]              
            },
            // ...
        }
    },
    uiSchema: {
        "ui:order": [
            // ...
        ],
    }
}