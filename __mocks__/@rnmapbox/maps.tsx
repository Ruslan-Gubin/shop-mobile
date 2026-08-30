import React from "react";
import { View } from "react-native";

const StubComponent = (props: Record<string, unknown>) => <View {...props} />;

export default {
  setAccessToken: () => undefined,
  MapView: StubComponent,
  Camera: StubComponent,
  PointAnnotation: StubComponent,
};