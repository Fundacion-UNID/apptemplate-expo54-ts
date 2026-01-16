# Example: The Organization Registration Form

This document provides a concrete example of how the dynamic form rendering system, based on RJSF principles, is used to build the two-step organization registration form.

It references the concepts explained in `dynamic-forms-RJSF.md`.

## 1. Schema Definition

The entire form is defined in `forms/organization-registry-RJSF.ts`. This file exports several key objects:

-   `registrationSchemaPart1` & `registrationUiSchemaPart1`: Define the data model and UI for the first screen (`OrgNewEntityScreen`).
-   `registrationSchemaPart2` & `registrationUiSchemaPart2`: Define the data model and UI for the second screen (`OrgRegisterRepresentativeScreen`).
-   `OrgRegistrationForm`: A manually maintained TypeScript `type` that represents the complete data structure for the entire form, providing type safety.

## 2. Screen Implementation (`OrgNewEntityScreen.tsx`)

This screen implements the first step of the registration.

### Rendering Flow:
1.  The component imports `registrationSchemaPart1` and `registrationUiSchemaPart1`.
2.  In the main `return` statement, inside the `FormStepLayout`, it iterates over `Object.keys(registrationSchemaPart1.properties)`.
3.  For each `key`, it calls a local `renderFormField` function.

### `renderFormField` (Example from Step 1)

This function acts as the "translator":

```typescript
// Simplified example from OrgNewEntityScreen.tsx

const renderFormField = (key: keyof OrgRegistrationForm, columnCount: number) => {
  // 1. Get definitions from schemas
  const fieldSchema = registrationSchemaPart1.properties?.[key];
  const uiSchema = registrationUiSchemaPart1[key] || {};
  
  // 2. Determine widget type
  const widget = uiSchema['ui:widget'];

  let fieldComponent;
  
  // 3. Render the correct RN component based on the widget type
  switch (widget) {
    case 'select':
      // Logic to get picker options...
      fieldComponent = <ThemedPicker ... />;
      break;
    default:
      fieldComponent = <ThemedInput ... />;
      break;
  }

  // 4. Return the component wrapped in a layout View
  return (
    <View key={key} style={{ width: `${100 / columnCount}%`, ... }}>
      <ThemedText>{fieldSchema.title}</ThemedText>
      {fieldComponent}
    </View>
  );
}
```

## 3. Handling Conditional Fields (`OrgRegisterRepresentativeScreen.tsx`)

The second screen demonstrates how conditional logic is handled.

-   The `signatureType` field is rendered as a `"radio"` widget.
-   When the user presses one of the options, the `localData` state is updated (e.g., `localData.signatureType` becomes `1`).
-   The main JSX of the component has a conditional block that only renders the dependent fields when the state matches the condition:

```jsx
// Simplified JSX from OrgRegisterRepresentativeScreen.tsx

{/* Render base fields */}
{Object.keys(registrationSchemaPart2.properties).map(key =>
  renderFormField(key, columnCount)
)}

{/* Conditionally render extra fields based on state */}
{localData.signatureType === 1 &&
  Object.keys(registrationSchemaPart2.dependencies.signatureType.oneOf[1].properties).map(key =>
    renderFormField(key, columnCount)
  )
}
```

This ensures that the UI reacts to user input, while the validation logic in `isFormValid` simultaneously reads the same `dependencies` block from the schema to know which fields to require. This keeps both rendering and validation perfectly in sync.
