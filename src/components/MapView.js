/* eslint-disable prettier/prettier */
import React, {useEffect, useRef} from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Animated,
    Alert,
    Modal, PixelRatio,
} from 'react-native';
import {FloatingAction} from 'react-native-floating-action';
import {AMapSdk, Cluster, MapType, MapView, Marker, Polygon} from 'react-native-amap3d';
import COLORS from '../consts/colors';
import SelectDropdown from 'react-native-select-dropdown';
import {AutoSearch} from './SearchBar';

import Pan from './Pan';
import axios from '../utils/axios';
import HouseMarker from './HouseMarker';
import { init, Geolocation } from 'react-native-amap-geolocation';
import RBSheet from 'react-native-raw-bottom-sheet';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {SelectPicker} from './SelectPicker';
const {width,height} = Dimensions.get('screen');
import star from '../assets/icons8-star-100.png';

let points = [];

const actions = [
  {
    text: '手绘',
    icon: require('../assets/icons8-pen-24.png'),
    name: 'scopeFilter',
    color: '#808080',
    position: 2,
  },
  {
    text: '附近',
    icon: require('../assets/icons8-landscape-24.png'),
    name: 'nearbyHouses',
    color: '#808080',
    position: 1,
  },
    {
        text: '通勤',
        icon: require('../assets/icons8-landscape-24.png'),
        name: 'oneHour',
        color: '#808080',
        position: 3,
    },
];

const rooms = ['所有','1室', '2室', '3室', '4室及以上'];
const price = ['所有', '小于2000', '2000-4000', '4000-6000', '6000-8000', '8000-10000', '大于10000'];
const price_inx = [0, 2000, 4000, 6000, 8000, 10000, 12000];

const method = ['公交','地铁','地铁公交'];

class Map extends React.Component {

  constructor(props) {
    super(props);
    /* 画线 */
    this.offsetX = 0;
    this.offsetY = 0;
    this.drawReady = false;
    this.drawPath = [];

    this.state = {
        scopeFilter: false,
        scopePoints: [],
        finishScope: false,
        space: 0,
        price: 0,
        des_location: null,
        info: [],
        fiter:false,
        houseId:null,
        houses : null,
        zoom: 10,
        initDone: false,
        scrollGesturesEnabled:true,
        oneHour: false,
        outerPoints:[],
        setHour: false,
        HourSetting:{
            time: 60,
            method: 2,
        },
    };
  }

  refRBSheet = React.createRef();

  componentDidMount() {
    /* key值初始化 */
    AMapSdk.init(
      Platform.select({
        android: '3990fde4b914099e86cfd719d7db8e4c',
      }),
    );
    init({
        android: '3990fde4b914099e86cfd719d7db8e4c',
    }).then(r => this.setState({initDone: true}));

    this.changeFilter = this.changeFilter.bind(this);
    let _points = [];
    _points.push({
        room: 0,
        min: 0,
        max: 0});
    axios.post('/getHousesByDistrict',_points)
        .then(response => {
          const data = response.data;
          console.log(data);
          this.setState({
            info:data,
          });
        })
        .catch(error => {
          console.log(error);
        });
  }
  state = {
    scrollGesturesEnabled:true,
  }
  getPosition = () => {
    Geolocation.getCurrentPosition(({ coords }) => {
      let data = coords.longitude + ',' + coords.latitude;
      this.changeLocation(data);
    });
  }
    getRecommend=async ()=>{
        let _points = await this.getScreenRange();
        axios.post('/getRecommendedHouses',_points)
            .then(response => {
                const data = response.data;
                console.log(data);
                this.setState({
                    info:data,
                });
            })
            .catch(error => {
                console.log(error);
            });
    }
  changeFilter(name) {
    // console.log(`selected button: ${name}`);
    if (name === 'scopeFilter') {
      if (this.state.zoom < 15) {
          Alert.alert('提示信息', '放大到小区级别才可以手绘筛选房源哦~', [{
              text: '确定',
              onPress: () => {},
          }]);
          return;
      }
      this.setState({
          scopeFilter: true,
          scopePoints: [],
          scrollGesturesEnabled: false,
          finishScope:false,
          houses: [],
          info: [],
          oneHour: false,
          outerPoints:[],
      });
      points = [];
    }
    if (name === 'nearbyHouses') {
        this.getPosition();
        this.setState({
            scopeFilter: false,
            scrollGesturesEnabled: true,
            finishScope: false,
            oneHour: false,
            outerPoints:[],
        });
        this.getHouses(this.state.zoom);
    }
    if (name === 'oneHour'){
        this.getHouses(this.state.zoom);
        this.setState({
            scopeFilter: false,
            scrollGesturesEnabled: true,
            finishScope: false,
            oneHour: true,
        });
        this.getOneHour((e)=>{
            this.setState({
                outerPoints: e,
            });
        });
    }
  }

