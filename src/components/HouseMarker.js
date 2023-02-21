/* eslint-disable prettier/prettier */
import React, {useEffect, useRef} from 'react';
import { View, StyleSheet, Image, Text, Animated } from "react-native";
import {Marker} from 'react-native-amap3d/lib/src';
import { opacity } from "react-native-reanimated/lib/types/lib/reanimated2";
class HouseMarker extends React.Component {
  constructor(props) {
    super(props)
  }
  state = {
    load:false
  }

  load = () => {
    this.setState({load:true});
  }
  render() {

    const style = StyleSheet.create({
      infoWindow: {
        alignItems:'center',
        justifyContent:'center',
        height: 30,
        width: 'auto',
        paddingHorizontal:10,
        borderRadius: 10,
        // elevation: 4,
        borderWidth: 2,
        borderColor: '#79abc9',
        backgroundColor: '#79abc9',
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
        borderColor: '#FFFF00',
        backgroundColor: '#79abc9',
      },
      clusterWindow: {
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
      triangle: {
        alignSelf:'center',
        width:0,
        height:0,
        borderStyle:'solid',
        borderWidth:6,
        borderTopColor:'#79abc9',
        borderLeftColor:'rgba(255,255,255,0)',
        borderBottomColor:'rgba(255,255,255,0)',
        borderRightColor:'rgba(255,255,255,0)',
        marginTop:0,
        marginLeft:0,
        backgroundColor:'rgba(0,0,0,0)'
      },
      rectriangle:{
        alignSelf:'center',
        width:0,
        height:0,
        borderStyle:'solid',
        borderWidth:6,
        borderTopColor:'#FFFF00',
        borderLeftColor:'rgba(255,255,255,0)',
        borderBottomColor:'rgba(255,255,255,0)',
        borderRightColor:'rgba(255,255,255,0)',
        marginTop:0,
        marginLeft:0,
        backgroundColor:'rgba(0,0,0,0)'
      }
    });
    // console.log(this.props.zoom);

    return (

      <View>
        <Marker
          onPress={()=>{this.props.onPress(this.props.latitude,this.props.longitude,this.props.item);}}
          draggable={false}
          active = {this.state.load}
          position={{
            latitude: this.props.latitude,
            longitude: this.props.longitude
          }}
        >
          {
            this.props.zoom >= 15?
              <View  >
              <View style={(this.props.item.MaxGrade>1.6)?style.recwindow:style.infoWindow}>


              <Text style={{ fontWeight: 'bold', color: '#ffffff' }}>{this.props.name} {this.props.amount}套</Text>

              {/*<Text style={{ color: '#ffffff' }}></Text>*/}

              </View>
              <View style={(this.props.item.MaxGrade>1.6)?style.rectriangle:style.triangle} />
              </View>:
              <View style={style.clusterWindow}>

                <Text style={{ fontWeight: 'bold', color: '#ffffff' }}>{this.props.name}</Text>
                <Text style={{ color: '#ffffff' }}>{this.props.amount}套</Text>

              </View>
          }
        </Marker>
      </View>
    );
  }
}
export default HouseMarker;
