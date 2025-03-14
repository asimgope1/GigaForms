import React, {Fragment, useState, useEffect, useCallback} from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  BackHandler,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MyStatusBar, WIDTH} from '../../constants/config';
import TitleHeader from './TitleHeader';
import {DARKGREEN} from '../../constants/color';
import {splashStyles} from '../Splash/SplashStyles';
import {useFocusEffect} from '@react-navigation/native';
import {Animated} from 'react-native';
import {Modal} from 'react-native-paper';
import {Calendar} from 'react-native-calendars';
import DropDownPicker from 'react-native-dropdown-picker';
import {Loader} from '../../components/Loader';

const Edit = ({navigation, route}) => {
  const {itemDataArray} = route.params || {};
  const [error, setError] = useState({});
  const shakeAnimation = new Animated.Value(0);
  const [openDropdown, setOpenDropdown] = useState({});
  const [dropdownValues, setDropdownValues] = useState({});

  // Convert array to an editable object
  const initialData = itemDataArray ? Object.fromEntries(itemDataArray) : {};

  const [formData, setFormData] = useState(initialData);

  // Load data from AsyncStorage on mount
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('formData');
        if (storedData) {
          setFormData(JSON.parse(storedData));
        }

        // If new data comes from route.params, update AsyncStorage
        if (itemDataArray) {
          await AsyncStorage.setItem('formData', JSON.stringify(initialData));
          setFormData(initialData);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadStoredData();
  }, [itemDataArray]);

  // Refresh data when screen gains focus
  const handleBackPress = useCallback(() => {
    const saveDataBeforeExit = async () => {
      try {
        await AsyncStorage.setItem('formData', JSON.stringify(formData));
      } catch (error) {
        console.error('Error saving data before exit:', error);
      }
    };

    Alert.alert(
      'Save Changes?',
      'Do you want to save changes before exiting?',
      [
        {
          text: 'No',
          onPress: () => navigation.navigate('FormsDataView'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            await saveDataBeforeExit();
            navigation.navigate('FormsDataView');
          },
        },
      ],
    );

    return true; // Prevent default back action
  }, [formData, navigation]);

  // Handle back button press
  useFocusEffect(
    useCallback(() => {
      const fetchStoredData = async () => {
        try {
          const storedData = await AsyncStorage.getItem('formData');
          if (storedData) {
            setFormData(JSON.parse(storedData));
          }
        } catch (error) {
          console.error('Error fetching stored data:', error);
        }
      };
      fetchStoredData();

      // Add BackHandler event listener
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      // Remove event listener when component unmounts
      return () =>
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    }, [handleBackPress]),
  );

  // Function to handle text change
  const handleChange = (key, value) => {
    setFormData(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    const newErrors = {};

    // Validate form fields
    Object.keys(formData).forEach(key => {
      if (!formData[key]?.toString().trim()) {
        newErrors[key] = 'This field is required!';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      shake(); // Trigger shake animation for invalid fields
      return;
    }

    try {
      // Save form data
      await AsyncStorage.setItem('formData', JSON.stringify(formData));

      // Show success alert
      Alert.alert('Changes Saved!', 'Your form has been updated successfully.');

      console.log('Updated Data:', formData);

      // Navigate back and pass updated data
      navigation.navigate('Forms', {updatedData: formData});
    } catch (error) {
      console.error('Error saving data:', error);
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

  return (
    <Fragment>
      <MyStatusBar backgroundColor={DARKGREEN} barStyle="light-content" />
      <SafeAreaView style={[splashStyles.maincontainer]}>
        <TitleHeader
          title="Edit Page"
          left={WIDTH * 0.3}
          onPress={() => navigation.navigate('FormsDataView')}
        />
        <ScrollView
          style={styles.container}
          keyboardShouldPersistTaps="handled">
          {Object.keys(formData).map((key, index) => (
            <View key={index} style={styles.inputContainer}>
              {/* Label with Required Indicator */}
              <Text style={styles.label}>
                {key.replace(/_/g, ' ')} <Text style={{color: 'red'}}>*</Text>
              </Text>

              {/* Conditional Rendering for Different Inputs */}
              {key === 'Date of Birth' ? (
                <View style={styles.inputWrapper}>
                  <TouchableOpacity
                    onPress={() =>
                      setOpenDropdown(prev => ({...prev, [key]: true}))
                    }>
                    <TextInput
                      style={[
                        styles.input,
                        error[key] ? styles.inputError : null,
                      ]}
                      placeholder="Select Date of Birth"
                      value={formData[key] || ''}
                      editable={false} // Prevent manual typing
                      placeholderTextColor={'#aaa'}
                    />
                  </TouchableOpacity>

                  {/* Modal for Date Picker */}
                  <Modal
                    transparent={true}
                    visible={openDropdown[key] || false}
                    animationType="slide">
                    <View style={styles.modalContainer}>
                      <View style={styles.calendarContainer}>
                        <Calendar
                          onDayPress={day => {
                            handleChange(key, day.dateString);
                            setOpenDropdown(prev => ({
                              ...prev,
                              [key]: false,
                            })); // Close modal
                          }}
                          markedDates={{
                            [formData[key]]: {
                              selected: true,
                              selectedColor: 'blue',
                            },
                          }}
                        />
                        <TouchableOpacity
                          style={styles.closeButton}
                          onPress={() =>
                            setOpenDropdown(prev => ({
                              ...prev,
                              [key]: false,
                            }))
                          }>
                          <Text style={styles.closeText}>Close</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Modal>
                </View>
              ) : [
                  'Location',
                  'qualification',
                  'Gender',
                  'Marital Status',
                  'Training Center',
                  'Course Name',
                  'Highest Qualification',
                  'Divisional Safety Officer',
                ].includes(key) ? (
                <View
                  style={[
                    styles.inputWrapper1,
                    {
                      zIndex: openDropdown === key ? 2000 - index * 100 : 1,
                    }, // Dynamic zIndex
                  ]}>
                  <DropDownPicker
                    open={openDropdown[key] || false}
                    value={formData[key] || null}
                    items={
                      key === 'Location'
                        ? [
                            {label: 'General', value: 'General'},
                            {label: 'OBC', value: 'OBC'},
                            {label: 'SC', value: 'SC'},
                            {label: 'ST', value: 'ST'},
                          ]
                        : key === 'qualification'
                        ? [
                            {label: 'High School', value: 'High School'},
                            {label: 'Intermediate', value: 'Intermediate'},
                            {label: 'Graduate', value: 'Graduate'},
                            {
                              label: 'Post Graduate',
                              value: 'Post Graduate',
                            },
                          ]
                        : key === 'Gender'
                        ? [
                            {label: 'Male', value: 'Male'},
                            {label: 'Female', value: 'Female'},
                            {label: 'Other', value: 'Other'},
                          ]
                        : key === 'Marital Status'
                        ? [
                            {label: 'Single', value: 'Single'},
                            {label: 'Married', value: 'Married'},
                            {label: 'Divorced', value: 'Divorced'},
                            {label: 'Widowed', value: 'Widowed'},
                          ]
                        : key === 'Training Center'
                        ? [
                            {label: 'Center 1', value: 'Center 1'},
                            {label: 'Center 2', value: 'Center 2'},
                            {label: 'Center 3', value: 'Center 3'},
                            {label: 'Center 4', value: 'Center 4'},
                          ]
                        : key === 'Divisional Safety Officer'
                        ? [
                            {label: 'Center 1', value: 'Center 1'},
                            {label: 'Center 2', value: 'Center 2'},
                            {label: 'Center 3', value: 'Center 3'},
                            {label: 'Center 4', value: 'Center 4'},
                          ]
                        : key === 'Training Center'
                        ? [
                            {label: 'Center 1', value: 'Center 1'},
                            {label: 'Center 2', value: 'Center 2'},
                            {label: 'Center 3', value: 'Center 3'},
                            {label: 'Center 4', value: 'Center 4'},
                          ]
                        : key === 'Highest Qualification'
                        ? [
                            {label: 'Center 1', value: 'Center 1'},
                            {label: 'Center 2', value: 'Center 2'},
                            {label: 'Center 3', value: 'Center 3'},
                            {label: 'Center 4', value: 'Center 4'},
                          ]
                        : key === 'Course Name'
                        ? [
                            {label: 'Center 1', value: 'Center 1'},
                            {label: 'Center 2', value: 'Center 2'},
                            {label: 'Center 3', value: 'Center 3'},
                            {label: 'Center 4', value: 'Center 4'},
                          ]
                        : []
                    }
                    setOpen={open =>
                      setOpenDropdown(prev => ({...prev, [key]: open}))
                    }
                    setValue={callback => {
                      const value = callback(formData[key]);
                      handleChange(key, value);
                    }}
                    setItems={setDropdownValues}
                    placeholder={`Select ${key.replace(/_/g, ' ')}`}
                    style={styles.dropdown}
                    dropDownContainerStyle={[
                      styles.dropdownContainerBase,
                      {zIndex: openDropdown === key ? 1000 : 1},
                    ]}
                    dropDownDirection="BOTTOM"
                  />
                </View>
              ) : (
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[
                      styles.input,
                      error[key] ? styles.inputError : null,
                    ]}
                    placeholder={`Enter ${key.replace(/_/g, ' ')}`}
                    value={formData[key] ? formData[key].toString() : ''}
                    onChangeText={val => handleChange(key, val)}
                    placeholderTextColor={'#aaa'}
                  />
                </View>
              )}

              {/* Error Message with Animated Shake */}
              {error[key] && (
                <Animated.View
                  style={{transform: [{translateX: shakeAnimation}]}}>
                  <Text style={styles.errorText}>{error[key]}</Text>
                </Animated.View>
              )}
            </View>
          ))}
        </ScrollView>
        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </SafeAreaView>
      <Loader visible={false} />
    </Fragment>
  );
};

export default Edit;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 5,
    backgroundColor: '#fff',
  },
  inputWrapper1: {
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 5,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  input: {
    height: 50,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#333',
    borderRadius: 12,
  },
  inputError: {
    borderWidth: 1.5,
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    width: '80%',
    alignSelf: 'center',
    marginBottom: 50,
  },
  submitText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  calendarContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  closeText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    height: 50,
    justifyContent: 'center',
    marginTop: 5,
  },
  dropdownContainerBase: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginTop: 2,
  },
});
