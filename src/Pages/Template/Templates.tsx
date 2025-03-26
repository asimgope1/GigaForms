import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  FlatList,
  ScrollView,
  Button,
  TouchableOpacity,
  Modal,
  Alert,
  RefreshControl,
} from 'react-native';
import React, {Fragment, useCallback, useEffect, useState} from 'react';
import {IconButton} from 'react-native-paper';
import {HEIGHT, MyStatusBar, WIDTH} from '../../constants/config';
import {
  BLACK,
  DARKGREEN,
  GREEN,
  GRAY,
  WHITE,
  BRAND,
} from '../../constants/color';
import TitleHeader from '../Forms/TitleHeader';
import {GETNETWORK} from '../../utils/Network';
import {BASE_URL} from '../../constants/url';
import {getObjByKey, storeObjByKey} from '../../utils/Storage';
import DropdownComponent from '../Forms/DropdownComponent';
import {splashStyles} from '../Splash/SplashStyles';
import {styless} from '../Forms/Forms';
import {CheckBox} from 'react-native-elements';
import {Loader} from '../../components/Loader';
import {Calendar} from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useFocusEffect} from '@react-navigation/native';

const Templates = ({navigation, route}) => {
  const [templates, setTemplates] = useState({});
  const [value, setValue] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [templateData, setTemplateData] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [tableHeaders, setTableHeaders] = useState([]);
  const [actions, setActions] = useState([]);
  const [isAnyChecked, setIsAnyChecked] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFieldData, setSelectedFieldData] = useState(null);
  const [comment, setComment] = useState('');
  const [userDetails, setUserDetails] = useState<any>(null); // State for user details
  const [showCalendar, setShowCalendar] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState({});
  const [token, SetToken] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [formData, setFormData] = useState({});

  const [filteredData, setFilteredData] = useState(templateData);
  const [filterField, setFilterField] = useState([]); // Store filter field from GetTemplateData
  const [fieldLabels, setFieldLabels] = useState([]); // Store field labels from handleActionPress
  const [matchedFieldData, setMatchedFieldData] = useState([]); // ✅ Store matched data

  const [TemplateID, SetTemplateId] = useState('');

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [selectedTime, setSelectedTime] = useState(
    new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
  );
  const [showTimePicker, setShowTimePicker] = useState(false);
  const clearState = () => {
    const currentDate = new Date();
    setSelectedDate(currentDate.toISOString().split('T')[0]); // Format: YYYY-MM-DD

    const formattedTime = currentDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    setSelectedTime(formattedTime); // Format: HH:mm:ss

    setComment('');
    setShowCalendar(false);
    setShowTimePicker(false);
    closeModal(); // Close the modal after resetting
  };

  const getProfileData = async () => {
    setLoading(true);
    try {
      const url = `${BASE_URL}user/profile/`;
      const response = await GETNETWORK(url, true); // Assuming GETNETWORK is an async function
      console.log('responseprofile', response.name);
      setLoading(false); // Hide loader after successful API call
      setUserDetails(response); // Set user details from API response
    } catch (error) {
      setLoading(false);
      console.error('Error fetching profile data:', error);
      alert('Failed to load profile data.');
    }
  };

  useEffect(() => {
    // Fetch profile data on initial render
    getProfileData();
    console.log('route?.params0', route?.params);

    const RetriveData = async () => {
      const storedData = await getObjByKey('loginResponse');
      // console.log('object storedData', storedData.access);
      if (storedData) {
        SetToken(storedData?.access);
      }
    };

    // Fetch template data immediately on initial render
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log('route?.params1', route?.params);
        // ✅ Store route params if available
        if (route?.params) {
          await storeObjByKey('routeTemplates', route.params);
        }

        // ✅ Fetch stored template data
        const storedData = await getObjByKey('routeTemplates');
        if (storedData) {
          setTemplates(storedData);

          // ✅ Check if tamplateId exists correctly
          if (storedData?.tamplateId?.id) {
            console.log(
              'Fetching template with ID:',
              storedData?.tamplateId?.id,
            );
            GetTemplateData(storedData?.tamplateId?.id);
          } else {
            console.log('No template ID found in stored data');
          }
        } else {
          console.log('No stored data found');
        }
      } catch (error) {
        console.error('Error fetching or storing data:', error);
      } finally {
        setLoading(false);
      }
    };

    RetriveData();

    fetchData();
  }, [navigation, route.params]); // ✅ Empty dependency array to run only once

  const GetTemplateData = async id => {
    setLoading(true);
    console.log('id', id);
    resetSelectedItems();

    try {
      const url = `${BASE_URL}forms/custumlink/${id}/data/`;
      const response = await GETNETWORK(url, true);

      console.log('object', response);
      if (response?.filter_field) {
        setFilterField(response.filter_field); // ✅ Save to state
        console.log(
          'Filter Field:**************************************',
          response.filter_field,
        );
      } else {
        setFilterField([]); // ✅ Reset if no filter_field found
        console.log('No filter_field found in response.');
      }

      if (response?.results?.length > 0) {
        setTemplateData(response.results);
        setTableHeaders(Object.keys(response.results[0]));

        if (response?.State_Action?.length > 0) {
          setActions(response.State_Action);
        } else {
          setActions([]);
        }
      } else {
        setTemplateData([]);
        setTableHeaders([]);
        setActions([]);
      }
    } catch (error) {
      console.error('Error fetching template data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCheckbox = (index, item) => {
    setCheckedItems(prevCheckedItems => {
      const newCheckedItems = {...prevCheckedItems};
      if (newCheckedItems[index]) {
        delete newCheckedItems[index];
      } else {
        newCheckedItems[index] = item;
      }
      const anySelected = Object.keys(newCheckedItems).length > 0;
      setIsAnyChecked(anySelected);
      return newCheckedItems;
    });
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedFieldData(null);
    resetSelectedItems();
    setComment('');
  };

  const updateForm = () => {
    console.log('selectedFieldData', selectedFieldData);
    console.log('actions', actions);

    // ✅ Map through fields dynamically and extract key-value pairs
    const mappedData = selectedFieldData?.fields?.flatMap(item =>
      Object.keys(item).map(key => {
        return {
          field: key, // Key as 'field'
          value: item[key] || '', // Corresponding value
        };
      }),
    );

    // ✅ Extract all_form_id dynamically
    const allFormIds = selectedFieldData?.fields
      ?.map(item => item?.all_form_id)
      .filter(id => id);

    console.log('All Form IDs:', allFormIds);
    console.log('sTemplateID', TemplateID);

    // ✅ Get matched field IDs (from state)
    console.log(
      'Matched Field IDs for update:55555555555555555555555555555555555',
      matchedFieldIds,
    );

    // ✅ Prepare request body
    let requestBody = {
      data: matchedFieldIds, // ✅ Add matched IDs to request body
      template: TemplateID,
      is_delete: false,
      lock_status: 'N',
      all_form_id: allFormIds,
    };

    console.log('updateForm-------called', requestBody);

    // ✅ Prepare request headers
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${token}`);

    // ✅ Stringify request body
    const raw = JSON.stringify(requestBody);
    console.log('updateForm-------called----raw', raw);

    // ✅ Define request options
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    console.log('update form requestOptions', requestOptions);

    // ✅ API call to update form
    fetch(`${BASE_URL}forms/data/bulkupdate`, requestOptions)
      .then(async response => {
        const result = await response.json();
        console.log('updated successfully----called', result);
        handelUpdateComment(comment, allFormIds, actions[0].id);

        // ✅ Close the modal after successful update
        closeModal();
      })
      .catch(err => {
        console.error('Error updating form:', err);
      });
  };

  const handelUpdateComment = (a, b, c) => {
    console.log('handelUpdateComment-------called', a, b, c);

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${token}`);

    const raw = JSON.stringify({
      comment: comment,
      form_data: b,
      transition: c,
    });
    console.log('handelUpdateComment------raw', raw);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };
    console.log('handelUpdateComment requestoptios', requestOptions);

    fetch(`${BASE_URL}workflow/action/?bulk=true`, requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log('handelUpdateComment.  successfully----called', result);
        Alert.alert('Successfully updated', 'Comment added successfully', [
          {text: 'OK'},
        ]);
        GetTemplateData(TemplateID);
        resetSelectedItems();

        closeModal();
      })
      .catch(error => console.error(error));
  };
  const handleActionPress = action => {
    const selectedItems = Object.values(checkedItems);

    if (selectedItems.length > 0) {
      setSelectedFieldData({fields: selectedItems});
      setIsModalVisible(true);

      // ✅ Save field labels in state
      if (action?.fields?.length > 0) {
        const labels = action.fields.map(field => field.label);
        setFieldLabels(labels);
        console.log('Field Labels Saved:', labels);

        // ✅ Match field labels with filterField and extract matched IDs
        const matchedData = action.fields
          .filter(field =>
            filterField?.some(item => item.label === field.label),
          )
          .map(field => {
            const matchedField = filterField.find(
              item => item.label === field.label,
            );
            return {
              id: matchedField?.id || '', // ✅ Matched field ID
              label: field.label, // ✅ Label
              value: field.value || '', // ✅ Value (use field.value or empty if not found)
            };
          });

        setMatchedFieldData(matchedData); // ✅ Save matched data in state
        console.log('Matched Field Data for Modal: 🚀🚀🚀', matchedData);
      } else {
        setFieldLabels([]);
        setMatchedFieldData([]);
        console.log('No fields found in State_Action.');
      }
    } else {
      alert('Please select an item to proceed.');
    }
  };

  const onTimeChange = (event, selected) => {
    setShowTimePicker(Platform.OS === 'ios'); // Show only for iOS
    if (selected) {
      const formattedTime = selected.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      setSelectedTime(formattedTime);
    }
  };
  const handleViewDetails = item => {
    setSelectedRowData(item); // Set the selected row data
    setModalVisible(true); // Open modal
  };

  const handleSearch = () => {
    if (!value || !searchText) {
      alert('Please select a header and enter search text.');
      return;
    }

    setLoading(true); // ✅ Show Loader

    // Filter logic: Case-insensitive comparison
    const filtered = templateData.filter(item =>
      item[value]?.toString().toLowerCase().includes(searchText.toLowerCase()),
    );

    if (filtered.length === 0) {
      alert('No data found for the given search!');
    }

    setFilteredData(filtered);
    setLoading(false); // ✅ Hide Loader after search completes
  };

  const handleReset = () => {
    setLoading(true); // ✅ Show Loader

    setSearchText('');
    setValue('');
    setFilteredData(templateData); // ✅ Reset to original data
    setLoading(false); // ✅ Hide Loader after reset completes
  };
  const handleRefresh = async () => {
    console.log('Refreshing data...');
    setRefreshing(true); // ✅ Show loader while refreshing

    try {
      const storedData = await getObjByKey('routeTemplates');
      if (storedData && storedData?.tamplateId?.id) {
        console.log('Refreshing template with ID:', storedData?.tamplateId?.id);
        await GetTemplateData(storedData?.tamplateId?.id); // ✅ Refresh data by fetching template again
      } else {
        console.log('No template ID found for refresh');
      }
    } catch (error) {
      console.error('Error while refreshing data:', error);
    } finally {
      setRefreshing(false); // ✅ Hide loader after refresh
    }
  };

  const resetSelectedItems = () => {
    setCheckedItems({}); // ✅ Clear selected checkboxes
    setIsAnyChecked(false); // ✅ Reset 'isAnyChecked'
  };

  return (
    <Fragment>
      <MyStatusBar backgroundColor={BRAND} barStyle="light-content" />
      <SafeAreaView style={splashStyles.maincontainer}>
        <TitleHeader
          title="Template Data View"
          onPress={() => navigation.goBack()}
        />

        {/* Subheader */}
        <View style={styless.subheaderContainer}>
          <Text style={styless.subheaderText}>
            {loading
              ? 'Loading...'
              : templates?.tamplateId?.template_name || 'No Template Found'}
          </Text>
        </View>
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }>
          {/* Search & Filter Section */}
          <View style={styless.container}>
            {/* Dropdown with Table Headers */}
            <DropdownComponent
              data={tableHeaders.map(header => ({
                label: header,
                value: header,
              }))}
              value={value}
              onChange={selected => {
                setValue(selected); // Set the selected header in the dropdown
              }}
            />

            {/* TextInput for Search Term */}
            <TextInput
              style={[styless.input, {marginVertical: 10, borderColor: GRAY}]}
              placeholder="Enter ..."
              placeholderTextColor={BLACK}
              value={searchText}
              onChangeText={setSearchText}
            />

            {/* Search and Reset Buttons */}
            <View style={{flexDirection: 'row', marginBottom: 10}}>
              <IconButton
                icon="magnify"
                size={24}
                onPress={handleSearch} // Trigger Search on Press
                style={styless.iconButton}
              />
              <IconButton
                icon="refresh"
                size={24}
                onPress={handleReset} // Reset the search and filters
                style={styless.iconButton}
              />
            </View>
          </View>

          {/* Table Section */}
          {/* Table Section */}
          <ScrollView horizontal>
            <View style={{minWidth: tableHeaders.length * WIDTH * 0.25}}>
              {/* Table Header */}
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: '#e0e0e0',
                  borderBottomWidth: 2,
                  borderColor: '#ccc',
                  paddingVertical: 12,
                  paddingHorizontal: 5,
                }}>
                {/* Select Column Header */}
                <View
                  style={{
                    width: 70,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 12,
                    borderRightWidth: 1,
                    borderColor: '#ccc',
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: 'bold',
                      color: '#333',
                      textAlign: 'center',
                    }}>
                    Select
                  </Text>
                </View>

                {/* Dynamic Table Headers */}
                {tableHeaders.map((header, idx) => (
                  <View
                    key={idx}
                    style={{
                      width: WIDTH * 0.25,
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingVertical: 12,
                      borderRightWidth: idx === tableHeaders.length - 1 ? 0 : 1,
                      borderColor: '#ccc',
                    }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                        color: '#333',
                        textAlign: 'center',
                        flexWrap: 'wrap',
                      }}
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      {header}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Table Data */}
              <FlatList
                data={filteredData.length > 0 ? filteredData : templateData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => (
                  <View
                    style={{
                      flexDirection: 'row',
                      backgroundColor:
                        index % 2 === 0 ? '#fff' : 'rgba(0,0,0,0.05)',
                      paddingVertical: 5,
                      borderBottomWidth: 1,
                      borderColor: '#ccc',
                    }}>
                    {/* Checkbox & Eye Icon */}
                    <View
                      style={{
                        width: 70,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        paddingVertical: 5,
                        borderRightWidth: 1,
                        borderColor: '#ccc',
                      }}>
                      <CheckBox
                        checked={!!checkedItems[index]}
                        onPress={() => toggleCheckbox(index, item)}
                        containerStyle={{
                          padding: 0,
                          marginRight: 5,
                        }}
                      />
                      <TouchableOpacity onPress={() => handleViewDetails(item)}>
                        <FontAwesome name="eye" size={22} color={'blue'} />
                      </TouchableOpacity>
                    </View>

                    {/* Data Cells */}
                    {tableHeaders.map((header, idx) => (
                      <View
                        key={`${index}-${idx}`}
                        style={{
                          width: WIDTH * 0.25,
                          justifyContent: 'center',
                          alignItems: 'center',
                          paddingVertical: 12,
                          borderRightWidth:
                            idx === tableHeaders.length - 1 ? 0 : 1,
                          borderColor: '#ccc',
                        }}>
                        <Text
                          style={{
                            fontSize: 12,
                            color: '#333',
                            textAlign: 'center',
                            flexWrap: 'wrap',
                          }}
                          numberOfLines={1}
                          ellipsizeMode="tail">
                          {item?.[header] ?? 'N/A'}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            </View>
          </ScrollView>

          {/* Action Buttons */}
          {/* <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginVertical: HEIGHT * 0.07,
            }}>
            {actions.map(action => (
              <TouchableOpacity
                key={action.id}
                onPress={() => handleActionPress(action)}
                disabled={!isAnyChecked}
                style={{
                  backgroundColor:
                    action.properties === 'btn btn-success' ? GREEN : 'red',
                  padding: 12,
                  marginHorizontal: 5,
                  borderRadius: 8,
                  opacity: isAnyChecked ? 1 : 0.5,
                }}>
                <Text style={{color: '#fff', fontWeight: 'bold'}}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View> */}

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}>
              <View
                style={{
                  width: '90%',
                  backgroundColor: '#fff',
                  padding: 20,
                  borderRadius: 10,
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    marginBottom: 15,
                    textAlign: 'center',
                  }}>
                  Row Details
                </Text>

                <ScrollView
                  style={{
                    maxHeight: HEIGHT * 0.5,
                  }}>
                  {Object.keys(selectedRowData).map((key, idx) => (
                    <View
                      key={idx}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingVertical: 5,
                        borderBottomWidth: 1,
                        borderColor: '#eee',
                      }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: 'bold',
                          color: '#333',
                        }}>
                        {key.replace(/_/g, ' ')}:
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: '#555',
                          flexShrink: 1,
                          textAlign: 'right',
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail">
                        {selectedRowData[key]?.toString() || 'N/A'}
                      </Text>
                    </View>
                  ))}
                </ScrollView>

                {/* Close Button */}
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={{
                    marginTop: 15,
                    backgroundColor: '#ff4d4d',
                    paddingVertical: 10,
                    borderRadius: 8,
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: 16,
                    }}>
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginVertical: HEIGHT * 0.05,
            paddingVertical: 12,
            backgroundColor: '#fff',
          }}>
          {actions.map(action => (
            <TouchableOpacity
              key={action.id}
              onPress={() => handleActionPress(action)}
              disabled={!isAnyChecked}
              style={{
                backgroundColor:
                  action.properties === 'btn btn-success' ? GREEN : 'red',
                padding: 12,
                marginHorizontal: 5,
                borderRadius: 8,
                opacity: isAnyChecked ? 1 : 0.5,
              }}>
              <Text style={{color: '#fff', fontWeight: 'bold'}}>
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>

      {/* Modal for Selected Item Details */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              backgroundColor: WHITE,
              borderRadius: 12,
              padding: 20,
              width: '85%',
            }}>
            <ScrollView
              style={{
                maxHeight: 400,
                marginBottom: 15,
                backgroundColor: '#f9f9f9',
                padding: 10,
                borderRadius: 8,
              }}>
              {/* Loop through State_Action.fields */}
              {actions[0]?.fields?.map((field, index) => {
                // Check if default is "Current User"
                const defaultValue =
                  field.default === 'Current User' && userDetails
                    ? userDetails.name
                    : field.default || '';

                console.log('defaultValue', defaultValue);

                return (
                  <View key={index} style={{marginBottom: 12}}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: BLACK,
                        marginBottom: 5,
                      }}>
                      {field.label}:
                    </Text>

                    {/* Render Text Field */}
                    {field.type === 'text' && (
                      <TextInput
                        style={{
                          width: '100%',
                          height: 50,
                          borderWidth: 1,
                          borderColor: GRAY,
                          borderRadius: 8,
                          padding: 10,
                          backgroundColor: field.disabled ? '#f5f5f5' : '#fff',
                          color: BLACK,
                        }}
                        placeholder={field.placeholder || 'Enter value'}
                        placeholderTextColor={GRAY}
                        value={formData[field.label] || defaultValue}
                        onChangeText={text =>
                          setFormData({...formData, [field.label]: text})
                        }
                        editable={!field.disabled}
                      />
                    )}

                    {/* Render Date Picker */}
                    {field.type === 'datetime' && (
                      <TouchableOpacity
                        style={{
                          width: '100%',
                          height: 50,
                          borderWidth: 1,
                          borderColor: '#ccc',
                          borderRadius: 8,
                          padding: 12,
                          justifyContent: 'center',
                          backgroundColor: field.disabled ? '#f5f5f5' : '#fff',
                        }}
                        onPress={() => {
                          if (!field.disabled) setShowCalendar(true);
                        }}>
                        <Text style={{color: '#000', fontSize: 16}}>
                          {selectedDate || defaultValue || 'Select Date'}
                        </Text>
                      </TouchableOpacity>
                    )}

                    {/* Calendar Modal */}
                    {showCalendar && field.type === 'datetime' && (
                      <Modal
                        transparent={true}
                        animationType="slide"
                        onRequestClose={() => setShowCalendar(false)}>
                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          }}>
                          <View
                            style={{
                              backgroundColor: '#fff',
                              borderRadius: 12,
                              padding: 10,
                              width: '90%',
                            }}>
                            <Calendar
                              onDayPress={day => {
                                setSelectedDate(day.dateString);
                                setFormData({
                                  ...formData,
                                  [field.label]: day.dateString,
                                });
                                setShowCalendar(false);
                              }}
                              markedDates={{
                                [selectedDate]: {
                                  selected: true,
                                  marked: true,
                                  dotColor: '#00adf5',
                                },
                              }}
                              theme={{
                                selectedDayBackgroundColor: '#00adf5',
                                todayTextColor: '#00adf5',
                                arrowColor: '#00adf5',
                              }}
                            />
                            <TouchableOpacity
                              onPress={() => setShowCalendar(false)}
                              style={{
                                marginTop: 10,
                                padding: 10,
                                backgroundColor: '#ccc',
                                borderRadius: 8,
                                alignItems: 'center',
                              }}>
                              <Text style={{color: '#000'}}>
                                Close Calendar
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </Modal>
                    )}
                  </View>
                );
              })}

              {/* Comment Section */}
              <Text style={{fontWeight: 'bold', color: BLACK}}>Comments:</Text>
              <TextInput
                style={{
                  width: '100%',
                  height: 100,
                  borderWidth: 1,
                  borderColor: GRAY,
                  borderRadius: 8,
                  padding: 10,
                  textAlignVertical: 'top',
                  color: BLACK,
                }}
                multiline={true}
                placeholderTextColor={GRAY}
                placeholder="Add your comment here"
                value={comment}
                onChangeText={text => setComment(text)}
              />
            </ScrollView>

            {/* Modal Buttons */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 15,
              }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  marginRight: 10,
                  backgroundColor: '#ccc',
                  borderRadius: 8,
                  alignItems: 'center',
                }}
                onPress={() => {
                  closeModal();
                  clearState();
                }}>
                <Text style={{color: '#000', fontWeight: 'bold'}}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  marginLeft: 10,
                  backgroundColor: GREEN,
                  borderRadius: 8,
                  alignItems: 'center',
                }}
                onPress={() => {
                  updateForm();
                }}>
                <Text style={{color: '#fff', fontWeight: 'bold'}}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Loader visible={loading} />
    </Fragment>
  );
};

export default Templates;
