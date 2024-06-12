import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid' // a plugin!
import parseJwt from '../../services/parseJwt';
import listPlugin from '@fullcalendar/list';
import { GetAllSchedulesOfUser } from '../../services/ApiServices/ScheduleService';
import { useEffect, useState } from 'react';
import moment from 'moment/moment';

export function SchedulePage({ token }) {
  
  const id = token ? parseJwt(token).nameid : "";
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState("");
  const [events, setEvents] = useState([]); 

  const fetchSchedules = async (e) => {
    let data = null;
    try {
      data = await GetAllSchedulesOfUser(id);
      setSchedules(data);
      let eventList = [];
      for(let d of data){
          //if(!d) continue;
          //console.log(d);
          const e = generateEvents(
              formatDate(d.startTime),
              formatDate(d.endTime),
              d.booking.subjectLevel.description,
              splitDaysOfWeek(d.dayOfWeek)
          );
          eventList.push(...e);
          //console.log(formatDate(d.startTime), formatDate(d.endTime));
          //console.log(splitDaysOfWeek(d.dayOfWeek));
          //console.log(e);
      }
      //console.log(eventList);
      setEvents(eventList);
    }
    catch (err) {
      if (err.response.data.message) {
        // If the error response contains a message, set it as the error message
        setError(err.response.data.message);
      }
      else if (err.response.data[0].description) {
        setError(err.response.data[0].description);
      }
      else if (err.response.data) {
        setError(err.response.data);
      }
      else {
        // If the error is something else, set a generic error message
        setError('An error occurred. Please try again later.');
      }
      return;
    }
  };

    const generateEvents = (startDate, endDate, subjectName, daysOfWeek) => {
        const start = moment(startDate);
        const end = moment(endDate);
        const events = [];
        console.log(startDate);

        for (let m = start; m.isSameOrBefore(end); m.add(1, 'days')) {
            if (daysOfWeek.includes(m.day())) {
                events.push({
                    title: subjectName,
                    start: m.format('YYYY-MM-DD'),
                    allDay: false
                });
                events.push({
                    title: subjectName,
                    start: m.format('YYYY-MM-DD'),
                    allDay: true
                });
            }
        }

        return events;
    };

    const formatDate = (timestamp) => {
        return moment(timestamp).format('YYYY-MM-DD');
    };

    const splitDaysOfWeek = (daysOfWeek) => {
        if (!daysOfWeek) {
            return [];
        }
        return daysOfWeek.split(', ').map(Number);
    };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <div className='w-full'>
        {/*JSON.stringify(schedules)*/}
        <FullCalendar
          plugins={[ dayGridPlugin, timeGridPlugin ]}
          initialView="dayGridMonth"
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      }}
          views={{ 
              dayGridMonth: { buttonText: 'month' },
              timeGridWeek: { buttonText: 'week' }, 
              timeGridDay: { buttonText: 'day' }
          }}
          events={events}
        />
    </div>
  )
}


