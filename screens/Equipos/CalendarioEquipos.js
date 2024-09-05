import React, { useState, useEffect } from "react";
import { Calendar } from "react-native-calendars";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { COLORS, SIZES, icons } from "../../constants";

const CalendarioEquipos = () => {
  const [userId, setUserId] = useState(null);
  const [centroId, setCentroId] = useState(null);
  const [gruposEquipos, setGruposEquipos] = useState([]);
  const [centroNombre, setCentroNombre] = useState("");

  const [selectedDate, setSelectedDate] = useState(null);

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
    }
  }, [userId, centroId]);

  // Función para manejar la selección de una fecha
  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  // Función para enviar la fecha seleccionada a la API
  const handleSubmit = async () => {
    try {
      const response = await fetch("https://example.com/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: selectedDate,
        }),
      });

      const data = await response.json();
      console.log("Data received from API:", data);
    } catch (error) {
      console.error("Error sending data to API:", error);
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
        <Text style={styles.headerTitle}>CALENDARIO REVISIONES</Text>
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
      <View style={styles.container}>
        <Text style={styles.title}>Seleccionar Fecha</Text>

        <Calendar
          // El día seleccionado se mostrará en un color diferente
          onDayPress={onDayPress}
          markedDates={{
            [selectedDate]: {
              selected: true,
              selectedColor: "#00adf5",
            },
          }}
        />

        {selectedDate && (
          <Text style={styles.selectedDateText}>
            Fecha seleccionada: {selectedDate}
          </Text>
        )}

        <Button
          title="Enviar fecha a la API"
          onPress={handleSubmit}
          disabled={!selectedDate}
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
    minHeight: 120, // Establecer una altura mínima mayor
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
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  selectedDateText: {
    fontSize: 16,
    marginVertical: 20,
    textAlign: "center",
  },
});

export default CalendarioEquipos;
