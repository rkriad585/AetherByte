# Basic NaturalScript Operations 🚀

This document provides fundamental examples to quickly grasp the core functionality of AetherByte's NaturalScript language. These snippets demonstrate basic variable manipulation, arithmetic, output, and control flow.

## 1. "Hello World" Example 👋

The most basic operation is printing text to the console.

```naturalscript
print "Hello, AetherByte!"
```

**Expected Output:**
```
Hello, AetherByte!
```

## 2. Variables and Basic Arithmetic ➕➖

Demonstrates how to declare variables, assign values, and perform simple arithmetic operations.

```naturalscript
set score to 10
add 5 to score
mul 2 to score
print "Final Score:"
print score
```

**Explanation:**
*   `set score to 10`: Initializes a variable named `score` with the integer value `10`.
*   `add 5 to score`: Adds `5` to the current value of `score` (`10 + 5 = 15`).
*   `mul 2 to score`: Multiplies the current value of `score` by `2` (`15 * 2 = 30`).
*   `print "Final Score:"`: Outputs the literal string.
*   `print score`: Outputs the current value of the `score` variable.

**Expected Output:**
```
Final Score:
30
```

## 3. Loops and System Interactions 🔁🔔

Illustrates how to create simple loops and interact with the system, such as pausing execution or triggering an alert.

```naturalscript
loop 3
    print "Processing..."
    wait 1 seconds
alert system
print "Task Complete."
```

**Explanation:**
*   `loop 3`: Executes the subsequent indented lines `3` times.
*   `print "Processing..."`: Outputs the string within each loop iteration.
*   `wait 1 seconds`: Pauses the VM execution for `1` second.
*   `alert system`: Triggers a system-level alert, typically represented as `>> [SYSTEM BELL]` in the terminal.
*   `print "Task Complete."`: Outputs a final message after the loop.

**Expected Output:**
```
Processing...
Processing...
Processing...
>> [SYSTEM BELL]
Task Complete.
```

## Caveats ⚠️

*   NaturalScript commands are generally case-insensitive (e.g., `SET` and `set` are equivalent).
*   Comments start with `#` or `//` and are ignored by the compiler.
*   Indentation is used to define blocks for control flow statements like `loop` and `if`.

written by Neorwc