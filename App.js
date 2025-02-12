import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginPage from './Components/LoginPage';
import RegisterPage from './Components/RegisterPage';
import HomePage from './Components/HomePage';
import AddCustomerPage from './Components/AddCustomerPage';
import NewCustomerPage from './Components/NewCustomerPage';
import CustomerHomePage from './Components/CustomerHomePage';
import AddStaff from './Components/AddStaffpage';
import { View, ActivityIndicator } from 'react-native';
import StaffList from './Components/StaffList';

const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Login');

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          // If user data exists, set the initial route to "Home"
          setInitialRoute('Home');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      } finally {
        setIsLoading(false); // Set loading to false once check is complete
      }
    };

    checkLoginStatus();
  }, []);

  if (isLoading) {
    // Show a loading spinner while checking the login status
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterPage} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomePage} options={{ headerShown: false }} />
        <Stack.Screen name="AddCustomer" component={AddCustomerPage} options={{ headerShown: false }} />
        <Stack.Screen name="NewCustomerPage" component={NewCustomerPage} />
        <Stack.Screen name="CustomerHomePage" component={CustomerHomePage} />
        <Stack.Screen name="addStaff" component={AddStaff} options={{ headerShown: false }} />
        <Stack.Screen name="StaffList" component={StaffList}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
