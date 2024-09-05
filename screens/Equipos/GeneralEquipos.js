import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import { COLORS, icons, SIZES } from "../../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GeneralEquipos = ({ navigation }) => {

  const [userId, setUserId] = useState(null);
  const [centroId, setCentroId] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userIdFromStorage = await AsyncStorage.getItem("isorgaId");
        setUserId(userIdFromStorage);

        const centroIdFromStorage = await AsyncStorage.getItem("centroId");
        setCentroId(centroIdFromStorage);
      } catch (error) {
        console.error("Error loading data from AsyncStorage:", error);
      }
    };

    loadUserData();
  }, []);


  const moduloEquipos = [
      {
          moduloTexto: "MIS EQUIPOS",
          color: COLORS.grayscale100,
          url: "Equipos",
        },
        {
            moduloTexto: "PLANIFICACIONES",
            color: COLORS.grayscale100,
            url: "PlanificacionesEquipos",
        },
        {
          moduloTexto: "CALENDARIO",
          color: COLORS.grayscale100,
          url: "CalendarioEquipos",
        },
  ];

  const colorPalette = [
    '#88B04B', // Green
    '#92A8D1', // Blue
    '#F7CAC9', // Rose
    '#009B77', // Teal
    '#FF6F61', // Coral
    '#6B5B95', // Plum
    '#955251', // Mauve
    '#B565A7', // Violet
    '#DD4124', // Red
    '#D65076', // Pink
  ];

  const renderModulo = ({ item, index }) => {
    const isCalendario = item.moduloTexto === "CALENDARIO";
    const backgroundColor = colorPalette[index % colorPalette.length]; // Cicla los colores si hay más cajas que colores

    return (
      <TouchableOpacity
        style={[
          styles.moduloContainer,
          {backgroundColor},
          isCalendario && styles.calendarioContainer, 
        ]}
        onPress={() => navigation.navigate(item.url)}
      >
         <View style={styles.overlay}>
           <Text style={styles.moduloTexto}>{item.moduloTexto}</Text>
         </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={icons.arrowBack}
            resizeMode="contain"
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>EQUIPOS E INSTALACIONES</Text>
        <View style={{ flex: 1 }} />
        <Image
          source={require("../../assets/images/logoIsorga.png")}
          style={styles.logo}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.area}>
      {renderHeader()}
      <View style={styles.horizontalLine} />
      <FlatList
        data={moduloEquipos}
        renderItem={renderModulo}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={styles.flatListContent}
        columnWrapperStyle={styles.columnWrapper}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: SIZES.h4,
    fontWeight: "bold",
    marginLeft: 16,
  },
  backIcon: {
    height: 18,
    width: 18,
  },
  centroNombre: {
    fontSize: 15,
    fontWeight: "bold",
  },
  flatListContent: {
    paddingHorizontal: 16,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 5,
  },
  moduloContainer: {
    width: "45%",
    height: 150,
    margin: 10,
    borderRadius: 15,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.grayscale100,
  },
  calendarioContainer: {
    width: "96%", 
    marginLeft: "2%",
  },
  moduloImagen: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  moduloTexto: {
    fontSize: SIZES.h5,
    color: COLORS.greyscale900,
    fontWeight: 'semibold',
    textAlign: "center",
    textTransform: "uppercase",
  },
  horizontalLine: {
    borderBottomColor: COLORS.black,
    borderBottomWidth: 1,
    marginVertical: 20,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
});

export default GeneralEquipos;
