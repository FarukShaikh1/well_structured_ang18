// Enum definitions
export enum BioSafetyReqEnums {
  BSL1 = 0,
  BSL2,
  BSL2Plus,
  Other,
}

export enum OriginEnums {
  Mammalian = 0,
  Insect,
  Human,
  Other,
}

export enum RegulatoryTypesEnums {
  GMP = 0,
  NonGMP,
  Other,
}

export enum SafetyDataSheetEnums {
  SafetyDataSheetAttached = 0,
  AlternateSafetyDocumentOrArticle,
  NA,
}

export enum SampleDispositionEnums {
  Discard = 0,
  DiscardPerRequest,
  Return,
}

export enum SampleFormStatusEnums {
  Draft = 0,
  Submitted,
  UnderReview,
  TestingInProgress,
  Completed
}

export enum SampleTypesEnums {
  Production = 0,
  UnpurifiedBulk,
  MasterCellBank,
  DrugProduct,
  WorkingViralBank,
  MasterViralBank,
  DrugSubstance,
  WorkingCellBank,
  Other,
}

export enum ShipmentPackagingDispositionEnums {
  NoTemplateIncluded = 0,
  TemplateToBeReadAndDisposed,
  TemplateToBeReturned,
  ReturnShippingContainer,
}

export enum ShippingConditionEnums {
  NA = 0,
  Ambient,
  Icepack,
  DryIce,
  LiquidNitrogen,
  Coldpack5,
}

export enum SpecificationsEnums {
  TestingSpecificationMemoAttached = 0,
  NA,
}

export enum TurnAroundTimeEnums {
  Standard = 0,
  Rush,
  STAT,
}

export enum InfectiousAgentsEnums {
  Yes = 0,
  No,
  NA
}

// Interface definitions

export interface CommonResponseModel<T> {
  data: T;
  success: boolean;
  message: string;
}

export interface SampleDetailsFormViewModel {
  id: string;
  projectID?: string;
  clientID?: string;
  limsProjectID?: string | null;
  name: string;
  phoneNumber: string;
  emailID: string;
  plannedShippingDate?: Date;
  sapClientProjectID: string;
  status: SampleFormStatusEnums;
  sampleSubmissionForm?: SampleSubmissionFormViewModel | null;
  sampleSafetyForm?: SampleSafetyFormViewModel | null;
  sampleShippingForm?: SampleShippingFormViewModel | null;
  sampleInformationForm?: SampleInformationFormViewModel[] | null;
  sampleFinalForm?: SampleFinalFormViewModel | null;
}

export interface SampleSubmissionFormViewModel {
  id: string;
  formID: string;
  sampleDisposition: SampleDispositionEnums;
  regulatoryType: RegulatoryTypesEnums;
  specification: SpecificationsEnums;
  regulatoryTypeOther?: string | null;
  sampleTypes?: { [key: number]: string } | null; // Dictionary<int, string> equivalent
  sampleTypeOther?: string | null;
  turnAroundTimeOptions: TurnAroundTimeEnums;
  turnAroundTime: Date;
}

export interface SampleSafetyFormViewModel {
  id: string;
  formID: string;
  bioSafetyRequirement: BioSafetyReqEnums;
  origin: OriginEnums;
  safetyDataSheet: SafetyDataSheetEnums;
  infectiousAgents: InfectiousAgentsEnums;
  specialHandlingOrStorageInstructions?: string | null;
  specialDisposalInstructions?: string | null;
  bioSafetyRequirementOther?: string | null;
  originOther?: string | null;
  knownInfectiousAgents?: string | null;
  knownInfectiousAgentsOptions?: number | null;
  specialHandlingOrStorageInstructionsOptions?: number | null;
  specialDisposalInstructionsOptions?: number | null;
}

export interface SampleShippingFormViewModel {
  id: string;
  formID: string;
  shippingConditions: ShippingConditionEnums;
  shipmentPackagingDisposition: ShipmentPackagingDispositionEnums;
  shippingCourierAndTrackingNumber?: string | null;
}

export interface SampleInformationFormViewModel {
  id: string;
  quantity: number;
  sampleVolume: number;
  containerVolume: number;
  containerType: string;
  clientSampleID: string;
  sampleDescription: string;
  sampleLotNumber: string;
  sampleUnits: number;
  protocolNameAndNumber: string;
  storageCondition: number;
  comments?: string | null;
}

export interface SampleFinalFormViewModel {
  id: string;
  authorizationSignature: string;
  authorizationDate: Date;
  signature: string;
  hasAgreedOnTnC: boolean;
}
export interface SampleFormReportResponse {
  status: SampleFormStatusEnums;
  count: number;
  totalSampleForm: number;
}

export interface ReportResponse {
  sampleReport: SampleFormReportResponse[];
  projectReports: ProjectReportResponse[];
}

export interface ProjectReportResponse {
  status: ProjectStatus; // Matches the enum defined above
  count: number;
  totalProject: number;
}
export enum ProjectStatus {
  Active = 0,
  Inactive = 1,
}


