import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { Text, View, Image, Modal } from 'react-native';
import moment from 'moment';
import VideoPlayer from 'react-native-video-controls';
import { connect } from 'react-redux';

import {
  Card,
  Avatar,
  useTheme,
  FAB,
  TouchableRipple,
} from 'react-native-paper';
import ImageView from 'react-native-image-viewing';

import { viewAppointmentStyles } from './styles';
import { ScreenWrapper, Label, Chip, Loader } from '../components';
import translate from '../locales/translate';
import requestAPI from '../helpers/requestAPI';

const ViewAppointment = ({ route, navigation, isDoctor }) => {
  const theme = useTheme();
  const styles = useMemo(viewAppointmentStyles(), []);
  const [loading, setLoading] = useState(true);
  const { _id } = route.params;
  const [appt, setAppt] = useState();
  const [images, setImages] = useState([]);
  const [generalData, setGeneralData] = useState();
  const [scheduleFixed, setScheduleFixed] = useState(true);
  const [videoCallEnable, setVideoCallEnable] = useState(true);

  useEffect(() => {
    try {
      const endPoint = isDoctor
        ? `/doctor/fetchAppointment`
        : `/patient/fetchAppointment`;
      requestAPI(endPoint, 'POST', {
        appointmentID: _id,
      }).then((response) => {
        setAppt(response.response);
        response.response[0].photos.forEach((value) => {
          setImages((oldImages) => [...oldImages, { uri: value }]);
        });
        const today = new Date();
        const currTime = moment(today).add(10, 'minutes').format('hh:mm A');
        if (
          moment(currTime, 'hh:mm A').isSame(
            moment(response.response[0].time, 'hh:mm A'),
            'time',
          )
        ) {
          setVideoCallEnable(false);
        }
        if (response.response[0].status === 'accepted') {
          setScheduleFixed(false);
        }
        if (isDoctor)
          setGeneralData({
            name: response.response[0].patientData.name,
            profilePic: response.response[0].patientData.profilePic,
            age: response.response[0].patientData.age,
            gender: response.response[0].patientData.gender,
            diseases: response.response[0].patientData.diseases,
          });
        else
          setGeneralData({
            name: response.response[0].doctorData.name,
            profilePic: response.response[0].doctorData.profilePic,
            hospital: response.response[0].doctorData.hospital,
            department: response.response[0].doctorData.department,
          });
        setLoading(false);
      });
    } catch (err) {
      console.log(err);
    }
  }, [_id, isDoctor]);

  const [imgVisible, setImgVisible] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [playVideo, setPlayVideo] = useState({ play: false, uri: '' });

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
            disabled={scheduleFixed}
          />
          <FAB
            icon="video-outline"
            onPress={() => {
              alert('Video Call');
            }}
            label="Video Call"
            theme={{ colors: { accent: theme.colors.primary } }}
            style={styles.rowRight}
            disabled={videoCallEnable}
          />
        </View>
      </View>
    ),
    [
      theme.colors.primary,
      styles.rowRight,
      styles.rowLeft,
      styles.row,
      scheduleFixed,
      videoCallEnable,
    ],
  );
  return (
    <Loader loaded={!loading}>
      {() => (
        <ScreenWrapper
          {...{ header, renderFooter }}
          style={{
            paddingHorizontal: 16,
            paddingBottom: 80,
          }}>
          <Label>{isDoctor ? 'Patient' : 'Doctor'}</Label>
          <Card style={styles.card} theme={{ roundness: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Avatar.Image
                source={{ uri: generalData.profilePic }}
                size={78}
                style={{ margin: 10 }}
              />
              <View style={{ flex: 1, marginLeft: 4 }}>
                <Text style={{ ...theme.fonts.medium, fontSize: 18 }}>
                  {generalData.name}
                </Text>
                {isDoctor ? (
                  <Text style={{ ...theme.fonts.regular, fontSize: 14 }}>
                    {generalData.gender.toUpperCase()}, {generalData.age} YEARS
                  </Text>
                ) : (
                  <>
                    <Text style={{ ...theme.fonts.regular, fontSize: 14 }}>
                      {generalData.department}
                    </Text>
                    <Text style={{ ...theme.fonts.regular, fontSize: 14 }}>
                      {generalData.hospital}
                    </Text>
                  </>
                )}
              </View>
            </View>
          </Card>
          <Label>Schedule</Label>
          <Card style={[styles.card, { padding: 6 }]} theme={{ roundness: 8 }}>
            <Text style={{ ...theme.fonts.regular, marginHorizontal: 2 }}>
              Status:{' '}
              <Text
                style={{
                  ...theme.fonts.medium,
                  color: theme.colors.status[appt[0].status.toUpperCase()],
                  textTransform: 'uppercase',
                }}>
                {appt[0].status}
              </Text>
            </Text>
            <Text style={{ ...theme.fonts.regular, marginHorizontal: 2 }}>
              Date:{' '}
              <Text style={{ ...theme.fonts.medium }}>
                {`${moment(appt[0].date).calendar(null, {
                  sameDay: '[Today]',
                  nextDay: '[Tomorrow]',
                  nextWeek: 'dddd, Do MMM',
                  sameElse: 'Do MMM YYYY',
                })}${!appt[0].time ? '' : `, ${appt[0].time}`}`}
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
              {appt[0].symptoms.map((value) => (
                <Chip>{value}</Chip>
              ))}
            </View>
          </Card>
          <Label>Images/Scans</Label>
          <Card style={styles.card} theme={{ roundness: 8 }}>
            {images.length === 0 ? (
              <Text style={{ ...theme.fonts.regular, padding: 10 }}>
                No images uploaded
              </Text>
            ) : (
              <View style={styles.mediaContainer}>
                {appt[0].photos.map((value, index) => (
                  <TouchableRipple
                    onPress={() => {
                      setImgVisible(true);
                      setImgIndex(index);
                    }}>
                    <Image
                      style={styles.img}
                      source={{
                        uri: value,
                      }}
                    />
                  </TouchableRipple>
                ))}
              </View>
            )}
          </Card>
          <Label>Videos</Label>
          <Card style={styles.card} theme={{ roundness: 8 }}>
            {appt[0].videos.length === 0 ? (
              <Text style={{ ...theme.fonts.regular, padding: 10 }}>
                No videos uploaded
              </Text>
            ) : (
              <View style={styles.mediaContainer}>
                {appt[0].videos.map((value, index) => (
                  <TouchableRipple
                    onPress={() => {
                      setPlayVideo({ play: true, uri: value });
                    }}>
                    <Chip>Video {index + 1}</Chip>
                  </TouchableRipple>
                ))}
              </View>
            )}
          </Card>
          <Label>Voice Recordings</Label>
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
            visible={imgVisible}
            onRequestClose={() => setImgVisible(false)}
          />
          <Modal
            visible={playVideo.play}
            onRequestClose={() => {
              setPlayVideo({ play: false, uri: '' });
            }}>
            <VideoPlayer
              source={{
                uri: playVideo.uri,
              }}
              onBack={() => {
                setPlayVideo({ play: false, uri: '' });
              }}
              onEnd={() => {
                setPlayVideo({ play: false, uri: '' });
              }}
              disableVolume
              disableFullscreen
            />
          </Modal>
        </ScreenWrapper>
      )}
    </Loader>
  );
};

const mapStateToProps = (state) => ({
  isDoctor: state.authReducer.isDoctor,
});

export default connect(mapStateToProps)(ViewAppointment);
