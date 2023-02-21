import React from 'react';
import {
  Alert,
  Linking,
  PixelRatio,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {AMapSdk, MapType, MapView, Marker, Polyline} from 'react-native-amap3d';
import COLORS from '../consts/colors';
import {FloatingAction} from 'react-native-floating-action';
import Icon from 'react-native-vector-icons/MaterialIcons';
import WebView from 'react-native-webview';
import axios from '../utils/axios';
import SplitLine from './SplitLine';
import {BusLine} from './BusLine';
import {Geolocation} from 'react-native-amap-geolocation';

const actions = [
  {
    text: '方案1',
    icon: require('../assets/icons8-pen-24.png'),
    name: '1',
    color: '#808080',
    position: 1,
  },
  {
    text: '方案2',
    icon: require('../assets/icons8-landscape-24.png'),
    name: '2',
    color: '#808080',
    position: 2,
  },
  {
    text: '方案3',
    icon: require('../assets/icons8-landscape-24.png'),
    name: '3',
    color: '#808080',
    position: 3,
  },
];

class MapNavigation extends React.Component {
  state = {
    navigation: [],
    time: 0,
    distance: 0,
    selected: 0,
    strategies: 0,
    url: '',
    navi: null,
    bus: false,
  };
  componentDidMount() {
    /* key值初始化 */
    AMapSdk.init(
      Platform.select({
        android: '3990fde4b914099e86cfd719d7db8e4c',
      }),
    );
    this.SelectMethod(0);
    const des = this.props.route.params.position;
    const name = this.props.route.params.name;
    this.getPosition(coords => {
      const request =
        'androidamap://route?sid=BGVIS1&slat=' +
        coords.latitude +
        '&slon=' +
        coords.longitude +
        '&sname=当前位置' +
        '&did=BGVIS2&dlat=' +
        des.latitude +
        '&dlon=' +
        des.longitude +
        '&dname=' +
        name +
        '&dev=0&m=0&t=2';
      console.log(request);
      this.setState({
        url: request,
      });
    });
  }

  categoryList = ['驾车', '步行', '骑行', '公交'];

  getPosition(callback) {
    Geolocation.getCurrentPosition(({coords}) => {
      this.mapView?.moveCamera(
        {
          zoom: 11,
          target: {
            longitude: coords.longitude,
            latitude: coords.latitude,
          },
        },
        10,
      );
      callback({
        longitude: coords.longitude,
        latitude: coords.latitude,
      });
    });
  }

  Navigate = (method, callback) => {
    this.setState({navigation: []});
    this.getPosition(e => {
      const paras = {
        key: '8a01f52e06594f6f69e651ee2cc8a0ac',
        origin: e,
        destination: this.props.route.params.position,
        version: method === 'bicycling' ? 'v4' : 'v3',
      };
      let serviceUrl =
        'https://restapi.amap.com/' +
        paras.version +
        '/direction/' +
        method +
        '?origin=' +
        paras.origin.longitude.toFixed(6) +
        ',' +
        paras.origin.latitude.toFixed(6) +
        '&destination=' +
        paras.destination.longitude.toFixed(6) +
        ',' +
        paras.destination.latitude.toFixed(6) +
        '&key=' +
        paras.key +
        '&strategy=10&show_fields=cost';
      console.log(serviceUrl);
      let res = {
        pos: [],
        cos: 0,
        dis: 0,
      };
      let paths = [];
      fetch(serviceUrl)
        .then(r => r.json())
        .then(response => {
          console.log(response);
          if (response.status === '1' || response.errcode === 0) {
            let n = 0;
            if (method !== 'bicycling') {
              if (response.count !== '1') {
                n = this.state.strategies;
              }
              res.cos = response.route.paths[n].duration;
              res.dis = response.route.paths[n].distance;
              paths = response.route.paths[n].steps;
            } else {
              if (n > response.data.paths.length - 1) {
                Alert('方案不足');
                return;
              } else {
                n = this.state.strategies;
                res.cos = response.data.paths[n].duration;
                res.dis = response.data.paths[n].distance;
                paths = response.data.paths[n].steps;
              }
            }
            paths.forEach(function (path) {
              let points = path.polyline.split(';');
              points.forEach(function (item) {
                const point = item.split(',');
                let data = {
                  latitude: parseFloat(point[1]),
                  longitude: parseFloat(point[0]),
                };
                res.pos.push(data);
              });
            });
            callback(res);
          } else {
            if (response.infocode === '20803') {
              Alert('距离过长，建议更换交通方式');
            } else {
              Alert('路径规划失败');
            }
          }
        });
    });
  };

  getRoute = method => {
    this.Navigate(method, e => {
      this.setState({navigation: e.pos, time: e.cos, distance: e.dis});
    });
  };

  getRoute_v5 = callback => {
    this.setState({navigation: []});
    this.getPosition(e => {
      const paras = {
        key: '8a01f52e06594f6f69e651ee2cc8a0ac',
        origin: e,
        destination: this.props.route.params.position,
        show_fields: 'cost',
      };
      let serviceUrl =
        'https://restapi.amap.com/v3/direction/transit/integrated' +
        '?origin=' +
        paras.origin.longitude.toFixed(6) +
        ',' +
        paras.origin.latitude.toFixed(6) +
        '&destination=' +
        paras.destination.longitude.toFixed(6) +
        ',' +
        paras.destination.latitude.toFixed(6) +
        '&key=' +
        paras.key +
        '&show_fields=' +
        paras.show_fields +
        '&strategy=0&city=021&cityd=021';
      console.log(serviceUrl);
      axios(serviceUrl).then(responseJSON => {
        const data = JSON.parse(responseJSON.request._response);
        callback(data.route.transits[0]);
      });
    });
  };

  SelectMethod(idx) {
    this.setState({selected: idx});
    let method = '';
    switch (idx) {
      case 0:
        method = 'driving';
        break;
      case 1:
        method = 'walking';
        break;
      case 2:
        method = 'bicycling';
        break;
      default:
        this.setState({bus: true});
        this.getRoute_v5(e => this.setState({navi: e}));
        return;
    }
    this.setState({bus: false});
    this.getRoute(method);
  }

  render() {
    return (
      <View style={{backgroundColor: COLORS.white, height: '100%'}}>
        <View style={{marginBottom: 5, flexDirection: 'row', marginTop: 5}}>
          <TouchableOpacity
            onPress={this.props.navigation.goBack}
            style={{marginLeft: '5%', marginTop: 3, zIndex: 3}}>
            <Icon name="arrow-back-ios" size={20} />
          </TouchableOpacity>
          <Text
            style={{
              color: COLORS.dark,
              fontSize: 20,
              fontWeight: 'bold',
              marginLeft: '34%',
              zIndex: 2,
            }}>
            导航
          </Text>
          <TouchableOpacity
            onPress={() => Linking.openURL(this.state.url)}
            style={{marginLeft: '30%', zIndex: 2}}>
            <Text
              style={{color: COLORS.blue, fontSize: 16, fontWeight: 'bold'}}>
              更多
            </Text>
          </TouchableOpacity>
        </View>
        <View style={style.categoryListContainer}>
          {this.categoryList.map((category, index) => (
            <Pressable key={index} onPress={() => this.SelectMethod(index)}>
              <Text
                style={[
                  style.categoryListText,
                  index === this.state.selected && style.activeCategoryListText,
                ]}>
                {category}
              </Text>
            </Pressable>
          ))}
        </View>
        {this.state.bus ? (
          <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {this.state.navi && <BusLine bus={this.state.navi} />}
            </ScrollView>
          </SafeAreaView>
        ) : (
          <>
            <View style={{height: '80%'}}>
              <MapView
                ref={ref => (this.mapView = ref)}
                onLoad={() => this.mapView?.moveCamera({zoom: 12.5}, 100)}
                style={StyleSheet.absoluteFill}
                mapType={MapType.Bus}
                myLocationEnabled={true}
                zoomControlsEnabled={false}
                initialCameraPosition={{
                  target: {
                    latitude: 31.160419,
                    longitude: 121.372495,
                  },
                  zoom: 10,
                }}
                onCameraIdle={({nativeEvent}) => {
                  this.status = nativeEvent;
                }}>
                <Polyline
                  width={10}
                  color={'#32CD32'}
                  points={this.state.navigation}
                />
                {/*<Marker*/}
                {/*  position={this.state.start}*/}
                {/*  icon={require('../assets/navi_ori.png')}*/}
                {/*/>*/}
                <Marker
                  position={this.props.route.params.position}
                  icon={require('../assets/navi_des.png')}
                />
              </MapView>
              {this.state.selected === 0 && (
                <View style={style.button}>
                  <FloatingAction
                    actions={actions}
                    onPressItem={position => {
                      console.log(`selected button: ${position}`);
                      this.setState({strategies: position - 1});
                      this.SelectMethod(this.state.selected);
                    }}
                  />
                </View>
              )}
            </View>
            <View>
              <Text
                style={{
                  color: COLORS.grey,
                  fontSize: 16,
                  alignSelf: 'center',
                  marginTop: 10,
                }}>
                全程 {Math.floor(this.state.distance / 1000)} km{' '}
                {this.state.distance % 1000} m，预计
              </Text>
              {this.state.time >= 3600 ? (
                <Text
                  style={{
                    color: COLORS.dark,
                    fontSize: 20,
                    fontWeight: 'bold',
                    alignSelf: 'center',
                    marginTop: 5,
                  }}>
                  {Math.floor(this.state.time / 3600)} 小时{' '}
                  {Math.floor((this.state.time % 3600) / 60)} 分钟{' '}
                  {this.state.time % 60} 秒{' '}
                </Text>
              ) : (
                <Text
                  style={{
                    color: COLORS.dark,
                    fontSize: 20,
                    fontWeight: 'bold',
                    alignSelf: 'center',
                    marginTop: 5,
                  }}>
                  {Math.floor((this.state.time % 3600) / 60)} 分钟{' '}
                  {this.state.time % 60} 秒{' '}
                </Text>
              )}
            </View>
          </>
        )}
      </View>
    );
  }
}

const style = StyleSheet.create({
  categoryListText: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 5,
    color: COLORS.grey,
  },
  activeCategoryListText: {
    color: COLORS.dark,
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  categoryListContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    marginTop: 5,
    paddingHorizontal: 40,
  },
  button: {
    zIndex: 999,
    marginTop: '160%',
  },
});

export default MapNavigation;
