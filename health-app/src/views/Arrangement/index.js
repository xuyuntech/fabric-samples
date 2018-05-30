import React from 'react';
import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));
const allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k]);
const events = [];
export default class extends React.Component {
  onSelectSlot = (slotInfo) => {
    console.log(slotInfo);
  };
  render() {
    return (
      <div>
        <div className="panel">
          <div className="panel-heading">
            <h3 className="panel-title">排班管理</h3>
          </div>
          <div className="panel-body" style={{ height: '100vh', minHeight: '500px', maxHeight: '600px' }}>
            <BigCalendar
              events={events}
              views={allViews}
              step={60}
              showMultiDayTimes
              defaultDate={new Date()}
              selectable
              onSelectSlot={this.onSelectSlot}
            />
          </div>
        </div>
      </div>
    );
  }
}
