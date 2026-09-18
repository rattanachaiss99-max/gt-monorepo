import CheckoutSection from "./CheckoutSection";
import FormField, { inputClassName } from "./FormField";

const methods = [{ id: "card", label: "Credit / Debit Card", icon: "▣" }, { id: "promptpay", label: "PromptPay", icon: "⌗" }, { id: "bank", label: "Bank Transfer", icon: "⌂" }];

export default function PaymentPanel({ paymentMethod, setPaymentMethod, form, onChange }) {
  return <CheckoutSection title="Payment" icon="▤">
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3" role="group" aria-label="Payment method">
      {methods.map((method) => <button key={method.id} type="button" aria-pressed={paymentMethod === method.id} onClick={() => setPaymentMethod(method.id)} className={`flex items-center justify-center gap-2 rounded border px-3 py-3 text-xs font-medium transition ${paymentMethod === method.id ? "border-black font-semibold text-black shadow-sm" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}><span aria-hidden="true">{method.icon}</span>{method.label}</button>)}
    </div>
    {paymentMethod === "card" && <div className="space-y-6">
      <FormField label="Name on Card" id="cardName"><input id="cardName" value={form.cardName} onChange={onChange("cardName")} className={inputClassName} autoComplete="cc-name" /></FormField>
      <FormField label="Card Number" id="cardNumber"><input id="cardNumber" value={form.cardNumber} onChange={onChange("cardNumber")} className={inputClassName} inputMode="numeric" autoComplete="cc-number" /></FormField>
      <div className="grid grid-cols-2 gap-8"><FormField label="Expiry Date" id="expiryDate"><input id="expiryDate" value={form.expiryDate} onChange={onChange("expiryDate")} className={inputClassName} placeholder="MM/YY" autoComplete="cc-exp" /></FormField><FormField label="CVV" id="cvv"><input id="cvv" value={form.cvv} onChange={onChange("cvv")} className={inputClassName} inputMode="numeric" autoComplete="cc-csc" /></FormField></div>
      <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-600"><input type="checkbox" checked={form.saveCard} onChange={onChange("saveCard")} className="h-4 w-4 rounded border-gray-300 text-black focus:ring-0" />Save card for future bookings</label>
    </div>}
    {paymentMethod === "promptpay" && <PaymentNotice>After confirming, a PromptPay QR code will be displayed for this demo booking.</PaymentNotice>}
    {paymentMethod === "bank" && <PaymentNotice>You will receive bank transfer instructions after confirming this demo booking.</PaymentNotice>}
  </CheckoutSection>;
}

function PaymentNotice({ children }) { return <div className="rounded border border-dashed border-gray-300 bg-gray-50 p-5 text-sm leading-relaxed text-gray-600">{children}</div>; }