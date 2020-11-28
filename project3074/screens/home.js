import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, TextInput, Button } from 'react-native';
import { useRoute, useIsFocused, useFocusEffect } from '@react-navigation/native';
import AddForm from './add.js'
import Card from '../shared/card';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Rating } from 'react-native-ratings';
import Icon from 'react-native-vector-icons/FontAwesome';

const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('restaurants_key')
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
  }
}

export default function Home({ navigation, route }){
  const [reviews, setReviews] = useState([]);
  const [arrayholder,setArrayholder] = useState([]);
  const [query, setQuery] = useState('') 

  const searchData = (query) => {
    getData().then((e) => {
      setReviews(e);

      const newData = e.filter(item => {
        const itemData = item.name.toLowerCase();
        const textData = query.toLowerCase();
        return itemData.indexOf(textData) > -1
      });
      setQuery(query)
      setArrayholder(newData)
    });
  }

  const deleteItem = (item) => {
    getData().then(async (e) => {
      let myRestaurants = e;
      for (i = 0; i < myRestaurants.length; i++) {
          if (myRestaurants[i].key === item.key) {
              myRestaurants.splice(i, 1);
              const jsonValue = JSON.stringify(myRestaurants);
              await AsyncStorage.setItem('restaurants_key', jsonValue);
              console.log("delete complete")
              searchData()
          }
      }
    });
  }

  useEffect( () => {
    searchData('')
  }, [])


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{flexDirection: 'row' }}>
      <TextInput
          placeholder="Search by name or tag"
          style={styles.textView}
          onChangeText={(query) => searchData(query)}
          value={query}
      />
      </View>

        <FlatList
        data={arrayholder}
        keyExtractor={({ key }, index) => key.toString()}
        renderItem={({ item }) => (
          <View style={{flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => navigation.navigate('Edit Restaurant Review', item)}>
              <Card >
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.header} >{ item.name }</Text>
                <Rating
                  readonly
                  type='custom'
                  imageSize={20}
                  ratingColor="#E54B4B"
                  startingValue={parseInt(item.rating)}
                  /> 
                </View>
                <View style={{flex: 1, flexDirection: 'row',justifyContent: 'space-between'}}>
                <Text>{ item.address }</Text>
                <Text>+{ item.phone }</Text>
                </View>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.textDescription}>"{ item.desc }"</Text>
                <Text style={styles.textTag}>{ item.tags }</Text>
                </View>
              </Card>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteItem(item)}>
            <View  style={{ borderRadius:8,padding:5,marginVertical:10,backgroundColor:'#E54B4B',flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Icon name="trash" size={20} color="white" />
            </View>
            </TouchableOpacity>
      </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  header:{
      color:"#E54B4B",
      fontSize:18,
      fontWeight:"bold",
  },
  textDescription: {
      fontStyle:"italic",
  },
  textTag:{
      backgroundColor:"#E54B4B",
      color:"white",
      paddingHorizontal:8,
      borderColor: "#E54B4B",
      borderRadius: 10,
  },
  container: { 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor:'white',
      marginTop:50,
      paddingVertical:30,
  }
});