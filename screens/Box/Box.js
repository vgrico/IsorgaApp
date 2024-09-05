import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES } from "../../constants";
import { useFocusEffect } from "@react-navigation/native";

const Box = ({ navigation }) => {
  const [userId, setUserId] = useState(null);
  const [centroId, setCentroId] = useState(null);
  const [carpetasBox, setCarpetasBox] = useState([]);
  const [centroNombre, setCentroNombre] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      const loadUserId = async () => {
        try {
          const userIdFromStorage = await AsyncStorage.getItem("isorgaId");
          setUserId(userIdFromStorage);

          const centroIdFromStorage = await AsyncStorage.getItem("centroId");
          setCentroId(centroIdFromStorage);
        } catch (error) {
          console.error("Error loading userId from AsyncStorage:", error);
        }
      };
      loadUserId();
      return () => {
        setUserId(null);
        setCentroId(null);
      };
    }, [])
  );

  useEffect(() => {
    if (userId && centroId) {
      console.log("User ID:", userId);
      console.log("Centro ID:", centroId);
      fetchCarpetaBox();
    }
  }, [userId, centroId]);

  const fetchCarpetaBox = async () => {
    try {
      const response = await fetch("https://isorga.com/api/carpetasBox.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          centroId: centroId,
        }),
      });
      const data = await response.json();
      console.log("Data received:", data); // Añadir este log para depuración
      setCarpetasBox(data);
      if (data.length > 0) {
        setCentroNombre(data[0].centroNombre);
      }
    } catch (error) {
      console.error("Error fetching modulos:", error);
    }
  };

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <Image
          source={require("../../assets/images/logoIsorga.png")}
          style={styles.logo}
        />

        <Text style={styles.headerTitle}>BOX DOCUMENTAL</Text>
      </View>
    );
  };

  const colorPalette = [
    '#FF6F61', // Coral
    '#92A8D1', // Blue
    '#88B04B', // Green
    '#F7CAC9', // Rose
    '#955251', // Mauve
    '#B565A7', // Violet
    '#6B5B95', // Plum
    '#009B77', // Teal
    '#DD4124', // Red
    '#D65076', // Pink
  ];

  const renderModulo = ({ item, index }) => {
    const imageSource = require("../../assets/images/carpeta.webp");
    console.log("Render item:", item);
    const backgroundColor = colorPalette[index % colorPalette.length]; // Cicla los colores si hay más cajas que colores

    return (
      <TouchableOpacity
      style={[styles.moduloContainer, { backgroundColor }]}
        onPress={() => navigation.navigate("ListadoBox", { id: item.id })}
      >
      
        <View style={styles.overlay}>
          <Text style={styles.moduloTexto}>{item.titulo}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.area}>
      {renderHeader()}
      <View style={styles.horizontalLine} />
      <FlatList
        data={carpetasBox}
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
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: SIZES.h3,
    fontWeight: "bold",
    marginLeft: 16,
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
    fontWeight: "semibold",
    textAlign: "center",
    textTransform: "uppercase",
  },
  horizontalLine: {
    borderBottomColor: COLORS.black,
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },
});

export default Box;