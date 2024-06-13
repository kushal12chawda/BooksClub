from flask import current_app as app , send_file , make_response,send_from_directory
from flask import Blueprint, render_template, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required, get_current_user, get_jwt
from .models import User, Book, Category, Bookrequest
from website.auth import jwt
from website.models import db
import os
import PyPDF2
from sqlalchemy import and_, func
import matplotlib.pyplot as plt
from datetime import datetime, timedelta
import base64
import numpy as np
from requests.exceptions import HTTPError
from collections import Counter
import flask_excel as excel
from website.tasks import create_bookrequest_csv
from celery.result import AsyncResult
from datetime import datetime
from sqlalchemy import func
import io

jwt.init_app(app)

@app.get("/")
def home():
    return render_template('base.html')

@app.route('/get_current_user')
@jwt_required()
def get_curr_user():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    return jsonify({'current_user': current_user_id})

@app.get("/pdf")
def pdf():
    return render_template('pdf.html')

@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        file = request.files['file']
        
        if file:
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            file.save(file_path)
            file.seek(0)  
            file_content = file.read()
            new_book = Book(book_name="hello",book_text=file_content)
            
            db.session.add(new_book)
            db.session.commit()
            
            return 'File uploaded successfully!'
    
    return render_template('pdf.html')

@app.route('/upload/<int:id>', methods=['GET', 'POST'])
def upload_file_id(id):
    if request.method == 'POST':
        file = request.files['file']
        
        if file:
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            file.save(file_path)
            file.seek(0)  
            file_content = file.read()

            book = Book.query.filter(Book.book_id == id).first()
            book.book_text = file_content
            db.session.commit()
            
            return 'File uploaded successfully!'
    
    return render_template('pdf.html')    


@app.route('/download_pdf/<int:book_id>', methods=['GET'])
def download_pdf(book_id):
    book = Book.query.filter_by(book_id=book_id).first()

    if not book:
        return jsonify({'error': 'Book not found'}), 404

    if not book.book_text:
        return jsonify({'error': 'PDF not available'}), 404

    pdf_bytes = io.BytesIO(book.book_text)
    pdf_bytes.seek(0) 

    response = send_file(
        pdf_bytes,
        mimetype='application/pdf',
        as_attachment=True,
        download_name='book_{}.pdf'.format(book_id)
    )

    return response


@app.route('/view_pdf/<int:book_id>')
def view_pdf(book_id):
    book = Book.query.get_or_404(book_id)
    pdf_file_path = f'book_{book_id}.pdf'
    with open(pdf_file_path, 'wb') as f:
        f.write(book.book_text)
    
    text = extract_text_from_pdf(pdf_file_path)
    
    return render_template('view.html', text=text)

def extract_text_from_pdf(pdf_file_path):
    text = ''
    with open(pdf_file_path, 'rb') as f:
        pdf_reader = PyPDF2.PdfReader(f)
        num_pages = len(pdf_reader.pages)
        for page_num in range(num_pages):
            page = pdf_reader.pages[page_num]
            text += page.extract_text()
    return text


@app.post("/login")
def login():
    try:
        name = request.json.get("username")
        passs = request.json.get("password")
        r = request.json.get("role")
        d = request.json.get("date")

        user = User.query.filter(User.user_name == name).first()

        if not user:
            return jsonify({"msg": "User not found"})

        if user.user_password != passs:
            return jsonify({"msg" : "Wrong password"})
        
        role=user.user_role
        if r.lower() != role.lower():
            return jsonify({"msg" : "Wrong Role"})
        

        if d:
            new = datetime.strptime(d, "%Y-%m-%d").date()
            print(new, "thhs ")
            user.user_last_login_date = new
            db.session.commit()

        
        jwt_token = create_access_token(identity=user)
        return jsonify({"role" : role ,"msg" : "All done","auth-token": jwt_token}),200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500




