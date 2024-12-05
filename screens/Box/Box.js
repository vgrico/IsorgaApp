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
    "#FF6F61", // Coral
    "#92A8D1", // Blue
    "#88B04B", // Green
    "#F7CAC9", // Rose
    "#955251", // Mauve
    "#B565A7", // Violet
    "#6B5B95", // Plum
    "#009B77", // Teal
    "#DD4124", // Red
    "#D65076", // Pink
  ];

  const renderModulo = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.folderContainer}
        onPress={() => navigation.navigate("ListadoBox", { id: item.id })}
      >
        <View style={styles.folderTop}>
          <View style={styles.folderTab} />
        </View>
        <View style={styles.folderBottom}>
          <Text style={styles.folderLabel}>{item.titulo}</Text>
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
        contentContainerStyle={[styles.flatListContent, { paddingBottom: 75 }]} // Añadir paddingBottom para el último elemento
        columnWrapperStyle={styles.columnWrapper}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: "#F9F9F9", // Fondo claro para mayor contraste
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: "#3E3E3E",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: SIZES.h3,
    fontWeight: "bold",
    marginLeft: 16,
    color: "#FFFFFF",
  },
  folderContainer: {
    width: "45%",
    height: 150,
    margin: 10,
    borderRadius: 10,
    backgroundColor: "#FFFFFF", // Fondo blanco para resaltar las carpetas
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    elevation: 4,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.primary, // Cambiado a COLORS.primary
  },
  folderTop: {
    flex: 2,
    backgroundColor: "#D9D9D9", // Color más claro para la pestaña superior
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  folderTab: {
    width: 30,
    height: 6,
    backgroundColor: "#B0B0B0", // Más contraste para la pestaña
    borderRadius: 3,
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  folderBottom: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  folderLabel: {
    fontSize: SIZES.h4, // Texto grande para destacar
    fontWeight: "700",
    color: "#3E3E3E",
    textAlign: "center",
    textTransform: "capitalize",
    marginTop: 10,
  },
  horizontalLine: {
    borderBottomColor: "#D0D0D0",
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  flatListContent: {
    paddingBottom: 75,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
});



export default Box;
