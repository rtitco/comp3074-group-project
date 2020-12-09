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
          console.log(myRestaurants)
          searchData('')
        }
      }
    });
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      searchData("");
      console.log("we got here");
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

  return (
    <View style={styles.pageContainer}>

      <View style={styles.searchBar}>
        <TextInput
          placeholder="Search by Name or Tag"
          style={styles.textView}
          onChangeText={(query) => searchData(query)}
          value={query}
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
                  <Text style={styles.textTag}>{item.tags}</Text>
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
    borderColor: "#E54B4B",
    borderRadius: 10,
  },
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: "#f7ebe8"
  },
  searchBar: {
    flexDirection: 'row',
    margin: '2%',
    borderColor: 'black',
    borderWidth: 1,
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
    margin: '1%'
  },
  cardRight: {
    flexGrow: 1,
    margin: '1%'
  },

  cardDelete: {
    borderRadius: 8,
    backgroundColor: '#E54B4B',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  cardLines:
  {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

});