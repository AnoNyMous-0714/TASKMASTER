import base64
import os
import subprocess
import tempfile
import re
import uuid
from datetime import datetime, timedelta
from flask import (
    Flask,
    render_template,
    request,
    redirect,
    send_file,
    url_for,
    flash,
    session,
    jsonify,
)
from flask_mysqldb import MySQL
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from flask_mail import Mail, Message

app = Flask(__name__)
app.secret_key = "12345"

app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 465
app.config["MAIL_USERNAME"] = "taskmastermanagement2024@gmail.com"
app.config["MAIL_PASSWORD"] = "fqzn dkay hugs mlrh"
app.config["MAIL_USE_TLS"] = False
app.config["MAIL_USE_SSL"] = True
app.config["MAIL_DEFAULT_SENDER"] = (
    "TaskMaster Management",
    "taskmastermanagement2024@gmail.com",
)

mail = Mail(app)

# MySQL configurations
app.config["MYSQL_PORT"] = 3306
app.config["MYSQL_HOST"] = "se-2-pc.cb8gw40scgwo.ap-southeast-1.rds.amazonaws.com"
app.config["MYSQL_USER"] = "admin"
app.config["MYSQL_PASSWORD"] = "betiyag69420"
app.config["MYSQL_DB"] = "taskmaster"
app.config["UPLOAD_FOLDER"] = "static/uploads"

mysql = MySQL(app)


@app.route("/")
def main():
    return render_template("main.html")


def is_email(input_string):
    return re.match(r"[^@]+@[^@]+\.[^@]+", input_string)


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in {'png', 'jpg', 'jpeg', 'gif'}


@app.route("/Login", methods=["GET", "POST"])
def Login():
    if request.method == "POST":
        username_or_email = request.form["fname"]
        password = request.form["password"]

        cursor = mysql.connection.cursor()
        if is_email(username_or_email):
            cursor.execute("SELECT * FROM user WHERE email = %s", (username_or_email,))
        else:
            cursor.execute("SELECT * FROM user WHERE username = %s", (username_or_email,))
        user = cursor.fetchone()
        cursor.close()

        if user and check_password_hash(user[4], password):
            session["email"] = user[3]
            return redirect(url_for("dashboard"))
        else:
            flash("Invalid username or password")
            return redirect(url_for("Login"))

    return render_template("Login.html")


@app.route("/reset_password", methods=["GET", "POST"])
def reset_password():
    if request.method == "POST":
        email_or_username = request.form["username"]

        cursor = mysql.connection.cursor()
        cursor.execute("SELECT * FROM user WHERE email = %s OR username = %s", (email_or_username, email_or_username))
        user = cursor.fetchone()
        cursor.close()

        if user:
            token = str(uuid.uuid4())
            expiration = datetime.now() + timedelta(hours=1)  # Token expires in 1 hour
            cursor = mysql.connection.cursor()
            cursor.execute("INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (%s, %s, %s)", (user[0], token, expiration))
            mysql.connection.commit()
            cursor.close()

            reset_link = url_for('reset_password_token', token=token, _external=True)
            msg = Message('Password Reset Request', recipients=[user[3]])
            msg.body = f"To reset your password, click the following link: {reset_link}"
            mail.send(msg)

            flash("Password reset email has been sent.")
            return redirect(url_for("Login"))
        else:
            flash("User not found")
            return redirect(url_for("reset_password"))

    return render_template("reset_password.html")

@app.route("/reset_password/<token>", methods=["GET", "POST"])
def reset_password_token(token):
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM password_reset_tokens WHERE token = %s AND expires_at > %s", (token, datetime.now()))
    token_data = cursor.fetchone()
    cursor.close()

    if not token_data:
        flash("Invalid or expired token")
        return redirect(url_for("reset_password"))

    if request.method == "POST":
        new_password = request.form["password"]
        confirm_password = request.form["confirm_password"]

        if new_password != confirm_password:
            flash("Passwords do not match")
            return redirect(url_for("reset_password_token", token=token))

        hashed_password = generate_password_hash(new_password)

        cursor = mysql.connection.cursor()
        cursor.execute("UPDATE user SET password = %s WHERE user_id = %s", (hashed_password, token_data[1]))
        mysql.connection.commit()
        cursor.execute("DELETE FROM password_reset_tokens WHERE user_id = %s", (token_data[1],))
        mysql.connection.commit()
        cursor.close()

        # Send confirmation email after password reset
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT email FROM user WHERE user_id = %s", (token_data[1],))
        user_email = cursor.fetchone()[0]
        cursor.close()

        msg = Message('Password Changed Successfully', recipients=[user_email])
        msg.body = "Your password has been successfully changed. If you did not request this change, please contact support immediately."
        mail.send(msg)

        flash("Password reset successful! Please login with your new password.")
        return redirect(url_for("Login"))

    return render_template("reset_password_token.html")


