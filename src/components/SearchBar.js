import React, {Component} from 'react';
import {
  Alert,
  PixelRatio,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../consts/colors';

//输入框组件
export class AutoSearch extends Component {
  //构造函数
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      show: false,
      textList: [],
      location: null,
    };
  }

  //组件渲染
  render() {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            zIndex: 3,
          }}>
          <View style={styles.searchInputContainer}>
            <TextInput
              underlineColorAndroid="transparent"
              placeholder="搜索地点"
              style={styles.input}
              returnKeyType="search"
              editable={this.props.able}
              value={this.state.text}
              onChangeText={e => {
                this.setState({
                  location: null,
                  text: e,
                });
                //this.onChangeHandler(e);
                this.textChange(e);
              }}
            />
            <TouchableOpacity onPress={this.clearText.bind(this)}>
              {this.state.text ? (
                <Text style={{width: 30}}>{'×'}</Text>
              ) : (
                <Text style={{width: 30}} />
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={this.search.bind(this)}>
              <Icon name="search" color={COLORS.grey} size={25} />
            </TouchableOpacity>
          </View>
        </View>
        {this.state.show && this.state.textList !== undefined ? (
          <View style={styles.list}>
            {this.state.textList.map((item, index) => {
              //console.log(item);
              return (
                <Text
                  onPress={this.hideList.bind(this, item)}
                  style={styles.item}
                  numberOfLines={index + 1}
                  key={index}>
                  {item.name}
                </Text>
              );
            })}
          </View>
        ) : null}
      </View>
    );
  }

  //输入框文字改变
  textChange = text => {
    if (text === '' || text === null) {
      this.clearText();
      return;
    }
    //console.log(text);
    axios(
      'https://restapi.amap.com/v3/assistant/inputtips?key=8a01f52e06594f6f69e651ee2cc8a0ac&keywords=' +
        text +
        '&city=上海&datatype=poi',
    )
      .then(responseJSON => {
        const data = JSON.parse(responseJSON.request._response);
        console.log(data);
        this.setState({
          show: true,
          textList: data.tips,
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  //隐藏自动提示列表
  hideList(text) {
    this.setState({
      show: false,
      text: text.name,
      location: text.location,
    });
  }

  clearText() {
    this.setState(
      {
        text: '',
        show: false,
        location: null,
      },
      () => {
        this.search();
      },
    );
  }

  //搜索按钮点击
  search() {
    this.setState({
      show: false,
    });
    if (this.state.location || this.state.text === '') {
      this.props.locate(this.state.location);
    } else {
      Alert.alert(' ', '请选择具体地点', [{text: '好的'}]);
    }
  }

  // debounce = (fn, delay) => {
  //   let timer = null;
  //   return function (event) {
  //     timer && clearTimeout(timer);
  //     event.persist && event.persist(); // 保留引用，已备异步阶段访问
  //     timer = setTimeout(() => {
  //       fn.call(this, event);
  //     }, delay);
  //   };
  // };
  //
  // onChangeHandler = this.debounce(this.textChange, 10);
}

//样式定义
const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  flexDirection: {
    flexDirection: 'row',
  },
  topStatus: {
    marginTop: 25,
  },
  inputHeight: {
    height: 45,
  },
  input: {
    height: 45,
    width: 250,
  },
  search: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  list: {
    marginTop: 1 / PixelRatio.get(),
    marginLeft: 5,
    marginRight: 5,
    borderColor: 'grey',
    backgroundColor: 'white',
    //borderTopWidth: 1 / PixelRatio.get(),
    borderRadius: 10,
  },
  item: {
    fontSize: 15,
    padding: 5,
    paddingTop: 10,
    paddingBottom: 10,
    borderWidth: 1 / PixelRatio.get(),
    borderColor: '#fff',
    borderTopWidth: 0,
    marginLeft: 10,
  },
  searchInputContainer: {
    height: 50,
    backgroundColor: COLORS.white,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowOffset: {width: 10, height: 10},
    shadowColor: COLORS.grey,
    shadowOpacity: 100,
  },
});
