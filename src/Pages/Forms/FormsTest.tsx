import React, {useRef, useState} from 'react';
import {View, Alert, SafeAreaView, StyleSheet, ScrollView} from 'react-native';
import {Button, Card, Text, TextInput} from 'react-native-paper';
import {pick} from '@react-native-documents/picker';
import SignatureCapture from 'react-native-signature-canvas';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {MyStatusBar} from '../../constants/config';
import {DARKGREEN} from '../../constants/color';

const FormsTest = () => {
  const signatureRef = useRef(null);
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [signature, setSignature] = useState('');

  // Handle file selection
  const openFilePicker = async () => {
    try {
      const [pickResult] = await pick();
      setFile(pickResult);
      Alert.alert('File Selected', `File: ${pickResult.name}`);
    } catch (err) {
      console.log('File Picker Error:', err);
    }
  };

  // Handle camera capture
  const openCamera = async () => {
    const result = await launchCamera({mediaType: 'photo', saveToPhotos: true});
    if (result.assets) {
      setImage(result.assets[0]);
      Alert.alert('Image Captured', `File: ${result.assets[0].uri}`);
    }
  };

  // Handle gallery selection
  const openGallery = async () => {
    const result = await launchImageLibrary({mediaType: 'photo'});
    if (result.assets) {
      setImage(result.assets[0]);
      Alert.alert('Image Selected', `File: ${result.assets[0].uri}`);
    }
  };

  // Handle signature capture
  const handleSignature = signatureData => {
    setSignature(signatureData);
  };

  // Handle reset signature
  const handleResetSignature = () => {
    signatureRef.current.clearSignature();
    setSignature('');
  };

  // Handle form submission
  const handleSubmit = () => {
    console.log('File Details:', file);
    console.log('Image Details:', image);
    console.log('Signature Data (Base64):', signature);
    Alert.alert('Form Submitted', 'Check console for details.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <MyStatusBar backgroundColor={DARKGREEN} barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* File Upload */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.label}>Upload Document</Text>
            <Button
              mode="contained"
              onPress={openFilePicker}
              style={styles.button}>
              Select File
            </Button>
            {file && <Text style={styles.fileText}>Selected: {file.name}</Text>}
          </Card.Content>
        </Card>

        {/* Image Upload */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.label}>Upload Image</Text>
            <View style={styles.buttonRow}>
              <Button
                mode="contained"
                onPress={openCamera}
                style={styles.smallButton}>
                Open Camera
              </Button>
              <Button
                mode="contained"
                onPress={openGallery}
                style={styles.smallButton}>
                Open Gallery
              </Button>
            </View>
            {image && (
              <Text style={styles.fileText}>
                Selected: {image.fileName || 'Captured Image'}
              </Text>
            )}
          </Card.Content>
        </Card>

        {/* Signature Capture */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.label}>Signature</Text>
            <View style={styles.signatureContainer}>
              <SignatureCapture
                ref={signatureRef}
                onOK={handleSignature}
                descriptionText="Sign here"
                clearText="Clear"
                confirmText="Save"
              />
            </View>
            <Button
              mode="outlined"
              onPress={handleResetSignature}
              style={styles.resetButton}>
              Reset Signature
            </Button>
          </Card.Content>
        </Card>

        {/* Submit Button */}
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}>
          Submit
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 20,
  },
  card: {
    marginBottom: 15,
    elevation: 4,
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  button: {
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallButton: {
    flex: 1,
    marginHorizontal: 5,
    color: DARKGREEN,
  },
  fileText: {
    marginTop: 10,
    color: '#555',
  },
  signatureContainer: {
    borderWidth: 1,
    borderColor: '#000',
    height: 250,
    marginVertical: 10,
  },
  resetButton: {
    marginTop: 10,
  },
  submitButton: {
    marginTop: 20,
    paddingVertical: 10,
  },
});

export default FormsTest;
