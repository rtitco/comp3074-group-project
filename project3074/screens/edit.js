import React from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import { useLinkProps, useRoute } from '@react-navigation/native';
import { Formik } from 'formik';
import { Rating } from 'react-native-ratings';

export default function EditRestaurant({  route, navigation }){
    const { name, address, phone,desc, tags, rating} = route.params;
    return (
        <ScrollView style={{backgroundColor:'#F7EBE8'}}>
           
            <View style={styles.container}>
            <Text style={styles.header}>{name}</Text>
            <Formik
                initialValues={{ name: '', address: '', phone: '', desc: '', tags: '', rating: 0 }}
                onSubmit={(values) => {
                    //validation logic - if valid storedata(values)
                    storeData(values)
                    // clearAll();
                }}
            >
                {(props) => (
                    <View>
                        <Text>Restaurant Name:</Text>
                        <TextInput
                            style={styles.textView}
                            onChangeText={props.handleChange('name')}
                            value={name}
                        />
                        <Text>Address:</Text>
                        <TextInput
                            style={styles.textView}
                            onChangeText={props.handleChange('address')}
                            value={address}
                        />
                        <Text>Phone Number:</Text>
                        <TextInput
                            keyboardType="phone-pad"
                            style={styles.textView}
                            onChangeText={props.handleChange('phone')}
                            value={phone}
                        />
                        <Text>Description:</Text>
                        <TextInput
                            style={styles.textView}
                            onChangeText={props.handleChange('desc')}
                            value={desc}
                        />
                        <Text>Tags:</Text>
                        <TextInput
                            style={styles.textView}
                            onChangeText={props.handleChange('tags')}
                            value={tags}
                        />     
                        <Text>Rating:</Text>
                        <TextInput
                            style={styles.textView}
                            onChangeText={props.handleChange('rating')}
                            value={rating}
                        />
                        <Rating
                        showRating
                        readonly
                        type='custom'
                        ratingColor="#E54B4B"
                        startingValue={rating}
                        style={{ paddingVertical: 10 }}
                        /> 
                    <Text></Text>
                        <Button
                            onPress={props.handleSubmit}
                            title="Edit Restaurant"
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
                    </View>
                )}
            </Formik>
            </View>
        </ScrollView >

    )
}
const styles = StyleSheet.create({
    header:{
        paddingBottom:10,
        fontSize:20,
        fontWeight:"bold",
    },
    textView: {
        width: 250,
        height: 40, 
        borderColor: 'gray', 
        borderWidth: 1
    },
    btnSubmit:{
        marginTop:50
    },
    container: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor:'white',
        marginTop:40,
        paddingVertical:20,
    }
  });
