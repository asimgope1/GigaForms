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
  Modal,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MyStatusBar, WIDTH} from '../../constants/config';
import TitleHeader from './TitleHeader';
import {BRAND, DARKGREEN} from '../../constants/color';
import {splashStyles} from '../Splash/SplashStyles';
import {useFocusEffect} from '@react-navigation/native';
import {Calendar} from 'react-native-calendars';
import DropDownPicker from 'react-native-dropdown-picker';
import {Loader} from '../../components/Loader';
import {BASE_URL} from '../../constants/url';
import {GETNETWORK} from '../../utils/Network';
import {CheckBox} from 'react-native-elements';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import DateTimePickerComponent from './DateTimePickerComponent';

const Edit = ({navigation, route}) => {
  const {itemDataArray, id} = route.params || {};
  const [error, setError] = useState({});
  const [openDropdown, setOpenDropdown] = useState({});
  const [dropdownValues, setDropdownValues] = useState({});
  const [fieldsData, setFieldsData] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [imageData, setImageData] = useState({});
  const [loading, setLoading] = useState(false);
  const [dropdownApiData, setDropdownApiData] = useState({});
  const [selectedDateField, setSelectedDateField] = useState(null);

  // Convert array to an editable object
  const initialData = itemDataArray ? Object.fromEntries(itemDataArray) : {};
  const [formData, setFormData] = useState(initialData);

  // ✅ Load data from AsyncStorage on mount
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('formData');
        if (storedData) {
          setFormData(JSON.parse(storedData));
        }

        // ✅ Update AsyncStorage if new data comes from route.params
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

  // ✅ Clear form state
  const clearFormState = () => {
    setFormData({});
    setError({});
    setOpenDropdown({});
    setDropdownValues({});
    setShowCalendar(false);
    setImageData({});
  };

  // ✅ Fetch Fields API
  const GetFields = async id => {
    const url = `${BASE_URL}forms/template/${id}/fields/`;
    console.log(url, 'url');

    try {
      const result = await GETNETWORK(url, true);
      if (result) {
        console.log('Fields data fetched successfully:', result);
        setFieldsData(result);
      } else {
        console.error('Failed to fetch fields data');
      }
    } catch (error) {
      console.error('Error fetching fields data:', error);
    }
  };

  const fetchFormData = async () => {
    const url = `${BASE_URL}forms/formdata/2/1/4/`;

    try {
      const result = await GETNETWORK(url, true); // Pass `true` to include Authorization header
      console.log(
        'Form data fetched successfully:=====================================================',
        result,
      );

      if (!result) {
        console.error('Failed to fetch form data');
      }
    } catch (error) {
      console.error('Error fetching form data:', error);
    }
  };

  // ✅ Fetch dropdown options based on master_data_code
  const fetchDropdownOptions = async masterCode => {
    setLoading(true);
    try {
      const url = `https://api.tatapowergatepass.epsumlabs.in/forms/template/${masterCode}/data/`;
      console.log('Fetching options from:', url);

      const response = await fetch(url);
      const result = await response.json();

      if (result?.data?.length > 0 && result.data[0]?.data?.length > 0) {
        const apiItems = result.data[0].data.map(item => ({
          label: item.value || item.field_data.label || item.toString(),
          value: item.value || item.toString(),
        }));

        setDropdownApiData(prevData => ({
          ...prevData,
          [masterCode]: apiItems,
        }));
      } else {
        console.warn(
          `No valid data for masterCode ${masterCode}. Using defaults.`,
        );
        setDropdownApiData(prevData => ({
          ...prevData,
          [masterCode]: getDefaultOptions(),
        }));
      }
    } catch (error) {
      console.error('Error fetching dropdown options:', error);
      setDropdownApiData(prevData => ({
        ...prevData,
        [masterCode]: getDefaultOptions(),
      }));
    } finally {
      setLoading(false);
    }
  };

  // ✅ Get default options if API fails or is empty
  const getDefaultOptions = () => [
    {label: '1', value: '1'},
    {label: '2', value: '2'},
    {label: '3', value: '3'},
  ];

  // ✅ Fetch API when fields data is loaded
  useEffect(() => {
    fieldsData.forEach(field => {
      if (field.master_data_code) {
        fetchDropdownOptions(field.master_data_code);
      }
    });
  }, [fieldsData]);

  // ✅ Handle Back Press
  const handleBackPress = useCallback(() => {
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
            try {
              await AsyncStorage.setItem('formData', JSON.stringify(formData));
            } catch (error) {
              console.error('Error saving data before exit:', error);
            }
            navigation.navigate('FormsDataView');
          },
        },
      ],
    );
    return true;
  }, [formData, navigation]);

  // ✅ Handle focus event
  useFocusEffect(
    useCallback(() => {
      GetFields(id);
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      return () => {
        clearFormState();
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      };
    }, [id]),
  );

  // ✅ Handle Text & Other Changes
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

  // ✅ Handle Image Selection
  const handleImageSelect = (key, selectedImage) => {
    if (selectedImage && selectedImage.uri) {
      setImageData(prevData => ({
        ...prevData,
        [key]: selectedImage,
      }));
      handleChange(key, selectedImage.uri);
    }
  };

  const openCamera = async key => {
    const result = await launchCamera({
      mediaType: 'photo',
      saveToPhotos: true,
    });
    if (result.assets && result.assets.length > 0) {
      handleImageSelect(key, result.assets[0]);
    }
  };

  const openGallery = async key => {
    const result = await launchImageLibrary({mediaType: 'photo'});
    if (result.assets && result.assets.length > 0) {
      handleImageSelect(key, result.assets[0]);
    }
  };

  // ✅ Render Dynamic Fields
  const renderField = (field, index) => {
    switch (field.type) {
      case 'text':
      case 'textarea':
        return (
          <TextInput
            style={[styles.input, error[field.label] && styles.inputError]}
            placeholder={field.placeholder || ''}
            value={formData[field.label] || ''}
            onChangeText={val => handleChange(field.label, val)}
            placeholderTextColor={'black'}
            editable={true}
          />
        );

      case 'datetime':
        return (
          <DateTimePickerComponent
            label={field.label || 'Select Date & Time'}
            onDateChange={date => handleChange(field.label, date.toISOString())}
          />
        );

      case 'dropdown':
        const dropdownItems =
          dropdownApiData[field.master_data_code] || getDefaultOptions();

        return (
          <DropDownPicker
            open={openDropdown[field.id] || false}
            value={formData[field.label] || null}
            items={dropdownItems}
            setOpen={open => {
              setOpenDropdown(prev => ({...prev, [field.id]: open}));
            }}
            setValue={callback => {
              const value = callback(formData[field.label]);
              handleChange(field.label, value);
            }}
            placeholder={field.placeholder || `Select ${field.label}`}
          />
        );

      case 'image':
        return (
          <>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={() => openCamera(field.label)}
                style={styles.smallButton}>
                <Text style={styles.buttonText}>Open Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => openGallery(field.label)}
                style={styles.smallButton}>
                <Text style={styles.buttonText}>Open Gallery</Text>
              </TouchableOpacity>
            </View>
            {imageData[field.label]?.uri && (
              <View style={styles.imagePreviewContainer}>
                <Image
                  source={{uri: imageData[field.label]?.uri}}
                  style={styles.imagePreview}
                />
                <Text style={styles.fileText}>
                  {imageData[field.label]?.fileName || 'Captured Image'}
                </Text>
              </View>
            )}
          </>
        );

      case 'checkbox':
        return (
          <CheckBox
            title={field.label}
            checked={formData[field.label] || false}
            onPress={() => handleChange(field.label, !formData[field.label])}
            containerStyle={styles.checkboxContainer}
            checkedColor="#4CAF50"
            uncheckedColor="#aaa"
          />
        );

      case 'date':
        return (
          <>
            <TouchableOpacity
              onPress={() => setShowCalendar(true)}
              style={styles.datePickerButton}>
              <Text style={styles.datePickerText}>
                {formData[field.label] || 'Select Date'}
              </Text>
            </TouchableOpacity>

            <Modal
              visible={showCalendar}
              transparent={true}
              animationType="slide">
              <View style={styles.modalContainer}>
                <View style={styles.calendarContainer}>
                  <Calendar
                    onDayPress={day => {
                      handleChange(field.label, day.dateString);
                      setShowCalendar(false);
                    }}
                    markedDates={{
                      [formData[field.label]]: {
                        selected: true,
                        marked: true,
                        selectedColor: 'blue',
                      },
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => setShowCalendar(false)}
                    style={styles.closeButton}>
                    <Text style={styles.closeText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </>
        );

      default:
        return <Text style={{color: 'red'}}>Unknown Field Type!</Text>;
    }
  };

  // // ✅ Submit Handler
  // const handleSubmit = async () => {
  //   const alertMessage = fieldsData
  //     .map(
  //       field =>
  //         `ID: ${field.id}, ${field.label}: ${formData[field.label] || 'N/A'}`,
  //     )
  //     .join('\n');

  //   // ✅ Log the form data to the console
  //   console.log('Form Submitted Successfully:\n', alertMessage);

  //   // ✅ Clear form state after submission
  //   clearFormState();
  // };

  const handleSubmit = async () => {
    // ✅ Create an object with field labels as keys and corresponding values
    const formObject = fieldsData.reduce((acc, field) => {
      acc[field.id] = formData[field.label] || 'N/A';
      return acc;
    }, {});

    // ✅ Log the form object to the console
    console.log(' Form Submitted Successfully:=============', formObject);

    // console.log('🆔 Field IDs:', fieldsData.map(field => field.id).join(', '));

    clearFormState();
  };

  return (
    <Fragment>
      <MyStatusBar backgroundColor={BRAND} barStyle="light-content" />
      <SafeAreaView style={splashStyles.maincontainer}>
        <TitleHeader
          title="Edit Page"
          left={WIDTH * 0.3}
          onPress={() => navigation.navigate('FormsDataView')}
        />
        <ScrollView
          style={styles.container}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{paddingBottom: 50}}>
          {fieldsData.map((field, index) => (
            <View
              key={field.id}
              style={[
                styles.inputContainer,
                field.type === 'dropdown' && {
                  zIndex: openDropdown[field.id] ? 1000 - index : 1,
                  elevation: openDropdown[field.id] ? 10 : 1,
                },
              ]}>
              <Text style={styles.label}>
                {field.label}
                {field.mandatory && <Text style={{color: 'red'}}>*</Text>}
              </Text>

              {renderField(field, index)}

              {error[field.label] && (
                <Text style={styles.errorText}>{error[field.label]}</Text>
              )}
            </View>
          ))}
        </ScrollView>
        {/* Submit Button */}
        <TouchableOpacity
          onPress={() => {
            handleSubmit();
            fetchFormData();
          }}
          style={styles.submitButton}>
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
    backgroundColor: '#fff',
    marginBottom: 100,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: 'black',
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  smallButton: {
    backgroundColor: BRAND,
    padding: 10,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  imagePreviewContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  imagePreview: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 5,
  },
  fileText: {
    fontSize: 14,
    color: '#666',
  },
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    marginLeft: 0,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#f9f9f9',
  },
  datePickerText: {
    fontSize: 16,
    color: '#555',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
  closeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  submitButton: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: DARKGREEN,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  submitText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
