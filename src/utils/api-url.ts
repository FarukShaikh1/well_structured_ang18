import { environment } from "../environments/environment";

const serverUrl = environment.serverUrl;
const apiPrefix = environment.apiPrefix;

export const API_URL = {
  // Verified APIs
  //Expense
  GET_EXPENSE_LIST: `${serverUrl}${apiPrefix}/expense/GetList`,
  GET_EXPENSE_DETAILS: `${serverUrl}${apiPrefix}/expense/GetDetails`,
  GET_EXPENSE_SUGGESTION_LIST: `${serverUrl}${apiPrefix}/expense/GetExpenseSuggestionList`,
  ADD_EXPENSE: `${serverUrl}${apiPrefix}/expense/add?userId=`,
  UPDATE_EXPENSE: `${serverUrl}${apiPrefix}/expense/update?userId=`,
  DELETE_EXPENSE: `${serverUrl}${apiPrefix}/expense/delete?expenseId=`,
  GET_EXPENSE_SUMMARY_LIST: `${serverUrl}${apiPrefix}/expense/GetSummary`,
  GET_EXPENSE_REPORT_LIST: `${serverUrl}${apiPrefix}/expense/GetReport`,

  //CommonList
  GET_COMMON_LIST_ITEMS: `${serverUrl}${apiPrefix}/commonList/getCommonListItem`,

  //Special Occasion
  GET_SPECIAL_OCCASION_DETAILS: `${serverUrl}${apiPrefix}/SpecialOccasion/GetDetails`,
  GET_SPECIAL_OCCASION_LIST: `${serverUrl}${apiPrefix}/SpecialOccasion/GetList`,
  ADD_SPECIAL_OCCASION: `${serverUrl}${apiPrefix}/SpecialOccasion/add?userId=`,
  UPDATE_SPECIAL_OCCASION: `${serverUrl}${apiPrefix}/SpecialOccasion/update?userId=`,
  DELETE_SPECIAL_OCCASION: `${serverUrl}${apiPrefix}/SpecialOccasion/delete?dayId=`,

  //Asset
  GET_ASSET_DETAILS: `${serverUrl}${apiPrefix}/asset/getAssetDetails`,

  GET_COLLECTION_COIN_LIST: `${serverUrl}${apiPrefix}/coinNoteCollection/GetList`,
  //Asset
  UPLOAD_IMAGE: `${serverUrl}${apiPrefix}/asset/UploadAndSaveFile?userId=`,

  GET_COUNTRY_LIST: `${serverUrl}${apiPrefix}/commonList/GetCountryList`,
  GET_COLLECTION_COIN_DETAILS: `${serverUrl}${apiPrefix}/coinNoteCollection/GetDetails`,
  GET_USER_PERMISSIONS: `${serverUrl}${apiPrefix}/user/GetUserPermission?userId=`,












  //Non verified 



  // Auth and User API URLs
  AUTHENTICATE_USER: `${serverUrl}${apiPrefix}/auth/login`,

  //user
  GET_ALL_USERS: `${serverUrl}${apiPrefix}/user/GetList`,
  LOGIN: `${serverUrl}${apiPrefix}/user/Login`,
  GET_USER: `${serverUrl}${apiPrefix}/user/GetUser`,
  UPDATE_USER: `${serverUrl}${apiPrefix}/user/updateUserDetails?userId=`,
  Get_USER_BY_USER_ID: `${serverUrl}${apiPrefix}/user/getUserByUserId?userId=`,
  Get_USER_DETAILS: `${serverUrl}${apiPrefix}/user/GetDetails?userId=`,
  Get_USER_LIST: `${serverUrl}${apiPrefix}/user/getUserList?userId=`,
  GET_ALL_ROLES: `${serverUrl}${apiPrefix}/role/GetList`,


  EXPENSE_ADJUSTMENT: `${serverUrl}${apiPrefix}/expense/expenseAdjustment?userId=`,
  GET_SOURCES_REASONS_LIST: `${serverUrl}${apiPrefix}/expense/GetSourceOrReasonList`,
  GET_DESCRIPTION_LIST: `${serverUrl}${apiPrefix}/expense/GetDescriptionList`,
  GET_PURPOSE_LIST: `${serverUrl}${apiPrefix}/expense/GetPurposeList`,
  GET_AVAIL_AMOUNT: `${serverUrl}${apiPrefix}/expense/getAvailAmount`,
  DOWNLOAD_EXPENSE_LIST: `${serverUrl}${apiPrefix}/expense/DownloadExpenseList`,

  //Business
  GET_BUSINESS_DETAILS: `${serverUrl}${apiPrefix}/business/GetBusinessDetails`,
  ADD_BUSINESS: `${serverUrl}${apiPrefix}/business/addBusiness?userId=`,
  UPDATE_BUSINESS: `${serverUrl}${apiPrefix}/business/updateBusiness?userId=`,
  DELETE_BUSINESS: `${serverUrl}${apiPrefix}/business/deleteBusiness?businessId=`,
  BUSINESS_ADJUSTMENT: `${serverUrl}${apiPrefix}/business/businessAdjustment?userId=`,
  GET_BUSINESS_LIST: `${serverUrl}${apiPrefix}/business/GetList`,
  GET_BUSINESS_SUGGESTION_LIST: `${serverUrl}${apiPrefix}/business/GetBusinessSuggestionListItems`,
  GET_BUSINESS_SUMMARY_LIST: `${serverUrl}${apiPrefix}/business/getBusinessSummaryList`,
  GET_BUSINESS_REPORT_LIST: `${serverUrl}${apiPrefix}/business/getBusinessReportList`,


  APPROVE_SPECIAL_OCCASION: `${serverUrl}${apiPrefix}/SpecialOccasion/approveDay?dayId=`,

  //CoinNoteCollection
  GET_COLLECTION_SUMMARY: `${serverUrl}${apiPrefix}/coinNoteCollection/GetSummary`,
  GET_COLLECTION_COIN_GALLERY: `${serverUrl}${apiPrefix}/coinNoteCollection/CollectionGallery`,
  ADD_COLLECTION_COIN: `${serverUrl}${apiPrefix}/coinNoteCollection/add?userId=`,
  UPDATE_COLLECTION_COIN: `${serverUrl}${apiPrefix}/coinNoteCollection/update?userId=`,
  DELETE_COLLECTION_COIN: `${serverUrl}${apiPrefix}/coinNoteCollection/delete?coinNoteCollectionId=`,
  APPROVE_COLLECTION_COIN: `${serverUrl}${apiPrefix}/coinNoteCollection/approve?coinNoteCollectionId=`,

  // GET_COMMON_LIST_ITEMS: `${serverUrl}${apiPrefix}/commonList/getCommonListItems?commonListId=`,

  DAYURL: "SpecialOccasion/",
  EXPENSEURL: "expense/",
  BUSINESSURL: "business/",
  COMMONURL: "commonList/",
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

  // user-permission URLs
  UPDATE_ROLE_MODULE_MAPPING: `${serverUrl}${apiPrefix}/userPermissions/updaterolemodulemapping`,
  GET_MODULE_MAPPED_TO_LOGGEDIN_USER: `${serverUrl}${apiPrefix}/userPermissions/getmodulemappedtologgedinuser`,
  GET_ROLE_MODULE_MAPPING_BY_ROLE_ID: `${serverUrl}${apiPrefix}/userPermissions/getmodulemappedbyroleid?roleId=`,

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
