import { FlatList, Pressable, StyleSheet, View } from "react-native";
import type { PhotoModel } from "../../../shared/types/photo";
import { ImageMain } from "../../../shared/ui/image/ImageMain";

type Props = {
  photos: PhotoModel[];
  id: number;
  handleNavigate: (id: number) => void;
  horizontal?: boolean;
};

export const ProductCardImage = (props: Props) => {
  return (
    <>
      {props.horizontal && props.photos.length > 0 && (
        <View style={styles.imageContainer}>
          <Pressable onPress={() => props.handleNavigate(props.id)}>
            <ImageMain uri={props.photos[0].url} style={styles.image} />
          </Pressable>
        </View>
      )}

      {props.photos.length > 0 && !props.horizontal && (
        <FlatList
          data={props.photos}
          pagingEnabled={true}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            return (
              <View style={styles.imageContainer}>
                <Pressable onPress={() => props.handleNavigate(props.id)}>
                  <ImageMain uri={item?.url} style={styles.image} />
                </Pressable>
              </View>
            );
          }}
        />
      )}

      {props.photos.length === 0 && (
        <View style={styles.imageContainer}>
          <Pressable onPress={() => props.handleNavigate(props.id)}>
            <ImageMain uri={""} style={styles.image} />
          </Pressable>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    height: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "white",

    maxWidth: "100%",
  },
  image: {
    width: "100%",
    // maxWidth: "50%",
    // aspectRatio: 3 / 4,
    height: "100%",
    // maxHeight: "100%",
    resizeMode: "cover",
  },
});
