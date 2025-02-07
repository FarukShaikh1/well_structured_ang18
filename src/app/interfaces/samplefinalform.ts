export interface FinalFormRequest {
  Id: string | null;
  FormID: string;
  AuthorizationSignature: File | null;
  AuthorizationDate: Date | null;
  UpdatedStatus: string;
  signature: string;
  hasAgreedOnTnC: boolean;
}

// Interface for the response parameters
export interface FinalFormResponse {
  Id: string;
  FormID: string;
  AuthorizationDate: Date;
}
