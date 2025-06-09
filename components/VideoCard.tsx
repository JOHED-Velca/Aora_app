import { icons } from '@/constants';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const VideoCard = ({ video: {title, thumbnail, video, creator: {username, avatar}}}: any) => {
    // State to manage video playback
    const [play, setPlay] = useState(false);
    const player = useVideoPlayer(video, (player) => {
        player.loop = false;
      });
    
      useEffect(() => {
        if (play) {
          player.play();
        }else{
          player.pause();
          player.currentTime = 0;
        }
      }, [play]);
    
      useEffect(() => {
        const subscription = player.addListener('playToEnd', () => {
          setPlay(false);
        })
    
        return () => {
          subscription.remove();
        };
      }, []);
  return (
    <View className='flex-col items-center px-4 mb-14'>
        <View className='flex-row gap-3 items-start'>
            <View className='justify-center items-center flex-row flex-1'>
                <View className='w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5'>
                    <Image
                        source={{ uri: avatar }}
                        className='w-full h-full rounded-lg'
                        resizeMode='cover'
                    />
                </View>
                
                <View className='justify-center flex-1 ml-3 gap-y-1'>
                    <Text className='text-white font-psemibold text-sm' numberOfLines={1}>
                        {title}
                    </Text>
                    <Text className='text-xs text-gray-100 font-pregular' numberOfLines={1}>
                        {username}
                    </Text>
                </View>
            </View>

            <View className='pt-2'>
                <Image
                    source={icons.menu}
                    className='w-5 h-5'
                    resizeMode='contain'
                />
            </View>
        </View>

        {play ? (
            <View className='w-60 h-72 overflow-hidden'>
                <VideoView
                    player={player}
                    contentFit='contain'
                    allowsFullscreen
                    nativeControls
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                />
            </View>
        ):(
            <TouchableOpacity
                className='w-full h-60 rounded-xl mt-3 relative justify-center items-center'
                activeOpacity={0.7}
                onPress={() => setPlay(true)}
            >
                <Image
                    source={{ uri: thumbnail}}
                    className='w-full h-full rounded-xl mt-3'
                    resizeMode='cover'
                />
                <Image
                    source={icons.play}
                    className='w-12 h-12 absolute'
                    resizeMode='contain'
                />
            </TouchableOpacity>
        )}
    </View>
  )
}

export default VideoCard