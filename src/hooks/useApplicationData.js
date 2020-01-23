import React, { useReducer, useEffect } from "react";
import axios from 'axios'

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

function reducer(state, action) {
    switch (action.type) {
        case SET_DAY:
            return { ...state, day: action.day };
        case SET_APPLICATION_DATA:
            return { ...state, days: action.days, appointments: action.appointments, interviewers: action.interviewers };
        case SET_INTERVIEW:
            const { id, interview } = action;

            return {
                ...state,
                appointments: {
                    ...state.appointments,
                    [id]: {
                        ...state.appointments[action.id],
                        interview: action.interview ? { ...interview } : null
                    }
                }
            }

        default:
            throw new Error(
                `Tried to reduce with unsupported action type: ${action.type}`
            );
    }
}

export default function useApplicationData() {
    const [state, dispatch] = useReducer(reducer, {
        day: "Monday",
        days: [],
        appointments: {},
        interviewers: {}
    });

    const setDay = day => dispatch({ type: SET_DAY, day });

    // getting the data from the api
    useEffect(() => {
        const daysData = axios.get("/api/days");
        const appointmentsData = axios.get("/api/appointments");
        const interviewersData = axios.get("/api/interviewers");
        Promise.all([daysData, appointmentsData, interviewersData]).then(all => {
            dispatch({
                type: SET_APPLICATION_DATA,
                days: all[0].data,
                appointments: all[1].data,
                interviewers: all[2].data
            })
        })
    }, []);

    // updating the database with data from the interview
    const bookInterview = (id, interview) => {
        const appointment = {
            ...state.appointments[id],
            interview
        };
        return axios.put(`/api/appointments/${id}`, appointment)
            .then(() => dispatch({ type: SET_INTERVIEW, id, interview }))
    }

    // delete appointment slot from database
    const cancelInterview = (id) => {
        const appointment = {
            ...state.appointments[id],
            interview: null
        };

        return axios.delete(`/api/appointments/${id}`, appointment)
            .then(() => dispatch({ type: SET_INTERVIEW, id, interview: null }))
    }
    return {
        state,
        setDay,
        bookInterview,
        cancelInterview
    }
};