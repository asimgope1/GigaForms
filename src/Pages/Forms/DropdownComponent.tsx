import React, {useState} from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import {StyleSheet, Text, View} from 'react-native';
import {GRAY} from '../../constants/color';

const DropdownComponent = ({data, value, onChange}) => {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={styles.container}>
      {value || isFocus ? (
        <Text style={[styles.label, isFocus && {color: 'blue'}]}>
          {value ? 'Selected' : 'Select'}
        </Text>
      ) : null}
      <Dropdown
        style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Select Field' : '...'}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          onChange(item.value); // Pass the selected value to the parent
          setIsFocus(false);
        }}
        itemTextStyle={{
          color: 'black',
        }}
        selectedTextProps={{
          ellipsizeMode: 'tail',
          numberOfLines: 1,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    // padding: 16,
  },
  dropdown: {
    height: 50,
    width: 150,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  //   iconStyle: {
  //     marginRight: 5,
  //   },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 30,
    top: 5,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 11,
    color: 'black',
  },
  placeholderStyle: {
    fontSize: 16,
    color: GRAY,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'black',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default DropdownComponent;
