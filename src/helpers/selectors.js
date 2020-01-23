export function getAppointmentsForDay(state, day) {
  if (!state.days) {
    return [];
  }
  if (state.days.length < 1) {
    return [];
  }
  //console.log(state.days);
  let appointmentsForDay = state.days.find(e => e.name === day);
  if (!appointmentsForDay) {
    return [];
  }
  //console.log(`appointmentsForDay ${appointmentsForDay}`);

  //console.log(`DAY OF THE WEEK: ${appointmentsForDay.name} ---- given appointments: ${appointmentsForDay.appointments}`);
  //let apptMap = appointmentsForDay.appointments.map(apptID => apptID = state.appointments[apptID]);

  //console.log(`APPT MAP_____ ${apptMap}`);
  return (!appointmentsForDay || appointmentsForDay.appointments.length < 1) ? [] : appointmentsForDay.appointments.map(apptID => state.appointments[apptID]);
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  } else {
    let result = {
      "student": interview.student,
      "interviewer": state.interviewers[interview.interviewer]
    }
 //   console.log("RESULT", result)
    return result;
  }
}


export function getInterviewersForDay(state, day) {
  if (!state.days) {
    return [];
  }

  if (state.days.length < 1) {
    return [];
  }

  let interviewersForDay = state.days.find(e => e.name === day);

    if (!interviewersForDay) {
      return [];
    }

  let actualInterviewers = interviewersForDay.interviewers;

  return (!interviewersForDay || interviewersForDay.interviewers.length < 1) ? [] : actualInterviewers.map(intID => state.interviewers[intID]);

}; 