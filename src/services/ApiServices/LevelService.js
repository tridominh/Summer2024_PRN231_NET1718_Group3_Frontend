import axios from "axios";
import getEndpoint from "../getEndpoint";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function GetAllLevels() {
  const response = await axios.get(
    `${getEndpoint()}/api/Level/GetAll`,
    ngrokSkipWarning,
  );

  return response.data;
}
