import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES, icons } from "../../constants";

const DatosEquipo = ({ route, navigation }) => {
  const { id } = route.params;
  console.log("Received ID:", id);

  const [userId, setUserId] = useState(null);
  const [centroId, setCentroId] = useState(null);
  const [equipo, setEquipo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

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
      fetchDatosEquipo();
    }
  }, [userId, centroId]);

  const fetchDatosEquipo = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://isorga.com/api/datosEquipo.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          equipo: id,
        }),
      });
      const data = await response.json();
      console.log("Received document:", data);
      setEquipo(data);
    } catch (error) {
      console.error("Error fetching documento:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !id) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

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
        <Text style={styles.headerTitle}>{equipo.nombre}</Text>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={() => navigation.navigate('Inicio')}>
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

      <ScrollView contentContainerStyle={styles.content}>
        {equipo.foto ? (
          <Image
            source={{
              uri: `https://isorga.com/DOCS/${centroId}/${encodeURIComponent(equipo.foto)}`,
            }}
            style={styles.foto}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.noImageText}>No hay foto disponible</Text>
        )}

        <View style={styles.horizontalLine} />

        <View style={styles.card}>
          <Text style={styles.label}>REFERENCIA:</Text>
          <Text style={styles.value}>{equipo.referencia}</Text>

          <Text style={styles.label}>OBSERVACIONES</Text>
          <Text style={styles.value}>{equipo.observaciones}</Text>
        </View>

        <View style={styles.horizontalLine} />

        <View style={styles.card}>
  <View style={styles.row}>
    <View style={styles.column}>
      <Text style={styles.label}>ACTIVO</Text>
      <Text style={styles.value}>{equipo.activo == 1 ? "SI" : "NO"}</Text>
    </View>
    <View style={styles.column}>
      {equipo.activo == 1 ? (
        <>
          <Text style={styles.label}>FECHA ALTA</Text>
          <Text style={styles.value}>{equipo.fecha}</Text>
        </>
      ) : (
        <>
          <Text style={styles.label}>FECHA BAJA</Text>
          <Text style={styles.value}>{equipo.fecha_baja}</Text> 
        </>
      )}
    </View>
  </View>

  <View style={styles.horizontalLine} />

  <View style={styles.row}>
    <View style={styles.column}>
      <Text style={styles.label}>LEGALIZADO</Text>
      <Text style={styles.value}>{equipo.legalizado == 1 ? "SI" : "NO"}</Text>
    </View>
    <View style={styles.column}>
      <Text style={styles.label}>REGLAMENTARIO</Text>
      <Text style={styles.value}>{equipo.reglamentario == 1 ? "SI" : "NO"}</Text>
    </View>
  </View>
</View>

        <View style={styles.horizontalLine} />

        <TouchableOpacity
          style={styles.revisionButton}
          onPress={() =>
            navigation.navigate("RevisionesEquipo", { id: equipo.id })
          }
        >
          <Text style={styles.revisionButtonText}>
            Ver Revisiones del Equipo
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close-circle" size={40} color={COLORS.white} />
          </TouchableOpacity>
          <ScrollView
            style={{ flex: 1 }}
            maximumZoomScale={3}
            minimumZoomScale={1}
            contentContainerStyle={styles.modalImageContainer}
          ></ScrollView>
          <Image
            source={{
              uri: `https://isorga.com/DOCS/${centroId}/${encodeURIComponent(equipo.foto)}`,
            }}
            style={styles.modalImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
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
  backIcon: {
    height: 18,
    width: 18,
    tintColor: COLORS.black,
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between", // Esto asegura que las columnas se distribuyan a lo largo de la fila
    marginBottom: 10, // Espacio entre las filas
  },
  column: {
    flex: 1, // Cada columna ocupa la mitad del espacio
    paddingHorizontal: 5, // Añade espacio interno
  },
  label: {
    fontWeight: "bold",
    fontSize: 8,
    color: COLORS.black,
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    color: COLORS.black,
    marginBottom: 8,
  },
  valueEstado: {
    fontSize: 14,
    color: COLORS.red,
    fontWeight: "semibold",
    marginBottom: 8,
    textAlign: "right",
  },
  observaciones: {
    marginBottom: 16,
    textAlign: "right",
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  iconContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  iconText: {
    color: COLORS.greyscale600,
    fontWeight: "regular",
    marginTop: 8,
  },
  horizontalLine: {
    borderBottomColor: COLORS.black,
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  foto: {
    width: 400,
    height: 400,
    marginBottom: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: "90%",
    height: "80%",
  },
  modalCloseButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
  },
  revisionButton: {
    backgroundColor: COLORS.primary, // Cambia según tu preferencia
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  revisionButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DatosEquipo;
