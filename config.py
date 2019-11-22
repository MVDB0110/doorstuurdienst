import os
import connexion
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
import configparser

config = configparser.ConfigParser()
if os.path.isfile('config.ini') is False:
    config['DEFAULT'] = {'Bind': '0.0.0.0',
                         'Port': '5000'}
    with open('config.ini', 'w') as configfile:
        config.write(configfile)
config.read('config.ini')
basedir = os.path.abspath(os.path.dirname(__file__))

connex_app = connexion.App(__name__, specification_dir=basedir)
app = connex_app.app

app.config['SQLALCHEMY_ECHO'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://api:password@10.0.0.254:3306/forward'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
ma = Marshmallow(app)