  changeLocation(e){
      console.log(e);
    if (e !== null){
      let list = e.split(',');
      let pos = {
        latitude:parseFloat(list[1]),
        longitude:parseFloat(list[0]),
      };
      this.mapView?.moveCamera({
        zoom:15,
        target:pos,
      },5);
      this.setState({des_location: pos});
    }
    else {
      this.setState({des_location: e});
    }
  }

  handleDraw = (point) => {
    this.mapView.getLatLng(point).then( res => {
        points.push(res);
      }
    );
  }

  handleEnd = async() => {
    // console.log(points);
    if (points.length < 3) {
      this.setState({
        scopePoints: [],
        finishScope: false,
        scrollGesturesEnabled: true,
      });
      points = [];
    } else {
      //console.log(points);
      this.setState({
        scopePoints: points,
        finishScope:true,
        scrollGesturesEnabled: true,
      });
       await this.getScopeHouses();
    }
  }

  drawAgain = () => {
    this.setState({
      scopePoints: [],
      finishScope: false,
      scrollGesturesEnabled: true,
      houses: [],
      info: [],
    });
    points = [];
  }

  getScreenRange = async() => {
    let left_up = await this.mapView.getLatLng({x:0,y:0});
    let right_down = await this.mapView.getLatLng({x:width,y:height});
    let _points = [];
    _points[0] = left_up;
    _points[1] = right_down;
    return _points;
  }

  getHouses = async _zoom => {
      // console.log("get!");
    const room = this.state.space;
    const min_price = this.state.price === 0 ? 0 : price_inx[this.state.price - 1];
    const max_price = price_inx[this.state.price];
    if (_zoom < 13) {
      //if (this.state.zoom < 13) {this.setState({zoom:_zoom});}
      //else {
        let _points = [];
        _points.push({  //0,0,0
            room: room,
            min: min_price,
            max: max_price});
        axios.post('/getHousesByDistrict', _points)
            .then(response => {
              const data = response.data;
              // console.log(data);
              this.setState({
                info:data,
                zoom:_zoom,
              });
            })
            .catch(error => {
              console.log(error);
            });
      //}
    }
    else if (_zoom >= 13 && _zoom < 15) { //显示street
      let _points = await this.getScreenRange();
        _points.push({
            room: room,
            min: min_price,
            max: max_price});
        console.log(_points);
      axios.post('/getHousesByStreet',_points)
          .then(response => {
            const data = response.data;
            // console.log(data);
            this.setState({
              info:data,
              zoom:_zoom,
            });
          })
          .catch(error => {
            console.log(error);
          });
    }
    else { //显示neighborhood
      let _points = await this.getScreenRange();
        _points.push({
            room: room,
            min: min_price,
            max: max_price});
      console.log(_points);
      axios.post('/getHousesByNeighbourhood',_points)
          .then(response => {
            const data = response.data;
            // console.log(data);
            this.setState({
              info:data,
              zoom:_zoom,
            });
              console.log(this.state.info);
          })
          .catch(error => {
            console.log(error);
          });
    }
  }

