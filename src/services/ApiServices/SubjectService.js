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

export async function GetSubjectById(id) {
  const response = await axios.get(
    `${getEndpoint()}/api/Subject/Get?id=${id}`,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function AddSubject(subjectDTO) {
  const response = await axios.post(
    `${getEndpoint()}/api/Subject/Add`,
    subjectDTO,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function UpdateSubject(subjectDTO) {
  const response = await axios.put(
    `${getEndpoint()}/api/Subject/Update`,
    subjectDTO,
    ngrokSkipWarning,
  );
  return response.data;
}
