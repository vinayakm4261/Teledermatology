import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Text, useWindowDimensions } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { IconButton } from 'react-native-paper';

const Camera = ({ navigation }) => {
  const camera = useRef(null);
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;
  const [cameratype, setcameratype] = useState('back');
  const [containerdirection, setcontainerdirection] = useState('column');
  const [bardirection, setbardirection] = useState('row');
  const [totalseconds, settotalseconds] = useState(0);
  const [minutes, setminutes] = useState(0);
  const [seconds, setseconds] = useState(0);
  const [camvidtoggle, setcamvidtoggle] = useState(true); // true - camera, false - video
  const [isRecording, setisRecording] = useState(false);

  useEffect(() => {
    if (windowHeight < windowWidth) {
      setbardirection('column');
      setcontainerdirection('row');
    } else {
      setbardirection('row');
      setcontainerdirection('column');
    }
  }, [windowHeight]);

  const takePicture = async () => {
    if (camera) {
      const options = { quality: 0.5, base64: true };
      const data = await camera.current.takePictureAsync(options);
      console.log(data);
    }
  };

  const camera_change = () => {
    if (cameratype == 'back') {
      setcameratype('front');
    } else {
      setcameratype('back');
    }
  };
  const takeVideo = async () => {
    if (camera) {
      try {
        const options = { quality: RNCamera.Constants.VideoQuality['720p'] };
        const promise = camera.current.recordAsync(options);
        if (promise) {
          setisRecording(true);
          const timer = setInterval(() => {
            settotalseconds((sec) => sec + 1);
            console.log(totalseconds);
            setminutes(Pad(parseInt(totalseconds / 60)));
            setseconds(Pad(totalseconds % 60));
          }, 1000);
          const data = await promise;
          console.log(data);
          setisRecording(false);
          clearInterval(timer);
          // settotalseconds(0);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const stopVideo = () => {
    camera.current.stopRecording();
  };
  const Pad = (val) => {
    var valString = val + '';
    if (valString.length < 2) {
      return '0' + valString;
    } else {
      return valString;
    }
  };

  return (
    <View style={{ ...styles.container, flexDirection: containerdirection }}>
      <RNCamera
        ref={camera}
        captureAudio={camvidtoggle ? false : true}
        style={styles.preview}
        type={cameratype}
        flashMode={RNCamera.Constants.FlashMode.auto}
        useNativeZoom={true}></RNCamera>
      {isRecording && (
        <Text style={{ color: 'black', alignSelf: 'center' }}>
          {minutes}:{seconds}
        </Text>
      )}
      <IconButton
        style={styles.FAB_back}
        icon="close"
        color="white"
        size={32}
        onPress={() => navigation.pop()}
      />
      {camvidtoggle && (
        <View
          style={{
            flexDirection: bardirection,
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'white',
          }}>
          <IconButton
            icon="video"
            color="black"
            size={28}
            onPress={() => setcamvidtoggle(false)}
          />
          <View
            style={{
              backgroundColor: '#6C63FF',
              borderWidth: 3,
              borderColor: 'white',
              borderRadius: 30,
            }}>
            <IconButton
              icon="camera"
              color="white"
              size={28}
              onPress={() => {
                takePicture(camera);
              }}
            />
          </View>
          <IconButton
            size={28}
            icon="camera-switch"
            color="black"
            onPress={() => {
              camera_change(camera);
            }}
          />
        </View>
      )}
      {!camvidtoggle && (
        <View
          style={{
            flexDirection: bardirection,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <IconButton
            icon="camera"
            color="black"
            size={28}
            onPress={() => setcamvidtoggle(true)}
          />
          <View
            style={{
              backgroundColor: '#6C63FF',
              borderWidth: 3,
              borderColor: 'white',
              borderRadius: 30,
            }}>
            {isRecording ? (
              <IconButton
                icon="square"
                color="red"
                size={28}
                onPress={() => stopVideo()}
              />
            ) : (
              <IconButton
                icon="video"
                color="white"
                size={28}
                onPress={() => takeVideo()}
              />
            )}
          </View>
          <IconButton
            size={28}
            icon="camera-switch"
            color="black"
            onPress={() => {
              camera_change(camera);
            }}
          />
        </View>
      )}
    </View>
  );
};

export default Camera;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  FAB_back: {
    position: 'absolute',
    backgroundColor: '#6C63FF',
    margin: 2,
  },
});
