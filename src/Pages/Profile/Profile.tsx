import React, {Fragment} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
} from 'react-native';
import {Avatar} from 'react-native-paper';
import {HEIGHT, MyStatusBar} from '../../constants/config';
import {Icon} from 'react-native-paper';
import {DARKGREEN, WHITE} from '../../constants/color';

const Profile = ({navigation}: any) => {
  return (
    <Fragment>
      <MyStatusBar backgroundColor={DARKGREEN} barStyle="light-content" />
      <SafeAreaView style={styles.mainContainer}>
        {/* App Bar with Back Button */}
        <View style={styles.appbar}>
          <Pressable onPress={() => navigation.goBack()}>
            <Icon source="arrow-left" size={30} color="white" />
          </Pressable>
          <Text style={styles.appbarText}>Profile</Text>
        </View>

        {/* Profile Content */}
        <View style={styles.container}>
          {/* Profile Picture */}
          <View style={styles.avatarContainer}>
            <Avatar.Image
              size={100}
              source={{uri: 'https://www.example.com/profile.jpg'}} // Replace with actual URL
              style={styles.avatar}
            />
          </View>

          {/* User Info */}
          <View style={styles.userInfoContainer}>
            <Text style={styles.userName}>Asim Gope</Text>
            <Text style={styles.userType}>User</Text>
            <Text style={styles.userEmail}>asimgope53@gmail.com</Text>
            <Text style={styles.userPhone}>+91 8340431775</Text>
          </View>

          {/* Buttons */}
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => alert('Change Password')}>
            <Text style={styles.editButtonText}>Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => alert('Logging out')}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Fragment>
  );
};

export default Profile;

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Light background color
  },
  appbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DARKGREEN,
    height: HEIGHT * 0.08,
    paddingHorizontal: 15,
  },
  appbarText: {
    color: WHITE,
    fontSize: 20,
    fontWeight: 'bold',
    position: 'absolute',
    left: '45%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  avatarContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  avatar: {
    borderWidth: 3,
    borderColor: '#4CAF50', // Border color to match profile theme
  },
  userInfoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  userType: {
    fontSize: 16,
    color: '#4CAF50', // Light green for user type
    marginVertical: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginVertical: 5,
  },
  userPhone: {
    fontSize: 16,
    color: '#666',
    marginVertical: 5,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 10,
  },
  editButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#f44336', // Red for logout
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