@app.route("/createaccount", methods=["GET", "POST"])
def createaccount():
    if request.method == "POST":
        first_name = request.form["fname"]
        last_name = request.form["Lname"]
        email = request.form["email"]
        password = request.form["password"]
        passwordagain = request.form["passwordagain"]
        birth_date = request.form["birth"]
        username = request.form["username"]

        if password != passwordagain:
            flash("Passwords do not match")
            return redirect(url_for("createaccount"))

        hashed_password = generate_password_hash(password)

        try:
            birth_date = datetime.strptime(birth_date, "%Y-%m-%d")
            if birth_date > datetime.now():
                flash("Date of birth cannot be in the future.")
                return redirect(url_for("createaccount"))
        except ValueError:
            flash("Invalid date format.")
            return redirect(url_for("createaccount"))

        allowed_domains = ["gmail.com", "yahoo.com", "tip.edu.ph"]
        if any(email.endswith(domain) for domain in allowed_domains):
            cursor = mysql.connection.cursor()

             # Check if email already exists
            cursor.execute("SELECT * FROM user WHERE email = %s", (email,))
            if cursor.fetchone():
                flash("Email already exists. Please use a different email.")
                cursor.close()
                return redirect(url_for("createaccount"))
            
            # Check if username already exists
            cursor.execute("SELECT * FROM user WHERE username = %s", (username,))
            if cursor.fetchone():
                flash("Username already exists. Please use a different username.")
                cursor.close()
                return redirect(url_for("createaccount"))

            cursor.execute(
                "INSERT INTO pending_users (first_name, last_name, email, password, birth_date, username, creation_date) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                (
                    first_name,
                    last_name,
                    email,
                    hashed_password,
                    birth_date,
                    username,
                    datetime.now(),
                ),
            )
            mysql.connection.commit()
            cursor.close()

            # Notify the admin about the new user request
            admin_email = "admin@example.com"  # Replace with actual admin email
            subject = "New User Account Request"
            body = f"A new user has requested an account:\n\nName: {first_name} {last_name}\nEmail: {email}\nUsername: {username}\n\nPlease log in to approve or reject this request."
            send_email(subject, admin_email, body)

            # Notify the user about the pending approval
            subject_user = "Account Creation Request Received"
            body_user = f"Hello {first_name},\n\nYour account creation request has been received and is awaiting approval from the admin. You will be notified once your account is approved or rejected."
            send_email(subject_user, email, body_user)

            flash(
                "Account creation request submitted! Please await approval from the admin."
            )
            return redirect(url_for("Login"))
        else:
            flash(
                "Invalid email domain. Please use a Gmail, Yahoo, or TIP.edu.ph email."
            )
            return redirect(url_for("createaccount"))
    return render_template("createaccount.html")


@app.route("/logout", methods=["POST"])
def logout():
    session.pop("email", None)
    flash("You have been logged out", "info")
    return redirect(url_for("Login"))


# MAIN..................................................................................................................................................................................................................................................


@app.route("/dashboard")
def dashboard():
    try:
        if "email" in session:
            cursor = mysql.connection.cursor()
            cursor.execute(
                "SELECT user_id, first_name, last_name, username, profile_picture FROM user WHERE email = %s",
                (session["email"],),
            )
            user = cursor.fetchone()
            cursor.close()

            if user:
                user_id, first_name, last_name, username, profile_picture = user
                username = f"{username}"
                projects = get_user_projects(user_id)

                # Convert profile_picture to base64 if it exists
                profile_picture_url = (
                    "data:image/jpeg;base64," + base64.b64encode(profile_picture).decode('utf-8')
                    if profile_picture else url_for('static', filename='images/blank.jpg')
                )

                return render_template(
                    "dashboard.html",
                    projects=projects,
                    first_name=first_name,
                    last_name=last_name,
                    username=username,
                    profile_picture=profile_picture_url
                )
            else:
                flash("User not found")
                return redirect(url_for("Login"))
        else:
            flash("You need to be logged in to access the dashboard")
            return redirect(url_for("Login"))
    except Exception as e:
        flash(f"An error occurred: {e}")
        return redirect(url_for("Login"))


def get_user_projects(user_id):
    try:
        cursor = mysql.connection.cursor()
        # Get projects where the user is the owner or has been invited
        query = """
            (SELECT p.project_id, p.project_name, p.deadline, p.deadline_time, p.priority
            FROM project p
            WHERE p.user_id = %s)
            UNION
            (SELECT p.project_id, p.project_name, p.deadline, p.deadline_time, p.priority
            FROM project p
            JOIN project_user pu ON p.project_id = pu.project_id
            WHERE pu.user_id = %s)
            ORDER BY deadline, FIELD(priority, 'High', 'Medium', 'Low')
        """
        cursor.execute(query, (user_id, user_id))
        project_tuples = cursor.fetchall()
        cursor.close()

        projects = [
            {
                "project_id": project[0],
                "project_name": project[1],
                "deadline": project[2],
                "deadline_time": project[3],
                "priority": project[4],
            }
            for project in project_tuples
        ]
        return projects
    except Exception as e:
        flash(f"An error occurred while fetching projects: {e}")
        return []
    
