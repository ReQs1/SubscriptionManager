import { StyledButton } from "@/common/components/button";
import { formatDate } from "@/common/utils/utils";
import type { Subscription } from "@/data/mock-data";
import styled, { css } from "styled-components";

const Card = styled.li`
  border: 1px solid #ccc;
  padding: 1.2rem 1.4rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: start;
`;

const InformationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Title = styled.h2`
  font-size: 1.1rem;
  font-weight: bolder;
`;

const Status = styled.p<{ status: "active" | "cancelled" | "paused" }>`
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  width: fit-content;

  ${(props) =>
    props.status === "active" &&
    css`
      color: #0a6e0a;
      background-color: #d4f4dd;
    `}

  ${(props) =>
    props.status === "cancelled" &&
    css`
      color: #5c5c5c;
      background-color: #e8e8e8;
    `}
`;

const Price = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.25rem;

  & span {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111;
  }
`;

type Props = {
  subscription: Subscription;
};

function SubscriptionCard({ subscription }: Props) {
  return (
    <Card>
      <InformationContainer>
        <Title>{subscription.offerTitle}</Title>
        <Status status={subscription.status}>{subscription.status}</Status>
        <Price>
          <span>{subscription.price}</span> {subscription.currency} / month
        </Price>
        <p>Renews on: {formatDate(new Date(subscription.nextPaymentDate))}</p>
      </InformationContainer>
      <StyledButton $variant="ghost">Cancel</StyledButton>
    </Card>
  );
}

export default SubscriptionCard;
