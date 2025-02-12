import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function NewCustomerPage({ navigation }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleAddCustomer = () => {
    // Validate inputs
    if (!name || !phone) {
      Alert.alert('Error', 'Please fill out both fields');
      return;
    }
    Alert.alert('Success', `Customer ${name} added successfully!`);
    
    // Navigate to the Customer Home Page
    navigation.navigate('CustomerHomePage',{ customerName: name, customerPhone: phone });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Customer</Text>

      {/* Input Field for Name */}
      <TextInput
        style={styles.input}
        placeholder="Enter Customer Name"
        placeholderTextColor='gray'
        value={name}
        onChangeText={setName}
      />

      {/* Input Field for Phone Number */}
      <TextInput
        style={styles.input}
        placeholder="Enter Mobile Number"
        placeholderTextColor='gray'
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      {/* Add Customer Button */}
      <TouchableOpacity style={styles.button} onPress={handleAddCustomer}>
        <Text style={styles.buttonText}>Add Customer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#007bff',
  },
  input: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
