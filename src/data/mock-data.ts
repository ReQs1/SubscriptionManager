export type Subscription = {
  id: string;
  offerTitle: string;
  status: "active" | "cancelled";
  price: number;
  currency: string;
  nextPaymentDate: string;
};

export const mockSubscriptions: Subscription[] = [
  {
    id: "S12345",
    offerTitle: "Premium Monthly",
    status: "active",
    price: 12.99,
    currency: "EUR",
    nextPaymentDate: "2025-11-15T10:00:00Z",
  },
  {
    id: "S67890",
    offerTitle: "Sports Pass - Annual",
    status: "active",
    price: 99.99,
    currency: "USD",
    nextPaymentDate: "2026-08-01T10:00:00Z",
  },
  {
    id: "S24681",
    offerTitle: "Music Streaming Pro",
    status: "active",
    price: 9.99,
    currency: "USD",
    nextPaymentDate: "2025-12-20T10:00:00Z",
  },
  {
    id: "S13579",
    offerTitle: "Cloud Storage 100GB",
    status: "cancelled",
    price: 4.99,
    currency: "PLN",
    nextPaymentDate: "2025-11-30T10:00:00Z",
  },
  {
    id: "S98765",
    offerTitle: "Gaming Plus",
    status: "active",
    price: 14.99,
    currency: "USD",
    nextPaymentDate: "2025-12-05T10:00:00Z",
  },
  {
    id: "S11223",
    offerTitle: "News & Magazine Bundle",
    status: "active",
    price: 19.99,
    currency: "USD",
    nextPaymentDate: "2026-01-15T10:00:00Z",
  },
  {
    id: "S44556",
    offerTitle: "Fitness App Premium",
    status: "active",
    price: 8.99,
    currency: "USD",
    nextPaymentDate: "2025-11-25T10:00:00Z",
  },
  {
    id: "S77889",
    offerTitle: "Video Streaming HD",
    status: "active",
    price: 15.99,
    currency: "USD",
    nextPaymentDate: "2025-12-10T10:00:00Z",
  },
  {
    id: "S33445",
    offerTitle: "Learning Platform Annual",
    status: "active",
    price: 199.99,
    currency: "USD",
    nextPaymentDate: "2026-10-01T10:00:00Z",
  },
  {
    id: "S55667",
    offerTitle: "VPN Service",
    status: "active",
    price: 6.99,
    currency: "USD",
    nextPaymentDate: "2025-11-28T10:00:00Z",
  },
  {
    id: "S88990",
    offerTitle: "Password Manager Family",
    status: "active",
    price: 4.99,
    currency: "EUR",
    nextPaymentDate: "2025-12-15T10:00:00Z",
  },
  {
    id: "S22334",
    offerTitle: "Productivity Suite",
    status: "cancelled",
    price: 11.99,
    currency: "USD",
    nextPaymentDate: "2025-11-18T10:00:00Z",
  },
  {
    id: "S66778",
    offerTitle: "Photo Editing Pro",
    status: "active",
    price: 9.99,
    currency: "EUR",
    nextPaymentDate: "2026-02-01T10:00:00Z",
  },
];
