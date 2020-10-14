import React from 'react';
import { View } from 'react-native';
import {
  Card,
  Avatar,
  Text,
  Divider,
  IconButton,
  useTheme,
} from 'react-native-paper';
import { connect } from 'react-redux';
import moment from 'moment';
import translate from '../../locales/translate';

const ProfileCard = ({ userData, isDoctor, onPress }) => {
  const theme = useTheme();
  return (
    <Card
      style={{
        marginVertical: 4,
      }}
      theme={{ roundness: 8 }}>
      <Card.Title
        left={(props) => (
          <Avatar.Image {...props} source={{ uri: userData.profilePic }} />
        )}
        right={() => (
          <IconButton
            icon="pencil"
            color={theme.colors.greyDark}
            size={24}
            onPress={onPress}
          />
        )}
        {...{ title: userData.name, subtitle: userData.email }}
      />
      {isDoctor && (
        <>
          <Divider />
          <View style={{ padding: 12 }}>
            <Text>{translate('profile.doctorAvailabilityLabel')}: </Text>
            <Text>
              {translate('profile.availabilityDatesLabel')}:{' '}
              <Text style={{ ...theme.fonts.medium }}>
                {`${moment(userData.availability.startDate).format('DD MMMM')}`}{' '}
                - {`${moment(userData.availability.endDate).format('DD MMMM')}`}
              </Text>
            </Text>
            <Text>
              {translate('profile.availabilityTimeLabel')}:{' '}
              <Text style={{ ...theme.fonts.medium }}>
                {userData.availability.startTime} -{' '}
                {userData.availability.endTime}
              </Text>
            </Text>
          </View>
        </>
      )}
      <Divider />
      <View style={{ padding: 12 }}>
        <Text>
          {translate('profile.phoneNumberLabel')}:{' '}
          <Text style={{ ...theme.fonts.medium }}>
            +
            {`${String(userData.phoneNumber).slice(0, 2)} ${String(
              userData.phoneNumber,
            ).slice(2, 12)}`}
          </Text>
        </Text>
      </View>
    </Card>
  );
};

const mapStateToProps = (state) => ({
  userData: state.authReducer.userData,
  isDoctor: state.authReducer.isDoctor,
});

export default connect(mapStateToProps)(ProfileCard);
