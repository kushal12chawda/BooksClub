from flask_restful import Resource, Api
from flask_restful import fields, marshal_with
from flask_restful import reqparse
from website.models import User, Category, Book, Bookrequest, db
from datetime import datetime,date
from flask import current_app as app, jsonify
from sqlalchemy import or_, and_
from time import perf_counter_ns
from website.instances import cache
from flask_jwt_extended import jwt_required
from flask_cors import cross_origin
from sqlalchemy import and_, func
import matplotlib.pyplot as plt
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required, get_current_user, get_jwt

api = Api(prefix = '/api')


class DateOnlyField(fields.Raw):     #for fields
    def format(self, value):
        if value is None:
            return None
        return value.strftime('%Y-%m-%d')


def parse_date(date_str):             #for parser
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        # Handle invalid date format
        return None

user_fields = {
    "user_id": fields.Integer,
    "user_name": fields.String,
    "user_email": fields.String,
    "user_password": fields.String,
    "user_role": fields.String,
    "user_balance": fields.Integer
}

book_fields = {
    "book_id": fields.Integer,
    "book_name": fields.String,
    "book_author": fields.String,
    "book_copies": fields.Integer,
    "book_description": fields.String,
    "book_cost": fields.Integer,
    "category_fk": fields.Integer
}

category_fields = {
    "category_id": fields.Integer,
    "category_name": fields.String,
    "category_date": DateOnlyField(attribute='category_date'),      #have to use
    "category_description": fields.String,    #have to use
}

bookrequest_fields = {
    "bookrequest_id" : fields.Integer,
    "bookrequest_issue_date" : DateOnlyField(attribute='bookrequest_issue_date'),
    "bookrequest_return_date" : DateOnlyField(attribute='bookrequest_return_date'),
    "bookrequest_status" : fields.String,
    "book_status" : fields.String,
    "user_fk":fields.Integer,
    "book_fk":fields.Integer,
    "book_rating":fields.Integer
}

parser = reqparse.RequestParser()
parser.add_argument("user_email", type=str, help="blah")
parser.add_argument("user_password", type=str, help="blah")
parser.add_argument("user_name", type=str, help="blah")
parser.add_argument("user_role", type=str, help="blah")
parser.add_argument("user_balance", type=int, help="blah")


book_parser = reqparse.RequestParser()
book_parser.add_argument("book_name", type=str, help="blah3")
book_parser.add_argument("book_author", type=str, help="blah3")
book_parser.add_argument("book_copies", type=int, help="blah3")
book_parser.add_argument("book_cost", type=int, help="blah3")
book_parser.add_argument("book_description", type=str, help="blah3")
book_parser.add_argument("category_fk", type=int, help="blah3")

category_parser = reqparse.RequestParser()
category_parser.add_argument("category_name", type=str, help="blah2")
category_parser.add_argument("category_date", type=parse_date, help="blah2")
category_parser.add_argument("category_description", type=str, help="blah2")

bookreq_parser = reqparse.RequestParser()
bookreq_parser.add_argument("bookrequest_id", type=int, help="blah1")
bookreq_parser.add_argument("bookrequest_issue_date", type=parse_date, help="blah1")
bookreq_parser.add_argument("bookrequest_return_date", type=parse_date, help="blah1")
bookreq_parser.add_argument("bookrequest_status", type=str, help="blah1")
bookreq_parser.add_argument("book_status", type=str, help="blah1")
bookreq_parser.add_argument("user_fk", type=int, help="blah1")
bookreq_parser.add_argument("book_fk", type=int, help="blah1")
bookreq_parser.add_argument("book_rating", type=int, help="blah1")

def user_to_json(user):
    return {
        "id":user.user_id,
        "password":user.user_password,
        "name": user.user_name,
        "email":user.user_email,
        "role":user.user_role,
        "balance":user.user_balance
    }

def book_to_json(book):
    return {
        "id":book.book_id,
        "name":book.book_name,
        "author": book.book_author,
        "copies":book.book_copies,
        "description":book.book_description,
        "cost":book.book_cost,
        "copies":book.book_copies,
        "category":book.category_fk
    }

def category_to_json(category):
    return {
        "id":category.category_id,
        "name":category.category_name,
        "date": category.category_date,
        "description":category.category_description,
    }

def bookrequest_to_json(bookrequest):
    return{
        "id":bookrequest.bookrequest_id,
        "issue_date":bookrequest.bookrequest_issue_date,
        "return_date":bookrequest.bookrequest_return_date,
        "user":bookrequest.user_fk,
        "book":bookrequest.book_fk,
        "bookreq_status":bookrequest.bookrequest_status,
        "book_status":bookrequest.book_status,
        "book_rating":bookrequest.book_rating,
    }    

