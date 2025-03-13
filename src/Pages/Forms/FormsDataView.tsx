import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {Fragment} from 'react';
import {MyStatusBar, WIDTH} from '../../constants/config';
import TitleHeader from './TitleHeader';
import {DARKGREEN} from '../../constants/color';
import {splashStyles} from '../Splash/SplashStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';

const FormsDataView = ({navigation, route}) => {
  const {selectedData} = route.params;

  return (
    <Fragment>
      <MyStatusBar backgroundColor={DARKGREEN} barStyle="light-content" />
      <SafeAreaView style={[splashStyles.maincontainer]}>
        {/* Back and Page Header */}
        <TitleHeader
          title="Forms Templates"
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
              onPress={() => {
                navigation.navigate('FormsTemplates');
              }}>
              <Icon name="edit" size={20} color="white" />
            </TouchableOpacity>

            {/* Form Data */}
            <View style={styles.row}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{selectedData.Name}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Highest Qualification:</Text>
              <Text style={styles.value}>
                {selectedData.Highest_Qualification}
              </Text>
            </View>
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
});
