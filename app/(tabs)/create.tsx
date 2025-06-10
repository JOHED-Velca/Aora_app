import CustomButton from '@/components/CustomButton'
import FormField from '@/components/FormField'
import { icons } from '@/constants'
import { useGlobalContext } from '@/context/GlobalProvider'
import { createVideo } from '@/lib/appwrite'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import { useVideoPlayer, VideoView } from 'expo-video'
import React, { useEffect, useState } from 'react'
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = React.useState({
    title: '',
    video: null,
    thumbnail: null,
    prompt: '',
  })

  const openPicker = async (selectType:any) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if(!result.canceled && result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      console.log(`Selected ${selectType}:`, selectedAsset.uri);

      // Add mime type if it's not present
    if (!selectedAsset.mimeType) {
      selectedAsset.mimeType = selectType === 'video' ? 'video/mp4' : 'image/jpeg';
    }
      
      if(selectType === 'image') {
        setForm({...form, thumbnail: selectedAsset});
      } else if(selectType === 'video') {
        setForm({...form, video: selectedAsset});
      }
    }
  }

  const submit = async () =>{
    if(!form.prompt || !form.title || !form.video || !form.thumbnail) {
      return Alert.alert('Please fill all the fields');
    }

    setUploading(true)

    try {
      await createVideo({
        ...form, creatorId: user.$id
      })

      Alert.alert('Success', 'Your post has been uploaded successfully!')
      router.push('/home')
    } catch (error: any) {
      Alert.alert('Error', error.message)
    } finally {
      setForm({
        title: '',
        video: null,
        thumbnail: null,
        prompt: '',
      })

      setUploading(false);
    }
  }

  // State to manage video playback
  const [play, setPlay] = useState(false);
  const player = useVideoPlayer(form.video, (player) => {
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
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView className='px-4 my-6'>
        <Text className='text-2xl text-white font-psemibold'>Upload Video</Text>

        <FormField
          title='Video Title'
          value={form.title}
          placeholder='Give your video a title...'
          handleChangeText={(e:any) => setForm({...form, title: e})}
          otherStyles='mt-10'
        />

        <View className='mt-7 space-y-2'>
          <Text className='text-base text-gray-100 font-pmedium'>
            Upload Video
          </Text>

          <TouchableOpacity onPress={() => openPicker('video')}>
            {form.video ? (
              <View className='w-full h-64 rounded-2xl'>
                <VideoView
                  player={player}
                  contentFit='cover'
                  style={{
                      width: '100%',
                      height: '100%',
                  }}
                />
              </View>
            ) : (
              <View className='w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center'>
                <View className='w-14 h-14 border border-dashed border-secondary-100 justify-center items-center'>
                  <Image
                    source={icons.upload}
                    resizeMode='contain'
                    className='w-1/2 h-1/2'
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className='mt-7 space-y-2'>
          <Text className='text-base text-gray-100 font-pmedium'>
            Thumbnail Image
          </Text>

          <TouchableOpacity onPress={() => openPicker('image')}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                resizeMode='cover'
                className='w-full h-64 rounded-2xl'
              />
            ) : (
              <View className='w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2'>
                <Image
                  source={icons.upload}
                  resizeMode='contain'
                  className='w-5 h-5'
                />
                <Text className='text-sm text-gray-100 font-pmedium'> Choose a file</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <FormField
          title='AI Prompt'
          value={form.prompt}
          placeholder='The prompt you used to create this video'
          handleChangeText={(e:any) => setForm({...form, prompt: e})} //changed from title to prompt
          otherStyles='mt-7'
        />

        <CustomButton
          title = "Submit & Publish"
          handlePress={submit}
          containerStyles='mt-7'
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Create