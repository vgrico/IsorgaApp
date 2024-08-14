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

const GestionResiduos = ({ navigation }) => {
  const [userId, setUserId] = useState(null);
  const [centroId, setCentroId] = useState(null);
  const [hayRevision, setHayRevision] = useState(null);

  const [modulosUsuario, setModulosUsuario] = useState([]);
  const [filteredModulos, setFilteredModulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [centroNombre, setCentroNombre] = useState("");

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

  useEffect(() => {
    if (userId && centroId) {
      fetchRevisiones();
    }
  }, [userId, centroId]);

  const tiposDocumentos = [
    {
      moduloTexto: "MIS GESTIONES",
      color: COLORS.grayscale100,
      url: "MisGestiones",
      tipoDocumento: "1",
      imagen: require("../../assets/images/misGestiones.webp"),
    },
    {
      moduloTexto: "MIS RESIDUOS",
      color: COLORS.grayscale100,
      url: "MisResiduos",
      tipoDocumento: "2",
      imagen: require("../../assets/images/misResiduos.webp"),
    },
    {
      moduloTexto: "RETIRADA RESIDUOS",
      color: COLORS.grayscale100,
      url: "MisRetiradas",
      tipoDocumento: "3",
      imagen: require("../../assets/images/misRetiradas.webp"),
    },
  ];

  const fetchRevisiones = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://isorga.com/api/DocumentosPendientesAprobacionRevision.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            centroId: centroId,
            userId: userId,
          }),
        }
      );

      const data = await response.json();
      console.log(data.total);
      setHayRevision(data.total);
    } catch (error) {
      console.error("Error fetching modulos:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderModulo = ({ item, index }) => {
    const isThirdItem = index === 2; // Verifica si es el tercer elemento
  
    return (
      <TouchableOpacity
        style={[
          styles.moduloContainer,
          { backgroundColor: item.color },
          isThirdItem && styles.fullWidthModuloContainer, 
        ]}
        onPress={() => navigation.navigate(item.url)}
      >
        <Image source={item.imagen} style={styles.moduloImagen} />
        <Text style={styles.moduloTexto}>{item.moduloTexto}</Text>
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
        <Text style={styles.headerTitle}>GESTIÓN RESIDUOS</Text>
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
        data={tiposDocumentos}
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
      fontSize: SIZES.h3,
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
      width: "45%", // Ancho fijo de la tarjeta
      height: 200, // Alto fijo de la tarjeta
      margin: 10,
      borderRadius: 15,
      overflow: "hidden", 
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: COLORS.grayscale100,
    },
    fullWidthModuloContainer: {
      width: "100%",
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
      backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    moduloTexto: {
      fontSize: 20,
      color: COLORS.white,
      fontWeight: "bold",
      textAlign: "center",
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

export default GestionResiduos;
