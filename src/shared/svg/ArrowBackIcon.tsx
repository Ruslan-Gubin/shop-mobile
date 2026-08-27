import Svg, { Path } from "react-native-svg";

export const ArrowBackIcon = (props: { fill: string; size: number }) => {
  return (
    <Svg
      width={props.size}
      height={props.size}
      viewBox="0 0 24 24"
      fill="none"
      transform={"rotate(90)"}
    >
      <Path
        d="M8 10L12 14L16 10"
        stroke={props.fill}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
