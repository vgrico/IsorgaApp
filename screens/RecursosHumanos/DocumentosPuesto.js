import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, icons, SIZES } from "../../constants";

const PersonalPuestos = ({ route, navigation }) => {
  const { id, nombre } = route.params;

  const [userId, setUserId] = useState(null);
  const [centroId, setCentroId] = useState(null);
  const [documentosSeccion, setDocumentosSeccion] = useState([]);
  const [documentosPuesto, setDocumentosPuesto] = useState([]);
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
      fetchDocumentosPuesto();
      fetchDocumentosSeccion();
    }
  }, [userId, centroId]);

  const fetchDocumentosSeccion = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://isorga.com/api/DocumentosSeccion.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            puestoId: id,
          }),
        }
      );
      const data = await response.json();
      setDocumentosSeccion(data);
    } catch (error) {
      console.error("Error fetching modulos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocumentosPuesto = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://isorga.com/api/DocumentosPuesto.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            puestoId: id,
          }),
        }
      );
      const data = await response.json();
      setDocumentosPuesto(data);
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
        <Text style={styles.headerTitle}>{nombre}</Text>
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
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("PersonalFichaFormacion", {
            id: item.id,
          })
        }
      >
        <View style={styles.row}>
          <Text style={[styles.cell, styles.codigoCell]}>{item.codigo}</Text>
          <Text style={[styles.cell, styles.tituloCell]}>{item.titulo}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.area}>
      {renderHeader()}
      <View style={styles.horizontalLine} />

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View>
          <Text style={styles.tituloSegundo}>PROCEDIMIENTOS</Text>
          <View>
            <View style={styles.headerRow}>
              <Text style={[styles.headerCell, styles.codigoCell]}>Código</Text>
              <Text style={[styles.headerCell, styles.tituloCell]}>Título</Text>
            </View>
            <FlatList
              data={documentosSeccion}
              renderItem={renderModulo}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.flatListContent}
              scrollEnabled={false}  // Importante para que no haya conflicto de scroll
            />
          </View>
        </View>

        <View style={styles.horizontalLineGruesa} />

        <View>
          <Text style={styles.tituloSegundo}>INSTRUCCIONES</Text>
          <View>
            <View style={styles.headerRow}>
              <Text style={[styles.headerCell, styles.codigoCell]}>Código</Text>
              <Text style={[styles.headerCell, styles.tituloCell]}>Título</Text>
            </View>
            <FlatList
              data={documentosPuesto}
              renderItem={renderModulo}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.flatListContent}
              scrollEnabled={false}  // Importante para que no haya conflicto de scroll
            />
          </View>
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
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
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
  backIcon: {
    height: 18,
    width: 18,
    tintColor: COLORS.black,
  },
  headerTitle: {
    color: COLORS.black,
    fontSize: SIZES.h3,
    fontWeight: "bold",
    marginLeft: 22,
  },
  tituloSegundo: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.blackTie,
    paddingBottom: 10,
    marginVertical: 10,
  },
  flatListContent: {
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: COLORS.black,
    paddingBottom: 8,
    marginBottom: 10,
  },
  headerCell: {
    fontWeight: "bold",
    fontSize: 12,
    color: COLORS.black,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    paddingVertical: 10,
  },
  cell: {
    fontSize: 12,
    color: COLORS.black,
  },
  codigoCell: {
    flex: 3,
  },
  tituloCell: {
    flex: 7,
  },
  horizontalLine: {
    borderBottomColor: COLORS.black,
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  horizontalLineGruesa: {
    borderBottomColor: COLORS.grayscale400,
    borderBottomWidth: 3,
    marginVertical: 10,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
});

export default PersonalPuestos;