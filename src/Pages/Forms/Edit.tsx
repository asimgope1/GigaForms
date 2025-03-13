import {
  Alert,
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {Fragment, useState} from 'react';
import {MyStatusBar, WIDTH} from '../../constants/config';
import TitleHeader from './TitleHeader';
import {DARKGREEN} from '../../constants/color';
import {splashStyles} from '../Splash/SplashStyles';
import {TouchableOpacity} from 'react-native';
import {TextInput} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

const Edit = ({navigation, route}) => {
  const {highestQualification} = route.params || {};
  const [qualification, setQualification] = useState(
    highestQualification || '',
  );
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
  // Restore qualification when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      setQualification(highestQualification || '');
    }, [highestQualification]),
  );
  return (
    <Fragment>
      <MyStatusBar backgroundColor={DARKGREEN} barStyle="light-content" />
      <SafeAreaView style={[splashStyles.maincontainer]}>
        {/* back and page header */}
        <TitleHeader
          title="Edit Page"
          left={WIDTH * 0.3}
          onPress={() => {
            navigation.navigate('Forms');
          }}
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
              value={qualification}
              onChangeText={val => {
                setQualification(val); // Update qualification state
                setText(val); // Update text state
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
            onPress={() => {
              navigation.navigate('Forms');
              Alert.alert('Changed SuccessFully');
              handleSubmit();
            }}
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

export default Edit;

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
    color: 'black',
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
