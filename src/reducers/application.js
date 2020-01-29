export const SET_DAY = "SET_DAY";
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW = "SET_INTERVIEW";

export default function reducer(state, action) {
  if (action.type === SET_DAY) {
    return { ...state, day: action.day };
  } else if (action.type === SET_APPLICATION_DATA) {
    return {
      ...state,
      days: action.days,
      appointments: action.appointments,
      interviewers: action.interviewers
    };
  } else if (action.type === SET_INTERVIEW) {
    const { id, interview } = action;
    return {
      ...state,
      days: state.days.map(day => {
        // logic for updating the number of spots
        let changeInSpots = 0;
        if (day.name === state.day) {
          if (interview && state.appointments[id].interview) {
            changeInSpots = 0;
          } else if (interview) {
            changeInSpots = -1;
          } else changeInSpots = 1;
        }
        return {
          ...day,
          spots: day.spots + changeInSpots
        };
      }),
      appointments: {
        ...state.appointments,
        [id]: {
          ...state.appointments[action.id],
          interview: action.interview ? { ...interview } : null
        }
      }
    };
  } else {
    throw new Error(
      `Tried to reduce with unsupported action type: ${action.type}`
    );
  }
}
