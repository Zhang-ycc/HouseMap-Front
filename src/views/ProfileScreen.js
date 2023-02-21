import React, {useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import COLORS from '../consts/colors';
import NavMenu, {bottomTabIcons} from './NavMenu';
import Background from '../assets/1_1.jpg';
import {storage} from '../utils/storage';
import axios from '../utils/axios';

import CounterEmitter from '../utils/CountEmitter';
const {width} = Dimensions.get('screen');

const ProfileScreen = ({navigation, route}) => {
  const [userInfo, setUserInfo] = useState(null);
  const [editShow, setEdit] = useState(false);
  const [newInfo, setNewInfo] = useState({
    username: null,
    address: null,
    telephone: null,
  });
  const [token, setToken] = useState();

  function update() {
    storage
      .load({
        key: 'token',
      })
      .then(r => {
        console.log(r);
        setUserInfo(r.user);
        setNewInfo(r.user);
        setToken(r.token);
      })
      .catch(err => {
        //console.warn(err.name);
        switch (err.name) {
          case 'NotFoundError':
            setUserInfo(null);
            break;
          case 'ExpiredError':
            break;
        }
      });
  }

  function saveInfo() {
    const reg = /^[0-9-()]{7,18}$/;
    if (!reg.test(newInfo.telephone)) {
      Alert.alert('(´つヮ⊂︎)', '\n请输入有效号码', [{text: '好的'}]);
      return;
    }
    axios
      .post('/editInfo', {
        userId: userInfo.userId,
        username: newInfo.username,
        address: newInfo.address,
        telephone: newInfo.telephone,
      })
      .then(r => {
        const user = JSON.parse(r.request._response);
        const data = {
          user: user,
          token: token,
        };
        storage
          .save({
            key: 'token',
            data: data,
          })
          .then(r => setEdit(false));
        update();
        Alert.alert('提示', '\n编辑成功！', [{text: '好的'}]);
      })
      .catch(err => {
        console.log(err.name);
        Alert.alert('出错了', '\n编辑失败', [{text: '好的'}]);
      });
  }

  useEffect(() => {
    update();
    CounterEmitter.addListener('update', () => {
      update();
    });
  }, [userInfo, editShow]);

  return (
    <SafeAreaView style={{backgroundColor: COLORS.white, flex: 1}}>
      <NavMenu
        routeName={route.name}
        icons={bottomTabIcons}
        navigation={navigation}
      />
      {userInfo ? (
        <>
          <View style={style.card}>
            {/* House image */}
            <Image source={Background} style={style.cardImage} />
            <View style={{marginTop: 10}}>
              {/* Title and price container */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                  {userInfo.username}
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                    paddingBottom: 15,
                    marginLeft: -20,
                    marginTop: 8,
                  }}>
                  {/* button */}
                  <TouchableOpacity
                    onPress={() => {
                      storage
                        .remove({key: 'token'})
                        .then(r => CounterEmitter.emit('update'));
                    }}
                    style={style.btn}>
                    <Text style={{color: 'white', fontSize: 15}}>退出登录</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <View style={style.card}>
            <View style={{marginTop: 10}}>
              {/* Title and price container */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                <Text
                  style={{fontSize: 16, fontWeight: 'bold', lineHeight: 30}}>
                  个人信息
                </Text>
              </View>
              <Text style={{fontSize: 16, color: COLORS.grey, lineHeight: 30}}>
                昵称：{userInfo.username}
              </Text>
              <Text style={{fontSize: 16, color: COLORS.grey, lineHeight: 30}}>
                地址：{userInfo.address}
              </Text>
              <Text style={{fontSize: 16, color: COLORS.grey, lineHeight: 30}}>
                电话：{userInfo.telephone}
              </Text>
              <Text style={{fontSize: 16, color: COLORS.grey, lineHeight: 30}}>
                邮箱：{userInfo.email}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                paddingBottom: 15,
                marginLeft: -20,
              }}>
              {/* button */}
              <TouchableOpacity onPress={() => setEdit(true)} style={style.btn}>
                <Text style={{color: 'white', fontSize: 15}}>编辑</Text>
              </TouchableOpacity>
            </View>
            <Modal
              visible={editShow}
              animationType={'fade'}
              transparent={true}
              onRequestClose={() => {
                setEdit(false);
              }}>
              <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.3)'}}>
                <View style={style.edit}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={style.modalText}>昵称：</Text>
                    <TextInput
                      placeholderTextColor="#444"
                      value={newInfo.username}
                      style={{fontSize: 16}}
                      onChangeText={e =>
                        setNewInfo({
                          username: e,
                          address: newInfo.address,
                          telephone: newInfo.telephone,
                        })
                      }
                    />
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={style.modalText}>地址：</Text>
                    <TextInput
                      placeholderTextColor="#444"
                      value={newInfo.address}
                      style={{fontSize: 16}}
                      onChangeText={e =>
                        setNewInfo({
                          username: newInfo.username,
                          address: e,
                          telephone: newInfo.telephone,
                        })
                      }
                    />
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={style.modalText}>电话：</Text>
                    <TextInput
                      placeholderTextColor="#444"
                      value={newInfo.telephone}
                      style={{fontSize: 16}}
                      onChangeText={e =>
                        setNewInfo({
                          username: newInfo.username,
                          address: newInfo.address,
                          telephone: e,
                        })
                      }
                    />
                  </View>
                  <View style={{flexDirection: 'row', marginTop: 8}}>
                    <Pressable onPress={() => setEdit(false)}>
                      <View style={style.btn}>
                        <Text style={{color: 'white', fontSize: 15}}>取消</Text>
                      </View>
                    </Pressable>
                    <Pressable onPress={() => saveInfo()}>
                      <View style={style.btn}>
                        <Text style={{color: 'white', fontSize: 15}}>保存</Text>
                      </View>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </>
      ) : (
        <View style={style.card}>
          <Image source={Background} style={style.cardImage} />
          <View style={{marginTop: 10}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                您没有登录
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: 8}}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  paddingBottom: 15,
                  marginLeft: 15,
                }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('LoginScreen')}
                  style={style.btn}>
                  <Text style={{color: 'white', fontSize: 15}}>登录</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  paddingBottom: 15,
                  marginLeft: 0,
                }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('SignUpScreen')}
                  style={style.btn}>
                  <Text style={{color: 'white', fontSize: 15}}>注册</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const style = StyleSheet.create({
  modalText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  text: {
    fontSize: 16,
    color: COLORS.grey,
    lineHeight: 30,
  },
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
    backgroundColor: 'grey',
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
    height: 265,
    backgroundColor: COLORS.white,
    elevation: 10,
    width: width - 40,
    padding: 15,
    borderRadius: 20,
    margin: 20,
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderRadius: 15,
  },
  edit: {
    height: 265,
    backgroundColor: COLORS.white,
    elevation: 10,
    width: width - 40,
    padding: 15,
    borderRadius: 20,
    margin: 20,
    marginTop: '50%',
  },
  inputField: {
    borderRadius: 6,
    padding: 1,
    backgroundColor: COLORS.light,
    marginBottom: 10,
    borderWidth: 1,
    justifyContent: 'center',
  },
  facility: {flexDirection: 'row', marginRight: 15},
  facilityText: {marginLeft: 5, color: COLORS.grey},
});
