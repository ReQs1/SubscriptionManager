import { useEffect } from "react";
import styled from "styled-components";

import { useAppDispatch, useAppSelector } from "@/common/hooks/redux-hooks";
import SubscriptionCard from "@/features/subscriptions/components/subscription-card";
import SubscriptionsListHeader from "@/features/subscriptions/components/subscriptions-list-header";
import { fetchSubscriptions } from "@/features/subscriptions/subscriptionsSlice";
import Pagination from "@/features/subscriptions/components/pagination";

const Container = styled.div`
  width: 100%;
  max-width: 600px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: #666;
  padding: 2rem;
  font-size: 1rem;
`;

function SubscriptionsList() {
  const { error, state, subscriptions, currentPage, itemsPerPage } =
    useAppSelector((state) => state.subscriptions);
  const dispatch = useAppDispatch();

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSubscriptions = subscriptions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    if (state === "idle") {
      dispatch(fetchSubscriptions());
    }
  }, [state, dispatch]);

  return (
    <Container>
      <SubscriptionsListHeader />
      <List>
        {state === "loading" && <p>Loading subscriptions...</p>}
        {state === "error" && <p>{error}</p>}
        {state === "success" && subscriptions.length === 0 && (
          <EmptyMessage>No subscriptions yet</EmptyMessage>
        )}
        {state === "success" &&
          paginatedSubscriptions.length > 0 &&
          paginatedSubscriptions.map((sub) => (
            <SubscriptionCard key={sub.id} subscription={sub} />
          ))}
      </List>
      {state === "success" && paginatedSubscriptions.length > 0 && (
        <Pagination />
      )}
    </Container>
  );
}

export default SubscriptionsList;
