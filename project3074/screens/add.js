import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Formik } from 'formik';
import { Rating } from 'react-native-ratings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as yup from 'yup';

const phoneregex = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
const addressregex = /^(\d+) ?([A-Za-z](?= ))? (.*?)?$/
const ratingregex = /^([1-5])$/

const reviewSchema = yup.object({
    name: yup.string()
        .typeError('Invalid Name')
        .required('Restaurant Name is required')
        .min(4), 
    address: yup.string()
        .required('Restaurant Address is required')
        .matches(addressregex, 'Example format - 123 Example St'),
    phone: yup.string()
        .required('Phone Number is required')
        .matches(phoneregex, 'Phone Number is not valid'),
    desc: yup.string()
        .required('Please enter a short restaurant description')
        .min(3)
        .max(160, 'Maximum 80 characters'),
    tags: yup.string()
        .required('Must enter at least 1 tag'),
    rating: yup.number()
        .required('Please enter a rating between 1-5')
        .positive('Rating must be between 1-5')
        .min(1, 'Rating must be between 1-5')
        .max(5, 'Rating must be between 1-5')
        // .test('is-num-1-5', 'Rating must be between 1-5', (value) => {
        //     return parseInt(value) < 6 && parseInt(value) > 0;
        // }),
})

const storeData = async (input) => {
    let found = false;
    let myRestaurants;
    let count = 0;
    getData().then(async (e) => {
        if (e != null) {
            myRestaurants = e;
        }
        else {
            myRestaurants = []; a
        }
        count = myRestaurants.length;
        for (let i = 0; i < count; i++) {
            if (input.phone == myRestaurants[i].phone) {
                found = true
                break;
            }
        }
        if (found != true) {
            try {
                input.key = count
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
    }
}

const clearAll = async () => {
    try {
        count = 0;
        await AsyncStorage.clear()
    } catch (e) {
        // clear error
    }

    console.log('Done.')
}

export default function AddRestaurant({navigation}) {
    return (
        <ScrollView style={{ backgroundColor: '#F7EBE8' }}>

            <View style={styles.container}>
                <Text style={styles.header}>Add Restaurant</Text>
                <Formik
                    initialValues={{ name: '', address: '', phone: '', desc: '', tags: '', rating: 0 }}
                    validationSchema={reviewSchema}
                    onSubmit={(values, actions) => {
                        actions.resetForm();
                        storeData(values);
                        navigation.navigate('Home');
                        // clearAll();
                    }}
                >

                    {(props) => (
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View>
                                <Text>Restaurant Name:</Text>
                                <TextInput
                                    placeholder="Enter restaurant name"
                                    style={styles.textView}
                                    onChangeText={props.handleChange('name')}
                                    value={props.values.name}
                                />
                                <Text style={styles.errors}>{ props.errors.name }</Text>

                                <Text>Address:</Text>
                                <TextInput
                                    placeholder="Address"
                                    style={styles.textView}
                                    onChangeText={props.handleChange('address')}
                                    value={props.values.address}
                                />
                                <Text style={styles.errors}>{ props.errors.address }</Text>

                                <Text>Phone Number:</Text>
                                <TextInput
                                    placeholder="000-000-0000"
                                    keyboardType="phone-pad"
                                    style={styles.textView}
                                    onChangeText={props.handleChange('phone')}
                                    value={props.values.phone.toString()}
                                />
                                <Text style={styles.errors}>{ props.errors.phone }</Text>

                                <Text>Description:</Text>
                                <TextInput
                                    placeholder="Description"
                                    style={styles.textView}
                                    onChangeText={props.handleChange('desc')}
                                    value={props.values.desc}
                                />
                                <Text style={styles.errors}>{ props.errors.desc }</Text>

                                <Text>Tags:</Text>
                                <TextInput
                                    placeholder="Separate tags by commas ' , ' "
                                    style={styles.textView}
                                    onChangeText={props.handleChange('tags')}
                                    value={props.values.tags}
                                />
                                <Text style={styles.errors}>{ props.errors.tags }</Text>

                                <Text>Rating:</Text>
                                <TextInput
                                    placeholder="Rating (1-5)"
                                    keyboardType="numeric"
                                    style={styles.textView}
                                    onChangeText={props.handleChange('rating')}
                                    value={props.values.rating.toString()}
                                />
                                <Text style={styles.errors}>{ props.errors.rating }</Text>

                                {/* <Rating
                    showRating
                    type='custom'
                    ratingColor="#E54B4B"
                    onFinishRating={props.handleChange('rating')}
                    style={{ paddingVertical: 10 }}
                    value={props.values.tags}
                    /> */}
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
    textView: {
        width: 250,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1
    },
    btnSubmit: {
        marginTop: 50
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        marginTop: 50,
        paddingVertical: 30,
    },
    errors: {
        color: 'red',
        fontSize: 10,
        paddingBottom: 10
    }
});
