from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .models import db, User, Product, ProductCategory, Service, ServiceCategory, Trade
from sqlalchemy.exc import IntegrityError

# Criação do Blueprint
products_blueprint = Blueprint('products', __name__)
services_blueprint = Blueprint('services', __name__)
trades_blueprint = Blueprint('trades', __name__)

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

@products_blueprint.route('/products/<int:product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    user_email = get_jwt_identity()
    data = request.get_json()

    # Encontrar o usuário e o produto baseados no e-mail e id do produto
    user = User.query.filter_by(email=user_email).first()
    product = Product.query.filter_by(id=product_id, user_id=user.id).first()

    if not product:
        return jsonify({"error": "Product not found or not owned by user"}), 404

    # Atualizar os campos do produto com os dados fornecidos
    fields_to_update = ['name', 'description', 'category_id', 'condition', 'estimated_value', 'location']
    for field in fields_to_update:
        if field in data:
            setattr(product, field, data[field])

    db.session.commit()
    return jsonify({"message": "Product updated successfully"}), 200

@products_blueprint.route('/products/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()
    product = Product.query.filter_by(id=product_id, user_id=user.id).first()

    if not product:
        return jsonify({"error": "Product not found or not owned by user"}), 404

    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": "Product deleted successfully"}), 200


@services_blueprint.route('/services', methods=['POST'])
@jwt_required()
def create_service():
    user_email = get_jwt_identity()
    data = request.get_json()

    # Verifica se o serviço é online para definir a necessidade do campo location
    if data.get('online', False):
        required_fields = ['name', 'description', 'category_id', 'online', 'estimated_value']
    else:
        required_fields = ['name', 'description', 'category_id', 'location', 'online', 'estimated_value']

    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing data for one or more required fields"}), 400

    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    category = ServiceCategory.query.filter_by(id=data['category_id']).first()
    if not category:
        return jsonify({"error": "Category not found"}), 404

    try:
        service = Service(
            user_id=user.id,
            name=data['name'],
            description=data['description'],
            category_id=data['category_id'],
            online=data.get('online', False),
            location=data.get('location', None),  # Será None se o serviço for online
            estimated_value=data.get('estimated_value', None)
        )
        db.session.add(service)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Failed to create service. Please check your data."}), 500

    return jsonify({"message": "Service created successfully", "service_id": service.id}), 201


@services_blueprint.route('/services/<int:service_id>', methods=['PUT'])
@jwt_required()
def update_service(service_id):
    user_email = get_jwt_identity()
    data = request.get_json()

    # Encontrar o usuário e o serviço baseados no e-mail e id do serviço
    user = User.query.filter_by(email=user_email).first()
    service = Service.query.filter_by(id=service_id, user_id=user.id).first()

    if not service:
        return jsonify({"error": "Service not found or not owned by user"}), 404

    # Atualiza campos, considerando que "location" pode ser nulo para serviços online
    if data.get('online', service.online):
        service.location = None  # Se "online" está setado como True ou mantido, limpa "location"
    else:
        if 'location' in data:
            service.location = data['location']
        else:
            return jsonify({"error": "Missing location for a physical service"}), 400

    fields_to_update = ['name', 'description', 'category_id', 'online', 'estimated_value']
    for field in fields_to_update:
        if field in data:
            setattr(service, field, data[field])

    db.session.commit()
    return jsonify({"message": "Service updated successfully", "service_id": service.id}), 200

@services_blueprint.route('/services/<int:service_id>', methods=['DELETE'])
@jwt_required()
def delete_service(service_id):
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()
    service = Service.query.filter_by(id=service_id, user_id=user.id).first()

    if not service:
        return jsonify({"error": "Service not found or not owned by user"}), 404

    db.session.delete(service)
    db.session.commit()
    return jsonify({"message": "Service deleted successfully"}), 200



@trades_blueprint.route('/trades', methods=['POST'])
@jwt_required()
def create_trade():
    user_email = get_jwt_identity()  # Isso retorna o e-mail do usuário.
    data = request.get_json()

    # Buscando o usuário pelo e-mail para obter o ID numérico do usuário.
    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Usando o ID numérico do usuário para o proposer_user_id.
    new_trade = Trade(
        proposer_user_id=user.id,
        receiver_user_id=data['receiver_user_id'],
        offered_product_id=data.get('offered_product_id'),
        requested_product_id=data.get('requested_product_id'),
        offered_service_id=data.get('offered_service_id'),
        requested_service_id=data.get('requested_service_id'),
        message=data.get('message'),
        status="pending"
    )

    try:
        db.session.add(new_trade)
        db.session.commit()
        return jsonify({'message': 'Trade proposal created successfully', 'trade_id': new_trade.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create trade proposal due to an unexpected error'}), 500
    

@trades_blueprint.route('/trades/<int:trade_id>/accept', methods=['PUT'])
@jwt_required()
def accept_trade(trade_id):
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    
    if user is None:
        return jsonify({'error': 'User not found'}), 404
    
    trade = Trade.query.get(trade_id)
    if trade is None:
        return jsonify({'error': 'Trade not found'}), 404
    
    if trade.receiver_user_id != user.id:
        return jsonify({'error': 'Unauthorized to accept this trade'}), 403
    
    if trade.status != 'pending':
        return jsonify({'error': 'Trade is not in pending status'}), 400
    
    trade.status = 'accepted'
    try:
        db.session.commit()
        return jsonify({'message': 'Trade accepted successfully'}), 200
    except Exception:
        db.session.rollback()
        return jsonify({'error': 'Failed to accept trade'}), 500
    
@trades_blueprint.route('/trades/<int:trade_id>/decline', methods=['PUT'])
@jwt_required()
def decline_trade(trade_id):
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    
    if user is None:
        return jsonify({'error': 'User not found'}), 404
    
    trade = Trade.query.get(trade_id)
    if trade is None:
        return jsonify({'error': 'Trade not found'}), 404
    
    if trade.receiver_user_id != user.id:
        return jsonify({'error': 'Unauthorized to decline this trade'}), 403
    
    if trade.status != 'pending':
        return jsonify({'error': 'Trade is not in pending status'}), 400
    
    trade.status = 'denied'
    try:
        db.session.commit()
        return jsonify({'message': 'Trade declined successfully'}), 200
    except Exception:
        db.session.rollback()
        return jsonify({'error': 'Failed to decline trade'}), 500
    

@trades_blueprint.route('/trades/<int:trade_id>', methods=['DELETE'])
@jwt_required()
def cancel_trade(trade_id):
    email = get_jwt_identity()
    
    trade = Trade.query.get(trade_id)
    if trade is None:
        return jsonify({'error': 'Trade not found'}), 404
    
    # Ajuste: Comparando o e-mail do JWT diretamente com o proposer_user_id armazenado como e-mail.
    if trade.proposer_user_id != email:
        return jsonify({'error': 'Unauthorized to cancel this trade'}), 403
    
    if trade.status != 'pending':
        return jsonify({'error': 'Trade cannot be cancelled as it is no longer pending'}), 400

    try:
        db.session.delete(trade)
        db.session.commit()
        return jsonify({'message': 'Trade cancelled successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to cancel trade'}), 500
