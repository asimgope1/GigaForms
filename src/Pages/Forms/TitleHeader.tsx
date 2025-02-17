import {View, Text, Pressable, StyleSheet} from 'react-native';
import React from 'react';
import {Icon} from 'react-native-paper';
import {DARKGREEN, WHITE} from '../../constants/color';
import {HEIGHT} from '../../constants/config';
import {BOLD, REGULAR} from '../../constants/fontfamily';

interface TitleHeaderProps {
  title: string;
  onPress: () => void;
  left: number;
}

const TitleHeader: React.FC<TitleHeaderProps> = ({
  title,
  onPress,
  left,
  icon,
  size,
}) => {
  return (
    <View style={styles.appbar}>
      <Pressable onPress={() => onPress()}>
        <Icon
          source={icon ? icon : 'arrow-left'}
          size={size ? size : 30}
          color="white"
        />
      </Pressable>
      {/* closed  back and page header*/}

      {/* start new dropdown textinput search button and delete button in a row */}
      <Text style={{...styles.appbarText, left: left ? left : '45%'}}>
        {title}
      </Text>
    </View>
  );
};

export default TitleHeader;

const styles = StyleSheet.create({
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
    fontFamily: BOLD,
    position: 'absolute',
  },
});
