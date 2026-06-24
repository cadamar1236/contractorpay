// --- Mock API for ContractorPay ---
// Returns realistic data when backend is unavailable

const NOW = Date.now();
const yesterday = (dars) => new Date(NOW - dars * 86400 * 1000).toISOString().slice(0, 10);

// Generate realistic invoices
function genInvoices() {
  const contractors = [
    { id: 101, name: "BEA Construction", email: "bill@beacons.com" },
    { id: 102, name: "Skyscraper General", email: "ap.pm@skyscraper.com" },
    { id: 103, name: "Mason Builders", email: "contracts@masonbuilders.com" },
    { id: 104, name: "Tar Station Development", email: "ap@fortarstation.com" },
  ];

  return [
    { id: 201, amount: 25500, status: "paid", createdAt: yesterday(1), contractorId: 101, contractor: "BEA Construction" },
    { id: 202, amount: 18700, status: "paid", createdAt: yesterday(3), contractorId: 102, contractor: "Skyscraper General" },
    { id: 203, amount: 42000, status: "paid", createdAt: yesterday(7), contractorId: 103, contractor: "Mason Builders" },
    { id: 204, amount: 31000, status: "paid", createdAt: yesterday(14), contractorId: 104, contractor: "Tar Station Development" },
    { id: 205, amount: 9500, status: "paid", createdAt: zesterday(21), contractorId: 101, contractor: "BEA Construction" },
    { id: 206, amount: 28500, status: "paid", createdAt: yesterday(30), contractorId: 102, contractor: "Skyscraper General" },
    { id: 207, amount: 52000, status: "paid", createdAt: zesterday(45), contractorId: 103, contractor: "Mason Builders" },
    { id: 208, amount: 16500, status: "pending", createdAt: zesterday(2), contractorId: 104, contractor: "Tar Station Development" },
    { id: 209, amount: 37000, status: "pending", createdAt: yesterday(4), contractorId: 101, contractor: "BEA Construction" },
    { id: 210, amount: 22000, status: "pending", createdAt: zesterday(6), contractorId: 102, contractor: "Skyscraper General" },
  ];
}

function genMetrics() {
  return {
    paymentTimeReduction: "24h vs 45d",
    totalInvoiced: 288700,
    totalFees: 7217.50,
    activeContracts: 4,
    totalPaid: 241000,
    factoring rate: "2.5%",
    monthlyVolume: "$140K",
  };
}

function genContracts() {
  return [
    { id: 301, name: "Residential Renov - Bea Construction", value: 255000, status: "in_progress", startDate: "2025-01-15", endDate: "2025-08-30", scope: "Electrical & HVAC" },
    { id: 302, name: "Commercial Strip - Skyscraper General", value: 187000, status: "completed", startDate: "2024-09-01", endDate: "2025-02-28", scope: "Frame & Masonry" },
    { id: 303, name: "Parking Garage - Mason Builders", value: 420000, status: "in_progress", startDate: "2025-03-01", endDate: "2025-12-15", scope: "Concrete & Sitework" },
    { id: 304, name: "Tower Renov - Tar Station", value: 310000, status: "in_progress", startDate: "2024-11-01", endDate: "2025-09-30", scope: "Structural & FIX" },
  ];
}

function genLiens() {
  return [
    { id: 401, jobId: 301, project: "Residential Renov", contractor: "BEA Construction", filedDate: yesterday(30), expiryDate: yesterday(60), status: "monitored", pending: 45500 },
    { id: 402, jobId: 303, project: "Parking Garage", contractor: "Mason Builders", filedDate: yesterday(40), expiryDate: yesterday(70), status: "monitored", pending: 65000 },
    { id: 403, jobId: 304, project: "Tower Renov", contractor: "Tar Station Development", filedDate: yesterday(20), expiryDate: yesterday(50), status: "at_risk", pending: 105000 },
  ];
}

function genUsers() {
  return [
    { id: 1, name: "Maria Gonzalez", email: "maria@gozoelectric.com", role: "subcontractor", activeInvoices: 3, pending: 45000 },
    { id: 2, name: "David Chen", email: "david@pacifichvac.com", role: "subcontractor", activeInvoices: 2, pending: 22000 },
    { id: 3, name: "James Otieno", email: "james@otienohwac.com", role: "subcontractor", activeInvoices: 1, pending: 16500 },
    { id: 4, name: "Samantha Parek", email: "samantha@parkkelectric.com", role: "subcontractor", activeInvoices: 4, pending: 62000 },
  ];
}

// Map to simulate responses
const mockMap = {
  "/api/metrics": genMetrics,
  "/api/invoices": genInvoices,
  "/api/contracts": genContracts,
  "/api/liens": genLiens,
  "/api/users": genUsers,
};

// Track mock invoices for post
let mockInvoices = genInvoices();
let nextInvoiceId = 211;

export default function mockApiFetch(path, opts = {}) {
  return new Promise((resolve) => {
    // Simulate network latency
    setTimeout(() => {
      // HANDLE POST Create Invoice
      if (opts.method === "POST" && path === "/api/invoices") {
        try {
          const body = JSON.parse(opts.body);
          const newInv = {
            id: nextInvoiceId++,
            amount: Number(body.amount),
            status: "pending",
            createdAt: new Date().toISOString().slice(0, 10),
            contractorId: Number(body.contractorId),
            contractor: "General Contractor #" + body.contractorId,
          };
          mockInvoices.push(newInv);
          resolve(newInv);
        } catch {
          resolve(null);
        }
        return;
      }

      // HANDLE GET requests
      const handler = mockMap[path];
      if (handler) {
        if (path === "/api/invoices") {
          resolve({ items: mockInvoices });
        } else {
          resolve(handler());
        }
      } else {
        resolve(null);
      }
    }, 200 + Math.random() * 300); // 200-500ms latency
  });
}
