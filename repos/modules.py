from repos import db, login_manager
from datetime import datetime
from flask_login import UserMixin


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)


class Project(db.Model):
    # __table__ = 'project'
    id = db.Column(db.BigInteger, primary_key=True)
    project_name = db.Column(db.String(60), unique=True, nullable=False)
    parent_project_name = db.Column(db.String(30), nullable=False)
    status = db.Column(db.String(10))
    bug_prefix = db.Column(db.String(12))
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)
    budget_amount = db.Column(db.Float)
    budget_hours = db.Column(db.Time)
    created_time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    last_modified_time = db.Column(db.DateTime)
    client_project_id = db.Column(db.BigInteger)
    owner_id = db.Column(db.BigInteger, nullable=False)
    group_id = db.Column(db.BigInteger)
    description = db.Column(db.String(600))
    currency = db.Column(db.String(60))
    currency_id = db.Column(db.Integer)
    is_archived = db.Column(db.String(20))
    billing_method = db.Column(db.String(120))
    project_budget = db.Column(db.String(120))
    Completed_on = db.Column(db.DateTime)
    layout_id = db.Column(db.BigInteger)
    fixed_cost = db.Column(db.String(120))
    track_budget = db.Column(db.String(120))
    budget_threshold = db.Column(db.String(120))
    task_prefix = db.Column(db.String(30))
    tags = db.Column(db.String(120))
    rate_per_id = db.Column(db.Integer)
    primary_client_id = db.Column(db.BigInteger)
    is_completed = db.Column(db.String(12))
    created_by = db.Column(db.String(20))
    modified_by = db.Column(db.String(20))
    created_by_id = db.Column(db.BigInteger)
    modified_by_id = db.Column(db.BigInteger)

    def __repr__(self):
        return f"Project('{self.id}', '{self.project_name}', '{self.status}', '{self.owner_id}', '{self.start_date}')," \
               f"'{self.created_by_id}'"


class Task(db.Model):
    # __tablename__ = 'task'
    task_id = db.Column(db.BigInteger, primary_key=True)
    task_name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.String(1200))
    priority = db.Column(db.String(10))
    due_date = db.Column(db.DateTime)
    created_time = db.Column(db.DateTime)
    last_modified_time = db.Column(db.DateTime)
    completion_time = db.Column(db.DateTime)
    start_date = db.Column(db.DateTime)
    duration = db.Column(db.Integer)
    status = db.Column(db.String(40))
    client_status = db.Column(db.String(40))
    is_overdue = db.Column(db.String(5))
    completion_percentage = db.Column(db.String(5))
    key = db.Column(db.Integer)
    project_id = db.Column(db.BigInteger, db.ForeignKey('project.id'), nullable=False)
    milestone_id = db.Column(db.BigInteger)
    tasklist_id = db.Column(db.BigInteger)
    root_task_id = db.Column(db.BigInteger)
    parent_task_id = db.Column(db.BigInteger)
    created_by_id = db.Column(db.BigInteger)
    owner_ids = db.Column(db.String(50))
    task_delay_time = db.Column(db.Float)
    task_completion_mode = db.Column(db.String(10))
    actual_time_taken = db.Column(db.Float)
    time_spend_so_far = db.Column(db.Float)
    duration_1 = db.Column(db.Float)
    duration_unit = db.Column(db.String(20))
    rate_per_hour = db.Column(db.String(20))
    billing_type = db.Column(db.String(20))
    budget = db.Column(db.String(15))
    threshold = db.Column(db.String(15))
    tags = db.Column(db.BigInteger)
    tasklist_name = db.Column(db.String(15))
    parent_task_name = db.Column(db.String(25))
    dependency_status = db.Column(db.String(25))
    cost_per_hour = db.Column(db.Integer)
    revenue_budget = db.Column(db.Integer)
    rc_received_date = db.Column(db.DateTime)
    entity_name = db.Column(db.String(300))
    source_of_lead = db.Column(db.String(20))
    other_office_expenses = db.Column(db.Integer)
    application_number = db.Column(db.Integer)
    mode_of_payment = db.Column(db.String(10))
    licence_expiry_date = db.Column(db.DateTime)
    govt_fees = db.Column(db.Integer)
    application_rejected_date = db.Column(db.DateTime)
    company_name = db.Column(db.String(100))
    authority_number = db.Column(db.Integer)
    authority_name = db.Column(db.String(25))
    spoc_number = db.Column(db.Integer)
    spoc_name = db.Column(db.String(25))
    spoc_charges = db.Column(db.Integer)
    portal_url = db.Column(db.String(200))
    state = db.Column(db.String(25))
    district = db.Column(db.String(200))
    other_expenses = db.Column(db.Integer)
    licence_category = db.Column(db.String(10))
    type_of_licence = db.Column(db.String(200))
    location_code = db.Column(db.String(200))
    address = db.Column(db.String(1200))
    locality = db.Column(db.String(200))
    application_applied_date = db.Column(db.DateTime)
    original_rc_with = db.Column(db.String(60))
    region = db.Column(db.String(10))
    associated_teams = db.Column(db.String(100))
    mode_of_application = db.Column(db.String(10))
    user_id = db.Column(db.BigInteger)
    docs_checklist_client = db.Column(db.String(5))
    SLA_TAT = db.Column(db.DateTime)
    finance_approved_date = db.Column(db.DateTime)
    travel_charges = db.Column(db.Integer)
    misc_charges = db.Column(db.Integer)
    document_status = db.Column(db.String(10))


