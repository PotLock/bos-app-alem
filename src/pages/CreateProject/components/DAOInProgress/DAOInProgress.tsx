import { state } from "alem";
import { Container } from "./styles";

interface Proposal {
  id: string;
  status: string;
}

const DAOInProgress = ({ proposalInProgress }: { proposalInProgress: Proposal }) => {
  return (
    <Container
      style={{
        padding: "32px 16px",
        justifyContent: "center",
        alignItems: "center",
        wordWrap: "break-word",
      }}
    >
      <h1 style={{ textAlign: "center" }}>You have a DAO proposal in progress.</h1>
      <h5 style={{ wordWrap: "break-word", textAlign: "center" }}>
        Please come back once voting on your proposal has been completed.
      </h5>
      <div
        style={{
          fontStyle: "italic",
          fontFamily: "sans-serif",
          wordWrap: "break-word",
          textAlign: "center",
        }}
      >
        NB: This proposal consists of 3 steps (individual proposals): Register information on NEAR Social, register on
        Potlock, and register on NEAR Horizon.
      </div>
      <a
        target="_blank"
        href={`https://near.org/sking.near/widget/DAO.Page?daoId=${state.daoAddress}&tab=proposal&proposalId=${proposalInProgress.id}`}
        style={{ marginTop: "16px" }}
      >
        View DAO Proposal
      </a>
    </Container>
  );
};

export default DAOInProgress;
