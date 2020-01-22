import React from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";

import useVisualMode from "hooks/useVisualMode";
//import { getAppointmentsForDay, getInterview, getInterviewsForDay } from "helpers/selectors";
import Form from "components/Appointment/Form";


//importing the other props

import Status from "components/Appointment/Status";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";


export default function Appointment(props) {
    const EMPTY = "EMPTY";
    const SHOW = "SHOW";
    const CREATE = "CREATE";
    const SAVING = "SAVING";

    function save(name, interviewer) {
        const interview = {
            student: name,
            interviewer
        };
        transition(SAVING);
        props.bookInterview(props.id, interview).then(
            () => transition(SHOW)
        )
    };

    const { mode, transition, back } = useVisualMode(
        props.interview ? SHOW : EMPTY
    );

    return (
        <article className="appointment">
            <Header time={props.time} />
            {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
            {mode === CREATE && (
                <Form
                    interviewers={[props.interviewers]}
                    onCancel={() => back()}
                    onSave={save}
                />
            )}
            {mode === SHOW && (
                <Show
                    student={props.interview && props.interview.student}
                    interviewer={props.interview && props.interview.interviewer}
                />
            )}

            {mode === SAVING && (
                <Status
                    message={SAVING}
                />
            )}
        </article>

    )
}