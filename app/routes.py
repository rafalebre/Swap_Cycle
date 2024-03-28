from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .models import db, User, Product, ProductCategory
from sqlalchemy.exc import IntegrityError

# Criação do Blueprint
products_blueprint = Blueprint('products', __name__)

@products_blueprint.route('/products', methods=['POST'])
@jwt_required()
def create_product():
    user_email = get_jwt_identity()
    data = request.get_json()

    # Validação dos campos obrigatórios
    required_fields = ['name', 'description', 'category_id', 'condition', 'estimated_value', 'location']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing data for one or more fields"}), 400

    # Encontrar o usuário baseado no e-mail
    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Verificar se a categoria existe
    category = ProductCategory.query.filter_by(id=data['category_id']).first()
    if not category:
        return jsonify({"error": "Category not found"}), 404

    try:
        # Criação do produto
        product = Product(
            user_id=user.id,
            name=data['name'],
            description=data['description'],
            category_id=data['category_id'],
            condition=data['condition'],
            estimated_value=data['estimated_value'],
            location=data['location'],
            # Opcional: subcategory_id=data.get('subcategory_id'),
            # Opcional: images=data.get('images'),
        )
        db.session.add(product)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Failed to create product. Please check your data."}), 500

    return jsonify({"message": "Product created successfully", "product_id": product.id}), 201
