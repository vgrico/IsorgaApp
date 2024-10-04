import React, { useState, useEffect } from "react";
import { Calendar } from "react-native-calendars";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, TouchableWithoutFeedback } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS, SIZES, icons } from "../../constants";

const CalendarioEquipos = ({ navigation }) => {
  const [userId, setUserId] = useState(null);
  const [centroId, setCentroId] = useState(null);
  const [eventos, setEventos] = useState({});
  const [selectedEvento, setSelectedEvento] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const loadUserId = async () => {
        try {
          const userIdFromStorage = await AsyncStorage.getItem("isorgaId");
          const centroIdFromStorage = await AsyncStorage.getItem("centroId");
          setUserId(userIdFromStorage);
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
    if (centroId) {
      fetchEventos();
    }
  }, [centroId]);

  const fetchEventos = async () => {
    try {
      const response = await fetch(
        `https://isorga.com/api/equipos/listadoEventosCalendario.php?id=${centroId}`
      );
      const data = await response.json();
      console.log(data);
      
      const eventosFormatted = {};
      data.forEach((evento) => {
        eventosFormatted[evento.fecha] = {
          customStyles: {
            container: {
              backgroundColor: evento.color,
            },
            text: {
              color: evento.textColor,
            },
          },
          onPress: () => {
            setSelectedEvento({
              title: evento.title,
              revision: evento.revision,
              periodicidad: evento.periodicidad,
              observaciones: evento.observaciones,
            });
            setModalVisible(true);
          },
        };
      });
      
      setEventos(eventosFormatted);
    } catch (error) {
      console.error("Error fetching eventos:", error);
    }
  };

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={icons.arrowBack} resizeMode="contain" style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CALENDARIO REVISIONES</Text>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={() => navigation.navigate("Inicio")}>
          <Image source={require("../../assets/images/logoIsorga.png")} style={styles.logo} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.area}>
      {renderHeader()}
      <View style={styles.container}>
        <Calendar
          markingType={"custom"}
          markedDates={eventos}
          onDayPress={(day) => {
            if (eventos[day.dateString]?.onPress) {
              eventos[day.dateString].onPress();
            }
          }}
        />
      </View>

      {/* Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              {selectedEvento && (
                <>
                  <Text style={styles.modalTitle}>{selectedEvento.title}</Text>
                  <View style={styles.separator} />
                  <Text style={styles.modalText}>Revisión: {selectedEvento.revision}</Text>
                  <Text style={styles.modalText}>Periodicidad: {selectedEvento.periodicidad}</Text>
                  <Text style={styles.modalText}>Observaciones: {selectedEvento.observaciones}</Text>
                </>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  backIcon: {
    height: 24,
    width: 24,
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
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
  },
});

export default CalendarioEquipos;
