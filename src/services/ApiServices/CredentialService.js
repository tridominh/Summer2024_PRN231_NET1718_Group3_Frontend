import axios from "axios";
import getEndpoint from "../getEndpoint";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function GetAllCredentials() {
    const response = await axios.get(`${getEndpoint()}/api/Credential/GetAll`, ngrokSkipWarning);
    return response.data;
}

export async function GetCredentialById(id) {
    const response = await axios.get(`${getEndpoint()}/api/Credential/Get?id=${id}`, ngrokSkipWarning);
    return response.data;
}

export async function AddCredential(credentialDTO) {
    const response = await axios.post(`${getEndpoint()}/api/Credential/Add`, credentialDTO, ngrokSkipWarning);
    return response.data;
}

export async function UpdateCredential(credentialDTO) {
    const response = await axios.put(`${getEndpoint()}/api/Credential/Update`, credentialDTO, ngrokSkipWarning);
    return response.data;
}

export async function DeleteCredential(id) {
    const response = await axios.delete(`${getEndpoint()}/api/Credential/Delete`, { data: id, ...ngrokSkipWarning });
    return response.data;
}

export async function UploadCredentialImage(formData) {
    const response = await axios.post(`${getEndpoint()}/api/Credential/UploadImage`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            "bypass-tunnel-reminder": "true"
        }
    });
    return response.data;
}
