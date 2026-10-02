import { Transaction } from '../types';

/**
 * Formats a clean, readable text receipt for messaging apps and social media
 */
export function getFormattedReceiptText(tx: Transaction, isAr: boolean): string {
  const amountFormatted = Math.abs(tx.amount).toLocaleString('en-US');
  const typeLabel = isAr ? tx.title : tx.titleEn;
  const statusLabel = isAr ? 'ناجحة ومكتملة ✓' : 'Completed Successfully ✓';
  const currencyLabel = isAr ? 'جنيه سوداني' : 'SDG';

  const recipientDisplay = tx.recipientName || tx.title;
  const accountDisplay = tx.recipientAccount || tx.recipientPhone || 'حساب ساهل';

  if (isAr) {
    return (
`🟡 *إشعار مالي معتمد — تطبيق ساهل*
━━━━━━━━━━━━━━━━━━
📌 *نوع العملية:* ${typeLabel}
💰 *المبلغ:* ${amountFormatted} ${currencyLabel}
👤 *المستلم / صاحب الحساب:* ${recipientDisplay}
🔢 *رقم الحساب:* ${accountDisplay}
🏷️ *رقم الإشعار المرجعي:* ${tx.referenceNo}
⏱️ *التاريخ والوقت:* ${tx.date} · ${tx.time}
✨ *الرسوم المصرفية:* 0 جنيه (مجاناً)
🟢 *حالة العملية:* ${statusLabel}
━━━━━━━━━━━━━━━━━━
⚡ *ساهل — أموالك أقرب وأسهل*
_ملاحظة: هذا التطبيق نموذج أولي تجريبي (Prototype)_`
    );
  }

  return (
`🟡 *SAHEL — Verified Financial Receipt*
━━━━━━━━━━━━━━━━━━
📌 *Type:* ${typeLabel}
💰 *Amount:* ${amountFormatted} ${currencyLabel}
👤 *Account Owner / Recipient:* ${recipientDisplay}
🔢 *Account ID:* ${accountDisplay}
🏷️ *Reference No:* ${tx.referenceNo}
⏱️ *Date & Time:* ${tx.date} · ${tx.time}
✨ *Bank Fee:* 0 SDG (Free)
🟢 *Status:* ${statusLabel}
━━━━━━━━━━━━━━━━━━
⚡ *SAHEL — Your Money Closer & Easier*
_Note: Demonstration prototype only_`
  );
}

/**
 * Share via WhatsApp directly
 */
export function shareViaWhatsApp(tx: Transaction, isAr: boolean): void {
  const text = getFormattedReceiptText(tx, isAr);
  const encoded = encodeURIComponent(text);
  const url = `https://api.whatsapp.com/send?text=${encoded}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Share via Telegram directly
 */
export function shareViaTelegram(tx: Transaction, isAr: boolean): void {
  const text = getFormattedReceiptText(tx, isAr);
  const encoded = encodeURIComponent(text);
  const url = `https://t.me/share/url?text=${encoded}&url=`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Native Device Share (Web Share API) with Clipboard fallback
 */
export async function shareReceiptNative(
  tx: Transaction,
  isAr: boolean
): Promise<{ success: boolean; method: 'native' | 'clipboard' }> {
  const text = getFormattedReceiptText(tx, isAr);
  const title = isAr ? 'إشعار مالي معتمد — ساهل' : 'SAHEL Transaction Receipt';

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title,
        text,
      });
      return { success: true, method: 'native' };
    } catch {
      // User cancelled or share failed, fallback to clipboard
    }
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    return { success: true, method: 'clipboard' };
  }

  return { success: false, method: 'clipboard' };
}

/**
 * Generates and downloads a sharp, high-resolution PNG receipt image
 * using client-side HTML5 Canvas.
 */
