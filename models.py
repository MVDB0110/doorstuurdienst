from config import db, ma


class Forward(db.Model):
    __tablename__ = 'forward'
    rowid = db.Column(db.Integer, primary_key=True)
    bron = db.Column(db.String(32))
    doel = db.Column(db.String(32))
    methode = db.Column(db.String(32))
    timestamp = db.Column(db.Float)


class ForwardSchema(ma.ModelSchema):
    class Meta:
        model = Forward
        sqla_session = db.session
