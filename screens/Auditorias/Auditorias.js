import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Button,
} from "react-native";
import { COLORS, SIZES } from "../../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Auditorias = ({ navigation }) => {
  const [datosSeries, setDatosSeries] = useState(null);
  const [userId, setUserId] = useState(null);
  const [centroId, setCentroId] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userIdFromStorage = await AsyncStorage.getItem("isorgaId");
        const centroIdFromStorage = await AsyncStorage.getItem("centroId");
        setUserId(userIdFromStorage);
        setCentroId(centroIdFromStorage);
      } catch (error) {
        console.error("Error loading data from AsyncStorage:", error);
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    if (centroId) {
      fetchSeriesMejorValoradas();
    }
  }, [centroId]);

  const fetchSeriesMejorValoradas = async () => {
    try {
      const response = await fetch(
        `https://momdel.es/dev/api/app/listaAuditorias.php?id=${centroId}`
      );
      const data = await response.json();
      setDatosSeries(data);
    } catch (error) {
      console.error("Error fetching series data:", error);
    }
  };

  const getCardStyle = (estado) => {
    switch (estado) {
      case 1:
        return styles.cardCompleted;
      case 0:
        return styles.cardPending;
      default:
        return styles.cardDefault;
    }
  };

  const handleGeneratePDF = (id) => {
    // Lógica para generar el PDF
    console.log(`Generar PDF para la auditoría ${id}`);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, getCardStyle(item.estado)]}>
      <Text style={styles.title}>{item.titulo}</Text>
      <Text style={styles.details}>{item.centroNombre}</Text>
      <Text style={styles.details}>
        Fechas de auditoría: {item.fechasAuditoria}
      </Text>
      <Text style={styles.details}>Fecha de cierre: {item.fecha_cierre}</Text>
      <Text style={styles.details}>Observaciones: {item.observaciones}</Text>

      {item.estado === 1 ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Auditoria", { id: item.id })}
          >
            <Text style={styles.buttonText}>Abrir Auditoría</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleGeneratePDF(item.id)}
          >
            <Text style={styles.buttonText}>Generar PDF</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Auditoria", { id: item.id })}
        >
          <Text style={styles.buttonText}>Ir a Auditoría</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.area}>
      <View style={styles.container}>
        <Text style={styles.sectionHeader}>Auditorías</Text>
        <FlatList
          data={datosSeries}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
  },
  sectionHeader: {
    fontSize: 24,
    fontFamily: "bold",
    color: COLORS.black,
    marginBottom: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
  },
  cardCompleted: {
    backgroundColor: "lightgreen",
  },
  cardPending: {
    backgroundColor: "lightcoral",
  },
  cardDefault: {
    backgroundColor: COLORS.secondaryWhite,
  },
  title: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.black,
  },
  details: {
    fontSize: 14,
    fontFamily: "regular",
    color: COLORS.black,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    textAlign: "center",
  },
});

export default Auditorias;
