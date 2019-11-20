from flask import make_response, abort
import configparser
import os
from config import db
from models import Forward, ForwardSchema
import time


def read():
    forwards = Forward.query.all()
    forwardschema = ForwardSchema(many=True)
    data = {'forwards': forwardschema.dump(forwards)}
    return data


def readone(id):
    fwd = Forward.query.filter(Forward.rowid == id).one_or_none()
    if fwd is not None:
        fwdschema = ForwardSchema()
        data = fwdschema.dump(fwd)
        return data
    else:
        abort(404, "Forward {id} does not exist.".format(id=id))


def post(forward):
    bron = forward.get("bron", None)
    doel = forward.get("doel", None)

    archiveforwards = Forward.query.filter(Forward.bron == bron).filter(Forward.provision == 'absent').filter(Forward.archive == 'n').all()
    for archiveforward in archiveforwards:
        archiveforward.archive = 'y'
        db.session.merge(archiveforward)
        db.session.commit()

    exists = Forward.query.filter(Forward.bron == bron).filter(Forward.provision == 'present').one_or_none()
    if exists is None:
        loop = Forward.query.filter(Forward.bron == doel).filter(Forward.doel == bron).filter(Forward.provision == 'present').one_or_none()
        if loop is None:
            fwdschema = ForwardSchema()
            insert = fwdschema.load(forward, session=db.session)
            db.session.add(insert)
            db.session.commit()
            return fwdschema.dump(insert), 201
        else:
            abort(409, "Combinatie {bron} --> {doel} is niet mogelijk.".format(bron=bron, doel=doel))
    else:
        abort(409, "Het bronadres {bron} wordt al doorgestuurd.".format(bron=bron, doel=doel))


def update(id, forward):
    rowid = id
    bron = forward.get('bron', None)
    doel = forward.get('doel', None)

    exists = Forward.query.filter(Forward.rowid == rowid).one_or_none()
    if exists is None:
        abort(404, "Forward {id} does not exist.".format(id=id))
    else:
        loop = Forward.query.filter(Forward.bron == doel).filter(Forward.doel == bron).one_or_none()
        if loop is None:
            fwdschema = ForwardSchema()
            update = fwdschema.load(forward, session=db.session)
            update.rowid = exists.rowid
            db.session.merge(update)
            db.session.commit()
            data = fwdschema.dump(exists)
            return data, 200
        else:
            abort(409, "Combinatie {bron} --> {doel} is niet mogelijk.".format(bron=bron, doel=doel))


def delete(id):
    active = Forward.query.filter(Forward.rowid == id).filter(Forward.provision == 'present').one_or_none()
    deactivated = Forward.query.filter(Forward.rowid == id).filter(Forward.archive == 'n').filter(Forward.provision == 'absent').one_or_none()
    archived = Forward.query.filter(Forward.rowid == id).filter(Forward.provision == 'absent').filter(Forward.archive == 'y').one_or_none()
    if active is not None:
        Forward.query.filter(Forward.rowid == id).filter(Forward.provision == 'present').update({'provision': 'absent'})
        db.session.commit()
        return make_response("Forward {id} is archived.".format(id=id), 200)
    elif deactivated is not None:
        Forward.query.filter(Forward.rowid == id).filter(Forward.provision == 'absent').update({'provision': 'present'})
        db.session.commit()
        return make_response("Forward {id} is reactivated.".format(id=id), 200)
    elif archived is not None:
        db.session.delete(archived)
        db.session.commit()
        return make_response("Forward {id} is deleted.".format(id=id), 200)
    else:
        abort(404, "Forward {id} does not exist.".format(id=id))


def rewind(timestamp):
    forwards = Forward.query.filter(Forward.timestamp > timestamp).all()
    deleted = []
    for forward in forwards:
        forward.provision = 'absent'
        db.session.merge(forward)
        db.session.commit()
        deleted.append(forward.bron)
    return make_response("Archived: {deleted}".format(deleted=str(deleted)), 200)


basedir = os.path.abspath(os.path.dirname(__file__))
config = configparser.ConfigParser()
config.read(os.path.join(basedir, 'config.ini'))
