import { environment } from "../environments/environment";

const serverUrl = environment.serverUrl;
const apiPrefix = environment.apiPrefix;

export const API_URL = {
  // Auth and User API URLs
  AUTHENTICATE_USER: `${serverUrl}${apiPrefix}/auth/login`,

  GET_ALL_USERS: `${serverUrl}${apiPrefix}/user/GetUserList`,
  GET_USER: `${serverUrl}${apiPrefix}/user/GetUser`,
  UPDATE_USER: `${serverUrl}${apiPrefix}/user/updateUserDetails?userId=`,
  Get_USER_BY_USER_ID: `${serverUrl}${apiPrefix}/user/getUserByUserId?userId=`,
  Get_USER_DETAILS: `${serverUrl}${apiPrefix}/user/GetUserDetails?userId=`,
  Get_USER_LIST: `${serverUrl}${apiPrefix}/user/getUserList?userId=`,
  GET_ALL_ROLES: `${serverUrl}${apiPrefix}/user/getRoleList?userId=`,

  GET_EXPENSE_DETAILS: `${serverUrl}${apiPrefix}/expense/GetExpenseDetails`,
  ADD_EXPENSE: `${serverUrl}${apiPrefix}/expense/addExpense?userId=`,
  UPDATE_EXPENSE: `${serverUrl}${apiPrefix}/expense/updateExpense?userId=`,
  DELETE_EXPENSE: `${serverUrl}${apiPrefix}/expense/deleteExpense?expenseId=`,
  EXPENSE_ADJUSTMENT: `${serverUrl}${apiPrefix}/expense/expenseAdjustment?userId=`,
  GET_EXPENSE_LIST: `${serverUrl}${apiPrefix}/expense/getExpenseList`,
  GET_SOURCES_REASONS_LIST: `${serverUrl}${apiPrefix}/expense/GetSourceOrReasonList`,
  GET_EXPENSE_SUGGESTION_LIST: `${serverUrl}${apiPrefix}/expense/GetExpenseSuggestionListItems`,
  GET_DESCRIPTION_LIST: `${serverUrl}${apiPrefix}/expense/GetDescriptionList`,
  GET_PURPOSE_LIST: `${serverUrl}${apiPrefix}/expense/GetPurposeList`,
  GET_EXPENSE_SUMMARY_LIST: `${serverUrl}${apiPrefix}/expense/getExpenseSummaryList`,
  GET_EXPENSE_REPORT_LIST: `${serverUrl}${apiPrefix}/expense/getExpenseReportList`,
  GET_AVAIL_AMOUNT: `${serverUrl}${apiPrefix}/expense/getAvailAmount`,
  DOWNLOAD_EXPENSE_LIST: `${serverUrl}${apiPrefix}/expense/DownloadExpenseList`,

  GET_BUSINESS_DETAILS: `${serverUrl}${apiPrefix}/business/GetBusinessDetails`,
  ADD_BUSINESS: `${serverUrl}${apiPrefix}/business/addBusiness?userId=`,
  UPDATE_BUSINESS: `${serverUrl}${apiPrefix}/business/updateBusiness?userId=`,
  DELETE_BUSINESS: `${serverUrl}${apiPrefix}/business/deleteBusiness?businessId=`,
  BUSINESS_ADJUSTMENT: `${serverUrl}${apiPrefix}/business/businessAdjustment?userId=`,
  GET_BUSINESS_LIST: `${serverUrl}${apiPrefix}/business/getBusinessList`,
  GET_BUSINESS_SUGGESTION_LIST: `${serverUrl}${apiPrefix}/business/GetBusinessSuggestionListItems`,
  GET_BUSINESS_SUMMARY_LIST: `${serverUrl}${apiPrefix}/business/getBusinessSummaryList`,
  GET_BUSINESS_REPORT_LIST: `${serverUrl}${apiPrefix}/business/getBusinessReportList`,

  GET_DAY_DETAILS: `${serverUrl}${apiPrefix}/day/GetDayDetails`,
  GET_DAY_LIST: `${serverUrl}${apiPrefix}/day/getDayList`,
  ADD_DAY: `${serverUrl}${apiPrefix}/day/addDay?userId=`,
  UPDATE_DAY: `${serverUrl}${apiPrefix}/day/updateDay?userId=`,
  DELETE_DAY: `${serverUrl}${apiPrefix}/day/deleteDay?dayId=`,
  APPROVE_DAY: `${serverUrl}${apiPrefix}/day/approveDay?dayId=`,

  GET_COLLECTION_COIN_DETAILS: `${serverUrl}${apiPrefix}/collectionCoin/getCurrencyCoinDetails`,
  GET_COLLECTION_COIN_LIST: `${serverUrl}${apiPrefix}/collectionCoin/LoadCollectionRecords`,
  GET_COLLECTION_SUMMARY : `${serverUrl}${apiPrefix}/collectionCoin/LoadCollectionSummary`,
  GET_COLLECTION_COIN_GALLERY: `${serverUrl}${apiPrefix}/collectionCoin/CollectionGallery`,
  ADD_COLLECTION_COIN: `${serverUrl}${apiPrefix}/collectionCoin/addCurrencyCoin?userId=`,
  UPDATE_COLLECTION_COIN: `${serverUrl}${apiPrefix}/collectionCoin/updateCurrencyCoin?userId=`,
  DELETE_COLLECTION_COIN: `${serverUrl}${apiPrefix}/collectionCoin/daleteCurrencyCoin?dayId=`,
  APPROVE_COLLECTION_COIN: `${serverUrl}${apiPrefix}/collectionCoin/approveDay?dayId=`,

  UPLOAD_IMAGE: `${serverUrl}${apiPrefix}/asset/UploadAndSaveFile?userId=`,
  GET_ASSET_DETAILS: `${serverUrl}${apiPrefix}/asset/getAssetDetail`,

  GET_COMMON_LIST_ITEMS: `${serverUrl}${apiPrefix}/common/getCommonListItems`,
  GET_COUNTRY_LIST: `${serverUrl}${apiPrefix}/common/GetCountryList`,
  // GET_COMMON_LIST_ITEMS: `${serverUrl}${apiPrefix}/common/getCommonListItems?commonListId=`,

  DAYURL: "day/",
  EXPENSEURL: "expense/",
  BUSINESSURL: "business/",
  COMMONURL: "common/",
  AUTHENTICATIONURL: "authentication/",
  LOGINURL: "login/",
  USERURL: "user/",
  ASSETURL: "asset/",
  CURRENCYCOINURL: "CollectionCoin/",
  ATTACHMENT: "../../../assets/ProjectAttatchments", // Should be compared with "PhysicalPathDirectory" in "AppSettings" in DotNet
  COLLECTIONCOINS: "Collection_Coins",
  BIRTHDAYPERSONPIC: "Birthday_Person_Pic",

  GET_LOGGED_IN_USER_DETAILS: `${serverUrl}${apiPrefix}/auth/getloggedinuserdetails`,
  REGISTER_USER: `${serverUrl}${apiPrefix}/auth/register`,
  RESET_PASSWORD: `${serverUrl}${apiPrefix}/auth/resetpassword`,
  CHANGE_PASSWORD: `${serverUrl}${apiPrefix}/auth/changepassword`,
  FORGOT_PASSWORD: `${serverUrl}${apiPrefix}/auth/forgotpassword`,
  DEACTIVATE_USER: `${serverUrl}${apiPrefix}/auth/deactivateuser?userid=`,
  REACTIVATE_USER: `${serverUrl}${apiPrefix}/auth/reactivateuser?userid=`,
  VERIFY_OTP: `${serverUrl}${apiPrefix}/auth/verifyotp?emailId={0}&otpCode={1}`,

  // Client API URLs
  GET_ALL_CLIENTS: `${serverUrl}${apiPrefix}/clients/getclients`,
  GET_CLIENT_DETAILS_BY_ID: `${serverUrl}${apiPrefix}/clients/getclientsbyid?clientId=`,
  ADD_CLIENT: `${serverUrl}${apiPrefix}/clients/addclient`,
  UPDATE_CLIENT: `${serverUrl}${apiPrefix}/clients/updateclient`,

  // Role-Module-Mapping URLs
  UPDATE_ROLE_MODULE_MAPPING: `${serverUrl}${apiPrefix}/rolemodulemapping/updaterolemodulemapping`,
  GET_MODULE_MAPPED_TO_LOGGEDIN_USER: `${serverUrl}${apiPrefix}/rolemodulemapping/getmodulemappedtologgedinuser`,
  GET_ROLE_MODULE_MAPPING_BY_ROLE_ID: `${serverUrl}${apiPrefix}/rolemodulemapping/getmodulemappedbyroleid?roleId=`,

  //chat API URLs
  GET_CHAT_USERS: `${serverUrl}${apiPrefix}/chats/getusersforchat`,
  CHAT_URL: `${serverUrl}/chats/`,

  //Document Api Url
  DOCUMENTS: `${serverUrl}${apiPrefix}/documents`,

  // Notification API URLs
  GET_ALL_SYSTEM_NOTIFICATIONS: `${serverUrl}${apiPrefix}/notification/getnotifications?pageno=`,
  MARK_A_SYSTEM_NOTIFICATION_AS_READ: `${serverUrl}${apiPrefix}/notification/updatenotifications?notificationid=`,
  NOTIFICATION_URL: `${serverUrl}/api/notifications`,
};
