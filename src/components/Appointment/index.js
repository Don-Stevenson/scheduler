import React from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";

import useVisualMode from "hooks/useVisualMode";
import Form from "components/Appointment/Form";

//importing the other props
import Confirm from "components/Appointment/Confirm";
import Status from "components/Appointment/Status";
import Error from "components/Appointment/Error";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";
  const ERROR_INTERVIEWER = "ERROR_INTERVIEWER";

  const save = (name, interviewer) => {
    if (!interviewer) {
      transition(ERROR_INTERVIEWER, true);
    } else {
      const interview = {
        student: name,
        interviewer
      };
      transition(SAVING);
      props
        .bookInterview(props.id, interview)
        .then(() => transition(SHOW))
        .catch(error => {
          transition(ERROR_SAVE, true);
        });
    }
  };
  const deleteAppt = () => {
    transition(CONFIRM);
  };

  const confirmDeleteAppt = () => {
    transition(DELETING, true);
    props
      .cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(error => {
        transition(ERROR_DELETE, true);
      });
  };
  const edit = () => {
    transition(EDIT);
  };
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={save}
        />
      )}
      {mode === SHOW && (
        <Show
          student={props.interview && props.interview.student}
          interviewer={props.interview && props.interview.interviewer}
          onEdit={edit}
          onDelete={deleteAppt}
        />
      )}

      {mode === SAVING && <Status message={SAVING} />}

      {mode === CONFIRM && (
        <Confirm
          message={"Are you sure you would like to delete?"}
          onConfirm={confirmDeleteAppt}
          onCancel={() => back()}
        />
      )}

      {mode === DELETING && <Status message={DELETING} />}
      {mode === EDIT && (
        <Form
          name={props.interview.student}
          interviewer={
            props.interview.interviewer && props.interview.interviewer.id
          }
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={save}
        />
      )}
      {mode === ERROR_SAVE && (
        <Error
          message={"Could not save message. Please try again."}
          onClose={back}
        />
      )}
      {mode === ERROR_DELETE && (
        <Error
          message={"Could not delete message. Please try again."}
          onClose={back}
        />
      )}
      {mode === ERROR_INTERVIEWER && (
        <Error message={"Please select an interviewer!"} onClose={back} />
      )}
    </article>
  );
}
