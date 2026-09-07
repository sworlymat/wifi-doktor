type OrderEmail = { to:string; accessUrl:string; checkoutSessionId:string };

export async function sendOrderEmail({to,accessUrl,checkoutSessionId}:OrderEmail){
  const apiKey=process.env.RESEND_API_KEY;
  const from=process.env.ORDER_FROM_EMAIL;
  if(!apiKey||!from) return false;
  const response=await fetch("https://api.resend.com/emails",{method:"POST",signal:AbortSignal.timeout(10000),headers:{Authorization:`Bearer ${apiKey}`,"Content-Type":"application/json","Idempotency-Key":`order-${checkoutSessionId}`},body:JSON.stringify({from,to,subject:"Váš přístup k Wi‑Fi Doktorovi",text:`Děkujeme za objednávku. Platba 299 Kč byla přijata. Váš přístup: ${accessUrl}`,html:`<h1>Děkujeme za objednávku</h1><p>Platba 299 Kč byla přijata.</p><p><a href="${accessUrl}">Otevřít Wi‑Fi Doktora</a></p><p>Číslo objednávky: ${checkoutSessionId}</p>`})});
  if(!response.ok) throw new Error(`Order email failed (${response.status}).`);
  return true;
}
