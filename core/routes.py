import uuid

from flask import Blueprint, render_template, request, jsonify
from core.compiler import NaturalCompiler
from core.vm import BinaryVM
from core.database import DatabaseManager

core_bp = Blueprint('core', __name__)

compiler = NaturalCompiler()
vm = BinaryVM()
db = DatabaseManager() # Initialize DB Class

@core_bp.route('/')
def index():
    return render_template('index.html')

# --- COMPILER ROUTES ---
@core_bp.route('/convert', methods=['POST'])
def convert():
    data = request.get_json()
    try:
        binary = compiler.compile(data.get('code', ''))
        return jsonify({'binary': binary, 'status': 'success'})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@core_bp.route('/run', methods=['POST'])
def run_code():
    data = request.get_json()
    try:
        result = vm.run(data.get('binary', ''))
        return jsonify({'output': result, 'status': 'success'})
    except Exception as e:
        return jsonify({'output': f"Error: {str(e)}"}), 500

# --- DATABASE ROUTES ---
@core_bp.route('/api/save', methods=['POST'])
def save_script():
    data = request.get_json()
    title = data.get('title')
    code = data.get('code')
    
    if not title or not code:
        return jsonify({'status': 'error', 'message': 'Missing data'}), 400
    
    if db.save_script(title, code):
        return jsonify({'status': 'success'})
    return jsonify({'status': 'error'}), 500

@core_bp.route('/api/list', methods=['GET'])
def list_scripts():
    scripts = db.get_all_scripts()
    return jsonify({'scripts': scripts})

@core_bp.route('/api/load/<int:script_id>', methods=['GET'])
def load_script(script_id):
    code = db.get_script_by_id(script_id)
    if code:
        return jsonify({'status': 'success', 'code': code})
    return jsonify({'status': 'error', 'message': 'Not found'}), 404

@core_bp.route('/api/delete/<int:script_id>', methods=['DELETE'])
def delete_script(script_id):
    if db.delete_script(script_id):
        return jsonify({'status': 'success'})
    return jsonify({'status': 'error'}), 500

@core_bp.route('/share', methods=['POST'])
def create_share_link():
    """
    Creates a unique link for the current code with specific permissions.
    """
    data = request.get_json()
    code = data.get('code')
    permission = data.get('permission', 'read') # Default to read-only
    
    # Generate a unique 8-character ID
    share_id = str(uuid.uuid4())[:8]
    
    # Save to Database (We reuse the existing table but mark it as shared)
    # Note: In a real app, you'd have a separate 'shares' table.
    # Here we simulate it by saving with a special title prefix.
    try:
        title = f"SHARED_{permission}_{share_id}"
        db.save_script(title, code)
        
        # Return the full link
        share_link = f"{request.host_url}shared/{share_id}"
        return jsonify({'status': 'success', 'link': share_link})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@core_bp.route('/shared/<share_id>')
def view_shared_project(share_id):
    """
    Loads a shared project.
    We look for a script with the title containing the ID.
    """
    # 1. Find the script
    scripts = db.get_all_scripts()
    target_script = None
    permission = 'read'
    
    for s in scripts:
        if share_id in s['title'] and s['title'].startswith("SHARED_"):
            target_script = s
            # Extract permission from title: SHARED_execute_12345678
            parts = s['title'].split('_')
            if len(parts) >= 2:
                permission = parts[1]
            break
    
    if not target_script:
        return "Project not found", 404
        
    # 2. Get the code content
    code = db.get_script_by_id(target_script['id'])
    
    # 3. Render the main page but with the code pre-loaded and permissions set
    return render_template('index.html', 
                           initial_code=code, 
                           share_mode=True, 
                           permission=permission)
                          

@core_bp.route('/settings')
def settings():
    return render_template('settings.html')