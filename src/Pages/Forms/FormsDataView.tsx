import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  BackHandler,
  Alert,
} from 'react-native';
import React, {Fragment, useCallback, useEffect, useState} from 'react';
import {MyStatusBar, WIDTH} from '../../constants/config';
import TitleHeader from './TitleHeader';
import {BRAND, BRANDBLUE, DARKGREEN} from '../../constants/color';
import {splashStyles} from '../Splash/SplashStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';

const FormsDataView = ({navigation, route}) => {
  const [selectedData, SetselectedData] = useState({});
  // Extracting params with fallback
  const {id = null} = route.params || {};

  useEffect(() => {
    if (id) {
      console.log('Received ID:', id);
      // Perform operations if id is available
    } else {
      console.warn('No ID received. Check navigation params.');
    }
  }, [id]);

  useEffect(() => {
    console.log('Received ID:', id);
    // You can now use 'id' for API calls or other operations
  }, [id]);
  const storeAndSetData = async newData => {
    try {
      if (newData) {
        await AsyncStorage.setItem('selectedData', JSON.stringify(newData));
      }

      // Retrieve stored data from AsyncStorage
      const storedData = await AsyncStorage.getItem('selectedData');

      if (storedData) {
        SetselectedData(JSON.parse(storedData)); // Set state after retrieval
      }
    } catch (error) {
      console.error('Error storing/retrieving data:', error);
    }
  };

  // On component mount, check AsyncStorage first
  useEffect(() => {
    const checkExistingData = async () => {
      const existingData = await AsyncStorage.getItem('selectedData');
      if (existingData) {
        SetselectedData(JSON.parse(existingData)); // Set existing data immediately
      }

      // If new data is coming from route, update storage
      if (route.params?.selectedData) {
        storeAndSetData(route.params.selectedData);
      }
    };

    checkExistingData();
  }, [route.params?.selectedData]);

  // Refresh data when navigating back
  const handleBackPress = useCallback(async () => {
    try {
      await AsyncStorage.setItem('selectedData', JSON.stringify(selectedData));
    } catch (error) {
      console.error('Error saving data before exit:', error);
    }
    navigation.navigate('Forms');
    return true; // Prevent default back action
  }, [selectedData, navigation]);

  useFocusEffect(
    useCallback(() => {
      storeAndSetData(route.params?.selectedData);

      // Add BackHandler event listener
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      // Remove event listener when component unmounts
      return () =>
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    }, [route.params?.selectedData, handleBackPress]),
  );

  useFocusEffect(
    useCallback(() => {
      setIsExpanded(false); // This will collapse the "View More" section when coming back

      storeAndSetData(route.params?.selectedData);
    }, [route.params?.selectedData]),
  );

  // Convert object to key-value array, excluding unwanted fields
  const itemDataArray = Object.entries(selectedData)
    .filter(([key]) => !['template_id', 'user_id', 'all_form_id'].includes(key))
    .map(([key, value]) => (key === 'max' ? ['Stage', value] : [key, value]));

  // Number of fields to show initially
  const initialVisibleFields = 4;
  const [isExpanded, setIsExpanded] = useState(false);
  // Extract highest qualification from selectedData
  const highestQualification =
    Object.entries(selectedData)
      .filter(
        ([key]) =>
          key.toLowerCase().includes('qualification') ||
          key.toLowerCase().includes('education'),
      ) // Filter qualification-related fields
      .map(([key, value]) => value) // Extract values
      .sort() // Sort to find the highest qualification
      .pop() || 'N/A'; // Get the last (highest) value or 'N/A'

  return (
    <Fragment>
      <MyStatusBar backgroundColor={BRAND} barStyle="light-content" />
      <SafeAreaView style={[splashStyles.maincontainer]}>
        {/* Back and Page Header */}
        <TitleHeader
          title="Form Details"
          left={WIDTH * 0.3}
          onPress={
            () => navigation.navigate('Forms')
            // navigation.goBack()
          }
        />

        <ScrollView style={styles.container}>
          <Text style={styles.title}>Form Details</Text>

          {/* Card Component */}
          <View style={styles.card}>
            {/* Edit Button */}
            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                navigation.navigate('Edit', {
                  itemDataArray: itemDataArray,
                  id: id,
                })
              }>
              <Icon name="edit" size={20} color="white" />
            </TouchableOpacity>

            {/* Display User Name */}
            <Text style={[styles.label, {fontWeight: 'bold', fontSize: 16}]}>
              User: {selectedData['UserName'] || 'N/A'}
            </Text>

            {/* Display Last Modified Date */}
            <Text style={[styles.label, {fontSize: 14, color: 'gray'}]}>
              Last Modified:{' '}
              {selectedData?.date_updated
                ? new Date(selectedData.date_updated).toLocaleString()
                : 'N/A'}
            </Text>

            {/* Show limited fields initially */}
            {itemDataArray
              .slice(
                0,
                isExpanded ? itemDataArray.length : initialVisibleFields,
              )
              .map(([label, value], idx) => (
                <View key={idx} style={styles.row}>
                  <Text style={styles.label}>{label}:</Text>
                  <Text style={styles.value}>{value || 'N/A'}</Text>
                </View>
              ))}

            {/* View More / View Less Button */}
            {itemDataArray.length > initialVisibleFields && (
              <Pressable onPress={() => setIsExpanded(!isExpanded)}>
                <Text style={styles.viewMoreText}>
                  {isExpanded ? 'View Less' : 'View More'}
                </Text>
              </Pressable>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

export default FormsDataView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    marginBottom: 100,
    position: 'relative',
  },
  editButton: {
    position: 'absolute',
    top: -20,
    right: 0,
    backgroundColor: BRANDBLUE,
    padding: 8,
    borderRadius: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
    width: '50%',
  },
  value: {
    color: '#666',
    width: '50%',
    textAlign: 'right',
  },
  viewMoreText: {
    marginTop: 10,
    fontSize: 14,
    color: BRANDBLUE,
    textAlign: 'right',
  },
});
