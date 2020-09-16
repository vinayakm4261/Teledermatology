import React, { memo, useMemo } from 'react';
import { View } from 'react-native';
import { Card, Avatar, Text, Divider, useTheme } from 'react-native-paper';
import moment from 'moment';

const AppointmentCard = memo(
  ({
    isDoctor = false,
    doctorData,
    patientData,
    status,
    date,
    time = null,
  }) => {
    const theme = useTheme();
    const [profilePic, name, subtitle] = useMemo(
      () =>
        isDoctor
          ? [
              patientData.profilePic,
              patientData.name,
              `${patientData.gender.toUpperCase()}, ${patientData.age} YEARS`,
            ]
          : [
              doctorData.profilePic,
              doctorData.name,
              `${doctorData.hospital}, ${doctorData.department}`,
            ],
      [isDoctor, doctorData, patientData],
    );

    return (
      <Card
        style={{
          marginVertical: 4,
        }}
        theme={{ roundness: 8 }}>
        <Card.Title
          left={(props) => (
            <Avatar.Image {...props} source={{ uri: profilePic }} />
          )}
          {...{ title: name, subtitle }}
        />
        <Divider />
        <View style={{ padding: 12 }}>
          <Text>
            Date:{' '}
            <Text style={{ ...theme.fonts.medium }}>
              {`${moment(date).calendar(null, {
                sameDay: '[Today]',
                nextDay: '[Tomorrow]',
                nextWeek: 'dddd, Do MMM',
                sameElse: 'Do MMM YYYY',
              })}${!time ? '' : `, ${time}`}`}
            </Text>
          </Text>
          <Text>
            Status:{' '}
            <Text
              style={{
                ...theme.fonts.medium,
                color: theme.colors.status[status.toUpperCase()],
                textTransform: 'uppercase',
              }}>
              {status}
            </Text>
          </Text>
        </View>
      </Card>
    );
  },
);

export default AppointmentCard;
