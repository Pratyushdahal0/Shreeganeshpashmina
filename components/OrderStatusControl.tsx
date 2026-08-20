"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const labels: Record<string, string> = { PENDING: "Pending", PAYMENT_PENDING: "Payment pending", PAID: "Paid", PROCESSING: "Processing", PACKED: "Packed", SHIPPED: "Shipped", DELIVERED: "Delivered", CANCELLED: "Cancelled", REFUND_REQUESTED: "Refund requested", REFUNDED: "Refunded" };
const nextStatuses: Record<string, string[]> = { PENDING: ["PAYMENT_PENDING", "PAID", "CANCELLED"], PAYMENT_PENDING: ["PAID", "CANCELLED"], PAID: ["PROCESSING", "REFUND_REQUESTED", "REFUNDED"], PROCESSING: ["PACKED", "CANCELLED"], PACKED: ["SHIPPED"], SHIPPED: ["DELIVERED", "REFUND_REQUESTED"], DELIVERED: ["REFUND_REQUESTED"], CANCELLED: [], REFUND_REQUESTED: ["REFUNDED"], REFUNDED: [] };

export default function OrderStatusControl({ orderId, current }: { orderId: string; current: string }) {
  const router = useRouter(); const choices = nextStatuses[current] || []; const [status, setStatus] = useState(choices[0] || ""); const [note, setNote] = useState(""); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  if (!choices.length) return <p className="muted">This order has reached a final state.</p>;
  async function submit(event: React.FormEvent) { event.preventDefault(); setBusy(true); setError(""); const response = await fetch(`/api/admin/orders/${orderId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status, note: note || undefined }) }); const data = await response.json() as { error?: string }; if (!response.ok) { setError(data.error || "Unable to update this order."); setBusy(false); return; } router.refresh(); }
  return <form className="orderStatusControl" onSubmit={submit}><select className="field" value={status} onChange={(event) => setStatus(event.target.value)}>{choices.map((choice) => <option key={choice} value={choice}>{labels[choice]}</option>)}</select><input className="field" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Internal note (optional)" /><button className="btn dark" disabled={busy}>{busy ? "Updating…" : "Update status"}</button>{status === "SHIPPED" && <p className="statusWarning">Shipping deducts reserved stock from inventory.</p>}{status === "CANCELLED" && <p className="statusWarning">Cancellation releases reserved stock.</p>}{error && <p className="formError">{error}</p>}</form>;
}