def myacc_to_json(bookrequest): 
    return{
        "id":bookrequest.bookrequest_id,
        "issue_date":bookrequest.bookrequest_issue_date,
        "return_date":bookrequest.bookrequest_return_date,
        "user":bookrequest.user_fk,
        "book":bookrequest.book_fk,
        "bookreq_status":bookrequest.bookrequest_status,
        "book_status":bookrequest.book_status,
    }

class UserAPI(Resource):
    @cache.cached(timeout=50)
    def get(self):
        users=User.query.all()
        us=[user_to_json(i) for i in users]
        return jsonify(us)

    @marshal_with(user_fields)
    @jwt_required()
    def post(self):
        args = parser.parse_args()
        name = args.get("user_name")
        email = args.get("user_email")
        role = args.get("user_role")
        password = args.get("user_password")
        balance = args.get("user_balance")

        us = User(user_name=name, user_email=email, user_role=role, user_password=password, user_balance=balance)
        db.session.add(us)
        db.session.commit()
        cache.clear()
        return us, 201
    
    @marshal_with(user_fields)    
    @jwt_required()
    def put(self, id):
        try:
            args = parser.parse_args()
            name = args.get("user_name")
            email = args.get("user_email")
            role = args.get("user_role")
            password = args.get("user_password")
            balance = args.get("user_balance")

            us = User.query.filter_by(user_id=id).first()
            if not us:
                return {"message": "User not found"}, 404
            
            # Update user attributes
            us.user_name = name
            us.user_email = email
            us.user_password = password
            us.user_role = role
            us.user_balance = balance

            # Commit changes to the database
            db.session.commit()
            cache.clear()

            return us, 200

        except Exception as e:
            error_message = "An error occurred while updating user (id={})".format(id)
            return {"error": error_message}, 500    
        

    @jwt_required()
    def delete(self, id):
        try:
            us = User.query.filter_by(user_id=id).first()
            if us:
                db.session.delete(us)
                db.session.commit()
                cache.clear()
                return us, 200
        except Exception as e:
            db.session.rollback()  
            return {"error": str(e)}, 500    
        

class CategoryAPI(Resource):                            
    @jwt_required()
    @cache.cached(timeout=50)
    def get(self):
        try:
            categories = Category.query.all()
            l = []
            for i in categories:
                m = []
                for j in i.category_book:
                    m.append([j.book_id, j.book_name])
                category_dict = {
                    'category_id': i.category_id,
                    'category_name': i.category_name,
                    'category_date': i.category_date,
                    'category_description': i.category_description,
                    'book_name': m
                }
                l.append(category_dict),200
            return jsonify(l)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        
        
    @marshal_with(category_fields)
    @jwt_required()
    def put(self, id):
        try:
            cate = Category.query.filter_by(category_id=id).first()
            if not cate:
                return jsonify({'error': 'Category not found'}), 404
            
            args = category_parser.parse_args()
            name = args.get("category_name")
            date = args.get("category_date")
            if date is None:
                date = cate.category_date
            
            description = args.get("category_description")

            cate.category_name = name
            cate.category_date = date
            cate.category_description = description
            
            db.session.commit()
            cache.clear()
            
            return cate, 200
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500


    @marshal_with(category_fields)
    @jwt_required()
    def post(self):
        try:
            args = category_parser.parse_args()
            cat_name = args.get("category_name")
            cat_desc = args.get("category_description")

            new_cat = Category(category_name=cat_name, category_description=cat_desc)
            db.session.add(new_cat)
            db.session.commit()
            cache.clear()
            return new_cat, 201
        except Exception as e:
            db.session.rollback()  
            return jsonify({'error': str(e)}), 500

        
    @jwt_required()
    def delete(self,id):                                                              
        delete_cat = Category.query.filter_by(category_id = id).first()
        try: 
            db.session.delete(delete_cat)
            db.session.commit()
            cache.clear()
            return jsonify({"message":"successfully deleted"})
        except:
            return jsonify({"message":"id does not exist."})    
    
    


