import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid"; // a plugin!
import parseJwt from "../../services/parseJwt";
import listPlugin from "@fullcalendar/list";
import { GetAllSchedulesOfUser } from "../../services/ApiServices/ScheduleService";
import { useEffect, useState } from "react";
import moment from "moment/moment";

export function SchedulePage({ token }) {
  const id = token ? parseJwt(token).nameid : "";
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState("");
  const [events, setEvents] = useState([]);

  const days = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const fetchSchedules = async (e) => {
    let data = null;
    try {
      data = await GetAllSchedulesOfUser(id);
      data = data.filter(
        (x) =>
          x.booking.status.toUpperCase() === "PAID" ||
          x.booking.status.toUpperCase() === "TRANSFERRED",
      );
      console.log(data);
      setSchedules(data);

      let eventList = [];
      let existingDates = [];
      for (let d of data) {
        //if(!d) continue;
        //console.log(d);
        const tutor = d.booking.bookingUsers?.filter(
          (x) => x.role.toUpperCase() === "TUTOR",
        )[0];
        const slotNum = d.booking.numOfSlots;

        const e = generateEvents(
          moment(),
          //formatDate(d.endTime),
          slotNum,
          d.startTime,
          d.duration,
          d.booking.subject.name +
            " - " +
            d.booking.level.levelName +
            (tutor != null ? " with " + tutor?.user.userName : ""),
          days[d.dayOfWeek],
          existingDates,
        );
        eventList.push(...e);
        //console.log(formatDate(d.startTime), formatDate(d.endTime));
        //console.log(splitDaysOfWeek(d.dayOfWeek));
        //console.log(e);
      }
      setEvents(eventList);
    } catch (err) {
      console.log(err);
      if (err.response.data.message) {
        // If the error response contains a message, set it as the error message
        setError(err.response.data.message);
      } else if (err.response.data[0].description) {
        setError(err.response.data[0].description);
      } else if (err.response.data) {
        setError(err.response.data);
      } else {
        // If the error is something else, set a generic error message
        setError("An error occurred. Please try again later.");
      }
      return;
    }
  };

  const generateEvents = (
    startDate,
    numOfSlot,
    startTime,
    duration,
    subjectName,
    dayOfWeek,
    existingDates,
  ) => {
    const start = startDate;
    //const end = moment(endDate);
    const events = [];
    let slotsAdded = 0;
    //console.log(numOfSlot);
    //console.log(dayOfWeek);

    for (let m = start; slotsAdded < numOfSlot; m.add(1, "days")) {
      if (dayOfWeek === m.day()) {
        const startDateTime = moment(m.format("YYYY-MM-DD") + "T" + startTime);
        const endDateTime = startDateTime
          .clone()
          .add(moment.duration(duration));
        //console.log(endDateTime.format('YYYY-MM-DDTHH:mm:ss'))
        events.push({
          title: subjectName,
          start: m.format("YYYY-MM-DD") + "T" + startTime,
          end: endDateTime.format("YYYY-MM-DDTHH:mm:ss"),
          allDay: false,
        });
        slotsAdded++;
        // if(!existingDates.includes(m.format('YYYY-MM-DD'))){
        //     events.push({
        //         title: subjectName,
        //         start: m.format('YYYY-MM-DD'),
        //         allDay: true
        //     });
        //     existingDates.push(m.format('YYYY-MM-DD'));
        // }
      }
    }

    //console.log(existingDates);

    return events;
  };

  // const formatDate = (timestamp) => {
  //   return moment(timestamp).format("YYYY-MM-DD");
  // };
  //
  // const splitDaysOfWeek = (daysOfWeek) => {
  //   if (!daysOfWeek) {
  //     return [];
  //   }
  //   return daysOfWeek.split(", ").map(Number);
  // };
  //
  // const filteredEvents = (events) => {
  //   return events.filter((event) => {
  //     var eventDate = moment(event.start); // Assumes `event.start` is in a parsable date format
  //     var currentMonthStart = moment().startOf("month");
  //     var currentMonthEnd = moment().endOf("month");
  //
  //     return eventDate.isBetween(
  //       currentMonthStart,
  //       currentMonthEnd,
  //       null,
  //       "[]",
  //     );
  //   });
  // };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <div className="w-full">
      {/*JSON.stringify(schedules)*/}
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        views={{
          dayGridMonth: { buttonText: "month" },
          timeGridWeek: { buttonText: "week" },
          timeGridDay: { buttonText: "day" },
          listWeek: { buttonText: "list" },
        }}
        events={events}
        dayMaxEvents={3}
        eventDisplay="auto"
        eventContent={(arg) => {
          // Create the event time string
          // let eventTimeString = '';
          // if (arg.event.start && arg.event.end) {
          //     let startTime = moment(arg.event.start).format("HH:mm");
          //     let endTime = moment(arg.event.end).format("HH:mm");
          //     eventTimeString = startTime - endTime+"";
          // } else if (arg.event.start) {
          //     let startTime = moment(arg.event.start).format("HH:mm");
          //     eventTimeString = startTime+"";
          // }
          let startTime = moment(arg.event.start).format("HH:mm");
          let endTime = moment(arg.event.end).format("HH:mm");

          // Combine the title and time string
          let titleWithTime = document.createElement("div");
          titleWithTime.innerHTML = `<span style="color: blue; font-weight: bold">${startTime} - ${endTime}</span><b style="margin-left: 5px">${arg.event.title}</b>`;

          // Create the event content
          let arrayOfDomNodes = [titleWithTime];
          return { domNodes: arrayOfDomNodes };
        }}
      />
    </div>
  );
}
