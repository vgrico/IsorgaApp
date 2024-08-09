import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Alert,
    TouchableOpacity,
} from 'react-native'
import React, { useCallback, useEffect, useReducer, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, SIZES, icons, images } from '../../constants'
import Header from '../../components/Header'
import { reducer } from '../../utils/reducers/formReducers'
import { validateInput } from '../../utils/actions/formActions'
import Input from '../../components/Input'
import Checkbox from 'expo-checkbox'
import Button from '../../components/Button'
import SocialButton from '../../components/SocialButton'
import OrSeparator from '../../components/OrSeparator'
import AsyncStorage from '@react-native-async-storage/async-storage'
import HeaderSinVuelta from '../../components/mios/HeaderSinVuelta'

const isTestMode = true

const initialState = {
    inputValues: {
        email: isTestMode ? 'example@gmail.com' : '',
        password: isTestMode ? '**********' : '',
    },
    inputValidities: {
        email: false,
        password: false,
    },
    formIsValid: false,
}

const Login = ({ navigation }) => {
    const [formState, dispatchFormState] = useReducer(reducer, initialState)
    const [error, setError] = useState(null)
    const [isChecked, setChecked] = useState(false)

    const inputChangedHandler = useCallback(
        (inputId, inputValue) => {
            const result = validateInput(inputId, inputValue)
            dispatchFormState({ inputId, validationResult: result, inputValue })
        },
        [dispatchFormState]
    )

    useEffect(() => {
        if (error) {
            Alert.alert('An error occured', error)
        }
    }, [error])

    const loginHandler = async () => {
        try {
            const response = await fetch(
                'https://isorga.com/api/app/login.php',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: formState.inputValues.email,
                        password: formState.inputValues.password,
                    }),
                }
            )
            const data = await response.json()

            if (response.ok) {
                if (
                    data.result !== 'Usuario No Encontrado' &&
                    data.result !== 'Datos erroneos'
                ) {
                    // Convertir el ID del usuario a una cadena de texto
                    const userIdString = data.result.toString()
                    console.log(userIdString)
                    // Guardar el ID del usuario en AsyncStorage
                    await AsyncStorage.setItem('isorgaId', userIdString)
                    // Verificar si el personaje es diferente de 0
                        // Navegar a una página diferente si el personaje es diferente de 0
                        navigation.navigate('Centros', {pantalla: 0})

                } else {
                    throw new Error(data.result)
                }
            } else {
                throw new Error('Network response was not ok.')
            }
        } catch (error) {
            setError(error.message || 'Something went wrong')
        }
    }

    // Implementing apple authentication
    const appleAuthHandler = () => {
        console.log('Apple Authentication')
    }

    // Implementing facebook authentication
    const facebookAuthHandler = () => {
        console.log('Facebook Authentication')
    }

    // Implementing google authentication
    const googleAuthHandler = () => {
        console.log('Google Authentication')
    }

    return (
        <SafeAreaView style={styles.area}>
            <View style={styles.container}>
                <HeaderSinVuelta />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../../assets/images/logoIsorga.png')}
                            resizeMode="contain"
                            style={styles.logo}
                        />
                    </View>
                    <Text
                        style={[
                            styles.title,
                            {
                                color: COLORS.black,
                            },
                        ]}
                    >
                        Login Isorga
                    </Text>
                    <Input
                        id="email"
                        onInputChanged={inputChangedHandler}
                        errorText={formState.inputValidities['email']}
                        placeholder="Correo"
                        placeholderTextColor={COLORS.black}
                        icon={icons.email}
                        keyboardType="email-address"
                    />
                    <Input
                        onInputChanged={inputChangedHandler}
                        errorText={formState.inputValidities['password']}
                        autoCapitalize="none"
                        id="password"
                        placeholder="Contraseña"
                        placeholderTextColor={COLORS.black}
                        icon={icons.padlock}
                        secureTextEntry={true}
                    />
                    {/* <View style={styles.checkBoxContainer}>
            <View style={{ flexDirection: 'row' }}>
              <Checkbox
                style={styles.checkbox}
                value={isChecked}
                color={isChecked ? COLORS.primary : "gray"}
                onValueChange={setChecked}
              />
              <View style={{ flex: 1 }}>
                <Text style={[styles.privacy, {
                  color: COLORS.black
                }]}>Remenber me</Text>
              </View>
            </View>
          </View> */}
                    <Button
                        title="Acceso"
                        filled
                        onPress={loginHandler}
                        style={styles.button}
                    />
                    {/* <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPasswordMethods")}>
            <Text style={styles.forgotPasswordBtnText}>Forgot the password?</Text>
          </TouchableOpacity> */}
                    <View>
                        {/* <OrSeparator text="or continue with" />
            <View style={styles.socialBtnContainer}>
              <SocialButton
                icon={icons.appleLogo}
                onPress={appleAuthHandler}
                tintColor={COLORS.black}
              />
              <SocialButton
                icon={icons.facebook}
                onPress={facebookAuthHandler}
              />
              <SocialButton
                icon={icons.google}
                onPress={googleAuthHandler}
              />
            </View> */}
                    </View>
                </ScrollView>
                {/* <View style={styles.bottomContainer}>
                    <Text
                        style={[
                            styles.bottomLeft,
                            {
                                color: COLORS.black,
                            },
                        ]}
                    >
                        No tienes cuenta ?
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Loguearse')}
                    >
                        <Text style={styles.bottomRight}>{'  '}Registrate</Text>
                    </TouchableOpacity>
                </View> */}
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
        // tintColor: COLORS.primary
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
    title: {
        fontSize: 26,
        fontFamily: 'semiBold',
        color: COLORS.black,
        textAlign: 'center',
        marginBottom: 22,
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
    forgotPasswordBtnText: {
        fontSize: 16,
        fontFamily: 'semiBold',
        color: COLORS.primary,
        textAlign: 'center',
        marginTop: 12,
    },
})

export default Login
