from flask import Flask
from website.models import db, User
from config import DevelopmentConfig
from website.api import api
from os import path
from flask_jwt_extended import JWTManager
from website.auth import jwt
import os
from website.worker import celery_init_app
from celery import Celery
import flask_excel as excel
from celery.schedules import crontab
from website.tasks import dailyReminder, generate_monthly_report, revoke_access_for_overdue_books, dailyReminder1
from website.instances import cache
from flask_cors import CORS
from datetime import timedelta

def create_database(app):
    if not path.exists('website/database.db'):
        print("hiii")
        with app.app_context():
            db.create_all()
            print("created database") 

def create_app():
    app = Flask(__name__,template_folder="website/templates",static_folder="website/static")
    app.config.from_object(DevelopmentConfig)
    uploads_dir = os.path.join(app.instance_path, 'uploads')
    os.makedirs(uploads_dir, exist_ok=True)
    app.config['UPLOAD_FOLDER'] = uploads_dir
    app.config["JWT_SECRET_KEY"] = "kushal is secret key"
    app.config["JWT_TOKEN_LOCATION"] = ["headers", "query_string"]
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1)
    jwt = JWTManager(app)
    db.init_app(app)
    api.init_app(app)
    excel.init_excel(app)
    cache.init_app(app)
    # datastore = SQLAlchemyUserDatastore(db, User, Role)
    # app.security = Security(app, datastore)
    CORS(app)
    with app.app_context():
        import website.view
    
    create_database(app)

    return app

app = create_app()

celery_app = celery_init_app(app)

@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):

    # sender.add_periodic_task(
    #     crontab(minute=16),
    #     dailyReminder.s('New Reminder'),
    # )

    sender.add_periodic_task(
        crontab(minute=10, hour=1),
        generate_monthly_report.s(),
    )

    sender.add_periodic_task(
        crontab(minute=0, hour=18),
        revoke_access_for_overdue_books.s(),
    )

    sender.add_periodic_task(
        crontab(minute=0, hour=15),
        dailyReminder1.s(),
    )
    

if __name__ == '__main__':
    app.run(debug=True)