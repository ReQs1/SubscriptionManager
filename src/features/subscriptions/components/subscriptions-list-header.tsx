import styled from "styled-components";

const Container = styled.div``;

const Title = styled.h1`
  font-size: 2rem;
`;

const SubParagraph = styled.p`
  color: #a8a8a8;
`;

function SubscriptionsListHeader() {
  return (
    <Container>
      <Title>Your Subscriptions</Title>
      <SubParagraph>View and manage all your active subscriptions</SubParagraph>
    </Container>
  );
}

export default SubscriptionsListHeader;
