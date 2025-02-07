export interface DocumentViewResponse {
    id: string;
    projectId: string;
    roleId: string;
    roleName: string;
    documentIdentifier:string;
    documentType: number;
    documentName: string;
    createdDate: string;
    sampleFormId?: string;
    sampleFormIdentifier?: string;
  }
  