import { StyleSheet, Text, View } from "react-native";
import { UserSvg } from "../../../../shared/svg/UserSvg";
import { WarehouseSvg } from "../../../../shared/svg/WarehouseSvg";

type Props = {
  address: string;
  type: "pickup" | "courier";
  size: "sm" | "md" | "lg";
  active: boolean;
};

export const CustomMarker = ({ address, type, size, active }: Props) => {
  const Icon = type === "courier" ? UserSvg : WarehouseSvg;

  const pointSize = active ? 0 : size === "sm" ? 24 : size === "md" ? 40 : 60;
  const iconSize = active ? 10 : size === "sm" ? 10 : size === "md" ? 16 : 18;

  return (
    <View style={styles.marker}>
      {active && (
        <View style={[styles.infoContainer, !address && styles.infoContainerNotAddress]}>
          <View style={styles.svgContainer}>
            <Icon fill="#fff" size={18} />
          </View>
          {address ? (
            <Text style={styles.addressText} numberOfLines={1}>
              {address}
            </Text>
          ) : null}
          <View style={styles.infoTail} />
        </View>
      )}
      <View
        style={[
          styles.point,
          !active && pointSize === 24 && styles.pointSmSize,
          !active && pointSize === 40 && styles.pointMdSize,
          !active && pointSize === 60 && styles.pointLgSize,
        ]}
      >
        {!active && <Icon fill="#fff" size={iconSize} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  marker: {
    position: "relative",
    paddingBottom: 18,
    alignItems: "center",
  },
  infoContainer: {
    position: "relative",
    height: 50,
    borderRadius: 30,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 6,
    backgroundColor: "#fff",
  },
  infoContainerNotAddress: {
    paddingHorizontal: 10,
  },
  infoTail: {
    position: "absolute",
    bottom: -6,
    left: "50%",
    transform: [{ translateX: -2 }],
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 14,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#fff",
  },
  svgContainer: {
    backgroundColor: "#f1117e",
    borderRadius: 50,
    height: 36,
    width: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  point: {
    position: "absolute",
    bottom: 0,
    borderWidth: 3,
    borderColor: "#fff",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    height: 12,
    width: 12,
    backgroundColor: "#f1117e",
  },
  pointSmSize: {
    position: "static",
    height: 24,
    width: 24,
    backgroundColor: "red",
  },
  pointMdSize: {
    position: "relative",
    height: 40,
    width: 40,
  },
  pointLgSize: {
    position: "static",
    height: 40,
    width: 40,
  },
  addressText: {
    fontWeight: "500",
    maxWidth: 200,
  },
});
