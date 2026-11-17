import { Order } from '../types/restaurant';
import { RESTAURANT_INFO } from '../data/menuData';

export function generateWhatsAppOrderLink(order: Order): string {
  const itemList = order.items
    .map((item, index) => {
      const details = [
        item.selectedSize,
        item.selectedCrust,
        item.selectedPortion,
        item.selectedSpice ? `Spice: ${item.selectedSpice}` : null,
        item.selectedAddOns.length > 0
          ? `Addons: ${item.selectedAddOns.map((a) => a.name).join(', ')}`
          : null,
        item.instructions ? `Note: "${item.instructions}"` : null,
      ]
        .filter(Boolean)
        .join(' | ');

      return `${index + 1}. *${item.name}* (x${item.quantity}) - Rs. ${item.itemTotal}${
        details ? `\n   ↳ _${details}_` : ''
      }`;
    })
    .join('\n\n');

  const paymentText =
    order.paymentMethod === 'cash_on_delivery'
      ? 'Cash on Delivery (COD)'
      : 'Online Bank / EasyPaisa / JazzCash';

  const typeText =
    order.customer.orderType === 'delivery'
      ? `Home Delivery (${order.customer.areaName || 'Standard Delivery'} · ${order.customer.distanceKm || 2.2} km)`
      : 'Self Pickup / Takeaway';

  const text = `Hello A. FOODS! 🍕🍗
I would like to place an order from your website:

Order ID: #${order.orderId}
Order Type: ${typeText}
Payment Method: ${paymentText}

Order Items:
${itemList}

───────────────────
Subtotal: Rs. ${order.subtotal}
Delivery Fee: ${order.deliveryFee === 0 ? 'FREE' : `Rs. ${order.deliveryFee}`}
${order.discount > 0 ? `Discount: -Rs. ${order.discount}\n` : ''}Total Amount: Rs. ${order.total}
───────────────────

Customer Details:
• Name: ${order.customer.fullName}
• Phone: ${order.customer.phone}
${order.customer.orderType === 'delivery' ? `• Address: ${order.customer.address}\n• Landmark: ${order.customer.landmark || 'None'}` : ''}
${order.customer.notes ? `• Special Instructions: ${order.customer.notes}` : ''}

Please confirm my order and share estimated delivery time. Thank you!`;

  return `https://wa.me/${RESTAURANT_INFO.phoneClean.replace('+', '')}?text=${encodeURIComponent(text)}`;
}

export function generateGeneralWhatsAppInquiryLink(): string {
  const text = `Hello A. FOODS! 
I am visiting your website and have a question regarding menu, orders or delivery:`;
  return `https://wa.me/${RESTAURANT_INFO.phoneClean.replace('+', '')}?text=${encodeURIComponent(text)}`;
}

export function generateOrderTrackingWhatsAppLink(orderId: string): string {
  const text = `Hello A. FOODS! 
Could you please provide an update on my Order #${orderId}?`;
  return `https://wa.me/${RESTAURANT_INFO.phoneClean.replace('+', '')}?text=${encodeURIComponent(text)}`;
}
