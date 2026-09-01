import type { ParamListBase } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { PageHeader } from '../../shared/ui/header/PageHeader';

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase, 'QuestionsScreen'>;
};

export const QuestionsScreen = (props: Props) => {
  return (
    <View style={styles.root}>
      <PageHeader title="Вопросы" onBack={() => props.navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.text}>Экран вопросов появится позже.</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    padding: 16,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: '#242424',
  },
});
