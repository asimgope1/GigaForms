import React, {Fragment, useEffect, useState} from 'react';
import {View, Image, SafeAreaView, Animated} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {BRAND, GREEN, WHITE} from '../../constants/color';
import {GIGAFORMLOGO, LOGO, LOGOZZ} from '../../constants/imagepath';
import {HEIGHT, MyStatusBar, WIDTH} from '../../constants/config';
import {splashStyles} from './SplashStyles';

interface SplashProps {
  navigation: any; // Add proper navigation prop type based on your navigation library (e.g., React Navigation)
}

const Splash: React.FC<SplashProps> = ({navigation}) => {
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial opacity is 0
  const [scaleAnim] = useState(new Animated.Value(0.5)); // Initial scale is 0.5 (zoomed out)

  useEffect(() => {
    // Start fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1, // Fade to full opacity
      duration: 2000, // Duration of the animation
      useNativeDriver: true,
    }).start();

    // Start zoom-in animation
    Animated.timing(scaleAnim, {
      toValue: 1, // Zoom to full scale
      duration: 2000, // Duration of the zoom effect
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      // Uncomment the following line to navigate to the login screen after splash
      navigation.navigate('Login');
    }, 3000); // Duration of splash screen
  }, [fadeAnim, scaleAnim, navigation]);

  return (
    <Fragment>
      <MyStatusBar backgroundColor={WHITE} barStyle="dark-content" />
      <SafeAreaView style={splashStyles.maincontainer}>
        <LinearGradient
          end={{x: 0, y: 0}}
          start={{x: 0, y: 1}}
          colors={[WHITE, WHITE]}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {/* Animated Logo with Zoom Effect */}
          <Animated.View
            style={{
              ...splashStyles.logoContainer,
              width: WIDTH * 1.2, // Increased width for larger logo
              height: HEIGHT * 0.3, // Increased height for larger logo
              opacity: fadeAnim, // Bind opacity to animated value
              transform: [{scale: scaleAnim}], // Apply scaling transform
            }}>
            <Image
              resizeMode="cover"
              style={{
                alignSelf: 'center',
                width: '100%', // Set to full width of container
                height: '100%', // Set to full height of container
              }}
              source={GIGAFORMLOGO} // Assuming LOGOZZ is the brand logo
            />
          </Animated.View>

          {/* Secondary Logo with Zoom Effect */}
          <Animated.View
            style={{
              ...splashStyles.logoContainer,
              width: WIDTH * 0.7, // Increased width for larger logo
              height: HEIGHT * 0.2, // Increased height for larger logo
              opacity: fadeAnim, // Bind opacity to animated value
              transform: [{scale: scaleAnim}], // Apply scaling transform
            }}>
            {/* <Image
              tintColor={WHITE}
              resizeMode="contain"
              style={{
                alignSelf: 'center',
                width: '80%', // Set to full width of container
                height: '80%', // Set to full height of container
              }}
              source={LOGO} // Assuming LOGO is the app logo
            /> */}
          </Animated.View>
        </LinearGradient>
      </SafeAreaView>
    </Fragment>
  );
};

export default Splash;
