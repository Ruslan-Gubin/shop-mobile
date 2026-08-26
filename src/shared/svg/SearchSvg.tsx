import Svg, { G, Path } from "react-native-svg";

export const SearchSvg = (props: { fill: string; size: number }) => {
  return (
    <Svg height={props.size} width={props.size} viewBox="0 0 32 32">
      <G id="search">
        <Path
          d="M29.71,28.29l-6.5-6.5-.07,0a12,12,0,1,0-1.39,1.39s0,.05,0,.07l6.5,6.5a1,1,0,0,0,1.42,0A1,1,0,0,0,29.71,28.29ZM14,24A10,10,0,1,1,24,14,10,10,0,0,1,14,24Z"
          fill={props.fill}
        />
      </G>
    </Svg>
  );
};
