import axios from "axios";
import getEndpoint from "../getEndpoint";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function GetAllPost() {
  const response = await axios.get(
    `${getEndpoint()}/api/Post/GetAll`,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function GetPostById(id) {
  const response = await axios.get(
      `${getEndpoint()}/api/Post/Get?id=${id}`,
      ngrokSkipWarning
  );
  return response.data;
}

export async function AddPost(postDTO) {
  const response = await axios.post(
      `${getEndpoint()}/api/Post/Add`,
      postDTO,
      ngrokSkipWarning
  );
  return response.data;
}

export async function UpdatePost(postDTO) {
  const response = await axios.put(
      `${getEndpoint()}/api/Post/Update`,
      postDTO,
      { headers: { "bypass-tunnel-reminder": "true", "Content-Type":"multipart/form-data" } }
  );
  return response.data;
}

export async function DeletePost(id) {
  const response = await axios.delete(
      `${getEndpoint()}/api/Post/Delete?id=${id}`, ngrokSkipWarning
  );
  return response.data;
}