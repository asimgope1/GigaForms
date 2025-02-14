import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../Pages/Home/Home';
import Profile from '../Pages/Profile/Profile';
import {Icon} from 'react-native-paper';
import {GREEN} from '../constants/color';
import Forms from '../Pages/Forms/Forms';

// Define Stack and Drawer Navigators
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Custom Drawer Content Component
const CustomDrawer: React.FC<DrawerContentComponentProps> = ({navigation}) => {
  const [showRegistrationSubItems, setShowRegistrationSubItems] =
    useState(false);
  const [showApprovalSubItems, setShowApprovalSubItems] = useState(false);
  return (
    <DrawerContentScrollView contentContainerStyle={styles.drawerContainer}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={{uri: 'https://randomuser.me/api/portraits/men/50.jpg'}} // Replace with dynamic user image
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>John Doe</Text>
      </View>

      {/* Drawer Items */}
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => navigation.navigate('Home')}>
        <Icon source="home-outline" size={24} color={GREEN} />
        <Text style={styles.drawerItemText}>Home</Text>
      </TouchableOpacity>
      {/* Registration Item with Subitems */}
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => setShowRegistrationSubItems(!showRegistrationSubItems)}>
        <Icon source="account-plus-outline" size={24} color={GREEN} />
        <Text style={styles.drawerItemText}>Registration</Text>
      </TouchableOpacity>
      {showRegistrationSubItems && (
        <>
          <TouchableOpacity
            style={styles.drawerSubItem}
            onPress={() => navigation.navigate('Forms')}>
            <Icon
              source="card-account-details-outline"
              size={24}
              color={GREEN}
            />
            <Text style={styles.drawerItemText}>Gate Pass Registration</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Approval Item with Subitems */}
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => setShowApprovalSubItems(!showApprovalSubItems)}>
        <Icon source="sticker-check-outline" size={24} color={GREEN} />
        <Text style={styles.drawerItemText}>Approval</Text>
      </TouchableOpacity>
      {showApprovalSubItems && (
        <>
          <TouchableOpacity
            style={styles.drawerSubItem}
            onPress={() => navigation.navigate('SubApproval1')}>
            <Icon source="folder-check-outline" size={24} color={GREEN} />
            <Text style={styles.drawerItemText}>Sub Approval 1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.drawerSubItem}
            onPress={() => navigation.navigate('SubApproval2')}>
            <Icon source="folder-check-outline" size={24} color={GREEN} />
            <Text style={styles.drawerItemText}>Sub Approval 2</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => navigation.navigate('Profile')}>
        <Icon source="account-outline" size={24} color={GREEN} />
        <Text style={styles.drawerItemText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.logout}
        onPress={() => navigation.navigate('Profile')}>
        <Icon source="logout" size={24} color={GREEN} />
        <Text style={styles.drawerItemText}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
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
    </Drawer.Navigator>
  );
};

// Styles
const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#f5f5f5',
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
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  logout: {
    width: '100%',
    bottom: 20,
    position: 'absolute',
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
