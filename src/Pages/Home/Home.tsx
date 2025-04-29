import React, {Fragment, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Platform,
  StatusBar,
  SafeAreaView,
  View,
  FlatList,
  Text,
  ScrollView,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // Gradient for Background
import {HEIGHT, MyStatusBar, WIDTH} from '../../constants/config';
import {
  WHITE,
  GRAY,
  BLACK,
  PURPLELIGHT,
  BRAND,
  BRANDBLUE,
} from '../../constants/color';
import {splashStyles} from '../Splash/SplashStyles';
import {RefreshControl} from 'react-native-gesture-handler';
import {NavigationProp, DrawerActions} from '@react-navigation/native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import DataTableComponent from './DataTableComponent';
import Toast, {BaseToast} from 'react-native-toast-message';
import {BASE_URL} from '../../constants/url';
import {GETNETWORK} from '../../utils/Network';
import {Icon} from 'react-native-elements';
import TitleHeader from '../Forms/TitleHeader';
import {BOLD, SEMIBOLD} from '../../constants/fontfamily';
import {Loader} from '../../components/Loader';

// Define type for item
type Item = {
  id: number;
  name: string;
  age: number;
  icon: string;
};

// Define Props for Home component
interface HomeProps {
  navigation: NavigationProp<any>;
}

// Function to get dynamic gradient colors based on ID
const getGradient = (state: number) => {
  const gradients = [
    ['#FF5733', '#FF8D1A'], // Red-Orange
    ['#33B5E5', '#0099CC'], // Blue
    ['#2ECC71', '#27AE60'], // Green
    ['#FFC107', '#FF9800'], // Yellow-Orange
    ['#9C27B0', '#673AB7'], // Purple
    ['#607D8B', '#455A64'], // Gray
  ];
  return gradients[state % gradients.length]; // Rotate gradients based on `state`
};

const getIcons = () => {
  const icons = [
    {name: 'book', color: WHITE},
    {name: 'graduation-cap', color: WHITE},
  ];
  return icons[page % icons.length]; // Rotate icons based on `page`
};

const formatDateTime = (isoString: string) => {
  const dateObj = new Date(isoString);

  const formattedDate = dateObj.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const formattedTime = dateObj.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true, // Converts to 12-hour format with AM/PM
  });

  return `${formattedDate}, ${formattedTime}`;
};

// RenderBox Component with platform-specific shadow and avatar

const RenderBox: React.FC<{
  item: any;
  index: number;
  scrollY: Animated.Value;
}> = ({item, index, scrollY}) => {
  // Interpolating size based on scroll
  const scale = scrollY.interpolate({
    inputRange: [0, 200], // Scroll range
    outputRange: [1, 0.8], // Shrinks to 80%
    extrapolate: 'clamp',
  });

  const opacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0.5], // Reduces opacity while scrolling
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[styles.box, {transform: [{scale}], opacity}]}>
      <LinearGradient
        colors={getGradient(index)}
        style={styles.BoxIcon}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}>
        <Icon size={30} type="font-awesome" name="book" color={WHITE} />
      </LinearGradient>

      <View style={styles.BoxDetails}>
        <Text style={[styles.boxText]}>{item.value}</Text>
        <Text style={styles.boxText1}>{item.name}</Text>
      </View>
    </Animated.View>
  );
};

const RenderBox2: React.FC<{item: Item}> = ({item}) => (
  <View style={styles.box}>
    {/* Box Icon with Gradient */}
    <LinearGradient
      colors={getGradient(item.id)} // Ensure `state` is used dynamically
      style={styles.BoxIcon}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}>
      <Icon
        size={25}
        type="font-awesome"
        name="book" // Dynamically set icon
        color={WHITE}
        // style={{backgroundColor: 'transparent'}}
      />
    </LinearGradient>

    {/* Box Details */}
    <View style={styles.BoxDetails}>
      <Text style={[styles.boxText]}>{item.data_count}</Text>
      <Text style={styles.boxText2}>{item.description}</Text>
      <Text style={styles.boxText2}>{formatDateTime(item.date_updated)}</Text>
    </View>
  </View>
);

