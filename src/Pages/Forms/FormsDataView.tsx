import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, {Fragment, useState} from 'react';
import {MyStatusBar, WIDTH} from '../../constants/config';
import TitleHeader from './TitleHeader';
import {DARKGREEN} from '../../constants/color';
import {splashStyles} from '../Splash/SplashStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';

const FormsDataView = ({navigation, route}) => {
  const {selectedData} = route.params;
  console.log('selectedData--------------', selectedData);

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
      <MyStatusBar backgroundColor={DARKGREEN} barStyle="light-content" />
      <SafeAreaView style={[splashStyles.maincontainer]}>
        {/* Back and Page Header */}
        <TitleHeader
          title="Form Details"
          left={WIDTH * 0.3}
          onPress={() => navigation.navigate('Forms')}
        />

        <ScrollView style={styles.container}>
          <Text style={styles.title}>Form Details</Text>

          {/* Card Component */}
          <View style={styles.card}>
            {/* Edit Button */}
            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                navigation.navigate('Edit', {highestQualification})
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
    marginBottom: 20,
    position: 'relative',
  },
  editButton: {
    position: 'absolute',
    top: -20,
    right: 0,
    backgroundColor: DARKGREEN,
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
    color: 'blue',
    textAlign: 'right',
  },
});
