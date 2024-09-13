import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { COLORS, icons, SIZES } from "../../constants";

const InformeActual = ({ navigation, route }) => {
  const { id } = route.params; // Recibe el ID del informe desde la navegación

  const [informe, setInforme] = useState("");
  const [fecha, setFecha] = useState("");
  const [centroNombre, setCentroNombre] = useState("");
  const [nUsuario, setNUsuario] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [respuestas, setRespuestas] = useState([]);

  useEffect(() => {
    fetch(`https://isorga.com/api/reportResultados/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setInforme(data.informe);
        setFecha(data.fecha);
        setCentroNombre(data.centroNombre);
        setNUsuario(data.usuarioNombre);
        setObservaciones(data.observaciones);
        setRespuestas(data.respuestas);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [id]);

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
        <Text style={styles.headerTitle}>RESULTADOS DEL INFORME</Text>
        <View style={{ flex: 1 }} />
        <Image
          source={require("../../assets/images/logoIsorga.png")}
          style={styles.logo}
        />
      </View>
    );
  };

  const renderResultado = () => {
    return respuestas.map((respuesta, index) => (
      <View key={index} style={styles.resultado}>
        <Text style={styles.pregunta}>{respuesta.pregunta}</Text>
        <Text style={styles.respuesta}>Respuesta: {respuesta.respuesta ? "Sí" : "No"}</Text>
        {respuesta.observaciones && (
          <Text style={styles.observaciones}>
            Observaciones: {respuesta.observaciones}
          </Text>
        )}
      </View>
    ));
  };

  return (
    <ScrollView style={styles.area}>
      {renderHeader()}
      <View style={styles.horizontalLine} />

      <View style={styles.formRow}>
        <Text style={styles.label}>Fecha Informe</Text>
        <Text style={styles.value}>{fecha}</Text>
      </View>
      <View style={styles.formRow}>
        <Text style={styles.label}>Centro</Text>
        <Text style={styles.value}>{centroNombre}</Text>
      </View>
      <View style={styles.formRow}>
        <Text style={styles.label}>Número Usuario</Text>
        <Text style={styles.value}>{nUsuario}</Text>
      </View>
      <View style={styles.formRow}>
        <Text style={styles.label}>Observaciones Generales</Text>
        <Text style={styles.value}>{observaciones}</Text>
      </View>

      <View style={styles.resultadosSection}>
        <Text style={styles.sectionTitle}>Resultados del Cuestionario</Text>
        {renderResultado()}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Volver</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
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
    fontSize: SIZES.h3,
    fontWeight: "bold",
    marginLeft: 16,
  },
  backIcon: {
    height: 18,
    width: 18,
  },
  horizontalLine: {
    borderBottomColor: COLORS.black,
    borderBottomWidth: 1,
    marginVertical: 20,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  formRow: {
    marginBottom: 15,
    paddingHorizontal: 16,
  },
  label: {
    fontWeight: "bold",
  },
  value: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 4,
    backgroundColor: "#f0f0f0",
    marginTop: 5,
  },
  resultadosSection: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  resultado: {
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 8,
  },
  pregunta: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  respuesta: {
    fontSize: 16,
    marginBottom: 5,
  },
  observaciones: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#666",
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 20,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
});

export default InformeActual;