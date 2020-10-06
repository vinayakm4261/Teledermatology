import React, { useCallback, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { FAB, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import {
  ScreenWrapper,
  Subheading,
  Caption,
  Button,
  Loader,
  AppointmentCard,
} from '../components';
import EmptyIllustration from '../../assets/illustrations/EmptyIllustration.svg';

import useScreenDimensions from '../hooks/useScreenDimensions';
import { loadPatientDataAction } from '../actions/infoActions';

const HomeScreen = ({
  navigation,
  dataLoaded = true,
  loadData,
  appointments = [],
}) => {
  const theme = useTheme();
  const { width } = useScreenDimensions();

  const header = useMemo(
    () => ({
      title: 'Home',
      actions: [{ icon: 'account-outline', onPress: () => alert('Account') }],
    }),
    [],
  );

  const renderFooter = useCallback(
    () => (
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          margin: 16,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <FAB
          icon="plus"
          onPress={() => {
            alert('Appointment');
          }}
          label="New Appointment"
          theme={{ colors: { accent: theme.colors.primary } }}
        />
      </View>
    ),
    [theme.colors.primary],
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData && loadData();
    });

    return unsubscribe;
  }, [loadData, navigation]);

  return (
    <ScreenWrapper
      {...{ header, renderFooter }}
      style={{
        paddingHorizontal: 16,
        paddingBottom: 80,
      }}>
      <Loader loaded={dataLoaded}>
        {() => (
          <>
            {!appointments.length ? (
              <View
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 48,
                  alignItems: 'center',
                }}>
                <EmptyIllustration
                  width={width - 48}
                  height={(width - 48) / 1.1386962552}
                />
                <Caption>No Appointments</Caption>
              </View>
            ) : (
              <>
                <Subheading>Upcoming Appointments</Subheading>
                <View style={{ paddingVertical: 6 }}>
                  {appointments.map(({ _id, ...appointment }) => (
                    <AppointmentCard
                      {...{ key: _id, _id, ...appointment }}
                      onPress={() => {
                        navigation.navigate('ViewAppointment');
                      }}
                    />
                  ))}
                </View>
              </>
            )}
            <Button compact onPress={() => alert('All Appointments')}>
              View All Appointments
            </Button>
          </>
        )}
      </Loader>
    </ScreenWrapper>
  );
};

HomeScreen.propTypes = {
  loadData: PropTypes.func.isRequired,
  dataLoaded: PropTypes.bool.isRequired,
  appointments: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      doctorData: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        hospital: PropTypes.string.isRequired,
        department: PropTypes.string.isRequired,
        profilePic: PropTypes.string.isRequired,
      }).isRequired,
      status: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      time: PropTypes.string,
    }),
  ).isRequired,
};

const mapStateToProps = (state) => ({
  dataLoaded: state.infoReducer.dataLoaded,
  appointments: state.infoReducer.appointments,
});

const mapDispatchToProps = (dispatch) => ({
  loadData: () => dispatch(loadPatientDataAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
