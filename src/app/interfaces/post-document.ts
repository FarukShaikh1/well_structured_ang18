import { DocumentTypesEnums } from '../enums/document-type-enums';

export interface DocumentRequest {
    file: File;                     
    projectID: string;              
    roleIDs: string[];             
    documentType: DocumentTypesEnums; 
    documentName: string;
    documentDescription?: string;   
    sampleFormID?: string;          
  }
  
  export interface DocumentResponse {
    id: string;                     
    projectID: string;
    roleIDs: string[];
    documentType: DocumentTypesEnums;
    documentName: string;
    documentDescription?: string;
    sampleFormID?: string;
  }
  
 