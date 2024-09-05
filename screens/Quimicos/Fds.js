import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { COLORS, SIZES } from "../../constants";

const Documento = ({ route, navigation }) => {
  const { id } = route.params;
  const [userId, setUserId] = useState(null);
  const [centroId, setCentroId] = useState(null);
  const [documento, setDocumento] = useState(null);
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
      fetchDocumento();
    }
  }, [userId, centroId]);

  const fetchDocumento = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://isorga.com/api/ProductoQuimico.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idDocumento: id,
          }),
        }
      );
      const data = await response.json();
      console.log("Received document:", data); // Log the received document data
      setDocumento(data);
    } catch (error) {
      console.error("Error fetching documento:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenInBrowser = () => {
    const encodedUrl = `https://isorga.com/DOCS/${centroId}/${encodeURIComponent(documento.archivo)}`;
    Linking.openURL(encodedUrl);
  };

  const handleDownload = async () => {
    try {
      const encodedUrl = `https://isorga.com/DOCS/${centroId}/${encodeURIComponent(documento.archivo)}`;
      const fileUri = `${FileSystem.documentDirectory}${documento.pdf}`;
      const { uri } = await FileSystem.downloadAsync(encodedUrl, fileUri);
      Alert.alert("Descarga completada", `Archivo descargado a ${uri}`);
    } catch (error) {
      console.error("Error downloading file:", error);
      Alert.alert("Error", "No se pudo descargar el archivo.");
    }
  };

  const handleShare = async () => {
    try {
      const encodedUrl = `https://isorga.com/DOCS/${centroId}/${encodeURIComponent(documento.archivo)}`;
      const fileUri = `${FileSystem.documentDirectory}${documento.pdf}`;
      await FileSystem.downloadAsync(encodedUrl, fileUri);

      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error("Error sharing file:", error);
      Alert.alert("Error", "No se pudo compartir el archivo.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  const pdfUrl = `https://isorga.com/DOCS/${centroId}/${encodeURIComponent(documento.archivo)}`;
  console.log("PDF URL:", pdfUrl); // Log the PDF URL

  return (
    <SafeAreaView style={styles.area}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{documento.nombre}</Text>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={() => navigation.navigate("Inicio")}>
          <Image
            source={require("../../assets/images/logoIsorga.png")}
            style={styles.logo}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.horizontalLine} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>NOMBRE PRODUCTO</Text>
          <Text style={styles.value}>{documento.nombre}</Text>

          <Text style={styles.label}>FECHA FDS</Text>
          <Text style={styles.value}>{documento.fecha}</Text>

          <Text style={styles.label}>TIPO ADR</Text>
          <Text style={styles.value}>{documento.adr}</Text>

          <Text style={styles.label}>Nº CAS</Text>
          <Text style={styles.value}>{documento.cas}</Text>

          <Text style={styles.label}>CLASE REACH</Text>
          <Text style={styles.value}>{documento.reach}</Text>

          <Text style={styles.label}>OBSERVACIONES</Text>
          <Text style={styles.value}>
            {documento.observaciones || "No hay observaciones"}
          </Text>
        </View>

        {/* <View style={styles.horizontalLine} /> */}
        <View style={styles.iconRow}>
          <TouchableOpacity
            onPress={handleOpenInBrowser}
            style={styles.iconButton}
          >
            <Ionicons name="eye-outline" size={24} color={COLORS.white} />
            <Text style={styles.iconText}>Ver PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.iconButton}>
            <Ionicons name="share-outline" size={24} color={COLORS.white} />
            <Text style={styles.iconText}>Compartir PDF</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    backgroundColor: COLORS.white,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  headerTitle: {
    color: COLORS.black,
    fontSize: SIZES.h3,
    fontWeight: "bold",
    marginLeft: 16,
  },
  content: {
    padding: 16,
  },
  flatListContent: {
    paddingHorizontal: 1,
  },
  card: {
    backgroundColor: "#fff", // Fondo blanco para la tarjeta
    borderRadius: 5, // Bordes ligeramente redondeados
    borderWidth: 2, // Ancho del borde
    borderColor: "#ADD8E6", // Borde azul claro (puedes ajustar el color)
    padding: 10, // Espaciado interno
    marginVertical: 10,
    marginHorizontal: 10, // Espaciado entre tarjetas
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.darkGray,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 12,
    color: COLORS.black,
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
    fontSize: 12,
    color: COLORS.black,
    marginTop: 8,
  },
  value: {
    fontSize: 14,
    color: COLORS.black,
    marginBottom: 16,
  },
  valueEstado: {
    fontSize: 18,
    color: COLORS.magenta,
    fontWeight: "bold",
    marginBottom: 8,
  },
  observaciones: {
    marginBottom: 16,
    textAlign: "justify",
  },
  horizontalLine: {
    borderBottomColor: COLORS.black,
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconText: {
    color: COLORS.white,
    marginLeft: 8,
    fontWeight: "bold",
  },
});

export default Documento;
