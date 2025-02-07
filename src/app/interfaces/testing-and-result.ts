export interface Sample {
    sampleNumber: string;
    sampleName: string;
    sampleVolume: string;
    sampleUnits: string;
    recdDate: string;
    description: string;
    condition: string;
    ccbmSampleLot: string;
    cclientSampleID: string;
    status: string;
    testResponses: any;
    textID: any;
    reportnumber: number;
    isCOAPDFButtonEnable: boolean;
}

export interface Test {
    testNumber: string;
    reportedName: string;
    status: string;
    expectedDate: string;
    analysisMethod: string;
    analysis: string;
    resultList: any;
}

export interface Result {
    resultNumber: string;
    resultName: string;
    testNumber: string;
    reportedName: string;
    status: string;
    enteredBy: string;
    reportable: string;
    optional: string;
    formatted_Entry: string;
    in_Spec: string;
    isAuthurized: boolean;
}
