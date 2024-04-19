from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from . import db
from .models import User
from sqlalchemy.exc import IntegrityError

auth_blueprint = Blueprint('auth', __name__)

@auth_blueprint.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')

    if not email or not username or not password:
        return jsonify({"error": "Incomplete data"}), 400

    # Verifica se o e-mail já está registrado
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 400
    
    # Verifica se o username já está registrado
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 400

    try:
        new_user = User(
            email=email,
            username=username,
            password_hash=generate_password_hash(password, method='pbkdf2:sha256')
        )
        db.session.add(new_user)
        db.session.commit()
        access_token = create_access_token(identity=email)
        return jsonify({"message": "User created successfully", "access_token": access_token}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Database error, could not create user"}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

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


@auth_blueprint.route('/user', methods=['GET'])
@jwt_required()
def get_user():
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    
    if user is None:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "email": user.email,
        "username": user.username,
        "name": user.name,
        "surname": user.surname,
        "birth_date": user.birth_date.strftime("%Y-%m-%d") if user.birth_date else None,
        "profile_picture": user.profile_picture,
        "address": user.address
    }), 200
