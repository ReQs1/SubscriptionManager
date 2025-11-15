import styled, { css } from "styled-components";

type ButtonVariant = "ghost" | "secondary";

export const StyledButton = styled.button<{ $variant: ButtonVariant }>`
  padding: 0.3rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid transparent;
  transition: background 0.2s ease;
  cursor: pointer;

  ${(props) =>
    props.$variant === "ghost"
      ? css`
          background: transparent;
          color: #111;
          border: 1px solid #ccc;

          &:hover:not(:disabled) {
            background: #f5f5f5;
          }

          &:focus-visible,
          &:focus {
            outline: 2px solid #111;
            outline-offset: 2px;
          }
        `
      : css`
          background: #f5f5f5;
          color: #111;

          &:hover:not(:disabled) {
            background: #e9e9e9;
          }

          &:focus-visible,
          &:focus {
            outline: 2px solid #111;
            outline-offset: 2px;
          }
        `}

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;
