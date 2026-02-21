# Advanced IDE Configuration & Customization ⚙️

AetherByte provides several client-side configuration options to tailor the Integrated Development Environment (IDE) experience. These settings are stored locally in your browser's `localStorage` and persist across sessions. This section details how to interact with these settings, either through the UI or programmatically via JavaScript snippets.

## Configuration Management Philosophy 💡

AetherByte's IDE settings are designed for user convenience. They are managed entirely within the browser, ensuring that your preferences for layout, font size, and execution visuals are maintained without requiring server-side changes or user accounts.

## 1. Editor Interface Settings 📝

These settings directly impact the appearance and behavior of the NaturalScript code editor.

### 1.1. Font Size

*   **Description:** Adjusts the font size of the CodeMirror editor.
*   **UI Path:** `Settings` page -> `Editor Interface` -> `Font Size` dropdown.
*   **Programmatic Snippet (JavaScript Console):**
    ```javascript
    // Set font size to 'Large' (16px)
    localStorage.setItem('AetherFontSize', '16px');
    // Refresh the page or call applyUserSettings() if available
    location.reload(); 
    ```
*   **Impact:** Changes the visual size of the text in the editor panel. Options include `12px` (Small), `14px` (Medium), `16px` (Large), `18px` (Huge).

### 1.2. Word Wrap

*   **Description:** Toggles whether lines of code wrap within the editor's visible area or extend horizontally, requiring scrolling.
*   **UI Path:** `Settings` page -> `Editor Interface` -> `Word Wrap` toggle switch.
*   **Programmatic Snippet (JavaScript Console):**
    ```javascript
    // Enable word wrap
    localStorage.setItem('AetherLineWrap', 'true');
    // Disable word wrap
    // localStorage.setItem('AetherLineWrap', 'false');
    location.reload();
    ```
*   **Impact:** Affects readability for long lines of code. When enabled, lines will break to fit the editor width.

## 2. Workspace Layout Settings 🖥️

These settings control the overall arrangement of panels within the AetherByte IDE.

### 2.1. Layout Mode

*   **Description:** Switches between 'Standard' (three-column layout: Editor, Binary, Terminal) and 'Focus' (two-column layout: Editor, Terminal, hiding the Binary view).
*   **UI Path:** `Settings` page -> `Workspace Layout` -> `Standard (3 Col)` or `Focus (2 Col)` buttons.
*   **Programmatic Snippet (JavaScript Console):**
    ```javascript
    // Set layout to 'Focus' mode
    localStorage.setItem('AetherLayout', 'focus');
    // Set layout to 'Standard' mode
    // localStorage.setItem('AetherLayout', 'standard');
    location.reload();
    ```
*   **Impact:** The 'Focus' mode provides more horizontal space for the editor and terminal, useful when the binary output is not a primary concern.

## 3. Core Behavior Settings ⏱️

These settings influence the visual feedback and automation of the AetherByte VM.

### 3.1. Binary Animation Speed

*   **Description:** Controls the speed at which individual binary instructions are highlighted in the Binary Output panel during VM execution.
*   **UI Path:** `Settings` page -> `Core Behavior` -> `Binary Animation Speed` dropdown.
*   **Programmatic Snippet (JavaScript Console):**
    ```javascript
    // Set animation speed to 'Cinematic' (20ms delay per instruction)
    localStorage.setItem('AetherBinSpeed', '20');
    // Options: '1' (Instant), '5' (Fast), '20' (Cinematic), '50' (Slow)
    location.reload();
    ```
*   **Impact:** A higher value (e.g., `50`) results in a slower, more deliberate animation, which can be helpful for debugging or understanding VM execution flow.

### 3.2. Auto-Clear Terminal

*   **Description:** Determines if the terminal output is automatically cleared before each new program execution.
*   **UI Path:** `Settings` page -> `Core Behavior` -> `Auto-Clear Terminal` toggle switch.
*   **Programmatic Snippet (JavaScript Console):**
    ```javascript
    // Enable auto-clear
    localStorage.setItem('AetherAutoClear', 'true');
    // Disable auto-clear
    // localStorage.setItem('AetherAutoClear', 'false');
    location.reload();
    ```
*   **Impact:** When enabled, the terminal provides a clean slate for each run, preventing output from previous executions from cluttering the view.

## 4. Factory Reset 🔄

To revert all AetherByte IDE settings to their default values, you can perform a factory reset.

*   **UI Path:** `Settings` page -> `Factory Reset` -> `RESET` button.
*   **Programmatic Snippet (JavaScript Console):**
    ```javascript
    if (confirm("Reset all settings?")) {
        localStorage.clear();
        location.reload();
    }
    ```
*   **Impact:** Clears all `Aether*` keys from `localStorage` and reloads the page, applying the default settings.

## Caveats ⚠️

*   All `localStorage` settings are specific to the browser and device you are using. They are not synchronized across different browsers or machines.
*   These configurations affect the IDE's user interface and visual feedback; they do not alter the compilation or execution logic of NaturalScript itself.

written by Neorwc