class BookAPI(Resource):
    @jwt_required()
    def get(self):
        books=Book.query.all()
        print(books)
        all_books=[book_to_json(i) for i in books]
        return jsonify(all_books)


    @marshal_with(book_fields)
    @jwt_required()
    def put(self, id):
        try:
            booke = Book.query.filter_by(book_id=id).first()
            category = booke.category_fk
            if not booke:
                return jsonify({'error': 'Book not found'}), 404
            
            args = book_parser.parse_args()
            name = args.get("book_name")
            author = args.get("book_author")
            copies = args.get("book_copies")
            cost = args.get("book_cost")
            description = args.get("book_description")

            booke.book_name = name
            booke.book_author = author
            booke.book_copies = copies
            booke.book_cost = cost
            booke.book_description = description
            booke.category_fk = category
            
            db.session.commit()
            
            return booke, 200
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500    
        
        
    @marshal_with(book_fields)
    @jwt_required()
    def post(self):
        try:
            args = book_parser.parse_args()
            post_name = args.get("book_name")
            post_author = args.get("book_author")
            post_copies = args.get("book_copies")
            post_cost = args.get("book_cost")
            post_description = args.get("book_description")
            post_category_fk = args.get("category_fk")
            

            new_book = Book(book_name = post_name, book_author = post_author , book_copies = post_copies , book_cost = post_cost , book_description = post_description , category_fk = post_category_fk)
            db.session.add(new_book)
            db.session.commit()
            return new_book, 201
        except Exception as e:
            db.session.rollback()  
            return jsonify({'error': str(e)}), 500    
        

    @jwt_required()
    def delete(self,id):                                                              
        delete_book = Book.query.filter_by(book_id = id).first()
        print(delete_book)
        try: 
            db.session.delete(delete_book)
            db.session.commit()
            print("success")
            return jsonify({"message":"successfully deleted"})
        except:
            return jsonify({"message":"Book does not exist."})    
    

class MyAccountAPI(Resource):
    @jwt_required()
    def get(self, id):
        try:
            books = Bookrequest.query.filter(and_(Bookrequest.user_fk == id, Bookrequest.bookrequest_status == "issued")).all()
            L = []
            for j in books:
                books1 = Book.query.get(j.book_fk)
                cat1  = Category.query.get(books1.category_fk)
                d = {
                    "id": j.bookrequest_id,
                    "issue_date":j.bookrequest_issue_date,
                    "return_date":j.bookrequest_return_date,
                    "user":j.user_fk,
                    "book":j.book_fk,
                    "bookreq_status":j.bookrequest_status,
                    "book_status":j.book_status,
                    "book_rating":j.book_rating,
                    "book_name": books1.book_name,
                    "category_name": cat1.category_name,
                }
                L.append(d)
            return jsonify(L)
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        

class BookrequestAPI(Resource):
    @jwt_required()
    @cache.cached(timeout=50)
    @cross_origin()
    def get(self):
        bookreq=Bookrequest.query.all()
        all_books_req=[bookrequest_to_json(i) for i in bookreq]
        return jsonify(all_books_req)
    

    @marshal_with(bookrequest_fields)
    @jwt_required()
    @cross_origin()
    def put(self, id):
        try:
            bookr = Bookrequest.query.filter_by(bookrequest_id = id).first()

            args = bookreq_parser.parse_args()

            issue_date = args.get("bookrequest_issue_date")
            if issue_date == None: issue_date = bookr.bookrequest_issue_date

            return_date = args.get("bookrequest_return_date")
            if return_date ==  None: return_date = bookr.bookrequest_return_date

            request_status = args.get("bookrequest_status")
            if request_status == None: request_status = bookr.bookrequest_status

            book_status = args.get("book_status")
            if book_status == None: book_status = bookr.book_status

            user_fk = args.get("user_fk")
            if user_fk == None: user_fk = bookr.user_fk

            book_fk = args.get("book_fk")
            if book_fk == None: book_fk = bookr.book_fk

            book_rating = args.get("book_rating")
            if book_rating == None: book_rating = bookr.book_rating

            req = Bookrequest.query.filter_by(bookrequest_id = id).first()
        
            if req:
                req.bookrequest_issue_date = issue_date
                req.bookrequest_return_date = return_date
                req.bookrequest_status = request_status
                req.book_status = book_status
                req.user_fk = user_fk
                req.book_fk = book_fk
                req.book_rating = book_rating
                db.session.commit()
                cache.clear()
                return jsonify({"message": "Book request updated successfully", "req": req}), 200
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500    
        
    
    @marshal_with(bookrequest_fields)
    @jwt_required()
    def post(self):
        try:
            print("hello1")
            args = bookreq_parser.parse_args()
            issue_date = args.get("bookrequest_issue_date")
            return_date = args.get("bookrequest_return_date")
            request_status = args.get("bookrequest_status")
            book_status = args.get("book_status")
            user_f = args.get("user_fk")
            book_f = args.get("book_fk")
            book_f1 = args.get("book_rating")
            if book_f1 == None: book_f1 = 0
            
            

            new_book_req = Bookrequest(bookrequest_issue_date = issue_date, bookrequest_return_date = return_date, bookrequest_status = request_status, book_status = book_status , user_fk = user_f , book_fk = book_f,book_rating = book_f1)
            db.session.add(new_book_req)
            db.session.commit()
            self.clear_cache()
    
            return jsonify({"message": "Book request updated successfully"}), 200
        except Exception as e:
            db.session.rollback()  
            return jsonify({'error': str(e)}), 500
        
    
    @jwt_required()
    @cross_origin()
    def delete(self,id):                                                              
        delete_book_req = Bookrequest.query.filter_by(bookrequest_id = id).first()
        try: 
            db.session.delete(delete_book_req)
            db.session.commit()
            self.clear_cache()
            return jsonify({"message":"successfully deleted"})
        except:
            return jsonify({"message":"BookRequest does not exist."})  


