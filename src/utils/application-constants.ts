export const ApplicationConstants = {
    SELECT_ALL: 'Select All',
    MIN_LENGTH_USERNAME: 6,
    MAX_LENGTH_USERNAME: 20,
    PATTERN_REQUIRED_CHARS_IN_USERNAME:
        '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',

    MIN_LENGTH_PASSWORD: 12,
    MAX_LENGTH_PASSWORD: 15,
    PATTERN_REQUIRED_CHARS_IN_PASSWORD:
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*. ]{8,}$',
    DISALLOWED_CHARS_IN_PASSWORD: [' ', '#', '(', ')', '-', '_', '+', '{', '}'],
    SCREEN_SIZE_SM: 576,
    PATTERN_REQUIRED_CHARS_IN_NAME: '^(?=.*[a-zA-Z])[a-zA-Z \\-_]+$',
    PATTERN_REQUIRED_CHARS_IN_LOCATION:
        '^(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*. \\-_]+$',

    PATTERN_PHONE_NUMBER: '^\\+[1-9]{1}[0-9]{1,2}[0-9]{10,14}$',
    PATTERN_ALLOW_OTHER_THAN_SPACE: /^(?!\s+$).+/,

    SAMPLE_TRACKING_SYSTEM_ID: '01234556-89AB-1DEF-8123-456789ABCDEF',
    FORM_TYPE_ID: '01234556-89AB-1DEF-8123-456789ABCDEF',


    SYSTEM_NOTIFICATION_FETCHING_FREQUENCY: 30000,
    NUMBER_OF_TOP_SYSTEM_NOTIFICATIONS_TO_SHOW: 5,

    GLOBAL_NUMERIC_DATE_FORMAT: 'dd/MM/yyyy',
    GLOBAL_DATE_FORMAT: 'dd-MMM-yyyy',
    GLOBAL_DATE_TIME_FORMAT_WITH_MINUTES: 'dd-MMM-yyyy HH:mm',
    GLOBAL_DATE_TIME_FORMAT: 'dd-MMM-yyyy HH:mm:ss',

    REGEX_DASH_DOT_UNDERSCORE_WITH_SPACE: /(?<=[a-zA-Z0-9])[-_.](?=[a-zA-Z0-9])/g,
    REGEX_CAPITALIZE_FIRST_LETTER: /\b\w/g,
    APPLICATIONS_OWNER_EMAILID: 'farukshaikh908@gmail.com'
};

export const ButtonLabels = {
    BTN_SAVE_AS_DRAFT: 'Save',
    BTN_SAVE_AND_PROCEED: 'Save and Proceed',
    BTN_CANCEL: 'Cancel',
    BTN_SUBMIT: 'Submit',
    BTN_PREVIOUS: 'Previous',
};

export const ApplicationTableConstants = {
    DEFAULT_RECORDS_PER_PAGE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 15, 20, 50, 100, 'Select All'],
};

export const ToasterConfigs = {
    TIMEOUT: 10000,
};


export const OtpConfig = {
    NumberOfOtpDigits: 6,
    OTP_EXPIRES_IN_MINUTES: 2,
    otpMaxTrial: 3,
    LOGIN: 'Login',
    FORGOT_PASSWORD: 'ForgotPassword',
    RESET_PASSWORD: 'ResetPassword',
    REGISTER: 'Register',
    VERIFY_EMAIL: 'VerifyEmail'
}
export const LoaderConfigs = {
    TIMEOUT: 10000,
};

export const UserConfig = {
    OCCASION_TYPE: 'OccasionType',
    RELATION: 'Relation',
    ACCOUNT: 'Account',
};


export const LocalStorageConstants = {
    IS_LOGGED_IN: 'IsLoggedIn',
    USER: 'user',
    USERID: 'userId',
    COUNTRY_LIST: 'countryList',
    COMMON_SUGGESTION_LIST: 'commonSuggestionList',
    MONTH_LIST: 'monthList',
    COIN_TYPE: 'CoinType',
    USER_ROLE_ID: 'loggedInUserRoleId',
    USER_PERMISSIONS: 'UserPermissions',
    OTP_EXPIRES_ON: 'OtpExpiresOn',
};

