import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

interface Props {
    title: string;
    onPress: () => void;
}

const BlackButton = ({title, onPress}: Props) => {
  return (
    <TouchableOpacity 
        activeOpacity={0.6}
        style={styles.btn}
        onPress={onPress}
    >
        <Text style={{color: 'white'}}>{title}</Text>

    </TouchableOpacity>
  )
}

export default BlackButton

const styles = StyleSheet.create({
    btn: {
        backgroundColor: '#333',
        padding: 15,
        margin: 5,
        marginVertical: 15,
        borderRadius: 10,
    }
})