@app.route("/homepage/<int:project_id>")
def homepage(project_id):
    if "email" in session:
        try:
            cursor = mysql.connection.cursor()
            cursor.execute(
                "SELECT first_name, last_name, user_id, username, profile_picture FROM user WHERE email = %s",
                (session["email"],),
            )
            user = cursor.fetchone()

            if user:
                first_name, last_name, user_id, username, profile_picture = user
                cursor.execute(
                    """
                    SELECT t.task_id, t.task_name, t.task_desc, t.schedule, t.schedule_time, t.status, t.priority, t.project_id
                    FROM task t
                    JOIN project p ON t.project_id = p.project_id
                    LEFT JOIN project_user pu ON p.project_id = pu.project_id
                    WHERE p.project_id = %s AND (p.user_id = %s OR pu.user_id = %s)
                    ORDER BY FIELD(t.priority, 'High', 'Medium', 'Low'), t.schedule, t.schedule_time
                    """,
                    (project_id, user_id, user_id),
                )
                tasks = cursor.fetchall()

                cursor.execute(
                    "SELECT * FROM project WHERE project_id = %s AND user_id = %s",
                    (project_id, user_id),
                )
                project = cursor.fetchone()
                project_name = project[1] if project else "Unknown Project"

                # Fetch invited members excluding the user who rejected the invitation
                cursor.execute(
                    """
                    SELECT u.first_name, u.last_name, u.username, pu.role
                    FROM user u
                    JOIN project_user pu ON u.user_id = pu.user_id
                    JOIN invitation inv ON inv.invited_user_email = u.email
                    WHERE pu.project_id = %s
                        AND inv.project_id = %s
                        AND inv.invited_user_email != %s
                    """,
                    (project_id, project_id, session["email"]),
                )
                invited_members = cursor.fetchall()
                cursor.close()

                tasks = [
                    {
                        "task_id": task[0],
                        "task_name": task[1],
                        "task_desc": task[2],
                        "schedule": task[3],
                        "schedule_time": task[4],
                        "status": task[5],
                        "priority": task[6],
                        "project_id": task[7],
                    }
                    for task in tasks
                ]

                profile_picture_url = (
                    "data:image/jpeg;base64," + base64.b64encode(profile_picture).decode('utf-8')
                    if profile_picture else url_for('static', filename='images/blank.jpg')
                )

                return render_template(
                    "HomePage.html",
                    tasks=tasks,
                    project_id=project_id,
                    project_name=project_name,
                    first_name=first_name,
                    last_name=last_name,
                    username=username,
                    profile_picture=profile_picture_url,
                    invited_members=invited_members
                )

        except Exception as e:
            flash(f"An error occurred: {e}")

        finally:
            cursor.close()

    flash("You need to be logged in to access the homepage")
    return redirect(url_for("Login"))


# INVITE..................................................................................................................................................................................................................................................


def send_email(subject, recipient, body):
    msg = Message(subject, recipients=[recipient])
    msg.body = body
    try:
        mail.send(msg)
        print("Email sent successfully")
    except Exception as e:
        print("Failed to send email:", e)

@app.route("/send_invitation", methods=["POST"])
def send_invitation():
    try:
        project_id = request.form.get("project_id")
        invited_user_email = request.form.get("invited_user_email")
        role = request.form.get("role")
        message_text = request.form.get("message")
        inviter_email = session.get("email")  # Assuming the inviter is the logged-in user

        cursor = mysql.connection.cursor()
        cursor.execute("SELECT project_name FROM project WHERE project_id = %s", (project_id,))
        project = cursor.fetchone()

        if not project:
            cursor.close()
            return jsonify({"success": False, "message": "Project not found"})

        # Fetch the user ID for the invited user
        cursor.execute("SELECT user_id FROM user WHERE email = %s", (invited_user_email,))
        user = cursor.fetchone()
        if not user:
            cursor.close()
            return jsonify({"success": False, "message": "User not found"})

        user_id = user[0]

        # Check if the user is already in the project
        cursor.execute("SELECT * FROM project_user WHERE project_id = %s AND user_id = %s", (project_id, user_id))
        existing_record = cursor.fetchone()
        if existing_record:
            cursor.close()
            return jsonify({"success": False, "message": "User is already in the project"})

        # Insert the project_user record with the role
        cursor.execute("INSERT INTO project_user (project_id, user_id, role) VALUES (%s, %s, %s)", (project_id, user_id, role))
        mysql.connection.commit()

        # Store invitation details
        cursor.execute("INSERT INTO invitation (project_id, invited_user_email, inviter_email) VALUES (%s, %s, %s)", (project_id, invited_user_email, inviter_email))
        mysql.connection.commit()
        cursor.close()

        project_name = project[0]
        project_link = url_for('homepage', project_id=project_id, _external=True)
        accept_link = url_for('accept_invitation', project_id=project_id, invited_user_email=invited_user_email, _external=True)
        reject_link = url_for('reject_invitation', project_id=project_id, invited_user_email=invited_user_email, _external=True)

        msg = Message(
            "You're Invited!",
            sender="taskmastermanagement2024@gmail.com",
            recipients=[invited_user_email],
        )
        msg.body = f"""You have been invited to the project '{project_name}'.
Your role is {role}.

Message: {message_text}

Please click the link below to view the project. You will need to log in first.
{project_link}

Accept Invitation: {accept_link}
Reject Invitation: {reject_link}
"""

        mail.send(msg)

        response = jsonify({"success": True, "message": "Invitation sent successfully"})
        response.status_code = 200
        return response

    except Exception as e:
        response = jsonify({"success": False, "message": str(e)})
        response.status_code = 500
        return response

@app.route("/accept_invitation")
def accept_invitation():
    project_id = request.args.get("project_id")
    invited_user_email = request.args.get("invited_user_email")

    try:
        cursor = mysql.connection.cursor()

        # Fetch user ID of the invited user
        cursor.execute("SELECT user_id FROM user WHERE email = %s", (invited_user_email,))
        user = cursor.fetchone()
        if not user:
            return "User not found", 404

        user_id = user[0]

        # Check if the project exists
        cursor.execute("SELECT project_id FROM project WHERE project_id = %s", (project_id,))
        project = cursor.fetchone()
        if not project:
            return "Project does not exist", 404

        # Check if the user is already in the project
        cursor.execute("SELECT * FROM project_user WHERE project_id = %s AND user_id = %s", (project_id, user_id))
        existing_record = cursor.fetchone()
        if existing_record:
            # If the user is already in the project, return an appropriate response
            return "Welcome to the project", 409  # Conflict status code for duplicate entry

        # Insert the user into project_user table
        cursor.execute("INSERT INTO project_user (project_id, user_id) VALUES (%s, %s)", (project_id, user_id))
        mysql.connection.commit()

        # Fetch inviter's email
        cursor.execute("SELECT inviter_email FROM invitation WHERE project_id = %s AND invited_user_email = %s", (project_id, invited_user_email))
        invitation = cursor.fetchone()
        if not invitation:
            return "Invitation not found", 404

        inviter_email = invitation[0]
        cursor.close()

        # Notify inviter about acceptance
        msg = Message(
            "Invitation Accepted",
            sender="taskmastermanagement2024@gmail.com",
            recipients=[inviter_email],
        )
        msg.body = f"{invited_user_email} has accepted your invitation to join project {project_id}."

        mail.send(msg)

        return "Invitation accepted. You can now access the project."

    except Exception as e:
        return str(e), 500



