import { StyledButton } from "@/common/components/button";
import { useAppDispatch, useAppSelector } from "@/common/hooks/redux-hooks";
import {
  nextPage,
  prevPage,
  selectTotalPages,
} from "@/features/subscriptions/subscriptionsSlice";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PageInfo = styled.p`
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
`;

const PaginationButton = styled(StyledButton)`
  min-width: 90px;
`;

function Pagination() {
  const dispatch = useAppDispatch();
  const currentPage = useAppSelector(
    (state) => state.subscriptions.currentPage
  );
  const totalPages = useAppSelector(selectTotalPages);

  return (
    <Container>
      <PaginationButton
        onClick={() => dispatch(prevPage())}
        $variant="secondary"
        disabled={currentPage === 1}
      >
        Previous
      </PaginationButton>
      <PageInfo>
        Page {currentPage} of {totalPages}
      </PageInfo>
      <PaginationButton
        onClick={() => dispatch(nextPage())}
        $variant="secondary"
        disabled={currentPage === totalPages}
      >
        Next
      </PaginationButton>
    </Container>
  );
}

export default Pagination;
