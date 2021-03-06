import React, { useEffect } from 'react';
import { Share, View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import { useLinkProps, useRoute } from '@react-navigation/native';
import { Formik } from 'formik';
import { Rating } from 'react-native-ratings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as yup from 'yup';
import openMap from 'react-native-open-maps';

const phoneregex = /^[0-9]{10}$/
const addressregex = /^(\d+) ?([A-Z a-z](?= ))? (.*?)?$/
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
        .matches(phoneregex, 'Phone Number is not valid'),
    desc: yup.string()
        .required('Please enter a short restaurant description')
        .min(3)
        .max(160, 'Maximum 80 characters'),
    tags: yup.string()
        .required('Must enter at least 1 tag')
        .matches(tagregex, 'Must be a list separated by commas\',\''),

    rating: yup.number()
        .required('Please enter a rating between 1-5')
        .positive('Rating must be between 1-5')
        .min(1, 'Rating must be between 1-5')
        .max(5, 'Rating must be between 1-5')
})

const getData = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('restaurants_key')
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        // error reading value
    }
}

const updateData = async (input) => {
    getData().then(async (e) => {
     console.log(input);
        let myRestaurants = e;
        console.log(myRestaurants);
        for (i = 0; i < myRestaurants.length; i++) {
            if (myRestaurants[i].key === input.key) {
                myRestaurants[i] = input;
                const jsonValue = JSON.stringify(myRestaurants);
                await AsyncStorage.setItem('restaurants_key', jsonValue);
                console.log("update complete")
            }
        }
    })
}



export default function EditRestaurant({ route, navigation }) {
    const { name, address, city, country, phone, desc, tags, rating, key } = route.params;

    const openInMaps = () => {
        openMap({ query: name + ", " + address + ", " + city + ", " + country });
    }

    const onShare = (name, address, city, country, rating, desc) => {
        const result = Share.share({
            message:
                "Checkout this restaurant I reviewed!\n"
                + "\n\nRestaurant Name:\n" + name
                + "\n\nDescription:\n " + desc
                + "\n\nLocation:\n " + address + ", " + city + ", " + country
                + "\n\nRating:\n " + rating + "/5"
        });
        if (result.action === Share.sharedAction) {
            if (result.activityType) {
                // shared with activity type of result.activityType
            } else {
                // shared
            }
        } else if (result.action === Share.dismissedAction) {
        }
    };

    return (
        <ScrollView >

            <View style={styles.container}>

                <Text style={styles.header}>{name}</Text>

                <Formik
                    initialValues={{
                        name: name,
                        address: address,
                        city: city,
                        country: country,
                        phone: phone,
                        desc: desc,
                        tags: tags,
                        rating: rating
                    }}
                    validationSchema={reviewSchema}
                    onSubmit={(values) => {
                        values.key = key;
                        updateData(values).then(
                            setTimeout(() => {
                                (navigation.replace('Home'))
                            }, 1000)
                        )
                    }}>
                    {(props) => (
                        <View>
                            <Text style={styles.inputLabel}>Restaurant Name:</Text>
                            <TextInput
                                style={styles.textView}
                                onChangeText={props.handleChange('name')}
                                value={props.values.name}
                            />
                            <Text style={styles.errors}>{props.errors.name}</Text>

                            <Text style={styles.inputLabel}>Address:</Text>
                            <TextInput
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
                                keyboardType="phone-pad"
                                style={styles.textView}
                                onChangeText={props.handleChange('phone')}
                                value={props.values.phone}
                            />
                            <Text style={styles.errors}>{props.errors.phone}</Text>

                            <Text style={styles.inputLabel}>Description:</Text>
                            <TextInput
                                multiline={true}
                                numberOfLines={1}
                                style={styles.descBox}
                                onChangeText={props.handleChange('desc')}
                                value={props.values.desc}
                            />
                            <Text style={styles.errors}>{props.errors.desc}</Text>

                            <Text style={styles.inputLabel}>Tags: <Text style={styles.subhead}>(min. 3 characters)</Text></Text>
                            <TextInput
                                multiline={true}
                                numberOfLines={1}
                                style={styles.tagBox}
                                onChangeText={props.handleChange('tags')}
                                value={props.values.tags}
                            />
                            <Text style={styles.errors}>{props.errors.tags}</Text>

                            <Text style={styles.inputLabel}>Rating:</Text>
                            <TextInput
                                style={styles.textView}
                                onChangeText={props.handleChange('rating')}
                                value={props.values.rating}
                            />
                            <Text style={styles.errors}>{props.errors.rating}</Text>

                            <Rating
                                showRating
                                readonly
                                type='custom'
                                ratingColor="#FF8A5C"
                                startingValue={parseInt(rating)}
                                style={{ paddingVertical: 10 }}
                            />

                            <Text></Text>
                            <Button
                                onPress={props.handleSubmit}
                                title="Update Restaurant"
                                style={styles.btnSubmit}
                                color="#444140"
                            />

                            <Text></Text>
                            <Button
                                onPress={() => onShare(props.values.name,
                                    props.values.address,
                                    props.values.city,
                                    props.values.country,
                                    props.values.rating,
                                    props.values.desc)}
                                title="Share"
                                style={styles.btnSubmit}
                                color="#444140"
                            />

                            <Text></Text>
                            <Button
                                onPress={openInMaps}
                                title="Open in Google Maps"
                                style={styles.btnSubmit}
                                color="#444140"
                            />
                        </View>
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
        backgroundColor: 'white',
        borderWidth: 1
    },
    descBox: {
        width: 250,
        height: 100,
        borderColor: 'gray',
        borderWidth: 1,
        textAlignVertical: 'top',
        backgroundColor: 'white',
        padding:5
    },
    tagBox: {
        width: 250,
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        textAlignVertical: 'top',
        padding:5,
        backgroundColor: 'white',
    },
    btnSubmit: {
        marginTop: 50
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
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
