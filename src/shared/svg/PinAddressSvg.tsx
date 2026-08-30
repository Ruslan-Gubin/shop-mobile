import Svg, { Path } from "react-native-svg";

type Props = {
  fill?: string;
  size?: number;
};

export const PinAddressSvg = ({ fill = "#f1117e", size = 32 }: Props) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        fill={fill}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 30.667s11.997-8.044 11.997-17.336c0-6.626-5.371-11.998-11.997-11.998S4.002 6.705 4.002 13.331C4.002 22.623 16 30.667 16 30.667m0-21.334a4 4 0 1 0 0 8 4 4 0 0 0 0-8"
      />
    </Svg>
  );
};