import React, {useState} from 'react';
import {View, Text, Alert, StyleSheet, Image} from 'react-native';
import {Button, Card} from 'react-native-paper';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const ImageUploader = ({label, onImageSelect}) => {
  const [image, setImage] = useState(null);

  // Handle camera capture
  const openCamera = async () => {
    const result = await launchCamera({mediaType: 'photo', saveToPhotos: true});
    if (result.assets) {
      const selectedImage = result.assets[0];
      setImage(selectedImage);
      Alert.alert('Image Captured', `File: ${selectedImage.uri}`);
      if (onImageSelect) {
        onImageSelect(selectedImage);
      }
    }
  };

  // Handle gallery selection
  const openGallery = async () => {
    const result = await launchImageLibrary({mediaType: 'photo'});
    if (result.assets) {
      const selectedImage = result.assets[0];
      setImage(selectedImage);
      Alert.alert('Image Selected', `File: ${selectedImage.uri}`);
      if (onImageSelect) {
        onImageSelect(selectedImage);
      }
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.label}>{label || 'Upload Image'}</Text>

        {/* Camera & Gallery Buttons */}
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

        {/* Show selected image */}
        {image && (
          <View style={styles.imagePreviewContainer}>
            <Image
              source={{uri: image.uri}}
              style={styles.imagePreview}
              resizeMode="cover"
            />
            <Text style={styles.fileText}>
              Selected: {image.fileName || 'Captured Image'}
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  smallButton: {
    flex: 0.48,
    backgroundColor: '#4CAF50',
  },
  fileText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  imagePreviewContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
});

export default ImageUploader;
