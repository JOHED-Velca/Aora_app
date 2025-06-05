import { images } from '@/constants'
import { router } from 'expo-router'
import React from 'react'
import { Image, Text, View } from 'react-native'
import CustomButton from './CustomButton'

const EmptyState = ({ title, subtitle }: any) => {
  return (
    <View className='justify-center items-center px-4'>
      <Image source={images.empty} className='w-[270px] h-[215px]' resizeMode='contain'/>
      <Text className='text-xl text-center font-psemibold text-white mt-2'>
        {title}
      </Text>
      <Text className='font-pmedium text-sm text-gray-100'>
        {subtitle}
      </Text>

      <CustomButton
        title='Create Video'
        containerStyles='w-full my-5'
        handlePress={() => router.push('/create')}
      />
    </View>
  )
}

export default EmptyState