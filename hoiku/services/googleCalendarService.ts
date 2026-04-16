import { Staff, Shift } from '../types';

const CALENDAR_NAME = '保育園シフト';

export async function syncShiftsToGoogleCalendar(accessToken: string, shifts: Shift[], staff: Staff[]) {
  try {
    // 1. Get or Create the "保育園シフト" calendar
    const calendarsResponse = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const calendars = await calendarsResponse.json();
    
    let calendarId = calendars.items?.find((c: any) => c.summary === CALENDAR_NAME)?.id;
    
    if (!calendarId) {
      const createResponse = await fetch('https://www.googleapis.com/calendar/v3/calendars', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ summary: CALENDAR_NAME })
      });
      const newCalendar = await createResponse.json();
      calendarId = newCalendar.id;
    }

    // 2. For each shift, create an event
    // Note: In a real app, we'd check for existing events to avoid duplicates.
    // For this version, we'll just add them.
    for (const shift of shifts) {
      const staffMember = staff.find(s => s.id === shift.staffId);
      if (!staffMember) continue;

      const startDateTime = `${shift.date}T${shift.startTime}:00`;
      const endDateTime = `${shift.date}T${shift.endTime}:00`;

      // Simple check for timezone - assuming local time for now or UTC
      // Google Calendar API requires timeZone or Z
      const event = {
        summary: `【シフト】${staffMember.name}`,
        description: `${staffMember.name}先生のシフトです。`,
        start: {
          dateTime: startDateTime,
          timeZone: 'Asia/Tokyo'
        },
        end: {
          dateTime: endDateTime,
          timeZone: 'Asia/Tokyo'
        }
      };

      await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      });
    }

    return true;
  } catch (error) {
    console.error('Google Calendar sync failed:', error);
    throw error;
  }
}
