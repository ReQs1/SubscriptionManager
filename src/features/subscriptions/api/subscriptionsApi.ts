import { mockSubscriptions } from "@/data/mock-data";
import type { Subscription } from "@/data/mock-data";

export async function fetchMockSubscriptions(): Promise<Subscription[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockSubscriptions);
    }, 1000);
  });
}
