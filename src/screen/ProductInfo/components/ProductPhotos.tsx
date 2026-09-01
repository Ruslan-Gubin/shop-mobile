import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import type { PhotoModel } from '../../../shared/types/photo';
import { ImageMain } from '../../../shared/ui/image/ImageMain';

type Props = {
  photos: PhotoModel[];
};

export const ProductPhotos = (props: Props) => {
  const WINDOW_WIDTH = Dimensions.get('window').width;

  return (
    <View style={styles.container}>
      <FlatList
        data={props.photos}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <View style={[styles.imageContainer, { width: WINDOW_WIDTH }]}>
              <ImageMain uri={item?.url} style={styles.image} />
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={[styles.imageContainer, { width: WINDOW_WIDTH }]}>
            <ImageMain uri={''} style={styles.image} />
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: 'white',
  },
  imageContainer: {
    height: '100%',
    maxWidth: '100%',
    backgroundColor: 'white',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
