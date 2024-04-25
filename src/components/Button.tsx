import styled from "styled-components";

type Props = {
  type?: "primary" | "secondary" | "tertiary";
  disabled?: boolean;
  href?: string;
  onClick?: (e: any) => void;
  stopPropagation?: boolean;
  style?: React.CSSProperties;
  target?: any;
  iconSrc?: string;
  text?: string;
};

const Button = ({ type, disabled, href, onClick, stopPropagation, style, target, iconSrc, text }: Props) => {
  const getButtonBackground = () => {
    if (type === "primary") {
      if (disabled) {
        return "#e5e5e5";
      }
      return "#dd3345";
    } else if (type === "secondary") {
      // TODO: handle disabled
      return "#FEF6EE";
    } else if (type === "tertiary") {
      return "white";
    }
  };

  const getButtonTextColor = () => {
    if (type === "primary") {
      if (disabled) {
        return "darkgrey";
      }
      return "white";
    } else if (type === "secondary") {
      return "#2E2E2E";
    }
  };

  const tag = href ? "a" : "button";

  const ButtonContainer = styled[tag]`
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 16px 24px;
    background: ${getButtonBackground()};
    overflow: hidden;
    box-shadow: 0px -2.700000047683716px 0px #4a4a4a inset;
    border-radius: 6px;
    border: 1px solid #4a4a4a;
    gap: 8px;
    display: inline-flex;
    text-align: center;
    color: ${getButtonTextColor()};
    font-size: 14px;
    line-height: 16px;
    font-weight: 600;
    cursor: ${disabled ? "not-allowed" : "pointer"} !important;
    &:hover {
      text-decoration: none;
    }
  `;

  const Icon = styled.img`
    width: 20px;
    height: 20px;
    object-fit: contain;
  `;

  return (
    <ButtonContainer
      onClick={(e: any) => {
        // if (disabled || onClick) return;
        if (stopPropagation) e.stopPropagation();
        // e.preventDefault();
        if (onClick) {
          onClick(e);
        }
      }}
      href={href}
      style={{ ...style }}
      target={target}
    >
      {iconSrc && <Icon src={iconSrc} />}
      {text}
    </ButtonContainer>
  );
};

export default Button;
