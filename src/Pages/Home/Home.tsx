import React from 'react';
import {
    StyleSheet,
    Text,
    SafeAreaView,
    Platform,
    StatusBar,
    View
} from 'react-native';
import { MyStatusBar } from '../../constants/config';
import { WHITE } from '../../constants/color';
import LinearGradient from 'react-native-linear-gradient';
import { Button, Avatar, Appbar } from 'react-native-paper';

const Home = () => {
    return (
        <>
            <MyStatusBar backgroundColor={'#ffffff'} barStyle={'dark-content'} />

            {/* Header with Avatar.Icon */}
            <Appbar.Header style={styles.header}>
                <Avatar.Icon size={24} icon="menu" />
            </Appbar.Header>

            <LinearGradient
                colors={['#ffffff', '#d3d3d3']} // White to grey gradient
                style={styles.container}
            >
                <Button icon="camera">
                    Press me
                </Button>
            </LinearGradient>
        </>
    );
};

export default Home;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: WHITE,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Ensures content doesn't overlap the status bar
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        backgroundColor: '#ffffff', // White background for the header
        elevation: 4, // Optional shadow for Android
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000', // Changed text color to black for contrast
    },
});
