# AetherByte

**Author:** RK Riad Khan
**Email:** rkriad585@gmail.com
**GitHub Repository:** [GitHub.com/rkriad585/AetherByte](https://github.com/rkriad585/AetherByte)

## Project Overview

AetherByte is an innovative platform designed for writing and executing **NaturalScript**, a human-readable, natural language programming language. It features a dynamic compiler that allows users to define their own code syntax using simple JSON files, making it highly extensible. The compiled code is then executed on a custom 8-bit Virtual Machine (VM). The project provides a web-based Integrated Development Environment (IDE) for a seamless coding experience.

## Features

*   **NaturalScript Language:** Write code using intuitive, English-like commands.
*   **Dynamic Compiler:** Easily extend the language by defining new syntax rules and their corresponding opcodes in JSON files.
*   **8-bit Virtual Machine:** A custom VM designed to execute the compiled binary instructions efficiently.
*   **Web-based IDE:** A modern, responsive user interface built with Flask, Tailwind CSS, and CodeMirror for an enhanced coding environment.
*   **Code Persistence:** Save, load, and manage your NaturalScript projects directly within the application using an SQLite database.
*   **Shareable Projects:** Generate unique links to share your NaturalScript code with others.
*   **User Settings:** Customize editor appearance and workspace layout to suit your preferences.

## Getting Started

Follow these steps to set up and run AetherByte on your local machine.

### Prerequisites

*   Python 3.8+
*   `pip` (Python package installer)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/rkriad585/AetherByte.git
    cd AetherByte
    ```

2.  **Create a virtual environment (recommended):**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Initialize Language Definitions:**
    AetherByte loads its language syntax from JSON files in the `Aetherlang` directory. Ensure this directory exists and contains at least `standard.json` (which will be created by this documentation).
    ```bash
    mkdir Aetherlang
    # The standard.json file will be provided in the documentation output.
    # Place it inside the Aetherlang directory.
    ```

### Running the Application

1.  **Start the Flask server:**
    ```bash
    python app.py
    ```
    The application will typically run on `http://0.0.0.0:5000` or `http://127.0.0.1:5000`.

2.  **Access the Web UI:**
    Open your web browser and navigate to `http://localhost:5000`.

## Project Structure

```
AetherByte/
├── Aetherlang/                 # Contains JSON files defining NaturalScript syntax rules
│   └── standard.json           # Default language definitions
├── core/                       # Core backend logic
│   ├── compiler.py             # Converts NaturalScript to 8-bit binary
│   ├── database.py             # Handles SQLite database operations
│   ├── routes.py               # Defines Flask API endpoints and web routes
│   └── vm.py                   # The 8-bit Virtual Machine for executing binary code
├── static/                     # Static assets (JS, CSS, images)
│   └── script.js               # Frontend JavaScript for interactivity
├── templates/                  # Jinja2 HTML templates
│   ├── base.html               # Base template for common UI elements
│   ├── index.html              # Main IDE page
│   └── settings.html           # User settings page
├── app.py                      # Flask application entry point
├── config.py                   # Application configuration
├── requirements.txt            # Python dependencies
├── README.md                   # This file
└── .neorwc                     # Marker file indicating AI-generated documentation
```

## NaturalScript Examples

Here are some examples of NaturalScript code you can try in AetherByte:

### Example 1: Basic Arithmetic and Output

This code demonstrates variable assignment, arithmetic operations, and printing values.

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

**Explanation:**
*   `set score to 10`: Initializes a variable `score` with the value `10`.
*   `add 5 to score`: Adds `5` to `score` (`score` becomes `15`).
*   `mul 2 to score`: Multiplies `score` by `2` (`score` becomes `30`).
*   `print "Result:"`: Prints the string "Result:" to the terminal.
*   `print score`: Prints the current value of the `score` variable.
*   `# This is a comment`: Comments start with `#` or `//` and are ignored by the compiler.
*   `loop 3`: Repeats the following instruction(s) 3 times.
*   `print "Processing..."`: Prints "Processing..." inside the loop.
*   `alert system`: Triggers a system alert (represented by `>> [SYSTEM BELL]` in the terminal).

### Example 2: Conditional Logic (Comparison)

This example shows how to compare values. The `compare` command sets an internal flag (`flag_cmp`) in the VM, which can be used for conditional branching in more advanced scenarios (though direct `if` statements are not yet exposed in NaturalScript).

```naturalscript
set valueA to 20
set valueB to 15

compare valueA with valueB
print "Is valueA greater than valueB?"
# The VM's internal flag_cmp will be True if valueA > valueB
# (Note: Direct 'if' statements are not yet part of NaturalScript syntax,
# but the comparison result is stored internally by the VM.)

set text_var to "Hello"
compare text_var with "World"
print "Are text_var and 'World' equal?"
```

## Adding Custom Syntax

AetherByte's compiler is dynamic, meaning you can extend NaturalScript with your own commands by simply adding JSON files to the `Aetherlang` directory.

### Steps to Add a New Command:

1.  **Define the Command in JSON:**
    Create a new `.json` file (e.g., `Aetherlang/my_commands.json`) or add to an existing one. Each command is an object in a JSON array.

    ```json
    [
        {
            "name": "POWER_CALC",
            "regex": "power (?P<base>\\w+) by (?P<exponent>\\d+) into (?P<result_var>\\w+)",
            "opcode": "01010000",
            "args": [
                {"group": "base", "type": "string"},
                {"group": "exponent", "type": "int"},
                {"group": "result_var", "type": "string"}
            ]
        }
    ]
    ```
    *   `name`: A descriptive name for the rule (for internal reference).
    *   `regex`: A Python regular expression that matches the NaturalScript command. Use `(?P<name>...)` to capture arguments.
    *   `opcode`: The 8-bit binary instruction code that your Virtual Machine will understand. **You must implement this opcode in `core/vm.py` for it to work.**
    *   `args`: An array defining which captured groups from the `regex` correspond to which arguments, and their `type` (`string` or `int`).

2.  **Implement the Opcode in `core/vm.py`:**
    Open `core/vm.py` and add an `elif` block to the `run` method to handle your new `opcode`.

    ```python
    # Inside BinaryVM.run(self, binary_data)
    # ...
                    # POWER_CALC (01010000) - Example for custom command
                    elif opcode == "01010000":
                        # Expects: opcode, base_len, base_name, exponent, result_len, result_name
                        b_len_base = int(parts[1], 2)
                        base_name = "".join([chr(int(b, 2)) for b in parts[2:2+b_len_base]])
                        
                        exponent_val = int(parts[2+b_len_base], 2) # Exponent is an int
                        
                        b_len_result = int(parts[3+b_len_base], 2)
                        result_name = "".join([chr(int(b, 2)) for b in parts[4+b_len_base:4+b_len_base+b_len_result]])

                        base_value = self.memory.get(base_name, 0) # Get base value
                        
                        # Perform the power calculation
                        calculated_value = base_value ** exponent_val
                        self.memory[result_name] = calculated_value
    ```
    *(Note: The above VM implementation is an example for a custom command. You would need to carefully manage argument parsing based on your `args` definition and the VM's instruction pointer `i`.)*

3.  **Restart AetherByte:**
    The compiler reloads language definitions on startup. Restart `app.py` for your new command to be recognized.

4.  **Test Your New Command:**
    Write NaturalScript code using your new command in the AetherByte IDE.

    ```naturalscript
    set my_base to 3
    power my_base by 4 into final_result
    print "The power result is:"
    print final_result
    ```

## Documentation

For more in-depth information, please refer to the `docs/` directory:

*   [`docs/architecture.md`](docs/architecture.md): Detailed overview of AetherByte's system architecture.
*   [`docs/naturalscript_language_guide.md`](docs/naturalscript_language_guide.md): A comprehensive guide to the NaturalScript language.
*   [`docs/extending_aetherbyte.md`](docs/extending_aetherbyte.md): Further details on how to extend the AetherByte platform.
*   [`docs/api_reference.md`](docs/api_reference.md): Reference for the backend API endpoints.

## Contributing

Contributions are welcome! If you'd like to contribute, please fork the repository, create a new branch, and submit a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

written by Neorwc