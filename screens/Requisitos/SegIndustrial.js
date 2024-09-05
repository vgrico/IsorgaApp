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
import { COLORS, SIZES, icons } from "../../constants";
import { useFocusEffect } from "@react-navigation/native";

const SegIndustrial = ({ navigation }) => {
  const [userId, setUserId] = useState(null);
  const [centroId, setCentroId] = useState(null);

  const [datos, setDatos] = useState([]);

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
      const response = await fetch(
        "https://isorga.com/api/seguridadIndustrial.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            centroId: centroId,
          }),
        }
      );
      const data = await response.json();
      console.log("Data received:", data);
      setDatos(data);
    } catch (error) {
      console.error("Error fetching modulos:", error);
    }
  };

  const renderModulo = ({ item }) => {
    console.log("Render item:", item);
    return (
      <TouchableOpacity
        style={styles.moduloContainer}
        onPress={() =>
          navigation.navigate("ListaRequisitos", {
            grupoId: item.grupoId,
            grupoTitulo: item.grupoTitulo,
            grupoIcono: item.grupoIcono,
          })
        }
      >
        <Image
          source={{
            uri: `https://isorga.com/app/images/gcat/${item.grupoIcono}.png`,
          }}
          style={styles.logo_grupo}
        />
        <View style={styles.overlay}>
          <Text style={styles.moduloTexto}>{item.grupoTitulo}</Text>
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
        <Text style={styles.headerTitle}>SEGURIDAD INDUSTRIAL</Text>
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
  return (
    <SafeAreaView style={styles.area}>
      {renderHeader()}
      <View style={styles.horizontalLine} />
      <FlatList
        data={datos}
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: SIZES.h4,
    fontWeight: "bold",
    marginLeft: 16,
  },
  centroModulos: {
    fontSize: 15,
    fontWeight: "bold",
  },
  backIcon: {
    height: 24,
    width: 24,
  },
  flatListContent: {
    paddingHorizontal: 16,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 5,
  },
  moduloContainer: {
    flex: 1,
    margin: 3,
    borderRadius: 15,
    overflow: "hidden", // Asegura que la imagen no sobresalga del contenedor
    minWidth: "45%", // Ajustar el tamaño mínimo
    minHeight: 120, // Establecer una altura mínima mayo
    justifyContent: "center",
    alignItems: "center",
  },
  logo_grupo: {
    width: 80, // Tamaño fijo para el icono
    height: 80, // Tamaño fijo para el icono
    resizeMode: "contain", // Asegura que la imagen no se distorsione
    marginBottom: 10, // Espacio entre la imagen y el texto
    opacity: 0.5,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)", // Reducir la opacidad para que el icono sea más visible
  },
  moduloTexto: {
    fontSize: 14, // Aumentar el tamaño de la fuente
    color: COLORS.black, // Color blanco para contrastar con la imagen
    fontWeight: "semibold",
    textAlign: "center",
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
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
});

export default SegIndustrial;
