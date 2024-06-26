import axios from "axios";
import getEndpoint from "../getEndpoint";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function GetAllFeedbacks() {
  const response = await axios.get(
    `${getEndpoint()}/api/Feedback/GetAll`,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function GetFeedback(id) {
  const response = await axios.get(
      `${getEndpoint()}/api/Feedback/Get?id=${id}`,
      ngrokSkipWarning
  );
  return response.data;
}

export async function AddFeedback(feedbackDTO) {
  const response = await axios.post(
      `${getEndpoint()}/api/Feedback/Add`,
      feedbackDTO,
      ngrokSkipWarning
  );
  return response.data;
}

export async function UpdateFeedback(feedbackDTO) {
  const response = await axios.put(
      `${getEndpoint()}/api/Feedback/Update`,
      feedbackDTO,
      { headers: { "bypass-tunnel-reminder": "true", "Content-Type":"application/json" } }
  );
  return response.data;
}

export async function DeleteFeedback(id) {
  const response = await axios.delete(
      `${getEndpoint()}/api/Feedback/Delete?id=${id}`, ngrokSkipWarning
  );
  return response.data;
}
