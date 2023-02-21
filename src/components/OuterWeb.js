import React, {useEffect, useState} from 'react';
import WebView from 'react-native-webview';
import {StyleSheet, Text, View} from 'react-native';
import COLORS from '../consts/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import SplitLine from './SplitLine';
//import LoadView from 'react-native-loadview';

const OuterWeb = ({navigation, route}) => {
  useEffect(() => {
    console.log(route.params);
  });

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <View style={{height: 35, flexDirection: 'row'}}>
        <Icon
          name="arrow-back"
          size={24}
          onPress={navigation.goBack}
          style={{marginLeft: 15, marginTop: 5}}
        />
        <Icon
          name="ios-share-social-sharp"
          size={21}
          onPress={navigation.goBack}
          style={{marginLeft: '80%', marginTop: 5}}
        />
      </View>
      <SplitLine />
      <WebView
        ref={w => (global.webview = w)}
        source={{
          uri: route.params,
        }}
        style={{width: '100%', height: '100%'}}
        renderError={() => {
          console.log('renderError');
          return (
            <View>
              <Text>错误了</Text>
            </View>
          );
        }}
        //startInLoadingState
        //renderLoading={() => <LoadView />}
      />
    </View>
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
});

export default OuterWeb;