@app.route("/reject_invitation")
def reject_invitation():
    project_id = request.args.get("project_id")
    invited_user_email = request.args.get("invited_user_email")

    try:
        cursor = mysql.connection.cursor()

        # Fetch inviter's email
        cursor.execute("SELECT inviter_email FROM invitation WHERE project_id = %s AND invited_user_email = %s", (project_id, invited_user_email))
        invitation = cursor.fetchone()
        if not invitation:
            return "Invitation not found", 404

        inviter_email = invitation[0]

        # Delete the invitation record
        cursor.execute("DELETE FROM invitation WHERE project_id = %s AND invited_user_email = %s", (project_id, invited_user_email))
        mysql.connection.commit()
        cursor.close()

        # Notify inviter
        msg = Message(
            "Invitation Rejected",
            sender="taskmastermanagement2024@gmail.com",
            recipients=[inviter_email],
        )
        msg.body = f"{invited_user_email} has rejected your invitation to join project {project_id}."

        mail.send(msg)

        return "Invitation rejected."

    except Exception as e:
        return str(e), 500

# .....................................................................................................................................................................................................................................................


# User manual
def user_manual_pdf():
    # Assuming your user manual PDF is stored in your static files directory
    filename = "path/to/your/user_manual.pdf"
    return send_file(
        filename, attachment_filename="user_manual.pdf", as_attachment=True
    )


@app.route("/about")
def about():
    if "email" in session:
        cursor = mysql.connection.cursor()
        cursor.execute(
            "SELECT first_name, last_name, username, profile_picture FROM user WHERE email = %s",
            (session["email"],),
        )
        user = cursor.fetchone()
        cursor.close()

        if user:
            first_name, last_name, username, profile_picture = user
            profile_picture_url = (
                "data:image/jpeg;base64," + base64.b64encode(profile_picture).decode('utf-8')
                if profile_picture else url_for('static', filename='images/blank.jpg')
            )
            return render_template(
                "about.html", first_name=first_name, last_name=last_name, username=username, profile_picture=profile_picture_url
            )
    return redirect(url_for("Login"))


@app.route("/help")
def help():
    if "email" in session:
        cursor = mysql.connection.cursor()
        cursor.execute(
            "SELECT first_name, last_name, username, profile_picture FROM user WHERE email = %s",
            (session["email"],),
        )
        user = cursor.fetchone()
        cursor.close()

        if user:
            first_name, last_name, username, profile_picture = user
            # Convert profile_picture to base64 if it exists
            profile_picture_url = (
                "data:image/jpeg;base64," + base64.b64encode(profile_picture).decode('utf-8')
                if profile_picture else url_for('static', filename='images/blank.jpg')
            )

            return render_template(
                "help.html", first_name=first_name, last_name=last_name, username=username, profile_picture=profile_picture_url
            )
    return redirect(url_for("Login"))


# PROFILE..................................................................................................................................................................................................................................................


@app.route("/profile")
def profile():
    if "email" in session:
        cursor = mysql.connection.cursor()
        cursor.execute(
            "SELECT first_name, last_name, email, bio, username, birth_date, profile_picture FROM user WHERE email = %s",
            (session["email"],),
        )
        user = cursor.fetchone()
        cursor.close()

        if user:
            first_name, last_name, email, bio, username, birth_date, profile_picture = user
            profile_picture_url = (
                "data:image/jpeg;base64," + base64.b64encode(profile_picture).decode('utf-8')
                if profile_picture else url_for('static', filename='images/blank.jpg')
            )
            return render_template(
                "profile.html",
                first_name=first_name,
                last_name=last_name,
                email=email,
                bio=bio,
                username=username,
                birth_date=birth_date,
                profile_picture=profile_picture_url,
            )
    return redirect(url_for("Login"))


@app.route("/get_profile_data")
def get_profile_data():
    if "email" in session:
        cursor = mysql.connection.cursor()
        cursor.execute(
            "SELECT first_name, last_name, email, bio, username, birth_date FROM user WHERE email = %s",
            (session["email"],),
        )
        user = cursor.fetchone()
        cursor.close()

        if user:
            first_name, last_name, email, bio, username, birth_date = user
            return jsonify(
                {
                    "success": True,
                    "first_name": first_name,
                    "last_name": last_name,
                    "email": email,
                    "bio": bio,
                    "username": username,
                    "birth_date": birth_date,
                }
            )
    return jsonify({"success": False}), 401


