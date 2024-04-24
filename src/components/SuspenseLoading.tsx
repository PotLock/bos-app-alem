import styled from "styled-components";

/**
 * Suspense Loading to be used as a default Loading for the main Widget
 * @returns
 */
const SuspenseLoading = () => {
  const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 40%;
    width: 100%;
  `;

  const Logo = styled.div`
    margin-top: 1.5rem;
    display: flex;
    gap: 7px;
    align-items: baseline;
    text-align: center;
    color: #2e2e2e;
    font-size: 23.95px;
    font-weight: 700;
    line-height: 23.95px;
    word-wrap: break-word;
    text-decoration: none;
    @media screen and (max-width: 480px) {
      font-size: 20px;
    }
    :hover {
      text-decoration: none;
    }
    img {
      height: 1em;
    }
  `;

  return (
    <Container>
      <div className="spinner-border text-secondary" role="status" />
      <Logo>
        <img
          src="https://ipfs.near.social/ipfs/bafkreiafms2jag3gjbypfceafz2uvs66o25qc7m6u6hkxfyrzfoeyvj7ru"
          alt="logo"
        />
        POTLOCK
      </Logo>
    </Container>
  );
};
export default SuspenseLoading;
