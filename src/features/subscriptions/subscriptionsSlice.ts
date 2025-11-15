import type { Subscription } from "@/data/mock-data";
import {
  cancelSubscription,
  fetchMockSubscriptions,
} from "@/features/subscriptions/api/subscriptionsApi";
import type { RootState } from "@/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type CancelError = {
  subscriptionId: string;
  message: string;
};

export type SubscriptionsState = {
  subscriptions: Subscription[];
  state: "loading" | "idle" | "error" | "success";
  error: string | null;
  currentPage: number;
  itemsPerPage: number;
  cancellingIds: string[];
  cancelErrors: CancelError[];
};

const initialState: SubscriptionsState = {
  subscriptions: [],
  state: "idle",
  error: null,
  currentPage: 1,
  itemsPerPage: 5,
  cancellingIds: [],
  cancelErrors: [],
};

export const fetchSubscriptions = createAsyncThunk(
  "subscriptions/fetchSubscriptions",
  async () => {
    const res = await fetchMockSubscriptions();
    return res;
  }
);

export const cancelSubscriptionThunk = createAsyncThunk(
  "subscriptions/cancelSubscription",
  async (subId: string) => {
    await cancelSubscription();
    return subId;
  }
);

export const subscriptionsSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {
    prevPage: (state) => {
      if (state.currentPage > 1) {
        state.currentPage -= 1;
      }
    },
    nextPage: (state) => {
      const maxPage = Math.ceil(
        state.subscriptions.length / state.itemsPerPage
      );
      if (state.currentPage < maxPage) {
        state.currentPage += 1;
      }
    },
    clearCancelError: (state, action) => {
      state.cancelErrors = state.cancelErrors.filter(
        (error) => error.subscriptionId !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Subscriptions
      .addCase(fetchSubscriptions.pending, (state) => {
        state.state = "loading";
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.state = "success";
        state.subscriptions = action.payload;
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.state = "error";
        state.error = action.error.message || "Failed to fetch subscriptions";
      })
      // Cancel Subscription
      .addCase(cancelSubscriptionThunk.pending, (state, action) => {
        state.cancellingIds.push(action.meta.arg);
      })
      .addCase(cancelSubscriptionThunk.fulfilled, (state, action) => {
        const subscription = state.subscriptions.find(
          (sub) => sub.id === action.payload
        );
        if (subscription) {
          subscription.status = "cancelled";
        }
        state.cancellingIds = state.cancellingIds.filter(
          (id) => id !== action.payload
        );
      })
      .addCase(cancelSubscriptionThunk.rejected, (state, action) => {
        state.cancellingIds = state.cancellingIds.filter(
          (id) => id !== action.meta.arg
        );
        state.cancelErrors.push({
          subscriptionId: action.meta.arg,
          message: action.error.message || "Failed to cancel subscription",
        });
      });
  },
});

export default subscriptionsSlice.reducer;

export const { prevPage, nextPage, clearCancelError } =
  subscriptionsSlice.actions;

// Selectors
export const selectTotalPages = (state: RootState) =>
  Math.ceil(
    state.subscriptions.subscriptions.length / state.subscriptions.itemsPerPage
  ) || 1;
