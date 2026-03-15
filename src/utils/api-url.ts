import { environment } from "../environments/environment";

const serverUrl = environment.serverUrl;
const apiPrefix = environment.apiPrefix;

export const API_URL = {

  ATTACHMENT: "../../../assets/project-attachments/",
  COLLECTIONCOINS: "collection_coins",
  BIRTHDAYPERSONPIC: "birthday_person_pic",

  GET_ASSET_DETAILS: `${serverUrl}${apiPrefix}/asset/`,
  DELETE_ASSET: `${serverUrl}${apiPrefix}/asset/`,
  UPLOAD_IMAGE: `${serverUrl}${apiPrefix}/asset/upload?`,
  GET_COLLECTION_COIN_GALLERY: `${serverUrl}${apiPrefix}/coinNoteCollection/`,
  GET_COLLECTION_COIN_LIST: `${serverUrl}${apiPrefix}/coinNoteCollection/`,
  GET_COLLECTION_SUMMARY: `${serverUrl}${apiPrefix}/coinNoteCollection/summary`,
  GET_COLLECTION_COIN_DETAILS: `${serverUrl}${apiPrefix}/coinNoteCollection/`,
  ADD_COLLECTION_COIN: `${serverUrl}${apiPrefix}/coinNoteCollection/`,
  UPDATE_COLLECTION_COIN: `${serverUrl}${apiPrefix}/coinNoteCollection/`,
  DELETE_COLLECTION_COIN: `${serverUrl}${apiPrefix}/coinNoteCollection/`,
  APPROVE_COLLECTION_COIN: `${serverUrl}${apiPrefix}/coinNoteCollection/approve?coinNoteCollectionId=`,

  GET_SPECIAL_OCCASION_DETAILS: `${serverUrl}${apiPrefix}/SpecialOccasion/`,
  GET_SPECIAL_OCCASION_LIST: `${serverUrl}${apiPrefix}/SpecialOccasion`,
  ADD_SPECIAL_OCCASION: `${serverUrl}${apiPrefix}/SpecialOccasion/`,
  UPDATE_SPECIAL_OCCASION: `${serverUrl}${apiPrefix}/SpecialOccasion/`,
  DELETE_SPECIAL_OCCASION: `${serverUrl}${apiPrefix}/SpecialOccasion/`,
  APPROVE_SPECIAL_OCCASION: `${serverUrl}${apiPrefix}/SpecialOccasion/approveDay?dayId=`,

  GET_TRANSACTION_DETAILS: `${serverUrl}${apiPrefix}/transaction/`,
  GET_TRANSACTION_SUMMARY_LIST: `${serverUrl}${apiPrefix}/transaction/summary`,
  GET_BALANCE_LIST: `${serverUrl}${apiPrefix}/transaction/balance-summary`,
  GET_TRANSACTION_REPORT_LIST: `${serverUrl}${apiPrefix}/transaction/report`,
  GET_CATEGORY_WISE_REPORT_LIST: `${serverUrl}${apiPrefix}/transaction/report/category-wise`,
  GET_BUDGET_WISE_REPORT_LIST: `${serverUrl}${apiPrefix}/transaction/report/budget-wise`,
  GET_TRANSACTION_LIST: `${serverUrl}${apiPrefix}/transaction/List`,
  ADD_TRANSACTION: `${serverUrl}${apiPrefix}/transaction`,
  TRANSACTION_ADJUSTMENT: `${serverUrl}${apiPrefix}/transaction/transactionAdjustment?userId=`,
  UPDATE_TRANSACTION: `${serverUrl}${apiPrefix}/transaction/`,
  DELETE_TRANSACTION: `${serverUrl}${apiPrefix}/transaction/`,
  GET_TRANSACTION_SUGGESTION_LIST: `${serverUrl}${apiPrefix}/transaction/suggestions`,
  // GET_TRANSACTION_CATEGORY_LIST: `${serverUrl}${apiPrefix}/transaction/GetTransactionSuggestionList`,
  GET_AVAIL_AMOUNT: `${serverUrl}${apiPrefix}/transaction/getAvailAmount`,


  GET_COMMON_LIST_ITEMS: `${serverUrl}${apiPrefix}/commonList/`,
  GET_COUNTRY_LIST: `${serverUrl}${apiPrefix}/commonList/countries`,
  GET_USER_PERMISSIONS: `${serverUrl}${apiPrefix}/user/permissions/`,
  GET_USER_PERMISSIONS_FOR_MENU: `${serverUrl}${apiPrefix}/user/permissionsForMenu/`,
  GET_DEFAULT_PERMISSIONS: `${serverUrl}${apiPrefix}/user/GetDefaultPermission`,
  GET_ALL_ROLES: `${serverUrl}${apiPrefix}/role/GetList`,
  UPDATE_USER_PERMISSION: `${serverUrl}${apiPrefix}/user/permissions/`,
  // CHANGE_PASSWORD: `${serverUrl}${apiPrefix}/user/changepassword`,

  GET_ALL_USERS: `${serverUrl}${apiPrefix}/user/list`,
  GET_LOGGED_IN_USER_DETAILS: `${serverUrl}${apiPrefix}/auth/getloggedinuserdetails`,
  Get_USER_DETAILS: `${serverUrl}${apiPrefix}/user/GetDetails?userId=`,
  GET_MODULE_LIST: `${serverUrl}${apiPrefix}/user/modules`,

  GET_CONFIG_LIST: `${serverUrl}${apiPrefix}/settings/config/active`,
  GET_ACTIVE_CONFIG_LIST: `${serverUrl}${apiPrefix}/settings/config/active`,
  GET_CONFIG_DETAIL: `${serverUrl}${apiPrefix}/settings/config/`,
  GET_CONFIG_ADD: `${serverUrl}${apiPrefix}/settings/AddConfig`,
  GET_CONFIG_UPDATE: `${serverUrl}${apiPrefix}/settings/UpdateConfig`,
  GET_CONFIG_DELETE: `${serverUrl}${apiPrefix}/settings/DeleteConfig`,
  GET_CONFIG_DEACTIVATE: `${serverUrl}${apiPrefix}/settings/DeactiveConfig`,


  REGISTER_USER: `${serverUrl}${apiPrefix}/auth/register`,
  UPDATE_USER: `${serverUrl}${apiPrefix}/user/updateUserDetails?userId=`,
  RESET_PASSWORD: `${serverUrl}${apiPrefix}/auth/resetpassword`,
  FORGOT_PASSWORD: `${serverUrl}${apiPrefix}/auth/forgotpassword`,
  VERIFY_OTP: `${serverUrl}${apiPrefix}/otp/verify`,
  SEND_OTP: `${serverUrl}${apiPrefix}/otp/send`,
  LOGIN: `${serverUrl}${apiPrefix}/user/login`,
  REFRESH_TOKEN: `${serverUrl}${apiPrefix}/user/refresh-token`,
  LOGOUT: `${serverUrl}${apiPrefix}/user/logout`,
  CHANGE_PASSWORD: `${serverUrl}${apiPrefix}/user/change-password`,


  GET_DOCUMENT_List: `${serverUrl}${apiPrefix}/document`,
  GET_DOCUMENT_DOWNLOAD_SAS_URL: `${serverUrl}${apiPrefix}/document/GetDownloadUrl?blobPath=`,
  UPLOAD_DOCUMENT: `${serverUrl}${apiPrefix}/document/upload/`,
  UPDATE_DOCUMENT: `${serverUrl}${apiPrefix}/document/Update/`,
  DELETE_DOCUMENT: `${serverUrl}${apiPrefix}/document/`,

  GET_ROUTINE: `${serverUrl}${apiPrefix}/routine`,
  ADD_ROUTINE: `${serverUrl}${apiPrefix}/routine/`,
  GET_ROUTINE_BY_USER: `${serverUrl}${apiPrefix}/routine/`,
  GET_ROUTINE_DETAILS: `${serverUrl}${apiPrefix}/routine/`,
  DELETE_ROUTINE: `${serverUrl}${apiPrefix}/routine/delete?routineId=`,
  UPDATE_ROUTINE: `${serverUrl}${apiPrefix}/routine/`,

  GET_BUDGET: `${serverUrl}${apiPrefix}/budget`,
  ADD_BUDGET: `${serverUrl}${apiPrefix}/budget`,
  GET_BUDGET_BY_USER: `${serverUrl}${apiPrefix}/budget/`,
  GET_BUDGET_DETAILS: `${serverUrl}${apiPrefix}/budget/`,
  DELETE_BUDGET: `${serverUrl}${apiPrefix}/budget/delete?budgetId=`,
  UPDATE_BUDGET: `${serverUrl}${apiPrefix}/budget`,

  GET_CREDENTIAL: `${serverUrl}${apiPrefix}/credential`,
  ADD_CREDENTIAL: `${serverUrl}${apiPrefix}/credential/Add`,
  GET_CREDENTIAL_BY_USER: `${serverUrl}${apiPrefix}/credential`,
  GET_CREDENTIAL_DETAILS: `${serverUrl}${apiPrefix}/credential/`,
  DELETE_CREDENTIAL: `${serverUrl}${apiPrefix}/credential/delete?credentialId=`,
  UPDATE_CREDENTIAL: `${serverUrl}${apiPrefix}/credential/Update`,
};
