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

const Edit = ({navigation, route}) => {
  const {itemDataArray} = route.params || {};

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

  // Save data to AsyncStorage when submitting
  const handleSubmit = async () => {
    try {
      await AsyncStorage.setItem('formData', JSON.stringify(formData));
      Alert.alert('Changes Saved!', 'Your form has been updated successfully.');
      console.log('Updated Data:', formData);
      navigation.navigate('Forms', {updatedData: formData}); // Pass updated data back
    } catch (error) {
      console.error('Error saving data:', error);
    }
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
        <ScrollView contentContainerStyle={styles.container}>
          {Object.entries(formData).map(([key, value], index) => (
            <View key={index} style={styles.inputContainer}>
              <Text style={styles.label}>{key.replace(/_/g, ' ')}:</Text>
              <TextInput
                style={styles.input}
                placeholder={key}
                value={value}
                onChangeText={text => handleChange(key, text)}
                placeholderTextColor="grey"
              />
            </View>
          ))}

          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitText}>Save Changes</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

export default Edit;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#FFF',
    fontSize: 16,
    color: 'black',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
