import { useState } from "react";
import { Image } from "react-native";

type Props = {
  uri: string;
  style: Record<string, string | number>;
};

export const ImageMain = (props: Props) => {
  const [error, setError] = useState<boolean>(false);

  return (
    <Image
      style={props.style}
      source={
        error || !props.uri ? require("../../../../image/empty-photo.jpg") : { uri: props.uri }
      }
      defaultSource={require("../../../../image/empty-photo.jpg")}
      onError={() => !error && setError(true)}
    />
  );
};