  getScopeHouses = async() => {
      let _points = await this.getScreenRange();
      let send = {
          screenPoints: _points,
          scopePoints: this.state.scopePoints,
      };
      // console.log(send);
      // console.log(11111111111);
      axios.post('/getScopeHousesByNeighbourhood',send)
          .then(response => {
              const data = response.data;
              // console.log(data);
              this.setState({
                  info:data,
              });
          })
          .catch(error => {
              console.log(error);
          });
  }

  handleZoom = async e => {
    const _zoom = e.nativeEvent.cameraPosition.zoom;
    console.log(_zoom);
    if (this.state.finishScope) {return;}
    await this.getHouses(_zoom);
  }

  getHouseInfo = neighbourhoodId=>{
        const room = this.state.space;
        const min_price = this.state.price === 0 ? 0 : price_inx[this.state.price - 1];
        const max_price = price_inx[this.state.price];
        axios
            .post('/getHouseInfo', {
                id: neighbourhoodId,
                room: room,
                min: min_price,
                max: max_price,
            })
            .then(responseJSON => {
                const data = JSON.parse(responseJSON.request._response);
                //console.log(data);
                this.setState({houses:data});
                this.refRBSheet.current.open();
            });
    };

  handlePressMarker = (latitude,longitude,item) => {
    let _zoom = 0;
    if (this.state.zoom < 13){
        this.state.fiter = false;
      _zoom = 13;
    }
    else if (this.state.zoom < 15){
        this.state.fiter = false;
      _zoom = 15;
    }
    else { //打开详情
        this.getHouseInfo(item.neighbourhood_id);
      return;
    }
    this.mapView.moveCamera({
      target:{
        latitude:latitude,
        longitude:longitude,
      },
    },200);


    setTimeout(()=>this.mapView.moveCamera({
        zoom:_zoom,
    },200),300);
  }

  getHourPosition(callback){
      if (this.state.des_location){
          callback(this.state.des_location);
      } else {
          Geolocation.getCurrentPosition(({ coords }) => {
              callback(coords);
          });
      }
  }

    getOneHour(callback){
      if (this.state.des_location === null) 
          {this.getPosition();}
      this.getHourPosition(e=>{
          const url = 'https://lbs.amap.com/_AMapService/v3/direction/reachcircle?'
              + 'key=8369fe5dda43bfb1055bff8cb9418af5'
              + '&location=' + e.longitude + ',' + e.latitude
              + '&time=' + this.state.HourSetting.time + '&strategy=' + this.state.HourSetting.method
              + '&s=rsv3&extensions=all&output=json';
          axios(url)
              .then(responseJSON => {
                  const data = JSON.parse(responseJSON.request._response);
                  const res = data.polylines;
                  //console.log(res);
                  const pointsArray = [];
                  res.forEach(function (item) {
                      const pos = [];
                      let Points = item.outer.split(';');
                      Points.forEach(function (Point) {
                          const p = Point.split(',');
                          let point = {latitude: parseFloat(p[1]), longitude: parseFloat(p[0])};
                          pos.push(point);
                      });
                      pointsArray.push(pos);
                  });
                  //console.log(pointsArray);
                  callback(pointsArray);
              })
              .catch(error => {
                  console.log(error);
              });
      });
    }

    handleHourCancel =()=> {
      console.log(this.state.zoom);
      this.setState({setHour: false});
    }

    handleHourConfirm =(time,method)=> {
        this.setState({
            setHour: false,
            HourSetting: {
                time: time,
                method: method,
            },
        },()=>{
            this.getOneHour((e)=>{
                this.setState({
                    outerPoints: e,
                });
            });
        });
    }

    // animate(){
    //     let r = {
    //         latitude: 42.5,longitude: 15.2,latitudeDelta: 7.5,longitudeDelta: 7.5};
    //     this.mapView.root.animateRegion(r,2000);
    // }

