export const ApplicationConstants = {
    SELECT_ALL: 'Select All',
    MIN_LENGTH_USERNAME: 6,
    MAX_LENGTH_USERNAME: 20,
    PATTERN_REQUIRED_CHARS_IN_USERNAME:
        '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',

    MIN_LENGTH_PASSWORD: 12,
    MAX_LENGTH_PASSWORD: 15, // Not in use
    PATTERN_REQUIRED_CHARS_IN_PASSWORD:
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*. ]{8,}$',
    DISALLOWED_CHARS_IN_PASSWORD: [' ', '#', '(', ')', '-', '_', '+', '{', '}'], // Currently not in use.
    SCREEN_SIZE_SM: 576,
    PATTERN_REQUIRED_CHARS_IN_NAME: '^(?=.*[a-zA-Z])[a-zA-Z \\-_]+$',
    PATTERN_REQUIRED_CHARS_IN_LOCATION:
        '^(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*. \\-_]+$',

    PATTERN_PHONE_NUMBER: '^\\+[1-9]{1}[0-9]{1,2}[0-9]{10,14}$',
    PATTERN_ALLOW_OTHER_THAN_SPACE: /^(?!\s+$).+/,

    SAMPLE_TRACKING_SYSTEM_ID: '01234556-89AB-1DEF-8123-456789ABCDEF',
    FORM_TYPE_ID: '01234556-89AB-1DEF-8123-456789ABCDEF',

    // Notification constants
    SYSTEM_NOTIFICATION_FETCHING_FREQUENCY: 30000, // 30 second
    NUMBER_OF_TOP_SYSTEM_NOTIFICATIONS_TO_SHOW: 5,

    GLOBAL_NUMERIC_DATE_FORMAT: 'dd/MM/yyyy', // 22/12/2024
    GLOBAL_DATE_FORMAT: 'dd-MMM-yyyy', // 22-Dec-2024
    GLOBAL_DATE_TIME_FORMAT_WITH_MINUTES: 'dd-MMM-yyyy HH:mm', // 02-Dec-2024 13:59
    GLOBAL_DATE_TIME_FORMAT: 'dd-MMM-yyyy HH:mm:ss', // 02 Dec 2024 13:59:59

    REGEX_DASH_DOT_UNDERSCORE_WITH_SPACE: /(?<=[a-zA-Z0-9])[-_.](?=[a-zA-Z0-9])/g, // Replace dash, dot, underscore with space
    REGEX_CAPITALIZE_FIRST_LETTER: /\b\w/g, // Capitalize first letter of every word

};

export const ButtonLabels = {
    BTN_SAVE_AS_DRAFT: 'Save',
    BTN_SAVE_AND_PROCEED: 'Save and Proceed',
    BTN_CANCEL: 'Cancel',
    BTN_SUBMIT: 'Submit',
    BTN_PREVIOUS: 'Previous',
};

export const TestingResultNode = {
    SAMPLE: 'Sample',
    TEST: 'Test',
    RESULT: 'Result',
};

export const ApplicationTableConstants = {
    DEFAULT_RECORDS_PER_PAGE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 15, 20, 50, 100, 'Select All'],
};

export const ToasterConfigs = {
    TIMEOUT: 3000, // MS
};

export const LoaderConfigs = {
    TIMEOUT: 3000, // MS
};

export const NavigationURLs = {
    LOGIN: '/login',
    ERROR_PAGE: '/home/unauthorised',
    UNAUTHORIZED_PAGE: '/unauthorised',
    LOGOUT: '/logout',
    CUSTOMER_LIST: '/home/customer',
    ROLE_MODULE_MAPPING: '/home/role-module-mapping',
    PROGRAMS: '/home/program',
    HOME: '/home',
    DAY_LIST: '/home/day',
    HOME_PROJECTS: '/home/projects',
    FORGOT_PASSWORD: '/forgot-password',
    USER_LIST: '/home/manage-users',
    USER_PROFILE: '/home/user-profile',
    CHANGE_PASSWORD: '/home/change-password',
    NAV_CHAT_PANEL: '/home/nav-chat-panel',
    EXPENSE_LIST: '/home/expense',
    ACTIVE_PROJECT_LIST: '/home/expenses/projects/project',
    PROJECT_LIST: '/home/projects/project',
    INTERNAL_PROJECT_LIST: '/home/internalproject',
    ACTIVE_INTERNAL_PROJECT_LIST: '/home/expenses/projects/internalproject',
    REPORT_LIST: '/home/expenses/reports',
    SAMPLE_FORM_LIST: '/home/expenses/projects/forms',
    SAMPLE_SUBMISSION_FORM: '/home/expenses/projects/form-home',
    SAMPLE_SUBMISSION_FORM_STEPS: '/home/sample-submission',
    DOCUMENT_LIST: '/home/expenses/projects/document',
    TESTING_AND_RESULTS: '/home/expenses/projects/testing-and-results',
    PROJECT_USER: '/home/expenses/projects/project-user',
    ALL_NOTIFICATIONS: '/home/notifications',
    REPORT: '/home/expenses/projects/report',
};

