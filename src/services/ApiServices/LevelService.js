import axios from "axios";
import getEndpoint from "../getEndpoint";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function GetAllLevels() {
  const response = await axios.get(
    `${getEndpoint()}/api/Level/GetAll`,
    ngrokSkipWarning,
  );

  if (!response.ok) {
    throw new Error("Error fetching subjects");
  }

  return response.data;
}

export async function GetLevelById(id) {
  const response = await axios.get(
    `${getEndpoint()}/api/Level/Get?id=${id}`,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function AddLevel(levelDTO) {
  const response = await axios.post(
    `${getEndpoint()}/api/Level/Add`,
    levelDTO,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function UpdateLevel(levelDTO) {
  const response = await axios.put(
    `${getEndpoint()}/api/Level/Update`,
    levelDTO,
    ngrokSkipWarning,
  );
  return response.data;
}
