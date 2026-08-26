import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";

export const MenuSvg = (props: { fill: string }) => {
  return (
    <Svg fill="none" viewBox="0 0 24 24" width={20} height={20}>
      <G clipPath="url(#clip0_105_1724)">
        <Path
          d="M3 6.00098H21M3 12.001H21M3 18.001H21"
          stroke={props.fill}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_105_1724">
          <Rect fill="white" height="24" transform="translate(0 0.000976562)" width="24" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