@app.route("/save_profile", methods=["POST"])
def save_profile():
    if "email" in session:
        first_name = request.form.get("first_name")
        last_name = request.form.get("last_name")
        username = request.form.get("username")
        email = request.form.get("email")
        bio = request.form.get("bio")
        birth_date = request.form.get("birth_date")

        # Ensure the birth date is not in the future
        if birth_date > datetime.today().strftime('%Y-%m-%d'):
            return jsonify({"success": False, "error": "Birth date cannot be in the future."}), 400

        cursor = mysql.connection.cursor()

        cursor.execute(
            "UPDATE user SET first_name = %s, last_name = %s, username = %s, email = %s, bio = %s, birth_date = %s WHERE email = %s",
            (first_name, last_name, username, email, bio, birth_date, session["email"]),
        )
        mysql.connection.commit()
        cursor.close()

        session["email"] = email
        return jsonify({"success": True})
    return jsonify({"success": False}), 401


@app.route("/upload_profile_picture", methods=["POST"])
def upload_profile_picture():
    if "email" in session:
        if 'profile-picture' not in request.files:
            return jsonify({"success": False, "message": "No file part"})
        file = request.files['profile-picture']
        if file.filename == '':
            return jsonify({"success": False, "message": "No selected file"})
        if file and allowed_file(file.filename):
            file_data = file.read()

            cursor = mysql.connection.cursor()
            cursor.execute(
                "UPDATE user SET profile_picture = %s WHERE email = %s",
                (file_data, session["email"]),
            )
            mysql.connection.commit()
            cursor.close()

            # Return the base64 encoded profile picture URL
            profile_picture_url = "data:image/jpeg;base64," + base64.b64encode(file_data).decode('utf-8')

            return jsonify({"success": True, "profile_picture_url": profile_picture_url})
    return jsonify({"success": False}), 401

@app.route("/request_email_change", methods=["POST"])
def request_email_change():
    if "email" in session:
        new_email = request.json.get("new_email")
        token = str(uuid.uuid4())
        
        cursor = mysql.connection.cursor()
        cursor.execute(
            "INSERT INTO email_change_requests (user_id, new_email, token, request_time) VALUES ((SELECT id FROM user WHERE email = %s), %s, %s, %s)",
            (session["email"], new_email, token, datetime.now())
        )
        mysql.connection.commit()
        cursor.close()
        
        # Send confirmation email
        confirmation_url = url_for("confirm_email_change", token=token, _external=True)
        msg = Message(
            "Email Change Confirmation",
            recipients=[session["email"]],
            body=f"Please confirm your email change by clicking the link: {confirmation_url}"
        )
        mail.send(msg)
        
        return jsonify({"success": True, "message": "A confirmation email has been sent to your current email address."})
    return jsonify({"success": False}), 401


@app.route("/confirm_email_change/<token>", methods=["GET", "POST"])
def confirm_email_change(token):
    if request.method == "GET":
        return render_template("confirm_email_change.html", token=token)

    if request.method == "POST":
        new_email = request.form.get("new_email")
        cursor = mysql.connection.cursor()
        cursor.execute(
            "SELECT user_id, new_email FROM email_change_requests WHERE token = %s AND request_time >= NOW() - INTERVAL 1 DAY",
            (token,)
        )
        request_data = cursor.fetchone()
        
        if request_data and request_data[1] == new_email:
            user_id, old_email = request_data[0], session["email"]

            cursor.execute(
                "UPDATE user SET email = %s WHERE id = %s",
                (new_email, user_id)
            )
            mysql.connection.commit()
            
            # Send notifications
            msg_old = Message(
                "Email Change Notification",
                recipients=[old_email],
                body="Your email has been changed to: " + new_email
            )
            msg_new = Message(
                "Email Change Confirmation",
                recipients=[new_email],
                body="Your email has been successfully changed."
            )
            mail.send(msg_old)
            mail.send(msg_new)
            
            # Clean up the email change request
            cursor.execute(
                "DELETE FROM email_change_requests WHERE token = %s",
                (token,)
            )
            mysql.connection.commit()
            cursor.close()
            
            session["email"] = new_email
            return redirect(url_for("profile"))
        cursor.close()
        return jsonify({"success": False, "message": "Invalid or expired token."}), 400


# TASK CREATION..................................................................................................................................................................................................................................................


@app.route("/create_task", methods=["POST"])
def create_task():
    if request.method == "POST":
        task_name = request.form["task_name"]
        task_desc = request.form["task_desc"]
        schedule = request.form["schedule"]
        schedule_time = request.form["schedule_time"]
        priority = request.form["priority"]
        project_id = request.form["project_id"]

        try:
            schedule_datetime = datetime.strptime(f"{schedule} {schedule_time}", "%Y-%m-%d %H:%M")
        except ValueError:
            flash("Invalid date/time format. Please use YYYY-MM-DD for date and HH:MM for time.")
            return redirect(url_for("homepage", project_id=project_id))

        if priority not in ["High", "Medium", "Low"]:
            flash("Invalid priority level.")
            return redirect(url_for("homepage", project_id=project_id))

        if "email" in session:
            cursor = mysql.connection.cursor()
            cursor.execute(
                "SELECT user_id FROM user WHERE email = %s", (session["email"],)
            )
            user = cursor.fetchone()
            if user:
                user_id = user[0]
                cursor.execute(
                    "INSERT INTO task (task_name, task_desc, schedule, schedule_time, status, priority, project_id, user_id) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
                    (
                        task_name,
                        task_desc,
                        schedule,
                        schedule_time,
                        "Pending",
                        priority,
                        project_id,
                        user_id,
                    ),
                )
                mysql.connection.commit()
                cursor.close()
                flash("Task created successfully!")
                return redirect(url_for("homepage", project_id=project_id))
            else:
                flash("User not found")
                return redirect(url_for("Login"))
        else:
            flash("User not logged in")
            return redirect(url_for("Login"))


