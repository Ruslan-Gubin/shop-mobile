import Svg, { Mask, Path, Rect } from "react-native-svg";

type Props = {
  width?: number;
  height?: number;
};

export const CashSvg = ({ width = 62, height = 40 }: Props) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 61 40" fill="none">
      <Mask id="path-1-inside-1_13106_188279" fill="white">
        <Path d="M5 5H61V40H5V5Z" />
      </Mask>
      <Path d="M5 5H61V40H5V5Z" fill="white" />
      <Path
        d="M61 5H63V3H61V5ZM61 40V42H63V40H61ZM5 5V7H61V5V3H5V5ZM61 5H59V40H61H63V5H61ZM61 40V38H5V40V42H61V40Z"
        fill="#4A5565"
        mask="url(#path-1-inside-1_13106_188279)"
      />
      <Rect x="1" y="1" width="54" height="33" fill="white" />
      <Rect x="1" y="1" width="54" height="33" stroke="#4A5565" strokeWidth="2" />
      <Rect x="17.7857" y="7.28571" width="20.4286" height="20.4286" rx="10.2143" fill="#FFCB54" />
      <Rect
        x="17.7857"
        y="7.28571"
        width="20.4286"
        height="20.4286"
        rx="10.2143"
        stroke="#FFCB54"
        strokeWidth="1.57143"
      />
      <Path
        d="M24.949 22.3281V20.162H23.6245V18.7907H24.949V17.731H23.6245V16.3597H24.949V11.3419H28.6735C29.4734 11.3419 30.1487 11.4769 30.6993 11.747C31.2603 12.0172 31.681 12.3963 31.9615 12.8846C32.2524 13.3729 32.3979 13.9443 32.3979 14.5988C32.3979 15.2325 32.2524 15.7831 31.9615 16.2506C31.6706 16.7181 31.2551 17.0817 30.7149 17.3415C30.1746 17.6012 29.5201 17.731 28.7514 17.731H26.9749V18.7907H29.4682V20.162H26.9749V22.3281H24.949ZM26.9437 16.3597H28.4241C29.0786 16.3597 29.5825 16.235 29.9357 15.9857C30.2889 15.7364 30.4655 15.3208 30.4655 14.739C30.4655 14.1573 30.2889 13.7261 29.9357 13.4456C29.5929 13.1651 29.089 13.0249 28.4241 13.0249H26.9437V16.3597Z"
        fill="white"
      />
    </Svg>
  );
};