import datetime
from flask import Blueprint, request, jsonify, render_template, url_for, current_app, session
from flask_login import login_required, current_user
from werkzeug.utils import secure_filename
from repos.modules import Task, Document, Project, Log, Files, Comments
from sqlalchemy import join
from sqlalchemy.orm import joinedload
import os
from repos import db
from repos.users.routes import logout

aavana = Blueprint('aavana', __name__)


@aavana.route('/aavana_home', methods=['POST', 'GET'])
@login_required
def aavana_home():
    if not current_user.is_authenticated or 'PROJECT_IDS' not in session:
        logout()

    if request.method == 'POST':
        all_tasks_results = Task.query.all()
        mainTableDataList = []
        headers = ["UID", "Entity Name", "Location Code", "Type of License", "State", "District", "Locality",
                   "Project_ID", "Assigned Date", "License Expiry Date", "Status", "Document Status"]
        mainTableDataList.append(headers)
        for row in all_tasks_results:
            rowLevelData = []
            task_id = f'{row.task_id}'
            document_name = Document.query.filter(Document.task_id == task_id, Document.file_status == 0).all()
            project_name = Project.query.with_entities(Project.project_name).filter_by(id=row.project_id).first()[0]
            entity_name = row.entity_name
            location_code = row.location_code
            type_of_license = row.type_of_licence
            state = row.state
            district = row.district
            locality = row.locality
            project_id = f'{row.project_id}'
            assigned_date = row.created_time.strftime('%d/%m/%Y') if row.created_time is not None else ''
            licence_expiry_date = row.licence_expiry_date.strftime(
                '%d/%m/%Y') if row.licence_expiry_date is not None else ''

            status = row.status
            if document_name:
                document_status = "Completed"
            else:
                document_status = "Pending"

            rowLevelData.append(task_id)
            rowLevelData.append(entity_name)
            rowLevelData.append(location_code)
            rowLevelData.append(type_of_license)
            rowLevelData.append(state)
            rowLevelData.append(district)
            rowLevelData.append(locality)
            rowLevelData.append(project_id)
            rowLevelData.append(assigned_date)
            rowLevelData.append(licence_expiry_date)
            rowLevelData.append(status)
            rowLevelData.append(document_status)

            mainTableDataList.append(rowLevelData)

        response = {
            'dataArray': mainTableDataList,
        }

        return jsonify(response)

    return render_template('aavana_home.html')