@app.route('/delete_task/<int:task_id>', methods=['POST'])
def delete_task(task_id):
    if "email" in session:  # Ensure user is logged in
        try:
            cursor = mysql.connection.cursor()
            cursor.execute("DELETE FROM task WHERE task_id = %s", (task_id,))
            mysql.connection.commit()
            cursor.close()
            return jsonify({"success": True, "message": "Task deleted successfully!"})
        except Exception as e:
            return jsonify({"success": False, "error_message": str(e)})
    else:
        return jsonify({"success": False, "error_message": "User not logged in."})


@app.route("/update_status/<int:task_id>/<status>", methods=["POST"])
def update_status(task_id, status):
    valid_statuses = ["Pending", "Completed", "In Progress"]  # Define valid statuses
    if status not in valid_statuses:
        flash("Invalid status")
        return redirect(url_for("dashboard"))

    project_id = request.form.get("project_id")
    if not project_id:
        flash("Project ID is missing.")
        return redirect(url_for("dashboard"))

    cursor = mysql.connection.cursor()
    cursor.execute("UPDATE task SET status = %s WHERE task_id = %s", (status, task_id))
    mysql.connection.commit()
    cursor.close()

    return redirect(url_for("homepage", project_id=project_id))


# PROJECT CREATION..................................................................................................................................................................................................................................................


@app.route("/create_project", methods=["POST"])
def create_project():
    if request.method == "POST":
        project_name = request.form["project_name"]
        deadline = request.form["deadline"]
        deadline_time = request.form["deadline_time"]
        priority = request.form["priority"]

        # Check if the deadline is in the past
        deadline_datetime = datetime.strptime(f"{deadline} {deadline_time}", "%Y-%m-%d %H:%M")
        if deadline_datetime <= datetime.now():
            flash("Deadline must be a future date and time.", "error")
            return redirect(url_for("dashboard"))

        if "email" in session:
            cursor = mysql.connection.cursor()
            cursor.execute(
                "SELECT user_id FROM user WHERE email = %s", (session["email"],)
            )
            user = cursor.fetchone()
            if user:
                user_id = user[0]
                cursor.execute(
                    "INSERT INTO project (project_name, deadline, deadline_time, priority, user_id) VALUES (%s, %s, %s, %s, %s)",
                    (project_name, deadline, deadline_time, priority, user_id),
                )
                mysql.connection.commit()
                cursor.close()
                return redirect(url_for("dashboard"))
            else:
                flash("User not found")
                return redirect(url_for("Login"))
        else:
            flash("User not logged in")
            return redirect(url_for("Login"))
    return redirect(url_for("dashboard"))


def save_project_to_db(project):
    cursor = mysql.connection.cursor()
    query = "INSERT INTO project (project_name, deadline, deadline_time) VALUES (%s, %s, %s)"
    cursor.execute(query, project)
    mysql.connection.commit()
    cursor.close()


def get_projects():
    if "email" in session:
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT user_id FROM user WHERE email = %s", (session["email"],))
        user = cursor.fetchone()
        if user:
            user_id = user[0]
            # Order by deadline first, then by priority
            query = """
                SELECT project_id, project_name, deadline, deadline_time, priority 
                FROM project 
                WHERE user_id = %s 
                ORDER BY deadline, FIELD(priority, 'High', 'Medium', 'Low')
            """
            cursor.execute(query, (user_id,))
            project_tuples = cursor.fetchall()
            cursor.close()
            projects = [
                {
                    "project_id": project[0],
                    "project_name": project[1],
                    "deadline": project[2],
                    "deadline_time": project[3],
                    "priority": project[4],
                }
                for project in project_tuples
            ]
            return projects
    return []


@app.route("/edit_project", methods=["POST"])
def edit_project():
    try:
        project_id = request.form.get("edit_project_id")
        project_name = request.form.get("edit_project_name")
        deadline = request.form.get("edit_deadline")
        deadline_time = request.form.get("edit_deadline_time")
        priority = request.form.get("edit_priority")

        # Limit project name to 15 characters and add ellipsis if necessary
        truncated_name = project_name[:15] + ('...' if len(project_name) > 15 else '')

        # Example: Update project in database
        cursor = mysql.connection.cursor()
        cursor.execute(
            "UPDATE project SET project_name = %s, deadline = %s, deadline_time = %s, priority = %s WHERE project_id = %s",
            (truncated_name, deadline, deadline_time, priority, project_id),
        )
        mysql.connection.commit()
        cursor.close()

        response = {
            "success": True,
            "project_id": project_id,
            "project_name": truncated_name,
            "deadline": deadline,
            "deadline_time": deadline_time,
            "priority": priority,
            "message": "Project updated successfully",
        }
    except Exception as e:
        response = {"success": False, "error_message": str(e)}

    return jsonify(response)



@app.route("/delete_project/<int:project_id>", methods=["POST"])
def delete_project(project_id):
    if "email" in session:
        try:
            cursor = mysql.connection.cursor()

            # Delete associated rows from the invitation table first
            cursor.execute("DELETE FROM invitation WHERE project_id = %s", (project_id,))

            # Delete associated rows from project_user table
            cursor.execute("DELETE FROM project_user WHERE project_id = %s", (project_id,))

            # Delete tasks associated with the project
            cursor.execute("DELETE FROM task WHERE project_id = %s", (project_id,))

            # Finally, delete the project itself
            cursor.execute("DELETE FROM project WHERE project_id = %s", (project_id,))

            mysql.connection.commit()
            cursor.close()

            return jsonify({"success": True, "message": "Project and associated tasks deleted successfully!"})
        except Exception as e:
            return jsonify({"success": False, "error_message": str(e)})
    else:
        return jsonify({"success": False, "error_message": "User not logged in."})