  render() {
      const Card = ({house}) => {
          console.log(house);
          console.log('hello');
          return (
              <Pressable
                  activeOpacity={0.8}
                  onPress={() => {
                    this.refRBSheet.current.close();
                    this.props.navigation.navigate('DetailsScreen', house.properties.houseId);
                  }
                  }>
                  <View style={style.card}>
                      <Image
                        source={{uri:house.properties.image}}
                        //source={house.image}
                        style={style.cardImage}
                    />
                      <View style={{marginTop: 10}}>
                          <View
                              style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginTop: 10,
                              }}>
                              <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                                  {house.properties.title}
                              </Text>
                              <Text
                                  style={{
                                      fontWeight: 'bold',
                                      color: COLORS.blue,
                                      fontSize: 16,
                                  }}>
                                  {'￥' + house.properties.price}
                              </Text>
                          </View>
                          <View
                              style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginTop: 10,
                              }}>
                              <Text
                                  style={{fontSize: 16, fontWeight: 'bold', color: COLORS.grey}}>
                                  {house.properties.type}
                              </Text>
                              <View style={(house.score > 1.6) ? style.recwindow : null}>
                                  <Text style={{ fontWeight: 'bold', color: '#ffffff'}}>推 荐</Text>
                              </View>
                          </View>

                          <View style={{flexDirection: 'row', marginTop: 10}}>
                              <View style={style.facility}>
                                  <Icon name="hotel" size={18} />
                                  <Text style={style.facilityText}>{house.properties.bedroom}</Text>
                              </View>
                              <View style={style.facility}>
                                  <Icon name="weekend" size={18} />
                                  <Text style={style.facilityText}>
                                      {house.properties.livingroom}
                                  </Text>
                              </View>
                              <View style={style.facility}>
                                  <Icon name="explore" size={18} />
                                  <Text style={style.facilityText}>
                                      {house.properties.direction}
                                  </Text>
                              </View>
                              <View style={style.facility}>
                                  <Icon name="aspect-ratio" size={18} />
                                  <Text style={style.facilityText}>{house.properties.area} ㎡</Text>
                              </View>
                          </View>
                      </View>
                  </View>
              </Pressable>
          );
      };
      // console.log("*************************************");
      // console.log("render!");


    return (

      <View style={{marginTop: 15, flex: 1, marginBottom: 50}}>


        {/*搜索筛选栏*/}
          <View style={{
              paddingHorizontal: 20,
              zIndex: 3,
              marginTop: 10,
          }} >
              <AutoSearch locate={this.changeLocation.bind(this)} able={!this.state.scopeFilter}/>

              <View
                  style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      //paddingHorizontal: 70,
                      zIndex: 2,
                      marginTop: 5,
                  }}>
                  <View style={{ marginRight: 5 }}>
                      <SelectDropdown
                          data={rooms}
                          onSelect={(selectedItem, index) => {
                              console.log(selectedItem, index);
                              this.setState({ space: index },
                                  () => this.getHouses(this.state.zoom));
                          }}
                          buttonTextAfterSelection={(selectedItem, index) => {
                              return selectedItem;
                          }}
                          rowTextForSelection={(item, index) => {
                              return item;
                          }}
                          rowTextStyle={{ fontSize: 15, color: '#696969'}}
                          buttonStyle={{ width: 102, height: 30, backgroundColor: 'grey', borderRadius: 30 }}
                          buttonTextStyle={{ fontSize: 10, color: '#ffffff' }}
                          dropdownStyle={{borderRadius: 10}}
                          defaultButtonText={'厅室'}
                          disabled={this.state.scopeFilter}
                      />
                  </View>

                  <View>
                      <SelectDropdown
                          data={price}
                          onSelect={(selectedItem, index) => {
                              console.log(selectedItem, index);
                              this.setState({ price: index },
                                  () => this.getHouses(this.state.zoom));
                          }}
                          buttonTextAfterSelection={(selectedItem, index) => {
                              return selectedItem;
                          }}
                          rowTextForSelection={(item, index) => {
                              return item;
                          }}
                          rowTextStyle={{ fontSize: 15, color: '#696969'}}
                          buttonStyle={{ width: 102, height: 30, backgroundColor: 'grey', borderRadius: 30 }}
                          buttonTextStyle={{ fontSize: 10, color: '#ffffff' }}
                          dropdownStyle={{borderRadius: 10}}
                          defaultButtonText={'租金'}
                          disabled={this.state.scopeFilter}
                      />
                  </View>
              </View>
          </View>

          {this.state.setHour &&
              <View style={{
                  position:'absolute',
                  height: '100%',
                  width:'100%',
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  zIndex: 3}}>
              <SelectPicker handleOk={this.handleHourConfirm} handleCancel={this.handleHourCancel}/>
          </View>}
          {this.state.oneHour &&
              <View style={StyleSheet.absoluteFill}>
                  <TouchableOpacity
                      style={style.list}
                      onPress={() => this.setState({setHour: true})}
                  >
                      <Text>
                          {this.state.HourSetting.time} min
                      </Text>
                      <Text>
                          {method[this.state.HourSetting.method]}
                      </Text>
                  </TouchableOpacity>
              </View>
          }

          {this.state.initDone ?
              <MapView
                  ref={(ref) => (this.mapView = ref)}
                  // onLoad={() => this.mapView?.moveCamera({ zoom: 14 }, 100)}
                  style={StyleSheet.absoluteFill}
                  mapType={MapType.Bus}
                  //myLocationEnabled={true}
                  zoomControlsEnabled={false}
                  scrollGesturesEnabled={this.state.scrollGesturesEnabled}
                  //myLocationButtonEnabled
                  //locationInterval={10000}
                  //distanceFilter={10}
                  initialCameraPosition={{
                      target: {
                          latitude: 31.160419,
                          longitude: 121.372495,
                      },
                      zoom: 10,
                  }}
                  onCameraIdle={e => {
                      this.handleZoom(e);
                  }
                  }
                  rotateGesturesEnabled={false}
                  //onPress={()=>this.animate()}
              >
                  {this.state.des_location ?
                      <Marker
                          position={this.state.des_location}
                          icon={require('../assets/des.png')}
                      /> :
                      <></>
                  }
                  {this.state.info ? this.state.info.map((item, index) => {
                      if (item.amount !== 0) {
                          return (
                              <HouseMarker zoom={this.state.zoom} onPress={this.handlePressMarker} key={index}
                                           name={item.name} latitude={item.latitude} longitude={item.longitude}
                                           amount={item.amount} item={item}/>
                          );
                      }
                  }) : <></>}
                  {/*{this.state.scopeFilter  ? <View>{scopeMakers}</View> : <></>}*/}
                  {this.state.scopeFilter && this.state.finishScope ?
                      <Polygon
                          strokeWidth={5}
                          strokeColor="rgba(255, 255, 255, 0.8)"
                          fillColor="rgba(255, 255, 200, 0.5)"
                          points={this.state.scopePoints}
                      /> : <></>}

                  {this.state.oneHour ?
                      this.state.outerPoints.map((item, index) => {
                          return (
                              <Polygon
                                  strokeWidth={3}
                                  strokeColor="rgba(220,220,220,1)"
                                  fillColor="rgba(220, 220, 220, 0.8)"
                                  points={item}
                              />
                          );
                      }) : <></>
                  }

              </MapView> : <Text>Is Loading......</Text>
          }
        {/*悬浮按钮*/}
        <View style={styles.button}>
          <FloatingAction
            // showBackground = {false}
            actions={actions}
            onPressItem={(name) => this.changeFilter(name)}
          />
        </View>
        {
          this.state.scopeFilter &&
              <View style={StyleSheet.absoluteFill}>
                {
                  !this.state.finishScope ?
                    <View style={StyleSheet.absoluteFill}>
                        <Pan handleDraw={this.handleDraw} handleEnd={this.handleEnd}/>
                    </View>
                    :
                    <TouchableOpacity
                        onPress={this.drawAgain}
                        style={styles.buttonNo}
                    >
                      <Image style={{ width: 30, height: 30 }}
                             source={require('../assets/icons/refresh.png')}
                      />
                    </TouchableOpacity>
                }

              </View>
        }


        <View
            style={{
              position: 'absolute',
              width: '100%',
              bottom: '0%',
              marginBottom: -40,
              // flex: 1,
              // justifyContent: 'center',
              // alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0)',
            }}>

          <RBSheet
              ref={this.refRBSheet}
              animationType={'slide'}
              closeDuration={200}
              closeOnDragDown={true}
              closeOnPressMask={false}
              customStyles={{
                wrapper: {
                  backgroundColor: 'transparent',
                },
                draggableIcon: {
                  backgroundColor: '#000',
                },
                container: {
                  height: 380,
                },
              }}>
            <View>

              {/* Render Card */}
                {this.state.houses ?
                    <FlatList
                        snapToInterval={width - 20}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingLeft: 20,
                            paddingVertical: 20,
                            marginBottom: 40,
                        }}
                        horizontal
                        data={this.state.houses}
                        renderItem={(item) => <Card house={item.item} />}
                    />
                    : <><Text>Is Loading</Text></>
                }
            </View>
          </RBSheet>
        </View>

      </View>
    );
  }
}

