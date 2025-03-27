import {View, Text, Pressable, StyleSheet, Platform} from 'react-native';
import React from 'react';
import {Icon} from 'react-native-paper';
import {BRAND, DARKGREEN, GREEN, WHITE} from '../../constants/color';
import {HEIGHT} from '../../constants/config';
import {BOLD} from '../../constants/fontfamily';
import {RFPercentage} from 'react-native-responsive-fontsize';

interface TitleHeaderProps {
  title: string;
  onPress: () => void;
  left?: number; // Optional: Used to adjust the text position if needed.
  icon?: string; // Optional: Icon to use, default is 'arrow-left'.
  size?: number; // Optional: Size of the icon, default is 30.
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
      {/* Icon on the left */}
      <Pressable onPress={() => onPress()} style={styles.iconContainer}>
        <Icon
          source={icon ? icon : 'arrow-left'}
          size={size ? size : 30}
          color="white"
        />
      </Pressable>

      {/* Title in the center with dynamic length */}
      <Text
        style={[styles.appbarText]}
        numberOfLines={1} // Limit to one line, will add ellipsis if title is too long
        ellipsizeMode="tail" // Show ellipsis at the end if text overflows
      >
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
    justifyContent: 'center',
    backgroundColor: DARKGREEN,
    height: HEIGHT * 0.08,
    // paddingHorizontal: 15,
    position: 'relative', // To allow the title to be absolutely positioned.
  },
  iconContainer: {
    position: 'absolute',
    left: 15, // Pushes the icon to the left side with some padding.
  },
  appbarText: {
    color: WHITE,
    fontSize: RFPercentage(2.5),
    fontFamily: BOLD,
    position: 'absolute',
    top: '50%', // Vertically centers the title.
    transform: [{translateY: -10}], // Fine-tune vertical centering.
    textAlign: 'center',
    // width: '80%', // Ensures the title takes up only a part of the space
    // paddingHorizontal: 10, // Adds some padding to ensure text doesn't touch the edges
    overflow: 'hidden', // Hide overflowing text beyond the allocated space
  },
});
