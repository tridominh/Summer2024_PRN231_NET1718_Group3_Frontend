import axios from "axios";
import getEndpoint from "../getEndpoint";

export async function LoginService(credentials) {
    const response = await axios.post(`${getEndpoint()}/api/Authentication/Login`, credentials);
    return response.data;
}

export async function RequestOtpService(credentials) {
    const response = await axios.post(`${getEndpoint()}/api/Authentication/request-otp`, credentials, {
      withCredentials: true
    });
    return response.data;
}

export async function VerifyOtpService(credentials) {
    const response = await axios.post(`${getEndpoint()}/api/Authentication/verify-otp`, credentials,{
        withCredentials: true
    });
    return response.data;
}

export async function RegisterStudentService(credentials) {
    const response = await axios.post(`${getEndpoint()}/api/Authentication/RegisterStudent`, credentials ,{
        withCredentials: true
    });
    return response.data;
}

export async function RegisterTutorService(credentials) {
    const response = await axios.post(`${getEndpoint()}/api/Authentication/RegisterTutor`, credentials ,{
        withCredentials: true
    });
    return response.data;
}
