import React, { useReducer, useEffect } from "react";
//import axios from 'axios'
import axios from "axios";


import reducer, {
    SET_DAY,
    SET_APPLICATION_DATA,
    SET_INTERVIEW
} from "reducers/application";


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
        Promise.all([daysData, appointmentsData, interviewersData])
            .then(all => {
                dispatch({
                    type: SET_APPLICATION_DATA,
                    days: all[0].data,
                    appointments: all[1].data,
                    interviewers: all[2].data
                })
            })
    }, []);

    // updating the database with data from the interview & decrementing the spots count
    const bookInterview = (id, interview) => {
        const appointment = {
            ...state.appointments[id],
            interview
        };
        return axios.put(`/api/appointments/${id}`, appointment)
            .then(() => {
                dispatch({ type: SET_INTERVIEW, id, interview })

            })
    }

    // delete appointment slot from database & incrementing the spots count
    const cancelInterview = (id) => {
        return axios.delete(`/api/appointments/${id}`)
            .then(() => {
                dispatch({ type: SET_INTERVIEW, id, interview: null })
            })
    }
    return {
        state,
        setDay,
        bookInterview,
        cancelInterview
    }
};