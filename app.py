from flask import render_template, send_file
import configparser
import config
import os

app = config.connex_app
app.add_api('swagger.yml')
basedir = os.path.abspath(os.path.dirname(__file__))


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/edit')
def edit():
    return render_template('edit.html')


@app.route('/conf.pp')
def var():
    return send_file(os.path.join(basedir, 'templates/conf.pp'))


if __name__ == '__main__':
    config = configparser.ConfigParser()
    config.read(os.path.join(basedir, 'config.ini'))
    app.run(ssl_context=(os.path.join(basedir, 'ssl/cert.pem'), os.path.join(basedir, 'ssl/key.pem')), host=str(config['DEFAULT']['Bind']), port=str(config['DEFAULT']['Port']))
