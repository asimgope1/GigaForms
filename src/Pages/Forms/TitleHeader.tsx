import {View, Text, Pressable} from 'react-native';
import React from 'react';
import {Icon} from 'react-native-paper';
import {styles} from '../Profile/Profile';

interface TitleHeaderProps {
  title: string;
  onPress: () => void;
}

const TitleHeader: React.FC<TitleHeaderProps> = ({title, onPress}) => {
  return (
    <View style={styles.appbar}>
      <Pressable onPress={() => onPress()}>
        <Icon source="arrow-left" size={30} color="white" />
      </Pressable>
      {/* closed  back and page header*/}

      {/* start new dropdown textinput search button and delete button in a row */}
      <Text style={styles.appbarText}>{title}</Text>
    </View>
  );
};

export default TitleHeader;