export const DBConstants = {
    OCCASION_TYPE: 'B37BB6EC-F172-4EEF-BB70-C0FD5C47FCEA',
    RELATION: '4A920596-928E-40CD-AC1A-549E9A3B7427',
    COINTYPE: '899773F6-EC60-4B0B-95F6-5DB190C23F99',
    MONTH: '7E0F0170-7206-48C9-8679-82A111CA45B1',
    MODEOFTRANSACTION: 'E1A5F08E-8FAD-4341-B4E6-A17C68FB4E47',
}
export const ApplicationConstantHtml = {
    DELETE_LABLE: `<a class="dropdown-item btn-link" data-bs-toggle="modal" data-bs-target="#confirmationPopup"><i class="bi bi-trash"></i>&nbsp;Delete</a>`,
    DEACTIVATE_LABLE: `<a class="dropdown-item btn-link" data-bs-toggle="modal" data-bs-target="#confirmationPopup"><i class="bi bi-trash"></i>&nbsp;Deactivate</a>`,
    EDIT_LABLE: `<a class="dropdown-item btn-link" data-bs-toggle="modal" data-bs-target="#detailsPopup"><i class="bi bi-pencil"></i>&nbsp;Edit</a>`,
    VIEW_LABLE: `<a class="dropdown-item btn-link"><i class="bi bi-eye"></i>&nbsp;View</a>`,
    DOWNLOAD_LABLE: `<a class="dropdown-item btn-link"><i class="bi bi-download"></i>&nbsp;Download</a>`,
    UPLOAD_LABLE: `<a class="dropdown-item btn-link"><i class="bi bi-upload"></i>&nbsp;Upload</a>`,
    APPROVE_LABLE: `<a class="dropdown-item btn-link"><i class="bi bi-check2"></i>&nbsp;Approve</a>`,
    REJECT_LABLE: `<a class="dropdown-item btn-link"><i class="bi bi-x-circle"></i>&nbsp;Reject</a>`,
    CONFIG_EDIT_LABLE: `<a class="dropdown-item btn-link" data-bs-toggle="modal" data-bs-target="#configDetailsPopup"><i class="bi bi-pencil"></i>&nbsp;Edit</a>`,
}
export const NavigationURLs = {
    LOGIN: '/login',
    ERROR_PAGE: '/home/unauthorised',
    UNAUTHORIZED_PAGE: '/unauthorised',
    LOGOUT: '/logout',
    CLIENT_LIST: '/home/client',
    ROLE_MODULE_MAPPING: '/home/user-permission',
    PROGRAMS: '/home/program',
    HOME: '/home',
    DAY_LIST: '/home/day',
    FORGOT_PASSWORD: '/forgot-password',
    USER_LIST: '/home/manage-users',
    USER_PROFILE: '/home/user-profile',
    CHANGE_PASSWORD: '/home/change-password',
    NAV_CHAT_PANEL: '/home/nav-chat-panel',
    EXPENSE_LIST: '/home/expenses',
    EXPENSE_SUMMARY_LIST: '/home/expense-summary',
    EXPENSE_BALANCE_LIST: '/home/expense-balance',
    EXPENSE_REPORT: '/home/expense-report',
    REPORT_LIST: '/home/expenses/reports',
    CURRENCY_LIST: '/home/currency-coin',
    CURRENCY_GALLERY: '/home/currency-gallery',
    ALL_NOTIFICATIONS: '/home/notifications',
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
    CLIENTS_FETCHED_SUCCESS: 'clients fetched successfully.',
    ERROR_IN_FETCH_CLIENT: 'Error in fetching clients.',
    EXPENSES_FETCHED_SUCCESS: 'EXPENSES fetched successfully.',
    EXPENSE_ADDED_SUCCESS: 'Expense details added successfully.',
    EXPENSE_UPDATED_SUCCESS: 'Expense details updated successfully.',
    ERROR_IN_FETCH_EXPENSE: 'Unable to load expense data. Please try again later.',
    ERROR_IN_FETCH_ROLE_MODULE_MAPPINGS: 'Error fetching user-permissions',

    ERROR_IN_FETCH_PROGRAM: 'Error fetching programs',

    USER_SAVED: 'User registered successfully.',
    USER_SAVED_FAILED: 'Failed to registered user.',

    CHAT_DELETE_CONFIRMATION: 'Are you sure you want to delete chat between',
    ROLE_MODULE_MAPPING_UPDATED_SUCCESSFULLY:
        'user-permission updated successfully',

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

    USER_EXPENSE_ASSOCIATION_EXISTS: 'Can\'t add the expense representative, as the expense representative is added to the other expense.',

    SAVE_AS_DRAFT_CONFIRMATION_MSG: 'Are you sure you want to save this as a draft and close on this step?',
    DEACTIVATE_USER_BY_ADMIN: 'This user cannot be added as they have been deactivated by the Platform Admin.',
};

export const ApplicationModules = {
    EXPENSE: 'Expense',
    DAY: 'Day',
    COIN_NOTE_COLLECTION: 'Coin Note Collection',
    USER: 'AUTH',
    DOCUMENT: 'Documents',
    USER_PERMISSIONS: 'userPermissions',
    SETTINGS: 'Settings',
};

export const ActionConstant = {
    ADD: 'ADD',
    EDIT: 'EDIT',
    DELETE: 'DELETE',
    VIEW: 'VIEW',
    DOWNLOAD: 'DOWNLOAD',
    UPLOAD: 'UPLOAD',
};

export const ApplicationRoles = {
    Platform_Admin: 'Platform Admin',
    Finance_User: 'Finance User',
    Sample_Management_User: 'Sample Management User',
    External_Expense: 'External Expense',
    SUPER_ADMIN: 'Super Admin'
};

// Generic UI strings for consistent labels across components
export const UIStrings = {
    COLUMN_TITLES: {
        NAME: 'Name',
        EMAIL: 'Email Id',
        MOBILE_NUMBER: 'Mobile Number',
        ROLE: 'Role',
        STATUS: 'Status',
        DESCRIPTION: 'Description',
        DISPLAY_ORDER: 'Display Order',
        ACCOUNT_NAME: 'Account Name',
        OCCASION_TYPE_NAME: 'OccasionType Name',
        RELATION_TYPE_NAME: 'RelationType Name',
        COIN_NOTE_NAME: 'Coin/Note Name',
        COUNTRY: 'Country',
        REAL_VALUE: 'Real Value',
        INDIAN_VALUE: 'Indian Value',
        OTHER_DETAILS: 'Other details',
        PIC: 'Pic',
        CURRENCY: 'Currency',
        COINS: 'Coins',
        NOTES: 'Notes',
        TOTAL: 'Total'
    },
    COMMON: {
        NO_DATA: 'No Data Exists.',
        VIEW_ALL: 'View All',
        CONFIRMATION: 'Confirmation'
    },
    LOADERS: {
        LOADING_CURRENCY_DATA: 'Loading currency data...',
        LOADING_CURRENCY_SUMMARY: 'Loading currency summary...'
    }
};