import type { Order } from './orders';
export type PaymentStatus='pending'|'authorized'|'paid'|'failed'|'refunded'|'partially_refunded';
export type Payment={id:string;orderId:string;order:Pick<Order,'id'|'number'>|null;amount:number;currency:string;method:string;transactionReference:string|null;status:PaymentStatus;timestamp:string};
export type PaymentMutationResult={ok:false;reason:'persistence_unavailable';message:string};
export type PaymentProvider='khalti'|'esewa'|'fonepay'|'bank_card'|'bank_transfer';
export interface PaymentService{list(query?:string):Promise<{state:'unavailable'|'live';payments:Payment[]}>;get(id:string):Promise<Payment|null>;refund(id:string,amount:number,reference:string):Promise<PaymentMutationResult>;}
const unavailable=():PaymentMutationResult=>({ok:false,reason:'persistence_unavailable',message:'Payment data is not connected; no transaction or refund was recorded.'});
/** Provider-neutral payment boundary. Khalti, eSewa, Fonepay, bank/card, and transfer adapters are not configured. */
export const paymentService:PaymentService={async list(){return{state:'unavailable',payments:[]}},async get(){return null},async refund(){return unavailable()}};
