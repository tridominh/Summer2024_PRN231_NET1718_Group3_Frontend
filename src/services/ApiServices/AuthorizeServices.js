import axios from "axios";
import getEndpoint from "../getEndpoint";

export async function LoginService(credentials) {
    const response = await axios.post(`${getEndpoint()}/api/Authentication/Login`, credentials);
    return response.data;
}

export async function RegisterStudentService(credentials) {
    const response = await axios.post(`${getEndpoint()}/api/Authentication/RegisterStudent`, credentials);
    return response.data;
}

export async function RegisterTutorService(credentials) {
    const response = await axios.post(`${getEndpoint()}/api/Authentication/RegisterTutor`, credentials);
    return response.data;
}
