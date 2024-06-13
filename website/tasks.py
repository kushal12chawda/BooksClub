from celery import shared_task
from website.models import Bookrequest, User
import flask_excel as excel
from website.mail_service import send_message, send_email
from website.models import User, db,Book
from jinja2 import Template
from flask import current_app
import os
from datetime import datetime, timedelta
from sqlalchemy import func, and_

@shared_task(ignore_result=False)
def create_bookrequest_csv():
    bookrequest = Bookrequest.query.all()
    bookreq_csv_output = excel.make_response_from_query_sets(bookrequest, ["bookrequest_issue_date", "bookrequest_return_date", "user_fk", "book_fk", "bookrequest_status", "book_status", "book_rating"], "csv")
    filename = "test.csv"
    with open(filename, 'wb') as f:
        f.write(bookreq_csv_output.data)
    return filename


@shared_task(ignore_result=True)
def dailyReminder(subject):
    templates_dir = current_app.template_folder
    template_path = os.path.join(templates_dir, 'test.html')
    if not os.path.exists(template_path):
        raise FileNotFoundError(f"Template file not found: {template_path}")

    with open(template_path, 'r') as f:
        template = Template(f.read())

    all_users = User.query.filter_by(user_role="User").all()

    for user in all_users:
        rendered_template = template.render(email=user.user_email)
        send_message(user.user_email, subject, rendered_template)

    return "OK"


@shared_task(ignore_result=True)
def dailyReminder1():
    templates_dir = current_app.template_folder
    template_path = os.path.join(templates_dir, 'reminder_email_template.html')
    if not os.path.exists(template_path):
        raise FileNotFoundError(f"Template file not found: {template_path}")

    
    with open(template_path, 'r') as f:
        template = Template(f.read())

    yesterday = datetime.now() - timedelta(days=1)
    users_to_remind = User.query.filter(and_(User.user_last_login_date < yesterday.date(), User.user_role == "User")).all()

    
    for user in users_to_remind:
        
        rendered_template = template.render(email=user.user_email)
        send_message(user.user_email, "Reminder: Visit our App!", rendered_template)

    return "OK"



@shared_task(ignore_result=True)
def generate_monthly_report():
    today = datetime.today()
    last_month = today.replace(day=1) - timedelta(days=1)
    start_date = last_month.replace(day=1)
    end_date = last_month

   
    all_users = User.query.filter_by(user_role="User").all()

    for user in all_users:
        book_requests = Bookrequest.query.filter_by(user_fk=user.user_id)\
                                          .filter(Bookrequest.bookrequest_issue_date.between(start_date, end_date))\
                                          .all()

        html_table = generate_html_table(book_requests)
        send_report_to_users(user.user_name, html_table)

    return "Monthly report generated and sent successfully"

def generate_html_table(book_requests):
    table_data = [["Issue Date", "Return Date", "Book", "Reading Status", "Rating"]]
    for request in book_requests:
        table_data.append([
            request.bookrequest_issue_date.strftime('%Y-%m-%d'),
            request.bookrequest_return_date.strftime('%Y-%m-%d') if request.bookrequest_return_date else "",
            request.book.book_name,
            request.book_status,
            str(request.book_rating) if request.book_rating else ""
        ])

    if (len(table_data) != 1):
        html_table = "<table border='1'><tr>{}</tr></table>".format(
            "</tr><tr>".join("<td>{}</td>".format("</td><td>".join(str(cell) for cell in row)) for row in table_data)
        )
    elif (len(table_data) == 1):
        html_table = "No books borrowed last month? Time for new ones! Make requests and enjoy reading!"

    return html_table


def send_report_to_users(user_name, html_table):
    with open(os.path.join('website/templates', 'monthly_report_email.html'), 'r') as f:
        template_content = f.read()
    rendered_template = template_content.replace('{{ name }}', user_name)
    rendered_template = rendered_template.replace('{{ html_table }}', html_table)
    send_email(
        to=user_name,
        subject="Monthly Activity Report",
        content_body=rendered_template
    )


@shared_task(ignore_result=True)
def revoke_access_for_overdue_books():
    current_date = datetime.now().date()
    overdue_requests = Bookrequest.query.filter(
        func.DATE(Bookrequest.bookrequest_return_date) <= current_date, Bookrequest.bookrequest_status != "returned").all()

    # for request in overdue_requests:
    #     print(request.bookrequest_return_date)
    #     db.session.delete(request)
    # db.session.commit()
    for request in overdue_requests:
        # Send email to the user_fk
        user = request.user_fk  # Assuming user_fk is the foreign key to the User model
        book = request.book_fk  # Assuming book_fk is the foreign key to the Book model
        some1 = User.query.get(user)
        some2 = Book.query.get(book)
        send_revocation_email(some1.user_email, some2.book_name) 
        db.session.delete(request)
    db.session.commit()


def send_revocation_email(user_email, book_name):
    send_email(
        to=user_email,
        subject="Access Revoked for Overdue Book Request",
        content_body= f"Dear User,\n\nYour access to the book '{book_name}' has been revoked because the returned date has passed.\n\nThank you."
    )