export function downloadReceiptAsImage(tx: Transaction, isAr: boolean): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const scale = 2; // For Retina / High DPI sharpness
      const width = 640;
      const height = 860;

      const canvas = document.createElement('canvas');
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve(false);
        return;
      }

      ctx.scale(scale, scale);

      // 1. Background (Branded warm amber)
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(0, 0, width, height);

      // Inner card container
      const margin = 20;
      const cardWidth = width - margin * 2;
      const cardHeight = height - margin * 2;

      ctx.fillStyle = '#fef3c7'; // Amber-100
      ctx.fillRect(margin, margin, cardWidth, cardHeight);

      // Card border
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      ctx.strokeRect(margin, margin, cardWidth, cardHeight);

      // 2. Header Box (Black header with gold text)
      ctx.fillStyle = '#000000';
      ctx.fillRect(margin, margin, cardWidth, 120);

      // Brand Wordmark & Logo
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 36px "Segoe UI", Tahoma, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ساهل  SAHEL', width / 2, margin + 48);

      ctx.font = 'bold 16px "Segoe UI", Tahoma, Arial, sans-serif';
      ctx.fillStyle = '#fef3c7';
      ctx.fillText('قروشك أقرب وأسهل — إشعار تحويل مالي معتمد', width / 2, margin + 82);

      ctx.font = '12px "Segoe UI", Tahoma, Arial, sans-serif';
      ctx.fillStyle = '#f59e0b';
      ctx.fillText('OFFICIAL TRANSACTION RECEIPT', width / 2, margin + 104);

      // 3. Amount Display Card
      const amountBoxY = margin + 140;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(margin + 20, amountBoxY, cardWidth - 40, 100);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.strokeRect(margin + 20, amountBoxY, cardWidth - 40, 100);

      ctx.fillStyle = '#666666';
      ctx.font = 'bold 13px "Segoe UI", Tahoma, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(isAr ? 'المبلغ المحوّل' : 'TRANSACTION AMOUNT', width / 2, amountBoxY + 30);

      ctx.fillStyle = '#000000';
      ctx.font = 'bold 40px "Segoe UI", Tahoma, Arial, sans-serif';
      const amountStr = `${Math.abs(tx.amount).toLocaleString('en-US')} SDG`;
      ctx.fillText(amountStr, width / 2, amountBoxY + 76);

      // 4. Details Table
      const tableY = amountBoxY + 120;
      const details = [
        {
          label: isAr ? 'نوع العملية' : 'Transaction Type',
          value: isAr ? tx.title : tx.titleEn,
        },
        {
          label: isAr ? 'صاحب الحساب المستلم' : 'Recipient Name',
          value: tx.recipientName || tx.title,
        },
        {
          label: isAr ? 'رقم الحساب' : 'Account Number',
          value: tx.recipientAccount || tx.recipientPhone || 'SH-992011',
        },
        {
          label: isAr ? 'رقم الإشعار المرجعي' : 'Reference Number',
          value: tx.referenceNo,
        },
        {
          label: isAr ? 'التاريخ والوقت' : 'Date & Time',
          value: `${tx.date} · ${tx.time}`,
        },
        {
          label: isAr ? 'الرسوم المصرفية' : 'Bank Fee',
          value: isAr ? '0 جنيه (مجاناً)' : '0 SDG (Free)',
        },
        {
          label: isAr ? 'حالة التحويل' : 'Transfer Status',
          value: isAr ? 'ناجحة ومكتملة فوراً ✓' : 'Completed Successfully ✓',
        },
      ];

      const rowHeight = 44;
      details.forEach((item, index) => {
        const currentY = tableY + index * rowHeight;

        // Alternate row background
        if (index % 2 === 0) {
          ctx.fillStyle = '#fae8b2';
          ctx.fillRect(margin + 20, currentY, cardWidth - 40, rowHeight);
        }

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.strokeRect(margin + 20, currentY, cardWidth - 40, rowHeight);

        // Text
        ctx.font = 'bold 13px "Segoe UI", Tahoma, Arial, sans-serif';
        ctx.fillStyle = '#444444';
        ctx.textAlign = 'right';
        ctx.fillText(item.label, margin + cardWidth - 36, currentY + 28);

        ctx.font = 'bold 14px "Segoe UI", Tahoma, Arial, sans-serif';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'left';
        // Truncate if too long
        const displayVal = item.value.length > 32 ? item.value.slice(0, 30) + '...' : item.value;
        ctx.fillText(displayVal, margin + 36, currentY + 28);
      });

      // 5. Verification Seal / Stamp
      const sealY = tableY + details.length * rowHeight + 20;
      ctx.fillStyle = '#000000';
      ctx.fillRect(margin + 20, sealY, cardWidth - 40, 48);
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 14px "Segoe UI", Tahoma, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✓ إشعار إلكتروني معتمد وموثق — SAHEL SECURED', width / 2, sealY + 30);

      // 6. Footer Disclaimer & Creator Credit
      const footerY = sealY + 68;
      ctx.fillStyle = '#333333';
      ctx.font = 'bold 11px "Segoe UI", Tahoma, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        'هذا التطبيق لا يتبع لأي بنك، هو مجرد فكرة (نموذج تجريبي)',
        width / 2,
        footerY
      );

      ctx.fillStyle = '#000000';
      ctx.font = 'bold 11px "Segoe UI", Tahoma, Arial, sans-serif';
      ctx.fillText(
        'من تصميم وفكرة: كمال جعفر زكريا — واتساب 00249919980435',
        width / 2,
        footerY + 20
      );

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve(false);
          return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sahel-receipt-${tx.referenceNo}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        resolve(true);
      }, 'image/png');
    } catch (err) {
      console.error('Error generating receipt image:', err);
      resolve(false);
    }
  });
}
