export interface InformationFormRequest {
  id?: string | null;
  formID: string | null;
  quantity: number | null;
  sampleVolume: number | null;
  containerVolume: number | null;
  containerType: string;
  clientSampleID: string;
  sampleDescription: string;
  sampleLotNumber: string;
  sampleUnits: number | null;
  protocolNameAndNumber: string;
  storageCondition: number | null;
  comments?: string | null;
}

export interface InformationFormResponse {
  id: string;
  formID: string;
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
  comments?: string;
}
