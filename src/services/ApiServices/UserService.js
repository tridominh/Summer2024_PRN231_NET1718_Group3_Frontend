import axios from "axios";
import getEndpoint from "../getEndpoint";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };


export async function GetAllUsers() {
  const response = await axios.get(
    `${getEndpoint()}/api/User/GetAll`,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function GetUserInfo(id) {
  const response = await axios.get(
    `${getEndpoint()}/api/User/Get?id=${id}`,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function UpdateUserInfo(id) {
  const response = await axios.put(
    `${getEndpoint()}/api/User/Update`,
    id,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function SendStatusMail(id) {
  const response = await axios.post(
    `${getEndpoint()}/api/Authentication/SendStatusMail`,
    id,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function SendStatusMailApproveTeaching(data) {
  try {
      const response = await axios.post(
          `${getEndpoint()}/api/Authentication/SendStatusMailApproveTeaching`,
          data,
          {
              headers: {
                  'Content-Type': 'application/json',
                  ...ngrokSkipWarning
              }
          }
      );
      return response.data;
  } catch (error) {
      console.error("Error sending approval email:", error);
      throw error; // Ensure errors are propagated
  }
}

export async function SendStatusMailCredentials(payload) {
  const response = await axios.post(
    `${getEndpoint()}/api/Authentication/SendStatusMailCredentials`,
    payload,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function SendStatusMailTransfermoneyForTeaching(payload) {
  const response = await axios.post(
    `${getEndpoint()}/api/Authentication/SendStatusMailTransfermoneyForTeaching`,
    payload,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function SendStatusMailPost(payload) {
  const response = await axios.post(
    `${getEndpoint()}/api/Authentication/SendStatusMailPost`,
    payload,
    ngrokSkipWarning,
  );
  return response.data;
}


export async function GetUserInfoById(id) {
  const response = await axios.get(
    `${getEndpoint()}/api/UserInfo/GetAllWithUserId?userId=${id}`,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function UploadAvatar(formData) {
  const response = await axios.post(
    `${getEndpoint()}/api/User/UploadAvatar`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        "bypass-tunnel-reminder": "true",
      },
    },
  );
  return response.data;
}

export async function DeleteUser(id) {
  try {
    const response = await axios.delete(`${getEndpoint()}/api/User/Delete?id=${id}`, ngrokSkipWarning);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}