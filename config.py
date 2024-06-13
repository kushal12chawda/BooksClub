class Config(object):
    DEBUG = False
    TESTING = False
    CACHE_TYPE = "RedisCache"
    CACHE_DEFAULT_TIMEOUT = 300

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///database.db'
    # SECRET_KEY = "ASDFGHJKL"
    # SECURITY_PASSWORD_SALT = "ASDFGHJKL"
    # SQLALCHEMY_TRACK_MODIFICATIONS = False
    # WTF_CSRF_ENABLED = False
    # SECURITY_AUTHENTICATION_HEADER = 'Authentication-Token'
    # JWT_SECRET_KEY = "this is secret key"
    CACHE_REDIS_HOST = "localhost"
    CACHE_REDIS_PORT = 6379
    CACHE_REDIS_DB = 3