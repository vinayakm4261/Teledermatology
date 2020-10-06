import React, { useMemo, useCallback, useState } from 'react';
import { Text, View, Image, Modal } from 'react-native';
import moment from 'moment';
import VideoPlayer from 'react-native-video-controls';

import {
  Card,
  Avatar,
  useTheme,
  FAB,
  TouchableRipple,
} from 'react-native-paper';
import ImageView from 'react-native-image-viewing';

import { connect } from 'react-redux';

import { viewAppointmentStyles } from './styles';
import { ScreenWrapper, Label, Chip } from '../components';
import translate from '../locales/translate';

const ViewAppointment = ({ navigation, userData }) => {
  const theme = useTheme();
  const styles = useMemo(viewAppointmentStyles(), []);
  const today = new Date();
  const images = [
    {
      uri: 'https://images.unsplash.com/photo-1571501679680-de32f1e7aad4',
    },
    {
      uri: 'https://images.unsplash.com/photo-1573273787173-0eb81a833b34',
    },
  ];

  const [visible, setIsVisible] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [play, setPlay] = useState(false);

  const header = useMemo(
    () => ({
      title: translate('appointment.title'),
      backAction: navigation.goBack,
    }),
    [navigation],
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
        <View style={styles.row}>
          <FAB
            icon="message-text-outline"
            onPress={() => {
              alert('Chat');
            }}
            label="Chat"
            theme={{ colors: { accent: theme.colors.primary } }}
            style={styles.rowLeft}
          />
          <FAB
            icon="video-outline"
            onPress={() => {
              alert('Video Call');
            }}
            label="Video Call"
            theme={{ colors: { accent: theme.colors.primary } }}
            style={styles.rowRight}
          />
        </View>
      </View>
    ),
    [theme.colors.primary, styles.rowRight, styles.rowLeft, styles.row],
  );

  return (
    <ScreenWrapper
      {...{ header, renderFooter }}
      style={{
        paddingHorizontal: 16,
        paddingBottom: 80,
      }}>
      <Label>Doctor</Label>
      <Card style={styles.card} theme={{ roundness: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Avatar.Image
            source={{ uri: userData.profilePic }}
            size={78}
            style={{ margin: 10 }}
          />
          <View style={{ flex: 1, marginLeft: 4 }}>
            <Text style={{ ...theme.fonts.medium, fontSize: 18 }}>
              Dr. Max Otwell
            </Text>
            <Text style={{ ...theme.fonts.medium, fontSize: 14 }}>
              Dermatologist
            </Text>
            <Text style={{ ...theme.fonts.medium, fontSize: 14 }}>
              Somaiya Hospital
            </Text>
          </View>
        </View>
      </Card>
      <Label>Schedule</Label>
      <Card style={[styles.card, { padding: 6 }]} theme={{ roundness: 8 }}>
        <Text style={{ ...theme.fonts.medium, marginHorizontal: 2 }}>
          Status:{' '}
          <Text
            style={{
              ...theme.fonts.medium,
              color: theme.colors.status['accepted'.toUpperCase()],
              textTransform: 'uppercase',
            }}>
            accepted
          </Text>
        </Text>
        <Text style={{ ...theme.fonts.medium, marginHorizontal: 2 }}>
          Date:{' '}
          <Text style={{ ...theme.fonts.medium }}>
            {`${moment(today).calendar(null, {
              sameDay: '[Today]',
              nextDay: '[Tomorrow]',
              nextWeek: 'dddd, Do MMM',
              sameElse: 'Do MMM YYYY',
            })}`}
          </Text>
        </Text>
      </Card>
      <Label>Symptoms</Label>
      <Card style={styles.card} theme={{ roundness: 8 }}>
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
      <Card style={styles.card} theme={{ roundness: 8 }}>
        <View style={styles.mediaContainer}>
          <TouchableRipple
            onPress={() => {
              setIsVisible(true);
              setImgIndex(0);
            }}>
            <Image
              style={styles.img}
              source={{
                uri:
                  'https://images.unsplash.com/photo-1571501679680-de32f1e7aad4',
              }}
            />
          </TouchableRipple>
          <TouchableRipple
            onPress={() => {
              setIsVisible(true);
              setImgIndex(1);
            }}>
            <Image
              style={styles.img}
              source={{
                uri:
                  'https://images.unsplash.com/photo-1573273787173-0eb81a833b34',
              }}
            />
          </TouchableRipple>
        </View>
      </Card>
      <Label>Videos</Label>
      <Card styles={styles.card} theme={{ roundness: 8 }}>
        <View style={styles.mediaContainer}>
          <TouchableRipple
            onPress={() => {
              setPlay(true);
            }}>
            <Image
              style={styles.img}
              source={{
                uri:
                  'https://images.unsplash.com/photo-1569569970363-df7b6160d111',
              }}
            />
          </TouchableRipple>
        </View>
      </Card>
      <Label>Audios</Label>
      <Card style={styles.card} theme={{ roundness: 8 }}>
        <View style={styles.mediaContainer}>
          <Image
            style={styles.img}
            source={{
              uri:
                'https://image.freepik.com/free-vector/flat-nurse-with-patient_23-2148158494.jpg',
            }}
          />
          <Image
            style={styles.img}
            source={{
              uri:
                'https://image.freepik.com/free-vector/flat-nurse-with-patient_23-2148158494.jpg',
            }}
          />
        </View>
      </Card>
      <Label>Additional Information</Label>
      <Card style={[styles.card, { padding: 10 }]} theme={{ roundness: 8 }}>
        <Text style={{ ...theme.fonts.regular }}>
          Additional Information entered will be shown here
        </Text>
      </Card>
      <ImageView
        images={images}
        imageIndex={imgIndex}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      />
      <Modal
        visible={play}
        onRequestClose={() => {
          setPlay(false);
        }}>
        <VideoPlayer
          source={{
            uri: 'https://vjs.zencdn.net/v/oceans.mp4',
          }}
          onBack={() => {
            setPlay(false);
          }}
          onEnd={() => {
            setPlay(false);
          }}
          disableVolume
          disableFullscreen
        />
      </Modal>
    </ScreenWrapper>
  );
};

const mapStateToProps = (state) => ({
  userData: state.authReducer.userData,
});

export default connect(mapStateToProps)(ViewAppointment);
