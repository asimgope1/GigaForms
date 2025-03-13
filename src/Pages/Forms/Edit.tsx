import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {Fragment, useState} from 'react';
import {MyStatusBar, WIDTH} from '../../constants/config';
import TitleHeader from './TitleHeader';
import {DARKGREEN} from '../../constants/color';
import {splashStyles} from '../Splash/SplashStyles';
import {TouchableOpacity} from 'react-native';
import {TextInput} from 'react-native';

const Edit = ({navigation, route}) => {
  const {educationValue} = route.params; // Get the education value passed from FormsDataView
  const [editedText, setEditedText] = useState(educationValue);
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
          <Text style={styles.title}>Edit Higher Education</Text>

          <TextInput
            style={styles.input}
            value={editedText}
            onChangeText={setEditedText} // Update state as user types
            placeholder="Enter Higher Education"
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
              console.log('Updated Education:', editedText);
              navigation.goBack(); // Go back to the previous screen after editing
            }}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Fragment>
  );
};

export default Edit;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, justifyContent: 'center'},
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: DARKGREEN,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {color: 'white', fontSize: 16, fontWeight: 'bold'},
});
