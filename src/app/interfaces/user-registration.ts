export interface UserRegistration {
  id: string | null;
  dateOfBirth: string;
  name: string;
  email: string;
  mobileNumber: string;
  address: string;
  profilePhoto?: string;
}