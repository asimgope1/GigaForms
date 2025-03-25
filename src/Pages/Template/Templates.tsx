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
} from 'react-native';
import React, {Fragment, useEffect, useState} from 'react';
import {IconButton} from 'react-native-paper';
import {HEIGHT, MyStatusBar} from '../../constants/config';
import {BLACK, DARKGREEN, GREEN, GRAY, WHITE} from '../../constants/color';
import TitleHeader from '../Forms/TitleHeader';
import {GETNETWORK} from '../../utils/Network';
import {BASE_URL} from '../../constants/url';
import {getObjByKey, storeObjByKey} from '../../utils/Storage';
import DropdownComponent from '../Forms/DropdownComponent';
import {splashStyles} from '../Splash/SplashStyles';
import {styless} from '../Forms/Forms';
import {CheckBox} from 'react-native-elements';
import {Loader} from '../../components/Loader';

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
    getProfileData();
    const fetchData = async () => {
      try {
        if (route.params) {
          await storeObjByKey('routeTemplates', route.params);
        }

        const storedData = await getObjByKey('routeTemplates');
        if (storedData) {
          setTemplates(storedData);
          if (storedData?.tamplateId?.id) {
            GetTemplateData(storedData?.tamplateId?.id);
          }
        }
      } catch (error) {
        console.error('Error fetching or storing data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [route.params]);

  const GetTemplateData = async id => {
    if (!id) return;
    try {
      const url = `${BASE_URL}forms/custumlink/${id}/data/`;
      const response = await GETNETWORK(url, true);

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
    }
  };

  const handleSearch = () => {
    console.log('Searching for:', searchText);
  };

  const handleReset = () => {
    setSearchText('');
    setValue(null);
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
    setComment('');
  };

  const updateForm = () => {
    console.log('Form Submitted with Comment:', comment);
    closeModal();
    alert('Form submitted successfully! 🎉');
  };

  const handleActionPress = action => {
    const selectedItems = Object.values(checkedItems);
    if (selectedItems.length > 0) {
      setSelectedFieldData({fields: selectedItems});
      setIsModalVisible(true);
    } else {
      alert('Please select an item to proceed.');
    }
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

        {/* Search & Filter Section */}
        <View style={styless.container}>
          <DropdownComponent data={[]} value={value} onChange={setValue} />
          <TextInput
            style={[styless.input, {marginVertical: 10, borderColor: GRAY}]}
            placeholder="Search..."
            placeholderTextColor={BLACK}
            value={searchText}
            onChangeText={setSearchText}
          />
          <View style={{flexDirection: 'row', marginBottom: 10}}>
            <IconButton
              icon="magnify"
              size={24}
              onPress={handleSearch}
              style={styless.iconButton}
            />
            <IconButton
              icon="refresh"
              size={24}
              onPress={handleReset}
              style={styless.iconButton}
            />
          </View>
        </View>

        {/* Table Section */}
        <ScrollView horizontal>
          <View>
            {/* Table Header */}
            <View
              style={[
                styless.tableHeader,
                {flexDirection: 'row', backgroundColor: GRAY},
              ]}>
              <View style={{width: 50, alignItems: 'center'}}>
                <Text style={styless.tableHeaderText}>Select</Text>
              </View>
              {tableHeaders.map((header, idx) => (
                <View key={idx} style={{flex: 1, alignItems: 'center'}}>
                  <Text style={styless.tableHeaderText}>{header}</Text>
                </View>
              ))}
            </View>

            {/* Table Data */}
            <FlatList
              data={templateData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => (
                <View
                  style={[
                    styless.tableRow,
                    {
                      flexDirection: 'row',
                      backgroundColor:
                        index % 2 === 0 ? WHITE : 'rgba(0,0,0,0.05)',
                    },
                  ]}>
                  <View style={{width: 50, alignItems: 'center'}}>
                    <CheckBox
                      checked={!!checkedItems[index]}
                      onPress={() => toggleCheckbox(index, item)}
                    />
                  </View>
                  {tableHeaders.map((header, idx) => (
                    <View
                      key={`${index}-${idx}`}
                      style={{flex: 1, alignItems: 'center'}}>
                      <Text style={styless.tableCell}>
                        {item?.[header] ?? 'N/A'}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            />
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View
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
                maxHeight: 300,
                marginBottom: 15,
                backgroundColor: '#f9f9f9',
                padding: 10,
                borderRadius: 8,
              }}>
              {/* Training Allotment By */}
              <Text style={{fontSize: 16, fontWeight: 'bold', color: BLACK}}>
                Training Allotment By:
              </Text>
              <TextInput
                style={{
                  width: '100%',
                  height: 50,
                  borderWidth: 1,
                  borderColor: GRAY,
                  borderRadius: 8,
                  padding: 10,
                  backgroundColor: '#f5f5f5', // Light gray for a disabled look
                  color: BLACK,
                }}
                placeholder="User Name"
                value={userDetails?.name || 'N/A'}
                editable={false} // Disable editing
                placeholderTextColor={GRAY}
              />

              {/* Date Section */}
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: BLACK,
                  marginTop: 15,
                }}>
                Date:
              </Text>
              <Text style={{color: BLACK, fontSize: 18, marginTop: 5}}>
                {new Date().toISOString().split('T')[0]}
              </Text>

              {/* Time Section */}
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: BLACK,
                  marginTop: 15,
                }}>
                Time:
              </Text>
              <Text style={{color: BLACK, fontSize: 18, marginTop: 5}}>
                {new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </Text>
            </ScrollView>

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
                onPress={closeModal}>
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
                onPress={updateForm}>
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
