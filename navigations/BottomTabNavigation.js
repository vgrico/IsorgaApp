import React, { useEffect } from 'react'
import {
    View,
    Platform,
    Image,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useIsFocused } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, FONTS, icons } from '../constants'

import Perfil from '../screens/General/Perfil'
import Auditorias from '../screens/Auditorias/Auditorias'
import Box from '../screens/Box/Box'
import Inicio from '../screens/General/InicioIsorga'
import Informes from '../screens/Informes/Informes'

const Tab = createBottomTabNavigator()

const { width } = Dimensions.get('window')
const isLargeScreen = width > 600

const BottomTabNavigation = () => {
    const isFocused = useIsFocused()

    useEffect(() => {
        // Logic to reload the screen
        console.log('Screen reloaded')
    }, [isFocused])

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarShowLabel: false,
                headerShown: false,
                tabBarStyle: styles.tabBar,
            }}
        >
            <Tab.Screen
                name="Inicio"
                component={Inicio}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon={focused ? icons.home : icons.home2Outline}
                            label="Módulos"
                        />
                    ),
                }}
            />

            <Tab.Screen
                name="box"
                component={Box}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon={focused ? icons.paperOutline : icons.paper}
                            label="Box"
                        />
                    ),
                }}
            />

            {/* <Tab.Screen
                name="Auditorias"
                component={Auditorias}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon={focused ? icons.paperOutline : icons.paper}
                            label="Auditorias"
                        />
                    ),
                }}
            /> */}

            {/* <Tab.Screen
                name="Cartas"
                component={Cartas}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            iconComponent={
                                <Ionicons
                                    name={focused ? "albums" : "albums-outline"}
                                    size={24}
                                    color={focused ? COLORS.primary : COLORS.gray3}
                                />
                            }
                            label="Cartas"
                        />
                    ),
                }}
            />

            <Tab.Screen
                name="MisSeries"
                component={MisSeries}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon={focused ? icons.videoCamera : icons.videoCameraOutline}
                            label="Series"
                        />
                    ),
                }}
            />*/}

            {/* <Tab.Screen
                name="Publicaciones"
                component={Informes}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon={focused ? icons.paperOutline : icons.paper}
                            label="Checklist"
                        />
                    ),
                }}
            />  */}

            <Tab.Screen
                name="MiPerfil"
                component={Perfil}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon={focused ? icons.user : icons.userOutline}
                            label="Perfil"
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    )
}

const TabIcon = ({ focused, icon, label, iconComponent }) => (
    <View
        style={isLargeScreen ? styles.iconContainerLarge : styles.iconContainer}
    >
        {iconComponent || (
            <Image
                source={icon}
                resizeMode="contain"
                style={[
                    isLargeScreen ? styles.iconLarge : styles.icon,
                    { tintColor: focused ? COLORS.primary : COLORS.gray3 },
                ]}
            />
        )}
        {!isLargeScreen && (
            <Text
                style={[
                    styles.label,
                    {
                        color: focused ? COLORS.primary : COLORS.gray3,
                    },
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
            >
                {label}
            </Text>
        )}
    </View>
)

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        justifyContent: 'center',
        bottom: 0,
        right: 0,
        left: 0,
        elevation: 0,
        height: Platform.OS === 'ios' ? 90 : 60,
        backgroundColor: '#f0f0f0',  // Fondo gris
        borderTopWidth: 1,           // Ancho de la línea
        borderTopColor: '#dcdcdc',   // Color de la línea
        paddingTop:10,
        // backgroundColor: COLORS.white,
        // borderTopColor: 'transparent',
    },
    iconContainer: {
        alignItems: 'center',
    },
    iconContainerLarge: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    icon: {
        height: 18,
        width: 18,
    },
    iconLarge: {
        height: 32,
        width: 32,
        marginRight: 8,
    },
    label: {
        ...FONTS.body4,
        fontSize: 12,
        marginTop: 2,
    },
})

export default BottomTabNavigation
