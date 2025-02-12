import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserService } from '../apiService'; // Import the UserService

export default function LoginPage({ navigation }) {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showLoader, setShowLoader] = useState(false);

  const handleLogin = async () => {
    // Input validation
    if (!mobile || !password) {
      Alert.alert('Validation Error', 'Mobile and Password are required!');
      return;
    }

    if (mobile.length !== 10 || isNaN(mobile)) {
      Alert.alert('Validation Error', 'Enter a valid 10-digit mobile number!');
      return;
    }

    setShowLoader(true);

    try {
      // API call to validate user credentials
      const response = await UserService.getAllUsers();
      const users = response.data;

      // Check if the user exists with the provided credentials
      const user = users.find(
        (u) => u.mobile === mobile && u.password === password
      );

      if (user) {
        // Save user data to AsyncStorage
        await AsyncStorage.setItem('user', JSON.stringify(user));

        // Navigate to Home with user data
        navigation.navigate('Home', { userId: user.id });
      } else {
        Alert.alert('Login Failed', 'Invalid mobile or password!');
      }
    } catch (error) {
     // console.error('Login error:', error.message);
      Alert.alert('Error', 'Something went wrong while logging in.');
    } finally {
      setShowLoader(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hisaab Kitab</Text>
      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        keyboardType="numeric"
        value={mobile}
        placeholderTextColor="gray"
        onChangeText={setMobile}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        placeholderTextColor="gray"
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.link}
        onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>Register</Text>
      </TouchableOpacity>

      {showLoader && <ActivityIndicator size={50} color="green" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000000',
  },
  input: {
    width: '80%',
    color: '#000000',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 10,
  },
  linkText: {
    color: '#007bff',
    fontSize: 16,
  },
});
