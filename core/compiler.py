import re
import json
import os
import glob
from config import Config

class NaturalCompiler:
    """
    A Dynamic Compiler that reads syntax rules from JSON files 
    in the 'Aetherlang' folder.
    """

    def __init__(self):
        # 1. When the compiler starts, load all language rules immediately
        self.rules = self._load_language_definitions()

    def _load_language_definitions(self):
        """
        Scans the 'Aetherlang' folder for any .json files and loads them.
        """
        loaded_rules = []
        
        # Ensure the directory exists
        if not os.path.exists(Config.LANG_DIR):
            print(f"WARNING: Language directory {Config.LANG_DIR} not found.")
            return []

        # Find all .json files (e.g., standard.json, math.json, my_custom.json)
        json_files = glob.glob(os.path.join(Config.LANG_DIR, "*.json"))

        for file_path in json_files:
            try:
                with open(file_path, 'r') as f:
                    data = json.load(f)
                    # Add these rules to our master list
                    # We expect data to be a list of objects
                    if isinstance(data, list):
                        loaded_rules.extend(data)
                        print(f"Loaded language file: {os.path.basename(file_path)}")
            except Exception as e:
                print(f"Error loading {file_path}: {e}")

        return loaded_rules

    # --- HELPER FUNCTIONS FOR BINARY CONVERSION ---
    def str_to_bin(self, s):
        """Converts string 'Hi' -> '01001000 01101001'"""
        return ' '.join(format(ord(c), '08b') for c in str(s))

    def int_to_bin(self, n):
        """Converts integer 5 -> '00000101'"""
        try:
            return format(int(n), '08b')
        except:
            return "00000000"

    # --- MAIN COMPILE FUNCTION ---
    def compile(self, text):
        lines = text.strip().split('\n')
        binary_code = []
        
        for line_num, line in enumerate(lines):
            line = line.strip()
            
            # Skip comments (#) or empty lines
            if not line or line.startswith('#') or line.startswith('//'): 
                continue 

            matched = False

            # LOOP THROUGH ALL LOADED JSON RULES
            for rule in self.rules:
                # Check if the line matches the rule's Regex
                # re.IGNORECASE makes it so 'Set' and 'set' both work
                match = re.fullmatch(rule['regex'], line, re.IGNORECASE)
                
                if match:
                    matched = True
                    
                    # 1. Start with the OpCode (Instruction)
                    instruction_parts = [rule['opcode']]
                    
                    # 2. Process Arguments (if any)
                    # The JSON defines what args to pick from the Regex match
                    for arg_def in rule.get('args', []):
                        group_name = arg_def['group']
                        arg_type = arg_def['type']
                        
                        # Get the actual value from the text (e.g., "10" or "score")
                        raw_value = match.group(group_name)
                        
                        if arg_type == 'string':
                            # Strings need Length + Binary Data
                            # Example: variable names, print text
                            b_str = self.str_to_bin(raw_value)
                            
                            # Special case: If it is PRINT_STRING, we don't need length prefix
                            # But for Variables, we usually do. Let's stick to VM logic.
                            # Standard VM Logic for VARS: Len + Name
                            # Standard VM Logic for PRINT STR: Just Data
                            
                            if rule['name'] == 'PRINT_STRING':
                                instruction_parts.append(b_str)
                            else:
                                # For Variables (Store, Get), we need the length prefix
                                instruction_parts.append(self.int_to_bin(len(raw_value)))
                                instruction_parts.append(b_str)

                        elif arg_type == 'int':
                            # Integers are just 8-bit binary
                            instruction_parts.append(self.int_to_bin(raw_value))

                    # 3. Join parts and add to result
                    binary_code.append(" ".join(instruction_parts))
                    break # Stop checking other rules for this line

            if not matched:
                # If no JSON rule matched, create a NO-OP (Error placeholder)
                binary_code.append("00000000") 

        return "\n".join(binary_code)