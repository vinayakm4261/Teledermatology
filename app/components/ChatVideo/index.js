import React, { useState } from 'react';
import { View, Image } from 'react-native';
import Lightbox from 'react-native-lightbox';
import VideoPlayer from 'react-native-video-controls';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import useScreenDimensions from '../../hooks/useScreenDimensions';

export default function ({ lightboxProps, currentMessage, videoProps }) {
  const [videoOpened, setVideoOpened] = useState(false);
  const { height, width } = useScreenDimensions();

  return (
    <View
      style={{
        borderWidth: 2,
        borderRadius: 10,
        borderColor: 'transparent',
        ...videoProps.containerStyle,
      }}>
      <Lightbox
        onOpen={() => setVideoOpened(true)}
        willClose={() => setVideoOpened(false)}
        swipeToDismiss={false}
        {...lightboxProps}>
        {videoOpened ? (
          <VideoPlayer
            source={{
              uri: currentMessage.video,
            }}
            disableVolume
            disableBack
            disableFullscreen
            style={{
              height,
              width,
            }}
            resizeMode="contain"
            {...videoProps}
          />
        ) : (
          <>
            <Image
              source={{ uri: currentMessage.thumbnail }}
              style={{ height: 240, width: 240, borderRadius: 10 }}
              resizeMode="cover"
            />
            <MaterialIcons
              name="play-arrow"
              size={24}
              style={{
                position: 'absolute',
                top: 120,
                left: 108,
                borderRadius: 14,
                padding: 2,
                backgroundColor: '#F6F6F6',
              }}
              color="#575757"
            />
          </>
        )}
      </Lightbox>
    </View>
  );
}
