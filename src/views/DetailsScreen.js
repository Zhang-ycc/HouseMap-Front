/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {
  ImageBackground,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
  Modal,
  TouchableOpacity,
  Alert,
  Pressable,
  Linking,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../consts/colors';
import axios from '../utils/axios';
import ImageViewer from 'react-native-image-zoom-viewer';
import {storage} from '../utils/storage';
import CounterEmitter from '../utils/CountEmitter';
const {width} = Dimensions.get('screen');

const DetailsScreen = ({navigation, route}) => {
  const [House, setHouse] = useState();
  const [Images, setImages] = useState();
  const [isliked, setIsliked] = useState(0);
  const [ImageShow, setShow] = useState(false);
  const [modalImages, setModal] = useState();
  const [modalIndex, setIndex] = useState();
  const [userId, setUserid] = useState();
  const houseId = route.params;
  //console.log(houseId);

  useEffect(() => {
    axios
      .get('/getHouse', {
        params: {
          id: houseId,
        },
      })
      .then(responseJSON => {
        const data = JSON.parse(responseJSON.request._response);
        console.log(data);
        setHouse(data);
        let arr = [];
        let images = [];
        data.properties.images.forEach(function (item) {
          arr.push({uri: item});
          images.push({url: item});
        });
        setImages(arr);
        setModal(images);
        console.log(arr);
      });
    update();
    CounterEmitter.addListener('update', () => {
      update();
    });
  }, [houseId]);

  function update() {
    storage
      .load({
        key: 'token',
      })
      .then(r => {
        setUserid(r.user.userId);
        axios
          .post('/findHouse', {
            userId: r.user.userId,
            houseId: houseId,
          })
          .then(responseJSON => {
            const data = JSON.parse(responseJSON.request._response);
            console.log(data);
            setIsliked(data);
          });
      })
      .catch(err => {
        switch (err.name) {
          case 'NotFoundError':
            setIsliked(0);
            break;
          case 'ExpiredError':
            break;
        }
      });
  }

  const InteriorCard = ({interior, index}) => {
    return (
      <Pressable
        onPress={() => {
          setIndex(index);
          setShow(true);
        }}>
        <Image source={interior} style={style.interiorImage} />
      </Pressable>
    );
  };

  const postFooterIcons = [
    {
      name: 'Like',
      imageUrl:
        'https://img.icons8.com/material-outlined/48/000000/like--v1.png',
      LikeImageUrl: 'https://img.icons8.com/material/24/E74C3C/like--v1.png',
    },
  ];

  const handleLike = house_id => {
    {
      renderOrderModal(house_id);
    }
  };

  const renderOrderModal = house_id => {
    if (isliked === 0) {
      addOrder(house_id);
    } else {
      deleteOrder(house_id);
    }
  };

  function addOrder(house_id) {
    if (userId) {
      axios
        .post('/addHouse', {
          userId: userId.toString(),
          houseId: house_id.toString(),
        })
        .then(r => {
          update();
          CounterEmitter.emit('likeUpdate');
        })
        .catch(err => {
          console.log(err.message);
        });
    } else {
      navigation.navigate('LoginScreen');
    }
  }

  const deleteOrder = house_id => {
    axios
      .post('/deleteHouse', {
        userId: userId.toString(),
        houseId: houseId.toString(),
      })
      .then(r => {
        update();
        CounterEmitter.emit('likeUpdate');
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  return (
    <>
      {House ? (
        <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* House image */}

            <View style={style.backgroundImageContainer}>
              <ImageBackground
                style={style.backgroundImage}
                source={{uri: House.properties.images[0]}}>
                <View style={style.header}>
                  <TouchableOpacity
                    onPress={navigation.goBack}
                    style={style.headerBtn}>
                    <Icon name="arrow-back-ios" size={20} />
                  </TouchableOpacity>
                  <View>
                    <TouchableOpacity
                      onPress={() => handleLike(House.properties.houseId)}>
                      <Image
                        style={style.likes}
                        source={{
                          uri: isliked
                            ? postFooterIcons[0].LikeImageUrl
                            : postFooterIcons[0].imageUrl,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </ImageBackground>

              {/* Virtual Tag View */}
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('MapNavigation', {
                    position: House.position,
                    name: House.properties.title,
                  })
                }
                style={style.virtualTag}>
                <Text style={{color: COLORS.white}}>去这里</Text>
              </TouchableOpacity>
            </View>

            <View style={style.detailsContainer}>
              {/* Name and rating view container */}
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                  {House.properties.title}
                </Text>
              </View>

              {/* Location text */}
              {/* eslint-disable-next-line react-native/no-inline-styles */}
              <Text style={{fontSize: 16, color: COLORS.grey}}>
                {House.properties.type}
              </Text>

              {/* Facilities container */}
              <View style={{flexDirection: 'row', marginTop: 20}}>
                <View style={style.facility}>
                  <Icon name="hotel" size={18} />
                  <Text style={style.facilityText}>
                    {House.properties.bedroom}
                  </Text>
                </View>
                <View style={style.facility}>
                  <Icon name="weekend" size={18} />
                  <Text style={style.facilityText}>
                    {House.properties.livingroom}
                  </Text>
                </View>
                <View style={style.facility}>
                  <Icon name="explore" size={18} />
                  <Text style={style.facilityText}>
                    {House.properties.direction}
                  </Text>
                </View>
                <View style={style.facility}>
                  <Icon name="aspect-ratio" size={18} />
                  <Text style={style.facilityText}>
                    {House.properties.area} ㎡
                  </Text>
                </View>
              </View>

              <View style={{flexDirection: 'row', marginTop: 20}}>
                <View style={style.facility}>
                  <Icon name="apartment" size={18} />
                  <Text style={style.facilityText}>
                    {House.properties.floor}
                  </Text>
                </View>
              </View>

              {/* Interior list */}
              <FlatList
                contentContainerStyle={{marginTop: 20}}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, key) => key.toString()}
                data={Images}
                renderItem={({item, index}) => (
                  <InteriorCard interior={item} index={index} />
                )}
              />

              <Text style={{marginTop: 20, color: COLORS.grey}}>
                {House.properties.introduction !== 'None'
                  ? House.properties.introduction
                  : '暂无具体介绍'}
              </Text>

              {/* footer container */}
              <View style={style.footer}>
                <View>
                  <Text
                    style={{
                      color: COLORS.blue,
                      fontWeight: 'bold',
                      fontSize: 18,
                    }}>
                    {'￥' + House.properties.price}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: COLORS.grey,
                      fontWeight: 'bold',
                    }}>
                    月租
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('OuterWeb', House.properties.detailUrl)
                  }
                  style={style.bookNowBtn}>
                  <Text style={{color: COLORS.white}}>预定</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Modal
              visible={ImageShow}
              animationType={'none'}
              transparent={true}
              onRequestClose={() => {
                setShow(false);
              }}>
              <ImageViewer
                backgroundColor={'rgba(0,0,0,0.7)'}
                imageUrls={modalImages}
                index={modalIndex}
                onCancel={() => {
                  setShow(false);
                }}
                onClick={() => {
                  setShow(false);
                }}
                saveToLocalByLongPress={false}
              />
            </Modal>
          </ScrollView>
        </SafeAreaView>
      ) : (
        <></>
      )}
    </>
  );
};

const style = StyleSheet.create({
  backgroundImageContainer: {
    elevation: 20,
    marginHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
    height: 350,
  },
  backgroundImage: {
    height: '100%',
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  headerBtn: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingTag: {
    height: 30,
    width: 35,
    backgroundColor: COLORS.blue,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  virtualTag: {
    top: -20,
    width: 120,
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 20,
    backgroundColor: COLORS.dark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  interiorImage: {
    width: width / 3 - 20,
    height: 80,
    marginRight: 10,
    borderRadius: 10,
  },
  footer: {
    height: 70,
    backgroundColor: COLORS.light,
    borderRadius: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  bookNowBtn: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.dark,
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  likes: {
    width: 33,
    height: 33,
  },
  detailsContainer: {flex: 1, paddingHorizontal: 20, marginTop: 40},
  facility: {flexDirection: 'row', marginRight: 15},
  facilityText: {marginLeft: 5, color: COLORS.grey},
});

export default DetailsScreen;
