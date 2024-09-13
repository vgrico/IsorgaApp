import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
  Image,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { COLORS, SIZES, icons } from "../../constants";

// Función para obtener la fecha actual en formato YYYY-MM-DD HH:MM:SS
const obtenerFechaActual = () => {
  const fecha = new Date();
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, "0");
  const day = String(fecha.getDate()).padStart(2, "0");
  const hours = String(fecha.getHours()).padStart(2, "0");
  const minutes = String(fecha.getMinutes()).padStart(2, "0");
  const seconds = String(fecha.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const InformeAH = ({ route, navigation }) => {
  const { titulo } = route.params;

  const [titulos, setTitulos] = useState([]);
  const [preguntas, setPreguntas] = useState({});
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [observaciones, setObservaciones] = useState("");
  const [loading, setLoading] = useState(true);
  const [isorgaId, setIsorgaId] = useState(null);
  const [centroId, setCentroId] = useState(null);
  const [fechaInforme, setFechaInforme] = useState(new Date());
  const [horaInforme, setHoraInforme] = useState(new Date());

  // Solicitar permisos de cámara cuando el componente se monta
  useEffect(() => {
    const solicitarPermisosCamara = async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Error",
          "Se requieren permisos de cámara para usar esta funcionalidad."
        );
      }
    };
    solicitarPermisosCamara();
  }, []);

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

  // Cargar los títulos y preguntas desde la API al iniciar
  useEffect(() => {
    const fetchTitulosYPreguntas = async () => {
      try {
        setLoading(true);
        const responseTitulos = await fetch(
          "https://isorga.com/api/titulosInforme.php?id=3"
        );
        const titulosData = await responseTitulos.json();
        setTitulos(titulosData);

        // Cargar preguntas para cada título
        const allPreguntas = {};
        for (const titulo of titulosData) {
          const responsePreguntas = await fetch(
            `https://isorga.com/api/preguntasTitulo.php?id=${titulo.id}`
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

  // Cambiar el valor de la respuesta con valores OK/KO (0,1,2,3)
  const handleAnswerChange = (preguntaId, answer) => {
    const valorRespuesta = {
      OK: 0,
      "KO Leve": 1,
      "KO Moderado": 2,
      "KO Grave": 3,
    }[answer];

    setSelectedAnswers((prev) => ({
      ...prev,
      [preguntaId]: {
        ...prev[preguntaId],
        respuesta: valorRespuesta,
      },
    }));
  };

  // Manejar las observaciones para cada pregunta
  const handleObservationChange = (preguntaId, observacion) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [preguntaId]: {
        ...prev[preguntaId],
        observaciones: observacion,
      },
    }));
  };

  // Función para tomar una foto con la cámara
  const tomarFoto = async (preguntaId) => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedAnswers((prev) => ({
          ...prev,
          [preguntaId]: { ...prev[preguntaId], image: result.assets[0].uri },
        }));
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo acceder a la cámara.");
      console.error("Error al tomar foto: ", error);
    }
  };

  // Función para validar que todas las preguntas de tipo "OK/KO" hayan sido respondidas
  const validarRespuestas = () => {
    const respuestasIncompletas = Object.keys(preguntas).some((tituloId) =>
      preguntas[tituloId].some(
        (pregunta) =>
          !selectedAnswers[pregunta.id] ||
          selectedAnswers[pregunta.id].respuesta === undefined
      )
    );

    if (respuestasIncompletas) {
      Alert.alert(
        "Error",
        "Debe responder todas las preguntas antes de continuar."
      );
      return false;
    }

    return true;
  };

  // Función para enviar los datos a guardarInforme.php
  const enviarDatosAGuardarInforme = async () => {
    if (!validarRespuestas()) {
      return; // Si hay preguntas sin responder, no se envían los datos
    }

    // Concatenar la fecha y la hora seleccionadas
    const fechaCompleta = new Date(
      fechaInforme.getFullYear(),
      fechaInforme.getMonth(),
      fechaInforme.getDate(),
      horaInforme.getHours(),
      horaInforme.getMinutes(),
      horaInforme.getSeconds()
    ).toISOString().split(".")[0]; // Convertir a formato ISO y quitar los milisegundos

    const formData = new FormData();
    formData.append("isorgaId", isorgaId);
    formData.append("centroId", centroId);
    formData.append("fecha", fechaCompleta); // Enviar la fecha y hora combinadas
    formData.append("observacionesGenerales", observaciones);

    Object.keys(selectedAnswers).forEach((preguntaId) => {
      const respuesta = selectedAnswers[preguntaId];
      formData.append(
        `respuestas[${preguntaId}][respuesta]`,
        respuesta.respuesta
      );

      formData.append(
        `respuestas[${preguntaId}][observaciones]`,
        respuesta.observaciones || ""
      );

      if (respuesta.image) {
        const filename = respuesta.image.split("/").pop();
        const fileType = filename.split(".").pop();
        formData.append(`respuestas[${preguntaId}][image]`, {
          uri: respuesta.image,
          name: filename,
          type: `image/${fileType}`,
        });
      }
    });

    try {
      const response = await fetch(
        "https://isorga.com/api/guardarInformeAH.php",
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const result = await response.json();
      console.log("Datos enviados:", formData);
      if (result.success) {
        Alert.alert("Éxito", "Los datos se han guardado correctamente");
      } else {
        Alert.alert("Error", "Hubo un problema al guardar los datos");
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor");
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
        <View style={styles.inputContainer}>
          <DateTimePicker
            value={fechaInforme || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) =>
              setFechaInforme(selectedDate || fechaInforme)
            }
          />
          <DateTimePicker
            value={horaInforme || new Date()}
            mode="time"
            display="default"
            onChange={(event, selectedTime) =>
              setHoraInforme(selectedTime || horaInforme)
            }
          />
        </View>

        <View style={styles.observacionesContainer}>
          <Text style={styles.observacionesLabel}>
            Observaciones Generales:
          </Text>
          <TextInput
            style={styles.input}
            value={observaciones}
            onChangeText={setObservaciones}
            placeholder="Escribe tus observaciones"
            placeholderTextColor={COLORS.gray}
          />
        </View>

        {titulos.map((titulo) => (
          <View key={titulo.id} style={styles.card}>
            <Text style={styles.titulo}>{titulo.titulo}</Text>

            {preguntas[titulo.id] &&
              preguntas[titulo.id].map((pregunta) => (
                <View key={pregunta.id} style={styles.preguntaContainer}>
                  <Text style={styles.pregunta}>{pregunta.pregunta}</Text>
                  <Text style={styles.observaciones}>
                    {pregunta.observaciones}
                  </Text>

                  <View style={styles.radioGroup}>
                    <View style={styles.radioRow}>
                      {["OK", "KO Leve"].map((option) => (
                        <TouchableOpacity
                          key={option}
                          onPress={() =>
                            handleAnswerChange(pregunta.id, option)
                          }
                          style={[
                            styles.radioButton,
                            selectedAnswers[pregunta.id]?.respuesta ===
                              {
                                OK: 0,
                                "KO Leve": 1,
                              }[option] && styles.radioButtonSelected,
                          ]}
                        >
                          <Text style={styles.radioButtonText}>{option}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <View style={styles.radioRow}>
                      {["KO Moderado", "KO Grave"].map((option) => (
                        <TouchableOpacity
                          key={option}
                          onPress={() =>
                            handleAnswerChange(pregunta.id, option)
                          }
                          style={[
                            styles.radioButton,
                            selectedAnswers[pregunta.id]?.respuesta ===
                              {
                                "KO Moderado": 2,
                                "KO Grave": 3,
                              }[option] && styles.radioButtonSelected,
                          ]}
                        >
                          <Text style={styles.radioButtonText}>{option}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => tomarFoto(pregunta.id)}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>Tomar Foto</Text>
                  </TouchableOpacity>

                  {selectedAnswers[pregunta.id]?.image && (
                    <Image
                      source={{ uri: selectedAnswers[pregunta.id]?.image }}
                      style={styles.imagePreview}
                    />
                  )}

                  <TextInput
                    style={styles.input}
                    placeholder="Observaciones"
                    placeholderTextColor={COLORS.gray}
                    value={selectedAnswers[pregunta.id]?.observaciones || ""}
                    onChangeText={(text) =>
                      handleObservationChange(pregunta.id, text)
                    }
                  />
                </View>
              ))}
          </View>
        ))}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={enviarDatosAGuardarInforme}
        >
          <Text style={styles.submitButtonText}>Enviar Informe</Text>
        </TouchableOpacity>

        <View style={{ height: 50 }} />
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
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  observacionesContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  observacionesLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
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
  radioGroup: {
    marginBottom: 10,
  },
  radioRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  radioButton: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  radioButtonSelected: {
    backgroundColor: COLORS.primary,
  },
  radioButtonText: {
    color: COLORS.black,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: COLORS.white,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
});

export default InformeAH;
