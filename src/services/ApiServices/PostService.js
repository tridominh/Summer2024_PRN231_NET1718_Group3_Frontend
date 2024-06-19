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