# ADMIN..................................................................................................................................................................................................................................................


@app.route("/admin_login", methods=["GET", "POST"])
def admin_login():
    if request.method == "POST":
        username = request.form["fname"]
        password = request.form["password"]

        cursor = mysql.connection.cursor()
        cursor.execute("SELECT * FROM admin WHERE email = %s", (username,))
        admin_user = cursor.fetchone()
        cursor.close()

        if admin_user and check_password_hash(admin_user[4], password):
            session["email"] = admin_user[
                3
            ]  # Use a different session key or variable for admin
            return redirect(url_for("admin"))  # Redirect to admin review page
        else:
            flash("Invalid username or password")
            return redirect(url_for("admin_login"))

    return render_template("admin_login.html")


@app.route("/admin_logout", methods=["POST"])
def admin_logout():
    session.pop("email", None)  # Clear the session
    flash("You have been logged out.")
    return redirect(
        url_for("admin_login")
    )  # Redirect to the admin login page or another page as needed


@app.route("/admin")
def admin():
    if "email" in session:
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT user_id, first_name, last_name, email, is_archived FROM user WHERE is_archived = 0")
        users = cursor.fetchall()
        cursor.close()

        return render_template("admin.html", users=users)
    else:
        flash("You need to be logged in as admin to access this page.")
        return redirect(url_for("admin_login"))


@app.route("/addusers", methods=["GET"])
def addusers():
    if "email" in session:
        cursor = mysql.connection.cursor()
        cursor.execute(
            "SELECT user_id, first_name, last_name, email, username FROM pending_users"
        )
        pending_users = cursor.fetchall()
        cursor.close()
        return render_template("addusers.html", users=pending_users)
    else:
        flash("You need to be logged in as admin to access this page.")
        return redirect(url_for("admin_login"))


@app.route("/archive")
def archive():
    if "email" in session:
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT user_id, first_name, last_name, email, is_archived FROM user WHERE is_archived = 1")
        archived_users = cursor.fetchall()
        cursor.close()
        return render_template("archive.html", users=archived_users)
    else:
        flash("You need to be logged in as admin to view archived users.")
        return redirect(url_for("admin_login"))


@app.route("/get_members", methods=["GET"])
def get_members():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT first_name, last_name, email FROM user")
    members = cursor.fetchall()
    cursor.close()

    members_list = [
        {"first_name": member[0], "last_name": member[1], "email": member[2]}
        for member in members
    ]
    return jsonify(members_list)


@app.route("/get_users", methods=["GET"])
def get_users():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT first_name, last_name, email FROM user")
    users = cursor.fetchall()
    cursor.close()

    users_list = [
        {"first_name": user[0], "last_name": user[1], "email": user[2]}
        for user in users
    ]
    return jsonify(users_list)


@app.route("/approve_user/<int:user_id>", methods=["POST"])
def approve_user(user_id):
    if "email" in session:
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT * FROM pending_users WHERE user_id = %s", (user_id,))
        pending_user = cursor.fetchone()

        if pending_user:
            first_name, last_name, email, hashed_password, birth_date, username, _ = (
                pending_user[1:]
            )

            # Insert into the user table
            cursor.execute(
                "INSERT INTO user (first_name, last_name, email, password, birth_date, username, is_approved) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                (
                    first_name,
                    last_name,
                    email,
                    hashed_password,
                    birth_date,
                    username,
                    True,
                ),
            )

            # Commit the transaction
            mysql.connection.commit()

            # Delete from the pending_user table
            cursor.execute("DELETE FROM pending_users WHERE user_id = %s", (user_id,))
            mysql.connection.commit()

            # Close the cursor
            cursor.close()

            # Notify the user about the approval
            subject = "Account Approved"
            body = f"Hello {first_name},\n\nYour account has been approved! You can now log in to TaskMaster Management."
            send_email(subject, email, body)

            flash("User account approved successfully!")
        else:
            flash("User not found in the pending users list.")

        return redirect(url_for("addusers"))
    else:
        flash("You need to be logged in as admin to approve users.")
        return redirect(url_for("admin_login"))


@app.route("/reject_user/<int:user_id>", methods=["POST"])
def reject_user(user_id):
    if "email" in session:
        cursor = mysql.connection.cursor()
        cursor.execute(
            "SELECT email, first_name FROM pending_users WHERE user_id = %s", (user_id,)
        )
        user = cursor.fetchone()
        if user:
            user_email, user_first_name = user
            cursor.execute("DELETE FROM pending_users WHERE user_id = %s", (user_id,))
            mysql.connection.commit()
            cursor.close()

            # Notify the user about the rejection
            subject = "Account Rejected"
            body = f"Hello {user_first_name},\n\nWe regret to inform you that your account request has been rejected. If you have any questions, please contact us."
            send_email(subject, user_email, body)

            flash("User account rejected and deleted successfully!")
        else:
            flash("User not found in the pending users list.")

        return redirect(url_for("addusers"))
    else:
        flash("You need to be logged in as admin to reject users.")
        return redirect(url_for("admin_login"))


