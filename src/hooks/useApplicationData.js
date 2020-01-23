import React, { useState, useEffect } from "react";
import axios from 'axios'

export default function useApplicationData() {
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

    // updating the database with data from the interview
    const bookInterview = (id, interview) => {
        const appointment = {
            ...state.appointments[id],
            interview: { ...interview }
        };
        const appointments = {
            ...state.appointments,
            [id]: appointment
        };
        return axios.put(`/api/appointments/${id}`, appointment).then(() => setState(prev => ({ ...state, appointments })))
    }

    // delete appointment slot from database
    const cancelInterview = (id) => {
        const appointment = {
            ...state.appointments[id],
            interview: null
        };
        const appointments = {
            ...state.appointments,
            [id]: appointment
        };
        return axios.delete(`/api/appointments/${id}`, appointment).then(() => setState(prev => ({ ...prev, appointments })))
    }
    return {
        state,
        setDay,
        bookInterview,
        cancelInterview
    }
};