@app.route("/signup", methods=['POST'])
def signup():
    if request.method == 'POST':
        try:
            post_data = request.get_json()
            username = post_data["username"]
            email = post_data["email"]
            role = post_data["role"]
            password = post_data["password"]
            print(role, "role")

            existing_user = User.query.filter_by(user_role = "Admin").first()
            if existing_user:
                if (role == "Admin"):
                    print("yes")
                    return jsonify({"message": "Role already taken"})

            new_user = User(user_name=username, user_email=email, user_password=password, user_role=role)

            db.session.add(new_user)

            db.session.commit()

            return jsonify({"message": "Successfully registered!!"})

        except Exception as e:

            db.session.rollback()

            return jsonify({"error": str(e)})

    return jsonify({"error": "Method not allowed"})


@app.route("/book/<int:id>")
@jwt_required()
def get_book(id):
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)

        s_book = Book.query.filter(Book.book_id == id).first()
        print(s_book.category.category_name)
        return jsonify({"id": s_book.book_id, "name": s_book.book_name, "author": s_book.book_author, "category_id": s_book.category_fk, 
                        "category": s_book.category.category_name, "copies": s_book.book_copies, "cost": s_book.book_cost, 
                        "description": s_book.book_description, "current_user": current_user_id})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route("/search/<string:name>")
@jwt_required()
def search(name):
    try:
        all_books = Book.query.all()
        for i in all_books:
            if name.lower() == i.book_name.lower(): 
                a=[]
                a.append({"id": i.book_id, "name": i.book_name, "author": i.book_author, "category_id": i.category_fk, 
                            "category": i.category.category_name, "copies": i.book_copies, "cost": i.book_cost, 
                            "description": i.book_description,"check": "book"})
                
                return jsonify(a)
            
            if name.lower() == i.book_author.lower():
                a = i.book_author
                a_books = Book.query.filter(Book.book_author == a)
                print(a_books)
                l = []
                for k in a_books:
                    l.append({"id": k.book_id, "name": k.book_name, "author": k.book_author, "category_id": k.category_fk, 
                        "category": k.category.category_name, "copies": k.book_copies, "cost": k.book_cost, 
                        "description": k.book_description,"check": "author"})
                    
                return jsonify(l)

            
        all_cat = Category.query.all()
        s=[]
        for j in all_cat:
            if name.lower() == j.category_name.lower():
                m = []
                for k in j.category_book:
                    m.append([k.book_id, k.book_name, k.book_author , k.book_copies , k.book_description , k.book_cost])
                s.append({"id": j.category_id, "name": j.category_name, "book":m, "description": "description", "date": "date","check": "category"})

                return jsonify(s)

        p=[]    
        p.append({"message": "not found"})

        return jsonify(p)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route("/userrr")
@jwt_required()
def get_userrr():
    try:
        current_user = get_jwt_identity()
        user1 = User.query.filter(User.user_id == current_user).first()
        return jsonify({"id": user1.user_id , "email": user1.user_email, "password": user1.user_password, "name": user1.user_name, 
                        "role": user1.user_role, "balance": user1.user_balance, "current_user": current_user})
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route("/user/<int:id>")
@jwt_required()
def get_user(id):
    try:
        user1 = User.query.filter(User.user_id == id).first()
        return jsonify({"id": user1.user_id , "email": user1.user_email, "password": user1.user_password, "name": user1.user_name, 
                        "role": user1.user_role, "balance": user1.user_balance})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route("/category/<int:id>")
def get_cate(id):
    try:
        c = Category.query.filter(Category.category_id == id).first()
        if c is None:
            return jsonify({"error": "Category not found"}), 404

        l = []
        for s in c.category_book:
            pdf_name = "None"
            if s.book_text is not None:
                pdf_name = f'book{s.book_id}.pdf'     
            l.append({
                "cat_id": c.category_id,
                "cat_name": c.category_name,
                "book_id": s.book_id,
                "book_name": s.book_name,
                "book_author": s.book_author,
                "book_copies": s.book_copies,
                "book_cost": s.book_cost,
                "book_description": s.book_description,
                "pdf_name": pdf_name
            })

        return jsonify(l)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/isreq/<int:id1>/<int:id2>")
