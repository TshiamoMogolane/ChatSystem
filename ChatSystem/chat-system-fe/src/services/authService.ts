import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';


const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});


//signUp userData 
export interface UserData {
  username: string;
  email: string;
  password: string;
  gender: string;
}

// this is login data 
export interface Login {
  email: string;
  password: string;

}

// verity request for opt 
export interface VerifyRequest{
  email:string;
  otp:string;
}

// this is service is for all auththentication related communication with the backend
export const authService = {

  // this is for communication with the backend for signup
  signup: (userData: UserData) => apiClient.post('/auth/signup', userData),

  // this is for the communication with the backend for login
  login: (login: Login) => apiClient.post('/auth/login', login),

  //this is for the communication with the backend for opt verification
  verifyOtp: (verifyRequest: VerifyRequest) => apiClient.post('/auth/verify', verifyRequest),

  //this is for the communication with the backend for email resend 
  resendOtp: ({ email }: { email: string }) =>
    axios.post('/auth/resend-otp', { email }),

};