export const SampleSubmissionFormNotes = {
    SECTION_A_RUSH: 'The turnaround time chosen here should align with what was agreed upon in the signed agreement, as the timeline in the agreement will be followed. If a different turnaround time is required, please contact your program manager.',
    SECTION_A_STAT: 'The turnaround time chosen here should align with what was agreed upon in the signed agreement, as the timeline in the agreement will be followed. If a different turnaround time is required, please contact your program manager.',
    SECTION_A_RETURN: 'Extra charges may apply-please provide courier name and account no. for returns. charges apply.',
    SECTION_B_INFECTIOUS_AGENTS_YES: 'Please Provide All Applicable Testing Results. If None are Available. Please Contact CBM Prior To Sending Samples.',
    SECTION_C_TEMPLATE_TO_BE_RETURNED: 'Extra charges may apply – please provide your courier acc. # for returns.',
    SECTION_C_RETURN_SHIPPING_CONTAINER: 'Extra charges may apply – please provide your courier acc. # for returns.',
    SECTION_D_EXPENSE_SAMPLE_ID: 'Will Appear on the Testing Certificate as entered.',
    SECTION_D_SAMPLE_DESCRIPTION: 'Will Appear on the Testing Certificate as entered.',
    SECTION_D_SAMPLE_LOT_NO: 'Will Appear on the Testing Certificate as entered.',
    SECTION_E_I_AGREE_PRE_CONTENTS: 'This Sample Submission Form Must Accompany Each Submitted Sample And Acts As An Official Record For The Testing Services Being Performed By SK pharmteco With Respect To The Sample Or Samples Listed Herein. Failure To Provide Timely And Complete Information Could Result In Testing Delays Or Other Issues, For Which SK pharmteco Shall Not Be Liable. Services Requested In This Form Shall Be Governed In Accordance With SK pharmteco’s Terms And Conditions. To The Extent SK pharmteco’s Terms And Conditions Are In Conflict With An Applicable Agreement (Agreement) Between Customer Listed In This Form And SK pharmteco, Such Agreement Will Govern.'
};

