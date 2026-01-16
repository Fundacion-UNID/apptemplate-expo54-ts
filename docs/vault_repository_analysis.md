# VaultRepository Query Logic Analysis (Web/Test Environment)

**Last Updated:** 2024-05-24

### 1. Architectural Goal

The `VaultRepository` must provide a persistence layer for "Confidential Storage Documents". The implementation for the test environment (`VaultRepository.web.js`) needs to support:
1.  **Multi-Table Storage:** Saving different document types (like `jobs`, `customers`) in separate collections.
2.  **Flexible Queries:** Allowing searches that combine conditions on:
    *   **Top-level properties** (e.g., `status: 'draft'`).
    *   **Indexed Attributes:** Sensitive properties contained within an `indexed` array inside the document (e.g., `email`, `birthDate`).

### 2. Current Implementation

The current implementation uses an **auxiliary attribute table** architecture to enable searches on `indexed` attributes, as TinyBase cannot natively query inside array objects within a cell.

The data flow is as follows:

*   **`put(tableName, doc)`**:
    1.  Saves the complete document (with its `indexed` array intact) into the main table (e.g., `customers`).
    2.  Calls `_upsertAttrRows`. This method iterates through the `doc.indexed` array and, for each `{ name, value }` pair, inserts a new row into an auxiliary table (e.g., `customers__attrs`). This row contains `{ docId, name, value }`, normalizing the data for searching.

*   **`query(tableName, { where })`**:
    1.  Gets all rows from the main table (e.g., `customers`).
    2.  Filters these rows. For a row to be a valid result, it must meet **all** conditions in the `where` clause.
    3.  For each condition, the `query` logic attempts to find a match in three places:
        *   As a top-level property on the row itself (e.g., `row.status`).
        *   By scanning the `indexed` array on the row itself.
        *   By scanning the entire auxiliary `__attrs` table for a corresponding entry.

### 3. The Problem: Why the Test is Failing

The tests that query by top-level properties (like `status`) **PASS**. The tests that query by `indexed` attributes (like `email` or `birthDate`) **FAIL**, returning `0` results.

**The bug is located in the `query` method's logic.**

The flowchart below illustrates how `query` operates and highlights the point of failure.

```mermaid
flowchart TD
    A[Start query(tableName, where)] --> B[Get all rows from main table];
    B --> C{Loop through each row};
    C --> D{Check if row matches ALL 'where' conditions};
    D -- Yes --> E[Add row to results];
    D -- No --> C;
    C -- End of rows --> F[Return results];

    subgraph "Logic inside 'Check if row matches'"
        G[For each condition in 'where'] --> H{Is it a top-level property?};
        H -- Yes --> I{Does row[attr] match? -> Returns};
        H -- No --> J{Scan inline 'indexed' array};
        J --> K{Match found in 'indexed'? -> Returns};
        
        %% THE FAILURE IS HERE %%
        K -- No --> L[Scan entire '__attrs' table];
        L --> M{Find a row in '__attrs' where docId, name, and value match?};
        M -- "No, returns false" --> N(Condition Fails);
    end

    style N fill:#f00,stroke:#333,stroke-width:2px,color:#fff
```

**Analysis of Failure:**
*   The in-app diagnostic test proved that queries on top-level properties work.
*   The test failure `Expected length: X, Received length: 0` means the `every()` condition in the `filter` is returning `false` for indexed attributes.
*   This happens because **both** the inline `indexed` array scan **and** the auxiliary `__attrs` table scan are failing to find a match, even though the data was correctly inserted by the `put` method in the test's `beforeEach` block.

### 4. Next Steps for the Next Developer

The problem is isolated to the `query` method in `database/VaultRepository.web.js`. The Jest configuration and the test files are now correct.

1.  **Focus on `query`:** Concentrate all efforts on the logic within the `query` method.
2.  **Use `console.log`:** Uncomment the diagnostic `console.log` statement at the beginning of the `query` method. This will print the entire contents of the TinyBase store (`jobs`, `jobs__attrs`, `customers`, `customers__attrs`, etc.) at the moment the query runs. This is the most critical step to verify:
    *   Is the `indexed` array present and correctly formatted on the documents in the main tables?
    *   Is the `__attrs` table being populated correctly by the `put` method?
3.  **Debug the Loops:** Add `console.log` statements inside the `filter` and `every` loops to inspect the values of `row`, `condition`, and to understand why the comparisons for indexed attributes are failing. The issue is likely a subtle error in how the values are being compared or how the loops are structured.
4.  **Do Not Change Configuration:** The problem is confirmed to be in the implementation logic, not in the test setup or project configuration.

This documentation provides a clear path forward.
