import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { UserService } from '../apiService';

export default function RegisterPage({ navigation }) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [businessName, setBusinessName] = useState('');

  const handleRegister = async () => {
    // Input validation
    if (!name || !mobile || !password || !businessName) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    if (mobile.length < 10) {
      Alert.alert('Validation Error', 'Mobile number must be at least 10 digits.');
      return;
    }


    const user = {
      name,
      mobile,
      password,
      recAmount: 0,
      paidAmount: 0,
      businessName,
      staffs: [],
      customers: []
    };

    try {
      setLoading(true);
      const response = await UserService.createUser(user); // API call
      setLoading(false);

      if (response.status === 201) {
        Alert.alert('Success', 'User registered successfully!');
        navigation.navigate('Login'); // Navigate to Login on success
      } else {
        Alert.alert('Error', 'Failed to register user. Please try again.');
      }
    } catch (error) {
      setLoading(false);
      console.warn(error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Business Name"
        value={businessName}
        onChangeText={setBusinessName}
      />
      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        keyboardType="numeric"
        value={mobile}
        onChangeText={setMobile}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={!toggle}
        value={password}
        onChangeText={setPassword}
      />
      <View style={styles.toggleContainer}>
        <Text>Show Password</Text>
        <Switch value={toggle} onValueChange={() => setToggle(!toggle)} />
      </View>
      <TouchableOpacity
        style={[styles.button, loading && { backgroundColor: '#ccc' }]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Submit</Text>
        )}
      </TouchableOpacity>
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#28a745',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
