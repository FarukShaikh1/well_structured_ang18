export interface SampleDetailRequest {
  id?: string | null; // Make 'id' optional and nullable
  projectID: string;
  clientID: string;
  limsProjectID?: string | null;
  name: string;
  phoneNumber: string | null;
  emailID: string;
  plannedShippingDate: string | null; // Use string for date in ISO format
  sapClientProjectID: string;
}

export interface SampleDetailResponse {
  id: string;
  name: string;
  phoneNumber: string;
  emailID: string;
  plannedShippingDate: string; // Date in string format
  sapClientProjectID: string;
}