export default Map;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    // position: 'absolute',
    zIndex: 999,
    // flex: 1,
    // height: 0,
    // bottom: 100,
    marginTop: '135%',
    // height: 480,
  },
  buttonNo : {
    width: 40,
    height: 40,
    zIndex: 700,
    marginTop: '145%',
    marginLeft: '5%',
  },
  // buttonNo : {
  //   width: 30,
  //   height: 30,
  //   zIndex: 700,
  //   marginTop: '135%',
  //   marginLeft: '5%',
  // },
});

const style = StyleSheet.create({
  header: {
    paddingVertical: 10,
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
    backgroundColor: COLORS.white,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowOffset: {width:10,height:10},
    shadowColor: COLORS.grey,
    shadowOpacity:100,

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
    width: 200,
    marginHorizontal: 20,
    marginTop: 10,
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
    height: 250,
    backgroundColor: COLORS.white,
    elevation: 10,
    width: width - 40,
    marginRight: 20,
    padding: 15,
    borderRadius: 20,
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderRadius: 15,
  },
  facility: {flexDirection: 'row', marginRight: 15},
  facilityText: {marginLeft: 5, color: COLORS.grey},
  input: {
    width: 280,
  },
    infoWindow: {
        alignItems:'center',
        justifyContent:'center',
        height: 75,
        width: 75,
        padding: 5,
        borderRadius: 120,
        elevation: 4,
        borderWidth: 2,
        borderColor: '#79abc9',
        backgroundColor: '#79abc9',
    },
    list: {
        borderColor: 'grey',
        backgroundColor: 'white',
        borderWidth: 5 / PixelRatio.get(),
        borderRadius: 10,
        paddingVertical: 2,
        paddingHorizontal: 10,
        zIndex: 700,
        width: 80,
        height: 50,
        marginTop: '140%',
        marginLeft: '5%',
    },
    starImage:{
        width: '6%',
        height: 18,
        borderRadius: 16,
    },
    recwindow:{
        alignItems:'center',
        justifyContent:'center',
        height: 30,
        width: 'auto',
        paddingHorizontal:10,
        borderRadius: 10,
        elevation: 4,
        borderWidth: 2,
        borderColor: '#DC143C',
        backgroundColor: '#DC143C',
    },
});



