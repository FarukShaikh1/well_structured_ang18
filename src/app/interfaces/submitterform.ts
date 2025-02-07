import {
  RegulatoryTypesEnums,
  SampleDispositionEnums,
  SampleTypesEnums,
  SpecificationsEnums,
  TurnAroundTimeEnums,
} from './sampleformviewmodel';

// Define the interface for the request object
export interface SubmitterRequest {
  id?: string | null; // Optional Guid
  formID: string; // Required Guid
  sampleDisposition: SampleDispositionEnums; // Required SampleDispositionEnums
  regulatoryType: RegulatoryTypesEnums; // Required RegulatoryTypesEnums
  regulatoryTypeOther?: string | null; // Optional
  sampleType: SampleTypesEnums[]; // Required array of SampleTypesEnums
  sampleTypeOther?: string | null; // Optional
  specification: SpecificationsEnums; // Required SpecificationsEnums
  turnAroundTimeOptions: TurnAroundTimeEnums; // Required TurnAroundTimeEnums
  turnAroundTime: string | null; // Required Date
  
}

// Define the interface for the response object
export interface SubmitterResponse {
  id: string; // Required Guid
  formID: string; // Required Guid
  sampleDisposition: SampleDispositionEnums; // Required SampleDispositionEnums
  regulatoryType: RegulatoryTypesEnums; // Required RegulatoryTypesEnums
  regulatoryTypeOther?: string | null; // Optional
  sampleType: SampleTypesEnums[]; // Required array of SampleTypesEnums
  sampleTypeOther?: string | null; // Optional
  specification: SpecificationsEnums; // Required SpecificationsEnums
  turnAroundTimeOptions: TurnAroundTimeEnums; // Required TurnAroundTimeEnums
  turnAroundTime: Date; // Required Date
}