// Home Component
const Home: React.FC<HomeProps> = ({navigation}) => {
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [Token, setToken] = useState();
  const [DashboardItems, setDashboardItems] = useState();
  const [refreshing, Setrefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const showToast = (type, title, message) => {
    Toast.show({
      type: type,
      text1: title,
      text2: message,
      position: 'bottom',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 50,
    });
  };

  useEffect(() => {
    GetDashboard();
  }, []); // Empty array means it runs once when the component mounts

  const GetDashboard = async () => {
    Setrefreshing(true); // Start loading
    const url = `${BASE_URL}dashboard/`;

    try {
      const response = await GETNETWORK(url, true);

      if (!response || response.status === 504) {
        throw new Error('Server timeout (504). Please try again later.');
      }

      // console.log(
      //   'Dashboard details length:',
      //   response?.dashboard_details?.length,
      // );

      // If no dashboard details or empty array, call the forms API
      if (
        !response.dashboard_details ||
        response.dashboard_details.length === 0
      ) {
        const urll = `${BASE_URL}forms/menulistforuser/`;
        const responsee = await GETNETWORK(urll, true);
        // console.log('urll:', responsee);

        if (!responsee || responsee.status === 504) {
          throw new Error('Server timeout (504). Please try again later.');
        } else {
          setDashboardItems(responsee.data); // Set data from forms API
          Setrefreshing(false);
          showToast('success', 'DashBoard Update Successfully', '');
        }
      } else {
        // If there are dashboard details, set the dashboard data
        setDashboardItems(response.dashboard_details);
        Setrefreshing(false);
        showToast('success', 'DashBoard Update Successfully', '');
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error.message);
      Setrefreshing(false);
      alert(
        `Network Error: ${
          error.message ||
          'Something went wrong. Please check your internet connection and try again.'
        }`,
      );
      showToast('error', 'DashBoard Update Successful', `${error.message}`);
    } finally {
      Setrefreshing(false); // Stop loading
    }
  };

  const from = page * itemsPerPage;
  // console.log('dataset', JSON.stringify(DashboardItems, null, 2));

  return (
    <Fragment>
      <MyStatusBar backgroundColor={BRAND} barStyle="light-content" />
      <SafeAreaView style={[splashStyles.maincontainer]}>
        {/* App Bar */}
        <TitleHeader
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          title="Dash - board"
          left={WIDTH * 0.36}
          icon="menu-open"
          size={RFPercentage(5)}
        />

        {/* Scrollable Content */}
        <Animated.ScrollView
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}],
            {useNativeDriver: true},
          )}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl onRefresh={GetDashboard} refreshing={refreshing} />
          }
          contentContainerStyle={styles.container}>
          <FlatList
            data={DashboardItems}
            ListFooterComponent={<View style={styles.footer} />}
            renderItem={({item, index}) => {
              if (item.type === 'Card') {
                return (
                  <RenderBox item={item} index={index} scrollY={scrollY} />
                );
              }

              if (item.type === 'Table') {
                // Log the title before rendering
                const ignoredKeys = ['all_form_id', 'user_id', 'template_id'];
                const displayTitle = ignoredKeys.includes(item.key)
                  ? null
                  : item.key === 'max'
                  ? 'Stage'
                  : item.name;

                console.log('Rendering Table Title:', displayTitle);

                return (
                  <DataTableComponent
                    title={displayTitle}
                    items={item.value || []}
                    page={page}
                    itemsPerPage={itemsPerPage}
                    setPage={setPage}
                    from={from}
                    to={from + itemsPerPage}
                    onItemsPerPageChange={setItemsPerPage}
                  />
                );
              }

              return <RenderBox2 item={item} />;
            }}
            keyExtractor={item => item.id?.toString() || item.id}
            scrollEnabled={false}
          />
        </Animated.ScrollView>
      </SafeAreaView>
      <Toast />
      <Loader visible={refreshing} />
    </Fragment>
  );
};

export default Home;

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: GRAY,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    backgroundColor: WHITE,
    alignSelf: 'center',
    alignItems: 'center',
    // justifyContent: 'center',
    paddingVertical: 25,
  },
  box: {
    width: WIDTH * 0.95,
    height: HEIGHT * 0.1,
    backgroundColor: '#D5FFFF',
    borderColor: 'black',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 3,
    borderRadius: 10,
    alignSelf: 'center',

    // Cross-platform shadow
    ...Platform.select({
      ios: {
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        // elevation: 1,
      },
    }),
  },
  BoxIcon: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: Platform.OS === 'android' ? '70%' : '90%',
    width: '40%',
    borderRadius: 8,
  },
  BoxDetails: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxText: {
    fontSize: RFPercentage(2),
    fontFamily: SEMIBOLD,
    color: PURPLELIGHT,
  },
  boxText1: {
    fontSize: RFPercentage(1.5),
    fontFamily: SEMIBOLD,
    color: BLACK,
  },
  boxText2: {
    fontSize: RFPercentage(1.25),
    fontFamily: BOLD,
    color: GRAY,
  },
  footer: {
    height: 10,
    backgroundColor: WHITE,
    width: WIDTH,
    marginBottom: 10,
  },
});
