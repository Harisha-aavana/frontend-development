from flask import Blueprint, request, jsonify, render_template, url_for, current_app, session
from flask_login import login_required, current_user
from werkzeug.utils import secure_filename
from repos.modules import Task, Document, Project
from sqlalchemy import or_
import os
from datetime import datetime
from repos import db
from repos.users.routes import logout


aavana = Blueprint('aavana', __name__)


@aavana.route('/aavana_home', methods=['POST', 'GET'])
@login_required
def aavana_home():
    print(Task.query.all()[0].task_id)
    if not current_user.is_authenticated or 'PROJECT_IDS' not in session:
        pass
        # logout()

    all_tasks_results = Task.query.all()
    mainTableDataList = []
    headers = ["UID","Entity Name","Location Code","Type of License","State","District","Locality","Assigned Date","License Expiry Date", "Status", "Document Status", "Comment","",""]
    mainTableDataList.append(headers)
    for row in all_tasks_results:
        rowLevelData=[]
        task_id = row.task_id
        document_name = Document.query.filter(Document.task_id == task_id, Document.file_status == 0).all()
        project_name = Project.query.with_entities(Project.project_name).filter_by(id=row.project_id).first()[0]
        entity_name = row.entity_name
        location_code = row.location_code
        type_of_license = row.type_of_licence
        state = row.state
        district = row.district
        locality = row.locality
        assigned_date = row.created_time.strftime('%d/%m/%Y') if row.created_time is not None else ''
        licence_expiry_date = row.licence_expiry_date.strftime('%d/%m/%Y') if row.licence_expiry_date is not None else ''

        status = row.status
        if document_name:
            document_status = "Completed"
        else:
            document_status = "Pending"
        comment = ""

        rowLevelData.append(task_id)
        rowLevelData.append(entity_name)
        rowLevelData.append(location_code)
        rowLevelData.append(type_of_license)
        rowLevelData.append(state)
        rowLevelData.append(district)
        rowLevelData.append(locality)
        rowLevelData.append(assigned_date)
        rowLevelData.append(licence_expiry_date)
        rowLevelData.append(status)
        rowLevelData.append(document_status)
        rowLevelData.append(comment)
        rowLevelData.append("")
        rowLevelData.append("")

        mainTableDataList.append(rowLevelData)

    print(mainTableDataList)




    if request.method == 'POSTT':
        draw = request.form['draw']
        print("Draw")
        print(draw)
        row = int(request.form['start'])
        print("Start")
        print(row)
        row_per_page = int(request.form['length'])
        searchValue = request.form["search[value]"]
        column_search = {}
        column1_search = request.form.get('columns[1][search][value]')
        if column1_search:
            column_search['entity_name'] = column1_search
        column2_search = request.form.get('columns[2][search][value]')
        if column2_search:
            column_search['location_code'] = column2_search
        column3_search = request.form.get('columns[3][search][value]')
        if column3_search:
            column_search['type_of_licence'] = column3_search
        column4_search = request.form.get('columns[4][search][value]')
        if column4_search:
            column_search['state'] = column4_search
        column5_search = request.form.get('columns[5][search][value]')
        if column5_search:
            column_search['district'] = column5_search
        column6_search = request.form.get('columns[6][search][value]')
        if column6_search:
            column_search['locality'] = column6_search
        column7_search = request.form.get('columns[7][search][value]')
        if column7_search:
            column_search['created_time'] = column7_search
        column8_search = request.form.get('columns[8][search][value]')
        if column8_search:
            column_search['licence_expiry_date'] = column8_search
        column9_search = request.form.get('columns[9][search][value]')
        if column9_search:
            column_search['status'] = column9_search
        column10_search = request.form.get('columns[10][search][value]')
        if column10_search:
            column_search['document_status'] = column10_search

        # total number of count without filtering
        total_task_count = Task.query.count()
        # print(Task.query())
        print(total_task_count)

        like_string = '%{}%'.format(searchValue)
        # with filtering query
        filter_query = Task.query.filter(or_(Task.entity_name.ilike(like_string),
                                             Task.status.ilike(like_string),
                                             Task.state.ilike(like_string),
                                             Task.district.ilike(like_string),
                                             Task.type_of_licence.ilike(like_string),
                                             Task.location_code.ilike(like_string),
                                             Task.created_time.ilike(like_string),
                                             Task.licence_expiry_date.ilike(like_string),
                                             Task.locality.ilike(like_string)))

        # total number of count with filtering
        total_recordwith_filter_count = filter_query.count()
        filter_result = filter_query.all()

        # Column-wise filter
        or_conditions = []
        if bool(column_search):
            for column_name, column_search_value in column_search.items():
                filter_condition = getattr(Task, column_name).ilike(f'%{column_search_value}%')
                or_conditions.append(filter_condition)

            filter_column = Task.query.filter(or_(*or_conditions))
            filter_column_result = filter_column.all()

        task_data = []
        if searchValue != '':
            tasks = filter_query.offset(row).limit(row_per_page).all()
            if bool(column_search):
                # Extract the attribute that you want to use for comparison, for example 'task_id'
                task_ids = [task.task_id for task in filter_result]
                filter_task_ids = [task.task_id for task in filter_column_result]

                # Find common task_ids between the two lists
                common_task_ids = list(set(task_ids) & set(filter_task_ids))

                # Filter the original lists to get the common objects
                common_tasks = [task for task in filter_result if task.task_id in common_task_ids]
                total_recordwith_filter_count = len(common_tasks)
                tasks = common_tasks[row:row + row_per_page]
        elif bool(column_search):
            tasks = filter_column.offset(row).limit(row_per_page).all()
            # Extract the attribute that you want to use for comparison, for example 'task_id'
            task_ids = [task.task_id for task in filter_result]
            filter_task_ids = [task.task_id for task in filter_column_result]

            # Find common task_ids between the two lists
            common_task_ids = list(set(task_ids) & set(filter_task_ids))

            # Filter the original lists to get the common objects
            common_tasks = [task for task in filter_result if task.task_id in common_task_ids]
            total_recordwith_filter_count = len(common_tasks)
        else:
            tasks = Task.query.offset(row).limit(row_per_page).all()

        for row in tasks:
            task_id = row.task_id
            document_name = Document.query.filter(Document.task_id == task_id, Document.file_status == 0).all()
            project_name = Project.query.with_entities(Project.project_name).filter_by(id=row.project_id).first()[0]
            cols = f'<div class="button-container" data-container-id="{task_id}" data-custom-field="{row.project_id}">' + \
                   '<div class="button-group">' + \
                   '<button type="button" class="btn btn-primary btn-file">Upload</button>' + \
                   '<input type="file" class="hidden-file-input" style="display: none;" name="filename">' + \
                   '</div>'

            if document_name:
                document_status = '<p><span style="color: green;">Completed</span></p>'
                for doc in document_name:
                    cols += f'<div class="download-cancel-container" id="document-{task_id}-{doc.id}">' + \
                            f'<a href="' + url_for('static', filename='imageupload/' + project_name + '/' + str(
                        task_id) + '/' + doc.file_name) + '" class="btn-sm btn-smaller btn-download" target="_blank">' + doc.file_name + '</a>' + \
                            f'<button type="button" class="btn btn-link cancel-button" onclick="removeDocument(\'{row.task_id}\', \'{doc.id}\')"><i class="bi bi-x-circle cancel-icon"></i></button>' + \
                            '</div>'
            else:
                document_status = '<p><span style="color: red;">Pending</span></p>'

            cols += '</div>' + \
                    '</div>'
            created_time = row.created_time.strftime('%d/%m/%Y') if row.created_time is not None else ''
            licence_expiry_date = row.licence_expiry_date.strftime('%d/%m/%Y') if row.licence_expiry_date is not None else ''

            task_data.append({
                'document': cols,
                'task_id': f'{row.task_id}',
                'entity_name': row.entity_name,
                'status': row.status,
                'state': row.state,
                'district': row.district,
                'type_of_licence': row.type_of_licence,
                'location_code': row.location_code,
                'assigned_date': created_time,
                'licence_expiry_date': licence_expiry_date,
                'locality': row.locality,
                'document_status': document_status,
            })

            # print("Task Data")
            # print(task_data)

        response = {
                'draw': draw,
                'iTotalRecords': total_task_count,
                'iTotalDisplayRecords': total_recordwith_filter_count,
                'aaData': task_data,
            }
        
        
        return jsonify(response)

    return render_template('aavana_home_v2.html')


