from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from .config import Config
from flask_jwt_extended import JWTManager


db = SQLAlchemy()
migrate = Migrate()
def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    migrate.init_app(app, db)
    jwt = JWTManager(app)

    with app.app_context():
        db.create_all()

    # Inicialização do Flask-Admin
    admin = Admin(app, name='swap_cycle', template_mode='bootstrap3')

    # Importando os modelos aqui para evitar referências circulares
    from .models import User, Product, Service, Trade, Wishlist, Favorite, ProductCategory, ProductSubcategory, ServiceCategory, ServiceSubcategory

    # Adicionando visualizações do modelo ao Flask-Admin
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Product, db.session))
    admin.add_view(ModelView(ProductCategory, db.session))
    admin.add_view(ModelView(ProductSubcategory, db.session))
    admin.add_view(ModelView(Service, db.session))
    admin.add_view(ModelView(ServiceCategory, db.session))
    admin.add_view(ModelView(ServiceSubcategory, db.session))
    admin.add_view(ModelView(Trade, db.session))
    admin.add_view(ModelView(Wishlist, db.session))
    admin.add_view(ModelView(Favorite, db.session))

    from .auth import auth_blueprint
    app.register_blueprint(auth_blueprint, url_prefix='/auth')

    from .routes import products_blueprint
    app.register_blueprint(products_blueprint)


    @app.route('/')
    def hello():
        return "Hello, Flask!"
    
    return app
