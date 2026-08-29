import Svg, { Path } from "react-native-svg";

export const MinusSvg = (props: { fill: string; size: number }) => {
  return (
    <Svg width={props.size} height={props.size} viewBox="0 0 20 20" fill="none">
      <Path d="M3 9H17V11H3V9Z" fill={props.fill}></Path>
    </Svg>
  );
};
