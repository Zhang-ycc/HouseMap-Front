import React, {useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import COLORS from '../consts/colors';
import NavMenu, {bottomTabIcons} from './NavMenu';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from '../utils/axios';
import {storage} from '../utils/storage';
import CounterEmitter from '../utils/CountEmitter';
import Loading from '../components/Loading';
import Empty from '../components/Empty';

const {width} = Dimensions.get('screen');

const RecommendScreen = ({navigation, route}) => {
  const [Houses, setHouses] = useState([]);
  const [userId, setUserid] = useState();
  const [choice, setChoice] = useState(0);
  const [onLoad, setOnLoad] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  function update() {
    storage
      .load({
        key: 'token',
      })
      .then(r => {
        setUserid(r.user.userId);
        if (choice === 0) {
          axios
            .post('/getRecommendedHouses', {
              id: userId,
            })
            .then(responseJSON => {
              const data = JSON.parse(responseJSON.request._response);
              setHouses(data);
              setOnLoad(true);
              console.log(data);
              console.log(choice);
            })
            .catch(err => {
              console.log(err.name);
              Alert.alert('获取数据失败', '\n出错了(´,,•∀•,,`)', [
                {text: '刷新', onPress: update},
              ]);
            });
        } else if (choice === 1) {
          axios
            .post('/getUserRecommendedHouses', {
              id: userId,
            })
            .then(responseJSON => {
              const data = JSON.parse(responseJSON.request._response);
              console.log(data);
              if (data === 'null') {
                // setIsEmpty(true);
                console.log(11111111);
                setOnLoad(true);
                setHouses([]);
              } else {
                setHouses(data);
                setOnLoad(true);
              }
            })
            .catch(err => {
              console.log(err.name);
              Alert.alert('获取数据失败', '\n出错了(´,,•∀•,,`)', [
                {text: '刷新', onPress: update},
              ]);
            });
        } else if (choice === 2) {
          axios
            .post('/getHouseRecommended', {
              id: userId,
            })
            .then(responseJSON => {
              const data = JSON.parse(responseJSON.request._response);
              if (data === 'null') {
                // setIsEmpty(true);
                console.log(11111111);
                setOnLoad(true);
                setHouses([]);
              } else {
                setHouses(data);
                setOnLoad(true);
              }
            })
            .catch(err => {
              console.log(err.name);
              Alert.alert('获取数据失败', '\n出错了(´,,•∀•,,`)', [
                {text: '刷新', onPress: update},
              ]);
            });
        }
      })
      .catch(err => {
        switch (err.name) {
          case 'NotFoundError':
            setUserid(null);
            break;
          case 'ExpiredError':
            break;
        }
      });
  }

  useEffect(() => {
    console.log(choice);
    update();
    CounterEmitter.addListener('update', () => {
      update();
    });
    CounterEmitter.addListener('likeUpdate', () => {
      update();
    });
    //CounterEmitter.setMaxListeners(100);
  }, [choice]);

  const Card = ({house}) => {
    return (
      <Pressable
        activeOpacity={0.8}
        onPress={() => navigation.navigate('DetailsScreen', house.houseId)}>
        <View style={style.card}>
          {/* House image */}
          <Image source={{uri: house.image}} style={style.cardImage} />
          <View style={{marginTop: 10}}>
            {/* Title and price container */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 0,
              }}>
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                {house.title}
              </Text>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: COLORS.blue,
                  fontSize: 16,
                }}>
                {'￥' + house.price}
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
                {house.type}
              </Text>
            </View>

            <View style={{flexDirection: 'row', marginTop: 10}}>
              <View style={style.facility}>
                <Icon name="hotel" size={18} />
                <Text style={style.facilityText}>{house.bedroom}</Text>
              </View>
              <View style={style.facility}>
                <Icon name="weekend" size={18} />
                <Text style={style.facilityText}>{house.livingroom}</Text>
              </View>
              <View style={style.facility}>
                <Icon name="explore" size={18} />
                <Text style={style.facilityText}>{house.direction}</Text>
              </View>
              <View style={style.facility}>
                <Icon name="aspect-ratio" size={18} />
                <Text style={style.facilityText}>{house.area} ㎡</Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  const categoryList = ['流行推荐', '用户推荐', '相似推荐'];

  const ListCategories = () => {
    return (
      <View style={style.categoryListContainer}>
        {categoryList.map((category, index) => (
          <Pressable
            key={index}
            onPress={() => {
              setOnLoad(false);
              setChoice(index);
            }}>
            <Text
              style={[
                style.categoryListText,
                index === choice && style.activeCategoryListText,
              ]}>
              {category}
            </Text>
          </Pressable>
        ))}
      </View>
    );
  };

  console.log('**********');
  console.log(userId);
  console.log(onLoad);
  console.log(Houses);


  return (
    <SafeAreaView style={{backgroundColor: COLORS.white, flex: 1}}>
      <NavMenu
        routeName={route.name}
        icons={bottomTabIcons}
        navigation={navigation}
      />

      <ListCategories />

      {userId ? (
        onLoad ? (
          Houses !== [] ? (
            <FlatList
              snapToInterval={width - 20}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingLeft: 20,
                paddingVertical: 20,
                marginBottom: 40,
              }}
              data={Houses}
              renderItem={({item}) => <Card house={item} />}
              style={{marginBottom: 50}}
            />
          ) : (
            <Empty textContent={'什么都没有啦(o´Д`o)ノ'} />
          )
        ) : (
          // <Text>onLoading...</Text>
          <Loading />
        )
      ) : (
        <View>
          <Empty textContent={'您没有登录'} />
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
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default RecommendScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
});

const style = StyleSheet.create({
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerBtn: {
    height: 20,
    width: 20,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginTop: 20,
    backgroundColor: 'grey',
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
    height: 250,
    backgroundColor: COLORS.white,
    elevation: 10,
    width: width - 40,
    marginRight: 20,
    padding: 15,
    borderRadius: 20,
    margin: 5,
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderRadius: 15,
  },
  facility: {flexDirection: 'row', marginRight: 15},
  facilityText: {marginLeft: 5, color: COLORS.grey},
});
