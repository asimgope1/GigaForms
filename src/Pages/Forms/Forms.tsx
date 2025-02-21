import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {Fragment, useEffect, useState} from 'react';
import {HEIGHT, MyStatusBar, WIDTH} from '../../constants/config';
import {splashStyles} from '../Splash/SplashStyles';
import {BLACK, DARKGREEN, LIGHTGRAY, WHITE} from '../../constants/color';
import TitleHeader from './TitleHeader';
import DropdownComponent from './DropdownComponent';
import {IconButton} from 'react-native-paper'; // Import IconButton
import {getObjByKey, storeObjByKey} from '../../utils/Storage';
import {GETNETWORK} from '../../utils/Network';

const Forms = ({navigation, route}) => {
  useEffect(() => {
    console.log('Route params:', route.params);

    const storeData = async () => {
      try {
        if (route.params) {
          await storeObjByKey('routeForms', route.params);
          console.log('Route params saved successfully');
        }
      } catch (error) {
        console.error('Error saving route params:', error);
      }
    };

    storeData();
    GetData();
  }, [route.params]);
  // if the storeage has data saved store it in variables

  const [forms, setForms] = useState({});

  const GetData = async () => {
    try {
      const response = await getObjByKey('routeForms');
      setForms(response);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const data = [
    {label: 'Item 1', value: '1'},
    {label: 'Item 2', value: '2'},
    {label: 'Item 3', value: '3'},
    {label: 'Item 4', value: '4'},
    {label: 'Item 5', value: '5'},
    {label: 'Item 6', value: '6'},
    {label: 'Item 7', value: '7'},
    {label: 'Item 8', value: '8'},
  ];

  const [value, setValue] = useState(null);
  const [searchText, setSearchText] = useState('');

  // Function to handle search button click
  const handleSearch = () => {
    console.log('Searching for:', searchText);
    // Add your search logic here
  };

  // Function to handle delete button click (Resetting the value)
  const handleDelete = () => {
    setSearchText('');
    setValue(null); // Reset the dropdown value
  };

  // Function for the right button click
  const handleRightButtonClick = () => {
    console.log('Right button clicked!');
    navigation.navigate('Forms Templates');

    // Add your custom functionality here
  };

  const DATA = [
    {
      Vendor_Code: 'Item 1',
      Vendor_Name: '1',
      Name: 'Mr. John Doe',
      Gender: 'Male',
      Marital_Status: 'Single',
      Date_of_Birth: '1990-05-15',
      Father_Guardian_Name: 'Mr. Richard Doe',
      Mother_Name: 'Mrs. Jane Doe',
      Communication_Address: '1234 Elm Street, City, State',
      Communication_PIN: '123456',
      Permanent_Address: '5678 Oak Avenue, City, State',
      Permanent_PIN: '654321',
      Divisional_Safety_Officer: 'John Smith',
      Business_Division: 'Engineering',
      Training_Center_Location: 'Downtown Campus',
      Course_Name: 'Safety Management',
      Highest_Qualification: "Master's Degree in Safety Engineering",
    },
    {
      Vendor_Code: 'Item 2',
      Vendor_Name: '2',
      Name: 'Ms. Jane Doe',
      Gender: 'Female',
      Marital_Status: 'Single',
      Date_of_Birth: '1990-05-15',
      Father_Guardian_Name: 'Mr. Richard Doe',
      Mother_Name: 'Mrs. Jane Doe',
      Communication_Address: '1234 Elm Street, City, State',
      Communication_PIN: '123456',
      Permanent_Address: '5678 Oak Avenue, City, State',
      Permanent_PIN: '654321',
      Divisional_Safety_Officer: 'John Smith',
      Business_Division: 'Engineering',
      Training_Center_Location: 'Downtown Campus',
      Course_Name: 'Safety Management',
      Highest_Qualification: "Master's Degree in Safety Engineering",
    },
  ];

  // Create a state to manage which item is expanded
  const [expandedItems, setExpandedItems] = useState({});

  // Function to toggle the expansion state of a particular item
  const toggleExpand = index => {
    setExpandedItems(prevState => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const FormsList = ({item, index, expandedItems, toggleExpand}) => {
    const isExpanded = expandedItems[index];

    return (
      <View style={styless.itemContainer}>
        <View style={styless.rowContainer}>
          <Text style={[styless.label, styless.boldText]}>Vendor Code:</Text>
          <Text style={styless.text}>{item.Vendor_Code}</Text>
        </View>

        <View style={styless.rowContainer}>
          <Text style={[styless.label, styless.boldText]}>Vendor Name:</Text>
          <Text style={styless.text}>{item.Vendor_Name}</Text>
        </View>

        <View style={styless.rowContainer}>
          <Text style={[styless.label, styless.boldText]}>Name:</Text>
          <Text style={styless.text}>{item.Name}</Text>
        </View>

        <View style={styless.rowContainer}>
          <Text style={[styless.label, styless.boldText]}>Gender:</Text>
          <Text style={styless.text}>{item.Gender}</Text>
        </View>

        {/* Add extra fields here if you want more content to be toggled */}
        {isExpanded && (
          <>
            <View style={styless.rowContainer}>
              <Text style={[styless.label, styless.boldText]}>
                Marital Status:
              </Text>
              <Text style={styless.text}>{item.Marital_Status}</Text>
            </View>

            <View style={styless.rowContainer}>
              <Text style={[styless.label, styless.boldText]}>
                Date of Birth:
              </Text>
              <Text style={styless.text}>{item.Date_of_Birth}</Text>
            </View>

            <View style={styless.rowContainer}>
              <Text style={[styless.label, styless.boldText]}>
                Father/Guardian Name:
              </Text>
              <Text style={styless.text}>{item.Father_Guardian_Name}</Text>
            </View>

            <View style={styless.rowContainer}>
              <Text style={[styless.label, styless.boldText]}>
                Mother's Name:
              </Text>
              <Text style={styless.text}>{item.Mother_Name}</Text>
            </View>

            <View style={styless.rowContainer}>
              <Text style={[styless.label, styless.boldText]}>
                Communication Address:
              </Text>
              <Text style={styless.text}>{item.Communication_Address}</Text>
            </View>

            <View style={styless.rowContainer}>
              <Text style={[styless.label, styless.boldText]}>
                Communication PIN:
              </Text>
              <Text style={styless.text}>{item.Communication_PIN}</Text>
            </View>

            <View style={styless.rowContainer}>
              <Text style={[styless.label, styless.boldText]}>
                Permanent Address:
              </Text>
              <Text style={styless.text}>{item.Permanent_Address}</Text>
            </View>

            <View style={styless.rowContainer}>
              <Text style={[styless.label, styless.boldText]}>
                Permanent PIN:
              </Text>
              <Text style={styless.text}>{item.Permanent_PIN}</Text>
            </View>

            <View style={styless.rowContainer}>
              <Text style={[styless.label, styless.boldText]}>
                Divisional Safety Officer:
              </Text>
              <Text style={styless.text}>{item.Divisional_Safety_Officer}</Text>
            </View>

            <View style={styless.rowContainer}>
              <Text style={[styless.label, styless.boldText]}>
                Business Division:
              </Text>
              <Text style={styless.text}>{item.Business_Division}</Text>
            </View>

            <View style={styless.rowContainer}>
              <Text style={[styless.label, styless.boldText]}>
                Training Center Location:
              </Text>
              <Text style={styless.text}>{item.Training_Center_Location}</Text>
            </View>

            <View style={styless.rowContainer}>
              <Text style={[styless.label, styless.boldText]}>
                Course Name:
              </Text>
              <Text style={styless.text}>{item.Course_Name}</Text>
            </View>

            <View style={styless.rowContainer}>
              <Text style={[styless.label, styless.boldText]}>
                Highest Qualification:
              </Text>
              <Text style={styless.text}>{item.Highest_Qualification}</Text>
            </View>
          </>
        )}

        {/* Button to toggle View More */}
        <Pressable onPress={() => toggleExpand(index)}>
          <Text style={styless.viewMoreText}>
            {isExpanded ? 'View Less' : 'View More'}
          </Text>
        </Pressable>

        {/* Buttons */}
        <View style={styless.buttonContainer}>
          <TouchableOpacity
            style={[styless.button, {backgroundColor: 'blue'}]}
            onPress={() => alert('Edit')}>
            <Text style={styless.buttonText}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styless.button, {backgroundColor: 'red'}]}
            onPress={() => alert('Delete')}>
            <Text style={styless.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  console.log('forms', forms);

  return (
    <Fragment>
      <MyStatusBar backgroundColor={DARKGREEN} barStyle="light-content" />
      <SafeAreaView style={[splashStyles.maincontainer]}>
        {/* back and page header */}
        <TitleHeader title="Forms" onPress={() => navigation.goBack()} />

        {/* Subheader */}
        <View style={styless.subheaderContainer}>
          <Text style={styless.subheaderText}>{forms?.formId?.label}</Text>
          <Pressable
            onPress={handleRightButtonClick}
            style={styless.rightButton}>
            <Text style={styless.rightButtonText}>Add</Text>
          </Pressable>
        </View>

        {/* Dropdown and Search */}
        <View style={styless.container}>
          <DropdownComponent data={data} value={value} onChange={setValue} />
          <TextInput
            style={styless.input}
            placeholderTextColor={BLACK}
            placeholder="Search..."
            value={searchText}
            onChangeText={setSearchText}
          />

          <IconButton
            icon="magnify"
            size={24}
            onPress={handleSearch}
            style={styless.iconButton}
          />

          <IconButton
            icon="refresh" // Refresh icon
            size={24}
            onPress={handleDelete}
            style={styless.iconButton}
          />
        </View>

        {/* Form List */}
        <View style={styless.listContainer}>
          <FlatList
            data={DATA}
            renderItem={({item, index}) => (
              <FlatList
                data={DATA}
                renderItem={({item, index}) => (
                  <FormsList
                    item={item}
                    index={index}
                    expandedItems={expandedItems}
                    toggleExpand={toggleExpand}
                  />
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            )}
            keyExtractor={item => item.Vendor_Code}
          />
        </View>
      </SafeAreaView>
    </Fragment>
  );
};

export default Forms;

export const styless = StyleSheet.create({
  subheaderContainer: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subheaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: DARKGREEN,
  },
  rightButton: {
    padding: 8,
    backgroundColor: DARKGREEN,
    borderRadius: 8,
  },
  rightButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    backgroundColor: 'white',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    height: 45,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 16,
    color: BLACK,
  },
  iconButton: {
    backgroundColor: 'white',
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#000',
  },
  boldText: {
    fontWeight: 'bold',
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 14,
    width: WIDTH * 0.95,
    marginBottom: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    margin: 8,
  },
  text: {
    fontSize: 14,
    marginBottom: 8,
    color: '#777', // Lighter shade for values
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    padding: 10,
    borderRadius: 4,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  viewMoreText: {
    color: DARKGREEN,
    fontSize: 16,
    textAlign: 'center',
    padding: 10,
  },
  listContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    marginBottom: 5, // Adjust the spacing between label and value
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: DARKGREEN,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 2,
    borderBottomColor: BLACK,
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: WHITE,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: LIGHTGRAY,
  },
  tableCell: {
    // flex: 1,
    width: WIDTH * 0.25,
    height: HEIGHT * 0.04,

    fontSize: 12,
    color: BLACK,
    textAlign: 'center',
  },
  checkboxContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
});
