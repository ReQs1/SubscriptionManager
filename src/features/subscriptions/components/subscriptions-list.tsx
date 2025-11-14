import { useAppSelector } from "@/common/hooks/redux-hooks";
import SubscriptionCard from "@/features/subscriptions/components/subscription-card";
import SubscriptionsListHeader from "@/features/subscriptions/components/subscriptions-list-header";
import styled from "styled-components";

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
  const { error, state, subscriptions } = useAppSelector(
    (state) => state.subscriptions
  );

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
          subscriptions.length > 0 &&
          subscriptions.map((sub) => (
            <SubscriptionCard key={sub.id} subscription={sub} />
          ))}
      </List>
    </Container>
  );
}

export default SubscriptionsList;
