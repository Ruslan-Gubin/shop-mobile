import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, View } from "react-native";
import { BasketScreen } from "../screen/Basket/BasketScreen";
import { CatalogScreen } from "../screen/Catalog/CatalogScreen";
import { CheckoutScreen } from "../screen/Checkout/CheckoutScreen";
import { FavoritesScreen } from "../screen/Favorites/Favorites";
import { HomeScreen } from "../screen/Home/HomeScreen";
import { ProductInfoScreen } from "../screen/ProductInfo/ProductInfoScreen";
import { ProfileScreen } from "../screen/Profile/ProfileScreen";
import { QuestionsScreen } from "../screen/Questions/QuestionsScreen";
import { RecentScreen } from "../screen/Recent/RecentScreen";
import { ReviewsScreen } from "../screen/Reviews/ReviewsScreen";
import { SearchScreen } from "../screen/Search/SearchScreen";
import { AccountSvg } from "../shared/svg/AccountSvg";
import { CartSvg } from "../shared/svg/CartSvg";
import { HomeSvg } from "../shared/svg/HomeSvg";
import { MenuSvg } from "../shared/svg/MenuSvg";
import { CountBasket } from "./CountBasket";

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false, animation: "fade" }}>
      <RootStack.Screen key="Home" name="Home" component={HomeScreen} />
      <RootStack.Screen key="Search" name="Search" component={SearchScreen} />
      <RootStack.Screen key="Catalog" name="Catalog" component={CatalogScreen} />
      <RootStack.Screen key="ProductInfo" name="ProductInfo" component={ProductInfoScreen} />
      <RootStack.Screen key="ReviewsScreen" name="ReviewsScreen" component={ReviewsScreen} />
      <RootStack.Screen key="QuestionsScreen" name="QuestionsScreen" component={QuestionsScreen} />
    </RootStack.Navigator>
  );
};

const CatalogStack = () => {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false, animation: "fade" }}>
      <RootStack.Screen key="Catalog" name="Catalog" component={CatalogScreen} />
      <RootStack.Screen key="ProductInfo" name="ProductInfo" component={ProductInfoScreen} />
      <RootStack.Screen key="ReviewsScreen" name="ReviewsScreen" component={ReviewsScreen} />
      <RootStack.Screen key="QuestionsScreen" name="QuestionsScreen" component={QuestionsScreen} />
    </RootStack.Navigator>
  );
};

const BasketStack = () => {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false, animation: "fade" }}>
      <RootStack.Screen key="Basket" name="Basket" component={BasketScreen} />
      <RootStack.Screen key="Checkout" name="Checkout" component={CheckoutScreen} />
      <RootStack.Screen key="ProductInfo" name="ProductInfo" component={ProductInfoScreen} />
      <RootStack.Screen key="ReviewsScreen" name="ReviewsScreen" component={ReviewsScreen} />
      <RootStack.Screen key="QuestionsScreen" name="QuestionsScreen" component={QuestionsScreen} />
    </RootStack.Navigator>
  );
};

const ProfileStack = () => {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false, animation: "fade" }}>
      <RootStack.Screen key="Profile" name="Profile" component={ProfileScreen} />
      <RootStack.Screen key="Favorites" name="Favorites" component={FavoritesScreen} />
      <RootStack.Screen key="Recent" name="Recent" component={RecentScreen} />
      <RootStack.Screen key="ProductInfo" name="ProductInfo" component={ProductInfoScreen} />
      <RootStack.Screen key="ReviewsScreen" name="ReviewsScreen" component={ReviewsScreen} />
      <RootStack.Screen key="QuestionsScreen" name="QuestionsScreen" component={QuestionsScreen} />
    </RootStack.Navigator>
  );
};

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        key="HomeStack"
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.menuItem}>
              <HomeSvg fill={focused ? "#a73afd" : "#c8c8d1"} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        key="CatalogStack"
        name="CatalogStack"
        component={CatalogStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.menuItem}>
              <MenuSvg fill={focused ? "#a73afd" : "#c8c8d1"} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        key="CartStack"
        name="CartStack"
        component={BasketStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.menuItem}>
              <CountBasket />
              <CartSvg size={20} fill={focused ? "#a73afd" : "#c8c8d1"} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        key="ProfileStack"
        name="ProfileStack"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.menuItem}>
              <AccountSvg fill={focused ? "#a73afd" : "#c8c8d1"} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBlock: 6,
    backgroundColor: "white",
  },
  menuItem: {
    padding: 8,
  },
});
