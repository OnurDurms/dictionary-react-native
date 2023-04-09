import React, {useState} from 'react';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/components/HomeScreen';
import ViewAllWordsScreen from './src/components/ViewAllWordsScreen';
import EditRecordScreen from './src/components/EditRecordScreen';
import CarouselScreen from './src/components/CarouselScreen';
import LoginScreen from './src/components/LoginScreen';

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">

        <Stack.Screen options={{title: ""}} name="LoginScreen" component={LoginScreen} />

        <Stack.Screen options={{title: ""}} name="HomeScreen" component={HomeScreen} />

        <Stack.Screen options={{title: ""}} name="ViewAllWordsScreen" component={ViewAllWordsScreen} />

        <Stack.Screen options={{title: ""}} name="EditRecordScreen" component={EditRecordScreen} />

        <Stack.Screen options={{title: ""}} name="SliderScreen" component={CarouselScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  )
}