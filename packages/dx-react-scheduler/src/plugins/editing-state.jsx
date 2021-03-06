import * as React from 'react';
import * as PropTypes from 'prop-types';
import {
  Action, Plugin, Getter, createStateHelper,
} from '@devexpress/dx-react-core';
import {
  addAppointment,
  changeAddedAppointment,
  cancelAddedAppointment,
  startEditAppointment,
  stopEditAppointment,
  changeAppointment,
  cancelChanges,
  changedAppointmentById,
} from '@devexpress/dx-scheduler-core';

export class EditingState extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      editingAppointmentId: props.editingAppointmentId || props.defaultEditingAppointmentId,
      addedAppointment: props.addedAppointment || props.defaultAddedAppointment,
      appointmentChanges: props.appointmentChanges || props.defaultAppointmentChanges,
    };

    const stateHelper = createStateHelper(
      this,
      {
        editingAppointmentId: () => {
          const { onEditingAppointmentIdChange } = this.props;
          return onEditingAppointmentIdChange;
        },
        addedAppointment: () => {
          const { onAddedAppointmentChange } = this.props;
          return onAddedAppointmentChange;
        },
        appointmentChanges: () => {
          const { onAppointmentChangesChange } = this.props;
          return onAppointmentChangesChange;
        },
      },
    );

    this.startEditAppointment = stateHelper.applyFieldReducer
      .bind(stateHelper, 'editingAppointmentId', startEditAppointment);
    this.stopEditAppointment = stateHelper.applyFieldReducer
      .bind(stateHelper, 'editingAppointmentId', stopEditAppointment);

    this.changeAppointment = stateHelper.applyFieldReducer
      .bind(stateHelper, 'appointmentChanges', changeAppointment);
    this.cancelChangedAppointment = stateHelper.applyFieldReducer
      .bind(stateHelper, 'appointmentChanges', cancelChanges);
    this.commitChangedAppointment = ({ appointmentId }) => {
      const { onCommitChanges } = this.props;
      const { appointmentChanges } = this.state;
      onCommitChanges({
        changed: changedAppointmentById(appointmentChanges, appointmentId),
      });
      this.cancelChangedAppointment();
      this.stopEditAppointment();
    };

    this.addAppointment = stateHelper.applyFieldReducer
      .bind(stateHelper, 'addedAppointment', addAppointment);
    this.changeAddedAppointment = stateHelper.applyFieldReducer
      .bind(stateHelper, 'addedAppointment', changeAddedAppointment);
    this.cancelAddedAppointment = stateHelper.applyFieldReducer
      .bind(stateHelper, 'addedAppointment', cancelAddedAppointment);
    this.commitAddedAppointment = () => {
      const { onCommitChanges } = this.props;
      const { addedAppointment: stateAddedAppointment } = this.state;
      onCommitChanges({
        added: this.makeAppointment(stateAddedAppointment),
      });
      this.cancelAddedAppointment();
    };

    this.commitDeletedAppointment = ({ deletedAppointmentId }) => {
      const { onCommitChanges } = this.props;
      onCommitChanges({ deleted: deletedAppointmentId });
    };

    this.makeAppointment = ({
      startDate, endDate, title, allDay,
    }) => {
      const {
        setAppointmentEndDate,
        setAppointmentStartDate,
        setAppointmentTitle,
        setAppointmentAllDay,
      } = this.props;

      const appointment = {};
      const withTitle = setAppointmentTitle(appointment, title);
      const withStartDate = setAppointmentStartDate(withTitle, startDate);
      const withEndDate = setAppointmentEndDate(withStartDate, endDate);
      return setAppointmentAllDay(withEndDate, allDay);
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      editingAppointmentId = prevState.editingAppointmentId,
      appointmentChanges = prevState.appointmentChanges,
      addedAppointment = prevState.addedAppointment,
    } = nextProps;

    return {
      editingAppointmentId,
      appointmentChanges,
      addedAppointment,
    };
  }

  render() {
    const {
      setAppointmentTitle,
      setAppointmentStartDate,
      setAppointmentEndDate,
      setAppointmentAllDay,
    } = this.props;
    const {
      addedAppointment, editingAppointmentId, appointmentChanges,
    } = this.state;

    return (
      <Plugin
        name="EditingState"
      >
        <Getter name="setAppointmentTitle" value={setAppointmentTitle} />
        <Getter name="setAppointmentStartDate" value={setAppointmentStartDate} />
        <Getter name="setAppointmentEndDate" value={setAppointmentEndDate} />
        <Getter name="setAppointmentAllDay" value={setAppointmentAllDay} />

        <Getter name="editingAppointmentId" value={editingAppointmentId} />
        <Action name="startEditAppointment" action={this.startEditAppointment} />
        <Action name="stopEditAppointment" action={this.stopEditAppointment} />

        <Getter name="appointmentChanges" value={appointmentChanges} />
        <Action name="changeAppointment" action={this.changeAppointment} />
        <Action name="cancelChangedAppointment" action={this.cancelChangedAppointment} />
        <Action name="commitChangedAppointment" action={this.commitChangedAppointment} />

        <Getter name="addedAppointment" value={addedAppointment} />
        <Action name="addAppointment" action={this.addAppointment} />
        <Action name="changeAddedAppointment" action={this.changeAddedAppointment} />
        <Action name="cancelAddedAppointment" action={this.cancelAddedAppointment} />
        <Action name="commitAddedAppointment" action={this.commitAddedAppointment} />

        <Action name="commitDeletedAppointment" action={this.commitDeletedAppointment} />
      </Plugin>
    );
  }
}

EditingState.propTypes = {
  editingAppointmentId: PropTypes.number,
  defaultEditingAppointmentId: PropTypes.number,
  onEditingAppointmentIdChange: PropTypes.func,

  addedAppointment: PropTypes.object,
  defaultAddedAppointment: PropTypes.object,
  onAddedAppointmentChange: PropTypes.func,

  appointmentChanges: PropTypes.object,
  defaultAppointmentChanges: PropTypes.object,
  onAppointmentChangesChange: PropTypes.func,

  onCommitChanges: PropTypes.func.isRequired,

  setAppointmentStartDate: PropTypes.func,
  setAppointmentEndDate: PropTypes.func,
  setAppointmentTitle: PropTypes.func,
  setAppointmentAllDay: PropTypes.func,
};

EditingState.defaultProps = {
  editingAppointmentId: undefined,
  defaultEditingAppointmentId: undefined,
  onEditingAppointmentIdChange: undefined,

  appointmentChanges: undefined,
  defaultAppointmentChanges: {},
  onAppointmentChangesChange: undefined,

  addedAppointment: undefined,
  defaultAddedAppointment: {},
  onAddedAppointmentChange: undefined,

  setAppointmentStartDate:
    (appointment, nextStartDate) => ({ ...appointment, startDate: nextStartDate }),
  setAppointmentEndDate: (appointment, nextEndDate) => ({ ...appointment, endDate: nextEndDate }),
  setAppointmentTitle: (appointment, nextTitle) => ({ ...appointment, title: nextTitle }),
  setAppointmentAllDay: (appointment, nextAllDay) => ({ ...appointment, allDay: nextAllDay }),
};
