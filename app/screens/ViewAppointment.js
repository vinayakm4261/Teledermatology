import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { Text, View, Image, Modal, FlatList } from 'react-native';
import {
  Card,
  Avatar,
  useTheme,
  FAB,
  TouchableRipple,
} from 'react-native-paper';
import ImageView from 'react-native-image-viewing';
import VideoPlayer from 'react-native-video-controls';
import { connect } from 'react-redux';
import moment from 'moment';

import { viewAppointmentStyles } from './styles';
import { ScreenWrapper, Label, Chip, Loader } from '../components';
import ChatAudio from '../components/ChatAudio';

import translate from '../locales/translate';
import requestAPI from '../helpers/requestAPI';
import { initVideoCallAction } from '../actions/infoActions';
import { setDatabaseAction, initChatAction } from '../actions/chatActions';

const ViewAppointment = ({
  route,
  navigation,
  isDoctor,
  setDatabase,
  initChat,
  initVideoCall,
}) => {
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
      }).then(({ response }) => {
        setAppt(response);

        response[0].photos.forEach((value) => {
          setImages((oldImages) => [...oldImages, { uri: value }]);
        });

        const appointmentDateTime = moment(
          `${moment(response[0].date).format('DD-MM-YYYY')} ${
            response[0].time
          }`,
          'DD-MM-YYYY hh:mm A',
        );

        if (
          moment().isBetween(
            moment(appointmentDateTime, 'DD-MM-YYYY hh:mm A').subtract(
              11,
              'minutes',
            ),
            moment(appointmentDateTime, 'DD-MM-YYYY hh:mm A').add(1, 'hour'),
          )
        ) {
          setVideoCallEnable(false);
        }

        if (response[0].status === 'accepted') {
          setScheduleFixed(false);
        }

        if (isDoctor)
          setGeneralData({
            _id: response[0].patientData._id,
            name: response[0].patientData.name,
            profilePic: response[0].patientData.profilePic,
            age: response[0].patientData.age,
            gender: response[0].patientData.gender,
            diseases: response[0].patientData.diseases,
          });
        else {
          setGeneralData({
            _id: response[0].doctorData._id,
            name: response[0].doctorData.name,
            profilePic: response[0].doctorData.profilePic,
            hospital: response[0].doctorData.hospital,
            department: response[0].doctorData.department,
          });
        }

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

  const handleChat = useCallback(() => {
    setDatabase('/chats')
      .then(() => {
        initChat({
          appointmentID: _id,
          receiverID: generalData?._id,
        }).then(() => {
          navigation.navigate('Chat');
        });
      })
      .catch((err) => console.log(err));
  }, [_id, generalData, initChat, navigation, setDatabase]);

  const handleVideoCall = useCallback(() => {
    initVideoCall(_id)
      .then(({ token }) =>
        navigation.navigate('Video', {
          channelName: _id,
          token,
        }),
      )
      .catch((err) => console.log(err));
  }, [_id, initVideoCall, navigation]);

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
            onPress={handleChat}
            label="Chat"
            theme={{ colors: { accent: theme.colors.primary } }}
            style={{
              backgroundColor: scheduleFixed ? '#E0E0E0' : theme.colors.primary,
              ...styles.rowLeft,
            }}
            disabled={scheduleFixed}
          />
          <FAB
            icon="video-outline"
            onPress={handleVideoCall}
            label="Video Call"
            theme={{ colors: { accent: theme.colors.primary } }}
            style={{
              backgroundColor: videoCallEnable
                ? '#E0E0E0'
                : theme.colors.primary,
              ...styles.rowRight,
            }}
            disabled={videoCallEnable}
          />
        </View>
      </View>
    ),
    [
      styles.row,
      styles.rowLeft,
      styles.rowRight,
      handleChat,
      theme.colors.primary,
      scheduleFixed,
      handleVideoCall,
      videoCallEnable,
    ],
  );

  return (
    <ScreenWrapper
      {...{ header, renderFooter }}
      style={{
        paddingHorizontal: 16,
        paddingBottom: 80,
      }}>
      <Loader loaded={!loading}>
        {() => (
          <>
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
                      {generalData.gender.toUpperCase()}, {generalData.age}{' '}
                      YEARS
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
            <Card
              style={[styles.card, { padding: 6 }]}
              theme={{ roundness: 8 }}>
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
              <FlatList
                data={appt[0].audio}
                numColumns={2}
                renderItem={({ item }) => (
                  <View style={{ flex: 1 }}>
                    <ChatAudio
                      currentMessage={{
                        audio: item,
                      }}
                      audioProps={{}}
                    />
                  </View>
                )}
                keyExtractor={(item) => item}
                ListEmptyComponent={() => (
                  <Text style={{ ...theme.fonts.regular, padding: 10 }}>
                    No audio recordings uploaded
                  </Text>
                )}
              />
            </Card>
            <Label>Additional Information</Label>
            <Card
              style={[styles.card, { padding: 10 }]}
              theme={{ roundness: 8 }}>
              <Text style={{ ...theme.fonts.regular }}>
                {appt[0].additionalInfo
                  ? appt[0].additionalInfo
                  : 'No Additional Info provided'}
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
                disableVolume
                disableFullscreen
              />
            </Modal>
          </>
        )}
      </Loader>
    </ScreenWrapper>
  );
};

const mapStateToProps = (state) => ({
  isDoctor: state.authReducer.isDoctor,
});

const mapDispatchToProps = (dispatch) => ({
  setDatabase: (payload) => dispatch(setDatabaseAction(payload)),
  initChat: (payload) => dispatch(initChatAction(payload)),
  initVideoCall: (channelName) => dispatch(initVideoCallAction(channelName)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewAppointment);
