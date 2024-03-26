from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from . import db
from .models import User

auth_blueprint = Blueprint('auth', __name__)

@auth_blueprint.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')

    if not email or not username or not password:
        return jsonify({"error": "Incomplete data"}), 400

    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({"error": "Email already registered"}), 400

    new_user = User(
        email=email,
        username=username,
        password_hash=generate_password_hash(password, method='pbkdf2:sha256')
    )
    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=email)

    return jsonify({"message": "User created successfully", "access_token": access_token}), 201

@auth_blueprint.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are mandatory"}), 400

    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password_hash, password):
        access_token = create_access_token(identity=email)
        return jsonify(access_token=access_token), 200

    return jsonify({"error": "Invalid credentials"}), 401

from datetime import datetime

@auth_blueprint.route('/update', methods=['PUT'])
@jwt_required()
def update_user():
    data = request.get_json()
    email = data.get('email')

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "User not found"}), 404

    name = data.get('name')
    surname = data.get('surname')
    birth_date_str = data.get('birth_date')
    profile_picture = data.get('profile_picture')
    address = data.get('address')

    if name:
        user.name = name
    if surname:
        user.surname = surname
    if birth_date_str:
        # Converte a string de data para um objeto datetime
        birth_date = datetime.strptime(birth_date_str, "%Y-%m-%d")
        user.birth_date = birth_date
    if profile_picture:
        user.profile_picture = profile_picture
    if address:
        user.address = address

    db.session.commit()

    return jsonify({"message": "User information updated successfully"}), 200


