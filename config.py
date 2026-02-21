import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'aether-byte-secret-key-585'
    DEBUG = True
    # Add other config variables here (e.g., Database URI if needed later)
    DB_NAME = "aether.db"
    
    # NEW: Define where our language files live
    # 'os.getcwd()' gets the current folder we are running in
    LANG_DIR = os.path.join(os.getcwd(), 'Aetherlang')