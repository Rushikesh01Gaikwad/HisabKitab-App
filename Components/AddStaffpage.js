import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StaffService} from '../apiService'; // Import the StaffService
import Footer from './Footer';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import Icon

export default function AddStaff({navigation}) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userID, setUserId] = useState(null);

  const getUserID = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        return user.userID;
      }
    } catch (error) {
      console.warn('Error fetching user data:', error.message);
    }
    return null;
  };

  const addStaff = async () => {
    const retrievedUserID = await getUserID();
    if (!retrievedUserID) {
      Alert.alert('Error', 'Unable to retrieve user ID. Please try again.');
      return;
    }
    setUserId(retrievedUserID);

    if (!name || !mobile || !password) {
      Alert.alert('Validation Error', 'All fields are required!');
      return;
    }

    if (mobile.length !== 10 || isNaN(mobile)) {
      Alert.alert('Validation Error', 'Enter a valid 10-digit mobile number!');
      return;
    }

    setLoading(true);

    try {
      const staffData = {
        name,
        mobile,
        password,
        userId: retrievedUserID,
      };

      const response = await StaffService.createStaff(staffData);
      if (response.status === 201) {
        Alert.alert('Success', 'Staff member added successfully!');
        navigation.navigate('Home');
      } else {
        throw new Error('Failed to add staff. Try again later.');
      }
    } catch (error) {
      console.warn('Add Staff Error:', error.message);
      Alert.alert('Error', 'Something went wrong while adding the staff.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Staff</Text>
        <TouchableOpacity
        style={styles.ListStaff}
          onPress={async () => {
            const retrievedUserID = await getUserID();
            if (retrievedUserID) {
              navigation.navigate('StaffList', retrievedUserID);
            } else {
              Alert.alert('Error', 'Unable to retrieve user ID.');
            }
          }}>
            <Text style={styles.ListBtn}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Add your staff</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
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
        <TouchableOpacity style={styles.button} onPress={addStaff}>
          <Text style={styles.buttonText}>
            {loading ? 'Submitting...' : 'Submit'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <Footer navigation={navigation} activeTab="AddStaff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
  },
  header: {
    height: 60,
    backgroundColor: '#007bff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },

  ListStaff: {
    backgroundColor: '#bfff66',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  ListBtn: {
    
    fontWeight: 'bold',
    fontSize:15
    //width: '20%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
