import { Tabs } from 'expo-router';
import { Image, Text, View } from 'react-native';

import { icons } from '../../constants';

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className='items-center justify-center gap-2 pt-6'>
      <Image
        source={icon}
        resizeMode='contain'
        tintColor={color}
        className='w-6 h-6'
      />
      <Text 
        className={`${focused ? 'font-psemibold' : 'font-pregular'} text-[10px]`}
        numberOfLines={1}
      >
        {name}
      </Text>
    </View>
  )
}

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          // tabBarStyle: {
          //   height: 70, // Increase height if needed
          //   paddingHorizontal: 10, // Add horizontal padding
          // },
          // tabBarItemStyle: {
          //   paddingHorizontal: 8, // Add padding between items
          // }
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen
          name="bookmark"
          options={{
            title: 'Bookmark',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.bookmark}
                color={color}
                name="Save"
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: 'Create',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.plus}
                color={color}
                name="New"
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name="Me"
                focused={focused}
              />
            )
          }}
        />
      </Tabs>
    </>
  )
}

export default TabsLayout