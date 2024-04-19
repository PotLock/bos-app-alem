import { AlertBanner } from "./styles";

const Alert = ({ error }: any) => (
  <AlertBanner>
    <div className="icon">
      <svg viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M11 4.49L18.53 17.5H3.47L11 4.49ZM11 0.5L0 19.5H22L11 0.5ZM12 14.5H10V16.5H12V14.5ZM12 8.5H10V12.5H12V8.5Z"
          fill="#F6767A"
        />
      </svg>
    </div>
    <div>{error}</div>
  </AlertBanner>
);

export default Alert;
