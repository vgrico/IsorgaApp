import React, { useCallback, useReducer, useState, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Alert,
    TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, SIZES, icons, images } from '../../constants'
import Header from '../../components/Header'
import { reducer } from '../../utils/reducers/formReducers'
import { validateInput } from '../../utils/actions/formActions'
import Input from '../../components/Input'
import Checkbox from 'expo-checkbox'
import Button from '../../components/Button'
import AsyncStorage from '@react-native-async-storage/async-storage'

const isTestMode = true

const initialState = {
    inputValues: {
        nickname: '',
    },
    inputValidities: {
        nickname: false,
    },
    formIsValid: false,
}

const EditarPerfil = ({ navigation }) => {
    const [formState, dispatchFormState] = useReducer(reducer, initialState)
    const [isChecked, setChecked] = useState(false)
    const [userId, setUserId] = useState(null)


    useEffect(() => {
      // Función para cargar el userId al montar el componente
      const loadUserId = async () => {
          try {
              const userIdFromStorage = await AsyncStorage.getItem('userId')
              setUserId(userIdFromStorage)
          } catch (error) {
              console.error('Error loading userId from AsyncStorage:', error)
          }
      }

      // Cargar userId al montar el componente
      loadUserId()
  }, [])


    const inputChangedHandler = useCallback(
        (inputId, inputValue) => {
            const result = validateInput(inputId, inputValue)
            dispatchFormState({ inputId, validationResult: result, inputValue })
        },
        [dispatchFormState]
    )

    const updateProfileHandler = async () => {
        const { nickname } = formState.inputValues

        try {
            const response = await fetch(
                'https://momdel.es/animeWorld/api/editarPerfil.php',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        nickname,
                        userId,
                    }),
                }
            )

            const data = await response.json()

            if (response.ok) {
                // Si la respuesta es exitosa, muestra el mensaje de éxito y navega a la siguiente pantalla
                Alert.alert('Success', 'Profile updated successfully')
                navigation.goBack()
            } else {
                // Si la respuesta no es exitosa, muestra un mensaje de error genérico
                Alert.alert('Error', 'Failed to update profile')
            }
        } catch (error) {
            // Si hay un error en la llamada a la API, muestra un mensaje de error
            Alert.alert('Error', 'Failed to update profile')
        }
    }

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
            <View style={[styles.container, { backgroundColor: COLORS.white }]}>
                <Header />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={images.logo}
                            resizeMode="contain"
                            style={styles.logo}
                        />
                    </View>
                    <Text style={[styles.title, { color: COLORS.black }]}>
                        Edit Your Profile
                    </Text>
                    <Input
                        onInputChanged={inputChangedHandler}
                        errorText={formState.inputValidities['nickname']}
                        autoCapitalize="none"
                        id="nickname"
                        placeholder="Nickname"
                        placeholderTextColor={COLORS.black}
                        icon={icons.user}
                        value={formState.inputValues.nickname}
                    />
                    <View style={styles.checkBoxContainer}>
                        <View style={{ flexDirection: 'row' }}>
                            <Checkbox
                                style={styles.checkbox}
                                value={isChecked}
                                color={isChecked ? COLORS.primary : 'gray'}
                                onValueChange={setChecked}
                            />
                            <View style={{ flex: 1 }}>
                                <Text
                                    style={[
                                        styles.privacy,
                                        { color: COLORS.black },
                                    ]}
                                >
                                    By continuing you accept our Privacy Policy
                                </Text>
                            </View>
                        </View>
                    </View>
                    <Button
                        title="Update Profile"
                        filled
                        onPress={updateProfileHandler}
                        style={styles.button}
                    />
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: COLORS.white,
    },
    logo: {
        width: 100,
        height: 100,
        tintColor: COLORS.primary,
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 32,
    },
    title: {
        fontSize: 28,
        fontFamily: 'bold',
        color: COLORS.black,
        textAlign: 'center',
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkBoxContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 18,
    },
    checkbox: {
        marginRight: 8,
        height: 16,
        width: 16,
        borderRadius: 4,
        borderColor: COLORS.primary,
        borderWidth: 2,
    },
    privacy: {
        fontSize: 12,
        fontFamily: 'regular',
        color: COLORS.black,
    },
    socialTitle: {
        fontSize: 19.25,
        fontFamily: 'medium',
        color: COLORS.black,
        textAlign: 'center',
        marginVertical: 26,
    },
    socialBtnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 18,
        position: 'absolute',
        bottom: 12,
        right: 0,
        left: 0,
    },
    bottomLeft: {
        fontSize: 14,
        fontFamily: 'regular',
        color: 'black',
    },
    bottomRight: {
        fontSize: 16,
        fontFamily: 'medium',
        color: COLORS.primary,
    },
    button: {
        marginVertical: 6,
        width: SIZES.width - 32,
        borderRadius: 30,
    },
})

export default EditarPerfil
