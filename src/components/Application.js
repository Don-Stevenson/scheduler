import React, { useState, useEffect } from "react";
import DayList from "./DayList"
import "components/Application.scss";
import Appointment from "components/Appointment";
import { getAppointmentsForDay, getInterview } from "../helpers/selectors";
import axios from 'axios'

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });
  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then(([days, appointments, interviewers]) => {
      setState(prev => {
        return ({
          ...prev, days: days.data, appointments: appointments.data, interviewers: interviewers.data
        })
      })
    })
  }, []);
  console.log("STATE INTERVIEWERS___", state.interviewers)

  const appointmentObj = getAppointmentsForDay(state, state.day);
  const appointmentComponents = appointmentObj.map(appointment => {
    const interview = getInterview(state, appointment.interview);
    return (
      <Appointment key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
      />
    );
  });

  return (

    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointmentComponents}
        <Appointment key="last" time="5pm" />
      </section>
    </main>

  );
}