def is_req(id1,id2):
    try:
        all_bookr = Bookrequest.query.filter_by(user_fk = id1).all()
        count=0
        for i in all_bookr:
            if(i.bookrequest_status == "requested"):
                count+=1

        if(count > 4):
            return jsonify({'message': 'error1'})
        
        for j in all_bookr:
            if(j.book_fk == id2):
                if(j.bookrequest_status == "issued"):
                    return jsonify({'message': 'error2'})
                
                if(j.bookrequest_status == "requested"):
                    new_id = j.bookrequest_id
                    n = Book.query.filter_by(book_id = j.book_fk).first()
                    new_name = n.book_name
                    return jsonify({'message': 'error3','id': new_id,'name': new_name})
                
        return jsonify({'message': 'allgood'})        
                
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    
@app.route("/isdown/<int:id1>/<int:id2>")
def is_down(id1,id2):
    try:
        down_bookr = Bookrequest.query.filter_by(user_fk = id1).all()
        for i in down_bookr:
            if(i.book_fk == id2):
                if(i.bookrequest_status == "issued"):
                    return jsonify({'message': 'ok'})
        return jsonify({'message': 'not_ok'})         
   
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    


@app.route("/isreqsearch/<int:id1>/<string:name>")
def is_req_search(id1,name):
    try:
        obj = Book.query.filter_by(book_name = name).first()
        id2 = obj.book_id
        
        all_bookr = Bookrequest.query.filter_by(user_fk = id1).all()
        count=0
        for i in all_bookr:
            if(i.bookrequest_status == "requested"):
                count+=1

        if(count > 4):
            return jsonify({'message': 'error1'})
        
        for j in all_bookr:
            if(j.book_fk == id2):
                if(j.bookrequest_status == "issued"):
                    return jsonify({'message': 'error2'})
                
                if(j.bookrequest_status == "requested"):
                    new_id = j.bookrequest_id
                    n = Book.query.filter_by(book_id = j.book_fk).first()
                    new_name = n.book_name
                    return jsonify({'message': 'error3','id': new_id,'name': new_name})
                
        return jsonify({'message': 'allgood'})        
                
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    
@app.route("/isdownsearch/<int:id1>/<string:name1>")
def is_down_search(id1,name1):
    try:
        obj1 = Book.query.filter_by(book_name = name1).first()
        id2 = obj1.book_id

        down_bookr = Bookrequest.query.filter_by(user_fk = id1).all()
        for i in down_bookr:
            if(i.book_fk == id2):
                if(i.bookrequest_status == "issued"):
                    return jsonify({'message': 'ok'})
        return jsonify({'message': 'not_ok'})         
   
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route("/inbox_req")
@jwt_required()
def inbox_req():
    try:
        all_req = Bookrequest.query.all()
        L = []
        for j in all_req:
            print(j.book_fk)
            books1 = Book.query.filter_by(book_id = j.book_fk).first()
            cat1 = Category.query.get(books1.category_fk)
            user1 = User.query.get(j.user_fk)
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
                "user_name": user1.user_name
            }
            L.append(d)
        return jsonify(L)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route("/rejected_req/<int:id>")
def rejected_req(id):
    try:
        rejected_req = Bookrequest.query.filter(and_(Bookrequest.user_fk == id, Bookrequest.bookrequest_status == "rejected")).all()
        L = []
        for j in rejected_req:
            books1 = Book.query.filter_by(book_id = j.book_fk).first()
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
            }
            L.append(d)
        return jsonify(L)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route("/stats")
