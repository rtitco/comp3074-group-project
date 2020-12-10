import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { readDir } from 'react-native-fs';
import Icon from 'react-native-vector-icons/FontAwesome';


export default function Card(props) {
  return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          { props.children }
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  card: {
    elevation: 3,
    backgroundColor: '#fff',
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  cardContent: {
    marginHorizontal: 18,
    marginVertical: 20,
  }
});
