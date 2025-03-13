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
import {BASE_URL} from '../../constants/url';
import {Loader} from '../../components/Loader';

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
  const [loading, SetLoading] = useState(false);
  const [Data, SetData] = useState();

  const GetData = async () => {
    try {
      const response = await getObjByKey('routeForms');
      setForms(response);
      console.log('hee', response.formId.id);
      GetListData(response?.formId?.id);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const GetListData = async (id: number) => {
    console.log('Fetching data for id:', id);
    const i = id + 1;

    SetLoading(true);

    const url = `https://api.tatapowergatepass.epsumlabs.in/forms/viewdata/${id}/data/`;

    try {
      const result = await GETNETWORK(url, true);

      if (result.data) {
        SetLoading(false);
        console.log('Data fetched successfully:', result);
        SetData(result.data); // Ensure SetData is properly defined in your component
      } else {
        SetLoading(false);
        SetData('');
        console.error('Failed to fetch data');
      }
    } catch (error) {
      SetLoading(false);
      console.error('Error fetching data:', error);
    }

    // SetLoading(false);
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
    // console.log('Item Data:', item);
    const isExpanded = expandedItems[index];
    const itemDataArray = Object.entries(item)
      .filter(
        ([key]) => !['template_id', 'user_id', 'all_form_id'].includes(key),
      )
      .map(([key, value]) => (key === 'max' ? ['Stage', value] : [key, value]));

    // Number of fields to show initially
    const initialVisibleFields = 4;

    // Convert object to an array of key-value pairs

    return (
      <View style={styless.itemContainer}>
        {/* User Name */}
        <Text
          style={[
            styless.dateText,
            {fontWeight: 'bold', fontSize: 16, color: 'gray'},
          ]}>
          User: {item['UserName'] || 'N/A'}
        </Text>

        {/* Last Modified (Assuming there's a date field, update accordingly) */}
        <Text style={[styless.dateText, {color: 'gray', fontSize: 14}]}>
          Last Modified:{' '}
          {item?.date_updated
            ? new Date(item.date_updated).toLocaleString()
            : 'N/A'}
        </Text>

        {/* Show only limited fields initially */}
        {itemDataArray
          .slice(0, isExpanded ? itemDataArray.length : initialVisibleFields)
          .map(([label, value], idx) => (
            <View key={idx} style={styless.rowContainer}>
              <Text style={[styless.label, styless.boldText]}>{label}:</Text>
              <Text style={styless.text}>{value || 'N/A'}</Text>
            </View>
          ))}

        {/* View More / View Less */}
        {itemDataArray.length > initialVisibleFields && (
          <Pressable onPress={() => toggleExpand(index)}>
            <Text style={styless.viewMoreText}>
              {isExpanded ? 'View Less' : 'View More'}
            </Text>
          </Pressable>
        )}

        {/* Buttons */}
        <View style={styless.buttonContainer}>
          <TouchableOpacity
            style={[styless.button, {backgroundColor: 'blue'}]}
            onPress={() => alert('View Details')}>
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

          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 10,
              }}>
              <IconButton
                icon="magnify"
                size={24}
                onPress={handleSearch}
                style={{margin: 0}}
              />
            </View>
            <View
              style={{
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 10,
              }}>
              <IconButton
                icon="refresh"
                size={24}
                onPress={handleDelete}
                style={{margin: 0}}
              />
            </View>
          </View>
        </View>

        {/* Form List */}
        <View style={styless.listContainer}>
          <FlatList
            data={Data}
            renderItem={({item, index}) => (
              <FormsList
                item={item}
                index={index}
                expandedItems={expandedItems}
                toggleExpand={toggleExpand}
              />
            )}
            ListEmptyComponent={
              <View style={styless.emptyList}>
                <Text style={styless.emptyListText}>No Data</Text>
              </View>
            }
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </SafeAreaView>
      <Loader visible={loading} />
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
    height: 50,
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
    padding: 10,
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
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  button: {
    padding: 10,
    margin: 5,
    borderRadius: 4,
    width: '40%',
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
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    color: '#777', // Lighter shade for values
  },
  emptyListText: {
    fontSize: 14,
    color: BLACK,
  },
});
