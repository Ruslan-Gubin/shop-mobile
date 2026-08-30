import Svg, { ClipPath, Defs, G, LinearGradient, Path, Rect, Stop } from "react-native-svg";

type Props = {
  width?: number;
  height?: number;
};

export const BankCardSvg = ({ width = 62, height = 40 }: Props) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 59 40" fill="none">
      <Rect x="1" y="1" width="56.3333" height="38" rx="2" fill="white" />
      <Rect x="1" y="1" width="56.3333" height="38" rx="2" stroke="#4A5565" strokeWidth="2" />
      <G clipPath="url(#clip0_13106_188289)">
        <Path
          d="M9.53613 10.6971H13.2074C13.5411 10.6971 14.5424 10.5858 14.9874 12.1433C15.3211 13.1446 15.7661 14.7021 16.4336 17.0383H16.6561C17.3236 14.5908 17.8799 12.9221 18.1024 12.1433C18.5474 10.5858 19.6599 10.6971 20.1049 10.6971H23.5536V21.3771H19.9936V15.0358H19.7711L17.8799 21.3771H15.2099L13.3186 15.0358H12.9849V21.3771H9.53613M24.9999 10.6971H28.5599V17.0383H28.8936L31.2299 11.8096C31.6749 10.8083 32.6761 10.6971 32.6761 10.6971H36.0136V21.3771H32.4536V15.0358H32.2311L29.8949 20.2646C29.4499 21.2658 28.3374 21.3771 28.3374 21.3771H24.9999M40.7974 18.1508V21.3771H37.4599V15.8146H48.3624C47.9174 17.1496 46.3599 18.1508 44.5799 18.1508"
          fill="#0F754E"
        />
        <Path
          d="M48.5838 15.1531C49.0288 13.1506 47.6938 10.7031 44.8013 10.7031H37.2363C37.4588 13.0394 39.4613 15.1531 41.5751 15.1531"
          fill="url(#paint0_linear_13106_188289)"
        />
      </G>
      <Rect width="55" height="5" transform="translate(1.66602 29.4375)" fill="#4A5565" />
      <Defs>
        <LinearGradient id="paint0_linear_13106_188289" x1="47.2488" y1="9.25687" x2="38.3488" y2="9.25687" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#1F5CD7" />
          <Stop offset="1" stopColor="#02AEFF" />
        </LinearGradient>
        <ClipPath id="clip0_13106_188289">
          <Rect
            width="39.16"
            height="10.5688"
            fill="white"
            transform="translate(9.58594 10.7188)"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
};