@jwt_required()
def stats():
    current_user_id = get_jwt_identity()
    
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

    if all_cat == []:
        msg_graph_1 = "No Graph 1 to Preview"
    
    else:
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
        fig, ax = plt.subplots(figsize=(9, 6), facecolor="#F9F1F0")
        ax.pie(sizes, labels=labels, autopct='%1.1f%%', startangle=60, colors = ( "#F1DE5E", "#860564", "#F4AA74", "#4D4485", "#1E1252", "red"))

        centre_circle = plt.Circle((0, 0), 0.70, color='#F9F1F0')
        fig.gca().add_artist(centre_circle)

        ax.axis('equal')
        ax.legend(title="Categories", bbox_to_anchor=(1, 0.5))  
        ax.set_title('Distribution of Books of Interest by Category', fontsize=18, fontweight='bold')
        plt.tight_layout()
        try:
            plt.savefig("website/static/graph1.jpeg")
            msg_graph_1 = "Got Graph 1"
        except Exception as e:
            print ("failure")

    # GRAPH 1 -- END
    all_book_req_1 = Bookrequest.query.filter(and_(Bookrequest.user_fk == current_user_id, Bookrequest.bookrequest_status != "requested", Bookrequest.bookrequest_status != "rejected")).all()

    book_req_count_1 = {}
    for request in all_book_req_1:
        month_year = request.bookrequest_issue_date.strftime('%Y-%m')
        if month_year not in book_req_count_1:
            book_req_count_1[month_year] = 1
        else:
            book_req_count_1[month_year] += 1

    if book_req_count_1 == {}:
        msg_graph_2 = "No Graph 2 to Preview"

    else:
        years_months = list(book_req_count_1.keys())
        num_books_ordered = list(book_req_count_1.values())
        years_month_sorted = sorted(years_months)
        counts = []
        for j in years_month_sorted:
            counts.append(book_req_count_1[j])

        # Plotting the line chart
        plt.figure(figsize=(10, 6), facecolor="#F9F1F0")
        plt.plot(years_month_sorted, counts, marker='o', linestyle='-', color="purple")
        plt.xticks(fontsize=14)
        plt.yticks(fontsize=14)  
        plt.title('Issued Books Over Time', fontsize=20, fontweight='bold', y=1.05)
        plt.xlabel('Year-Month', fontsize=17,labelpad=20)
        plt.ylabel('Number of Books Ordered', fontsize=17,labelpad=20)
        plt.tight_layout()
        plt.savefig("website/static/borrowing_activity.png")
        msg_graph_2 = "Got Graph 2"
    return({"msg_graph_1": msg_graph_1, "msg_graph_2": msg_graph_2})


@app.route("/admin_stats")
@jwt_required()
def admin_stats():
    #GRAPH 1
    all_book_req = Bookrequest.query.filter(and_(Bookrequest.bookrequest_status != "requested", Bookrequest.bookrequest_status != "rejected")).all()
    print(all_book_req, "all book req")
    if all_book_req == []:
        msg_graph_1 = "No Graph 1 to Preview"

    else:
        book_req_count = {}
        for i in all_book_req:
            month_year = i.bookrequest_issue_date.strftime('%Y-%m')
            if month_year not in book_req_count:
                book_req_count[month_year] = 1
            else:
                book_req_count[month_year] += 1
        months = list(book_req_count.keys())
        months_sorted = sorted(months)
        counts = []
        for j in months_sorted:
            counts.append(book_req_count[j])
        plt.figure(figsize=(8, 5), facecolor='#E4D4C8')
        plt.plot(months_sorted, counts, marker='o', linestyle='-', color="#3C2113")
        plt.title('Total Number of Books Issued Each Month', fontsize=20, fontweight='bold', pad=20)
        plt.xticks(fontsize=15)
        plt.xticks(fontsize=15) 
        plt.xlabel('Month-Year', fontsize=17,labelpad=20)
        plt.ylabel('Number of Books Issued', fontsize=17,labelpad=20)
        plt.tight_layout()
        plt.savefig("website/static/graph3.jpeg")
        msg_graph_1 = "Got Graph 1"


    # GRAPH 2
    book_req = Bookrequest.query.all()
    print(book_req, "book_req")
    if book_req == []:
        msg_graph_2 = "No Graph 2 to Preview"
    else:
        d = {}
        for i in book_req:
            print(i.book.category.category_name)
            cat_name = i.book.category.category_name
            if cat_name not in d:
                d[cat_name] = 0
            d[cat_name] += 1
        category_names = list(d.keys())
        book_counts = list(d.values())
        fig, ax = plt.subplots(figsize=(10, 8), facecolor='#E4D4C8')

        _, _, autotexts = ax.pie(book_counts, labels=category_names, autopct='%1.1f%%', startangle=140, colors=("#DB1B59","#3CC3BC", "#870A30", "#FCCB0A", "#8C70E6"), textprops={'fontsize': 14})  # Adjust the fontsize value here
        plt.axis('equal') 
        plt.title('Distribution of Books Borrowed by Category', fontsize=20, fontweight='bold', pad=20)  
        plt.legend(category_names, loc="upper left")
        plt.tight_layout()
        plt.savefig("website/static/graph4.jpeg")
        msg_graph_2 = "Got Graph 2"
    return({"msg_graph_1": msg_graph_1, "msg_graph_2": msg_graph_2})


