/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import OnBoardScreen from './src/views/OnBoardScreen';
import HomeScreen from './src/views/HomeScreen';
import DetailsScreen from './src/views/DetailsScreen';
import SaveScreen from './src/views/SaveScreen';
import ProfileScreen from './src/views/ProfileScreen';
import MapNavigation from './src/components/MapNavigation';
import LoginScreen from './src/views/LoginScreen';
import SignUpScreen from './src/views/SignUpScreen';
import Pan from './src/components/Pan';
import OuterWeb from './src/components/OuterWeb';
import RecommendScreen from './src/views/RecommendScreen';
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="OnBoardScreen" component={OnBoardScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="DetailsScreen" component={DetailsScreen} />
        <Stack.Screen name="SaveScreen" component={SaveScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="MapNavigation" component={MapNavigation} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="PanScreen" component={Pan} />
        <Stack.Screen name="OuterWeb" component={OuterWeb} />
        <Stack.Screen name="RecommendScreen" component={RecommendScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
