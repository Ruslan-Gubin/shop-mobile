import Svg, { Circle, Path, Rect } from "react-native-svg";

export const EmptySvg = () => {
  return (
    <Svg width="300" height="400" viewBox="0 0 300 400">
      <Rect width="300" height="400" fill="#ececec" />
      <Circle cx="120" cy="135" r="30" fill="#d5d5d5" />
      <Path d="M45 330 L115 240 L170 300 L215 260 L275 330 Z" fill="#d5d5d5" />
    </Svg>
  );
};
