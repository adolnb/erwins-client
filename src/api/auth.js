import axios from 'axios';


const API = process.env.REACT_APP_API_URL;


export const loginRequest = async (user) => await axios.post(`${API}api/login`, user, {
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});
export const registerRequest = (user) => axios.post(`${API}api/register`, user);
export const verifyTokenRequest = async () => {
    return axios.post(`${API}api/verify-token`, {}, {
        withCredentials: true
    });
};
export const logoutRequest = (user) => axios.post(`${API}api/logout`, user);