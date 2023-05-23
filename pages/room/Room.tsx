import React, { useState } from 'react';
import { View, Text} from 'react-native';
import { Button} from 'react-native-paper';
import { StackNavigationProps } from '../../App';
import * as ScreenOrientation from 'expo-screen-orientation'

const Room  = ({route, navigation}:StackNavigationProps) => {
    const [full,setFull]=useState(false);
    async function test() {
        if(!full){
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
            setFull(!full)
        }
        else{
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
            setFull(!full)
        }
    }
    return(
        <View>
            <Button onPress={()=>navigation.navigate('RoomInside')} 
            style={{width:200,alignSelf:'center'}}
            mode='contained'>
                JUMP</Button>
        </View>
    )
}

export default Room;