import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {ParallelPicker} from 'react-native-slidepicker';
import COLORS from '../consts/colors';

const ParaData = [
  [
    {
      name: '15min',
      id: 15,
    },
    {
      name: '30min',
      id: 30,
    },
    {
      name: '45min',
      id: 45,
    },
    {
      name: '60min',
      id: 60,
    },
  ],
  [
    {
      name: '地铁+公交',
      id: 2,
    },
    {
      name: '地铁',
      id: 1,
    },
    {
      name: '公交',
      id: 0,
    },
  ],
];

export class SelectPicker extends Component {
  users = [
    {label: '请选择性别', value: ''},
    {label: '男', value: 'male'},
    {label: '女', value: 'female'},
    {label: '其它', value: 'other'},
  ];
  state = {user: ''};
  updateUser = user => {
    this.setState({user: user});
  };

  confirm = data => {
    console.info('confirm', data);
    this.props.handleOk(data[0].id, data[1].id)
  }
  cancel = data => {
    this.props.handleCancel();
  };

  render() {
    return (
      //<View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.3)'}}>
      <View style={styles.container}>
        <ParallelPicker
          dataSource={ParaData}
          cancel={this.cancel}
          confirm={this.confirm}
          pickerStyle={{
            activeBgColor: 'rgba(220, 220, 220, 0.3)',
            activeFontColor: 'black',
            activeFontSize: 16,
            normalFontColor: 'grey',
            normalFontSize: 15,
            visibleNum: 3,
          }}
          headOptions={{
            confirmText: '确认',
            cancelText: '取消',
            headHeight: 40,
            confirmStyle: {
              color: '#696969',
              fontSize: 16,
              fontWeight: 'bold',
              marginRight: 15,
            },
            cancelStyle: {
              color: '#696969',
              fontSize: 16,
              fontWeight: 'bold',
              marginLeft: 15,
            },
          }}
        />
      </View>
      //</View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: 250,
    padding: 10,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: '50%',
  },
  label: {
    fontSize: 14,
    color: '#333333',
  },
  text: {
    fontSize: 30,
    alignSelf: 'center',
    color: 'red',
  },
});
