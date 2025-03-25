import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  FlatList,
  ScrollView,
  Button,
} from 'react-native';
import React, {Fragment, useEffect, useState} from 'react';
import {IconButton} from 'react-native-paper';
import {MyStatusBar} from '../../constants/config';
import {BLACK, BRAND, DARKGREEN} from '../../constants/color';
import TitleHeader from '../Forms/TitleHeader';
import {GETNETWORK} from '../../utils/Network';
import {BASE_URL} from '../../constants/url';
import {getObjByKey, storeObjByKey} from '../../utils/Storage';
import DropdownComponent from '../Forms/DropdownComponent';
import {splashStyles} from '../Splash/SplashStyles';
import {styless} from '../Forms/Forms';
import {CheckBox} from 'react-native-elements';

const Templates = ({navigation, route}) => {
  const [templates, setTemplates] = useState({});
  const [value, setValue] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [templateData, setTemplateData] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [editedData, setEditedData] = useState({});
  const [tableHeaders, setTableHeaders] = useState([]);
  const [actions, setActions] = useState([]); // Stores buttons dynamically

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (route.params) {
          await storeObjByKey('routeTemplates', route.params);
        }

        const storedData = await getObjByKey('routeTemplates');
        if (storedData) {
          console.log('storedData,storedData', storedData);
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
    console.log('Fetching template data for ID:', id);
    try {
      const url = `${BASE_URL}forms/custumlink/${id}/data/`;
      const response = await GETNETWORK(url, true);

      console.log('reponse temps', response);
      if (response?.results?.length > 0) {
        setTemplateData(response.results);
        setTableHeaders(Object.keys(response.results[0]));

        // Store available actions dynamically from API
        if (response?.State_Action?.length > 0) {
          setActions(response.State_Action);
        } else {
          setActions([]); // No actions available
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

  const toggleCheckbox = index => {
    setCheckedItems(prevCheckedItems => {
      const newCheckedItems = {
        ...prevCheckedItems,
        [index]: !prevCheckedItems[index],
      };

      if (newCheckedItems[index]) {
        // If checked, set the dynamic actions from the API response
        console.log('Setting Actions:', actions); // Debugging
        setActions(actions); // Use API-provided actions dynamically
      } else {
        // Reset actions when deselecting
        setActions([]);
      }

      return newCheckedItems;
    });
  };
  console.log('actions:', actions);

  return (
    <Fragment>
      <MyStatusBar backgroundColor={BRAND} barStyle="light-content" />
      <SafeAreaView style={splashStyles.maincontainer}>
        <TitleHeader
          title="Template Data View"
          onPress={() => navigation.goBack()}
        />

        <View style={styless.subheaderContainer}>
          <Text style={styless.subheaderText}>
            {loading
              ? 'Loading...'
              : templates?.tamplateId?.template_name || 'No Template Found'}
          </Text>
        </View>

        <View style={styless.container}>
          <DropdownComponent data={[]} value={value} onChange={setValue} />

          <TextInput
            style={styless.input}
            placeholder="Search..."
            placeholderTextColor={BLACK}
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
            icon="refresh"
            size={24}
            onPress={handleReset}
            style={styless.iconButton}
          />
        </View>

        <ScrollView horizontal>
          <View>
            {/* Table Header */}
            <View style={[styless.tableHeader, {flexDirection: 'row'}]}>
              <View style={{width: 50}}>
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
                <View style={[styless.tableRow, {flexDirection: 'row'}]}>
                  {/* Checkbox Column */}
                  <View style={{width: 50, alignItems: 'center'}}>
                    <CheckBox
                      checked={checkedItems[index] || false}
                      onPress={() => toggleCheckbox(index)}
                    />
                  </View>

                  {/* Data Columns */}
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

        {actions.length > 0 && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginBottom: 50,
            }}>
            <Button
              title="Reject Training"
              onPress={() => console.log('Rejected Training')}
              color="red"
            />
            <View style={{width: 10}} />
            <Button
              title="Confirm Training"
              onPress={() => console.log('Confirmed Training')}
              color="green"
            />
          </View>
        )}
      </SafeAreaView>
    </Fragment>
  );
};

export default Templates;
