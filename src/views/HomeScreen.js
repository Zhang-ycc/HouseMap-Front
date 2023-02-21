import React, {useRef, useState} from 'react';
import {
  SafeAreaView,
  View,
  StatusBar,
  Text,
  TextInput,
  FlatList,
  Dimensions,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  Button,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import COLORS from '../consts/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
const {width} = Dimensions.get('screen');
import houses from '../consts/houses';
import NavMenu, {bottomTabIcons} from './NavMenu';
import Map from '../components/MapView';
import DropDownPicker from 'react-native-dropdown-picker';

const HomeScreen = ({navigation, route}) => {
  return (
    <SafeAreaView style={{backgroundColor: COLORS.white, flex: 1}}>
      <NavMenu
        routeName={route.name}
        icons={bottomTabIcons}
        navigation={navigation}
      />
      {/* Customise status bar */}
      <StatusBar
        translucent={false}
        backgroundColor={COLORS.white}
        barStyle="dark-content"
      />
      {/* Header container */}
      <View style={style.header}>
        <View>
          <Text style={{color: COLORS.grey}}>城市</Text>
          <Text style={{color: COLORS.dark, fontSize: 20, fontWeight: 'bold'}}>
            上海
          </Text>
        </View>
      </View>
      <Map navigation={navigation} />
      {/*</ScrollView>*/}
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  header: {
    // paddingVertical: 10,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  profileImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  optionsCard: {
    height: 210,
    width: width / 2 - 30,
    elevation: 15,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  optionsCardImage: {
    height: 140,
    borderRadius: 10,
    width: '100%',
  },
  optionListsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  categoryListText: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingBottom: 5,
    color: COLORS.grey,
  },
  line: {
    width: 35,
    height: 5,
    backgroundColor: 'black',
    alignSelf: 'center',
    //marginTop: 0,
    borderRadius: 2,
  },
  btn: {
    height: 40,
    width: width,

    // marginHorizontal: 20,
    // marginTop: 10,
    // marginTop: '150%',
    backgroundColor: 'rgb(255,255,255)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  activeCategoryListText: {
    color: COLORS.dark,
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  categoryListContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    paddingHorizontal: 40,
  },
  card: {
    height: 250,
    backgroundColor: COLORS.white,
    elevation: 10,
    width: width - 40,
    marginRight: 20,
    padding: 15,
    borderRadius: 20,
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderRadius: 15,
  },
  facility: {flexDirection: 'row', marginRight: 15},
  facilityText: {marginLeft: 5, color: COLORS.grey},
});
export default HomeScreen;
