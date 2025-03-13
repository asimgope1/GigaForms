import {
  Alert,
  Animated,
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {Fragment, useCallback, useState} from 'react';
import TitleHeader from './TitleHeader';
import {MyStatusBar, WIDTH} from '../../constants/config';
import {DARKGREEN} from '../../constants/color';
import {splashStyles} from '../Splash/SplashStyles';
import {useFocusEffect} from '@react-navigation/native';

const FormsTemplates = ({navigation}) => {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const shakeAnimation = new Animated.Value(0);
  const handleSubmit = () => {
    if (!text.trim()) {
      setError('This field is required!');
      shake();
    } else {
      setError('');
      Alert.alert('Form Submitted Successfully!');
    }
  };
  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useFocusEffect(
    useCallback(() => {
      setText(''); // Clear input field
      setError(''); // Clear error message

      return () => {}; // Cleanup if needed
    }, []),
  );
  return (
    <Fragment>
      <MyStatusBar backgroundColor={DARKGREEN} barStyle="light-content" />
      <SafeAreaView style={[splashStyles.maincontainer]}>
        {/* back and page header */}
        <TitleHeader
          title="Forms Templates"
          left={WIDTH * 0.3}
          onPress={() => navigation.navigate('Forms')}
        />
        <View style={styles.container}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Text style={styles.label}>Highest Qualification:</Text>
            <Text
              style={{
                color: 'red',
              }}>
              *
            </Text>
          </View>

          <View style={{position: 'relative'}}>
            <TextInput
              style={[styles.input, error ? styles.inputError : null]}
              placeholder="Highest Qualification"
              value={text}
              onChangeText={val => {
                setText(val);
                if (error) setError(''); // Clear error when user types
              }}
              placeholderTextColor={'grey'}
            />

            <View style={{minHeight: 1}}>
              {error ? (
                <Animated.View
                  style={{transform: [{translateX: shakeAnimation}]}}>
                  <Text style={styles.errorText}>{error}</Text>
                </Animated.View>
              ) : null}
            </View>

            <Text style={{color: 'grey', marginTop: error ? 0 : 5}}>
              eg : Highest Qualification
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            style={{
              backgroundColor: '#4CAF50',
              borderRadius: 8,
              padding: 12,
              marginTop: 16,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>Submit</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Fragment>
  );
};

export default FormsTemplates;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    fontSize: 16,
    color: 'grey',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 10,
    marginTop: 5,
    minHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
