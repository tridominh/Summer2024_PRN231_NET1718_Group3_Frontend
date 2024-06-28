import axios from "axios";
import getEndpoint from "../getEndpoint";
import { timeStringToMinutes } from "../utils";

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

export function isOverlapping(existingSchedules, newSchedule) {
  if (!existingSchedules) {
    return false;
  }

  const newStartTime = timeStringToMinutes(newSchedule.startTime + ":00");
  const newEndTime =
    newStartTime + timeStringToMinutes(newSchedule.duration + ":00");

  for (const schedule of existingSchedules) {
    const startTime = timeStringToMinutes(schedule.startTime + ":00");
    const endTime = startTime + timeStringToMinutes(schedule.duration + ":00");

    if (
      newSchedule.dayOfWeek === schedule.dayOfWeek &&
      newStartTime <= endTime &&
      newEndTime >= startTime
    ) {
      return true;
    }
  }
  return false;
}
