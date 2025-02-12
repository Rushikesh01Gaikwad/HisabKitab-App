import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from './Footer';
import {CustomerService} from '../apiService';
import {UserService} from '../apiService';

export default function HomePage() {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userID, setUserId] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [paidAmount, setPaidAmount] = useState(0);
  const [receivedAmount, setReceivedAmount] = useState(0);
  const [businessName, setBusinessName] = useState('Hisab Kitab');
  const navigation = useNavigation();

  const getUserID = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setBusinessName(user.businessName);
        setPaidAmount(user.paidAmount);
        setReceivedAmount(user.recAmount);
        console.log(user);
        return user.userID;
      }
    } catch (error) {
      console.error('Error fetching user data:', error.message);
    }
    return null;
  };

  useEffect(() => {
    (async () => {
      const retrievedUserID = await getUserID();
      if (!retrievedUserID) {
        Alert.alert('Error', 'Unable to retrieve user ID. Please try again.');
        return;
      }
      setUserId(retrievedUserID);
      fetchCustomers(retrievedUserID);
    })();
  }, []);

  const fetchCustomers = async userID => {
    try {
      setLoading(true);
      const response = await CustomerService.getAllCustomersByUserId(userID);
      const customerData = response.data || [];
      console.log(customerData);
      setCustomers(customerData);
      setFilteredCustomers(customerData);
    } catch (error) {
      // console.error('Error fetching customers:', error);
      //Alert.alert('Error', 'Failed to load customers.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCustomers(customers);
    } else {
      setFilteredCustomers(
        customers.filter(customer =>
          customer.name.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      );
    }
  }, [searchQuery, customers]);

  const handleDeleteCustomer = async () => {
    try {
      setLoading(true);
      await CustomerService.deleteCustomer(selectedCustomer.customerID);

      const response = await UserService.getUserById(userID);
      const updatedUser = response.data;

      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setPaidAmount(updatedUser.paidAmount);
      setReceivedAmount(updatedUser.recAmount);

      const updatedCustomers = customers.filter(
        customer => customer.customerID !== selectedCustomer.customerID,
      );
      setCustomers(updatedCustomers);
      setFilteredCustomers(updatedCustomers);

      Alert.alert('Success', 'Customer deleted successfully.');
    } catch (error) {
      console.error('Error deleting customer:', error);
      Alert.alert('Error', 'Failed to delete customer.');
    } finally {
      setLoading(false);
      setDeleteModalVisible(false);
    }
  };

  const handleLongPress = customer => {
    setSelectedCustomer(customer);
    setDeleteModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.companyName}>{businessName}</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>✖️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summarySection}>
        <Text style={styles.summaryText}>Total Paid: {paidAmount || 0}</Text>
        <Text style={styles.summaryText}>
          Total Received: {receivedAmount || 0}
        </Text>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="Search Customer"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#007bff"
          style={{marginTop: 50}}
        />
      ) : filteredCustomers.length === 0 ? (
        <Text style={styles.noCustomersText}>No customers found</Text>
      ) : (
        <FlatList
          data={filteredCustomers}
          keyExtractor={(item, index) => index.toString()}
         
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.customerItem}
              onPress={() =>
                navigation.navigate('CustomerHomePage', {customer: item})
              }
              onLongPress={() => handleLongPress(item)}>
              <Text style={styles.customerText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <Modal
        transparent
        visible={isDeleteModalVisible}
        animationType="slide"
        onRequestClose={() => setDeleteModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to delete this customer?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleDeleteCustomer}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setDeleteModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.footerContainer}>
        <Footer navigation={navigation} activeTab="Home" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingBottom: 60
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007bff',
  },
  companyName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    width: '80%',
  },
  logoutButton: {
    backgroundColor: '#bfff66',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  logoutText: {
    
    //fontWeight: 'bold',
    fontSize:15
    //width: '20%',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addBusinessButton: {
    backgroundColor: '#bfff66',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  headerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  summarySection: {
    padding: 20,
    backgroundColor: '#fff',
    marginVertical: 10,
    borderRadius: 10,
    elevation: 2,
  },
  summaryText: {
    fontSize: 16,
    marginVertical: 5,
  },

  submitButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },

  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchBar: {
    margin: 10,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
  },

  noCustomersText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },

  customerItem: {
    padding: 15,
    backgroundColor: '#fff',
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 8,
    elevation: 1,
  },
  customerText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  businessItem: {
    padding: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  addBusinessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  input: {
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    flex: 1,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    //backgroundColor: '#fff', // Adjust based on your design
    // padding: 10,
    // borderTopWidth: 1, // Optional: adds a border at the top of the footer
    // borderTopColor: '#ccc', // Optional: sets the color of the top border
  },
});
