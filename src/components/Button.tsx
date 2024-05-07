import { Container, Icon } from "./ButtonStyles";

type TargetValue = "_self" | "_blank" | "_parent" | "_top" | string;

type Props = {
  type?: "brand" | "standard";
  varient?: "outline" | "tonal" | "filled" | "plain";
  customClassName?: string;
  isDisabled?: boolean;
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
  customClassName,
  isDisabled,
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
      {...{
        onClick: (e: any) => {
          if (stopPropagation) e.stopPropagation();
          if (onClick) {
            onClick(e);
          }
        },
        as: href ? "a" : "button",
        className: `${isDisabled ? "disabled" : ""} ${varient || "filled"} ${type || "brand"} ${customClassName || ""}`,
        style: style ?? {},
        target: target,
        ...(href ? { href } : {}),
      }}
      onClick={(e: any) => {
        if (stopPropagation) e.stopPropagation();
        if (onClick) {
          onClick(e);
        }
      }}
    >
      {iconSrc && <Icon src={iconSrc} />}
      {children}
    </Container>
  );
};

export default Button;
