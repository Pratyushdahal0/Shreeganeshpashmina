"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Icon } from "./Icons";
import { Product, currencies, rates } from "@/lib/data";

export type CartLine = { product: Product; qty: number };

export default function CartDrawer({
  open,
  onClose,
  lines,
  onQty,
}: {
  open: boolean;
  onClose: () => void;
  lines: CartLine[];
  onQty: (id: string, n: number) => void;
}) {
  const [currency, setCurrency] = useState<keyof typeof currencies>("USD");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const sync = () =>
      setCurrency(
        (localStorage.getItem("sgp-currency") as keyof typeof currencies) ||
          "USD",
      );
    sync();
    addEventListener("currencychange", sync);
    return () => removeEventListener("currencychange", sync);
  }, []);
  const total = lines.reduce(
    (sum, line) => sum + line.product.price * line.qty,
    0,
  );
  const c = currencies[currency];
  const money = (value: number) =>
    `${c.symbol}${Math.round(value * rates[currency]).toLocaleString()}`;
  const message = `Hello Shree Ganesh Pashmina, I would like to place an order.\n\n${lines.map((line) => `• ${line.product.name} × ${line.qty} — ${money(line.product.price * line.qty)}`).join("\n")}\n\nEstimated total: ${money(total)}\nCurrency: ${currency}`;
  async function submit() {
    if (!name.trim()) {
      setError("Please add your name.");
      return;
    }
    setSending(true);
    setError("");
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "CART",
          customerName: name,
          customerPhone: phone,
          productIds: lines.map((line) => line.product.id),
          message,
          currency,
          region: localStorage.getItem("sgp-region") || undefined,
        }),
      });
      const data = (await response.json()) as {
        whatsappUrl?: string;
        error?: string;
      };
      if (!response.ok || !data.whatsappUrl)
        throw new Error(data.error || "Unable to save your enquiry.");
      window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to save your enquiry.",
      );
    } finally {
      setSending(false);
    }
  }
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="drawerBackdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="drawerHeader">
              <span className="eyebrow">Your bag · {lines.length}</span>
              <button className="iconBtn" onClick={onClose}>
                <Icon name="x" />
              </button>
            </div>
            <div className="drawerBody">
              {lines.length === 0 ? (
                <div style={{ paddingTop: 60, textAlign: "center" }}>
                  <p className="serif" style={{ fontSize: 32 }}>
                    Your bag is quiet.
                  </p>
                  <p className="muted">
                    Add a piece and continue through WhatsApp.
                  </p>
                </div>
              ) : (
                lines.map((line) => (
                  <div className="cartItem" key={line.product.id}>
                    <img src={line.product.image} alt="" />
                    <div>
                      <div className="productName">{line.product.name}</div>
                      <div className="productMaterial">
                        {line.product.material}
                      </div>
                      <div className="qty">
                        <button
                          onClick={() => onQty(line.product.id, line.qty - 1)}
                        >
                          <Icon name="minus" size="xs" />
                        </button>
                        <span>{line.qty}</span>
                        <button
                          onClick={() => onQty(line.product.id, line.qty + 1)}
                        >
                          <Icon name="plus" size="xs" />
                        </button>
                      </div>
                    </div>
                    <div style={{ fontSize: 13 }}>
                      {money(line.product.price * line.qty)}
                    </div>
                  </div>
                ))
              )}
            </div>
            {lines.length > 0 && (
              <div className="drawerFooter">
                <div className="total">
                  <span>Estimated total</span>
                  <strong>{money(total)}</strong>
                </div>
                <input
                  className="field"
                  placeholder="Your name *"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
                <input
                  className="field"
                  placeholder="Phone (optional)"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  style={{ marginTop: 8 }}
                />
                {error && <p className="formError">{error}</p>}
                <button
                  className="btn dark"
                  style={{
                    justifyContent: "center",
                    width: "100%",
                    marginTop: 10,
                  }}
                  onClick={submit}
                  disabled={sending}
                >
                  {sending ? "Saving enquiry…" : "Continue via WhatsApp"}{" "}
                  <Icon name="whatsapp" />
                </button>
                <p
                  className="muted"
                  style={{ fontSize: 10, lineHeight: 1.6, marginTop: 12 }}
                >
                  Final shipping cost and payment instructions will be confirmed
                  in WhatsApp. Online payment is not enabled in V1.
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
