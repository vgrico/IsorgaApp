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
import { COLORS, SIZES, icons } from "../../constants";

const NoConformidad = ({ route, navigation }) => {
  const { id } = route.params;
  console.log("Received ID:", id);

  const [userId, setUserId] = useState(null);
  const [centroId, setCentroId] = useState(null);
  const [noConformidad, setNoConformidad] = useState(null);
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
      fetchNoConformidad();
    }
  }, [userId, centroId]);

  const fetchNoConformidad = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://isorga.com/api/noConformidad.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          noConformidad: id,
        }),
      });
      const data = await response.json();
      console.log("Received document:", data);
      setNoConformidad(data);
    } catch (error) {
      console.error("Error fetching documento:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !userId) {
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
        <Text style={styles.headerTitle}>{noConformidad.numero}</Text>
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

      <ScrollView contentContainerStyle={styles.content}>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>NO CONFORMIDAD</Text>

          <View style={styles.horizontalLine} />

          <Text style={styles.label}>TITULO</Text>
          <Text style={styles.titulo}>{noConformidad.titulo}</Text>
          <View style={styles.horizontalLine} />

          <Text style={styles.label}>DESCRIPCION</Text>
          <Text style={styles.value}>{noConformidad.texto}</Text>

          <View style={styles.horizontalLine} />

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>RESPONSABLE</Text>
              <Text style={styles.value}>{noConformidad.elresponsable}</Text>
            </View>
            <View style={styles.column}>
              {/* <Text style={styles.label}>ESTADo</Text> */}
              <Text
                style={[
                  styles.label,
                  noConformidad.qestado === "ABIERTA"
                    ? styles.openStatus
                    : styles.closedStatus,
                ]}
              >
                {noConformidad.qestado}
              </Text>
            </View>
          </View>
          <View style={styles.horizontalLine} />
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>ORIGEN</Text>
              <Text style={styles.value}>{noConformidad.origenes}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>AMBITO</Text>
              <Text style={styles.value}>{noConformidad.ambitos}</Text>
            </View>
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>FECHA</Text>
              <Text style={styles.value}>{noConformidad.fecha}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>F. PREVISTA CIERRE</Text>
              <Text style={styles.value}>
                {noConformidad.fecha_prevista_cierre}
              </Text>
            </View>
          </View>
          <Text style={styles.label}>F. CIERRE</Text>
          <Text style={styles.value}>{noConformidad.fecha_cierre}</Text>
        </View>

        {/* <View style={styles.horizontalLine} /> */}

        <TouchableOpacity
          style={styles.revisionButton}
          onPress={() =>
            navigation.navigate("Correctivas", { id: noConformidad.indice })
          }
        >

          <Text style={styles.revisionButtonText}>Ac. Correctivas</Text>
        </TouchableOpacity>
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
  backIcon: {
    height: 18,
    width: 18,
    tintColor: COLORS.black,
  },
  content: {
    padding: 16,
  },

  row: {
    flexDirection: "row", // Alinea los elementos en una fila
    justifyContent: "flex-start", // Alinea los elementos al inicio
    alignItems: "center", // Centra verticalmente los elementos
    marginTop: 8,
  },

  label: {
    fontWeight: "bold",
    fontSize: 10,
    color: COLORS.black,
    marginTop: 8,
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
    marginVertical: 5,
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
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  revisionButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "semibold",
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
    marginBottom: 10,
  },
  column: {
    flex: 1,
    paddingRight: 10,
  },
  label: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#333",
  },
  value: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  titulo: {
    fontSize: 14,
    paddingVertical: 10,
    color: "#666",
    marginBottom: 4,
  },
  openStatus: {
    color: "red",
    fontWeight: "bold",
    borderWidth: 1,          // Ancho del borde
    borderColor: "red",    // Color del borde (puede ser diferente si lo prefieres)
    borderRadius: 5,         // Bordes redondeados (ajusta el valor según tu preferencia)
    padding: 5,
    textAlign: "center", 
  },
  closedStatus: {
    color: "green",
    fontWeight: "bold",
    borderWidth: 1,          // Ancho del borde
    borderColor: "green",    // Color del borde (puede ser diferente si lo prefieres)
    borderRadius: 5,         // Bordes redondeados (ajusta el valor según tu preferencia)
    padding: 5,    
    textAlign: "center", 
  }
});

export default NoConformidad;
