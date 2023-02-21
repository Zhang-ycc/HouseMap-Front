import React, {Component} from 'react';
import {View, Text, StyleSheet, Pressable, Image} from 'react-native';
import SplitLine from './SplitLine';

export class BusLine extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const bus = this.props.bus;
    return (
      <View>
        <Text style={style.item}>
          全程 {(bus.duration / 60).toFixed(0)}分钟
        </Text>
        <Text style={style.route}> {bus.cost}元</Text>
        <SplitLine />
        {bus.segments.map((item, index) => {
          return (
            <View key={index} numberOfLines={index + 1}>
              {item.bus.buslines.length>0 ? (
                <View>
                  <Text style={style.item}>{item.bus.buslines[0].departure_stop.name}</Text>
                  <Text style={style.route}>{item.bus.buslines[0].name}</Text>
                  <Text style={style.route}>
                    乘坐{parseInt(item.bus.buslines[0].via_num, 10) + 1}站
                    （{(item.bus.buslines[0].duration / 60).toFixed(0)}分钟）
                  </Text>
                  {item.bus.buslines[0].via_stops.map((stop, i) => {
                    return (
                      <Text style={style.stop} key={i}>
                        {stop.name}
                      </Text>
                    );
                  })}
                  <Text style={style.item}>
                    {item.bus.buslines[0].arrival_stop.name}
                  </Text>
                  <SplitLine />
                </View>
              ) : (
                <></>
              )}
            </View>
          );
        })}
      </View>
    );
  }
}

const style = StyleSheet.create({
  item: {
    color: 'rgba(105,105,105,1)',
    fontSize: 18,
    paddingVertical: 10,
    marginLeft: 30,
    fontWeight: '500',
  },
  route: {
    fontSize: 15,
    paddingVertical: 5,
    padding: 10,
    marginLeft: 20,
  },
  stop: {
    color: 'rgba(128,128,128,0.6)',
    fontSize: 15,
    paddingVertical: 5,
    padding: 10,
    marginLeft: 20,
  },
});
