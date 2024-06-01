import axios from "axios";
import getEndpoint from "../getEndpoint";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function GetAllSubjects() {
  const response = await axios.get(
    `${getEndpoint()}/api/Subject/GetAll`,
    ngrokSkipWarning,
  );

  return response.data;
}
