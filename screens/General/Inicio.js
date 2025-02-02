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
import { COLORS, FONTS, SIZES } from "../../constants";

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

  const colorPalette = [
    "#88B04B", // Green
    "#F7CAC9", // Rose
    "#92A8D1", // Blue
    "#009B77", // Teal
    "#FF6F61", // Coral
    "#6B5B95", // Plum
    "#955251", // Mauve
    "#B565A7", // Violet
    "#D65076", // Pink
    "#DD4124", // Red
  ];

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

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.text} />
      </SafeAreaView>
    );
  }

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
    const backgroundColor = colorPalette[index % colorPalette.length]; // Cicla los colores si hay más cajas que colores

    return (
      <TouchableOpacity
        style={[styles.moduloContainer, { backgroundColor }]}
        onPress={() => navigation.navigate(item.pantalla)}
      >
        <View style={styles.overlay}>
          <Text style={styles.moduloTexto}>{item.moduloTexto}</Text>
        </View>
      </TouchableOpacity>
    );
  };

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
        contentContainerStyle={[styles.flatListContent, { paddingBottom: 75 }]} // Añadir paddingBottom para el último elemento
        columnWrapperStyle={styles.columnWrapper}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: "#3E3E3E",
    paddingVertical: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    marginRight: 10,
  },
  moduloContainer: {
    width: "45%",
    margin: 10,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  moduloTexto: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    textAlign: "center",
  },
  flatListContent: {
    paddingHorizontal: 16,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
  horizontalLine: {
    borderBottomColor: "#E0E0E0",
    borderBottomWidth: 1,
    marginVertical: 10,
  },
});

export default Inicio;
