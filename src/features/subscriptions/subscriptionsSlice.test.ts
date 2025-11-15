import { describe, it, expect } from "vitest";
import subscriptionsReducer, {
  cancelSubscriptionThunk,
  prevPage,
  nextPage,
  fetchSubscriptions,
  clearCancelError,
  selectTotalPages,
  type SubscriptionsState,
} from "./subscriptionsSlice";
import type { Subscription } from "@/data/mock-data";
import type { RootState } from "@/store";

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
    cancellingIds: [],
    cancelErrors: [],
  };

  describe("cancelSubscriptionThunk", () => {
    it("should add subscription ID to cancellingIds on pending", () => {
      const action = {
        type: cancelSubscriptionThunk.pending.type,
        meta: { arg: "S1" },
      };
      const newState = subscriptionsReducer(initialState, action);

      expect(newState.cancellingIds).toContain("S1");
    });

    it("should not affect existing errors on pending", () => {
      const stateWithError: SubscriptionsState = {
        ...initialState,
        cancelErrors: [{ subscriptionId: "S1", message: "Previous error" }],
      };
      const action = {
        type: cancelSubscriptionThunk.pending.type,
        meta: { arg: "S1" },
      };
      const newState = subscriptionsReducer(stateWithError, action);

      expect(newState.cancelErrors).toHaveLength(1);
      expect(newState.cancelErrors[0]).toEqual({
        subscriptionId: "S1",
        message: "Previous error",
      });
    });

    it("should cancel subscription and remove from cancellingIds on fulfilled", () => {
      const stateWithCancelling: SubscriptionsState = {
        ...initialState,
        cancellingIds: ["S1"],
      };
      const action = {
        type: cancelSubscriptionThunk.fulfilled.type,
        payload: "S1",
      };
      const newState = subscriptionsReducer(stateWithCancelling, action);

      const cancelledSubscription = newState.subscriptions.find(
        (sub) => sub.id === "S1"
      );
      expect(cancelledSubscription!.status).toBe("cancelled");
      expect(newState.cancellingIds).not.toContain("S1");
    });

    it("should do nothing when subscription ID does not exist on fulfilled", () => {
      const stateWithCancelling: SubscriptionsState = {
        ...initialState,
        cancellingIds: ["INVALID_ID"],
      };
      const action = {
        type: cancelSubscriptionThunk.fulfilled.type,
        payload: "INVALID_ID",
      };
      const newState = subscriptionsReducer(stateWithCancelling, action);

      const unchangedSubscription = newState.subscriptions.find(
        (sub) => sub.id === "S1"
      );
      expect(unchangedSubscription!.status).toBe("active");
      expect(newState.cancellingIds).not.toContain("INVALID_ID");
    });

    it("should add error and remove from cancellingIds on rejected", () => {
      const stateWithCancelling: SubscriptionsState = {
        ...initialState,
        cancellingIds: ["S1"],
      };
      const action = {
        type: cancelSubscriptionThunk.rejected.type,
        meta: { arg: "S1" },
        error: { message: "Network error" },
      };
      const newState = subscriptionsReducer(stateWithCancelling, action);

      expect(newState.cancellingIds).not.toContain("S1");
      expect(newState.cancelErrors).toHaveLength(1);
      expect(newState.cancelErrors[0]).toEqual({
        subscriptionId: "S1",
        message: "Network error",
      });
    });

    it("should use default error message when none provided on rejected", () => {
      const stateWithCancelling: SubscriptionsState = {
        ...initialState,
        cancellingIds: ["S1"],
      };
      const action = {
        type: cancelSubscriptionThunk.rejected.type,
        meta: { arg: "S1" },
        error: {},
      };
      const newState = subscriptionsReducer(stateWithCancelling, action);

      expect(newState.cancelErrors[0].message).toBe(
        "Failed to cancel subscription"
      );
    });
  });

  describe("clearCancelError", () => {
    it("should remove error for specific subscription", () => {
      const stateWithErrors: SubscriptionsState = {
        ...initialState,
        cancelErrors: [
          { subscriptionId: "S1", message: "Error 1" },
          { subscriptionId: "S2", message: "Error 2" },
        ],
      };
      const newState = subscriptionsReducer(
        stateWithErrors,
        clearCancelError("S1")
      );

      expect(newState.cancelErrors).toHaveLength(1);
      expect(newState.cancelErrors[0].subscriptionId).toBe("S2");
    });

    it("should do nothing when error does not exist", () => {
      const newState = subscriptionsReducer(
        initialState,
        clearCancelError("S1")
      );

      expect(newState.cancelErrors).toHaveLength(0);
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
        cancellingIds: [],
        cancelErrors: [],
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
        cancellingIds: [],
        cancelErrors: [],
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

  describe("selectTotalPages selector", () => {
    it("should calculate correct total pages", () => {
      const state = {
        subscriptions: {
          subscriptions: Array(13).fill(mockSubscription),
          itemsPerPage: 5,
          state: "success" as const,
          error: null,
          currentPage: 1,
          cancellingIds: [],
          cancelErrors: [],
        },
      } as RootState;

      const totalPages = selectTotalPages(state);

      expect(totalPages).toBe(3);
    });

    it("should return 1 when there are no subscriptions", () => {
      const state = {
        subscriptions: {
          subscriptions: [],
          itemsPerPage: 5,
          state: "idle" as const,
          error: null,
          currentPage: 1,
          cancellingIds: [],
          cancelErrors: [],
        },
      } as RootState;

      const totalPages = selectTotalPages(state);

      expect(totalPages).toBe(1);
    });

    it("should return 1 when subscriptions fit on one page", () => {
      const state = {
        subscriptions: {
          subscriptions: Array(3).fill(mockSubscription),
          itemsPerPage: 5,
          state: "success" as const,
          error: null,
          currentPage: 1,
          cancellingIds: [],
          cancelErrors: [],
        },
      } as RootState;

      const totalPages = selectTotalPages(state);

      expect(totalPages).toBe(1);
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
