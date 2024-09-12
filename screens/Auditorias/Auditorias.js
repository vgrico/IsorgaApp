import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Button,
  Image,
  Linking
} from "react-native";
import { COLORS, SIZES, icons } from "../../constants";
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
      listaAuditorias();
    }
  }, [centroId]);

  const listaAuditorias = async () => {
    try {
      const response = await fetch(
        `https://isorga.com/api/app/listaAuditorias.php?id=${centroId}`
      );
      const data = await response.json();
      setDatosSeries(data);
    } catch (error) {
      console.error("Error fetching series data:", error);
    }
  };

  const abrirCerrarAuditoria = async (idInforme) => {
    try {
      const response = await fetch(
        "https://isorga.com/api/abrirCerrarAuditoria.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            usuario: userId,
            id: idInforme,
          }),
        }
      );

      const result = await response.json();
      listaAuditorias(); // Se puede invocar una sola vez
    } catch (error) {
      console.error("Error al abrir/cerrar la auditoría:", error);
      listaAuditorias(); // Puedes mostrar el error pero aún intentar actualizar la lista
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
        <Text style={styles.headerTitle}>LISTA AUDITORÍAS</Text>
        <View style={{ flex: 1 }} />
        <Image
          source={require("../../assets/images/logoIsorga.png")}
          style={styles.logo}
        />
      </View>
    );
  };

  const handleGeneratePDF = async (id) => {
    try {
      const pdfUrl = `https://isorga.com/auditorias/auditoria_pdf.php?id=${id}`;
      Linking.openURL(pdfUrl);  
    } catch (error) {
      console.error("Error fetching series data:", error);
    } 
    // Lógica para generar el PDF
    console.log(`Generar PDF para la auditoría ${id}`);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, getCardStyle(item.estado)]}>
      <Text style={styles.detailsTitle}>{item.centroAuditado}</Text>
      <View style={styles.horizontalLine} />

      <Text style={styles.title}>{item.titulo}</Text>
      <Text style={styles.details}>
        Fechas Auditoría: {item.fechasAuditoria}
      </Text>
      <Text style={styles.details}>Fecha Cierre: {item.fecha_cierre}</Text>
      <Text style={styles.details}>Observac.: {item.observaciones}</Text>

      {item.estado === 1 ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleGeneratePDF(item.id)}
          >
            <Text style={styles.buttonText}>Generar PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => abrirCerrarAuditoria(item.id)}
          >
            <Text style={styles.buttonText}>Abrir Auditoría</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Auditoria", { id: item.id })}
          >
            <Text style={styles.buttonText}>Auditar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => abrirCerrarAuditoria(item.id)}
          >
            <Text style={styles.buttonText}>Cerrar Auditoría</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.area}>
      {renderHeader()}
      <View style={styles.horizontalLine} />
      <View style={styles.container}>
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
  detailsTitle: {
    fontSize: 16,
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
    flex: 1, // Esto puede hacer que los botones ocupen el mismo ancho
    marginHorizontal: 5, // Espacio lateral entre los botones
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    textAlign: "center",
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
});

export default Auditorias;
