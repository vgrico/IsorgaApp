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

  const renderModulo = ({ item }) => {
    const imageSource = require("../../assets/images/carpeta.webp");
    console.log("Render item:", item);
    return (
      <TouchableOpacity
        style={styles.moduloContainer}
        onPress={() => navigation.navigate("ListadoBox", { id: item.id })}
      >
        <Image source={imageSource} style={styles.moduloImagen} />
        <View style={styles.overlay}>
          <Text style={styles.moduloTexto}>{item.titulo}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderLogo = () => {
    return (
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/logoIsorga.png")}
          style={styles.logo}
        />
      </View>
    );
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
    fontSize: SIZES.h2,
    fontWeight: "bold",
    marginLeft: 16,
  },
  moduloContainer: {
    flex: 1,
    margin: 3,
    borderRadius: 15,
    overflow: "hidden", // Asegura que la imagen no sobresalga del contenedor
    minWidth: "45%",
    minHeight: 120,
    position: "relative",
  },
  moduloImagen: {
    width: "100%", // La imagen ocupa todo el ancho de la tarjeta
    height: "100%", // La imagen ocupa todo el alto de la tarjeta
    position: "absolute",
    top: 0,
    left: 0,
    opacity: 0.5, // Imagen difuminada
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.1)", 
  },
  moduloTexto: {
    fontSize: 16, // Aumentar el tamaño de la fuente
    color: COLORS.greyscale900, // Color blanco para contrastar con la imagen
    fontWeight: "400",
    textAlign: "center",
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