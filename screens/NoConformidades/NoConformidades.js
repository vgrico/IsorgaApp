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

const NoConformidades = ({ navigation }) => {
  const [userId, setUserId] = useState(null);
  const [centroId, setCentroId] = useState(null);
  const [hayRevision, setHayRevision] = useState(null);
  const [loading, setLoading] = useState(true);

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
      console.log("User ID:", userId);
      console.log("Centro ID:", centroId);
      fetchRevisiones();
    }
  }, [userId, centroId]);

  const tiposDocumentos = [
    {
      moduloTexto: "NC TOTALES",
      color: COLORS.grayscale100,
      url: "ListadoTotalNC",
      tipoDocumento: "1",
    },
    {
      moduloTexto: "PENDIENTES CIERRE DEFINITIVO",
      color: COLORS.grayscale100,
      url: "ListadoPendientes",
      tipoDocumento: "3",
    },
    {
      moduloTexto: "ABIERTAS",
      color: COLORS.grayscale100,
      url: "ListadoAbiertas",
      tipoDocumento: "2",
    },
    {
      moduloTexto: "CERRADAS",
      color: COLORS.grayscale100,
      url: "ListadoCerradas",
      tipoDocumento: "2",
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
        <Text style={styles.headerTitle}>NO CONFORMIDADES</Text>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={() => navigation.navigate("Inicio")}>
          <Image
            source={require("../../assets/images/logoIsorga.png")}
            style={styles.logo}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderModulo = ({ item }) => {
    const isPendientes = item.tipoDocumento === "0" && hayRevision > 0;
    return item.tipoDocumento !== "0" || isPendientes ? (
      <TouchableOpacity
        style={[
          styles.moduloContainer,
          { backgroundColor: item.color },
          isPendientes && styles.redBorder,
        ]}
        onPress={() => navigation.navigate(item.url)}
      >
        <Image
          source={require("../../assets/images/iso.webp")}
          style={[styles.moduloImagen, { opacity: 0.2 }]}
        />
        <View style={styles.overlay}>
          <Text style={styles.moduloTexto}>{item.moduloTexto}</Text>
        </View>
      </TouchableOpacity>
    ) : null;
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
    fontSize: SIZES.h4,
    color: COLORS.greyscale900,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
  },
  redBorder: {
    borderColor: "red",
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

export default NoConformidades;
