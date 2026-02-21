# AetherByte: NaturalScript Language & Dynamic Compiler

**Author:** RK Riad Khan
**Email:** rkriad585@gmail.com
**GitHub Repo:** [GitHub.com/rkriad585/AetherByte](https://github.com/rkriad585/AetherByte)

AetherByte is an innovative web-based development environment designed to empower users to write and execute code in a human-readable language called **NaturalScript**. Beyond its intuitive syntax, AetherByte offers a unique feature: the ability to define and extend the language's syntax using simple JSON configuration files. This makes it a powerful tool for educational purposes, rapid prototyping, or even creating domain-specific languages tailored to your needs.

## 🚀 Features

*   **NaturalScript Language:** Write code using English-like commands, making programming accessible and intuitive.
*   **Dynamic Compiler:** A core component that translates NaturalScript into a custom 8-bit binary instruction set. The compiler's rules are loaded dynamically from JSON files, allowing for easy language extension.
*   **8-bit Virtual Machine (VM):** Executes the compiled binary code, simulating a low-level machine environment.
*   **Web-Based IDE:** A sleek, modern user interface built with Flask, CodeMirror, and Tailwind CSS, providing an integrated editor, binary view, and terminal output.
*   **Custom Syntax Definition:** Extend NaturalScript by adding your own commands and syntax rules via JSON files in the `Aetherlang` directory.
*   **Persistent Storage:** Save and load your NaturalScript projects directly within the application using an SQLite database.
*   **Shareable Projects:** Generate unique, shareable links for your code, complete with configurable permissions (e.g., read-only, execute).
*   **User Settings:** Customize the editor's appearance and core behavior (font size, word wrap, layout, animation speed) via a dedicated settings page.
*   **Responsive Design:** Enjoy a consistent experience across various devices.

## 🛠️ Installation & Setup

To get AetherByte up and running on your local machine, follow these steps:

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/rkriad585/AetherByte.git
    cd AetherByte
    ```

2.  **Create a Virtual Environment (Recommended):**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  **Install Dependencies:**
    ```bash
    pip install Flask
    # Add any other dependencies if they are not automatically installed by Flask
    ```

4.  **Create the `Aetherlang` Directory:**
    The compiler dynamically loads language definitions from this directory.
    ```bash
    mkdir Aetherlang
    ```
    *You will need to place your `.json` language definition files inside this directory. An example `standard.json` might be provided or created by you.*

5.  **Set Environment Variables:**
    AetherByte uses a `SECRET_KEY` for Flask sessions.
    ```bash
    export SECRET_KEY='your_super_secret_key_here'
    # On Windows (Command Prompt): set SECRET_KEY=your_super_secret_key_here
    # On Windows (PowerShell): $env:SECRET_KEY='your_super_secret_key_here'
    ```
    While `DEBUG=True` is set in `config.py`, for production, you would set `FLASK_ENV=production`.

6.  **Run the Application:**
    ```bash
    python app.py
    ```

    The application will typically run on `http://0.0.0.0:5000/`. Open this URL in your web browser.

## ✍️ Usage

### Writing NaturalScript

Navigate to the home page (`/`). You'll find an editor where you can write NaturalScript code.

**Example NaturalScript:**

```naturalscript
set score to 10
add 5 to score
mul 2 to score
print "Result:"
print score
# This is a comment
print "---"
loop 3
    print "Processing..."
alert system
```

*   **`COMPILE` Button:** Translates your NaturalScript into the 8-bit binary instruction set. The binary code will appear in the "BINARY CODE" panel.
*   **`RUN` Button:** Executes the compiled binary code in the Virtual Machine, displaying the output in the "TERMINAL OUTPUT" panel.

### Defining Custom Syntax

1.  **Create a JSON file** (e.g., `my_commands.json`) inside the `Aetherlang` directory.
2.  **Define your commands** as a list of JSON objects. Each object should specify:
    *   `name`: A descriptive name for the rule.
    *   `regex`: A regular expression that matches your desired NaturalScript syntax. Use named capture groups for arguments.
    *   `opcode`: The 8-bit binary instruction code for this command.
    *   `args`: An optional list of argument definitions, mapping regex capture groups to their types (`string` or `int`).

**Example `Aetherlang/standard.json` snippet:**

```json
[
    {
        "name": "SET_VAR_INT",
        "regex": "set (?P<var_name>[a-zA-Z_][a-zA-Z0-9_]*) to (?P<value>\\d+)",
        "opcode": "00010000",
        "args": [
            {"group": "var_name", "type": "string"},
            {"group": "value", "type": "int"}
        ]
    },
    {
        "name": "PRINT_STRING",
        "regex": "print \"(?P<text>[^\"]*)\"",
        "opcode": "00110000",
        "args": [
            {"group": "text", "type": "string"}
        ]
    }
]
```

After saving your JSON file, restart the Flask application for the compiler to load the new rules.

### Saving and Loading Projects

Use the `SAVE` and `LOAD` buttons in the editor header to manage your NaturalScript projects.
*   **Save:** Enter a title and save your current code to the database.
*   **Load:** View a list of your saved projects, load them into the editor, or delete them.

### Sharing Projects

Click the `SHARE` button to generate a unique link for your current code. You can configure permissions (e.g., read-only, execute) for the shared link.

### Settings

Access the settings page (`/settings`) to customize:
*   Editor Font Size
*   Word Wrap
*   Workspace Layout (Standard 3-column or Focus 2-column)
*   Binary Animation Speed
*   Auto-Clear Terminal
*   Factory Reset (clears all local settings)

## 📂 Project Structure

```
.
├── Aetherlang/             # Directory for custom language JSON definitions
├── config.py               # Application configuration (Flask, DB, LANG_DIR)
├── app.py                  # Flask application entry point
├── core/                   # Core logic of the AetherByte system
│   ├── compiler.py         # Dynamic compiler for NaturalScript
│   ├── vm.py               # 8-bit Virtual Machine for binary execution
│   ├── routes.py           # Flask blueprints and API endpoints
│   └── database.py         # SQLite database management
├── static/                 # Frontend static assets (JS, CSS, images)
│   ├── script.js           # Main frontend JavaScript logic
│   └── images/             # Project images (e.g., logo.svg)
├── templates/              # Jinja2 HTML templates for the UI
│   ├── base.html           # Base template for common layout
│   ├── index.html          # Main editor and execution interface
│   └── settings.html       # User settings page
└── .neorwc                 # Neorwc documentation marker file
```

## 🤝 Contributing

Contributions are welcome! If you have suggestions, bug reports, or want to contribute code, please open an issue or submit a pull request on the [GitHub repository](https://github.com/rkriad585/AetherByte).

## 📄 License

This project is open-source and available under the MIT License.

written by Neorwc