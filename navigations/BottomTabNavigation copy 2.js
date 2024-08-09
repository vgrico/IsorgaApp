import { View, Platform, Image, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { COLORS, FONTS, icons } from '../constants'
import { Explore, Favourite, Inbox } from '../screens'
import PersonajesFavoritos from '../screens/mios/PersonajesFav'
import Series from '../screens/mios/Series'
import Perfil from '../screens/mios/Perfil'
import Inicio from '../screens/mios/Inicio'
import QuePrefieres from '../screens/mios/QuePrefieresPersonajes'
import Juegos from '../screens/mios/Juegos'
import Inicio2 from '../screens/mios/Inicio2'
import PerfilUsuario from '../screens/mios/PerfilUsuario'
import Cartas from '../screens/mios/Cartas'
import CrearPublicacion from '../screens/mios/SubirPublicaciones'
import Publicaciones from '../screens/mios/Publicaciones'

const Tab = createBottomTabNavigator()

const BottomTabNavigation = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarShowLabel: false,
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    justifyContent: 'center',
                    bottom: 0,
                    right: 0,
                    left: 0,
                    elevation: 0,
                    height: Platform.OS === 'ios' ? 90 : 60,
                    backgroundColor: COLORS.white,
                    borderTopColor: 'transparent',
                },
            }}
        >
            <Tab.Screen
                name="Inicio"
                component={Inicio}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: 'center' }}>
                                <Image
                                    source={
                                        focused
                                            ? icons.home
                                            : icons.home2Outline
                                    }
                                    resizeMode="contain"
                                    style={{
                                        height: 24,
                                        width: 24,
                                        tintColor: focused
                                            ? COLORS.primary
                                            : COLORS.gray3,
                                    }}
                                />
                                <Text
                                    style={{
                                        ...FONTS.body4,
                                        color: focused
                                            ? COLORS.primary
                                            : COLORS.gray3,
                                    }}
                                >
                                    Inicio
                                </Text>
                            </View>
                        )
                    },
                }}
            />

            <Tab.Screen
                name="Juegos"
                component={Juegos}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: 'center' }}>
                                <Image
                                    source={
                                        focused
                                            ? icons.dashboard2
                                            : icons.dashboard2Outline
                                    }
                                    resizeMode="contain"
                                    style={{
                                        height: 24,
                                        width: 24,
                                        tintColor: focused
                                            ? COLORS.primary
                                            : COLORS.gray3,
                                    }}
                                />
                                <Text
                                    style={{
                                        ...FONTS.body4,
                                        color: focused
                                            ? COLORS.primary
                                            : COLORS.gray3,
                                    }}
                                >
                                    Juegos
                                </Text>
                            </View>
                        )
                    },
                }}
            />

            <Tab.Screen
                name="Cartas"
                component={Cartas}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: 'center' }}>
                                <Image
                                    source={
                                        focused
                                            ? icons.maximize
                                            : icons.maximizeOutline
                                    }
                                    resizeMode="contain"
                                    style={{
                                        height: 24,
                                        width: 24,
                                        tintColor: focused
                                            ? COLORS.primary
                                            : COLORS.gray3,
                                    }}
                                />
                                <Text
                                    style={{
                                        ...FONTS.body4,
                                        color: focused
                                            ? COLORS.primary
                                            : COLORS.gray3,
                                    }}
                                >
                                    Cartas
                                </Text>
                            </View>
                        )
                    },
                }}
            />

            <Tab.Screen
                name="Series"
                component={Series}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: 'center' }}>
                                <Image
                                    source={
                                        focused
                                            ? icons.videoCamera
                                            : icons.videoCameraOutline
                                    }
                                    resizeMode="contain"
                                    style={{
                                        height: 24,
                                        width: 24,
                                        tintColor: focused
                                            ? COLORS.primary
                                            : COLORS.gray3,
                                    }}
                                />
                                <Text
                                    style={{
                                        ...FONTS.body4,
                                        color: focused
                                            ? COLORS.primary
                                            : COLORS.gray3,
                                    }}
                                >
                                    Series
                                </Text>
                            </View>
                        )
                    },
                }}
            />

            <Tab.Screen
                name="Publicaciones"
                component={Publicaciones}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: 'center' }}>
                                <Image
                                    source={
                                        focused
                                            ? icons.paperOutline
                                            : icons.paper
                                    }
                                    resizeMode="contain"
                                    style={{
                                        height: 24,
                                        width: 24,
                                        tintColor: focused
                                            ? COLORS.primary
                                            : COLORS.gray3,
                                    }}
                                />
                                <Text
                                    style={{
                                        ...FONTS.body4,
                                        color: focused
                                            ? COLORS.primary
                                            : COLORS.gray3,
                                    }}
                                >
                                    Publicaciones
                                </Text>
                            </View>
                        )
                    },
                }}
            />

            <Tab.Screen
                name="PerfilUsuario"
                component={PerfilUsuario}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: 'center' }}>
                                <Image
                                    source={
                                        focused ? icons.user : icons.userOutline
                                    }
                                    resizeMode="contain"
                                    style={{
                                        height: 24,
                                        width: 24,
                                        tintColor: focused
                                            ? COLORS.primary
                                            : COLORS.gray3,
                                    }}
                                />
                                <Text
                                    style={{
                                        ...FONTS.body4,
                                        color: focused
                                            ? COLORS.primary
                                            : COLORS.gray3,
                                    }}
                                >
                                    Perfil
                                </Text>
                            </View>
                        )
                    },
                }}
            />
        </Tab.Navigator>
    )
}

export default BottomTabNavigation
