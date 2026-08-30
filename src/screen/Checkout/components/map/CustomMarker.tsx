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
  const iconSize = active ? 12 : size === "sm" ? 12 : size === "md" ? 20 : 22;

  return (
    <View style={styles.marker}>
      {active && (
        <View style={[styles.infoContainer, !address && styles.infoContainerNotAddress]}>
          <View style={styles.svgContainer}>
            <Icon fill="#fff" size={24} />
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
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 6,
    borderWidth: 1.5,
    borderColor: "rgba(0, 26, 52, 0.05)",
    shadowColor: "#001a34",
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 6,
  },
  infoContainerNotAddress: {
    paddingHorizontal: 10,
  },
  infoTail: {
    position: "absolute",
    bottom: -14,
    left: "50%",
    marginLeft: -10,
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
    height: 44,
    width: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  point: {
    position: "absolute",
    bottom: -6,
    backgroundColor: "#f1117e",
    borderWidth: 3,
    borderColor: "#fff",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    height: 12,
    width: 12,
  },
  pointSmSize: {
    height: 24,
    width: 24,
    shadowColor: "#001a34",
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 6,
  },
  pointMdSize: {
    height: 40,
    width: 40,
    shadowColor: "#001a34",
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 6,
  },
  pointLgSize: {
    height: 60,
    width: 60,
    shadowColor: "#001a34",
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 6,
  },
  addressText: {
    fontSize: 14,
    fontWeight: "500",
    maxWidth: 200,
    color: "#242424",
  },
});