import React, {useState} from 'react';
import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';

export const bottomTabIcons = [
  {
    name: 'HomeScreen',
    active: 'https://img.icons8.com/fluency-systems-filled/48/666666/home.png',
    inactive:
      'https://img.icons8.com/fluency-systems-regular/48/666666/home.png',
  },
  {
    name: 'RecommendScreen',
    active: 'https://img.icons8.com/ios-filled/50/000000/facebook-like.png',
    inactive: 'https://img.icons8.com/ios/50/000000/facebook-like--v1.png',
  },
  {
    name: 'SaveScreen',
    active: 'https://img.icons8.com/ios-filled/50/666666/tags.png',
    inactive: 'https://img.icons8.com/ios/50/666666/tags--v1.png',
  },
  {
    name: 'ProfileScreen',
    active:
      'https://img.icons8.com/material/64/666666/user-male-circle--v1.png',
    inactive:
      'https://img.icons8.com/material-outlined/96/666666/user-male-circle.png',
  },
];

const NavMenu = ({icons, navigation, routeName}) => {
  const [activeTab, setActiveTab] = useState(routeName);

  const Icon = ({icon}) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(icon.name);
      }}>
      <Image
        source={{uri: activeTab === icon.name ? icon.active : icon.inactive}}
        style={[
          styles.icon,
          icon.name === 'Profile' ? styles.profilePic() : null,
          activeTab === 'Profile' && icon.name === activeTab
            ? styles.profilePic(activeTab)
            : null,
        ]}
      />
    </TouchableOpacity>
  );
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {icons.map((icon, index) => (
          <Icon key={index} icon={icon} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 30,
    height: 30,
  },

  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 50,
    paddingTop: 10,
  },

  wrapper: {
    position: 'absolute',
    width: '100%',
    bottom: '0%',
    zIndex: 999,
    backgroundColor: '#fff',
  },

  profilePic: (activeTab = '') => ({
    borderRadius: 50,
    borderWidth: activeTab === 'Profile' ? 2 : 0,
    borderColor: '#fff',
  }),
});

export default NavMenu;
