// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Products
  const productsData = [
    { name: 'Riz Long 25kg', price: 9500, cost: 8000, sku: 'RIZ-LNG-25', stock: 100 },
    { name: 'Riz Brisé 25kg', price: 9000, cost: 7500, sku: 'RIZ-BR-25', stock: 50 },
    { name: 'Riz Brisé 50% 25kg', price: 18000, cost: 15000, sku: 'RIZ-BR50-25', stock: 40 },
  ];

  for (const p of productsData) {
    await prisma.product.upsert({
      where: { sku: p.sku },
      update: p,
      create: p,
    });
  }

  // Users
  const usersData = [
    { email: 'mourtallah1011@gmail.com', password: 'AdminPass123!', name: 'Admin', role: 'ADMIN' },
    { email: 'gestion@erp.com', password: 'ManagerPass123!', name: 'Gestionnaire', role: 'MANAGER' },
    { email: 'caisse1@erp.com', password: 'Cashier1Pass!', name: 'Caissier 1', role: 'CASHIER' },
    { email: 'caisse2@erp.com', password: 'Cashier2Pass!', name: 'Caissier 2', role: 'CASHIER' },
  ];

  for (const u of usersData) {
    const hashed = await bcrypt.hash(u.password, 10);
    await prisma.user.upsert({
      where: { email: u.email },
      update: { password: hashed, name: u.name, role: u.role as any },
      create: { email: u.email, password: hashed, name: u.name, role: u.role as any },
    });
  }

  // Settings default
  await prisma.setting.upsert({
    where: { id: 1 },
    update: { companyName: 'ERP Company', contact: '+223 00000000', address: 'Bamako', currency: 'CFA' },
    create: { companyName: 'ERP Company', contact: '+223 00000000', address: 'Bamako', currency: 'CFA' },
  });

  // Create 5 example sales
  const products = await prisma.product.findMany();
  const users = await prisma.user.findMany();

  const sampleSales = [
    { userEmail: users[0].email, items: [{ sku: products[0].sku, qty: 2 }, { sku: products[1].sku, qty: 1 }] },
    { userEmail: users[1].email, items: [{ sku: products[0].sku, qty: 1 }] },
    { userEmail: users[2].email, items: [{ sku: products[2].sku, qty: 1 }] },
    { userEmail: users[2].email, items: [{ sku: products[1].sku, qty: 3 }] },
    { userEmail: users[3].email, items: [{ sku: products[0].sku, qty: 5 }] },
  ];

  for (const s of sampleSales) {
    const user = await prisma.user.findUnique({ where: { email: s.userEmail } });
    if (!user) continue;

    await prisma.$transaction(async (prismaTx) => {
      let total = 0;
      const sale = await prismaTx.sale.create({ data: { userId: user.id, total: 0 } });

      for (const it of s.items) {
        const prod = await prismaTx.product.findUnique({ where: { sku: it.sku } });
        if (!prod) continue;
        const linePrice = prod.price * it.qty;
        total += linePrice;
        await prismaTx.saleItem.create({ data: { saleId: sale.id, productId: prod.id, quantity: it.qty, price: prod.price } });
        await prismaTx.product.update({ where: { id: prod.id }, data: { stock: prod.stock - it.qty } });
      }

      await prismaTx.sale.update({ where: { id: sale.id }, data: { total } });
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
