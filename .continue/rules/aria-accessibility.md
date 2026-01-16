---
description: Apply ARIA accessibility props to interactive components to ensure
  they are usable with screen readers.
---

All interactive components (like Pressable, Button, ThemedButton) and key text elements (like ThemedText with a header role) MUST include appropriate accessibility props. Specifically: `accessible`, `accessibilityRole`, and `accessibilityLabel`. Use `accessibilityHint` for additional context where necessary.