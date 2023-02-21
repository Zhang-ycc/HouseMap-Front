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
import CounterEmitter from '../utils/CountEmitter';

const {width} = Dimensions.get('screen');

const SignUpScreen = ({navigation}) => {
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPW] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errorIndex, setError] = useState(null);
  const message = [
    '',
    '请输入正确的邮箱格式',
    '密码应为6-15位的字母和数字',
    '密码不一致',
  ];

  function signUp() {
    if (errorIndex === 0 && username && email && password && confirm) {
      axios
        .post('/signUp', {
          username: username,
          email: email,
          password: password,
        })
        .then(responseJSON => {
          if (responseJSON) {
            const data = JSON.parse(responseJSON.request._response);
            console.log(data);
            if (data.userId) {
              axios
                .post('/logIn', {
                  email: data.email,
                  password: data.password,
                })
                .then(response => {
                  if (response) {
                    const _data = JSON.parse(response.request._response);
                    console.log(_data);
                    storage
                      .save({
                        key: 'token',
                        data: _data,
                      })
                      .then(r => {
                        CounterEmitter.emit('update');
                        navigation.navigate('ProfileScreen');
                      });
                  }
                });
            } else {
              Alert.alert('注册失败QAQ', '\n该邮箱已被注册(´つヮ⊂︎)', [
                {text: '好的'},
              ]);
            }
          }
        })
        .catch(err => {
          console.log(err.name);
          Alert.alert('注册失败', '\n出错啦', [{text: '好的'}]);
        });
    } else {
      Alert.alert('注册失败', '\n请输入正确格式(•̀⌄•́)', [{text: '好的'}]);
    }
  }

  function emailChange(e) {
    setEmail(e);
    const reg =
      /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
    if (!reg.test(e)) {
      setError(1);
    } else {
      setError(0);
    }
  }

  function pwChange(e) {
    setPW(e);
    const reg = /^((?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16})$/;
    if (!reg.test(e)) {
      setError(2);
    } else {
      setError(0);
    }
  }

  function confirmPW(e) {
    setConfirm(e);
    if (password !== e) {
      setError(3);
    } else {
      setError(0);
    }
  }

  return (
    <SafeAreaView style={{backgroundColor: COLORS.white, flex: 1}}>
      {errorIndex !== 0 && errorIndex ? (
        <View style={style.alert}>
          <Text style={{color: 'white', fontSize: 15}}>
            {message[errorIndex]}
          </Text>
        </View>
      ) : (
        <View style={{marginTop: 80}} />
      )}
      <View style={style.card}>
        <Image source={Background} style={style.cardImage} />
        <View style={{marginTop: 20}}>
          <View style={styles.inputField}>
            <TextInput
              placeholderTextColor="#444"
              placeholder="昵称"
              autoCapitalize="none"
              keyboardType="name-phone-pad"
              textContentType="name"
              autoFocus={true}
              style={{fontSize: 20}}
              value={username}
              onChangeText={e => setName(e)}
            />
          </View>
        </View>
        <View style={{marginTop: 20}}>
          <View style={styles.inputField}>
            <TextInput
              placeholderTextColor="#444"
              placeholder="邮箱"
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              autoFocus={true}
              style={{fontSize: 20}}
              value={email}
              onChangeText={e => emailChange(e)}
            />
          </View>
        </View>
        <View style={{marginTop: 20}}>
          <View style={styles.inputField}>
            <TextInput
              placeholderTextColor="#444"
              placeholder="密码"
              autoCapitalize="none"
              keyboardType="visible-password"
              textContentType="password"
              autoFocus={true}
              style={{fontSize: 20}}
              value={password}
              onChangeText={e => pwChange(e)}
            />
          </View>
        </View>
        <View style={{marginTop: 20}}>
          <View style={styles.inputField}>
            <TextInput
              placeholderTextColor="#444"
              placeholder="确认密码"
              autoCapitalize="none"
              keyboardType="visible-password"
              textContentType="password"
              autoFocus={true}
              style={{fontSize: 20}}
              value={confirm}
              onChangeText={e => confirmPW(e)}
            />
          </View>
        </View>
      </View>

      {/* button */}
      <TouchableOpacity onPress={() => signUp()} style={style.btn}>
        <Text style={{color: 'white', fontSize: 15}}>注册</Text>
      </TouchableOpacity>

      <View style={{marginLeft: '55%', marginTop: 30, flexDirection: 'row'}}>
        <Text style={{fontSize: 16, fontWeight: 'bold', marginLeft: 20}}>
          已有帐号？
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={{fontSize: 16, fontWeight: 'bold', marginLeft: 10}}>
            登录
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignUpScreen;

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
    backgroundColor: 'black',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
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
    height: 420,
    backgroundColor: COLORS.white,
    elevation: 10,
    width: width - 40,
    padding: 15,
    borderRadius: 20,
    margin: 20,
    marginTop: 40,
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderRadius: 15,
  },
  alert: {
    height: 40,
    marginTop: 40,
    backgroundColor: '#FFD700',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 10,
  },
  facility: {flexDirection: 'row', marginRight: 15},
  facilityText: {marginLeft: 5, color: COLORS.grey},
});
