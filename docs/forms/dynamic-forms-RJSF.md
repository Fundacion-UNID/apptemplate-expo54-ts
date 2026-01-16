# Dynamic Form Rendering with React JSON Schema Form (RJSF)

This document explains the architecture of our dynamic form system. The core principle is to define form structure, validation, and UI rendering as declarative data structures (JSON schemas), keeping the React components simple and reusable.

## 1. What is RJSF?

RJSF (React JSON Schema Form) is a library that automatically generates web forms from a JSON Schema. While we don't use the library directly to render our React Native components, we have adopted its **specification and patterns** as it is a widely-used industry standard.

This means we define our forms using two key schemas:
- **Data Schema:** Defines the data model of the form. What fields exist, their data types (`string`, `number`), and validation rules (`required`, `dependencies`).
- **UI Schema:** Defines how the form should be rendered. What UI widget to use for a field (`select`, `radio`), placeholder text, help messages, etc.

## 2. System Anatomy

Our implementation consists of three main parts:

1.  **Schema Definition File (e.g., `forms/organization-registry-RJSF.ts`):**
    - This is the "brain" of a specific form.
    - It exports a `dataSchema` and a `uiSchema` for each step of the form.
    - It also exports a TypeScript `type` (e.g., `OrgRegistrationForm`) which is manually kept in sync with the schemas, providing static type safety.

2.  **Screen Component (e.g., `screens/organization/OrgNewEntityScreen.tsx`):**
    - This is a "dumb" renderer. Its main job is to orchestrate the rendering process.
    - It imports the `dataSchema` and `uiSchema` for the current form step.
    - It iterates over the list of fields defined in `dataSchema.properties`.
    - For each field, it calls the `renderFormField` utility function.

3.  **`renderFormField` Function (inside the screen component):**
    - This is the "translator" that connects the schema to our React Native component library.
    - It takes a field key (e.g., `'org.schema.Person.email'`) as input.
    - It looks up the field's definition in the `dataSchema` (to get its `title`) and the `uiSchema` (to get its `ui:widget`).
    - It uses a `switch` statement on the `ui:widget` value to decide which component to render (e.g., if `ui:widget` is `"select"`, it renders a `<ThemedPicker />`).

## 3. Dynamic Validation

The form validation logic is also driven by the schema, ensuring that the rules and the rendered fields are always synchronized.

The `isFormValid` memoized function works as follows:
1.  It reads the array of required fields directly from `dataSchema.required`.
2.  It handles conditional validation by reading the `dependencies` block in the schema. For example, it checks if `signatureType` is `1` and, if so, adds the fields from the corresponding `oneOf` block to the list of required fields.
3.  It then iterates over this final list of required field keys and checks that each one has a value in the form's state object.

This pattern prevents common bugs where a field is made required in the UI but the validation logic is not updated. With our system, changing `dataSchema.required` is the single source of truth that updates both the UI (implicitly) and the validation.
