import {
  BioSafetyReqEnums,
  InfectiousAgentsEnums,
  OriginEnums,
  SafetyDataSheetEnums,
} from './sampleformviewmodel';
export interface SafetyFormRequest {
  id?: string | null ;  
  formID: string; 
  bioSafetyRequirement: BioSafetyReqEnums;  
  bioSafetyRequirementOther?: string;  
  origin: OriginEnums; 
  originOther?: string;  
  infectiousAgents: InfectiousAgentsEnums;
  safetyDataSheet: SafetyDataSheetEnums;  
  knownInfectiousAgents?: string;  
  knownInfectiousAgentsOptions?: number;  
  specialHandlingOrStorageInstructions?: string;  
  specialHandlingOrStorageInstructionsOptions?: number;  
  specialDisposalInstructions?: string;  
  specialDisposalInstructionsOptions?: number;  
}

export interface SafetyFormResponse {
  id: string;  // Guid
  formID: string;  // Guid
  bioSafetyRequirement: BioSafetyReqEnums;  // Enum type to be defined
  bioSafetyRequirementOther?: string;  // string | null
  origin: OriginEnums;  // Enum type to be defined
  originOther?: string;  // string | null
  infectiousAgents: InfectiousAgentsEnums;
  safetyDataSheet: SafetyDataSheetEnums;  // Enum type to be defined
  knownInfectiousAgents?: string;  // string | null
  knownInfectiousAgentsOptions?: number;  // short | null
  specialHandlingOrStorageInstructions?: string;  // string | null
  specialHandlingOrStorageInstructionsOptions?: number;  // short | null
  specialDisposalInstructions?: string;  // string | null
  specialDisposalInstructionsOptions?: number;  // short | null
}
