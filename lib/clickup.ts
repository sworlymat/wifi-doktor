type PaidOrder = {
  checkoutSessionId: string;
  customerEmail: string | null;
  amountTotal: number;
  currency: string;
};

export async function createClickUpOrderTask(order: PaidOrder) {
  const token = process.env.CLICKUP_API_TOKEN;
  const listId = process.env.CLICKUP_LIST_ID;
  if (!token || !listId) return null;

  const amount = new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: order.currency.toUpperCase(),
  }).format(order.amountTotal / 100);

  const response = await fetch(`https://api.clickup.com/api/v2/list/${listId}/task`, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: `Nová objednávka Wi-Fi Doktor – ${order.customerEmail ?? "bez e-mailu"}`,
      markdown_description: [
        "## Zaplacená objednávka",
        `- **Zákazník:** ${order.customerEmail ?? "neuvedeno"}`,
        `- **Částka:** ${amount}`,
        `- **Stripe Checkout:** \`${order.checkoutSessionId}\``,
        "- **Stav platby:** zaplaceno",
      ].join("\n"),
      priority: 3,
    }),
  });

  if (!response.ok) {
    throw new Error(`ClickUp task creation failed (${response.status}).`);
  }

  const task = (await response.json()) as { id?: string };
  if (!task.id) throw new Error("ClickUp did not return a task ID.");
  return task.id;
}
