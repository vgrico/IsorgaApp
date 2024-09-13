import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS, SIZES, icons } from "../../constants";

const Informe5sRespondido = ({ route, navigation }) => {
  const { titulo, id } = route.params;

  const [titulos, setTitulos] = useState([]);
  const [preguntas, setPreguntas] = useState({});
  const [loading, setLoading] = useState(true);
  const [isorgaId, setIsorgaId] = useState(null);
  const [centroId, setCentroId] = useState(null);

  // Obtener isorgaId y centroId desde AsyncStorage
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const isorgaId = await AsyncStorage.getItem("isorgaId");
        const centroId = await AsyncStorage.getItem("centroId");
        setIsorgaId(isorgaId);
        setCentroId(centroId);
      } catch (error) {
        console.error("Error obteniendo los datos de AsyncStorage:", error);
      }
    };
    obtenerDatos();
  }, []);

  // Cargar los títulos y preguntas respondidas desde la API
  useEffect(() => {
    const fetchTitulosYPreguntas = async () => {
      try {
        setLoading(true);
        const responseTitulos = await fetch(
          "https://isorga.com/api/titulosInforme.php?id=5"
        );
        const titulosData = await responseTitulos.json();
        setTitulos(titulosData);

        // Cargar preguntas respondidas para cada título
        const allPreguntas = {};
        for (const titulo of titulosData) {
          const responsePreguntas = await fetch(
            `https://isorga.com/api/preguntasRespuestasTitulo.php?id=${titulo.id}&informe=${id}`
          );
          const preguntasData = await responsePreguntas.json();
          allPreguntas[titulo.id] = preguntasData;
        }
        setPreguntas(allPreguntas);
      } catch (error) {
        console.error("Error fetching titulos and preguntas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTitulosYPreguntas();
  }, []);

  // Función para determinar el valor de la respuesta
  const obtenerValorRespuesta = (valor) => {
    switch (valor) {
      case 0:
        return "0 - No existe";
      case 1:
        return "1 - Hay algo";
      case 2:
        return "2 - Hay desviaciones";
      case 3:
        return "3 - Excelente";
      default:
        return "No evaluado";
    }
  };

  return (
    <SafeAreaView style={styles.area}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={icons.arrowBack}
            resizeMode="contain"
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{titulo}</Text>
        <View style={{ flex: 1 }} />
        <Image
          source={require("../../assets/images/logoIsorga.png")}
          style={styles.logo}
        />
      </View>
      <View style={styles.horizontalLine} />

      <ScrollView contentContainerStyle={styles.content}>
        {titulos.map((titulo) => (
          <View key={titulo.id} style={styles.card}>
            <Text style={styles.titulo}>{titulo.titulo}</Text>

            {preguntas[titulo.id] &&
              preguntas[titulo.id].map((pregunta) => (
                <View key={pregunta.id} style={styles.preguntaContainer}>
                  <Text style={styles.pregunta}>{pregunta.pregunta}</Text>
                  {pregunta.observaciones && (
                    <Text style={styles.observaciones}>
                      {pregunta.observaciones}
                    </Text>
                  )}

                  <View style={styles.respuestaContainer}>
                    <Text style={styles.respuestaText}>
                      {obtenerValorRespuesta(pregunta.valor)}
                    </Text>
                  </View>

                  {pregunta.texto && (
                    <Text style={styles.extraText}>
                      Texto: {pregunta.texto}
                    </Text>
                  )}

                  {pregunta.archivo && (
                    <View style={styles.imageContainer}>
                      <Image
                        source={{
                          uri: `https://isorga.com/DOCS/1611/informe/${pregunta.archivo}`,
                        }}
                        style={styles.imagePreview}
                      />
                    </View>
                  )}

                  <View style={styles.horizontalLine} />
                </View>
              ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  backIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black,
  },
  headerTitle: {
    color: COLORS.black,
    fontSize: SIZES.h3,
    fontWeight: "bold",
    marginLeft: 20,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  horizontalLine: {
    borderBottomColor: COLORS.black,
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 50,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ADD8E6",
    padding: 15,
    marginBottom: 20,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: COLORS.black,
  },
  preguntaContainer: {
    marginBottom: 20,
  },
  pregunta: {
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 5,
  },
  observaciones: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 10,
  },
  respuestaContainer: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: COLORS.lightGray,
    alignItems: "center",
    marginBottom: 10,
  },
  respuestaText: {
    fontSize: 16,
    color: COLORS.black,
  },
  extraText: {
    fontSize: 14,
    color: COLORS.black,
    marginBottom: 5,
  },
  imageContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
});

export default Informe5sRespondido;
