import React, {useState, useEffect, useRef, Fragment} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {TextInput, Button, Text} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import {LOGOZZ} from '../../constants/imagepath';
import {GREEN, WHITE, BLACK, DARKGREEN, BRAND} from '../../constants/color';
import {MyStatusBar, WIDTH} from '../../constants/config';
import {POSTNETWORK} from '../../utils/Network';
import {storeObjByKey} from '../../utils/Storage';
import {BASE_URL} from '../../constants/url';
import {useDispatch} from 'react-redux';
import {checkuserToken} from '../../redux/actions/auth';
import {Loader} from '../../components/Loader';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Animated Logo & Form
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Scale animation for logo
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Rotate animation (looping)
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    // Fade-in effect for form
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!email || !password) {
      showToast('error', 'Login Failed', 'Please enter email and password');
      return;
    }

    setLoading(true);

    try {
      const response = await POSTNETWORK(`${BASE_URL}user/token/`, {
        email: email.trim(),
        password: password.trim(),
      });

      if (response?.access && response?.refresh) {
        storeObjByKey('loginResponse', response);
        dispatch(checkuserToken(true));
        showToast('success', 'Login Successful', 'Welcome back!');
      } else {
        showToast('error', 'Invalid Credentials', 'Check email and password');
      }
    } catch (error) {
      console.error('Login Error:', error);
      showToast('error', 'Login Failed', 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type, title, message) => {
    Toast.show({
      type: type,
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 50,
    });
  };

  return (
    <Fragment>
      <MyStatusBar backgroundColor={BRAND} barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flexContainer}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled">
            {/* Login Box */}
            <Animated.View style={[styles.loginBox, {opacity: fadeAnim}]}>
              {/* Animated Logo */}
              <Animated.Image
                source={LOGOZZ}
                style={[styles.logo, {transform: [{scale: scaleAnim}]}]}
              />

              {/* Email Input */}
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                placeholder="Enter your email"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                textColor={BLACK}
                outlineColor={GREEN}
                activeOutlineColor={GREEN}
              />

              {/* Password Input */}
              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                placeholder="Enter your password"
                secureTextEntry
                style={styles.input}
                textColor={BLACK}
                outlineColor={GREEN}
                activeOutlineColor={GREEN}
              />

              {/* Login Button with Loading */}
              <Button
                mode="contained"
                onPress={handleLogin}
                style={styles.button}
                icon="login"
                loading={loading}
                disabled={loading}>
                {loading ? 'Logging In...' : 'Login'}
              </Button>

              {/* Sign-up Option */}
              <Text style={styles.signupText}>
                Don't have an account?{' '}
                <Text style={styles.signupLink}>Sign Up</Text>
              </Text>
            </Animated.View>
          </ScrollView>
        </TouchableWithoutFeedback>
        <Toast />
        <Loader visible={loading} />
      </KeyboardAvoidingView>
    </Fragment>
  );
};

export default Login;

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    backgroundColor: WHITE,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: WHITE,
  },
  loginBox: {
    width: WIDTH * 0.9,
    padding: 20,
    backgroundColor: WHITE,
    borderRadius: 15,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  input: {
    width: '100%',
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    backgroundColor: GREEN,
    width: '100%',
  },
  signupText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#555',
  },
  signupLink: {
    color: GREEN,
    fontWeight: 'bold',
  },
});
