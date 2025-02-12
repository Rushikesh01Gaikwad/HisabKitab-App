import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Footer({ navigation, activeTab }) {
  return (
    <View style={styles.footer}>
      {/* Home Tab */}
      <TouchableOpacity
        style={[
          styles.footerTab,
          activeTab === 'Home' && styles.activeTab,
        ]}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={[styles.footerTabText, activeTab === 'Home' && styles.activeText]}>
          Home
        </Text>
      </TouchableOpacity>

      {/* Add Customer Tab */}
      <TouchableOpacity
        style={[
          styles.footerTab,
          activeTab === 'AddCustomer' && styles.activeTab,
        ]}
        onPress={() => navigation.navigate('AddCustomer')}
      >
        <Text style={[styles.footerTabText, activeTab === 'AddCustomer' && styles.activeText]}>
          Add Customer
        </Text>
      </TouchableOpacity>

      {/* Add Staff Tab */}
      <TouchableOpacity
        style={[
          styles.footerTab,
          activeTab === 'AddStaff' && styles.activeTab,
        ]}
        onPress={() => navigation.navigate('addStaff')}
      >
        <Text style={[styles.footerTabText, activeTab === 'AddStaff' && styles.activeText]}>
          Add Staff
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  footerTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  footerTabText: {
    fontSize: 16,
    color: '#007bff',
  },
  activeTab: {
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  activeText: {
    color: '#fff',
  },
});
