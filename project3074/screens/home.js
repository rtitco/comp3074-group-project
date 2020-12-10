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

export default function Home({ navigation, route }) {
  const [reviews, setReviews] = useState([]);
  const [arrayholder, setArrayholder] = useState([]);

  const searchData = (query) => {
    getData().then((e) => {

      const tagResults = e.filter(item => {
        const tagList = item.tags.split(',');
        const nameData = item.name.toLowerCase();
        const lowCaseQuery = query.toLowerCase();
        for(let i=0; i < tagList.length; i++){
           tagList[i].toLowerCase();
          if (tagList[i].indexOf(lowCaseQuery) > -1 || nameData.indexOf(lowCaseQuery) > -1 ){
            return tagList[i].indexOf(lowCaseQuery) > -1 || nameData.indexOf(lowCaseQuery) > -1 
          }
        }
      })
      setArrayholder(tagResults);
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
          console.log(myRestaurants)
          searchData('')
        }
      }
    });
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      searchData("");
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    searchData('')
  }, [])

  const formatPhoneNumber = (phoneNumberString) => {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3]
    }
    return null
  }

  const formatTags = (tagString) => {
    var tagsArray = tagString.split(',')
    var textLoop = [];
    for(let i = 0; i<tagsArray.length; i++){
      textLoop.push({'text': tagsArray[i]})
    }
     return textLoop.map((item, index) => <Text style={styles.textTag} key={index}>{item.text}</Text>);
  }

  return (
    <View style={styles.pageContainer}>

      <View style={styles.searchBar}>
        <TextInput
          placeholder="Search by Name or Tag"
          style={styles.textView}
          onChangeText={(query) => {searchData(query)}}
        />
      </View>

      <FlatList
        data={arrayholder}
        keyExtractor={({ key }, index) => key.toString()}
        renderItem={({ item }) => (

          <View style={styles.cardContainer}>

            {/* Card */}
            <TouchableOpacity style={styles.cardLeft} onPress={() => navigation.navigate('Edit Restaurant Review', item)}>
              <Card >
                <View style={styles.cardLines}>
                  <Text style={styles.header} >{item.name}</Text>
                  <Rating
                    readonly
                    type='custom'
                    imageSize={20}
                    ratingColor="#E54B4B"
                    startingValue={parseInt(item.rating)}
                  />
                </View>

                <View style={styles.cardLines}>
                  <Text>{item.address}</Text>
                  <Text>
                    + {formatPhoneNumber(item.phone)}
                  </Text>
                </View>

                <View style={styles.cardLines}>
                  <Text>{item.city}, {item.country}</Text>
                </View>

                <View style={styles.cardLines}>
                  <Text style={styles.textDescription}>"{item.desc}"</Text>
                </View>

                <View style={styles.cardLines}>
                  {formatTags(item.tags)}
                </View>

              </Card>
            </TouchableOpacity>

            {/* Delete */}
            <TouchableOpacity style={styles.cardRight} onPress={() => deleteItem(item)}>
              <View style={styles.cardDelete}>
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
  header: {
    color: "#E54B4B",
    fontSize: 18,
    fontWeight: "bold",
  },
  textDescription: {
    fontStyle: "italic",
  },
  textTag: {
    backgroundColor: "#E54B4B",
    color: "white",
    paddingHorizontal: 8,
    marginTop:5,
    borderColor: "#E54B4B",
    borderRadius: 10
  },
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    //backgroundColor: "#FFA987"
  },
  searchBar: {
    flexDirection: 'row',
    margin: '2%',
    borderColor: '#E54B4B',
    borderWidth: 3,
    borderRadius: 5,
    backgroundColor: 'white'
  },

  cardContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
  },

  cardLeft: {
    flexGrow: 9,
    margin: '1%',
    width:'90%'
  },
  cardRight: {
    flexGrow: 1,
    width: '10%',
    marginVertical:'1%'
  },

  cardDelete: {
    backgroundColor: '#E54B4B',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  cardLines:
  {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },

});