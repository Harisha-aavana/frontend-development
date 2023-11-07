from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from repos.config import Config


db = SQLAlchemy()
bcrypt = Bcrypt()
login_manager = LoginManager()
login_manager.login_view = 'main.login'
login_manager.login_message_category = 'info'


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    bcrypt.init_app(app)
    login_manager.init_app(app)

    from repos.users.routes import users
    from repos.main.routes import main
    from repos.aavana.routes import aavana
    from repos.api.routes import api

    app.register_blueprint(users)
    app.register_blueprint(main)
    app.register_blueprint(aavana)
    app.register_blueprint(api)
    return app
