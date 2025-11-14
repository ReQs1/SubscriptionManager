import type { Subscription } from "@/data/mock-data";
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { fetchMockSubscriptions } from "@/features/subscriptions/api/subscriptionsApi";
import type { RootState } from "@/store";

export type SubscriptionsState = {
  subscriptions: Subscription[];
  state: "loading" | "idle" | "error" | "success";
  error: string | null;
  currentPage: number;
  itemsPerPage: number;
};

const initialState: SubscriptionsState = {
  subscriptions: [],
  state: "idle",
  error: null,
  currentPage: 1,
  itemsPerPage: 5,
};

export const fetchSubscriptions = createAsyncThunk(
  "subscriptions/fetchSubscriptions",
  async () => {
    const res = await fetchMockSubscriptions();
    return res;
  }
);

export const subscriptionsSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {
    cancelSubscription: (state, action: PayloadAction<string>) => {
      const subscription = state.subscriptions.find(
        (sub) => sub.id === action.payload
      );
      if (subscription) {
        subscription.status = "cancelled";
      }
    },
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
  },
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export default subscriptionsSlice.reducer;

export const { cancelSubscription, prevPage, nextPage } =
  subscriptionsSlice.actions;

// Selectors
export const selectTotalPages = (state: RootState) =>
  Math.ceil(
    state.subscriptions.subscriptions.length / state.subscriptions.itemsPerPage
  ) || 1;
