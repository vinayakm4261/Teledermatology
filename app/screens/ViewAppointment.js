import React, { useMemo } from 'react';
import { Text, View, Image } from 'react-native';
import { Card, Avatar, useTheme, FAB } from 'react-native-paper';

import { ScreenWrapper, Label, Chip } from '../components';
import translate from '../locales/translate';

const ViewAppointment = (navigation) => {
  const theme = useTheme();
  const header = useMemo(
    () => ({
      title: translate('appointment.title'),
      backAction: navigation.goBack,
    }),
    [navigation],
  );
  return (
    <ScreenWrapper
      {...{ header }}
      style={{
        paddingHorizontal: 16,
        paddingBottom: 80,
      }}>
      <Label>Doctor</Label>
      <Card
        style={{
          marginVertical: 4,
          backgroundColor: theme.colors.greyLight,
        }}
        theme={{ roundness: 8 }}>
        <Card.Title left={(props) => <Avatar.Image />} />
      </Card>
      <Label>Schedule</Label>
      <Card
        style={{
          marginVertical: 4,
          backgroundColor: theme.colors.greyLight,
        }}
        theme={{ roundness: 8 }}>
        <Text style={{ ...theme.fonts.medium, marginHorizontal: 8 }}>
          Status:
        </Text>
        <Text style={{ ...theme.fonts.medium, marginHorizontal: 8 }}>
          Date:
        </Text>
      </Card>
      <Label>Symptoms</Label>
      <Card style={{ backgroundColor: theme.colors.greyLight }}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            padding: 4,
          }}>
          <Chip>Admin hai</Chip>
          <Chip>Diseases hogi pata nahi</Chip>
          <Chip>Aur bhi ho sakti hai</Chip>
        </View>
      </Card>
      <Label>Images/Scans</Label>
      <Card style={{ backgroundColor: theme.colors.greyLight }}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            padding: 6,
          }}>
          <Image
            style={{ height: 100, width: 100, margin: 4, borderRadius: 6 }}
            source={{
              uri:
                'https://image.freepik.com/free-vector/flat-nurse-with-patient_23-2148158494.jpg',
            }}
          />
          <Image
            style={{ height: 100, width: 100, margin: 4, borderRadius: 6 }}
            source={{
              uri:
                'https://image.freepik.com/free-vector/flat-nurse-with-patient_23-2148158494.jpg',
            }}
          />
        </View>
      </Card>
      <Label>Additional Information</Label>
      <Card style={{ backgroundColor: theme.colors.greyLight }}>
        <Text>Additional Information entered will be shown here</Text>
      </Card>
      <View style={{ position: 'absolute', bottom: 8, right: 65 }}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            padding: 6,
          }}>
          <FAB
            icon="message-text-outline"
            onPress={() => {
              alert('Chat');
            }}
            label="Chat"
            theme={{ colors: { accent: theme.colors.primary } }}
            style={{ width: 100, margin: 4 }}
          />
          <FAB
            icon="video-outline"
            onPress={() => {
              alert('Video Call');
            }}
            label="Video Call"
            theme={{ colors: { accent: theme.colors.primary } }}
            style={{ width: 150, margin: 4 }}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default ViewAppointment;
