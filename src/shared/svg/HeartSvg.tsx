import Svg, { Path } from "react-native-svg";

export const HeartSvg = (props: { active: boolean; size?: number }) => {
  return (
    <Svg
      width={props.size ? props.size : 20}
      height={props.size ? props.size : 20}
      viewBox="0 0 24 24"
      data-active={props.active}
    >
      <Path
        fill={props.active ? "red" : "rgba(255, 255, 255, 0.8)"}
        stroke={props.active ? "red" : "#242424"}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      />
    </Svg>
  );
};
