import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, PermissionsAndroid, Platform, TouchableHighlight, Alert } from 'react-native';
import Contacts from 'react-native-contacts';
import Footer from './Footer';

export default function AddCustomerPage({ navigation }) {
  const [search, setSearch] = useState('');
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);

  useEffect(() => {
    requestContactsPermission();
  }, []);

  // Request permission to access contacts
  const requestContactsPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        loadContacts();
      } else {
        Alert.alert('Contacts permission denied');
      }
    } else {
      loadContacts(); // iOS does not need explicit permissions in most cases
    }
  };

  // Load contacts from the device
  const loadContacts = () => {
    if (!Contacts || !Contacts.getAll) {
      console.error("Contacts module is null or not initialized");
      Alert.alert("Error", "Contacts module is not available");
      return;
    }
    
    Contacts.getAll()
      .then(contactList => {
        const formattedContacts = contactList.map(contact => ({
          name: contact.displayName || 'No Name',
          phone: contact.phoneNumbers[0]?.number || 'No Number',
        }));
        setContacts(formattedContacts);
        setFilteredContacts(formattedContacts); // Initially show all contacts
      })
      .catch(error => {
        Alert.alert('Error', 'Failed to load contacts');
        console.error('Failed to load contacts:', error);
      });
  };

  // Filter contacts based on search query
  const handleSearch = text => {
    setSearch(text);
    const filtered = contacts.filter(contact =>
      contact.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredContacts(filtered);
  };

  // Navigate to CustomerHomePage with selected contact details
  const navigateToCustomerHome = (contact) => {
    navigation.navigate('CustomerHomePage', {
      customerName: contact.name,
      customerPhone: contact.phone,
    });
  };

  return (
    <View style={styles.container}>
      {/* Header with Search Bar */}
      <View style={styles.header}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search Contact"
          value={search}
          placeholderTextColor="gray"
          onChangeText={handleSearch}
        />
      </View>

      {/* Contact List */}
      <FlatList
        data={filteredContacts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableHighlight
            underlayColor="#ddd"
            onPress={() => navigateToCustomerHome(item)} // Navigate on click
            style={styles.contactItem}
          >
            <View style={styles.contactRow}>
              <Text style={styles.contactName}>{item.name}</Text>
              <Text style={styles.contactPhone}>{item.phone}</Text>
            </View>
          </TouchableHighlight>
        )}
      />

      {/* Add New Customer Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('NewCustomerPage')}
      >
        <Text style={styles.addButtonText}>Add New Customer</Text>
      </TouchableOpacity>

      {/* Footer Component */}
      <Footer navigation={navigation} activeTab="AddCustomer" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007bff',
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    fontSize: 16,
  },
  contactItem: {
    backgroundColor: '#fff',
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 8,
    elevation: 2,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactPhone: {
    fontSize: 16,
    color: '#777',
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
