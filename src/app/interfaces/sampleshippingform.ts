import {
  ShipmentPackagingDispositionEnums,
  ShippingConditionEnums,
} from './sampleformviewmodel';

export interface ShippingRequest {
  id?: string | null; // Optional, based on C# DTO
  formID: string;
  shippingConditions: ShippingConditionEnums;
  shippingCourierAndTrackingNumber?: string | null;
  shipmentPackagingDisposition: ShipmentPackagingDispositionEnums;
}

export interface ShippingResponse {
  id?: string;
  formID: string;
  shippingConditions: ShippingConditionEnums;
  shippingCourierAndTrackingNumber?: string;
  shipmentPackagingDisposition: ShipmentPackagingDispositionEnums;
}
