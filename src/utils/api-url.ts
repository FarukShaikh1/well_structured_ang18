import { environment } from "../environments/environment";

const serverUrl = environment.serverUrl;
const apiPrefix = environment.apiPrefix;

export const API_URL = {
  // Verified APIs
  ATTACHMENT: "../../../assets/ProjectAttatchments", // Should be compared with "PhysicalPathDirectory" in "AppSettings" in DotNet
  COLLECTIONCOINS: "Collection_Coins",
  BIRTHDAYPERSONPIC: "Birthday_Person_Pic",

  GET_ASSET_DETAILS: `${serverUrl}${apiPrefix}/asset/getAssetDetails`,
  UPLOAD_IMAGE: `${serverUrl}${apiPrefix}/asset/UploadAndSaveFile?userId=`,
  GET_COLLECTION_COIN_GALLERY: `${serverUrl}${apiPrefix}/coinNoteCollection/CollectionGallery`,
  GET_COLLECTION_COIN_LIST: `${serverUrl}${apiPrefix}/coinNoteCollection/GetList`,
  GET_COLLECTION_SUMMARY: `${serverUrl}${apiPrefix}/coinNoteCollection/GetSummary`,
  GET_COLLECTION_COIN_DETAILS: `${serverUrl}${apiPrefix}/coinNoteCollection/GetDetails`,
  ADD_COLLECTION_COIN: `${serverUrl}${apiPrefix}/coinNoteCollection/add?userId=`,
  UPDATE_COLLECTION_COIN: `${serverUrl}${apiPrefix}/coinNoteCollection/update?userId=`,
  DELETE_COLLECTION_COIN: `${serverUrl}${apiPrefix}/coinNoteCollection/delete?coinNoteCollectionId=`,

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
  GET_AVAIL_AMOUNT: `${serverUrl}${apiPrefix}/expense/getAvailAmount`,

  GET_COMMON_LIST_ITEMS: `${serverUrl}${apiPrefix}/commonList/getCommonListItems?commonListId=`,
  GET_COUNTRY_LIST: `${serverUrl}${apiPrefix}/commonList/GetCountryList`,
  GET_USER_PERMISSIONS: `${serverUrl}${apiPrefix}/user/GetUserPermission?userId=`,
  GET_ALL_ROLES: `${serverUrl}${apiPrefix}/role/GetList`,
  UPDATE_USER_PERMISSION: `${serverUrl}${apiPrefix}/user/updaterolemodulemapping`,

  AUTHENTICATE_USER: `${serverUrl}${apiPrefix}/auth/login`,
  GET_ALL_USERS: `${serverUrl}${apiPrefix}/user/GetList`,
  GET_LOGGED_IN_USER_DETAILS: `${serverUrl}${apiPrefix}/auth/getloggedinuserdetails`,
  Get_USER_DETAILS: `${serverUrl}${apiPrefix}/user/GetDetails?userId=`,


  // //Non verified 
  REGISTER_USER: `${serverUrl}${apiPrefix}/auth/register`,
  UPDATE_USER: `${serverUrl}${apiPrefix}/user/updateUserDetails?userId=`,
  RESET_PASSWORD: `${serverUrl}${apiPrefix}/auth/resetpassword`,
  CHANGE_PASSWORD: `${serverUrl}${apiPrefix}/auth/changepassword`,
  FORGOT_PASSWORD: `${serverUrl}${apiPrefix}/auth/forgotpassword`,
  VERIFY_OTP: `${serverUrl}${apiPrefix}/auth/verifyotp?emailId={0}&otpCode={1}`,
  LOGIN: `${serverUrl}${apiPrefix}/user/Login`,
};
