/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import COLORS from '../consts/colors';
import Background from '../assets/1_1.jpg';
import axios from '../utils/axios';
import {storage} from '../utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CounterEmitter from '../utils/CountEmitter';

const {width} = Dimensions.get('screen');

const LoginScreen = ({navigation}) => {
  const [userEmail, setEmail] = useState();
  const [password, setPW] = useState();

  function login() {
    axios
      .post('/logIn', {
        email: userEmail,
        password: password,
      })
      .then(responseJSON => {
        if (responseJSON) {
          const data = JSON.parse(responseJSON.request._response);
          console.log(data);
          storage
            .save({
              key: 'token',
              data: data,
            })
            .then(r => {
              CounterEmitter.emit('update');
              navigation.goBack();
            });
        }
      })
      .catch(err => {
        console.log(err);
        console.log(err.name);
        Alert.alert('登陆失败', '\n用户名或密码错误(´,,•∀•,,`)', [
          {text: '好的'},
          {text: '注册', onPress: () => navigation.navigate('SignUpScreen')},
        ]);
      });
  }

  return (
    <SafeAreaView style={{backgroundColor: COLORS.white, flex: 1}}>
      <View style={style.card}>
        <Image source={Background} style={style.cardImage} />
        <View style={{marginTop: 20}}>
          <View style={styles.inputField}>
            <TextInput
              placeholderTextColor="#444"
              placeholder="请输入邮箱"
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              autoFocus={true}
              style={{fontSize: 20}}
              onChangeText={e => {
                setEmail(e);
              }}
            />
          </View>
        </View>
        <View style={{marginTop: 20}}>
          <View style={styles.inputField}>
            <TextInput
              secureTextEntry={true}
              placeholderTextColor="#444"
              placeholder="请输入密码"
              autoCapitalize="none"
              keyboardType="visible-password"
              textContentType="password"
              autoFocus={true}
              style={{fontSize: 20}}
              onChangeText={e => {
                setPW(e);
              }}
            />
          </View>
        </View>
      </View>

      {/* button */}
      <TouchableOpacity style={style.btn} onPress={() => login()}>
        <Text style={{color: 'white', fontSize: 15}}>登录</Text>
      </TouchableOpacity>

      <View style={{marginLeft: '70%', marginTop: 30, flexDirection: 'row'}}>
        <TouchableOpacity onPress={navigation.goBack}>
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>跳过</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
          <Text style={{fontSize: 16, fontWeight: 'bold', marginLeft: 20}}>
            注册
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const style = StyleSheet.create({
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  profileImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  inputField: {
    borderRadius: 4,
    padding: 6,
    backgroundColor: COLORS.light,
    marginBottom: 10,
    borderWidth: 1,
    justifyContent: 'center',
  },
  searchInputContainer: {
    height: 50,
    backgroundColor: COLORS.light,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  sortBtn: {
    backgroundColor: COLORS.dark,
    height: 50,
    width: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
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
  btn: {
    height: 40,
    width: 100,
    marginHorizontal: 20,
    marginTop: 10,
    marginLeft: 130,
    backgroundColor: 'black',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
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
    height: 300,
    backgroundColor: COLORS.white,
    elevation: 10,
    width: width - 40,
    padding: 15,
    borderRadius: 20,
    margin: 20,
    marginTop: 150,
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderRadius: 15,
  },
  facility: {flexDirection: 'row', marginRight: 15},
  facilityText: {marginLeft: 5, color: COLORS.grey},
});
