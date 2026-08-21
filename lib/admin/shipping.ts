import type { Order } from './orders';
export type ShipmentStatus='pending'|'packed'|'shipped'|'delivered'|'failed'|'returned';
export type ShippingZone={id:string;name:string;countryCodes:string[];deliveryCharge:number|null;freeShippingThreshold:number|null;estimatedDelivery:string|null;active:boolean|null};
export type ShippingMethod={id:string;zoneId:string;name:string;deliveryCharge:number|null;estimatedDelivery:string|null;active:boolean|null};
export type Shipment={id:string;orderId:string;order:Pick<Order,'id'|'number'>|null;methodId:string|null;trackingReference:string|null;status:ShipmentStatus;createdAt:string;updatedAt:string};
export type ShippingMutationResult={ok:false;reason:'persistence_unavailable';message:string};
export interface ShippingService{zones():Promise<{state:'unavailable'|'live';zones:ShippingZone[]}>;shipments(query?:string):Promise<{state:'unavailable'|'live';shipments:Shipment[]}>;updateShipment(id:string,status:ShipmentStatus,trackingReference?:string):Promise<ShippingMutationResult>;updateZone(id:string,input:Partial<ShippingZone>):Promise<ShippingMutationResult>;}
const unavailable=():ShippingMutationResult=>({ok:false,reason:'persistence_unavailable',message:'Shipping data is not connected; no zone, delivery charge, tracking reference, or shipment status was saved.'});
/** Nepal-first, international-extensible shipping boundary; no delivery provider or rates are configured. */
export const shippingService:ShippingService={async zones(){return{state:'unavailable',zones:[]}},async shipments(){return{state:'unavailable',shipments:[]}},async updateShipment(){return unavailable()},async updateZone(){return unavailable()}};
