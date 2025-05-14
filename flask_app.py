# Flask Backend Server

from flask import Flask, request, jsonify
import os
import json
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# Data directory for storing contacts
DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
CONTACTS_FILE = os.path.join(DATA_DIR, 'contacts.json')

# Ensure data directory exists
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)


# Load existing contacts from JSON file
def load_contacts():
    try:
        if os.path.exists(CONTACTS_FILE):
            with open(CONTACTS_FILE, 'r') as file:
                return json.load(file)
        return []
    except Exception as e:
        app.logger.error(f"Error loading contacts: {e}")
        return []


# Save contacts to JSON file
def save_contacts(contacts):
    try:
        with open(CONTACTS_FILE, 'w') as file:
            json.dump(contacts, file, indent=2)
        return True
    except Exception as e:
        app.logger.error(f"Error saving contacts: {e}")
        return False


# Contact form submission route
@app.route('/api/contact', methods=['POST'])
def handle_contact():
    try:
        # Get form data
        name = request.form.get('name')
        email = request.form.get('email')
        subject = request.form.get('subject')
        message = request.form.get('message')
        
        # Validate required fields
        if not all([name, email, subject, message]):
            return jsonify({
                'success': False,
                'message': 'All fields are required'
            }), 400
            
        # Create contact entry
        contact = {
            'id': datetime.now().strftime('%Y%m%d%H%M%S'),
            'name': name,
            'email': email,
            'subject': subject,
            'message': message,
            'timestamp': datetime.now().isoformat()
        }
        
        # Load existing contacts
        contacts = load_contacts()
        
        # Add new contact
        contacts.append(contact)
        
        # Save updated contacts
        if save_contacts(contacts):
            return jsonify({
                'success': True,
                'message': 'Contact form submission successful',
                'contact': contact
            }), 201
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to save contact information'
            }), 500
            
    except Exception as e:
        app.logger.error(f"Error processing contact form: {e}")
        return jsonify({
            'success': False,
            'message': 'An error occurred while processing your request'
        }), 500


# Get all contacts (for demonstration)
@app.route('/api/contacts', methods=['GET'])
def get_contacts():
    contacts = load_contacts()
    return jsonify(contacts)


# Health check route
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'ok',
        'message': 'Flask API is running'
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)