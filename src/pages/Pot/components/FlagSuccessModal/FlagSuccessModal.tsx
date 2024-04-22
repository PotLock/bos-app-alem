import React from "react";
import ModalOverlay from "@app/modals/ModalOverlay";
import { Container } from "./styles";

const FlagSuccessModal = (props: any) => {
  const { onClose, successFlag } = props;

  return (
    <ModalOverlay onOverlayClick={onClose}>
      <Container>
        <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={onClose}>
          <path
            d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z"
            fill="#7B7B7B"
          />
        </svg>
        <div className="title">
          <span> {successFlag.address} </span> has been flagged
        </div>
        <div className="reason">{successFlag.reason}</div>
      </Container>
    </ModalOverlay>
  );
};

export default FlagSuccessModal;
