import axios from "axios";
import getEndpoint from "../getEndpoint";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function GetAllSchedulesOfUser(id) {
  const response = await axios.get(
    `${getEndpoint()}/api/Schedule/GetAllByUserId?userId=${id}`,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function CreateSchedule(createScheduleDto) {
  const response = await axios.post(
    `${getEndpoint()}/api/Schedule/Add`,
    createScheduleDto,
    ngrokSkipWarning,
  );
  return response.data;
}
