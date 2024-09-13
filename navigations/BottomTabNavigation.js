import React, { useEffect } from "react";
import {
  View,
  Platform,
  Image,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS, icons } from "../constants";

import Perfil from "../screens/General/Perfil";
import Box from "../screens/Box/Box";
import Inicio from "../screens/General/Inicio";
import Todo from "../screens/General/Todo";
import Informes from "../screens/Informes/GestionInformes";
import Formulario from "../screens/General/Informes";
import FormularioResiduos from "../screens/General/FormularioResiduos";
import InformeAH from "../screens/General/X_InformeAH";
import Informe5s from "../screens/General/X_Informes5s";

const Tab = createBottomTabNavigator();

const { width } = Dimensions.get("window");
const isLargeScreen = width > 600;

const BottomTabNavigation = () => {
  const isFocused = useIsFocused();

  useEffect(() => {
    console.log("Pantalla recargada");
  }, [isFocused]);

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
              icon={focused ? icons.bookmark : icons.bookmark2Outline}
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
              icon={focused ? icons.document : icons.documentOutline}
              label="Box"
            />
          ),
        }}
      />
      {/* <Tab.Screen
        name="Formulario"
        component={Formulario}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={focused ? icons.document : icons.documentOutline}
              label="Formulario"
            />
          ),
        }}
      />

      <Tab.Screen
        name="InformeAH"
        component={InformeAH}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={focused ? icons.document : icons.documentOutline}
              label="InformeAH"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Informe5s"
        component={Informe5s}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={focused ? icons.document : icons.documentOutline}
              label="Informe5s"
            />
          ),
        }}
      /> */}

      {/* <Tab.Screen
        name="tareas"
        component={Todo}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={focused ? icons.paperOutline : icons.paper}
              label="Tareas"
            />
          ),
        }}
      /> */}

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
  );
};

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
          { tintColor: focused ? COLORS.tertiary : COLORS.gray3 },
        ]}
      />
    )}
    {!isLargeScreen && (
      <Text
        style={[
          styles.label,
          {
            color: focused ? COLORS.tertiary : COLORS.gray3,
          },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {label}
      </Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    justifyContent: "center",
    bottom: 0,
    right: 0,
    left: 0,
    elevation: 0,
    height: Platform.OS === "ios" ? 80 : 60,
    backgroundColor: "#f0f0f0", // Fondo gris
    borderTopWidth: 1, // Ancho de la línea
    borderTopColor: "#dcdcdc", // Color de la línea
    paddingTop: 10,
    // backgroundColor: COLORS.white,
    // borderTopColor: 'transparent',
  },
  iconContainer: {
    alignItems: "center",
  },
  iconContainerLarge: {
    alignItems: "center",
    flexDirection: "row",
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
});

export default BottomTabNavigation;
