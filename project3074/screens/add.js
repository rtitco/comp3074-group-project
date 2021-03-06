import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Formik } from 'formik';
import { Rating } from 'react-native-ratings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as yup from 'yup';

const phoneregex = /^[0-9]{10}$/
const addressregex = /^(\d+) ?([A-Za-z](?= ))? (.*?)?$/
const ratingregex = /^([1-5])$/
const tagregex = /^([A-Z a-z]{3,}[\,]?)*$/ //alphabet, spaces, and commas

const reviewSchema = yup.object({
    name: yup.string()
        .typeError('Invalid Name')
        .required('Restaurant Name is required')
        .min(4),
    address: yup.string()
        .required('Restaurant Address is required')
        .matches(addressregex, 'Example format - 123 Example St'),
    city: yup.string()
        .required('City is required')
        .min(4),
    country: yup.string()
        .required('Country is required')
        .min(4),
    phone: yup.string()
        .required('Phone Number is required')
        .matches(phoneregex, 'Phone Number must contain only a string of 10 digits e.g. 4161112222'),
    desc: yup.string()
        .required('Please enter a short restaurant description')
        .min(3)
        .max(160, 'Maximum 80 characters'),
    tags: yup.string()
        .required('Must enter at least 1 tag')
        .matches(tagregex, 'Tags must be separated by commas\',\''),
    rating: yup.number()
        .required('Please enter a rating between 1-5')
        .positive('Rating must be between 1-5')
        .min(1, 'Rating must be between 1-5')
        .max(5, 'Rating must be between 1-5')
})

const getRandomInt = () => {
    return Math.floor(Math.random() * Math.floor(99999999999));
}

const storeData = async (input) => {
    let found = false;
    let myRestaurants;
    let myId = getRandomInt();

    getData().then(async (e) => {
        if (e != null) {
            myRestaurants = e;
        }
        else {
            myRestaurants = [];
        }
        for (let i = 0; i < myRestaurants.length; i++) {
            if (input.phone == myRestaurants[i].phone) {
                found = true
                break;
            }
        }
        if (found != true) {
            try {
                input.key = myId
                myRestaurants.push(input)
                const jsonValue = JSON.stringify(myRestaurants)
                await AsyncStorage.setItem('restaurants_key', jsonValue)
            } catch (e) {
                console.log(e)
                console.log("Error in storeData()")
            }
        }
    })
}

const getData = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('restaurants_key')
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        // error reading value
        return ['Empty']
    }
}

export default function AddRestaurant({ navigation }) {
    return (
        <ScrollView>

            <View style={styles.container}>
                <Text style={styles.header}>Add Restaurant</Text>
                <Formik
                    initialValues={{
                        name: '',
                        address: '',
                        city: '',
                        country: '',
                        phone: '',
                        desc: '',
                        tags: '',
                        rating: ''
                    }}
                    validationSchema={reviewSchema}
                    onSubmit={(values, actions) => {
                        storeData(values).then(() => {
                            setTimeout(() => {
                                navigation.navigate('Home')
                            }, 100)
                        })
                            .finally(() => {
                                actions.resetForm();
                            });
                    }}
                >
                    {(props) => (
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View>
                                <Text style={styles.inputLabel}>Restaurant Name:</Text>
                                <TextInput
                                    placeholder="Enter restaurant name"
                                    style={styles.textView}
                                    onChangeText={props.handleChange('name')}
                                    value={props.values.name}
                                />
                                <Text style={styles.errors}>{props.errors.name}</Text>

                                <Text style={styles.inputLabel}>Address:</Text>
                                <TextInput
                                    placeholder="Address"
                                    style={styles.textView}
                                    onChangeText={props.handleChange('address')}
                                    value={props.values.address}
                                />
                                <Text style={styles.errors}>{props.errors.address}</Text>

                                <Text style={styles.inputLabel}>City:</Text>
                                <TextInput
                                    placeholder="Toronto"
                                    style={styles.textView}
                                    onChangeText={props.handleChange('city')}
                                    value={props.values.city}
                                />
                                <Text style={styles.errors}>{props.errors.city}</Text>

                                <Text style={styles.inputLabel}>Country:</Text>
                                <TextInput
                                    placeholder="Canada"
                                    style={styles.textView}
                                    onChangeText={props.handleChange('country')}
                                    value={props.values.country}
                                />
                                <Text style={styles.errors}>{props.errors.country}</Text>

                                <Text style={styles.inputLabel}>Phone Number:</Text>
                                <TextInput
                                    placeholder="000-000-0000"
                                    keyboardType="phone-pad"
                                    style={styles.textView}
                                    onChangeText={props.handleChange('phone')}
                                    value={props.values.phone.toString()}
                                />
                                <Text style={styles.errors}>{props.errors.phone}</Text>

                                <Text style={styles.inputLabel}>Description:</Text>
                                <TextInput
                                    multiline={true}
                                    numberOfLines={5}
                                    style={styles.descBox}
                                    placeholder="Description"
                                    onChangeText={props.handleChange('desc')}
                                    value={props.values.desc}
                                />
                                <Text style={styles.errors}>{props.errors.desc}</Text>

                                <Text style={styles.inputLabel}>Tags: <Text style={styles.subhead}>(min. 3 characters)</Text></Text>
                                <TextInput
                                    multiline={true}
                                    numberOfLines={2}
                                    style={styles.tagBox}
                                    placeholder="Separate tags by commas ' , ' "
                                    onChangeText={props.handleChange('tags')}
                                    value={props.values.tags}
                                />
                                <Text style={styles.errors}>{props.errors.tags}</Text>

                                <Text style={styles.inputLabel}>Rating:</Text>
                                <TextInput
                                    multiline
                                    placeholder="Rating (1-5)"
                                    keyboardType="numeric"
                                    style={styles.textView}
                                    onChangeText={props.handleChange('rating')}
                                    value={props.values.rating.toString()}
                                />
                                <Text style={styles.errors}>{props.errors.rating}</Text>

                                <Text></Text>
                                <Button
                                    onPress={props.handleSubmit}
                                    title="Add Restaurant"
                                    style={styles.btnSubmit}
                                    color="#1E1E24"
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                </Formik>
            </View>
        </ScrollView >
    )
}

const styles = StyleSheet.create({
    header: {
        paddingBottom: 10,
        fontSize: 20,
        fontWeight: "bold",
    },
    inputLabel: {
        fontWeight: 'bold'
    },
    textView: {
        width: 250,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        backgroundColor: 'white'

    },
    descBox: {
        width: 250,
        height: 100,
        borderColor: 'gray',
        borderWidth: 1,
        textAlignVertical: 'top',
        padding: 5,
        backgroundColor: 'white'
    },
    tagBox: {
        width: 250,
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        textAlignVertical: 'top',
        padding: 5,
        backgroundColor: 'white'
    },
    btnSubmit: {
        marginTop: 50
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 30,
    },
    errors: {
        color: 'red',
        fontSize: 10,
        paddingBottom: 10
    },
    subhead: {
        fontSize: 12
    }
});
