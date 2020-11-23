import React from 'react';
import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';


About = () => {

  const route = useRoute();
  //console.log(route)
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Joel Piovesan</Text>
    <Text>101221909</Text>
    <Text></Text>
    <Text>Rachel Titco</Text>
    <Text>101214347</Text>

  </View>
  )
}

export default About;