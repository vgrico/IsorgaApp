import React, { useCallback, useEffect, useReducer, useState } from 'react'
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
import SocialButton from '../../components/SocialButton'
import OrSeparator from '../../components/OrSeparator'

const isTestMode = true

const initialState = {
    inputValues: {
        email: isTestMode ? 'example@gmail.com' : '',
        password: isTestMode ? '**********' : '',
        nickname: '',
    },
    inputValidities: {
        email: false,
        password: false,
        nickname: false,
    },
    formIsValid: false,
}

const Loguearse = ({ navigation }) => {
    const [formState, dispatchFormState] = useReducer(reducer, initialState)
    const [isLoading, setIsLoading] = useState(false)
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
            Alert.alert('An error occurred', error)
        }
    }, [error])

    const signupHandler = async () => {
        // Recolectar los datos del formulario
        const { email, password, nickname } = formState.inputValues

        try {
            const response = await fetch(
                'https://momdel.es/animeWorld/api/loguearse.php',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                        nickname: nickname,
                    }),
                }
            )

            const data = await response.json()

            if (response.ok) {
                // Si la respuesta es exitosa, verifica el resultado
                if (data.result === 'ya existe una cuenta con este correo') {
                    Alert.alert(
                        'Error',
                        'Ya existe una cuenta con este correo electrónico'
                    )
                } else if (
                    data.result === 'ya existe una cuenta con este NickName'
                ) {
                    Alert.alert(
                        'Error',
                        'Ya existe una cuenta con este apodo (nickname)'
                    )
                } else {
                    // Si no hay errores, muestra el mensaje de éxito y navega a la siguiente pantalla
                    setIsLoading(true)
                    // Simulación de la llamada a la API
                    await new Promise((resolve) => setTimeout(resolve, 1000))
                    setIsLoading(false)
                    // Alert.alert('Success', 'Account created successfully');
                    navigation.navigate('Login')
                }
            } else {
                // Si la respuesta no es exitosa, muestra un mensaje de error genérico
                setError('Failed to create account')
            }
        } catch (error) {
            // Si hay un error en la llamada a la API, muestra un mensaje de error
            setError('Failed to create account')
        }
    }

    const appleAuthHandler = () => {
        console.log('Apple Authentication')
    }

    const facebookAuthHandler = () => {
        console.log('Facebook Authentication')
    }

    const googleAuthHandler = () => {
        console.log('Google Authentication')
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
                        Crear Cuenta
                    </Text>
                    <Input
                        onInputChanged={inputChangedHandler}
                        errorText={formState.inputValidities['nickname']}
                        autoCapitalize="none"
                        id="nickname"
                        placeholder="Nickname"
                        placeholderTextColor={COLORS.black}
                        icon={icons.user}
                    />
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
                    </View> */}
                    <Button
                        title="Registrarte"
                        filled
                        onPress={signupHandler}
                        style={styles.button}
                    />
                    {/* <View>
                        <OrSeparator text="or continue with" />
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
                        </View>
                    </View> */}
                </ScrollView>
                <View style={styles.bottomContainer}>
                    <Text style={[styles.bottomLeft, { color: COLORS.black }]}>
                        Ya tienes una cuenta ?
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.bottomRight}> Loguearse</Text>
                    </TouchableOpacity>
                </View>
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
        // tintColor: COLORS.primary,
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
})

export default Loguearse
