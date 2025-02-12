import axios from "axios";

const BASE_URL = "http://10.0.2.2:5006/api"; // Your API base URL

// Create an Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// User Service
export const UserService = {
  getAllUsers: async () => {
    return api.get("/Users");
  },
  getUserById: async (id) => {
    return api.get(`/Users/${id}`);
  },
  createUser: async (user) => {
    return api.post("/Users", user);
  },
  updateUser: async (id, user) => {
    return api.put(`/Users/${id}`, user);
  },
  deleteUser: async (id) => {
    return api.delete(`/Users/${id}`);
  },
};

// Staff Service
export const StaffService = {
  getAllStaff: async () => {
    return api.get("/Staffs");
  },
  getStaffById: async (id) => {
    return api.get(`/Staffs?userID=${id}`);
  },
  getStaffByUserId: async (id) => {
    return api.get(`/Staffs/User/${id}`);
  },
  createStaff: async (staff) => {
    return api.post("/Staffs", staff);
  },
  editStaff: async (id, staff) => {
    return api.put(`/Staffs/${id}`, staff);
  },
  deleteStaff: async (id) => {
    return api.delete(`/Staffs/${id}`);
  },
};

// Customer Service
export const CustomerService = {
  getAllCustomers: async () => {
    return api.get("/Customers");
  },
  getAllCustomersById: async (id) => {
    return api.get(`/Customers?userID=${id}`);
  },
  getAllCustomersByUserId: async (id) => {
    return api.get(`/Customers/User/${id}`);
  },
  createCustomer: async (customer) => {
    return api.post("/Customers", customer);
  },
  editCustomer: async (id, customer) => {
    return api.put(`/Customers/${id}`, customer);
  },
  deleteCustomer: async (id) => {
    return api.delete(`/Customers/${id}`);
  },
};
