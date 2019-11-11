def verify(username, password, required_scopes=None):
    if username == 'admin' and password == 'admin':
        return {'sub': 'admin'}
    else:
        return None
