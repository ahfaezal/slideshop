import fs from "fs";
import path from "path";

export type OrderStatus = "pending" | "paid" | "failed";

export type OrderRecord = {
  orderId: string;
  billCode: string;
  slug: string;
  productTitle: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  status: OrderStatus;
  paidAt?: string;
  emailSent?: boolean;
  transactionId?: string;
  createdAt: string;
};

const dataDir = path.join(process.cwd(), "data");
const ordersFile = path.join(dataDir, "orders.json");

function ensureOrdersFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(ordersFile)) {
    fs.writeFileSync(ordersFile, "[]", "utf8");
  }
}

export function readOrders(): OrderRecord[] {
  ensureOrdersFile();

  try {
    const raw = fs.readFileSync(ordersFile, "utf8").trim();

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as OrderRecord[];
  } catch (error) {
    console.error("READ ORDERS ERROR:", error);
    return [];
  }
}

export function writeOrders(orders: OrderRecord[]) {
  ensureOrdersFile();
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2), "utf8");
}

export function saveOrder(order: OrderRecord) {
  const orders = readOrders();
  orders.push(order);
  writeOrders(orders);
  return order;
}

export function getOrderByBillCode(billCode: string) {
  const orders = readOrders();
  return orders.find((o) => o.billCode === billCode) || null;
}

export function getOrderByOrderId(orderId: string) {
  const orders = readOrders();
  return orders.find((o) => o.orderId === orderId) || null;
}

export function updateOrderByBillCode(
  billCode: string,
  updates: Partial<OrderRecord>
) {
  const orders = readOrders();
  const index = orders.findIndex((o) => o.billCode === billCode);

  if (index === -1) {
    return null;
  }

  orders[index] = {
    ...orders[index],
    ...updates,
  };

  writeOrders(orders);
  return orders[index];
}