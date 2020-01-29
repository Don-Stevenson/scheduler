import React from "react";

import { render, cleanup, waitForElement, fireEvent, getByText, getAllByTestId, getByAltText, getByPlaceholderText, queryByText, queryByAltText, getByTestId } from "@testing-library/react";
import axios from "axios";
import Application from "components/Application";

import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "reducers/application";

afterEach(cleanup);


describe("Application", () => {

  it("changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"));

    fireEvent.click(getByText("Tuesday"));

    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });


  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));


    expect(getByText(appointment, "SAVING")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
    debug();
  });


  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Delete"));

    // 4. Check that the confirmation message is shown.
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(queryByText(appointment, "Confirm"));

    // 6. Check that the element with the text "Deleting" is displayed.
    debug()
    expect(getByText(appointment, "DELETING")).toBeInTheDocument();

    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"));

    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();


  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Edit" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(queryByAltText(appointment, "Edit"));

    // 4. Change the name
    fireEvent.change(getByTestId(appointment, "student-name-input"), {
      target: { value: "Bob" }
    });

    //5. Click on "Save" button
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "SAVING")).toBeInTheDocument();

    await waitForElement(() => getByText(container, "Bob"));
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    waitForElement(() => expect(getByText(day, "1 spot remaining")).toBeInTheDocument());
  });

  it('shows the save error when failing to save an appointment', async () => {
    // Setting: Fake an error with axios (once)
    axios.put.mockRejectedValueOnce();

    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    // 3. Get the first spot
    const appointments = getAllByTestId(container, 'appointment');
    const appointment = appointments[0];

    // 4. Add an appointment
    fireEvent.click(getByAltText(appointment, 'Add'));

    // 5. Enters the name for an appointment
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: 'Lydia Miller-Jones' }
    });
    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));

    // 6. Click the "Save" button on the confirmation.
    fireEvent.click(getByText(appointment, 'Save'));

    // 7. Check that the element with the text "Saving" is displayed.

    expect(getByText(appointment, 'SAVING')).toBeInTheDocument();

    // 8. An error should be rendered.
    await waitForElement(() =>
      getByText(appointment, 'Could not save message. Please try again.')
    );
  });

  it('shows the delete error when failing to delete an existing appointment', async () => {
    // Setting: Fake an error with axios (once)
    axios.delete.mockRejectedValueOnce();

    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, 'appointment').find(
      appointment => queryByText(appointment, 'Archie Cohen')
    );
    fireEvent.click(queryByAltText(appointment, 'Delete'));

    // 4. Check that the confirmation message is shown.
    expect(
      getByText(appointment, 'Are you sure you would like to delete?')
    ).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, 'Confirm'));

    // 6. Check that the element with the text "Deleting" is displayed.

    expect(getByText(appointment, 'DELETING')).toBeInTheDocument();

    // 7. An error should be rendered.
    await waitForElement(() =>
      getByText(appointment, 'Could not delete message. Please try again.')
    );
  });
});


