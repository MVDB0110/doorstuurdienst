import os
from config import db
from models import Forward
import time

# Delete database file if it exists currently
if os.path.exists('database.db'):
    os.remove('database.db')

FORWARDS = [{'rowid': '0', 'bron': 'example.com', 'doel': 'example.pt', 'methode': '301', 'timestamp': time.time()}]

# Create the database
db.create_all()

for fwd in FORWARDS:
    db.session.add(Forward(rowid=fwd['rowid'], bron=fwd['bron'], doel=fwd['doel'], methode=fwd['methode'], timestamp=fwd['timestamp']))

db.session.commit()
