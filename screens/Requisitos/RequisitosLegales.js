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

const RequisitosLegales = ({ navigation }) => {
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
    // {
    //   moduloTexto: "BUSCADOR NORMATIVAS",
    //   color: COLORS.grayscale100,
    //   url: "BuscadorNormativas",
    //   tipoDocumento: "1",
    // },
    // {
    //   moduloTexto: "BUSCADOR REQUISITOS",
    //   color: COLORS.grayscale100,
    //   url: "BuscadorRequisitos",
    //   tipoDocumento: "2",
    // },
    {
      moduloTexto: "MEDIO AMBIENTE",
      color: COLORS.grayscale100,
      url: "MedioAmbiente",
      tipoDocumento: "3",
    },
    {
      moduloTexto: "SEGURIDAD INDUSTRIAL",
      color: COLORS.grayscale100,
      url: "SegIndustrial",
      tipoDocumento: "4",
    },
    {
      moduloTexto: "SEGURIDAD LABORAL",
      color: COLORS.grayscale100,
      url: "SegLaboral",
      tipoDocumento: "5",
    },
    {
      moduloTexto: "PENDIENTES DE LEER",
      color: COLORS.transparentSecondary,
      url: "PendientesLeer",
      tipoDocumento: "0",
    },
  ];

  const colorPalette = [
    '#88B04B', // Green
    '#92A8D1', // Blue
    '#F7CAC9', // Rose
    '#FF6F61', // Coral
    '#6B5B95', // Plum
    '#955251', // Mauve
    '#B565A7', // Violet
    '#009B77', // Teal
    '#DD4124', // Red
    '#D65076', // Pink
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
    const imageSource = require("../../assets/images/carpeta.webp");
    console.log("Render item:", item);
    const backgroundColor = colorPalette[index % colorPalette.length]; // Cicla los colores si hay más cajas que colores

    const isPendientes = item.tipoDocumento === "0" && hayRevision > 0;
    return item.tipoDocumento !== "0" ||
      isPendientes ? (
      <TouchableOpacity
        style={[styles.moduloContainer, { backgroundColor },  isPendientes && styles.redBorder ]}
        onPress={() => navigation.navigate(item.url)}
      >
        <View style={styles.overlay}>
          <Text style={styles.moduloTexto}>{item.moduloTexto}</Text>
        </View>
      </TouchableOpacity>
    ) : null;
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
        <Text style={styles.headerTitle}>REQUISITOS LEGALES</Text>
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
    width: "45%", 
    height: 150, 
    margin: 10,
    borderRadius: 15,
    overflow: "hidden", 
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.grayscale100, 
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
    fontWeight: 'SEMIbold',
    textAlign: "center",
    textTransform: "uppercase",
  },
  redBorder: {
    borderColor: 'red',
    borderWidth: 4,
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

export default RequisitosLegales;
