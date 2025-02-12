import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert, 
  Modal 
} from "react-native";
import { StaffService } from "../apiService";

export default function StaffList({ route, navigation }) {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const userId = route?.params; // Get user ID passed from AddStaff

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await StaffService.getStaffByUserId(userId);
        if (response?.status === 200) {
          setStaffList(response.data);
        } else {
          Alert.alert("Error", "Failed to fetch staff list.");
        }
      } catch (error) {
       // Alert.alert("Error", "Something went wrong while fetching staff.");
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [userId]);

const deleteStaff = async (id) => {
  try {
    const response = await StaffService.deleteStaff(id);
    if (response?.status === 200 || response?.status === 204) {
      // Update staffList by removing the deleted staff
      //setStaffList((prevList) => prevList.filter((staff) => staff.id !== id));

      const updatedStaff = staffList.filter(staff => staff.staffID !== selectedStaff.staffID);
      setStaffList(updatedStaff);

      Alert.alert("Success", "Staff deleted successfully.");
    } else {
      Alert.alert("Error", "Failed to delete staff.");
    }
  } catch (error) {
    
    Alert.alert("Error", "Something went wrong while deleting staff.");
  } finally {
    setModalVisible(false);
  }
};


  const handleLongPress = (staff) => {
    setSelectedStaff(staff);
    console.log(selectedStaff)
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onLongPress={() => handleLongPress(item)}
      style={styles.listItem}
    >
      <View style={styles.staffInfo}>
        <Text style={styles.staffName}>{item.name}</Text>
        <Text style={styles.staffMobile}>{item.mobile}</Text>
      </View>
    </TouchableOpacity>
  );
  
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading Staff List...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>Staff List</Text> */}
      {staffList.length > 0 ? (
        <FlatList
          data={staffList}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      ) : (
        <Text style={styles.noDataText}>No staff found.</Text>
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("addStaff")}
      >
        <Text style={styles.addButtonText}>Add Staff</Text>
      </TouchableOpacity>

      {/* Confirmation Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to delete {selectedStaff?.name}?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => deleteStaff(selectedStaff?.staffID)}
              >
                <Text style={styles.modalButtonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,

  },
  listItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  staffInfo: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center", // Align text vertically in the center
    width: "100%",
  },
  staffName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    width: "70%",
  },
  staffMobile: {
    fontSize: 16,
    color: "#666",
    width: "30%",
  },
  noDataText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    backgroundColor: "#d9534f",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#007bff",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

