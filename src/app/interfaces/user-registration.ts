export interface UserRegistration {
  id: string;

  dateOfBirth: string;
  name: string;
  email: string;
  mobileNumber?: string;
  address?: string;
  profilePhoto?: string;

  emailVerified: boolean;
  status: string;

  rejectionReason?: string;

  approvedBy?: string;
  approvedOn?: string;

  createdOn?: string;
  modifiedOn?: string;
}