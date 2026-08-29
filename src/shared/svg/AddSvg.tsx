import Svg, { Path } from "react-native-svg";

export const AddSvg = (props: { fill: string; size: number }) => {
  return (
    <Svg width={props.size} height={props.size} viewBox="0 0 20 20" fill="none">
      <Path d="M17 11H11V17H9V11H3V9H9V3H11V9H17V11Z" fill={props.fill}></Path>
    </Svg>
  );
};
