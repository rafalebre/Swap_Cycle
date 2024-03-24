import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///swap_cycle.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

# Configurações para JWT
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')