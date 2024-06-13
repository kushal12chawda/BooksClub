from flask_login import UserMixin
from sqlalchemy.sql import func
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model, UserMixin):
    user_id = db.Column(db.Integer, primary_key = True)
    user_email = db.Column(db.String(150), unique = True, nullable = False)
    user_password = db.Column(db.String(150))
    user_name = db.Column(db.String(150), nullable = False,unique = True)
    user_role = db.Column(db.String(150), nullable = False)
    user_balance = db.Column(db.Integer, default=0)
    user_last_login_date = db.Column(db.Date)
    user_feedback = db.Column(db.Text)
    user_bookrequest = db.relationship('Bookrequest', backref = 'user', cascade='all, delete-orphan')

class Category(db.Model, UserMixin):
    category_id = db.Column(db.Integer, primary_key = True)
    category_name = db.Column(db.String(150), unique = True, nullable = False)
    category_date = db.Column(db.Date, default=func.current_date())
    category_description = db.Column(db.Text)
    category_book = db.relationship('Book', backref = 'category', cascade='all, delete-orphan')

class Book(db.Model, UserMixin):
    book_id = db.Column(db.Integer, primary_key = True)
    book_name = db.Column(db.String(150), nullable = False)
    book_author = db.Column(db.String(150))
    book_text = db.Column(db.LargeBinary)
    book_image = db.Column(db.LargeBinary)
    book_copies = db.Column(db.Integer)
    book_description = db.Column(db.Text)
    book_cost = db.Column(db.Integer)
    category_fk = db.Column(db.Integer, db.ForeignKey('category.category_id'))
    book_bookrequest = db.relationship('Bookrequest', backref = 'book', cascade='all, delete-orphan')

class Bookrequest(db.Model, UserMixin):
    bookrequest_id = db.Column(db.Integer, primary_key = True)
    bookrequest_issue_date = db.Column(db.Date)
    bookrequest_return_date = db.Column(db.Date)
    bookrequest_status = db.Column(db.String(150))
    book_status = db.Column(db.String(150))
    book_rating = db.Column(db.Integer)
    user_fk = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    book_fk = db.Column(db.Integer, db.ForeignKey('book.book_id'))

