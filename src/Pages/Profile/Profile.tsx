import React, {Fragment, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
  Modal,
  TextInput,
  Button,
} from 'react-native';
import {Avatar} from 'react-native-paper';
import {HEIGHT, MyStatusBar} from '../../constants/config';
import {Icon} from 'react-native-paper';
import {BLACK, DARKGREEN, GRAY, WHITE} from '../../constants/color';
import {BASE_URL} from '../../constants/url';
import {GETNETWORK} from '../../utils/Network';
import {Loader} from '../../components/Loader';

const Profile = ({navigation}: any) => {
  const [userDetails, setUserDetails] = useState<any>(null); // State for user details
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility
  const [oldPassword, setOldPassword] = useState(''); // State for old password input
  const [newPassword, setNewPassword] = useState(''); // State for new password input
  const [loading, SetLoading] = useState(false); // State for loading

  useEffect(() => {
    getProfileData();
  }, []);

  // API call to get profile data
  const getProfileData = async () => {
    SetLoading(true);
    try {
      const url = `${BASE_URL}user/profile/`;
      const response = await GETNETWORK(url, true); // Assuming GETNETWORK is an async function
      console.log('response', response);
      SetLoading(false); // Hide loader after successful API call
      setUserDetails(response); // Set user details from API response
    } catch (error) {
      SetLoading(false);
      console.error('Error fetching profile data:', error);
      alert('Failed to load profile data.');
    }
  };

  // API call to change the password
  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      alert('Please fill in both fields.');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}user/change_password/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Password changed successfully!');
        setModalVisible(false); // Close modal after successful change
      } else {
        alert(data.message || 'Failed to change password!');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to change password!');
    }
  };

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
              source={{
                uri:
                  userDetails?.profile ?? 'https://www.example.com/profile.jpg', // Use the profile URL if available
              }}
              style={styles.avatar}
            />
          </View>

          {/* User Info */}
          <View style={styles.userInfoContainer}>
            <Text style={styles.userName}>
              {userDetails?.name ?? 'User Name'}
            </Text>
            <Text style={styles.userType}>
              {userDetails?.is_staff ? 'Staff' : 'User'}
            </Text>
            <Text style={styles.userEmail}>
              {userDetails?.email ?? 'Email not available'}
            </Text>
            <Text style={styles.userPhone}>
              {userDetails?.phone ?? 'Phone number not available'}
            </Text>
          </View>

          {/* Buttons */}
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.editButtonText}>Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => alert('Logging out')}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Change Password Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Change Password</Text>

              <TextInput
                placeholderTextColor={GRAY}
                style={styles.input}
                placeholder="Old Password"
                secureTextEntry
                value={oldPassword}
                onChangeText={setOldPassword}
              />
              <TextInput
                placeholderTextColor={GRAY}
                style={styles.input}
                placeholder="New Password"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />

              <View style={styles.modalButtons}>
                <Button title="Cancel" onPress={() => setModalVisible(false)} />
                <Button title="Submit" onPress={handleChangePassword} />
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
      <Loader visible={loading} />
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

  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Overlay background
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: BLACK,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    color: BLACK,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});