@aavana.route('/upload', methods=['POST'])
def upload():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400

        file = request.files['file']
        task_id = request.form['task_id']
        project_id = request.form['project_id']
        file_id = request.form['file_id']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
        document_data = {}
        document_data['task_id'] = task_id
        upload_folder = current_app.config.get('UPLOAD_FOLDER')
        project_name = Project.query.with_entities(Project.project_name).filter_by(id=project_id).first()[0]
        document_data['project_name'] = project_name
        project_dir = os.path.join(upload_folder, project_name)
        os.makedirs(project_dir, exist_ok=True)
        task_dir = os.path.join(project_dir, task_id)
        os.makedirs(task_dir, exist_ok=True)
        filename = secure_filename(file.filename)
        document_data['filename'] = file.filename
        file_path = os.path.join(task_dir, filename)
        document_data['file_path'] = file_path[5:]
        file.save(file_path)

        document_info = Document(file_name=filename, task_id=task_id, file_id=file_id)
        db.session.add(document_info)
        db.session.flush()
        saved_document_id = document_info.id
        document_data['saved_document_id'] = saved_document_id
        document_data['message'] = "File uploaded successfully"
        message = f'Document inserted - doc id {saved_document_id}'
        log_info = Log(action=message, table_name='document', user_id=current_user.id,
                       action_time=datetime.datetime.now())
        db.session.add(log_info)
        db.session.commit()
        return jsonify(document_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify({"message": "File uploaded successfully"}), 200


@aavana.route('/delete_document', methods=['POST'])
def delete_document():
    document_to_update = Document.query.get(request.form['docId'])
    if document_to_update:
        # Update the file_status
        document_to_update.file_status = 1

        message = f'Document deleted - doc id {document_to_update.id}'
        log_info = Log(action=message, table_name='document', user_id=current_user.id,
                       action_time=datetime.datetime.now())
        db.session.add(log_info)
        # Commit the changes to the database
        db.session.commit()
        db.session.close()

        # Optionally, you can return a response indicating success
        response = {"message": "File status updated successfully"}
    else:
        # Handle the case where the document with the given ID does not exist
        response = {"error": "Document not found"}

    return jsonify(response)


@aavana.route('/file_type', methods=['GET'])
def file_type():
    file_names = Files.query.filter_by(filename_status=0).all()
    file_info = {}
    for file in file_names:
        file_info[file.id] = file.filename

    return jsonify(file_info)


@aavana.route('/add_comment', methods=['POST', 'GET'])
@login_required
def add_comment():
    if request.method == 'POST':
        task_id = request.form.get('task_id')
        description = request.form.get('comment')
        type = request.form.get('comment_type')
        current_date = datetime.datetime.now()
        try:
            message = f'Comment added to task id {task_id}'
            comments = Comments(comment=description, comment_type=type, task_id=task_id, created_date=current_date,
                                modified_date='', comment_status=0)
            log_info = Log(action=message, table_name='comment', user_id=current_user.id,
                           action_time=current_date)
            db.session.add(comments)
            db.session.add(log_info)
            db.session.commit()
            return {"message": "Comment Added Successfully."}
        except Exception as e:
            # Handle exceptions or errors here
            db.session.rollback()
            return "An error occurred: " + str(e)

    return {'message': 'Invalid request method'}


@aavana.route('/edit_comment', methods=['POST', 'GET'])
@login_required
def edit_comment():
    if request.method == 'POST':
        comment_id = request.form.get('id')
        task_id = request.form.get('task_id')
        updated_comment = request.form.get('comment')
        type = request.form.get('comment_type')
        modified_date = datetime.datetime.now()
        try:
            comment_update = Comments.query.get(comment_id)
            comment_update.comment = updated_comment
            comment_update.comment_type = type
            comment_update.modified_date = modified_date
            message = f'Comment edited. task id {task_id}'
            log_info = Log(action=message, table_name='comment', user_id=current_user.id,
                           action_time=modified_date)
            db.session.add(log_info)
            db.session.commit()
            return {"message": "Comment Added Successfully."}
        except Exception as e:
            # Handle exceptions or errors here
            db.session.rollback()
            return "An error occurred: " + str(e)

    return {'message': 'Invalid request method'}


@aavana.route('/getCommentsHistory', methods=['POST'])
@login_required
def getCommentsHistory():
    if request.method == 'POST':
        task_id = request.form.get('task_id')
        try:
            comments_data = Comments.query.filter(Comments.task_id == task_id).order_by(Comments.created_date.desc()).all()
            data = []
            for comment in comments_data:
                comment_id = comment.comment_id
                comment_details = comment.comment
                commented_date = comment.created_date.strftime('%d/%m/%Y')
                type = comment.comment_type
                comment = [comment_id, commented_date, comment_details, type]
                data.append(comment)

            return jsonify(data)

        except Exception as e:
            return "An error occurred: " + str(e)

    return {'message': 'Invalid request method'}


@aavana.route('/getUploadedDocument', methods=['POST'])
def getUploadedDocument():
    if request.method == 'POST':
        task_id = request.form['task_id']
        try:
            doc_data = Document.query.with_entities(Document.id, Document.file_id, Document.file_name, Document.task_id, Project.id, Project.project_name, Files.id, Files.filename).join(Task, Document.task_id == Task.task_id).join(Project, Task.project_id == Project.id, isouter=True).join(Files, Files.id == Document.file_id).filter(Document.task_id == task_id, Document.file_status == 0).all()
            data = []
            for document in doc_data:
                document_info = {}
                document_info['doc_id'] = document[0]
                document_info['file_id'] = document[1]
                document_info['file_name'] = document[2]
                document_info['task_id'] = document[3]
                document_info['project_id'] = document[4]
                document_info['project_name'] = document[5]
                document_info['category_id'] = document[6]
                document_info['Category_type'] = document[7]
                data.append(document_info)
            return jsonify(data)

        except Exception as e:
            return "An error occurred: " + str(e)

    return {'message': 'Invalid request method'}



