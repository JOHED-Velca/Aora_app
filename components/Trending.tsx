import { icons } from '@/constants';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, ImageBackground, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

// import Video from 'expo-av';
import { useVideoPlayer, VideoView } from 'expo-video';

const zoomIn = {
  0: {
    scale: 0.9
  },
  1: {
    scale: 1.1
  }
}

const zoomOut = {
  0: {
    scale: 1.1
  },
  1: {
    scale: 0.9
  }
}

const TrendingItem = ({activeItem, item}:any) => {
  const [play, setPlay] = useState(false);
  const player = useVideoPlayer(item.video, (player) => {
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
    <Animatable.View
      className='mr-5'
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      <View className='w-52 h-72 rounded-[35px] mt-3 bg-white/10 overflow-hidden'>
        {play ? (
          <VideoView
            player={player}
            contentFit='contain'
            nativeControls
            style={{
              width: '100%',
              height: '100%',
            }}
          />
          // <Video
          //   source={{ uri: item.video }}
          //   className='w-52 h-72 rounded-[35px] mt-3 bg-white/10'
          //   resizeMode='contain'
          //   useNativeControls
          //   shouldPlay
          //   onPlaybackStatusUpdate={(status:any) => {
          //     if('didJustFinish' in status && status.didJustFinish) {
          //       setPlay(false);
          //     }
          //   }}
          // />
        ) : (
          <TouchableOpacity
            className='relative justify-center items-center'
            activeOpacity={0.7}
            onPress={() => setPlay(true)}
          >
            <ImageBackground
              source={{ uri: item.thumbnail }}
              className='w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40'
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
    </Animatable.View>
  )
}

const Trending = ({ posts }: any) => {
  const [activeItem, setActiveItem] = useState(posts[1]);

  const viewableItemsChanged = ( { viewableItems }: any) => {
    if(viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key)
    }
  }
  
  return (
    <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
            <TrendingItem activeItem={activeItem} item={item} />
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 70
        }}
        contentOffset={{ x: 170, y: 0}}
        horizontal
    />
  )
}

export default Trending