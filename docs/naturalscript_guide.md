# NaturalScript Language Guide

NaturalScript is a human-readable programming language designed for simplicity and extensibility within the AetherByte environment. Its syntax is inspired by natural English, making it easy to learn and understand. This guide covers the basic syntax and core functionalities of NaturalScript.

## Introduction to NaturalScript

NaturalScript aims to abstract away complex programming concepts, allowing users to focus on logic using straightforward commands. The language is dynamically compiled, meaning its capabilities can be extended by adding new syntax rules via JSON files.

## Basic Syntax & Core Commands

Here are some fundamental commands and concepts in NaturalScript, often demonstrated with examples.

### 1. Variables

Variables are used to store data. You can declare and assign values using the `set` command.

*   **Syntax:** `set <variable_name> to <value>`
*   **Example:**
    ```naturalscript
    set score to 10
    set username to "AetherUser"
    ```
    *   `<variable_name>`: Must start with a letter or underscore, followed by letters, numbers, or underscores.
    *   `<value>`: Can be an integer or a string (enclosed in double quotes).

### 2. Arithmetic Operations

NaturalScript supports basic arithmetic operations on variables.

*   **Syntax:**
    *   `add <value> to <variable_name>`
    *   `sub <value> from <variable_name>`
    *   `mul <value> to <variable_name>`
    *   `div <value> by <variable_name>`
*   **Example:**
    ```naturalscript
    set score to 10
    add 5 to score    # score becomes 15
    mul 2 to score    # score becomes 30
    sub 10 from score # score becomes 20
    div 4 by score    # score becomes 5
    ```
    *   `<value>`: Can be an integer.
    *   `<variable_name>`: The name of an existing variable.

### 3. Output

To display information in the terminal, use the `print` command. You can print literal strings or the value of a variable.

*   **Syntax:**
    *   `print "<text>"`
    *   `print <variable_name>`
*   **Example:**
    ```naturalscript
    set message to "Hello, AetherByte!"
    print "--- Program Output ---"
    print message
    print "The current score is:"
    print score
    ```

### 4. Control Flow: Loops

The `loop` command allows you to repeat a block of code a specified number of times.

*   **Syntax:**
    ```naturalscript
    loop <number_of_times>
        <code_to_repeat>
        <code_to_repeat>
        ...
    ```
*   **Example:**
    ```naturalscript
    loop 3
        print "Iteration complete."
        add 1 to counter
    print "Loop finished."
    ```
    *   `<number_of_times>`: An integer specifying how many times the subsequent single line of code should repeat. **Important:** In the current VM implementation, `loop` only applies to the *very next line* of binary code. For multi-line loops, you would need more advanced compiler/VM logic (e.g., block delimiters or indentation parsing). The example above implies that `print "Iteration complete."` will loop 3 times, and `add 1 to counter` will execute only once after the loop.

### 5. System Commands

NaturalScript includes commands to interact with the AetherByte system.

*   **`alert system`:** Triggers a system alert (represented as `>> [SYSTEM BELL]` in the terminal).
*   **`clear terminal`:** Clears all previous output from the terminal.

*   **Example:**
    ```naturalscript
    print "Starting process..."
    alert system
    loop 2
        print "Working..."
    clear terminal
    print "Process complete."
    ```

### 6. Comments

Comments are non-executable lines of code used for documentation. They are ignored by the compiler.

*   **Syntax:**
    *   `# <your_comment_here>`
    *   `// <your_comment_here>`
*   **Example:**
    ```naturalscript
    # This is a single-line comment
    set data to 100 // This also works as a comment
    ```

## Extending the Language with Custom Syntax

One of AetherByte's most powerful features is the ability to define your own NaturalScript commands. This is done by creating JSON files in the `Aetherlang` directory.

### How it Works

The `core/compiler.py` dynamically loads all `.json` files from the `Aetherlang` directory when the application starts. Each JSON file should contain a list of rule objects, where each object defines a new NaturalScript command and its corresponding 8-bit binary instruction.

### Example JSON Structure for a Custom Command

Let's say you want to add a command `increment <variable_name>`.

1.  **Create a file:** `Aetherlang/my_custom_commands.json`
2.  **Add the following content:**

    ```json
    [
        {
            "name": "INCREMENT_VAR",
            "regex": "increment (?P<var_name>[a-zA-Z_][a-zA-Z0-9_]*)",
            "opcode": "00100100",  // A new opcode for increment (example)
            "args": [
                {"group": "var_name", "type": "string"}
            ]
        }
    ]
    ```

3.  **Restart the AetherByte application.** The compiler will load your new rule.
4.  **Use it in NaturalScript:**
    ```naturalscript
    set counter to 0
    increment counter # This would internally translate to 'add 1 to counter' if VM supports it
    print counter
    ```

    *   **`name`**: A unique identifier for your rule.
    *   **`regex`**: A Python-compatible regular expression.
        *   `(?P<var_name>...)`: This is a named capture group. The name (`var_name`) is used in the `args` section to link the captured text to an argument.
        *   `[a-zA-Z_][a-zA-Z0-9_]*`: A common regex pattern for variable names.
    *   **`opcode`**: The 8-bit binary instruction that your custom command will translate into. You'll need to ensure your `core/vm.py` understands and implements this opcode.
    *   **`args`**: A list of objects, each defining an argument extracted from the `regex`.
        *   `"group"`: The name of the capture group from your `regex`.
        *   `"type"`: The data type of the argument (`"string"` or `"int"`). This tells the compiler how to convert the captured text into binary for the VM.

By following this pattern, you can continuously expand NaturalScript to suit a wide range of programming tasks and create highly specialized domain-specific languages within AetherByte.

written by Neorwc