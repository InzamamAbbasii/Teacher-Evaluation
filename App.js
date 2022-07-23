import {View, Text, StatusBar} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

//auth screens
import LoginScreen from './src/screens/AuthScreen/LoginScreen';

//students screens
import StudentCourses from './src/screens/Student/StudentCourses';
import StudentEvaluation from './src/screens/Student/StudentEvaluation';
//Admin screens
import AddTempleate from './src/screens/Admin/AddTempleate';
//Director Screen
import TeacherPerformance from './src/screens/Director/TeacherPerformance';
import TeacherRating from './src/screens/Director/TeacherRating';
const Stack = createNativeStackNavigator();

const App = () => {
  global.ip = '192.168.1.102';
  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="TeacherPerformance"
          component={TeacherPerformance}
        />
        <Stack.Screen name="TeacherRating" component={TeacherRating} />
        <Stack.Screen name="StudentCourses" component={StudentCourses} />
        <Stack.Screen name="StudentEvaluation" component={StudentEvaluation} />
        <Stack.Screen name="AddTempleate" component={AddTempleate} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
