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
  ScrollView,
} from 'react-native';
import React, {Fragment, useCallback, useEffect, useState} from 'react';
import TitleHeader from './TitleHeader';
import {MyStatusBar, WIDTH} from '../../constants/config';
import {DARKGREEN} from '../../constants/color';
import {splashStyles} from '../Splash/SplashStyles';
import {useFocusEffect} from '@react-navigation/native';
import {Loader} from '../../components/Loader';

const FormsTemplates = ({navigation, route}) => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState({});
  const shakeAnimation = new Animated.Value(0);

  useFocusEffect(
    useCallback(() => {
      const {data} = route.params;
      setFormData(data[0] || {}); // Set form data from API response

      return () => {}; // Cleanup if needed
    }, [navigation]),
  );

  const handleChange = (key, value) => {
    setFormData(prevData => ({
      ...prevData,
      [key]: value,
    }));
    setError(prevError => ({
      ...prevError,
      [key]: '', // Clear error when user types
    }));
  };

  const handleSubmit = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (!formData[key]?.toString().trim()) {
        newErrors[key] = 'This field is required!';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      shake();
      return;
    }

    Alert.alert(
      'Form Submitted Successfully!',
      JSON.stringify(formData, null, 2),
    );
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

  return (
    <Fragment>
      <MyStatusBar backgroundColor={DARKGREEN} barStyle="light-content" />
      <SafeAreaView style={splashStyles.maincontainer}>
        <TitleHeader
          title="Forms Templates"
          left={WIDTH * 0.3}
          onPress={() => navigation.goBack()}
        />

        <ScrollView style={styles.container}>
          {Object.keys(formData).map((key, index) => (
            <View key={index} style={{marginBottom: 16}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.label}>{key.replace(/_/g, ' ')}</Text>
                <Text style={{color: 'red'}}>*</Text>
              </View>

              <View style={{position: 'relative'}}>
                <TextInput
                  style={[styles.input, error[key] ? styles.inputError : null]}
                  placeholder={`Enter ${key.replace(/_/g, ' ')}`}
                  value={formData[key] ? formData[key].toString() : ''}
                  onChangeText={val => handleChange(key, val)}
                  placeholderTextColor={'grey'}
                />

                {error[key] && (
                  <Animated.View
                    style={{transform: [{translateX: shakeAnimation}]}}>
                    <Text style={styles.errorText}>{error[key]}</Text>
                  </Animated.View>
                )}
              </View>
            </View>
          ))}

          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
      <Loader visible={false} />
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
    textTransform: 'capitalize',
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
    fontSize: 12,
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
