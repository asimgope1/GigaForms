import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DateTimePickerComponent = ({onDateChange, label}) => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Show date picker
  const showDateTimePicker = () => {
    setShowDatePicker(true);
  };

  // Handle date change
  const onDateChangeHandler = (event, selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
      setShowDatePicker(false);
      setTimeout(() => setShowTimePicker(true), 200); // Delay before showing time picker
    } else {
      setShowDatePicker(false);
    }
  };

  // Handle time change
  const onTimeChangeHandler = (event, selectedTime) => {
    if (selectedTime) {
      const combinedDateTime = new Date(date);
      combinedDateTime.setHours(selectedTime.getHours());
      combinedDateTime.setMinutes(selectedTime.getMinutes());
      setDate(combinedDateTime);
      setShowTimePicker(false);
      onDateChange(combinedDateTime); // Return final datetime to parent
    } else {
      setShowTimePicker(false);
    }
  };

  // Format selected date and time
  const formatDateTime = () => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <View style={styles.container}>
      {/* Button to open picker */}
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={showDateTimePicker}>
        <Text style={styles.pickerText}>{formatDateTime()}</Text>
      </TouchableOpacity>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChangeHandler}
        />
      )}

      {/* Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          value={date}
          mode="time"
          display="default"
          onChange={onTimeChangeHandler}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  pickerButton: {
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  pickerText: {
    fontSize: 16,
    color: '#555',
    // textAlign: 'center',
  },
});

export default DateTimePickerComponent;
