import { describe, it, expect } from "vitest";
import subscriptionsReducer, {
  cancelSubscription,
  prevPage,
  nextPage,
  fetchSubscriptions,
  type SubscriptionsState,
} from "./subscriptionsSlice";
import type { Subscription } from "@/data/mock-data";

describe("subscriptionsSlice", () => {
  const mockSubscription: Subscription = {
    id: "S1",
    offerTitle: "Test Subscription",
    status: "active",
    price: 10,
    currency: "USD",
    nextPaymentDate: "2025-12-01T10:00:00Z",
  };

  const initialState: SubscriptionsState = {
    subscriptions: [mockSubscription],
    state: "idle",
    error: null,
    currentPage: 1,
    itemsPerPage: 5,
  };

  describe("cancelSubscription", () => {
    it("should cancel subscription when ID exists", () => {
      const newState = subscriptionsReducer(
        initialState,
        cancelSubscription("S1")
      );

      const cancelledSubscription = newState.subscriptions.find(
        (sub) => sub.id === "S1"
      );

      expect(cancelledSubscription!.status).toBe("cancelled");
    });

    it("should do nothing when ID does not exist", () => {
      const newState = subscriptionsReducer(
        initialState,
        cancelSubscription("INVALID_ID")
      );

      const unchangedSubscription = newState.subscriptions.find(
        (sub) => sub.id === "S1"
      );

      expect(unchangedSubscription!.status).toBe("active");
    });

    it("should only update the specific subscription", () => {
      const stateWithMultiple: SubscriptionsState = {
        ...initialState,
        subscriptions: [
          mockSubscription,
          {
            id: "S2",
            offerTitle: "Another Subscription",
            status: "active" as const,
            price: 20,
            currency: "EUR",
            nextPaymentDate: "2025-12-15T10:00:00Z",
          },
        ],
      };

      const newState = subscriptionsReducer(
        stateWithMultiple,
        cancelSubscription("S1")
      );

      const firstSub = newState.subscriptions.find((sub) => sub.id === "S1");
      const secondSub = newState.subscriptions.find((sub) => sub.id === "S2");

      expect(firstSub!.status).toBe("cancelled");
      expect(secondSub!.status).toBe("active");
    });
  });

  describe("prevPage", () => {
    it("should decrement page when not on page 1", () => {
      const state: SubscriptionsState = {
        ...initialState,
        currentPage: 3,
      };

      const newState = subscriptionsReducer(state, prevPage());

      expect(newState.currentPage).toBe(2);
    });

    it("should do nothing when already on page 1", () => {
      const newState = subscriptionsReducer(initialState, prevPage());

      expect(newState.currentPage).toBe(1);
    });
  });

  describe("nextPage", () => {
    it("should increment page when not on last page", () => {
      const state: SubscriptionsState = {
        ...initialState,
        subscriptions: Array(15).fill(mockSubscription),
        currentPage: 1,
        itemsPerPage: 5,
      };

      const newState = subscriptionsReducer(state, nextPage());

      expect(newState.currentPage).toBe(2);
    });

    it("should do nothing when already on last page", () => {
      const state: SubscriptionsState = {
        ...initialState,
        subscriptions: Array(5).fill(mockSubscription),
        currentPage: 1,
        itemsPerPage: 5,
      };

      const newState = subscriptionsReducer(state, nextPage());

      expect(newState.currentPage).toBe(1);
    });
  });

  describe("fetchSubscriptions async thunk", () => {
    it("should set loading state on pending", () => {
      const action = { type: fetchSubscriptions.pending.type };
      const newState = subscriptionsReducer(initialState, action);

      expect(newState.state).toBe("loading");
    });

    it("should set success state and subscriptions on fulfilled", () => {
      const mockData = [mockSubscription];
      const action = {
        type: fetchSubscriptions.fulfilled.type,
        payload: mockData,
      };
      const newState = subscriptionsReducer(initialState, action);

      expect(newState.state).toBe("success");
      expect(newState.subscriptions).toEqual(mockData);
    });

    it("should set error state and message on rejected", () => {
      const action = {
        type: fetchSubscriptions.rejected.type,
        error: { message: "Network error" },
      };
      const newState = subscriptionsReducer(initialState, action);

      expect(newState.state).toBe("error");
      expect(newState.error).toBe("Network error");
    });

    it("should use default error message when none provided", () => {
      const action = {
        type: fetchSubscriptions.rejected.type,
        error: {},
      };
      const newState = subscriptionsReducer(initialState, action);

      expect(newState.state).toBe("error");
      expect(newState.error).toBe("Failed to fetch subscriptions");
    });
  });
});
