import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../Pages/Home/Home';
import Profile from '../Pages/Profile/Profile';
import {Icon} from 'react-native-paper';
import {BLACK, DARKGREEN, GREEN, RED, WHITE} from '../constants/color';
import Forms from '../Pages/Forms/Forms';
import FormsTemplates from '../Pages/Forms/FormsTemplates';
import {clearAll, storeObjByKey} from '../utils/Storage';
import {checkuserToken} from '../redux/actions/auth';
import {useDispatch} from 'react-redux';
import CreateUser from '../Pages/CreateUser/CreateUser';
import {BASE_URL} from '../constants/url';
import {GETNETWORK} from '../utils/Network';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MyStatusBar} from '../constants/config';
import {splashStyles} from '../Pages/Splash/SplashStyles';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {BOLD, REGULAR, SEMIBOLD} from '../constants/fontfamily';
import Templates from '../Pages/Template/Templates';
import FormsTest from '../Pages/Forms/FormsTest';

// Define Stack and Drawer Navigators
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Custom Drawer Content Component
const CustomDrawer: React.FC<DrawerContentComponentProps> = ({navigation}) => {
  const [showRegistrationSubItems, setShowRegistrationSubItems] =
    useState(false);
  const [showApprovalSubItems, setShowApprovalSubItems] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [options, setOptions] = useState<any[]>([]);
  const [approvals, setApprovals] = useState<any[]>([]);

  useEffect(() => {
    getProfileData();
    GetOptions();
    GetAprovalOptions();
  }, []);

  const getProfileData = async () => {
    setLoading(true);
    try {
      const url = `${BASE_URL}user/profile/`;
      const response = await GETNETWORK(url, true);
      console.log('userresponse', response);
      setUserDetails(response);
      storeObjByKey('user', response);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      alert('Failed to load profile data.');
    }
    setLoading(false);
  };

  const GetOptions = async () => {
    try {
      const url = `${BASE_URL}forms/menulistforuser/`;
      const response = await GETNETWORK(url, true);
      console.log('GetOptions', response.form_data);
      setOptions(response.form_data || []);
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };
  const GetAprovalOptions = async () => {
    try {
      const url = `${BASE_URL}forms/menulistforuser/`;
      const response = await GETNETWORK(url, true);
      console.log('menulist for user', response);
      console.log('GetAprovalOptions', response.template_data);
      setApprovals(response.template_data || []);
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  console.log('approvalsss', approvals);
  console.log('optionssss', options);

  return (
    <>
      <StatusBar
        translucent={true}
        // backgroundColor={DARKGREEN}
        barStyle={'dark-content'}
      />
      {/* <SafeAreaView style={splashStyles.maincontainer}> */}
      <DrawerContentScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.drawerContainer}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <Image style={styles.profileImage} />
            <Text style={styles.profileName}>{userDetails?.name}</Text>
          </View>

          {/* Drawer Items */}
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => navigation.navigate('Home')}>
            <Icon source="home-outline" size={24} color={GREEN} />
            <Text style={styles.drawerItemText}>Home</Text>
          </TouchableOpacity>

          {/* Registration Section */}
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() =>
              setShowRegistrationSubItems(!showRegistrationSubItems)
            }>
            <Icon source="account-plus-outline" size={24} color={GREEN} />
            <Text style={styles.drawerItemText}>Registration</Text>
          </TouchableOpacity>

          {/* Dynamically Rendered Form Options */}
          {showRegistrationSubItems && options.length > 0 && (
            <View style={styles.subMenuContainer}>
              {options.map(option => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.drawerSubItem}
                  onPress={() =>
                    navigation.navigate('Forms', {formId: option})
                  }>
                  <Icon
                    source="card-account-details-outline"
                    size={24}
                    color={GREEN}
                  />
                  <Text style={styles.drawerItemText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Approval Section */}
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => setShowApprovalSubItems(!showApprovalSubItems)}>
            <Icon source="sticker-check-outline" size={24} color={GREEN} />
            <Text style={styles.drawerItemText}>Approval</Text>
          </TouchableOpacity>

          {showApprovalSubItems && approvals.length > 0 && (
            <View style={styles.subMenuContainer}>
              {approvals.map(option => (
                <TouchableOpacity
                  style={styles.drawerSubItem}
                  onPress={() =>
                    navigation.navigate('Templates', {tamplateId: option})
                  }>
                  <Icon source="folder-check-outline" size={24} color={GREEN} />
                  <Text style={styles.drawerItemText}>
                    {option?.template_name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Profile */}
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => navigation.navigate('Profile')}>
            <Icon source="account-outline" size={24} color={GREEN} />
            <Text style={styles.drawerItemText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => navigation.navigate('FormsTest')}>
            <Icon source="account-outline" size={24} color={GREEN} />
            <Text style={styles.drawerItemText}>FormsTest</Text>
          </TouchableOpacity>

          {/* Create User Option (For Superusers) */}
          {userDetails?.is_superuser && (
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => navigation.navigate('Create-User')}>
              <Icon source="account-plus" size={24} color={GREEN} />
              <Text style={styles.drawerItemText}>Create User</Text>
            </TouchableOpacity>
          )}

          {/* Logout */}
          <TouchableOpacity
            style={styles.logout}
            onPress={() => {
              alert('Are you sure you want to logout?');
              clearAll();
              dispatch(checkuserToken());
            }}>
            <Icon source="logout" size={25} color={WHITE} />
            <Text style={{...styles.drawerItemText, color: WHITE}}>Logout</Text>
          </TouchableOpacity>

          <View
            style={{
              // position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              // backgroundColor: 'rgba(0, 0, 0, 0.5)',
              justifyContent: 'center',
              marginTop: 10,
              height: 50,
              width: '100%',
            }}>
            <Text
              style={{
                color: BLACK,
              }}>
              Powered by{' '}
              <Text style={{fontWeight: 'bold', color: DARKGREEN}}>
                EPSUMLABS
              </Text>
            </Text>
          </View>
        </View>
      </DrawerContentScrollView>
      {/* </SafeAreaView> */}
    </>
  );
};

// Stack Navigator for Home and Profile
const HomeStack: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Dashboard">
      <Stack.Screen
        name="Dashboard"
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Forms"
        component={Forms}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

// Drawer Navigator Component
const MyDrawer: React.FC = () => {
  return (
    <Drawer.Navigator drawerContent={CustomDrawer}>
      <Drawer.Screen
        name="Home"
        component={HomeStack}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        name="Forms"
        component={Forms}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        name="Forms Templates"
        component={FormsTemplates}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        name="Create-User"
        component={CreateUser}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        name="Templates"
        component={Templates}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        name="FormsTest"
        component={FormsTest}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  );
};

// Styles
const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    width: '100%',
    // paddingTop: 40,
    // backgroundColor: 'rgb(192, 255, 214)',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: GREEN,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  drawerItemText: {
    fontSize: RFPercentage(1.8),
    fontFamily: SEMIBOLD,
    color: '#333',
    marginLeft: 15,
  },
  logout: {
    width: '100%',
    marginTop: 100,
    backgroundColor: RED,
    borderRadius: 8,
    // bottom: 100,
    // position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  drawerSubItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default MyDrawer;
