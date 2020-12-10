import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import Home from './screens/home.js';
import About from './screens/about.js';
import AddRestaurant from './screens/add.js';
import EditRestaurant from './screens/edit.js';

const Stack = createStackNavigator()

const HomeScreenNavigator = () => {
    return(
        <Stack.Navigator>
            <Stack.Screen 
                name="Home"
                component={Home}
                options={{
                    title: 'Restaurant List',
                    headerStyle: {
                      backgroundColor: '#E54B4B',
                    },
                    headerTintColor: '#fff',
                }}
            />
            <Stack.Screen
                name="Edit Restaurant Review"
                component={EditRestaurant}
                options={{
                    title: 'Edit Restaurant',
                    headerStyle: {
                      backgroundColor: '#E54B4B',
                    },
                    headerTintColor: '#fff',
                }}
            />
        </Stack.Navigator>
    )
}
export {HomeScreenNavigator}

const AddScreenNavigator = () => {
    return(
        <Stack.Navigator>
            <Stack.Screen 
                name="Add Restaurant Review"
                component={AddRestaurant}
                options={{
                    title: 'Add Restaurant Review',
                    headerStyle: {
                      backgroundColor: '#E54B4B',
                    },
                    headerTintColor: '#fff',
                }}
            />
        </Stack.Navigator>
    )
}
export {AddScreenNavigator}

const AboutScreenNavigator = () => {
    return(
        <Stack.Navigator>
            <Stack.Screen 
                name="About Us"
                component={About}
                options={{
                    title: 'About Us',
                    headerStyle: {
                      backgroundColor: '#E54B4B',
                    },
                    headerTintColor: '#fff',
                }}
            />
        </Stack.Navigator>
    )
}
export {AboutScreenNavigator}