import { Container, Icon } from "./ButtonStyles";

type TargetValue = "_self" | "_blank" | "_parent" | "_top" | string;

type Props = {
  type?: "brand" | "standard";
  varient?: "outline" | "tonal" | "filled" | "plain";
  disabled?: boolean;
  href?: string;
  onClick?: (e: MouseEvent) => void;
  stopPropagation?: boolean;
  style?: React.CSSProperties;
  target?: TargetValue;
  iconSrc?: string;
  children: string | React.ReactNode;
};

const Button = ({
  type,
  varient,
  disabled,
  href,
  onClick,
  stopPropagation,
  style,
  target,
  iconSrc,
  children,
}: Props) => {
  return (
    <Container
      onClick={(e: any) => {
        if (!href) e.preventDefault();
        if (stopPropagation) e.stopPropagation();
        if (onClick) {
          onClick(e);
        }
      }}
      href={href}
      style={{ ...(style ?? {}) }}
      target={target}
    >
      <div className={`button ${disabled || ""} ${varient || "filled"} ${type || "brand"}`}>
        {iconSrc && <Icon src={iconSrc} />}
        {children}
      </div>
    </Container>
  );
};

export default Button;
