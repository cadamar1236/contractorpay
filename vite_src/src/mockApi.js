// --- Mock API for ContractorPay ---
// Returns realistic data when backend is unavailable

const yesterday = (dars) => new Date(Date.now() - dars * 86400 * 1000).toISOString().slice(0, 10);

// Generate realistic invoices
function genInvoices() {
  return [
    { id: 201, amount: 25500, status: "funded", createdAt: yesterday(2), paidAt: yesterday(1), contractorId: 101, contractorName: "BEA Construction" },
    { id: 202, amount: 18700, status: "funded", createdAt: yesterday(4), paidAt: yesterday(3), contractorId: 102, contractorName: "Skyscraper General" },
    { id: 203, amount: 42000, status: "funded", createdAt: yesterday(8), paidAt: yesterday(7), contractorId: 103, contractorName: "Mason Builders" },
    { id: 204, amount: 31000, status: "funded", createdAt: yesterday(15), paidAt: yesterday(14), contractorId: 104, contractorName: "Tar Station Development" },
    { id: 205, amount: 9500, status: "funded", createdAt: yesterday(22), paidAt: yesterday(21), contractorId: 101, contractorName: "BEA Construction" },
    { id: 206, amount: 28500, status: "funded", createdAt: yesterday(31), paidAt: yesterday(30), contractorId: 102, contractorName: "Skyscraper General" },
    { id: 207, amount: 52000, status: "funded", createdAt: yesterday(46), paidAt: yesterday(45), contractorId: 103, contractorName: "Mason Builders" },
    { id: 208, amount: 16500, status: "pending", createdAt: yesterday(2), contractorId: 104, contractorName: "Tar Station Development" },
    { id: 209, amount: 37000, status: "pending", createdAt: yesterday(4), contractorId: 101, contractorName: "BEA Construction" },
    { id: 210, amount: 22000, status: "pending", createdAt: yesterday(6), contractorId: 102, contractorName: "Skyscraper General" },
  ];
}

function genMetrics() {
  return {
    totalInvoiced: "$288,700",
    averagePaymentTime: "24 hours",
    pendingInvoices: 3,
    amountCollected: "$241,000",
  };
}

// Generate realistic contractors (the app uses /api/contractors)
function genContractors() {
  return [
    { id: 101, name: "BEA Construction", email: "bill@beaconst.com", phone: "(212) 555-1010" },
    { id: 102, name: "Skyscraper General", email: "ap.pm@skyscraper.com", phone: "(312) 555-0220" },
    { id: 103, name: "Mason Builders", email: "contracts@masonbuilders.com", phone: "(773) 555-0330" },
    { id: 104, name: "Tar Station Development", email: "ap@fortarstation.com", phone: "(904) 555-0440" },
  ];
}

// Lien Rights (the app uses /api/lien-rights)
function genLienRights() {
  return [
    { invoiceId: 208, status: "Monitored", filedDate: yesterday(20), releaseDate: null },
    { invoiceId: 209, status: "Monitored", filedDate: yesterday(18), releaseDate: null },
    { invoiceId: 210, status: "At Risk", filedDate: yesterday(25), releaseDate: yesterday(50) },
  ];
}

// Track mock invoices for post
let mockInvoices = genInvoices();
let nextInvoiceId = 211;

const mockMap = {
  "/api/metrics": genMetrics,
  "/api/invoices": genInvoices,
  "/api/contractors": genContractors,
  "/api/lien-rights": genLienRights,
};

// Export function
export default function mockApiFetch(path, opts = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // HANDLE POST Create Invoice
      if (opts.method === "POST" && path === "/api/invoices") {
        try {
          const body = JSON.parse(opts.body);
          const newInv = {
            id: nextInvoiceId++ + 1000,
            amount: Number(body.amount),
            status: "pending",
            createdAt: new Date().toISOString().slice(0, 10),
            contractorId: Number(body.contractorId),
            contractorName: "General Contractor #" + body.contractorId,
          };
          mockInvoices.unshift(newInv);
          resolve(newInv);
        } catch {
          resolve(null);
        }
        return;
      }

      // HONOR POST /api/invoices/[id]/factor (Factoring invoice)
      if (opts.method === "POST" && path.match(/\/api\/invoices\/\d+\/factor/)) {
        const id = Number(path.split('/')[3]);
        const inv = mockInvoices.find(i => i.id === id);
        if (inv) {
          inv.status = "funded";
          inv.paidAt = new Date().toISOString().slice(0, 10);
          resolve({ ...inv, success: true });
        } else {
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
    }, 250 + Math.random() * 350);
  });
}
