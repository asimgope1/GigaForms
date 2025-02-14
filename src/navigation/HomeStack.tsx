import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../Pages/Home/Home';
import Profile from '../Pages/Profile/Profile';

const { Navigator: StackNavigator, Screen: StackScreen } = createNativeStackNavigator();
const { Navigator: DrawerNavigator, Screen: DrawerScreen } = createDrawerNavigator();

// Custom Drawer Content
import { DrawerContentComponentProps } from '@react-navigation/drawer';

const CustomDrawer = ({ navigation }: DrawerContentComponentProps) => {
  return (
    <View style={styles.drawerContainer}>

      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.drawerItemText}>Home</Text>
      </TouchableOpacity>
      {/* Add more drawer items here if needed */}
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => navigation.navigate('Profile')}
      >
        <Text style={styles.drawerItemText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const HomeStack = () => {
  return (
    <StackNavigator initialRouteName="Home">
      <StackScreen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <StackScreen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
        }}
      />
      {/* Add other stack screens here if needed */}
    </StackNavigator>
  );
};

const MyDrawer = () => {
  return (
    <DrawerNavigator drawerContent={(props) => <CustomDrawer {...props} />}>
      <DrawerScreen name="Home" component={HomeStack} options={
        {
          headerShown: false,

        }
      } />
      <DrawerScreen name="Profile" component={Profile} />

      {/* Add other screens here if needed */}
    </DrawerNavigator>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 70,
  },
  header: {
    padding: 20,
    backgroundColor: '#6200ee',
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  drawerItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  drawerItemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default MyDrawer;
