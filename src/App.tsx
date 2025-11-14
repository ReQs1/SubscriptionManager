import styled from "styled-components";
import SubscriptionsList from "@/features/subscriptions/components/subscriptions-list";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: start;
  min-height: 100dvh;
`;

function App() {
  return (
    <Container>
      <SubscriptionsList />
    </Container>
  );
}

export default App;
