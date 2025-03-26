import {
  Alert,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Modal,
} from 'react-native';
import React, {Fragment, useCallback, useEffect, useState} from 'react';
import TitleHeader from './TitleHeader';
import {MyStatusBar, WIDTH} from '../../constants/config';
import {BRAND, DARKGREEN} from '../../constants/color';
import {splashStyles} from '../Splash/SplashStyles';
import {useFocusEffect} from '@react-navigation/native';
import {Loader} from '../../components/Loader';
import DropDownPicker from 'react-native-dropdown-picker';
import {Calendar} from 'react-native-calendars';
import {GETNETWORK} from '../../utils/Network';
import {BASE_URL} from '../../constants/url';
import DateTimePickerComponent from './DateTimePickerComponent';
import {CheckBox} from 'react-native-elements';
import {Image} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {getObjByKey} from '../../utils/Storage';

const FormsTemplates = ({navigation, route}) => {
  const [formData, setFormData] = useState({});
  const [fieldsData, setFieldsData] = useState([]);
  const [error, setError] = useState({});
  const [openDropdown, setOpenDropdown] = useState({});
  const [dropdownValues, setDropdownValues] = useState({});
  const [showCalendar, setShowCalendar] = useState(false);
  const [imageData, setImageData] = useState({});
  const [loading, setLoading] = useState(false);
  const [dropdownApiData, setDropdownApiData] = useState({});
  const [token, SetToken] = useState();
  const [templateId, setTemplateId] = useState();

  const clearFormState = () => {
    setFormData({});
    setError({});
    setOpenDropdown({});
    setDropdownValues({});
    setShowCalendar(false);
    setImageData({});
  };

  const GetFields = async id => {
    setTemplateId(id);
    const url = `${BASE_URL}forms/template/${id}/fields/`;

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

  useEffect(() => {
    clearFormState();
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      const {data, id} = route.params;

      const RetriveData = async () => {
        const storedData = await getObjByKey('loginResponse');
        // console.log('object storedData', storedData.access);
        if (storedData) {
          SetToken(storedData?.access);
        }
      };
      console.log('id: ' + id);
      GetFields(id);
      setFormData(data[0] || {});
      setError({});
      setOpenDropdown({});
      setDropdownValues({});
      RetriveData();

      return () => {
        clearFormState();
        RetriveData();
      };
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
      const selectedImage = result.assets[0];
      handleImageSelect(key, selectedImage);
      Alert.alert('Image Captured', `File: ${selectedImage.uri}`);
    } else {
      console.warn('No image captured!');
    }
  };

  const openGallery = async key => {
    const result = await launchImageLibrary({mediaType: 'photo'});
    if (result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      handleImageSelect(key, selectedImage);
      Alert.alert('Image Selected', `File: ${selectedImage.uri}`);
    } else {
      console.warn('No image selected!');
    }
  };

  // ✅ Fetch dropdown options based on master_data_code
  // ✅ Fetch dropdown options without default fallback
  // ✅ Fetch all dropdown data in parallel and update the state
  const fetchAllDropdownOptions = async fields => {
    setLoading(true);

    const fetchPromises = fields
      .filter(field => field.master_data_code)
      .map(async field => {
        const url = `${BASE_URL}forms/template/${field.master_data_code}/data/`;
        try {
          const myHeaders = new Headers();
          myHeaders.append('Authorization', `Bearer ${token}`);
          const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
          };

          const response = await fetch(url, requestOptions);
          const result = await response.json();

          if (result?.data?.length > 0 && result.data[0]?.data?.length > 0) {
            const apiItems = result.data[0].data.map(item => ({
              label: item.value || item.field_data.label || item.toString(),
              value: item.value || item.toString(),
            }));
            return {masterCode: field.master_data_code, data: apiItems};
          } else {
            return {masterCode: field.master_data_code, data: []};
          }
        } catch (error) {
          console.error(
            `Error fetching dropdown options for ${field.master_data_code}:`,
            error,
          );
          return {masterCode: field.master_data_code, data: []};
        }
      });

    try {
      const results = await Promise.all(fetchPromises);

      // ✅ Consolidate dropdown data after all fetches complete
      const newDropdownData = results.reduce((acc, item) => {
        acc[item.masterCode] = item.data;
        return acc;
      }, {});

      // ✅ Update state with dropdown data
      setDropdownApiData(newDropdownData);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch API when fields data is loaded
  // ✅ Fetch dropdown data in parallel when fieldsData is available
  useEffect(() => {
    if (fieldsData.length > 0) {
      fetchAllDropdownOptions(fieldsData);
    }
  }, [fieldsData]);

  const renderField = (field, index) => {
    // console.log(field.values, 'fieldfieldfieldfield', field.id);
    // console.log(field.master_data_code, 'master_data_code');

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
        let dropdownItems = [];
        if (loading) {
          return (
            <View
              style={{
                marginBottom: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Loader visible={true} />
            </View>
          );
        }

        // Convert comma-separated string to array if necessary
        if (typeof field.values === 'string' && field.values.trim() !== '') {
          dropdownItems = field.values.split(',').map(item => ({
            label: item.trim(),
            value: item.trim(),
          }));
        } else if (
          (!field.values || field.values.length === 0) &&
          field.master_data_code &&
          dropdownApiData[field.master_data_code]
        ) {
          dropdownItems = dropdownApiData[field.master_data_code].map(item => ({
            label: item.label || item.value || item.toString(),
            value: item.value || item.toString(),
          }));
        }

        // If no valid dropdown items, show error or fallback
        if (dropdownItems.length === 0) {
          console.log(field.master_data_code, 'master_data_code');
          return (
            <Text style={{color: 'red', marginBottom: 10}}>
              No options available for {field.label}
            </Text>
          );
        }

        return (
          <View
            style={{
              zIndex: openDropdown[field.id] ? 1000 - index : 1,
              elevation: openDropdown[field.id] ? 10 : 1,
            }}>
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
              containerStyle={[styles.dropdownContainer]}
              style={styles.dropdown}
              modalProps={{animationType: 'fade'}} // Fix for iOS
            />
          </View>
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
                  resizeMode="cover"
                />
                <Text style={styles.fileText}>
                  Selected:{' '}
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
            textStyle={styles.checkboxLabel}
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

  const handleSubmit = () => {
    const newErrors = {};

    // ✅ Validate mandatory fields
    fieldsData.forEach(field => {
      if (field.mandatory && !formData[field.label]?.toString().trim()) {
        newErrors[field.label] = `${field.label} is required!`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    // ✅ Prepare the form data in the required format
    let formDetails = fieldsData.map(field => {
      let value = formData[field.label] || 'N/A'; // Use form data or 'N/A' if not present

      // If the value is boolean, convert it to a string
      if (typeof value === 'boolean') {
        value = value.toString();
      }

      return {
        value: value, // The value to be sent
        field: field.id, // The field ID
      };
    });

    // Create the payload with 'data' and 'template'
    const payload = {
      data: formDetails, // The field data array
      template: templateId || 'N/A', // Include templateId, fallback to 'N/A' if not available
    };

    console.log('Payload:', payload); // Log the payload to the console

    // Set up headers for the API request
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${token}`);

    // Define the raw payload (this can be dynamically updated with your data)
    const raw = JSON.stringify(payload);

    // Define the request options
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    setLoading(true);

    // Make the API call with fetch
    fetch(`${BASE_URL}forms/data/`, requestOptions)
      .then(response => response.json()) // Handle JSON response
      .then(result => {
        console.log('API Response:', result); // Log the result
        setLoading(false);

        // Check if the response indicates success
        if (result && result.id) {
          // Handle successful submission here (no alert)
          console.log('Form submitted successfully!', result);
          setLoading(false);
          navigation.navigate('Forms'); // Navigate to Forms page
          clearFormState(); // Clear the form
        } else {
          // Handle failure if needed
          console.error('Submission Failed:', result);
          setLoading(false);
        }
      })
      .catch(error => {
        console.error('Error during API call:', error); // Handle any errors
        setLoading(false);
      });
  };

  return (
    <Fragment>
      <MyStatusBar backgroundColor={BRAND} barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <SafeAreaView style={splashStyles.maincontainer}>
          <TitleHeader
            title="Forms Templates"
            left={WIDTH * 0.3}
            onPress={() => navigation.navigate('Forms')}
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

          <TouchableOpacity
            onPress={() => {
              handleSubmit();
            }}
            style={styles.submitButton}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </KeyboardAvoidingView>
      <Loader visible={false} />
    </Fragment>
  );
};

export default FormsTemplates;

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
  input: {
    height: 50,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#333',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  inputError: {
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
    marginBottom: 10,
  },
  submitText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  dropdownContainer: {
    height: 50,
    zIndex: 10,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  smallButton: {
    flex: 0.48,
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imagePreviewContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  fileText: {
    fontSize: 14,
    color: '#666',
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  datePickerText: {
    color: 'black',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  calendarContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  checkboxContainer: {
    backgroundColor: '#fff',
    borderWidth: 0,
    marginVertical: 8,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
});