@app.route("/archive_user/<int:user_id>", methods=["POST"])
def archive_user(user_id):
    if "email" in session:
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT * FROM user WHERE user_id = %s", (user_id,))
        user = cursor.fetchone()

        if user:
            # Update the user as archived
            cursor.execute("UPDATE user SET is_archived = 1 WHERE user_id = %s", (user_id,))
            mysql.connection.commit()

            # Close the cursor
            cursor.close()

            # Notify the user about the archiving
            subject = "Account Archived"
            body = f"Hello {user[1]},\n\nYour account has been archived and is no longer valid. If you have any questions, please contact us."
            send_email(subject, user[3], body)

            flash("User account archived successfully!")
        else:
            flash("User not found.")

        return redirect(url_for("admin"))
    else:
        flash("You need to be logged in as admin to archive users.")
        return redirect(url_for("admin_login"))


@app.route("/restore_user/<int:user_id>", methods=["POST"])
def restore_user(user_id):
    if "email" in session:
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT * FROM user WHERE user_id = %s", (user_id,))
        user = cursor.fetchone()

        if user:
            # Update the user as active
            cursor.execute("UPDATE user SET is_archived = 0 WHERE user_id = %s", (user_id,))
            mysql.connection.commit()

            # Close the cursor
            cursor.close()

            # Notify the user about the restoration
            subject = "Account Restored"
            body = f"Hello {user[1]},\n\nYour account has been restored and is now active again. If you have any questions, please contact us."
            send_email(subject, user[3], body)

            flash("User account restored successfully!")
        else:
            flash("Archived user not found.")

        return redirect(url_for("archive"))
    else:
        flash("You need to be logged in as admin to restore users.")
        return redirect(url_for("admin_login"))


@app.route("/delete_archived_user/<int:user_id>", methods=["POST"])
def delete_archived_user(user_id):
    if "email" in session:
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT * FROM user WHERE user_id = %s", (user_id,))
        user = cursor.fetchone()

        if user:
            # Notify the user about the deletion
            subject = "Account Deleted"
            body = f"Hello {user[1]},\n\nYour archived account has been permanently deleted. If you have any questions, please contact us."
            send_email(subject, user[3], body)

            # Delete the user from the user table
            cursor.execute("DELETE FROM user WHERE user_id = %s", (user_id,))
            mysql.connection.commit()

            # Close the cursor
            cursor.close()

            flash("Archived user deleted successfully!")
        else:
            flash("Archived user not found.")

        return redirect(url_for("archive"))
    else:
        flash("You need to be logged in as admin to delete archived users.")
        return redirect(url_for("admin_login"))


# MAINTENANCE..................................................................................................................................................................................................................................................


@app.route("/maintenance", methods=["GET", "POST"])
def maintenance():
    if request.method == "POST":
        action = request.form.get("action")
        if action == "backup":
            backup_file_path = backup_database()
            if backup_file_path:
                flash("Backup created successfully.", "success")
                return send_file(
                    backup_file_path,
                    as_attachment=True,
                    download_name=f"taskmaster_{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.sql",
                )
            else:
                flash("Backup failed!", "danger")
        elif action == "restore":
            file_path = request.form.get("filepath")
            if file_path:
                restore_database(file_path)
                flash("Database restored successfully.", "success")
            else:
                flash("No file path provided for restore.", "danger")
            return redirect(url_for("maintenance"))
        elif action == "reset":
            reset_database()
            flash("Database reset to default successfully.", "success")
            return redirect(url_for("maintenance"))
    return render_template("maintenance.html")


def backup_database():
    try:
        backup_file_path = 'C:\\Users\\Hp\\Documents\\taskmaster.sql'
        command = (
            "mysqldump.exe --host=se-2-pc.cb8gw40scgwo.ap-southeast-1.rds.amazonaws.com "
            "--port=3306 --user=admin --password=betiyag69420 --protocol=tcp "
            "--single-transaction --set-gtid-purged=OFF taskmaster > "
            f"{backup_file_path} 2> C:\\Users\\Hp\\Documents\\backup_error.log"
        )
        subprocess.run(command, shell=True, check=True)
        return backup_file_path
    except subprocess.CalledProcessError as e:
        print(f"Error during database backup: {e}")
        with open("C:\\Users\\Hp\\Documents\\backup_error.log", "r") as error_file:
            print(error_file.read())
        return None


@app.route("/restore", methods=["POST"])
def restore():
    file_path = request.json.get("filepath")
    if file_path:
        restore_database(file_path)
        return jsonify({"message": "Database restored successfully."})
    return jsonify({"message": "File path not provided."}), 400


def restore_database(sql_file_path):
    try:
        # Construct the mysql command to restore the database
        command = (
            f"mysql.exe --host=se-2-pc.cb8gw40scgwo.ap-southeast-1.rds.amazonaws.com "
            f"--port=3306 --user=admin --password=betiyag69420 "
            f"taskmaster < {sql_file_path}"
        )

        # Execute the command
        subprocess.run(command, shell=True, check=True)

    except subprocess.CalledProcessError as e:
        print(f"Error during database restore: {e}")
        return None


def reset_database():
    try:
        connection = mysql.connect(
            host=os.environ["MYSQL_HOST"],
            user=os.environ["MYSQL_USER"],
            password=os.environ["MYSQL_PASSWORD"],
            database=os.environ["MYSQL_DB"],
        )
        cursor = connection.cursor()
        cursor.execute("DROP DATABASE taskmaster")
        cursor.execute("CREATE DATABASE taskmaster")
        connection.commit()
        cursor.close()
        connection.close()
    except mysql.Error as e:
        flash(f"Reset failed! Error: {str(e)}", "danger")


@app.route("/reset", methods=["GET"])
def reset():
    reset_database()
    return jsonify({"message": "Database reset to default successfully."})


if __name__ == "__main__":
    app.run(debug=True)
