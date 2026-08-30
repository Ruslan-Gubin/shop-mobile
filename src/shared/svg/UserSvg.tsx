import Svg, { G, Path } from "react-native-svg";

type Props = {
  fill?: string;
  size?: number;
};

export const UserSvg = ({ fill = "#fff", size = 24 }: Props) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <G id="about">
        <Path fill={fill} d="M16,16A7,7,0,1,0,9,9,7,7,0,0,0,16,16Z" />
        <Path fill={fill} d="M17,18H15A11,11,0,0,0,4,29a1,1,0,0,0,1,1H27a1,1,0,0,0,1-1A11,11,0,0,0,17,18Z" />
      </G>
    </Svg>
  );
};