export const Messages = {
    OPERATION_SUCCESS: 'Operation was successful.',
    OPERATION_FAILED: 'Operation failed.',
    REDIRECTING_TO_LOGIN: 'Logged out redirecting to login page.',
    WRONG_PASSWORD: 'Password is wrong.',
    INVALID_CREDENTIALS: 'Invalid user name or password.',
    WRONG_EMAIL: 'Email is wrong.',
    ERROR_IN_FETCH_USER: 'Error in fetching users.',
    ERROR_IN_FETCHING_ROLES: 'Error in fetching roles.',
    ERROR_IN_FETCHING_USER_PROFILE: 'Error in fetching user profile.',
    CUSTOMERS_FETCHED_SUCCESS: 'customers fetched successfully.',
    ERROR_IN_FETCH_CUSTOMER: 'Error in fetching customers.',
    EXPENSES_FETCHED_SUCCESS: 'EXPENSES fetched successfully.',
    EXPENSE_ADDED_SUCCESS: 'Expense details added successfully.',
    EXPENSE_UPDATED_SUCCESS: 'Expense details updated successfully.',
    ERROR_IN_FETCH_EXPENSE: 'Unable to load expense data. Please try again later.',
    ERROR_IN_FETCH_ROLE_MODULE_MAPPINGS: 'Error fetching role-module-mappings',

    ERROR_IN_FETCH_PROGRAM: 'Error fetching programs',

    USER_SAVED: 'User registered successfully.',
    USER_SAVED_FAILED: 'Failed to registered user.',

    FEEDBACK_ADDED: 'Feedback added successfully.',
    FEEDBACK_UPDATED: 'Feedback updated successfully.',
    FEEDBACK_DELETED: 'Feedback deleted successfully.',
    ERROR_IN_FEEDBACK_ADD: 'Error occuered in adding feedback.',
    ERROR_IN_FEEDBACK_UPDATE: 'Error occuered in updating feedback.',
    ERROR_IN_FEEDBACK_DELETE: 'Error occuered in deleting feedback.',

    FEEDBACK_REPLY_ADDED: 'Reply added successfully.',
    FEEDBACK_REPLY_UPDATED: 'Reply updated successfully.',
    FEEDBACK_REPLY_DELETED: 'Reply deleted successfully.',

    CHAT_DELETE_CONFIRMATION: 'Are you sure you want to delete chat between',
    ROLE_MODULE_MAPPING_UPDATED_SUCCESSFULLY:
        'Role-Module-Mapping updated successfully',

    EMAIL_VALIDATION_MSG: 'Please enter a valid email address.',

    PASSWORD_MUST_INCLUDE_MSG:
        'Password must include at least one digit, one uppercase letter, one lowercase letter, and one special character(!@#$%^&*).',
    PASSWORD_MUST_NOT_INCLUDE_MSG: 'Password must not contain user\'s firstname or lastname.',

    PASSWORD_RESET_LINK_SENT_MSG:
        'If the email is registered, a link has been sent to the provided email address.',
    PASSWORD_LENGTH_MSG: 'Password must be minimum {0} characters long.',
    OLD_NEW_PASSWORD_SAME: 'Current password and new password cannot be the same.',

    PASSWORD_RESET_SUCCESSFULLY: 'Password reset successfully.',
    PASSWORD_CREATED_SUCCESSFULLY: 'Password created successfully.',
    PASSWORD_CREATION_FAILED: 'Password creation failed.',
    PASSWORD_RESET_FAILED: 'Password reset failed.',

    EXPENSE_NAME_VALIDATION_MSG: 'Name should contain only alphabetic characters.',
    ERROR_IN_FETCH_EXPENSE_DATA: 'Error fetching expense data',
    LOCATION_VALIDATION_MSG: 'Please enter a valid location.',
    UNABLE_TO_LOAD_THE_DATA: 'Unable to load the data. Please try again later.',

    NAME_VALIDATION_MSG:
        'Name can only contain alphabetic characters, underscores (_), hyphens (-), and spaces.',

    UNABLE_TO_LOAD_EXPENSES: 'Unable to load expense list',

    PROJECTS_FETCHED_SUCCESS: 'Projects fetched successfully.',
    PROJECT_ADDED_SUCCESS: 'Project details added successfully.',
    PROJECT_UPDATED_SUCCESS: 'Project details updated successfully.',
    ERROR_IN_PROJECT_REMOVE: 'Error in removing project.',

    ERROR_IN_FETCH_PROJECT:
        'Unable to load project data. Please try again later.',
    PROJECT_USER_ADDED_SUCCESS: 'User added successfully.',
    ERROR_IN_PROJECT_USER_ADD: 'Error in adding project user.',
    PROJECT_USER_REMOVED_SUCCESS: 'User removed from the project successfully.',
    ERROR_IN_PROJECT_USER_REMOVE: 'Error in removing project user.',

    PROJECT_NAME_VALIDATION_MSG:
        'Project Name can only contain alphabetic characters, underscores (_), hyphens (-), and spaces.',
    ERROR_IN_FETCH_PROJECT_DATA: 'Error fetching project data',
    ERROR_IN_LOAD_PROJECTS: 'Unable to load project list',
    DATE_DISMATCHED:
        'End Date should be greater than or equal to the Start Date.',
    REQUIRED_MSG: 'This Field is required.',

    INVALID_DATE_FORMAT_MSG: 'Date format is invalid.',
    INVALID_DATE_RANGE_MSG: 'Selected Date is invalid.',

    DOCUMENTS_FETCHED_SUCCESS: 'Documents fetched successfully.',
    DOCUMENT_ADDED_SUCCESS: 'Document details added successfully.',
    DOCUMENT_UPDATED_SUCCESS: 'Document details updated successfully.',
    ERROR_IN_FETCH_DOCUMENT:
        'Unable to load document data. Please try again later.',

    DOCUMENT_NAME_VALIDATION_MSG:
        'Document Name can only contain alphabetic characters, underscores (_), hyphens (-), and spaces.',
    ERROR_IN_FETCH_DOCUMENT_DATA: 'Error fetching document data',
    ERROR_IN_LOAD_DOCUMENTS: 'Unable to load document list',

    REPORTS_FETCHED_SUCCESS: 'Reports fetched successfully.',
    REPORT_ADDED_SUCCESS: 'Report details added successfully.',
    REPORT_UPDATED_SUCCESS: 'Report details updated successfully.',
    ERROR_IN_FETCH_REPORT: 'Unable to load report data. Please try again later.',

    REPORT_NAME_VALIDATION_MSG:
        'Report Name can only contain alphabetic characters, underscores (_), hyphens (-), and spaces.',
    ERROR_IN_FETCH_REPORT_DATA: 'Error fetching report data',
    ERROR_IN_LOAD_REPORTS: 'Unable to load report list',
    UNIQUE_NAME_VALIDATION_MSG:
        'This Expense Name already exists. Please enter a unique name.',
    ERROR_IN_LOAD_LIMS_DATA:
        'Unable to load data. Please try again or contact support.',

    DOWNLOAD_SUCCESS: 'File downloaded successfully.',
    DOWNLOAD_ERROR:
        'An error occurred while downloading the file. Please try again.',
    DOWNLOAD_NOT_FOUND: 'Document not found.',
    DOWNLOAD_SERVER_ERROR:
        'Server error: Unable to download the document. Please try again later.',
    DOWNLOAD_UNEXPECTED_ERROR:
        'An unexpected error occurred while downloading the document.',

    DOCUMENT_SUBMISSION_SUCCESS: 'Document created successfully.',
    DOCUMENT_SUBMISSION_BAD_REQUEST:
        'Bad request: Please check your form inputs.',
    DOCUMENT_SUBMISSION_UNAUTHORIZED: 'Unauthorized: Please log in to continue.',
    DOCUMENT_SUBMISSION_SERVER_ERROR: 'Server error: Please try again later.',
    DOCUMENT_SUBMISSION_UNEXPECTED_ERROR:
        'An unexpected error occurred. Please try again.',

    ROLE_ACCESS_FETCH_NOT_FOUND: 'Role access data not found.',
    ROLE_ACCESS_FETCH_SERVER_ERROR:
        'Server error: Unable to fetch role access data. Please try again later.',
    ROLE_ACCESS_FETCH_UNEXPECTED_ERROR:
        'An unexpected error occurred while fetching role access data.',

    SAMPLE_FORM_IDENTIFIER_FETCH_SERVER_ERROR:
        'Server error: Unable to fetch sample form identifiers. Please try again later.',
    SAMPLE_FORM_IDENTIFIER_FETCH_UNEXPECTED_ERROR:
        'An unexpected error occurred while fetching sample form identifiers.',

    REMOVE_DOCUMENT_BAD_REQUEST: 'Bad request: Unable to process your request.',
    REMOVE_DOCUMENT_UNAUTHORIZED: 'Unauthorized: Please log in to continue.',
    REMOVE_DOCUMENT_SERVER_ERROR: 'Server error: Unable to remove document access.',
    REMOVE_DOCUMENT_UNEXPECTED_ERROR: 'An unexpected error occurred. Please try again.',

    USER_DEACTIVATED_SUCCESS: 'User deactivated successfully.',
    USER_REACTIVATED_SUCCESS: 'User reactivated successfully.',
    ERROR_IN_DEACTIVATING_USER: 'Error in deactivating user.',

    LIMS_ID_ADDED_SUCCESSFULLY: 'LIMS Project ID added successfully.',
    LIMS_ID_UPDATED_SUCCESSFULLY: 'LIMS Project ID updated successfully.',
    INVALID_LIMS_ID: 'Invalid LIMS Project ID.',
    USER_EXPENSE_ASSOCIATION_EXISTS: 'Can\'t add the expense representative, as the expense representative is added to the other expense.',

    SAVE_AS_DRAFT_CONFIRMATION_MSG: 'Are you sure you want to save this as a draft and close on this step?',
    DEACTIVATE_USER_BY_ADMIN: 'This user cannot be added as they have been deactivated by the Platform Admin.',
};

