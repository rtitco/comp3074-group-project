import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';


About = () => {
  const route = useRoute();
  return (
    <View style={styles.students}>
    <Text style={styles.studentName}>Joel Piovesan</Text>
    <Text>101221909</Text>
    <Text></Text>
    <Text style={styles.studentName}>Rachel Titco</Text>
    <Text>101214347</Text>

  </View>
  )
}

export default About;

const styles = StyleSheet.create({
  students: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  studentName: {
    fontWeight:'bold',
    fontSize: 20
  }
});