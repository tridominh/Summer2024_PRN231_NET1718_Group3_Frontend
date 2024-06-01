import axios from "axios";
import getEndpoint from "../getEndpoint";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

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
