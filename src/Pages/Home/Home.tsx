import React, {Fragment, useState} from 'react';
import {
  StyleSheet,
  Platform,
  StatusBar,
  SafeAreaView,
  View,
  Pressable,
  FlatList,
  Text,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // Gradient for Background
import {HEIGHT, MyStatusBar, WIDTH} from '../../constants/config';
import {WHITE, DARKGREEN, GREEN, GRAY} from '../../constants/color';
import {Avatar, Icon} from 'react-native-paper';
import {splashStyles} from '../Splash/SplashStyles';
import {RefreshControl} from 'react-native-gesture-handler';
import {NavigationProp, DrawerActions} from '@react-navigation/native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import DataTableComponent from './DataTableComponent';

// Define type for item
type Item = {
  id: number;
  name: string;
  age: number;
};

// Define Props for Home component
interface HomeProps {
  navigation: NavigationProp<any>;
}

// Function to get dynamic gradient colors based on ID
const getGradient = (id: number) => {
  const gradients = [
    ['#FF5733', '#FF8D1A'], // Red-Orange
    ['#33B5E5', '#0099CC'], // Blue
    ['#2ECC71', '#27AE60'], // Green
    ['#FFC107', '#FF9800'], // Yellow-Orange
    ['#9C27B0', '#673AB7'], // Purple
    ['#607D8B', '#455A64'], // Gray
  ];
  return gradients[id % gradients.length]; // Rotate gradients
};

// RenderBox Component with platform-specific shadow and avatar
const RenderBox: React.FC<{item: Item}> = ({item}) => (
  <View style={styles.box}>
    {/* Box Icon with Gradient */}
    <LinearGradient
      colors={getGradient(item.id)}
      style={styles.BoxIcon}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}>
      <Avatar.Icon
        size={40}
        icon="form-select"
        color={WHITE}
        style={{backgroundColor: 'transparent'}}
      />
    </LinearGradient>

    {/* Box Details */}
    <View style={styles.BoxDetails}>
      <Text style={[styles.boxText]}>{item.age}</Text>
      <Text style={styles.boxText1}>{item.name}</Text>
    </View>
  </View>
);

// Home Component
const Home: React.FC<HomeProps> = ({navigation}) => {
  const DATA: Item[] = [
    {id: 1, name: 'Total Applied', age: 25},
    {id: 2, name: 'Department Rejected', age: 30},
    {id: 3, name: 'Submit IR', age: 28},
    {id: 4, name: 'Confirm Medical Test', age: 27},
    {id: 5, name: 'Total Gatepass', age: 26},
  ];

  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const items = [
    {
      key: 1,
      name: 'Chocolate Cake',
      calories: 400,
      fat: 25,
      sugar: 50,
      protein: 10,
      carbs: 60,
      vitamin: 'A',
      water: '50%',
    },
    {
      key: 2,
      name: 'Ice Cream',
      calories: 300,
      fat: 15,
      sugar: 30,
      protein: 5,
      carbs: 45,
      vitamin: 'B',
      water: '60%',
    },
    // ... more items
  ];

  const columns = [
    'Calories',
    'Fat',
    'Sugar',
    'Protein',
    'Carbs',
    'Vitamin',
    'Water',
  ];

  const from = page * itemsPerPage;
  const to = Math.min(from + itemsPerPage, items.length);
  return (
    <Fragment>
      <MyStatusBar backgroundColor={DARKGREEN} barStyle="light-content" />
      <SafeAreaView
        style={[
          splashStyles.maincontainer,
          {
            // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,ß
          },
        ]}>
        {/* App Bar */}
        <View style={styles.appbar}>
          <Pressable
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
            <Icon
              size={40}
              source="microsoft-xbox-controller-menu"
              color="white"
            />
          </Pressable>
          <Text style={styles.appbarText}>OverView</Text>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          refreshControl={<RefreshControl refreshing={false} />}
          contentContainerStyle={styles.container}>
          <FlatList
            data={DATA}
            renderItem={({item}) => <RenderBox item={item} />}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={false} // Prevent scroll conflicts inside ScrollView
          />

          {/* <DataTable columns={columns} data={data} /> */}
          <DataTableComponent
            title="List to Confirm for Training"
            items={items}
            columns={columns}
            page={page}
            itemsPerPage={itemsPerPage}
            setPage={setPage}
            from={from}
            to={to}
            onItemsPerPageChange={setItemsPerPage}
          />
          <DataTableComponent
            title="List to Confirm for Test Slot"
            items={items}
            columns={columns}
            page={page}
            itemsPerPage={itemsPerPage}
            setPage={setPage}
            from={from}
            to={to}
            onItemsPerPageChange={setItemsPerPage}
          />
          <DataTableComponent
            title="List to Submit IR Documents"
            items={items}
            columns={columns}
            page={page}
            itemsPerPage={itemsPerPage}
            setPage={setPage}
            from={from}
            to={to}
            onItemsPerPageChange={setItemsPerPage}
          />
          <DataTableComponent
            title="List to Confirm HR Verification"
            items={items}
            columns={columns}
            page={page}
            itemsPerPage={itemsPerPage}
            setPage={setPage}
            from={from}
            to={to}
            onItemsPerPageChange={setItemsPerPage}
          />
          <DataTableComponent
            title="List of gatepass Pending"
            items={items}
            columns={columns}
            page={page}
            itemsPerPage={itemsPerPage}
            setPage={setPage}
            from={from}
            to={to}
            onItemsPerPageChange={setItemsPerPage}
          />
          <DataTableComponent
            title="List of gatepass Released"
            items={items}
            columns={columns}
            page={page}
            itemsPerPage={itemsPerPage}
            setPage={setPage}
            from={from}
            to={to}
            onItemsPerPageChange={setItemsPerPage}
          />
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

export default Home;

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: WHITE,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    backgroundColor: WHITE,
    alignItems: 'center',
    // justifyContent: 'center',
    paddingVertical: 20,
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
  box: {
    width: WIDTH * 0.9,
    height: HEIGHT * 0.1,
    backgroundColor: WHITE,
    borderColor: 'black',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,

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
    height: '70%',
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
    fontWeight: '600',
    color: GREEN,
  },
  boxText1: {
    fontSize: RFPercentage(1.25),
    fontWeight: '600',
    color: GRAY,
  },
});
