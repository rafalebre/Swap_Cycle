from . import db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    name = db.Column(db.String(100), nullable=True)
    surname = db.Column(db.String(100), nullable=True)
    birth_date = db.Column(db.DateTime, nullable=True)
    profile_picture = db.Column(db.String(255), nullable=True)
    address = db.Column(db.String(255), nullable=True)
    registered_on = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    products = db.relationship('Product', backref='user', lazy='dynamic')
    services = db.relationship('Service', backref='user', lazy='dynamic')


class ProductCategory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    products = db.relationship('Product', backref='category', lazy='dynamic')

class ProductSubcategory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('product_category.id'), nullable=False)
    products = db.relationship('Product', backref='subcategory', lazy='dynamic')

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    category_id = db.Column(db.Integer, db.ForeignKey('product_category.id'), nullable=False)
    subcategory_id = db.Column(db.Integer, db.ForeignKey('product_subcategory.id'), nullable=True)
    condition = db.Column(db.String(50), nullable=False)
    estimated_value = db.Column(db.Float, nullable=True)
    images = db.Column(db.Text, nullable=True)
    location = db.Column(db.String(255), nullable=True)
    created_on = db.Column(db.DateTime, default=datetime.utcnow)

class ServiceCategory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    services = db.relationship('Service', backref='category', lazy='dynamic')

class ServiceSubcategory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('service_category.id'), nullable=False)
    services = db.relationship('Service', backref='subcategory', lazy='dynamic')

class Service(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    category_id = db.Column(db.Integer, db.ForeignKey('service_category.id'), nullable=False)
    subcategory_id = db.Column(db.Integer, db.ForeignKey('service_subcategory.id'), nullable=True)
    online = db.Column(db.Boolean, default=False, nullable=False)
    estimated_value = db.Column(db.Float, nullable=True)
    images = db.Column(db.Text, nullable=True)
    location = db.Column(db.String(255), nullable=True)
    created_on = db.Column(db.DateTime, default=datetime.utcnow)


class Trade(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    proposer_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    receiver_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    offered_product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=True)
    requested_product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=True)
    offered_service_id = db.Column(db.Integer, db.ForeignKey('service.id'), nullable=True)
    requested_service_id = db.Column(db.Integer, db.ForeignKey('service.id'), nullable=True)
    status = db.Column(db.String(50), default='pending')
    message = db.Column(db.Text, nullable=True)
    created_on = db.Column(db.DateTime, default=datetime.utcnow)

    proposer = db.relationship('User', foreign_keys=[proposer_user_id], backref='trades_made')
    receiver = db.relationship('User', foreign_keys=[receiver_user_id], backref='trades_received')
    offered_product = db.relationship('Product', foreign_keys=[offered_product_id], backref='trades_offered')
    requested_product = db.relationship('Product', foreign_keys=[requested_product_id], backref='trades_requested')
    offered_service = db.relationship('Service', foreign_keys=[offered_service_id], backref='trades_offered')
    requested_service = db.relationship('Service', foreign_keys=[requested_service_id], backref='trades_requested')

class Wishlist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=True)
    service_id = db.Column(db.Integer, db.ForeignKey('service.id'), nullable=True)
    priority = db.Column(db.Integer, default=1)  # 1 a 5, conforme a sua descrição
    created_on = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref='wishlist')
    product = db.relationship('Product', backref='wishlist_entries')
    service = db.relationship('Service', backref='wishlist_entries')


class Favorite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=True)
    service_id = db.Column(db.Integer, db.ForeignKey('service.id'), nullable=True)
    created_on = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref='favorites')
    product = db.relationship('Product', backref='favorited_by')
    service = db.relationship('Service', backref='favorited_by')
