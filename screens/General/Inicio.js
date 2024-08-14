import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONTS, SIZES } from "../../constants"; // Asegúrate de tener estos valores definidos

const Inicio = ({ route, navigation }) => {
  const [userId, setUserId] = useState(null);
  const [centroId, setCentroId] = useState(null);
  const [modulosUsuario, setModulosUsuario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [centroNombre, setCentroNombre] = useState("");
  const [today, setToday] = useState("");

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

    const saveCentroId = async (id) => {
      try {
        await AsyncStorage.setItem("centroId", id.toString());
        setCentroId(id);
      } catch (error) {
        console.error("Error saving centroId to AsyncStorage:", error);
      }
    };

    loadUserData();

    if (route.params && route.params.id) {
      saveCentroId(route.params.id);
    }
  }, [route.params]);

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setToday(formattedDate);
  }, []);

  useEffect(() => {
    if (userId && centroId) {
      console.log("User ID:", userId);
      console.log("Centro ID:", centroId);
      fetchModulosUsuario();
    }
  }, [userId, centroId]);

  const fetchModulosUsuario = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://isorga.com/api/modulosUsuario.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isorgaId: userId,
            centroId: centroId,
          }),
        }
      );
      const data = await response.json();
      console.log(data);
      setModulosUsuario(data);
      if (data.length > 0) {
        setCentroNombre(data[0].centroNombre);
      }
    } catch (error) {
      console.error("Error fetching modulos:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
        <Image
        source={require("../../assets/images/logoIsorga.png")}
        style={styles.logo}
      />
      <Text style={styles.headerTitle}>{centroNombre}</Text>
    </View>
  );

  const renderModulo = ({ item, index }) => {
    let imageSource;
    let moduloTexto;
  
    switch (item.pantalla) {
      case "RequisitosLegales":
        imageSource = require("../../assets/images/modulos.webp");
        moduloTexto = "Requisitos Legales";
        break;
      case "GestionResiduos":
        imageSource = require("../../assets/images/modulos.webp");
        moduloTexto = "Residuos";
        break;
      case "NoConformidades":
        imageSource = require("../../assets/images/modulos.webp");
        moduloTexto = "No Conformidades";
        break;
      case "Auditorias":
        imageSource = require("../../assets/images/modulos.webp");
        moduloTexto = "Auditorías";
        break;
      case "GestionIncidencias":
        imageSource = require("../../assets/images/modulos.webp");
        moduloTexto = "Incidencias";
        break;
      case "ControlDocumental":
        imageSource = require("../../assets/images/modulos.webp");
        moduloTexto = "Control Documental";
        break;
      case "Quimicos":
        imageSource = require("../../assets/images/modulos.webp");
        moduloTexto = "Productos Químicos";
        break;
      case "GestionInformes":
        imageSource = require("../../assets/images/modulos.webp");
        moduloTexto = "Informes";
        break;
      case "GeneralEquipos":
        imageSource = require("../../assets/images/modulos.webp");
        moduloTexto = "Equipos";
        break;
      case "RecursosHumanos":
        imageSource = require("../../assets/images/modulos.webp");
        moduloTexto = "Personal";
        break;
      // Agrega más casos según sea necesario
      default:
        imageSource = require("../../assets/images/logo.png"); // Imagen por defecto
        moduloTexto = "Módulo Desconocido";
    }
  

    return (
      <TouchableOpacity
        style={styles.moduloContainer}
        onPress={() => navigation.navigate(item.pantalla)}
      >
        <Image
  source={require('../../assets/images/modulos.webp')}
  style={[styles.moduloImagen, { opacity: 0.4 }]} // 0.1 es muy transparente, ajusta según lo necesites
/>
        {/* <Image source={imageSource} style={styles.moduloImagen} /> */}
        <View style={styles.overlay}>
          <Text style={styles.moduloTexto}>{moduloTexto}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.text} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.area}>
      {/* {renderLogo()} */}
      {renderHeader()}
      <View style={styles.horizontalLine} />
      <FlatList
        data={modulosUsuario}
        renderItem={renderModulo}
        keyExtractor={(item) => item.moduloId.toString()}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: SIZES.h2,
    fontWeight: "bold",
    marginLeft: 16,
  },
  backIcon: {
    height: 24,
    width: 24,
  }, 
  moduloContainer: {
    flex: 1,
    margin: 3,
    borderRadius: 15,
    overflow: "hidden",
    minWidth: "45%",
    minHeight: 120,
    position: "relative",
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
    fontSize: SIZES.h3,
    color: COLORS.greyscale900,
    fontWeight: 'bold',
    textAlign: "center",
    textTransform: "uppercase",
  },
  
  header: {
    padding: 16,
  },
  centroNombre: {
    fontSize: 20,
    paddingHorizontal: 50,
    fontWeight: "bold",
  },
  centroModulos: {
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
  horizontalLine: {
    borderBottomColor: COLORS.black,
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },
  moduloLogo: {
    width: 50,
    height: 50,
    marginBottom: 15,
    resizeMode: "contain",
  },
});

export default Inicio;
