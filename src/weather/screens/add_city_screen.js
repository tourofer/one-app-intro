import React, { useState } from 'react'
import { View, Text, TextInput } from 'react-native'
import { debounce } from 'lodash'

export default AddCityScreen = (props) => {

    const [query, setQuery] = useState("")
    const onChangeText = ((text) => {
        setQuery(text)
    })

    const debounceTextChangeEvent = debounce(onChangeText, 300)

    return <View>
        <Text>Add city screen</Text>
        <Text>{query}</Text>
        <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
            onChangeText={debounceTextChangeEvent}
        />
    </View>
}