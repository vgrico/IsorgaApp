import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
  Alert,
  Image
} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS, SIZES, icons } from "../../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NuevaRetirada = ({ navigation }) => {
  const [gestiones, setGestiones] = useState([]);
  const [selectedGestion, setSelectedGestion] = useState(null);
  const [selectedGestionNombre, setSelectedGestionNombre] = useState('');
  const [fecha, setFecha] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [documentos, setDocumentos] = useState('');
  const [matricula, setMatricula] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [userId, setUserId] = useState(null);
  const [centroId, setCentroId] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userIdFromStorage = await AsyncStorage.getItem('isorgaId');
        const centroIdFromStorage = await AsyncStorage.getItem('centroId');
        setUserId(userIdFromStorage);
        setCentroId(centroIdFromStorage);
      } catch (error) {
        console.error('Error loading data from AsyncStorage:', error);
      }
    };

    loadUserData();
  }, []);

  // Obtener las gestiones desde la API usando centroId
  useEffect(() => {
    const fetchGestiones = async () => {
      if (centroId) {
        try {
          const response = await fetch(`https://isorga.com/api/listadoGestiones.php?id=${centroId}`);
          const gestionesData = await response.json();
          setGestiones(gestionesData);
        } catch (error) {
          console.error("Error fetching gestiones:", error);
        }
      }
    };

    fetchGestiones();
  }, [centroId]);

  // Formatear la fecha en formato YYYY-MM-DD
  const formatFecha = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Función para manejar el cambio de fecha
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || fecha;
    setShowDatePicker(false);
    setFecha(currentDate);
  };

  // Función para seleccionar una gestión
  const seleccionarGestion = (id, nombre) => {
    setSelectedGestion(id);
    setSelectedGestionNombre(nombre);
  };

  // Función para enviar los datos del formulario
  const enviarDatos = async () => {
    if (!selectedGestion) {
      Alert.alert('Error', 'Debe seleccionar una gestión.');
      return;
    }

    const data = {
      gestionId: selectedGestion,
      fecha: formatFecha(fecha),
      documentos,
      matricula,
      cantidad,
      observaciones,
      usuario: userId,
      centro: centroId
    };

    // Mostrar los datos en la consola
    console.log('Datos enviados:', data);

    try {
      const response = await fetch('https://isorga.com/api/guardarRetirada.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        Alert.alert('Éxito', 'Los datos se han guardado correctamente');
      } else {
        Alert.alert('Éxito', 'Los datos se han guardado correctamente');
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
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
        <Text style={styles.headerTitle}>RETIRADA DE RESIDUOS</Text>
        <View style={{ flex: 1 }} />
        <Image
          source={require("../../assets/images/logoIsorga.png")}
          style={styles.logo}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.area}>
      {renderHeader()}
      <View style={styles.horizontalLine} />

      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Campo para seleccionar una gestión */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>1.- Seleccionar una Gestión</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {gestiones.map((gestion) => (
              <TouchableOpacity
                key={gestion.id}
                onPress={() => seleccionarGestion(gestion.id, gestion.nombre)}
                style={[
                  styles.gestionButton,
                  selectedGestion === gestion.id && styles.gestionButtonSelected,
                ]}
              >
                <Text style={styles.gestionButtonText}>{gestion.nombre}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {selectedGestionNombre && (
            <Text style={styles.selectedGestionText}>Gestión seleccionada: {selectedGestionNombre}</Text>
          )}
        </View>

        {/* Campo para seleccionar fecha */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>2.- Seleccionar Fecha</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
            <Text style={styles.dateText}>{formatFecha(fecha)}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={fecha}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}
        </View>

        {/* Campo para documentos */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>3.- Datos de la retirada (albaranes, ...)</Text>
          <TextInput
            style={styles.input}
            value={documentos}
            onChangeText={setDocumentos}
            placeholder="Escriba los documentos"
            placeholderTextColor={COLORS.gray}
          />
        </View>

        {/* Campo para matrícula */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>4.- Matrícula Vehículo</Text>
          <TextInput
            style={styles.input}
            value={matricula}
            onChangeText={setMatricula}
            placeholder="Escriba la matrícula"
            placeholderTextColor={COLORS.gray}
          />
        </View>

        {/* Campo para cantidad */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>5.- Cantidad Retirada</Text>
          <TextInput
            style={styles.input}
            value={cantidad}
            onChangeText={setCantidad}
            placeholder="Escriba la cantidad"
            placeholderTextColor={COLORS.gray}
            keyboardType="numeric"
          />
        </View>

        {/* Campo para observaciones */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>6.- Observaciones</Text>
          <TextInput
            style={styles.input}
            value={observaciones}
            onChangeText={setObservaciones}
            placeholder="Escriba las observaciones"
            placeholderTextColor={COLORS.gray}
            multiline={true}
            numberOfLines={4}
          />
        </View>

        {/* Botón para enviar los datos */}
        <TouchableOpacity style={styles.submitButton} onPress={enviarDatos}>
          <Text style={styles.submitButtonText}>GRABAR RETIRADA</Text>
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
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    marginBottom: 20,
  },
  backText: {
    color: COLORS.primary,
    fontSize: 16,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: COLORS.black,
    fontSize: SIZES.h3,
    fontWeight: "bold",
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 50,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  gestionButton: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  gestionButtonSelected: {
    backgroundColor: COLORS.primary,
  },
  gestionButtonText: {
    color: COLORS.black,
  },
  selectedGestionText: {
    marginTop: 10,
    fontSize: 14,
    color: COLORS.gray,
  },
  dateButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  dateText: {
    color: COLORS.white,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: COLORS.black,
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
  horizontalLine: {
    borderBottomColor: COLORS.black,
    borderBottomWidth: 1,
    marginVertical: 20,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },headerContainer: {
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
});

export default NuevaRetirada;
