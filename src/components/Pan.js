import React, {Component} from 'react';
import {View, PanResponder, Dimensions, StyleSheet} from 'react-native';
import {Surface, Shape, Path} from '@react-native-community/art';

const {height, width} = Dimensions.get('window');
let path;

class Pan extends React.Component {
  state = {
    coordinates: [], // 线路
  };

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._onPanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
    });
  }

  _handleStartShouldSetPanResponder = (e, gestureState) => {
    // 响应触摸
    return true;
  };

  _handleMoveShouldSetPanResponder = (e, gestureState) => {
    // 响应移动
    return true;
  };

  _handlePanResponderGrant = (e, gestureState) => {
    //  响应移动操作
    let coordinates = this.state.coordinates.concat([
      {
        x: e.nativeEvent.locationX,
        y: e.nativeEvent.locationY,
      },
    ]);
    this.setState({coordinates});
  };

  _onPanResponderMove = (e, gestureState) => {
    // 最近一次的移动距离
    let coordinates = this.state.coordinates.concat([
      {
        x: e.nativeEvent.locationX,
        y: e.nativeEvent.locationY,
      },
    ]);
    this.props.handleDraw({
      x: e.nativeEvent.locationX,
      y: e.nativeEvent.locationY,
    });
    this.setState({coordinates});
  };

  _handlePanResponderEnd = () => {
    // 结束触摸
    this.props.handleEnd();
    this.setState({
      coordinates: [],
    });
  };
  render() {
    path = Path();
    this.state.coordinates.forEach((item, index) => {
      // ios获取的x,y有时候为0，android正常，这里需要处理一下
      if (index == 0) {
        path.moveTo(item.x, item.y);
      } else {
        path.lineTo(item.x, item.y);
      }
    });

    return (
      <View
        style={{flex: 1, backgroundColor: 'rgba(0,0,0,0)', zIndex: 2}}
        {...this._panResponder.panHandlers}>
        <Surface width={width} height={height}>
          <Shape d={path} stroke="#5f82e6" strokeWidth={3} />
        </Surface>
      </View>
    );
  }
}
export default Pan;
