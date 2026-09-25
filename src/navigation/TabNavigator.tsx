import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, View } from "react-native";
import { AddAddressScreen } from "../screen/AddAddress/AddAddressScreen";
import { BasketScreen } from "../screen/Basket/BasketScreen";
import { CatalogScreen } from "../screen/Catalog/CatalogScreen";
import { CheckoutScreen } from "../screen/Checkout/CheckoutScreen";
import { FavoritesScreen } from "../screen/Favorites/Favorites";
import { HomeScreen } from "../screen/Home/HomeScreen";
import { MenuScreen } from "../screen/Menu/MenuScreen";
import { OrderDetailScreen } from "../screen/OrderDetail/OrderDetailScreen";
import { OrdersScreen } from "../screen/Orders/OrdersScreen";
import { ProductInfoScreen } from "../screen/ProductInfo/ProductInfoScreen";
import { ProfileScreen } from "../screen/Profile/ProfileScreen";
import { ProfileSettingsScreen } from "../screen/ProfileSettings/ProfileSettingsScreen";
import { QuestionsScreen } from "../screen/Questions/QuestionsScreen";
import { UserProductQuestionsScreen } from "../screen/Questions/UserProductQuestionsScreen";
import { RecentScreen } from "../screen/Recent/RecentScreen";
import { ReviewsScreen } from "../screen/Reviews/ReviewsScreen";
import { SearchScreen } from "../screen/Search/SearchScreen";
import { UserProductReviewScreen } from "../screen/UserReviews/UserProductReviewScreen";
import { UserReviewsScreen } from "../screen/UserReviews/UserReviewsScreen";
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
      <RootStack.Screen key="Recent" name="Recent" component={RecentScreen} />
      <RootStack.Screen key="ProductInfo" name="ProductInfo" component={ProductInfoScreen} />
      <RootStack.Screen key="ReviewsScreen" name="ReviewsScreen" component={ReviewsScreen} />
      <RootStack.Screen key="QuestionsScreen" name="QuestionsScreen" component={QuestionsScreen} />
    </RootStack.Navigator>
  );
};

const MenuStack = () => {
  return (
    <RootStack.Navigator
      screenOptions={{ headerShown: false, animation: "fade" }}
      initialRouteName="Menu"
    >
      <RootStack.Screen key="Menu" name="Menu" component={MenuScreen} />
      <RootStack.Screen key="Catalog" name="Catalog" component={CatalogScreen} />
      <RootStack.Screen key="Search" name="Search" component={SearchScreen} />
      <RootStack.Screen key="Recent" name="Recent" component={RecentScreen} />
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
      <RootStack.Screen name="OrderDetail" component={OrderDetailScreen} />
      <RootStack.Screen name="AddAddress" component={AddAddressScreen} />
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
      <RootStack.Screen key="Orders" name="Orders" component={OrdersScreen} />
      <RootStack.Screen name="OrderDetail" component={OrderDetailScreen} />
      <RootStack.Screen key="UserReviews" name="UserReviews" component={UserReviewsScreen} />
      <RootStack.Screen
        key="ProfileSettings"
        name="ProfileSettings"
        component={ProfileSettingsScreen}
      />
      <RootStack.Screen
        key="UserProductQuestions"
        name="UserProductQuestions"
        component={UserProductQuestionsScreen}
      />
      <RootStack.Screen
        key="UserProductReview"
        name="UserProductReview"
        component={UserProductReviewScreen}
      />
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
        key="MenuStack"
        name="MenuStack"
        component={MenuStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.menuItem}>
              <MenuSvg fill={focused ? "#a73afd" : "#c8c8d1"} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        key="BasketStack"
        name="BasketStack"
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
