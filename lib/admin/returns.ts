import type { Customer } from './customers'; import type { Order } from './orders';
export type ReturnStatus='requested'|'approved'|'rejected'|'received'|'refunded'|'closed';
export type ReturnRequest={id:string;orderId:string;order:Pick<Order,'id'|'number'>|null;customer:Pick<Customer,'id'|'name'>|null;productId:string;variantId:string|null;reason:string;status:ReturnStatus;refundAmount:number|null;currency:string|null;notes:string[];createdAt:string;updatedAt:string};
export type ReturnMutationResult={ok:false;reason:'persistence_unavailable';message:string};
export interface ReturnService{list(query?:string):Promise<{state:'unavailable'|'live';returns:ReturnRequest[]}>;get(id:string):Promise<ReturnRequest|null>;updateStatus(id:string,status:ReturnStatus):Promise<ReturnMutationResult>;addNote(id:string,note:string):Promise<ReturnMutationResult>;refund(id:string,amount:number,reference:string):Promise<ReturnMutationResult>;}
const unavailable=():ReturnMutationResult=>({ok:false,reason:'persistence_unavailable',message:'Return data is not connected; no return status, note, or refund was recorded.'});
export const returnService:ReturnService={async list(){return{state:'unavailable',returns:[]}},async get(){return null},async updateStatus(){return unavailable()},async addNote(){return unavailable()},async refund(){return unavailable()}};
