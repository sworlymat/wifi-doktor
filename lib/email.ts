type OrderEmail = { to:string; accessUrl:string; checkoutSessionId:string; amountTotal:number };

export async function sendOrderEmail({to,accessUrl,checkoutSessionId,amountTotal}:OrderEmail){
  const apiKey=process.env.RESEND_API_KEY;
  const from=process.env.ORDER_FROM_EMAIL;
  if(!apiKey||!from) return false;
  const planName=amountTotal===59000?"Wi‑Fi Doktor Komplet":"Wi‑Fi Doktor Základ";
  const price=new Intl.NumberFormat("cs-CZ").format(Math.round(amountTotal/100));
  const assistance=amountTotal===59000?"Součástí objednávky je také osobní SOS asistence technika přes WhatsApp. Pro měření můžete využít bezplatnou aplikaci WiFiman.":"";
  const response=await fetch("https://api.resend.com/emails",{method:"POST",signal:AbortSignal.timeout(10000),headers:{Authorization:`Bearer ${apiKey}`,"Content-Type":"application/json","Idempotency-Key":`order-${checkoutSessionId}`},body:JSON.stringify({from,to,subject:"Váš přístup k Wi‑Fi Doktorovi",text:`Děkujeme za objednávku produktu ${planName}. Přijatá platba: ${price} Kč. Váš doživotní přístup je připravený. Průvodce můžete otevřít ihned: ${accessUrl}\n\n${assistance}\n\nČíslo objednávky: ${checkoutSessionId}`,html:`<h1>Děkujeme za objednávku</h1><p>Zakoupili jste <strong>${planName}</strong>. Přijatá platba: <strong>${price} Kč</strong>.</p><p>Váš doživotní přístup je připravený a průvodce můžete otevřít ihned.</p><p><a href="${accessUrl}">Otevřít Wi‑Fi Doktora</a></p>${assistance?`<p>${assistance}</p>`:""}<p>Číslo objednávky: ${checkoutSessionId}</p>`})});
  if(!response.ok) throw new Error(`Order email failed (${response.status}).`);
  return true;
}
