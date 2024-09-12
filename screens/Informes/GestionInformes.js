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

const GestionInformes = ({ navigation }) => {
  const [userId, setUserId] = useState(null);
  const [centroId, setCentroId] = useState(null);
  const [reportsCentro, setReportsCentro] = useState([]);
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
      fetchReportsCentro();
    }
  }, [userId, centroId]);

  const fetchReportsCentro = async () => {
    try {
      const response = await fetch("https://isorga.com/api/reportsCentro.php", {
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
      setReportsCentro(data);
      if (data.length > 0) {
        setCentroNombre(data[0].centroNombre);
      }
    } catch (error) {
      console.error("Error fetching modulos:", error);
    }
  };

  const renderModulo = ({ item }) => {
    console.log("Render item:", item);
    return (
      <TouchableOpacity
        style={styles.moduloContainer}
        onPress={() => navigation.navigate("InformesLista", { informe: item.id })}
      >
        <Text style={styles.moduloTexto}>{item.titulo}</Text>
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={icons.arrowBack}
            resizeMode="contain"
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>GESTIÓN INFORMES</Text>
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
        data={reportsCentro}
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
  header: {
    padding: 16,
  },
  centroModulos: {
    fontSize: 15,
    fontWeight: "bold",
  },
  backIcon: {
    height: 24,
    width: 24,
  },
  centroNombre: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.black,
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
    padding: 5, // Aumentar el padding
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.magenta,
    justifyContent: "center",
    alignItems: "center",
    minWidth: "45%", // Ajustar el tamaño mínimo
    minHeight: 80, // Establecer una altura mínima mayor
  },
  moduloTexto: {
    fontSize: 14, // Aumentar el tamaño de la fuente
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
  moduloLogo: {
    width: 50,
    height: 50,
    marginBottom: 15,
    resizeMode: "contain",
  },
});

export default GestionInformes;