class UserStatsAPI(Resource):
    @jwt_required()
    def get(self):
        print("step 1")
        current_user_id = get_jwt_identity()
        
        
        current_user = User.query.get(current_user_id)
        print("step 2")
        print(current_user_id, current_user, "this is current user")
        all_cat = Category.query.join(
                                Book, Category.category_id == Book.category_fk
                            ).join(
                                Bookrequest, Book.book_id == Bookrequest.book_fk
                            ).join(
                                User, Bookrequest.user_fk == User.user_id
                            ).filter(and_(
                                Bookrequest.book_fk == Book.book_id, Book.category_fk == Category.category_id, User.user_id == current_user_id #fixed user 1
                            )).with_entities(
                                Category.category_name, Book.book_name
                            ).all()
        print(all_cat)
        
        dict = {}
        
        for cat_name, book_name in all_cat:
            if cat_name not in dict:
                dict[cat_name] = [book_name]
            else:
                dict[cat_name].append(book_name)
        print(dict)

        labels = list(dict.keys())
        sizes = []
        for i in dict.keys():
            sizes.append(len(dict[i]))

    # DONUT CHART
        fig, ax = plt.subplots()
        ax.pie(sizes, labels=labels, autopct='%1.1f%%', startangle=90, colors = ( "#F1DE5E", "#860564", "#F4AA74", "#4D4485", "#1E1252", "red"))

        
        centre_circle = plt.Circle((0, 0), 0.70, color='white')
        fig.gca().add_artist(centre_circle)

        
        ax.axis('equal')

       
        ax.legend(title="Categories", loc="center left", bbox_to_anchor=(1, 0.5))  

        ax.set_title('Distribution of Books by Category', fontsize=18, fontweight='bold', y=1.05)

        
        plt.tight_layout()
        try:
            plt.savefig("website/static/graph1.jpeg")
            print ("success")
        except Exception as e:
            print ("failure")

        # GRAPH 1 -- END

        
        # GRAPH 2 -- START
        borrowing_activity = Bookrequest.query.with_entities(
            func.extract('year', Bookrequest.bookrequest_issue_date).label('year'),
            func.extract('month', Bookrequest.bookrequest_issue_date).label('month'),
            func.count(func.distinct(Bookrequest.book_fk)).label('num_distinct_books_borrowed')
        ).filter(
            Bookrequest.user_fk == current_user_id,    
        ).group_by(
            'year', 'month'
        ).order_by(
            'year', 'month'
        ).all()

        
        years_months = [f"{r.year}-{r.month:02d}" for r in borrowing_activity]
        num_distinct_books_borrowed = [r.num_distinct_books_borrowed for r in borrowing_activity]
        print(num_distinct_books_borrowed)

        
        plt.figure(figsize=(10, 6))
        plt.plot(years_months, num_distinct_books_borrowed, marker='o', linestyle='-', color="purple")
        plt.xticks(fontsize=14)
        plt.xticks(fontsize=14)   
        plt.title('User Borrowing Activity Over Time', fontsize=20, fontweight='bold', y=1.05)
        plt.xlabel('Year-Month', fontsize=17,labelpad=20)
        plt.ylabel('Number of Books Borrowed', fontsize=17,labelpad=20)
        
        plt.tight_layout()

        
        plt.savefig("website/static/borrowing_activity.png")
        #GRAPH2 --- END
        
        return({"msg": "successfull"})


    
api.add_resource(UserAPI, '/user', '/user/<int:id>')
api.add_resource(CategoryAPI, '/category', '/category/<int:id>')
api.add_resource(BookAPI, '/book','/book/<int:id>')
api.add_resource(MyAccountAPI, '/myacc/<int:id>')
api.add_resource(BookrequestAPI ,'/bookrequest/','/bookrequest/<int:id>')
api.add_resource(UserStatsAPI ,'/stats/')