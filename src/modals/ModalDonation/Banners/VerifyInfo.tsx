import { VerifyInfoWrapper } from "./styles";

const VerifyInfo = () => (
  <VerifyInfoWrapper>
    <div className="icon">
      <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0.75 15.125H17.25L9 0.875L0.75 15.125ZM9.75 12.875H8.25V11.375H9.75V12.875ZM9.75 9.875H8.25V6.875H9.75V9.875Z"
          fill="#ECC113"
        />
      </svg>
    </div>
    <div className="text">
      Your contribution won't be matched unless verified as human before the matching round ends.
    </div>
    <a href="https://app.nada.bot/" target="_blank">
      Verify you’re human
    </a>
  </VerifyInfoWrapper>
);

export default VerifyInfo;
