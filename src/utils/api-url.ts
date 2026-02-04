import { environment } from "../environments/environment";

const serverUrl = environment.serverUrl;
const apiPrefix = environment.apiPrefix;

export const API_URL = {

  ATTACHMENT: "../../../assets/project-attachments/",
  COLLECTIONCOINS: "collection_coins",
  BIRTHDAYPERSONPIC: "birthday_person_pic",

  GET_ASSET_DETAILS: `${serverUrl}${apiPrefix}/asset/getAssetDetails`,
  UPLOAD_IMAGE: `${serverUrl}${apiPrefix}/asset/UploadAndSaveFile?userId=`,
  GET_COLLECTION_COIN_GALLERY: `${serverUrl}${apiPrefix}/coinNoteCollection/CollectionGallery`,
  GET_COLLECTION_COIN_LIST: `${serverUrl}${apiPrefix}/coinNoteCollection/GetList`,
  GET_COLLECTION_SUMMARY: `${serverUrl}${apiPrefix}/coinNoteCollection/GetSummary`,
  GET_COLLECTION_COIN_DETAILS: `${serverUrl}${apiPrefix}/coinNoteCollection/GetDetails`,
  ADD_COLLECTION_COIN: `${serverUrl}${apiPrefix}/coinNoteCollection/add?userId=`,
  UPDATE_COLLECTION_COIN: `${serverUrl}${apiPrefix}/coinNoteCollection/update?userId=`,
  DELETE_COLLECTION_COIN: `${serverUrl}${apiPrefix}/coinNoteCollection/delete?coinNoteCollectionId=`,
  APPROVE_COLLECTION_COIN: `${serverUrl}${apiPrefix}/coinNoteCollection/approve?coinNoteCollectionId=`,

  GET_SPECIAL_OCCASION_DETAILS: `${serverUrl}${apiPrefix}/SpecialOccasion/GetDetails`,
  GET_SPECIAL_OCCASION_LIST: `${serverUrl}${apiPrefix}/SpecialOccasion/GetList`,
  ADD_SPECIAL_OCCASION: `${serverUrl}${apiPrefix}/SpecialOccasion/add?userId=`,
  UPDATE_SPECIAL_OCCASION: `${serverUrl}${apiPrefix}/SpecialOccasion/update?userId=`,
  DELETE_SPECIAL_OCCASION: `${serverUrl}${apiPrefix}/SpecialOccasion/delete?dayId=`,
  APPROVE_SPECIAL_OCCASION: `${serverUrl}${apiPrefix}/SpecialOccasion/approveDay?dayId=`,

  GET_EXPENSE_DETAILS: `${serverUrl}${apiPrefix}/expense/GetDetails`,
  GET_EXPENSE_SUMMARY_LIST: `${serverUrl}${apiPrefix}/expense/GetSummary`,
  GET_EXPENSE_REPORT_LIST: `${serverUrl}${apiPrefix}/expense/GetReport`,
  GET_EXPENSE_LIST: `${serverUrl}${apiPrefix}/expense/GetList`,
  ADD_EXPENSE: `${serverUrl}${apiPrefix}/expense/add?userId=`,
  EXPENSE_ADJUSTMENT: `${serverUrl}${apiPrefix}/expense/expenseAdjustment?userId=`,
  UPDATE_EXPENSE: `${serverUrl}${apiPrefix}/expense/update?userId=`,
  DELETE_EXPENSE: `${serverUrl}${apiPrefix}/expense/delete?expenseId=`,
  GET_EXPENSE_SUGGESTION_LIST: `${serverUrl}${apiPrefix}/expense/GetExpenseSuggestionList`,


  GET_TRANSACTION_DETAILS: `${serverUrl}${apiPrefix}/transaction/GetDetails`,
  GET_TRANSACTION_SUMMARY_LIST: `${serverUrl}${apiPrefix}/transaction/GetSummary`,
  GET_BALANCE_LIST: `${serverUrl}${apiPrefix}/transaction/GetBalanceSummary`,
  GET_TRANSACTION_REPORT_LIST: `${serverUrl}${apiPrefix}/transaction/GetReport`,
  GET_CATEGORY_WISE_REPORT_LIST: `${serverUrl}${apiPrefix}/transaction/GetCategoryWiseReport`,
  GET_BUDGET_WISE_REPORT_LIST: `${serverUrl}${apiPrefix}/transaction/GetBudgetWiseReport`,
  GET_TRANSACTION_LIST: `${serverUrl}${apiPrefix}/transaction/GetList`,
  ADD_TRANSACTION: `${serverUrl}${apiPrefix}/transaction/add?userId=`,
  TRANSACTION_ADJUSTMENT: `${serverUrl}${apiPrefix}/transaction/transactionAdjustment?userId=`,
  UPDATE_TRANSACTION: `${serverUrl}${apiPrefix}/transaction/update?userId=`,
  DELETE_TRANSACTION: `${serverUrl}${apiPrefix}/transaction/delete?transactionId=`,
  GET_TRANSACTION_SUGGESTION_LIST: `${serverUrl}${apiPrefix}/transaction/GetTransactionSuggestionList`,
  GET_TRANSACTION_CATEGORY_LIST: `${serverUrl}${apiPrefix}/transaction/GetTransactionSuggestionList`,
  GET_AVAIL_AMOUNT: `${serverUrl}${apiPrefix}/transaction/getAvailAmount`,


  GET_COMMON_LIST_ITEMS: `${serverUrl}${apiPrefix}/commonList/getCommonListItem`,
  GET_COUNTRY_LIST: `${serverUrl}${apiPrefix}/commonList/GetCountryList`,
  GET_USER_PERMISSIONS: `${serverUrl}${apiPrefix}/user/GetUserPermission?userId=`,
  GET_DEFAULT_PERMISSIONS: `${serverUrl}${apiPrefix}/user/GetDefaultPermission`,
  GET_ALL_ROLES: `${serverUrl}${apiPrefix}/role/GetList`,
  UPDATE_USER_PERMISSION: `${serverUrl}${apiPrefix}/user/updateUserPermission?userId=`,
  CHANGE_PASSWORD: `${serverUrl}${apiPrefix}/user/changepassword`,

  GET_ALL_USERS: `${serverUrl}${apiPrefix}/user/GetList`,
  GET_LOGGED_IN_USER_DETAILS: `${serverUrl}${apiPrefix}/auth/getloggedinuserdetails`,
  Get_USER_DETAILS: `${serverUrl}${apiPrefix}/user/GetDetails?userId=`,

  GET_CONFIG_LIST: `${serverUrl}${apiPrefix}/settings/GetConfigList`,
  GET_ACTIVE_CONFIG_LIST: `${serverUrl}${apiPrefix}/settings/GetActiveConfigList`,
  GET_CONFIG_DETAIL: `${serverUrl}${apiPrefix}/settings/GetConfigDetails`,
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
  LOGIN: `${serverUrl}${apiPrefix}/user/Login`,


  GET_DOCUMENT_List: `${serverUrl}${apiPrefix}/document/getList`,
  GET_DOCUMENT_DOWNLOAD_SAS_URL: `${serverUrl}${apiPrefix}/document/GetDownloadUrl?blobPath=`,
  UPLOAD_DOCUMENT: `${serverUrl}${apiPrefix}/document/UploadDocument?userId=`,
  DELETE_DOCUMENT: `${serverUrl}${apiPrefix}/document/delete?dayId=`,

  GET_ROUTINE: `${serverUrl}${apiPrefix}/routine`,
  ADD_ROUTINE: `${serverUrl}${apiPrefix}/routine/`,
  GET_ROUTINE_BY_USER: `${serverUrl}${apiPrefix}/routine/user/`,
  GET_ROUTINE_DETAILS: `${serverUrl}${apiPrefix}/routine/`,
  DELETE_ROUTINE: `${serverUrl}${apiPrefix}/routine/delete?routineId=`,
  UPDATE_ROUTINE: `${serverUrl}${apiPrefix}/routine/`,

  GET_BUDGET: `${serverUrl}${apiPrefix}/budget`,
  ADD_BUDGET: `${serverUrl}${apiPrefix}/budget`,
  GET_BUDGET_BY_USER: `${serverUrl}${apiPrefix}/budget/user/`,
  GET_BUDGET_DETAILS: `${serverUrl}${apiPrefix}/budget/`,
  DELETE_BUDGET: `${serverUrl}${apiPrefix}/budget/delete?budgetId=`,
  UPDATE_BUDGET: `${serverUrl}${apiPrefix}/budget`,

  GET_CREDENTIAL: `${serverUrl}${apiPrefix}/credential`,
  ADD_CREDENTIAL: `${serverUrl}${apiPrefix}/credential`,
  GET_CREDENTIAL_BY_USER: `${serverUrl}${apiPrefix}/credential/user/`,
  GET_CREDENTIAL_DETAILS: `${serverUrl}${apiPrefix}/credential/`,
  DELETE_CREDENTIAL: `${serverUrl}${apiPrefix}/credential/delete?credentialId=`,
  UPDATE_CREDENTIAL: `${serverUrl}${apiPrefix}/credential`,
};
