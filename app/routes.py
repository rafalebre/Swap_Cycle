from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .models import db, User, Product, ProductCategory, ProductSubcategory, Service, ServiceCategory, Trade, Wishlist, Favorite
from sqlalchemy.exc import IntegrityError
from flask_uploads import UploadSet, IMAGES, configure_uploads  

# Criação do Blueprint
products_blueprint = Blueprint('products', __name__)
services_blueprint = Blueprint('services', __name__)
trades_blueprint = Blueprint('trades', __name__)
wishlists_blueprint = Blueprint('wishlists', __name__)
favorites_blueprint = Blueprint('favorites', __name__)

# Configuração do Flask-Uploads
photos = UploadSet('photos', IMAGES)

# Rota para criar produto
@products_blueprint.route('/products', methods=['POST'])
@jwt_required()
def create_product():
    user_email = get_jwt_identity()

    # Verificar se os dados são multipart/form-data
    if 'name' not in request.form:
        return jsonify({"error": "Missing form data"}), 400

    # Dados do formulário
    name = request.form['name']
    description = request.form.get('description')
    category_id = request.form['category_id']
    subcategory_id = request.form.get('subcategory_id')
    condition = request.form['condition']
    estimated_value = request.form.get('estimated_value')
    location = request.form.get('location')

    # Validação dos campos obrigatórios
    required_fields = [name, category_id, condition]
    if not all(required_fields):
        return jsonify({"error": "Missing data for one or more fields"}), 400

    # Encontrar o usuário baseado no e-mail
    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Verificar se a categoria existe
    category = ProductCategory.query.filter_by(id=category_id).first()
    if not category:
        return jsonify({"error": "Category not found"}), 404

    # Upload da imagem
    image_url = None
    if 'images' in request.files:
        filename = photos.save(request.files['images'])
        image_url = photos.url(filename)

    try:
        # Criação do produto
        product = Product(
            user_id=user.id,
            name=name,
            description=description,
            category_id=category_id,
            subcategory_id=subcategory_id,
            condition=condition,
            estimated_value=estimated_value,
            location=location,
            images=image_url,
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

@products_blueprint.route('/product-categories', methods=['GET'])
def get_product_categories():
    try:
        categories = ProductCategory.query.all()
        categories_data = [{'id': cat.id, 'name': cat.name} for cat in categories]
        return jsonify(categories_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@products_blueprint.route('/product-subcategories/<int:category_id>', methods=['GET'])
def get_product_subcategories(category_id):
    try:
        subcategories = ProductSubcategory.query.filter_by(category_id=category_id).all()
        subcategories_data = [{'id': sub.id, 'name': sub.name} for sub in subcategories]
        return jsonify(subcategories_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


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
    print(f"Email from JWT: {email}")  # Imprime o email obtido do JWT para depuração

    user = User.query.filter_by(email=email).first()
    if user:
        print(f"User ID: {user.id}")  # Imprime o ID do usuário encontrado
    else:
        print("User not found")
        return jsonify({'error': 'User not found'}), 404

    trade = Trade.query.get(trade_id)
    if trade:
        print(f"Trade proposer_user_id: {trade.proposer_user_id}")  # Imprime o proposer_user_id da trade
    else:
        print("Trade not found")
        return jsonify({'error': 'Trade not found'}), 404

    # Comparando o proposer_user_id da trade com o ID do usuário para autorização
    if trade.proposer_user_id != user.id:
        print("Unauthorized to cancel this trade")  # Imprime uma mensagem para depuração quando a autorização falha
        return jsonify({'error': 'Unauthorized to cancel this trade'}), 403

    if trade.status != 'pending':
        print(f"Trade status: {trade.status}")  # Imprime o status da trade para depuração
        return jsonify({'error': 'Trade cannot be cancelled as it is no longer pending'}), 400

    try:
        db.session.delete(trade)
        db.session.commit()
        print("Trade cancelled successfully")  # Confirmação de sucesso
        return jsonify({'message': 'Trade cancelled successfully'}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Failed to cancel trade: {e}")  # Imprime o erro se o cancelamento falhar
        return jsonify({'error': 'Failed to cancel trade'}), 500


@wishlists_blueprint.route('/wishlists', methods=['POST'])
@jwt_required()
def add_wishlist_item():
    user_id = get_jwt_identity()
    user = User.query.filter_by(email=user_id).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    description = data.get('description')
    priority = data.get('priority', 1)  # Default é 1 se não especificado
    
    if not description:
        return jsonify({'error': 'Description is required'}), 400

    new_wishlist_item = Wishlist(user_id=user.id, description=description, priority=priority)
    db.session.add(new_wishlist_item)
    db.session.commit()
    
    return jsonify({'message': 'Wishlist item added successfully', 'item_id': new_wishlist_item.id}), 201


@wishlists_blueprint.route('/wishlists/<int:item_id>', methods=['PUT'])
@jwt_required()
def update_wishlist_item(item_id):
    user_id = get_jwt_identity()
    user = User.query.filter_by(email=user_id).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    wishlist_item = Wishlist.query.filter_by(id=item_id, user_id=user.id).first()
    if not wishlist_item:
        return jsonify({'error': 'Wishlist item not found'}), 404
    
    data = request.get_json()
    wishlist_item.description = data.get('description', wishlist_item.description)
    wishlist_item.priority = data.get('priority', wishlist_item.priority)
    
    db.session.commit()
    return jsonify({'message': 'Wishlist item updated successfully'}), 200


@wishlists_blueprint.route('/wishlists/<int:item_id>', methods=['DELETE'])
@jwt_required()
def delete_wishlist_item(item_id):
    user_id = get_jwt_identity()
    user = User.query.filter_by(email=user_id).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    wishlist_item = Wishlist.query.filter_by(id=item_id, user_id=user.id).first()
    if not wishlist_item:
        return jsonify({'error': 'Wishlist item not found'}), 404
    
    db.session.delete(wishlist_item)
    db.session.commit()
    return jsonify({'message': 'Wishlist item deleted successfully'}), 200


@favorites_blueprint.route('/favorites', methods=['POST'])
@jwt_required()
def add_to_favorites():
    user_id = get_jwt_identity()
    user = User.query.filter_by(email=user_id).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()
    product_id = data.get('product_id')
    service_id = data.get('service_id')

    if not product_id and not service_id:
        return jsonify({'error': 'Either product_id or service_id is required'}), 400

    new_favorite = Favorite(user_id=user.id, product_id=product_id, service_id=service_id)
    db.session.add(new_favorite)
    db.session.commit()

    return jsonify({'message': 'Added to favorites successfully', 'favorite_id': new_favorite.id}), 201


@favorites_blueprint.route('/favorites/<int:favorite_id>', methods=['DELETE'])
@jwt_required()
def delete_from_favorites(favorite_id):
    user_id = get_jwt_identity()
    user = User.query.filter_by(email=user_id).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    favorite = Favorite.query.filter_by(id=favorite_id, user_id=user.id).first()
    if not favorite:
        return jsonify({'error': 'Favorite item not found'}), 404

    db.session.delete(favorite)
    db.session.commit()
    return jsonify({'message': 'Favorite item deleted successfully'}), 200