@aavana.route('/upload', methods=['POST'])
def upload_file():
    try:
        try:
            if 'file' not in request.files:
                return jsonify({"error": "No file part"}), 400

            file = request.files['file']
            task_id = request.form['task_id']
            project_id = request.form['project_id']
            if file.filename == '':
                return jsonify({"error": "No selected file"}), 400

            document_data = {}
            document_data['task_id'] = task_id
            UPLOAD_FOLDER = current_app.config.get('UPLOAD_FOLDER')
            project_name = Project.query.with_entities(Project.project_name).filter_by(id=project_id).first()[0]
            document_data['project_name'] = project_name
            project_dir = os.path.join(UPLOAD_FOLDER, project_name)
            os.makedirs(project_dir, exist_ok=True)
            task_dir = os.path.join(project_dir, task_id)
            os.makedirs(task_dir, exist_ok=True)
            filename = secure_filename(file.filename)
            document_data['filename'] = file.filename
            file_path = os.path.join(task_dir, filename)
            document_data['file_path'] = file_path[5:]

            file.save(file_path)

            document_info = Document(file_name=filename, task_id=task_id)
            db.session.add(document_info)
            db.session.flush()
            db.session.commit()

            saved_document_id = document_info.id
            document_data['saved_document_id'] = saved_document_id
            document_data['message'] = "File uploaded successfully"
            return jsonify(document_data), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

        return jsonify({"message": "File uploaded successfully"}), 200
    except Exception as e:
        return f'Error: {str(e)}'


@aavana.route('/delete_document', methods=['POST'])
def delete_document():
    document_to_update = Document.query.get(request.form['docId'])

    if document_to_update:
        # Update the file_status
        document_to_update.file_status = 1

        # Commit the changes to the database
        db.session.commit()

        # Optionally, you can return a response indicating success
        response = {"message": "File status updated successfully"}
    else:
        # Handle the case where the document with the given ID does not exist
        response = {"error": "Document not found"}

    return jsonify(response)

