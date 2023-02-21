import React, {Component} from 'react';
import {View, Text, ProgressBarAndroid, Modal, StyleSheet} from 'react-native';
import COLORS from '../consts/colors';

export default class Loading extends Component {
  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {};
  }

  render() {
    return (
      <Modal transparent={true} onRequestClose={() => this.onRequestClose()}>
        <View style={styles.loadingBox}>
          <ProgressBarAndroid styleAttr="Inverse" color="#79abc9" />
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  loadingBox: {
    // Loading居中
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)', // 半透明
  },
});
