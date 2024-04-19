import { Outer, Inner } from "./styles";

type Props = {
  colorOuter: string;
  colorInner: string;
  animate?: boolean;
};

const Indicator = ({ animate, colorInner, colorOuter }: Props) => {
  return (
    <Outer
      style={{
        backgroundColor: colorOuter,
        animationPlayState: animate ? "running" : "paused",
      }}
    >
      <Inner style={{ backgroundColor: colorInner }} />
    </Outer>
  );
};

export default Indicator;
