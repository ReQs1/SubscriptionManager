import { mockSubscriptions, type Subscription } from "@/data/mock-data";
import SubscriptionCard from "@/features/subscriptions/components/subscription-card";
import SubscriptionsListHeader from "@/features/subscriptions/components/subscriptions-list-header";
import { useState } from "react";
import styled from "styled-components";

const state: "loading" | "idle" | "error" | "success" = "success";

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

function SubscriptionsList() {
  const [subscriptions] = useState<Subscription[]>(mockSubscriptions);

  return (
    <Container>
      <SubscriptionsListHeader />
      <List>
        {state === "loading" && <p>Loading subscriptions...</p>}
        {state === "error" && (
          <p>Error loading subscriptions. Please try again.</p>
        )}
        {state === "success" &&
          subscriptions.map((sub) => (
            <SubscriptionCard key={sub.id} subscription={sub} />
          ))}
      </List>
    </Container>
  );
}

export default SubscriptionsList;
