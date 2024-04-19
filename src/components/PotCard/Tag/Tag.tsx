import { TagContainer, TagText } from "./styles";

type Props = {
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  textStyle?: any;
  text: string;
  preElements?: any;
};

const Tag = (props: Props) => {
  const { backgroundColor, borderColor, textColor, text } = props;

  const textStyle = props.textStyle || {};

  return (
    <TagContainer
      style={{
        backgroundColor: backgroundColor || "#ffffff",
        border: `1px solid ${borderColor || "#000000"}`,
        boxShadow: `0px -0.699999988079071px 0px ${borderColor} inset`,
      }}
    >
      {props.preElements}
      <TagText
        style={{
          color: textColor || "#000000",
          ...textStyle,
        }}
      >
        {text}
      </TagText>
    </TagContainer>
  );
};

export default Tag;
