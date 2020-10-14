import React, { useState, useCallback } from 'react';
import moment from 'moment';
import { Calendar } from 'react-native-calendars';
import { useTheme } from 'react-native-paper';

const getMarkers = (fromDate, toDate, colors) => {
  const rangeStart = moment(fromDate, 'YYYY-MM-DD').startOf('day');
  const rangeEnd = moment(toDate, 'YYYY-MM-DD').startOf('day');
  if (rangeStart.isAfter(rangeEnd)) return {};
  const currentDate = rangeStart.clone();
  const markers = {};

  do {
    markers[currentDate.format('YYYY-MM-DD')] = {
      color: colors.primary,
      textColor: '#ffffff',
      ...(currentDate.isSame(rangeStart, 'day')
        ? { startingDay: true, color: colors.primaryDark }
        : null),
      ...(currentDate.isSame(rangeEnd, 'day')
        ? { endingDay: true, color: colors.primaryDark }
        : null),
    };
  } while (currentDate.add(1, 'days').diff(rangeEnd) <= 0);

  return markers;
};

const DateRangePicker = ({ initialRange, onChange, ...props }) => {
  const theme = useTheme();

  const [{ markedDates, lastSelectedDate }, setState] = useState({
    markedDates: getMarkers(initialRange[0], initialRange[1], theme.colors),
    lastSelectedDate: initialRange[0],
  });

  const onDayPress = useCallback(
    (day) => {
      const newDate = day.dateString;
      if (
        moment(newDate, 'YYYY-MM-DD').isAfter(
          moment(lastSelectedDate, 'YYYY-MM-DD'),
        )
      ) {
        setState({
          markedDates: getMarkers(lastSelectedDate, newDate, theme.colors),
          lastSelectedDate: newDate,
        });
        onChange([lastSelectedDate, newDate]);
      } else {
        setState({
          markedDates: getMarkers(newDate, lastSelectedDate, theme.colors),
          lastSelectedDate: newDate,
        });
        onChange([newDate, lastSelectedDate]);
      }
    },
    [lastSelectedDate, theme.colors, onChange],
  );

  return (
    <Calendar
      enableSwipeMonths
      horizontal={true}
      pagingEnabled={true}
      markingType="period"
      markedDates={markedDates}
      current={lastSelectedDate}
      onDayPress={onDayPress}
      theme={{
        'stylesheet.day.period': {
          base: {
            overflow: 'hidden',
            height: 34,
            alignItems: 'center',
            width: 38,
          },
        },
      }}
      {...props}
    />
  );
};

export default DateRangePicker;
