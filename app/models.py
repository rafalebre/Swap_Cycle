from . import db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(100), unique=True, nullable=False)

    password_hash = db.Column(db.String(128))
    name = db.Column(db.String(100), nullable=False)
    surname = db.Column(db.String(100), nullable=False)
    birth_date = db.Column(db.DateTime, nullable=True)
    profile_picture = db.Column(db.String(255), nullable=True)
    registered_on = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)


class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    category = db.Column(db.String(50), nullable=False)
    subcategory = db.Column(db.String(50), nullable=True)
    condition = db.Column(db.String(50), nullable=False)
    estimated_value = db.Column(db.Float, nullable=True)
    images = db.Column(db.Text, nullable=True)  # Can store multiple image URLs separated by some delimiter
    location = db.Column(db.String(255), nullable=True)
    created_on = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)


class Service(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    category = db.Column(db.String(50), nullable=False)
    subcategory = db.Column(db.String(50), nullable=True)
    online = db.Column(db.Boolean, default=False, nullable=False)
    estimated_value = db.Column(db.Float, nullable=True)
    images = db.Column(db.Text, nullable=True)
    location = db.Column(db.String(255), nullable=True)  # Only relevant for non-online services
    created_on = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
