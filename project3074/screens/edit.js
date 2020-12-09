import React, { useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import { useLinkProps, useRoute } from '@react-navigation/native';
import { Formik } from 'formik';
import { Rating } from 'react-native-ratings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as yup from 'yup';
import openMap from 'react-native-open-maps';

const phoneregex = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
const addressregex = /^(\d+) ?([A-Za-z](?= ))? (.*?)?$/

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
        .required('Must enter at least 1 tag'),
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
        // console.log(input);
        let myRestaurants = e;
        // console.log(myRestaurants);
        for (i = 0; i < myRestaurants.length; i++) {
            if (myRestaurants[i].key === input.key) {
                myRestaurants[i] = input;
                const jsonValue = JSON.stringify(myRestaurants);
                await AsyncStorage.setItem('restaurants_key', jsonValue);
                console.log("update complete")
            }
        }
        // console.log("update failed")
    })
}

export default function EditRestaurant({ route, navigation }) {
    const { name, address, city, country, phone, desc, tags, rating, key } = route.params;
    const openInMaps = () => {
        openMap({ query: address + ", " + city + ", " + country});
    }
    return (
        <ScrollView style={{ backgroundColor: '#F7EBE8' }}>

            <View style={styles.container}>
                <Text style={styles.header}>{name}</Text>
                <Formik
                    initialValues={{ name: name, address: address, city: city, country: country, phone: phone, desc: desc, tags: tags, rating: rating }}
                    validationSchema={reviewSchema}
                    onSubmit={(values) => {
                        values.key = key;
                        updateData(values).then(
                            setTimeout(() => {
                                (navigation.replace('Home'))
                            }, 1000)
                        )
                        // actions.resetForm();
                        // navigation.navigate('Home', {updatedName:values.name});

                    }
                    }
                >
                    {(props) => (
                        <View>
                            <Text>Restaurant Name:</Text>
                            <TextInput
                                style={styles.textView}
                                onChangeText={props.handleChange('name')}
                                value={props.values.name}
                            />
                            <Text style={styles.errors}>{props.errors.name}</Text>

                            <Text>Address:</Text>
                            <TextInput
                                style={styles.textView}
                                onChangeText={props.handleChange('address')}
                                value={props.values.address}
                            />
                            <Text style={styles.errors}>{props.errors.address}</Text>

                            <Text>Phone Number:</Text>
                            <TextInput
                                keyboardType="phone-pad"
                                style={styles.textView}
                                onChangeText={props.handleChange('phone')}
                                value={props.values.phone}
                            />
                            <Text style={styles.errors}>{props.errors.phone}</Text>

                            <Text>Description:</Text>
                            <TextInput
                                style={styles.textView}
                                onChangeText={props.handleChange('desc')}
                                value={props.values.desc}
                            />
                            <Text style={styles.errors}>{props.errors.desc}</Text>

                            <Text>Tags:</Text>
                            <TextInput
                                style={styles.textView}
                                onChangeText={props.handleChange('tags')}
                                value={props.values.tags}
                            />
                            <Text style={styles.errors}>{props.errors.tags}</Text>

                            <Text>Rating:</Text>
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
                                ratingColor="#E54B4B"
                                startingValue={parseInt(rating)}
                                style={{ paddingVertical: 10 }}
                            />
                            <Text></Text>
                            <Button
                                onPress={props.handleSubmit}
                                title="Update Restaurant"
                                style={styles.btnSubmit}
                                color="#1E1E24"
                            />
                            <Text></Text>
                            <Button
                                onPress={props.handleSubmit}
                                title="Share"
                                style={styles.btnShare}
                                color="#1E1E24"
                            />
                            <Button
                                onPress={openInMaps}
                                title="Google Maps"
                                style={styles.btnSubmit}
                                color="#1E1E24"
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
        marginTop: 40,
        paddingVertical: 20,
    }
});
