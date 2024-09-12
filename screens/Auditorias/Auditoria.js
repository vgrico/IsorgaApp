import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, icons, SIZES } from "../../constants";

import AsyncStorage from "@react-native-async-storage/async-storage";
import RenderHtml from "react-native-render-html";
import { useWindowDimensions } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const Auditoria = ({ route, navigation }) => {
  const { id } = route.params; // ID de la auditoría recibido
  const { width } = useWindowDimensions(); // Obtener el ancho de la pantalla para renderizado de HTML
  const [auditoria, setAuditoria] = useState(null);
  const [rutas, setRutas] = useState([]);
  const [userId, setUserId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); // Estado para visibilidad del modal
  const [listaRutas, setListaRutas] = useState([]); // Estado para almacenar las rutas obtenidas
  const [apartadoSeleccionado, setApartadoSeleccionado] = useState(null); // Estado para almacenar el ID del apartado seleccionado

  useFocusEffect(
    React.useCallback(() => {
      const loadUserId = async () => {
        try {
          const userIdFromStorage = await AsyncStorage.getItem("isorgaId");
          setUserId(userIdFromStorage);
          fetchAuditoriaData(userIdFromStorage);
        } catch (error) {
          console.error("Error al cargar el userId desde AsyncStorage:", error);
        }
      };
      loadUserId();
    }, [])
  );

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
        {auditoria && (
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{auditoria.titulo}</Text>
            {/* <RenderHtml
              contentWidth={width}
              source={{ html: auditoria.observaciones }}
            /> */}
          </View>
        )}
        <View style={{ flex: 1 }} />
        <Image
          source={require("../../assets/images/logoIsorga.png")}
          style={styles.logo}
        />
      </View>
    );
  };

  const fetchAuditoriaData = async (userId) => {
    try {
      const response = await fetch(
        `https://momdel.es/dev/api/app/auditoria.php?id=${id}`
      );
      const data = await response.json();
      setAuditoria(data.auditoria);
      setRutas(data.rutas);
    } catch (error) {
      console.error("Error al obtener los datos de la auditoría:", error);
    }
  };

  // Fetch list of routes for the selected apartado
  const fetchListaRutas = async (apartadoId) => {
    try {
      const response = await fetch(
        `https://isorga.com/api/app/listaRutas.php?nueva=${id}&apartadoId=${apartadoId}`
      );
      const data = await response.json();
      setListaRutas(data); // Guardar las rutas obtenidas
      setApartadoSeleccionado(apartadoId); // Guardar el ID del apartado seleccionado
      setModalVisible(true); // Mostrar el modal
    } catch (error) {
      console.error("Error al obtener las rutas:", error);
      Alert.alert("Error", "Ocurrió un error al obtener las rutas.");
    }
  };

  // Función para navegar a "NuevaRuta" con el ID de la ruta seleccionada y el apartado seleccionado
  const handleRouteClick = (rutaId) => {
    setModalVisible(false);
    navigation.navigate("NuevaRuta", {
      nueva: rutaId,
      auditoriaId: id,
      apartadoId: apartadoSeleccionado,
    });
  };

  // Función para añadir nueva ruta mediante un fetch
  const handleAddNewRoute = async (apartadoId) => {
    try {
      const response = await fetch(
        "https://momdel.es/dev/api/app/añadirRuta.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            apartadoId: apartadoId,
            userId: userId,
            id: id, // Enviar el id de la auditoría
          }),
        }
      );

      const result = await response.json();

      if (result.nueva) {
        // Navega a la página "NuevaRuta" con el parámetro 'nueva' recibido del servidor
        navigation.navigate("NuevaRuta", {
          nueva: result.nueva,
          auditoriaId: id,
          apartadoId,
        });
      } else {
        Alert.alert("Error", "No se pudo añadir la nueva ruta.");
      }
    } catch (error) {
      console.error("Error al añadir nueva ruta:", error);
      Alert.alert("Error", "Ocurrió un error al añadir la ruta.");
    }
  };

  // Renderizar los apartados dentro de cada ruta
  const renderApartados = (apartados) => {
    return apartados.map((apartado) => (
      <>
        <View key={apartado.id} style={styles.card}>
          <Text style={styles.title}>{apartado.titulo}</Text>
          <RenderHtml
            contentWidth={width}
            source={{ html: apartado.observaciones }}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleAddNewRoute(apartado.id)}
          >
            <Text style={styles.buttonText}>Añadir Nueva Ruta</Text>
          </TouchableOpacity>
          {apartado.total_respuestas > 0 && (
            <TouchableOpacity
              style={styles.buttonVer}
              onPress={() => fetchListaRutas(apartado.id)} // Obtener y mostrar la lista de rutas
            >
              <Text style={styles.buttonText}>
                Ver Rutas ({apartado.total_respuestas})
              </Text>
            </TouchableOpacity>
          )}

          {/* Añadir Nueva Ruta */}
        </View>
        <View style={styles.horizontalLine} />
      </>
    ));
  };

  // Renderizar cada ruta
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.titulo}</Text>
      <RenderHtml contentWidth={width} source={{ html: item.observaciones }} />
      {renderApartados(item.apartados)}
    </View>
  );

  return (
    <SafeAreaView style={styles.area}>
      {renderHeader()}
      <View style={styles.horizontalLine} />

      <View style={styles.container}>
        {/* {auditoria && (
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{auditoria.titulo}</Text>
            <RenderHtml
              contentWidth={width}
              source={{ html: auditoria.observaciones }}
            />
          </View>
        )} */}
        <FlatList
          data={rutas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Lista de Rutas</Text>
              {listaRutas.length > 0 ? (
                <ScrollView style={styles.scrollView}>
                  {listaRutas.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.routeItem}
                      onPress={() => handleRouteClick(item.id)}
                    >
                      <Text style={styles.routeFecha}>
                        {item.fecha}:
                      </Text>
                      <Text style={styles.routeText}>
                        {item.texto}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ) : (
                <Text style={styles.noRoutesText}>
                  No hay rutas disponibles.
                </Text>
              )}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerDetails: {
    fontSize: 16,
    color: "#666",
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
    marginTop: 8,
  },
  buttonVer: {
    backgroundColor: COLORS.gray,
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    height: "70%", // Ajustar altura para permitir más espacio para el scroll
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  scrollView: {
    marginTop: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  routeItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  routeText: {
    fontSize: 16,
    color: "#333",
  },
  routeFecha: {
    fontSize: 14,
    fontWeight: "semibold",
    color: "#333",
  },
  noRoutesText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginVertical: 20,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
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
});

export default Auditoria;
