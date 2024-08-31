import React, {useState, useRef} from 'react';
import {
  Platform,
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {localimag, config, mobileH, mobileW} from './Provider/utilslib/Utils';
import VideoPlayer from 'react-native-video-player';
import {useNavigation} from '@react-navigation/native';

const Video_show = props => {
  const navigation = useNavigation();

  const [thumbnail, setThumbnail] = useState(props.route.params.post_image);
  const [video, setVideo] = useState(props.route.params.vediosrc);
  const {width, height} = Dimensions.get('window');

  return (
    <View style={styles.container}>
      <View style={{height: 45, width: '100%', backgroundColor: '#000'}}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            justifyContent: 'flex-start',
            paddingLeft: 10,
            flexDirection: 'row',
            paddingTop: 15,
          }}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            // source={require('./icons/back-icon12.png')}
            source={localimag.back2}
            style={{tintColor: '#fff', width: 30, height: 20}}
          />
        </TouchableOpacity>
      </View>
      <View style={{marginTop: '30%'}}>
        <VideoPlayer
          // video={{ uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }}
          // video={{ uri: 'https://www.shutterstock.com/shutterstock/videos/1059456692/preview/stock-footage-advanced-laboratory-medical-scientist-typing-on-keyboard-works-on-computer-developing-vaccine.mp4' }}
          video={{uri: config.img_url4 + video}}
          videoWidth={height}
          videoHeight={height}
          thumbnail={{uri: config.img_url3 + thumbnail}}
          // thumbnail={{ uri: 'https://i.picsum.photos/id/866/1600/900.jpg' }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

export default Video_show;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  toolbar: {
    marginTop: 30,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  mediaPlayer: {
    height: (mobileH * 80) / 100,
    width: mobileW,
    alignSelf: 'center',
    backgroundColor: 'black',
  },
});
