import axios from 'axios';


const API = process.env.REACT_APP_API_URL;

export const usersRequest = async () => {
    return axios.get(`${API}api/users`, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
        }
    });
};

export const createUserRequest = async (user) => {
    return axios.post(`${API}api/users`, user, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

export const getUserRequest = async (userId) => {
    return axios.get(`${API}api/users/${userId}`, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

export const updateUserRequest = async (userId, userData) => {
    return axios.put(`${API}api/users/${userId}`, userData, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

export const deleteUserRequest = async (userId) => {
    return axios.delete(`${API}api/users/${userId}`, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        }
    });
};