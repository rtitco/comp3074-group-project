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
            />
            <Stack.Screen
                name="Edit Restaurant Review"
                component={EditRestaurant}
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
            />
        </Stack.Navigator>
    )
}
export {AboutScreenNavigator}