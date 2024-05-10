import os

class Config:
    base_dir = os.path.abspath(os.path.dirname(__file__))
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(base_dir, '..', 'instance', 'swap_cycle.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False


# Configurações para JWT
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')