export const ApplicationModules = {
    EXPENSE: 'Expense',
    USER: 'AUTH',
    PROJECT: 'Project',
    REPORT: 'Project',
    DOCUMENT: 'Documents',
    CUSTOMER: 'Customers',
    ROLE_MODULE_MAPPING: 'RoleModuleMapping',
    FEEDBACK: 'Feedback',
    SAMPLE_SUBMISSION_FORM: 'SampleSubmissionForm',
    USER_PROJECT: 'UserProject',
    LIMS: 'LIMS'
};

export const ApplicationModuleActions = {
    ADD: 'ADD',
    EDIT: 'EDIT',
    DELETE: 'DELETE',
    VIEW: 'VIEW',
    DOWNLOAD: 'DOWNLOAD',
    UPLOAD: 'UPLOAD',
};

export const ApplicationRoles = {
    Platform_Admin: 'Platform Admin',
    Project_Manager: 'Project Manager',
    Finance_User: 'Finance User',
    Sample_Management_User: 'Sample Management User',
    Internal_PD: 'Internal PD',
    External_Expense: 'External Expense'
};
export const DBConstants = {
    DAYTYPE: 11,
    COINTYPE: 12,
    RELATION: 15,
    MONTH: 4,
    MODEOFTRANSACTION: 14,
}
