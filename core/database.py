import sqlite3
from config import Config

class DatabaseManager:
    def __init__(self):
        self.db_name = Config.DB_NAME

    def get_connection(self):
        conn = sqlite3.connect(self.db_name)
        conn.row_factory = sqlite3.Row  # Allows accessing columns by name
        return conn

    def init_db(self):
        """Creates the table if it doesn't exist."""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS scripts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                code TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.commit()
        conn.close()

    def save_script(self, title, code):
        """Saves a new script."""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            cursor.execute('INSERT INTO scripts (title, code) VALUES (?, ?)', (title, code))
            conn.commit()
            conn.close()
            return True
        except Exception as e:
            print(f"DB Error: {e}")
            return False

    def get_all_scripts(self):
        """Retrieves all scripts ordered by newest first."""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT id, title, created_at FROM scripts ORDER BY id DESC')
        scripts = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return scripts

    def get_script_by_id(self, script_id):
        """Retrieves a specific script code."""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT code FROM scripts WHERE id = ?', (script_id,))
        row = cursor.fetchone()
        conn.close()
        return row['code'] if row else None

    def delete_script(self, script_id):
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM scripts WHERE id = ?', (script_id,))
        conn.commit()
        conn.close()
        return True
