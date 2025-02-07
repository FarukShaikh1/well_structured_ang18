export interface Project {
  id: string | null | undefined,
  projectName: string;
  sampleTrackingSystemId: string,
  formTypeId: string,
  ApplicationAssociateId: string | null | undefined,
  // startDate: string | null | undefined,
  // endDate: string | null | undefined,
  status: number | null | undefined;
  clientId: string | null | undefined,
}
