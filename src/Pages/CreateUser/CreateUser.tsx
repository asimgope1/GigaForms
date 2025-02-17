import React, {Fragment, useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {BASE_URL} from '../../constants/url';
import {HEIGHT, MyStatusBar, WIDTH} from '../../constants/config';
import {BLACK, DARKGREEN, GRAY} from '../../constants/color';
import TitleHeader from '../Forms/TitleHeader';
import {Dropdown} from 'react-native-element-dropdown';

const CreateUser = ({navigation}) => {
  const [userData, setUserData] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSuperUser, setIsSuperUser] = useState(false);
  const [field, setfield] = useState('');

  // Dropdown states
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [dashboardValue, setDashboardValue] = useState(null);
  const [dashboardItems, setDashboardItems] = useState([]);

  const [groupOpen, setGroupOpen] = useState(false);
  const [groupValue, setGroupValue] = useState(null);
  const [groupItems, setGroupItems] = useState([]);

  const [formOpen, setFormOpen] = useState(false);
  const [formValue, setFormValue] = useState(null);
  const [formItems, setFormItems] = useState([
    {label: 'Template', value: 'Template'},
    {label: 'Form', value: 'Form'},
    {label: 'Both', value: 'Both'},
  ]);
  const [ValueOpen, setValueOpen] = useState(false);
  const [ValueValue, setValueValue] = useState(null);
  const [ValueItems, setValueItems] = useState([]);
  const dispatch = useDispatch();

  // Function to retrieve data from AsyncStorage
  const fetchUserData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('loginDetails');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setUserData(parsedData);
        console.log('parsedData', parsedData);
      } else {
        console.log('No data found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error fetching data from AsyncStorage:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (!userData?.access) {
      // If the userData or access token is not available, do not fetch the data
      console.log('Waiting for user data...');
      return; // Exit early if userData is not available
    }

    console.log('userData.access', userData?.access);

    const fetchDropdownData = async () => {
      const myHeaders = new Headers();
      myHeaders.append('Accept', 'application/json');
      myHeaders.append('Authorization', `Bearer ${userData.access}`);

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      try {
        // Fetch dashboard items
        const dashboardResponse = await fetch(
          `${BASE_URL}/forms/custom_dashboard/`,
          requestOptions,
        );
        const dashboardData = await dashboardResponse.json();
        console.log('dashboardData', dashboardData);
        const dashboardItems = dashboardData.results.map(item => ({
          label: item.dashboard_name,
          value: item.id,
        }));
        setDashboardItems(dashboardItems);
        // Fetch group items
        const groupResponse = await fetch(
          `${BASE_URL}/forms/notification-groups/`,
          requestOptions,
        );
        const groupData = await groupResponse.json();
        console.log('groupData', groupData);
        const groupItems = groupData.results.map(item => ({
          label: item.group_name, // Use group_name as the label
          value: item.id, // Use id as the value
          template: item.template, // Use template as the
        }));
        setGroupItems(groupItems);

        // Fetch value items
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };

    fetchDropdownData();
  }, [userData]); // Ensure effect runs whenever userData changes

  const GetValue = async temp => {
    console.log('val', temp, userData?.access);

    const myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Authorization', `Bearer ${userData?.access}`);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    try {
      const valueResponse = await fetch(
        `${BASE_URL}/forms/template/${temp}/alldata/`,
        requestOptions,
      );
      const valueData = await valueResponse.json();

      // Check if valueData is an array before calling .map
      if (Array.isArray(valueData.data)) {
        const valueItems = valueData.data.flatMap(item =>
          item.data.map(nestedItem => ({
            label: nestedItem.value, // Use the 'value' from the 'data' array
            value: nestedItem.id, // Use the 'id' from the 'data' array
          })),
        );
        setValueItems(valueItems); // Assuming setValueItems is defined
      } else {
        console.error('Expected data to be an array, but received:', valueData);
      }
    } catch (error) {
      console.error('Error fetching value data:', error);
    }
  };

  const handleCreate = async () => {
    // Define the base URL

    // Construct the URL dynamically
    const Url = `${BASE_URL}/VerifyUser`;

    // Log the details for debugging
    console.log('Creating user with the following details:');
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Phone:', phone);
    console.log('Dashboard:', dashboardValue);
    console.log('Group:', groupValue);
    console.log('Form:', formValue);
    console.log('Value:', ValueValue);
    console.log('Super User:', isSuperUser);

    // Creating requestBody
    const requestBody = {
      name: username,
      phone: phone,
      email: email,
      password: phone, // Assuming you want to set the password to phone number
      is_superuser: isSuperUser,
      dashboard: dashboardValue,
      group: groupValue,
      field_value: field?.label, // Make sure 'field' is defined properly
      show_form: formValue,
      field: parseInt(field?.field), // Ensure 'field' is properly formatted
    };

    // Log the request body for debugging
    console.log('Request Body:', requestBody);

    try {
      // Calling the API with fetch
      const response = await fetch(
        `${BASE_URL}/user/internal/register/?redirect_url=${Url}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userData?.access}`, // Add an access token if needed
          },
          body: JSON.stringify(requestBody),
        },
      );

      // Check the response
      if (response.ok && response.status === 201) {
        // Parse the JSON response
        //clear all the states
        setUsername('');
        setEmail('');
        setPhone('');
        setIsSuperUser(false);
        setDashboardValue(null);
        setGroupValue(null);
        setValueValue(null);
        setFormValue(null);
        const responseData = await response.json();
        alert(
          `Success: ${responseData.message || 'User created successfully!'}`,
        );
      } else {
        // Handle non-successful responses
        const errorData = await response.json();
        alert(
          `Error: ${
            errorData.message || 'An error occurred while creating the user.'
          }`,
        );
      }
    } catch (error) {
      console.error('Request failed:', error);
      alert('Network error: Unable to create user.');
    }
  };

  return (
    <Fragment>
      <MyStatusBar backgroundColor={DARKGREEN} barStyle="light-content" />
      <SafeAreaView style={styles.mainContainer}>
        <TitleHeader
          title="Create-User"
          onPress={() => navigation.goBack()}
          left={WIDTH * 0.38}
        />
        <ScrollView style={styles.container}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter username"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={12}
            />
          </View>

          <View style={styles.row}>
            <View style={{...styles.inputContainer, flex: 1, zIndex: 1000}}>
              <Text style={styles.label}>Dashboard</Text>
              <Dropdown
                data={[
                  {label: 'Dashboard', value: 'Dashboard'},
                  {label: 'Home', value: 'Home'},
                  {label: 'Settings', value: 'Settings'},
                ]}
                style={styles.dropdownStyle}
                placeholderStyle={styles.placeholderStyle}
                inputSearchStyle={styles.inputSearchStyle}
                itemContainerStyle={styles.itemContainerStyle}
                itemTextStyle={styles.itemTextStyle}
                selectedTextStyle={styles.selectedTextStyle}
                searchPlaceholderTextColor={styles.searchPlaceholderTextColor}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={'Select item'}
                searchPlaceholder="Search..."
                value={dashboardValue}
                onChange={item => {
                  setDashboardValue(item.value);
                }}
              />
            </View>

            <View
              style={{
                ...styles.inputContainer,
                flex: 1,
                zIndex: 900,
                marginLeft: 10,
              }}>
              <Text style={styles.label}>Group Name</Text>
              <Dropdown
                data={[
                  {label: 'Dashboard', value: 'Dashboard'},
                  {label: 'Home', value: 'Home'},
                  {label: 'Settings', value: 'Settings'},
                ]}
                style={styles.dropdownStyle}
                placeholderStyle={styles.placeholderStyle}
                inputSearchStyle={styles.inputSearchStyle}
                itemContainerStyle={styles.itemContainerStyle}
                itemTextStyle={styles.itemTextStyle}
                selectedTextStyle={styles.selectedTextStyle}
                searchPlaceholderTextColor={styles.searchPlaceholderTextColor}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={'Select item'}
                searchPlaceholder="Search..."
                value={dashboardValue}
                onChange={item => {
                  setDashboardValue(item.value);
                }}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={{...styles.inputContainer, flex: 1, zIndex: 800}}>
              <Text style={styles.label}>Show Value</Text>
              <Dropdown
                data={[
                  {label: 'Dashboard', value: 'Dashboard'},
                  {label: 'Home', value: 'Home'},
                  {label: 'Settings', value: 'Settings'},
                ]}
                style={styles.dropdownStyle}
                placeholderStyle={styles.placeholderStyle}
                inputSearchStyle={styles.inputSearchStyle}
                itemContainerStyle={styles.itemContainerStyle}
                itemTextStyle={styles.itemTextStyle}
                selectedTextStyle={styles.selectedTextStyle}
                searchPlaceholderTextColor={styles.searchPlaceholderTextColor}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={'Select item'}
                searchPlaceholder="Search..."
                value={dashboardValue}
                onChange={item => {
                  setDashboardValue(item.value);
                }}
              />
            </View>

            <View
              style={{
                ...styles.inputContainer,
                flex: 1,
                zIndex: 700,
                marginLeft: 10,
              }}>
              <Text style={styles.label}>Show Form</Text>
              <Dropdown
                data={[
                  {label: 'Dashboard', value: 'Dashboard'},
                  {label: 'Home', value: 'Home'},
                  {label: 'Settings', value: 'Settings'},
                ]}
                style={styles.dropdownStyle}
                placeholderStyle={styles.placeholderStyle}
                inputSearchStyle={styles.inputSearchStyle}
                itemContainerStyle={styles.itemContainerStyle}
                itemTextStyle={styles.itemTextStyle}
                selectedTextStyle={styles.selectedTextStyle}
                searchPlaceholderTextColor={styles.searchPlaceholderTextColor}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={'Select item'}
                searchPlaceholder="Search..."
                value={dashboardValue}
                onChange={item => {
                  setDashboardValue(item.value);
                }}
              />
            </View>
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.label}>Super User</Text>
            <Switch value={isSuperUser} onValueChange={setIsSuperUser} />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleCreate}>
            <Text style={styles.buttonText}>Create</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Light background color
  },

  container: {flex: 1, padding: 15, backgroundColor: '#f5f5f5'},
  header: {marginBottom: 20, alignItems: 'center'},
  headerText: {fontSize: 24, fontWeight: 'bold', color: '#1f8754ba'},
  inputContainer: {marginBottom: 20},
  label: {fontSize: 17, marginBottom: 5, color: '#333', fontWeight: 'bold'},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    color: BLACK,
  },
  dropdown: {borderColor: '#ccc', marginTop: 10},
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1f8754ba',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
  dropdownStyle: {
    height: 50,
    width: 150,
    borderColor: 'gray',
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'gray',
  },
  inputSearchStyle: {
    fontSize: 16,
    color: 'gray',
  },
  itemContainerStyle: {
    backgroundColor: 'white',
  },
  itemTextStyle: {
    fontSize: 16,
    color: 'gray',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'black',
  },
});

export default CreateUser;
