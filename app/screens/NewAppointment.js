import React, { useMemo } from 'react';
import { connect } from 'react-redux';

import { ScreenWrapper, Label } from '../components';

const NewAppointmentScreen = ({ navigation }) => {
  const header = useMemo(
    () => ({
      title: 'New Appointment',
      actions: [{ icon: 'close', onPress: () => navigation.goBack() }],
    }),
    [navigation],
  );

  return (
    <ScreenWrapper
      {...{ header }}
      style={{
        paddingHorizontal: 16,
      }}></ScreenWrapper>
  );
};

NewAppointmentScreen.propTypes = {};

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewAppointmentScreen);
