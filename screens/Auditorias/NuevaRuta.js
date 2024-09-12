import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES, icons } from "../../constants";
import RenderHtml from "react-native-render-html";
import { useWindowDimensions } from "react-native"; // Para manejar el tamaño de la pantalla
import { useFocusEffect } from "@react-navigation/native";

const NuevaRuta = ({ route, navigation }) => {
  const { nueva, auditoriaId, apartadoId } = route.params;
  const { width } = useWindowDimensions(); // Para RenderHtml

  const [activeTab, setActiveTab] = useState("datosRuta");
  const [personalAuditado, setPersonalAuditado] = useState("");
  const [fuentesEvidencias, setFuentesEvidencias] = useState("");
  const [tituloAuditoria, setTituloAuditoria] = useState("");
  const [observacionesAuditoria, setObservacionesAuditoria] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [tiposNoConformidad, setTiposNoConformidad] = useState([]);
  const [selectedTipo, setSelectedTipo] = useState(null);
  const [descripcionNoConformidad, setDescripcionNoConformidad] = useState("");
  const [noConformidades, setNoConformidades] = useState([]);

  // Fetch para obtener datos de "personal" y "texto" para completar los campos
  useFocusEffect(
    React.useCallback(() => {
      const fetchTextoRuta = async () => {
        try {
          const response = await fetch(
            `https://isorga.com/api/app/textoRuta.php?id=${nueva}`
          );
          const data = await response.json();

          if (data.length > 0) {
            setPersonalAuditado(data[0].personal || "");
            setFuentesEvidencias(data[0].texto || "");
          }
        } catch (error) {
          console.error("Error al obtener los datos de la ruta:", error);
        }
      };

      fetchTextoRuta();
    }, [nueva])
  );

  // Fetch para obtener título y observaciones de la auditoría
  useFocusEffect(
    React.useCallback(() => {
    const fetchTextoAuditoria = async () => {
      try {
        const response = await fetch(
          `https://isorga.com/api/app/textoAuditoria.php?id=${apartadoId}`
        );
        const data = await response.json();

        if (data.length > 0) {
          setTituloAuditoria(data[0].titulo || "");
          setObservacionesAuditoria(data[0].observaciones || "");
        }
      } catch (error) {
        console.error("Error al obtener los datos de la auditoría:", error);
      }
    };

    fetchTextoAuditoria();
  }, [auditoriaId]));

  // Cargar los tipos de no conformidad desde el servidor
  useEffect(() => {
    const fetchTiposNoConformidad = async () => {
      try {
        const response = await fetch(
          "https://isorga.com/api/app/tipoNoConformidad.php"
        );
        const data = await response.json();
        setTiposNoConformidad(data);
      } catch (error) {
        console.error("Error al cargar tipos de no conformidad:", error);
      }
    };
    fetchTiposNoConformidad();
  }, []);

  useEffect(() => {
    if (activeTab === "noConformidad") {
      const fetchNoConformidades = async () => {
        try {
          const response = await fetch(
            `https://isorga.com/api/app/listaNoConformidades.php?id=${nueva}`
          );
          const data = await response.json();
          setNoConformidades(data);
        } catch (error) {
          console.error("Error al cargar las no conformidades:", error);
          setNoConformidades([]);
        }
      };
      fetchNoConformidades();
    }
  }, [activeTab, nueva]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const guardarRuta = async () => {
    if (!personalAuditado || !fuentesEvidencias) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    try {
      const response = await fetch(
        "https://isorga.com/api/app/guardarRuta.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nuevaId: nueva,
            personalAuditado,
            fuentesEvidencias,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        Alert.alert(
          "Éxito",
          "Los datos de la ruta se han guardado correctamente."
        );
      } else {
        Alert.alert(
          "Éxito",
          "Los datos de la ruta se han guardado correctamente."
        );
      }
    } catch (error) {
      Alert.alert(
        "Éxito",
        "Los datos de la ruta se han guardado correctamente."
      );
    }
  };

  const guardarNoConformidad = async () => {
    if (!selectedTipo || !descripcionNoConformidad) {
      Alert.alert(
        "Error",
        "Debe seleccionar un tipo y escribir una descripción."
      );
      return;
    }

    try {
      const response = await fetch(
        "https://isorga.com/api/app/guardarNoConformidad.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nuevaId: nueva,
            tipoNoConformidad: selectedTipo,
            // descripcion: descripcionNoConformidad,
            descripcion: descripcionNoConformidad.replace(/\n/g, "\\n"),
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setModalVisible(false);
        fetchNoConformidades();
      } else {
        setModalVisible(false);
        fetchNoConformidades();
      }
    } catch (error) {
      setModalVisible(false);
      fetchNoConformidades();
    }
  };

  const fetchNoConformidades = async () => {
    try {
      const response = await fetch(
        `https://isorga.com/api/app/listaNoConformidades.php?id=${nueva}`
      );
      const data = await response.json();
      setNoConformidades(data);
    } catch (error) {
      console.error("Error al cargar las no conformidades:", error);
      setNoConformidades([]);
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
        <Text style={styles.headerTitle}>RUTA AUDITORÍA</Text>
        <View style={{ flex: 1 }} />
        <Image
          source={require("../../assets/images/logoIsorga.png")}
          style={styles.logo}
        />
      </View>
    );
  };

  const eliminarRuta = async () => {
    // Mostrar alerta de confirmación antes de eliminar
    Alert.alert(
      "Eliminar Ruta",
      "¿Estás seguro de que deseas eliminar esta ruta?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              const response = await fetch(
                "https://isorga.com/api/app/eliminarRuta.php",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    id: nueva, // Enviamos el ID de la ruta que queremos eliminar
                  }),
                }
              );

              const result = await response.json();

              if (result.success) {
                // Alert.alert('Éxito', 'La ruta ha sido eliminada correctamente.');
                navigation.goBack(); // Volver a la pantalla anterior
              } else {
                // Alert.alert('Error', 'Hubo un problema al intentar eliminar la ruta.');
                console.error("Error al eliminar la ruta:", nueva);
                navigation.goBack(); // Volver a la pantalla anterior
              }
            } catch (error) {
              Alert.alert(
                "Error",
                "No se pudo conectar con el servidor para eliminar la ruta."
              );
              console.error("Error al eliminar la ruta:", error);
            }
          },
        },
      ]
    );
  };

  const eliminarObservacion = async (id) => {
    // Mostrar alerta de confirmación antes de eliminar
    Alert.alert(
      "Eliminar Observación",
      "¿Estás seguro de que deseas eliminar esta observación?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              const response = await fetch(
                "https://isorga.com/api/app/eliminarNoConformidad.php",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    id: id, // Enviamos el ID de la observación que queremos eliminar
                  }),
                }
              );

              const result = await response.json();

              if (result.success) {
                // Filtrar la lista de no conformidades para eliminar el registro eliminado
                setNoConformidades((prevNoConformidades) =>
                  prevNoConformidades.filter((item) => item.id !== id)
                );
                // Alert.alert(
                  // "Éxito",
                  // "La observación ha sido eliminada correctamente.";
                // );
                navigation.goBack()
              } else {
                // Alert.alert(
                  // "Error",
                  // "Hubo un problema al intentar eliminar la observación." ;
                // );
                navigation.goBack() 
              }
            } catch (error) {
              Alert.alert(
                "Error",
                "No se pudo conectar con el servidor para eliminar la observación."
              );
              console.error("Error al eliminar la observación:", error);
            }
          },
        },
      ]
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.area}>
        {renderHeader()}
        <View style={styles.horizontalLine} />
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "datosRuta" && styles.activeTab]}
            onPress={() => handleTabChange("datosRuta")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "datosRuta" && styles.activeTabText,
              ]}
            >
              DATOS RUTA
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "noConformidad" && styles.activeTab,
            ]}
            onPress={() => handleTabChange("noConformidad")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "noConformidad" && styles.activeTabText,
              ]}
            >
              OBSERVACIONES
            </Text>
          </TouchableOpacity>
        </View>

        {/* Contenido de la primera pestaña: Datos Ruta */}
        {activeTab === "datosRuta" && (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.formGroup}>
                <Text style={styles.label}>PREGUNTA</Text>
                <Text style={styles.text}>{tituloAuditoria}</Text>
                <RenderHtml
                  contentWidth={width}
                  source={{ html: observacionesAuditoria }}
                />
              </View>
              <View style={styles.horizontalLineInterno} />

              <View style={styles.formGroup}>
                <Text style={styles.label}>PERSONAL AUDITADO</Text>
                <TextInput
                  style={styles.input}
                  value={personalAuditado}
                  onChangeText={setPersonalAuditado}
                  placeholder="Escriba el personal auditado"
                  placeholderTextColor={COLORS.gray}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>EVIDENCIAS RUTA</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={fuentesEvidencias}
                  onChangeText={setFuentesEvidencias}
                  placeholder="Escriba la ruta de auditoría y fuentes de evidencias"
                  placeholderTextColor={COLORS.gray}
                  multiline
                  numberOfLines={4}
                />
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={guardarRuta}>
                <Text style={styles.saveButtonText}>GUARDAR RUTA</Text>
              </TouchableOpacity>

              {/* Botón para eliminar la ruta */}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={eliminarRuta}
              >
                <Text style={styles.deleteButtonText}>ELIMINAR RUTA</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        )}

        {/* Contenido de la segunda pestaña: No Conformidad/Oportunidad */}
        {activeTab === "noConformidad" && (
          <View style={styles.content}>
            {noConformidades.length > 0 ? (
              <FlatList
                data={noConformidades}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.noConformidadItem}>
                    <View style={styles.horizontalLine} />
                    <Text style={styles.noConformidadTitulo}>
                      {item.texto_tipo}:
                    </Text>
                    <Text style={styles.noConformidadText}>
                      {item.texto_NC}
                    </Text>
                    {/* Botón para eliminar la observación */}
                    <TouchableOpacity
                      style={styles.deleteButton2}
                      onPress={() => eliminarObservacion(item.id)}
                    >
                      <Text style={styles.deleteButtonText2}>Eliminar</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            ) : (
              <Text style={styles.placeholderText}>
                No hay no conformidades registradas.
              </Text>
            )}

            <View style={styles.horizontalLine} />

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.addButtonText}>AÑADIR OBSERVACIONES</Text>
            </TouchableOpacity>

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                <View style={styles.modalContainer}>
                  <TouchableWithoutFeedback>
                    <KeyboardAvoidingView
                      behavior={Platform.OS === "ios" ? "padding" : "height"}
                      style={styles.modalContent}
                    >
                      <Text style={styles.modalTitle}>AÑADIR OBSERVACIÓN</Text>

                      <View style={styles.horizontalLine} />
                      <Text style={styles.modalText}>
                        1.- Elegir Tipo Observación
                      </Text>

                      <FlatList
                        data={tiposNoConformidad}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            style={[
                              styles.tipoButton,
                              selectedTipo === item.id &&
                                styles.selectedTipoButton,
                            ]}
                            onPress={() => setSelectedTipo(item.id)}
                          >
                            <Text
                              style={[
                                styles.tipoButtonText,
                                selectedTipo === item.id &&
                                  styles.selectedTipoButtonText,
                              ]}
                            >
                              {item.texto_tipo}
                            </Text>
                          </TouchableOpacity>
                        )}
                      />

                      <View style={styles.horizontalLine} />
                      <Text style={styles.modalText}>
                        2.- Descripción de la Observación
                      </Text>

                      <TextInput
                        style={[styles.input, styles.textArea2]}
                        value={descripcionNoConformidad}
                        onChangeText={setDescripcionNoConformidad}
                        placeholder="Escriba la descripción"
                        placeholderTextColor={COLORS.gray}
                        multiline={true}
                        numberOfLines={4}
                      />

                      <TouchableOpacity
                        style={styles.saveButton}
                        onPress={guardarNoConformidad}
                      >
                        <Text style={styles.saveButtonText}>Crear</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => setModalVisible(false)}
                      >
                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                      </TouchableOpacity>
                    </KeyboardAvoidingView>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </View>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 16,
    color: COLORS.gray,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  formGroup: {
    marginBottom: 5,
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    fontSize: 16,
    color: COLORS.black,
  },
  text: {
    fontSize: 16,
    color: COLORS.black,
  },
  textArea: {
    height: 200,
    textAlignVertical: "top",
  },
  textArea2: {
    height: 100,  // Define la altura del textarea
    textAlignVertical: 'top',  // Alinea el texto en la parte superior
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    fontSize: 16,
    color: COLORS.black,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  addButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: COLORS.gray,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  deleteButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  deleteButton2: {
    backgroundColor: COLORS.warning,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  deleteButtonText2: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 14,
  },
  noConformidadItem: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  noConformidadTitulo: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 5, // Espacio entre la fecha y el texto
  },
  noConformidadText: {
    fontSize: 14,
    color: COLORS.black,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  tipoButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedTipoButton: {
    backgroundColor: COLORS.primary,
  },
  tipoButtonText: {
    color: COLORS.black,
  },
  selectedTipoButtonText: {
    color: COLORS.white,
  },
  cancelButton: {
    backgroundColor: COLORS.warning,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  cancelButtonText: {
    color: COLORS.white,
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
  horizontalLineInterno: {
    borderBottomColor: COLORS.black,
    borderBottomWidth: 3,
    marginVertical: 10,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
});

export default NuevaRuta;
