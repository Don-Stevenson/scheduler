import React from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";

import useVisualMode from "hooks/useVisualMode";
import { getAppointmentsForDay, getInterview, getInterviewsForDay } from "helpers/selectors";
import Form from "components/Appointment/Form";


//importing the other props
import Confirm from "components/Appointment/Confirm";
import Status from "components/Appointment/Status";
import Error from "components/Appointment/Error";
import Create from "components/Appointment/Form";
import Edit from "components/Appointment/Form";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";


export default function Appointment(props) {
    const EMPTY = "EMPTY";
    const SHOW = "SHOW";
    const CREATE = "CREATE";
    const SAVING = "SAVING";
    const DELETING = "DELETING";
    const CONFIRM = "CONFIRM";

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
    function deleteAppt() {
        transition(CONFIRM);
    }

    function confirmDeleteAppt() {
        transition(DELETING, true);
        props.cancelInterview(props.id).then(() => transition(EMPTY))
    }




    const { mode, transition, back } = useVisualMode(
        props.interview ? SHOW : EMPTY
    );

    return (
        <article className="appointment">
            <Header time={props.time} />
            {mode === EMPTY &&
                <Empty onAdd={() => transition(CREATE)}
                />}
            {mode === CREATE && (
                <Form
                    interviewers={props.interviewers}
                    onCancel={() => back()}
                    onSave={save}
                    onDelete={deleteAppt}
                />
            )}
            {mode === SHOW && (
                <Show
                    student={props.interview && props.interview.student}
                    interviewer={props.interview && props.interview.interviewer}
                    onDelete={deleteAppt}
                />
            )}

            {mode === SAVING && (
                <Status
                    message={SAVING}
                />
            )}

            {mode === CONFIRM && (
                <Confirm
                    message={"Are you sure you would like to delete?"}
                    onConfirm={confirmDeleteAppt}
                    onCancel={() => back()}
                />
            )}


            {mode === DELETING && (
                <Status
                    message={DELETING}
                />
            )}


        </article>

    )
}