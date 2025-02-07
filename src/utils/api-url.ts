import { environmentDev } from '../environments/environment.dev';

const serverUrl = environmentDev.serverUrl;
const apiPrefix = environmentDev.apiPrefix;

export const API_URL = {
    // Auth and User API URLs
    AUTHENTICATE_USER: `${serverUrl}${apiPrefix}/auth/login`,

    GET_ALL_USERS: `${serverUrl}${apiPrefix}/auth/getalluser`,
    GET_LOGGED_IN_USER_DETAILS : `${serverUrl}${apiPrefix}/auth/getloggedinuserdetails`,
    REGISTER_USER: `${serverUrl}${apiPrefix}/auth/register`,
    UPDATE_USER: `${serverUrl}${apiPrefix}/auth/updateuser`,
    RESET_PASSWORD: `${serverUrl}${apiPrefix}/auth/resetpassword`,
    CHANGE_PASSWORD: `${serverUrl}${apiPrefix}/auth/changepassword`,
    FORGOT_PASSWORD: `${serverUrl}${apiPrefix}/auth/forgotpassword`,
    GET_ALL_PROJECT_USER_BY_PROJECTID: `${serverUrl}${apiPrefix}/Auth/getprojectusersbyprojectid?projectid=`,
    REMOVE_PROJECT_USER_BY_PROJECTID: `${serverUrl}${apiPrefix}/UserProject/deleteprojectuserbyprojectid?id=`,
    DEACTIVATE_USER: `${serverUrl}${apiPrefix}/auth/deactivateuser?userid=`,
    REACTIVATE_USER: `${serverUrl}${apiPrefix}/auth/reactivateuser?userid=`,
    VERIFY_OTP: `${serverUrl}${apiPrefix}/auth/verifyotp?emailId={0}&otpCode={1}`,

    // Customer API URLs
    GET_ALL_CUSTOMERS: `${serverUrl}${apiPrefix}/customers/getcustomers`,
    GET_CUSTOMER_DETAILS_BY_ID: `${serverUrl}${apiPrefix}/customers/getcustomersbyid?customerId=`,
    ADD_CUSTOMER: `${serverUrl}${apiPrefix}/customers/addcustomer`,
    UPDATE_CUSTOMER: `${serverUrl}${apiPrefix}/customers/updatecustomer`,

    // Client API URLs
    GET_ALL_CLIENTS: `${serverUrl}${apiPrefix}/client/getclients`,
    GET_CLIENT_DETAILS_BY_ID: `${serverUrl}${apiPrefix}/client/getclientbyid?clientId=`,
    ADD_CLIENT: `${serverUrl}${apiPrefix}/client/addclient`,
    UPDATE_CLIENT: `${serverUrl}${apiPrefix}/client/updateclient`,
    GET_CLIENT_SERVICE_LIST: `${serverUrl}${apiPrefix}/client/getclientservices`,

    // Feedback API URLs
    GET_ALL_FEEDBACK: `${serverUrl}${apiPrefix}/feedback/getallfeedbacks`,
    GET_FEEDBACK_BY_ID: `${serverUrl}${apiPrefix}/feedback/getfeedbackbyid`,
    ADD_FEEDBACK: `${serverUrl}${apiPrefix}/feedback/addfeedback`,
    UPDATE_FEEDBACK: `${serverUrl}${apiPrefix}/feedback/updatefeedback`,
    DELETE_FEEDBACK: `${serverUrl}${apiPrefix}/feedback/deletefeedback`,

    // Project API URLs
    GET_PROJECTS_BY_CLIENT_ID: `${serverUrl}${apiPrefix}/project/getprojects?clientId=`,
    GET_INTERNAL_PROJECTS_BY_CLIENT_ID: `${serverUrl}${apiPrefix}/project/getinternalprojects?clientId=`,
    GET_PROJECTS_WITH_SAMPLE_FORMS_BY_CLIENT_ID: `${serverUrl}${apiPrefix}/project/getprojectswithsampleformscount?clientId=`,
    GET_PROJECTS_STATUS_REPORT: `${serverUrl}${apiPrefix}/project/getprojectstatusreport?clientId=`,
    GET_PROJECT_DETAILS_BY_ID: `${serverUrl}${apiPrefix}/project/getprojectbyid?projectId=`,
    IS_PROJECT_EXISTS_WITH_SAME_NAME: `${serverUrl}${apiPrefix}/project/isprojectexistswithsamename?projectName=`,
    GET_ALL_PROJECT: `${serverUrl}${apiPrefix}/project/getprojects`,
    GET_ALL_INTERNAL_PROJECT: `${serverUrl}${apiPrefix}/project/getinternalprojects`,
    ADD_PROJECT: `${serverUrl}${apiPrefix}/project/addproject`,
    UPDATE_PROJECT: `${serverUrl}${apiPrefix}/project/updateproject`,
    DELETE_PROJECT: `${serverUrl}${apiPrefix}/project/deactivateproject?projectId=`,
    GET_PROJECT_SERVICE_LIST: `${serverUrl}${apiPrefix}/project/getprojectservices`,
    CHANGE_PROJECT_STATUS: `${serverUrl}${apiPrefix}/project/changeprojectstatus`,
    GET_ALL_PROJECT_MANAGER: `${serverUrl}${apiPrefix}/project/getallprojectmanager`,

    GET_ALL_FORM_TYPES: `${serverUrl}${apiPrefix}/project/getallformtypes`,
    GET_ALL_SAMPLE_TRACKING_SYSTEMS: `${serverUrl}${apiPrefix}/project/getallsampletrackingsystem`,

    // Role-Module-Mapping URLs
    UPDATE_ROLE_MODULE_MAPPING: `${serverUrl}${apiPrefix}/rolemodulemapping/updaterolemodulemapping`,
    GET_MODULE_MAPPED_TO_LOGGEDIN_USER: `${serverUrl}${apiPrefix}/rolemodulemapping/getmodulemappedtologgedinuser`,
    GET_ROLE_MODULE_MAPPING_BY_ROLE_ID: `${serverUrl}${apiPrefix}/rolemodulemapping/getmodulemappedbyroleid?roleId=`,

    // Role API URLs
    GET_ALL_ROLES: `${serverUrl}${apiPrefix}/roles/getallrole`,

    // Program API URLs
    GET_ALL_PROGRAMS: `${serverUrl}${apiPrefix}/programs/getprograms`,
    GET_PROGRAM_BY_ID: `${serverUrl}${apiPrefix}/programs/getprogrambyid?programId=`,
    ADD_PROGRAM: `${serverUrl}${apiPrefix}/programs/addprogram`,
    UPDATE_PROGRAM: `${serverUrl}${apiPrefix}/programs/updateprogram`,

    // Reports API URLs
    GET_REPORT_DETAILS_BY_ID: `${serverUrl}${apiPrefix}/project/getprojectbyid?projectId=`,

    // Document API URLs
    GET_DOCUMENT_DETAILS_BY_ID: `${serverUrl}${apiPrefix}/project/getprojectbyid?projectId=`,

    //chat API URLs
    GET_CHAT_USERS: `${serverUrl}${apiPrefix}/chats/getusersforchat`,
    CHAT_URL: `${serverUrl}/chats/`,

    // Sample form API URLs
  // GET_ALL_SAMPLE_FORMS: `${serverUrl}${apiPrefix}/sampleforms/get`,
    GET_ALL_SAMPLE_FORMS: `${serverUrl}${apiPrefix}/sampleforms/getsampledetails`,
    CHANGE_FORM_STATUS: `${serverUrl}${apiPrefix}/sampleforms/patchsampledetails`,
    POST_SAMPLE_DETAILS: `${serverUrl}${apiPrefix}/sampleforms`,
    ADD_PROJECT_USER: `${serverUrl}${apiPrefix}/UserProject/adduserproject`,
    GET_ALL_SAMPLE_FORMS_BY_PROJECT: `${serverUrl}${apiPrefix}/sampleforms/GetSampleFormsByProjectID?projectId=`,
    GET_LIMS_ID_LIST: `${serverUrl}${apiPrefix}/SampleForms/GetLimsProjectDropdown?projectid=`,
    DELETE_SAMPLE_FORM_BY_ID: `${serverUrl}${apiPrefix}/SampleForms/{formId}/deletesampleform`,

    SAVE_SAMPLE_FORM_COMMENT: `${serverUrl}${apiPrefix}/sampleforms/postsampleformcomment`,
    FETCH_SAMPLE_FORM_COMMENTS: `${serverUrl}${apiPrefix}/sampleforms/getsampleformsectionwisecomments?Id={0}&section={1}`,
    DELETE_SAMPLE_FORM_COMMENT: `${serverUrl}${apiPrefix}/sampleforms/deletesampleformcommentbycommentid?commentid={0}&sampleformid={1}&section={2}`,

    FETCH_VERSION_HISTORY_BY_SAMPLE_FORM_ID: `${serverUrl}${apiPrefix}/sampleforms/getversionhistorybysampleformsbyid?sampleformid={0}`,
    FETCH_SAMPLE_SUBMISSION_FORM_BY_Id_AND_VERSION_ID: `${serverUrl}${apiPrefix}/sampleforms/getsampleformbyversionid?sampleformid={0}&versionid={1}`,

    //Document Api Url
    DOCUMENTS: `${serverUrl}${apiPrefix}/documents`,

    // Lims service
    GET_SAMPLE_DETAIL_BY_SAMPLE_NUMBER: `${serverUrl}${apiPrefix}/LIMS/GetSampleDetailBySampleNumber?samplenumber=`,
    GET_TEST_DETAIL_BY_TEST_NUMBER: `${serverUrl}${apiPrefix}/LIMS/GetTestDetailByTestNumber?testnumber=`,
    GET_RESULT_DETAIL_BY_SAMPLE_NUMBER: `${serverUrl}${apiPrefix}/LIMS/GetResultDetailBySampleNumber?resultnumber=`,
    GET_TESTING_AND_RESULT_DATA_BY_LIMS_ID: `${serverUrl}${apiPrefix}/LIMS/GetTestingAndResultDataByLIMSID?limsid=`,
    DOWNLOAD_LIMS_REPORT_BY_REPORT_NUMBER: `${serverUrl}${apiPrefix}/LIMS/DownloadReport?reportnumber=`,

    // Notification API URLs
    GET_ALL_SYSTEM_NOTIFICATIONS: `${serverUrl}${apiPrefix}/notification/getnotifications?pageno=`,
    MARK_A_SYSTEM_NOTIFICATION_AS_READ: `${serverUrl}${apiPrefix}/notification/updatenotifications?notificationid=`,
    NOTIFICATION_URL: `${serverUrl}/api/notifications`,
    SAMPLE_FORM_SINGAL_R_URL: `${serverUrl}/api/sample_form`,
};
