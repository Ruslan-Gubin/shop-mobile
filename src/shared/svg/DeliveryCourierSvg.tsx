import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";

type Props = {
  fill?: string;
  size?: number;
};

export const DeliveryCourierSvg = ({ fill = "#727272", size = 24 }: Props) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G clipPath="url(#clip0_12686_19696)">
        <Path
          d="M17.8688 4.64947C18.6985 4.29387 19.5374 5.13281 19.1818 5.96253L13.2326 19.8441C12.8241 20.7973 11.4135 20.5752 11.3177 19.5425L10.7979 13.9371C10.7534 13.4578 10.3738 13.0782 9.8945 13.0337L4.28854 12.5137C3.25592 12.4179 3.03378 11.0073 3.98698 10.5988L17.8688 4.64947Z"
          fill={fill}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_12686_19696">
          <Rect width="24" height="24" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};