from config import db, ma


class Forward(db.Model):
    __tablename__ = 'forward'
    rowid = db.Column(db.Integer, primary_key=True)
    bron = db.Column(db.String(32))
    doel = db.Column(db.String(32))
    methode = db.Column(db.String(32))
    provision = db.Column(db.String(32), default='present')
    archive = db.Column(db.String(32), default='n')
    timestamp = db.Column(db.Integer)


class ForwardSchema(ma.ModelSchema):
    class Meta:
        model = Forward
        sqla_session = db.session