class User(db.Model, UserMixin):
    # __tablename__ = 'user'
    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    useremail = db.Column(db.String(60), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    project_name = db.Column(db.String(30), nullable=False)
    user_status = db.Column(db.Integer, nullable=False, default=0)

    def __init__(self, useremail, password, project_id, project_name, user_status):
        self.useremail = useremail
        self.password = password
        self.project_id = project_id
        self.project_name = project_name
        self.user_status = user_status


    def __repr__(self):
        return f"User('{self.id}', '{self.useremail}', '{self.password}', '{self.project_id}', '{self.user_status}'"


class Files(db.Model):
    # __tablename__ = 'files'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    filename = db.Column(db.String(20))
    file_extension = db.Column(db.String(10))
    filename_status = db.Column(db.Integer, nullable=False, default=0)

    def __init__(self, filename, file_extension, filename_status=0):
        self.filename = filename
        self.file_extension = file_extension
        self.filename_status = filename_status

    def __repr__(self):
        return f"Files('{self.id}', '{self.filename}', '{self.file_extension}', '{self.filename_status}'"


class Document(db.Model):
    # __tablename__ = 'document'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    file_name = db.Column(db.String(50))
    task_id = db.Column(db.BigInteger, db.ForeignKey('task.task_id'), nullable=False)
    file_status = db.Column(db.Integer, nullable=False, default=0)

    def __init__(self, file_name, task_id, file_status=0):
        self.file_name = file_name
        self.task_id = task_id
        self.file_status = file_status

    def __repr__(self):
        return f"Document('{self.id}', '{self.file_name}', '{self.task_id}', '{self.file_status}'"


class Log(db.Model):
    # __tablename__ = 'log'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    action = db.Column(db.String(120))
    table_name = db.Column(db.String(25))
    user_id = db.Column(db.BigInteger, db.ForeignKey('user.id'), nullable=False)
    action_time = db.Column(db.DateTime)

    def __init__(self, user_id, action, table_name, action_time):
        self.user_id = user_id
        self.action = action
        self.table_name = table_name
        self.action_time = action_time

    def __repr__(self):
        return f"Log('{self.id}', '{self.user_id}', '{self.action}', '{self.table_name}', '{self.action_time}'"


class Comments(db.Model):
    # __tablename__ = 'comments'
    comment_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    comment = db.Column(db.String(1200))
    comment_type = db.Column(db.String(10))
    task_id = db.Column(db.Integer, db.ForeignKey('task.task_id'), nullable=False)
    created_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    modified_date = db.Column(db.DateTime)
    comment_status = db.Column(db.Integer, nullable=False, default=0)

    def __init__(self, comment, comment_type, task_id, created_date, modified_date, comment_status):
        self.comment = comment
        self.comment_type = comment_type
        self.task_id = task_id
        self.comment_status = comment_status
        self.created_date = created_date
        self.modified_date = modified_date

    def __repr__(self):
        return f"Comments('{self.comment_id}', '{self.comment}', '{self.comment_type}', '{self.task_id}', '{self.created_date}, '{self.modified_date}, '{self.comment_status}'"

