import { mockSubscriptions } from "@/data/mock-data";
import type { Subscription } from "@/data/mock-data";

export async function fetchMockSubscriptions(): Promise<Subscription[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockSubscriptions);
    }, 1000);
  });
}

export async function cancelSubscription() {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.9) {
        resolve();
      } else {
        reject("Failed to cancel subscription. Please try again later.");
      }
    }, 1000);
  });
}
