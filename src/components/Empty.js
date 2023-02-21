import React from 'react';
import {Image, Text, View} from 'react-native';

const Empty = ({textContent}) => {
  return (
    <View>
      <Image
        source={require('../assets/empty.png')}
        style={{
          alignSelf: 'center',
          resizeMode: 'contain',
          width: '30%',
          zIndex: 999,
        }}
      />
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
            alignSelf: 'center',
              zIndex: 999,
          }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
                zIndex: 999,
            }}>
            {textContent}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Empty;
