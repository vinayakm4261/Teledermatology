import React, { useMemo, useState, useCallback } from 'react';
import { View, Image, Linking } from 'react-native';
import { Divider, List } from 'react-native-paper';
import { connect } from 'react-redux';

import { profileStyles } from './styles';

import {
  ScreenWrapper,
  Subheading,
  ProfileCard,
  Caption,
  Button,
  BottomModal,
} from '../components';

import translate from '../locales/translate';
import { signOutAction } from '../actions/authActions';

const DoctorProfile = ({ navigation, logOut }) => {
  const handlePress = useCallback(
    () => navigation.navigate('DoctorProfileEdit'),
    [navigation],
  );

  const header = useMemo(
    () => ({
      title: translate('profile.title'),
      backAction: navigation.goBack,
    }),
    [navigation],
  );

  const styles = useMemo(profileStyles(), []);
  const [contactUs, setContactUs] = useState(false);

  return (
    <ScreenWrapper
      {...{ header }}
      style={{
        paddingHorizontal: 16,
        paddingBottom: 80,
      }}>
      <Subheading>{translate('profile.subtitle1')}</Subheading>
      <View>
        <ProfileCard onPress={handlePress} />
      </View>
      <Subheading style={styles.subheading}>Options</Subheading>
      <List.Item
        title={translate('profile.optionContactUs')}
        right={(props) => <List.Icon {...props} icon="phone" />}
        onPress={() => setContactUs(true)}
      />
      <Divider />
      <List.Item
        title={translate('profile.optionShare')}
        right={(props) => <List.Icon {...props} icon="share-variant" />}
      />
      <Divider />
      <List.Item
        title={translate('profile.optionLogOut')}
        right={(props) => (
          <List.Icon {...props} icon="logout-variant" color="#FF7364" />
        )}
        onPress={logOut}
      />
      <BottomModal
        visible={contactUs}
        onDismiss={() => {
          setContactUs(false);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.image}>
            <Image
              source={require('../../assets/images/trust_logo.png')}
              style={styles.trustSize}
            />
            <Image
              source={require('../../assets/images/hospital_logo.jpeg')}
              style={styles.hospitalSize}
            />
          </View>
          <Subheading style={styles.hospitalNameSize}>
            {translate('profile.hospital')}
          </Subheading>
          <Caption style={styles.addressColor}>
            {translate('profile.address')}
          </Caption>
          <Caption style={styles.addressColor}>
            +91 6969420420, +91 4204206969
          </Caption>
          <Button
            onPress={() => {
              Linking.openURL(`tel:6969420420`);
            }}>
            {translate('profile.call')}
          </Button>
        </View>
      </BottomModal>
    </ScreenWrapper>
  );
};

const mapDispatchToProps = (dispatch) => ({
  logOut: () => dispatch(signOutAction()),
});

export default connect(null, mapDispatchToProps)(DoctorProfile);