@app.route("/admin_home")
@jwt_required()
def admin_home():
    try:
        L = []
        all_books = Book.query.all()
        all_bookreq = Bookrequest.query.all()
        for i in all_books:
            d = {}
            d["book_name"] = i.book_name
            d["category_name"] = Category.query.filter_by(category_id=i.category_fk).first().category_name
            d_req = {}
            d_iss = {}
            for bookreq in all_bookreq:
                if bookreq.book_fk == i.book_id:
                    user = User.query.get(bookreq.user_fk)
                    if bookreq.bookrequest_status == "requested":
                        d_req[user.user_name] = None
                    elif bookreq.bookrequest_status == "issued":
                        d_iss[user.user_name] = None
            
            d["requested"] = list(d_req.keys())
            d["issued"] = list(d_iss.keys())        
            L.append(d)     
        return jsonify(L)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/download-csv')
def download_csv():
    task = create_bookrequest_csv.delay()
    return jsonify({"task_id": task.id})


@app.route('/get-csv/<task_id>')
def get_csv(task_id):
    res = AsyncResult(task_id)

    if res.ready():
        filename = res.result
        return send_file(filename, as_attachment=True)
    else:
        return jsonify({"message": "task pending"}), 404
    

@app.route('/curr-date')
def curr_date():
    L = []
    current_date = datetime.now().date()
    overdue_requests = Bookrequest.query.filter(
        func.DATE(Bookrequest.bookrequest_return_date) <= current_date,
        Bookrequest.bookrequest_status != "returned"
    ).all()

    for request in overdue_requests:
        L.append(request.bookrequest_id)
    return jsonify(L)


@app.route("/new_bookreq", methods=['POST'])
@jwt_required()
def new_bookreq():
    if request.method == 'POST':
        try:
            data = request.get_json()
            issue_date = data["bookrequest_issue_date"]
            return_date = data["bookrequest_return_date"]
            new = datetime.strptime(return_date, "%Y-%m-%d").date()
            request_status = data["bookrequest_status"]
            book_status = data["book_status"]
            user_f = data["user_fk"]
            book_f = data["book_fk"]
            book_f1 = data["book_rating"]
            if book_f1 is None:
                book_f1 = 0
                
            new_book_req = Bookrequest(
                bookrequest_issue_date=issue_date,
                bookrequest_return_date=new,
                bookrequest_status=request_status,
                book_status=book_status,
                user_fk=user_f,
                book_fk=book_f,
                book_rating=book_f1
            )
            db.session.add(new_book_req)
            db.session.commit()
            
            return jsonify({"message": "Book request updated successfully"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    return jsonify({'error': "method not allowed"})
    

@app.route('/feedback', methods=['PUT'])
@jwt_required()
def feedback():
    current_user_id = get_jwt_identity()
    old_feedback = User.query.filter_by(user_id=current_user_id).first()

    if not old_feedback:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()
    new_feedback = data.get('user_feedback', old_feedback.user_feedback)

    try:
        user = User.query.filter_by(user_id=current_user_id).first()
        user.user_feedback = new_feedback
        db.session.commit()
        return jsonify({'message': 'Feedback updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    

@app.post("/costcut/<int:id1>/<int:id2>")
def costcut(id1,id2):
    try:
        user = User.query.filter(User.user_id == id1).first()
        bal = user.user_balance
        book = Book.query.filter(Book.book_id == id2).first()
        real = book.book_cost
        new_bal = int(bal)-int(real)
        user.user_balance = new_bal
        db.session.commit()
        return jsonify({'message': "success"})
    except Exception as e:
        return jsonify({'error': str(e)}), 500