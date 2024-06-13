from flask_jwt_extended import JWTManager
from website.models import User

jwt = JWTManager()

@jwt.user_identity_loader
def user_identity_lookup(user):
    return user.user_id

@jwt.user_lookup_loader
def user_lookup_callback(_jwt_headers, jwt_data):
    print("ni chl rha")
    identity = jwt_data["sub"]
    # return User.query.filter_by(user_name=identity).one_or_none()
    return User.query.filter_by(user_id=identity).one_or_none()
