/**
 * packages/backend/prisma/seed.ts
 *
 * Idempotent-ish seed script for local development.
 * - Deletes existing rows from key tables (safe for local dev)
 * - Inserts sample agents, customers, projects, inventory, images, matches, and workflow runs
 *
 * Run with: pnpm --filter backend run seed
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("📦 Seeding database...");

  // clean key tables (order matters due to FK constraints)
  await prisma.match.deleteMany().catch(() => {});
  await prisma.message.deleteMany().catch(() => {});
  await prisma.image.deleteMany().catch(() => {});
  await prisma.inventoryUnit.deleteMany().catch(() => {});
  await prisma.project.deleteMany().catch(() => {});
  await prisma.customer.deleteMany().catch(() => {});
  await prisma.agent.deleteMany().catch(() => {});
  await prisma.workflowRun.deleteMany().catch(() => {});

  console.log("🧹 Cleared existing data.");

  // Agents
  const admin = await prisma.agent.create({
    data: {
      name: "Admin User",
      email: "admin@recrm.local",
      role: "ADMIN",
    },
  });

  const agentA = await prisma.agent.create({
    data: {
      name: "Asha Patel",
      email: "asha@agency.local",
      role: "AGENT",
    },
  });

  const agentB = await prisma.agent.create({
    data: {
      name: "Ravi Kumar",
      email: "ravi@agency.local",
      role: "AGENT",
    },
  });

  // Customers (with preferences JSON)
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: "Nita Mahajan",
        email: "nita@example.com",
        phone: "+919999999001",
        agentId: agentA.id,
        preferences: {
          budgetMin: 5000000,
          budgetMax: 10000000,
          bhk: [2, 3],
          locations: ["Andheri", "Bandra"],
        },
        tags: ["hot", "vip"],
      },
    }),
    prisma.customer.create({
      data: {
        name: "Sameer Shah",
        email: "sameer@example.com",
        phone: "+919999999002",
        agentId: agentA.id,
        preferences: {
          budgetMin: 7000000,
          budgetMax: 15000000,
          bhk: [3],
          locations: ["Powai", "Vikhroli"],
        },
        tags: ["followup"],
      },
    }),
    prisma.customer.create({
      data: {
        name: "Priya Iyer",
        email: "priya@example.com",
        phone: "+919999999003",
        agentId: agentB.id,
        preferences: {
          budgetMin: 3000000,
          budgetMax: 6000000,
          bhk: [1, 2],
          locations: ["Goregaon", "Malad"],
        },
        tags: [],
      },
    }),
    prisma.customer.create({
      data: {
        name: "Aman Verma",
        email: "aman@example.com",
        phone: "+919999999004",
        agentId: agentB.id,
        preferences: {
          budgetMin: 12000000,
          budgetMax: 25000000,
          bhk: [4],
          locations: ["Juhu", "Bandra"],
        },
        tags: ["premium"],
      },
    }),
    prisma.customer.create({
      data: {
        name: "Ritu Mehra",
        email: "ritu@example.com",
        phone: "+919999999005",
        agentId: agentA.id,
        preferences: {
          budgetMin: 2000000,
          budgetMax: 4500000,
          bhk: [1],
          locations: ["Thane"],
        },
        tags: [],
      },
    }),
  ]);

  console.log(`👥 Created ${customers.length} customers.`);

  // Projects
  const project1 = await prisma.project.create({
    data: {
      name: "Lakeview Residency",
      address: "Sector 21, Powai",
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: "Sea Breeze Apartments",
      address: "Juhu Beach Road",
    },
  });

  // Inventory units
  const inv1 = await prisma.inventoryUnit.create({
    data: {
      projectId: project1.id,
      title: "Lakeview 3BHK - Tower A - Floor 5",
      description: "Spacious 3BHK with lake view",
      type: "SALE",
      price: 9000000,
      areaSqFt: 1250,
      bedrooms: 3,
      location: "Powai",
      status: "AVAILABLE",
      attributes: { floor: 5, facing: "east" },
    },
  });

  const inv2 = await prisma.inventoryUnit.create({
    data: {
      projectId: project1.id,
      title: "Lakeview 2BHK - Tower B - Floor 2",
      description: "Cozy 2BHK close to clubhouse",
      type: "SALE",
      price: 6000000,
      areaSqFt: 920,
      bedrooms: 2,
      location: "Powai",
      status: "AVAILABLE",
      attributes: { floor: 2, facing: "north" },
    },
  });

  const inv3 = await prisma.inventoryUnit.create({
    data: {
      projectId: project2.id,
      title: "Sea Breeze 1RK - Studio",
      description: "Studio apartment with sea breeze",
      type: "RENT",
      price: 25000,
      areaSqFt: 350,
      bedrooms: 0,
      location: "Juhu",
      status: "AVAILABLE",
      attributes: { furnished: true },
    },
  });

  console.log("🏘️ Created inventory units.");

  // Images for inventory
  await prisma.image.createMany({
    data: [
      { inventoryId: inv1.id, url: "https://example.local/inv1-1.jpg", caption: "Living room" },
      { inventoryId: inv1.id, url: "https://example.local/inv1-2.jpg", caption: "Balcony view" },
      { inventoryId: inv2.id, url: "https://example.local/inv2-1.jpg", caption: "Kitchen" },
      { inventoryId: inv3.id, url: "https://example.local/inv3-1.jpg", caption: "Studio" },
    ],
  });

  // Workflow run sample
  const run = await prisma.workflowRun.create({
    data: {
      triggerType: "INVENTORY_ADDED",
      status: "SUCCEEDED",
      metadata: { note: "seeded run" },
      startedAt: new Date(),
      endedAt: new Date(),
    },
  });

  // Matches - naive scoring example
  // We'll create matches by simple logic: if budget range overlaps price for SALE, small score; for rent compare ranges loosely.
  const matches = <any>[];

  // Helper to test budget overlap for SALE listings (price in INR)
  const priceMatches = (custPref: any, price: number) => {
    if (!custPref) return false;
    const min = custPref.budgetMin ?? 0;
    const max = custPref.budgetMax ?? Number.MAX_SAFE_INTEGER;
    return price >= min * 0.9 && price <= max * 1.1; // loose overlap
  };

  for (const c of customers) {
    if (priceMatches(c.preferences as any, inv1.price ?? 0)) {
      matches.push({
        inventoryId: inv1.id,
        customerId: c.id,
        score: Math.round((Math.random() * 0.2 + 0.8) * 100) / 100, // 0.8 - 1.0
        reason: "Price & BHK roughly match preferences",
        workflowRunId: run.id,
      });
    }
    if (priceMatches(c.preferences as any, inv2.price ?? 0)) {
      matches.push({
        inventoryId: inv2.id,
        customerId: c.id,
        score: Math.round((Math.random() * 0.2 + 0.65) * 100) / 100, // 0.65 - 0.85
        reason: "Close to preferred budget & location",
        workflowRunId: run.id,
      });
    }
    // Rent case: simplistic for inv3 (rent)
    const pref = c.preferences as any;
    if (inv3.type === "RENT") {
      const rentBudgetCheck = pref && (pref.budgetMax ?? 0) >= (inv3.price ?? 0) * 12 * 0.8;
      if (rentBudgetCheck) {
        matches.push({
          inventoryId: inv3.id,
          customerId: c.id,
          score: Math.round((Math.random() * 0.3 + 0.5) * 100) / 100, // 0.5 - 0.8
          reason: "Rent within annual budget approximation",
          workflowRunId: run.id,
        });
      }
    }
  }

  if (matches.length > 0) {
    await prisma.match.createMany({ data: matches });
  }

  console.log(`✅ Seeded: ${customers.length} customers, ${matches.length} matches, inventory & projects.`);

  console.log("🎉 Seeding complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
