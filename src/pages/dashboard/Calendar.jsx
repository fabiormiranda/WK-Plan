import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

/**
 * WK-Plan Calendar component with accurate multi-date selection and clean highlight.
 *
 * @param {Object} props
 * @param {Function} props.onDateClick - Function to handle date clicks
 * @param {Array} props.selectedDates - Array of selected dates in 'YYYY-MM-DD'
 */
function Calendar({ onDateClick, selectedDates = [] }) {
  // Create "fake events" to highlight selected dates with a soft red background
  const highlightEvents = selectedDates.map(date => ({
    title: '',
    start: date,
    allDay: true,
    display: 'background',
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
  }));

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      selectable={true}
      selectMirror={true}
      dayMaxEvents={true}
      events={highlightEvents}
      dateClick={onDateClick}
      height="auto"
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,dayGridWeek",
      }}
      locale="en"
    />
  );
}

export default Calendar;
