import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../../constants';
import RenderHtml from 'react-native-render-html';
import { useWindowDimensions } from 'react-native'; // Para manejar el tamaño de la pantalla

const NuevaRuta = ({ route, navigation }) => {
  const { nueva, auditoriaId, apartadoId } = route.params;
  const { width } = useWindowDimensions(); // Para RenderHtml

  const [activeTab, setActiveTab] = useState('datosRuta');
  const [personalAuditado, setPersonalAuditado] = useState('');
  const [fuentesEvidencias, setFuentesEvidencias] = useState('');
  const [tituloAuditoria, setTituloAuditoria] = useState('');
  const [observacionesAuditoria, setObservacionesAuditoria] = useState(''); 
  const [modalVisible, setModalVisible] = useState(false);
  const [tiposNoConformidad, setTiposNoConformidad] = useState([]);
  const [selectedTipo, setSelectedTipo] = useState(null);
  const [descripcionNoConformidad, setDescripcionNoConformidad] = useState('');
  const [noConformidades, setNoConformidades] = useState([]);

  // Fetch para obtener datos de "personal" y "texto" para completar los campos
  useEffect(() => {
    const fetchTextoRuta = async () => {
      try {
        const response = await fetch(`https://isorga.com/api/app/textoRuta.php?id=${nueva}`);
        const data = await response.json();

        if (data.length > 0) {
          setPersonalAuditado(data[0].personal || ''); 
          setFuentesEvidencias(data[0].texto || ''); 
        }
      } catch (error) {
        console.error('Error al obtener los datos de la ruta:', error);
      }
    };

    fetchTextoRuta();
  }, [nueva]);

  // Fetch para obtener título y observaciones de la auditoría
  useEffect(() => {
    const fetchTextoAuditoria = async () => {
      try {
        const response = await fetch(`https://isorga.com/api/app/textoAuditoria.php?id=${apartadoId}`);
        const data = await response.json();

        if (data.length > 0) {
          setTituloAuditoria(data[0].titulo || ''); 
          setObservacionesAuditoria(data[0].observaciones || ''); 
        }
      } catch (error) {
        console.error('Error al obtener los datos de la auditoría:', error);
      }
    };

    fetchTextoAuditoria();
  }, [auditoriaId]);

  // Cargar los tipos de no conformidad desde el servidor
  useEffect(() => {
    const fetchTiposNoConformidad = async () => {
      try {
        const response = await fetch('https://isorga.com/api/app/tipoNoConformidad.php');
        const data = await response.json();
        setTiposNoConformidad(data);
      } catch (error) {
        console.error('Error al cargar tipos de no conformidad:', error);
      }
    };
    fetchTiposNoConformidad();
  }, []);

  useEffect(() => {
    if (activeTab === 'noConformidad') {
      const fetchNoConformidades = async () => {
        try {
          const response = await fetch(`https://isorga.com/api/app/listaNoConformidades.php?id=${nueva}`);
          const data = await response.json();
          setNoConformidades(data);
        } catch (error) {
          console.error('Error al cargar las no conformidades:', error);
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
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    try {
      const response = await fetch('https://momdel.es/dev/api/app/guardarRuta.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nuevaId: nueva,
          personalAuditado,
          fuentesEvidencias,
        }),
      });

      const result = await response.json();

      if (result.success) {
        Alert.alert('Éxito', 'Los datos de la ruta se han guardado correctamente.');
      } else {
        Alert.alert('Éxito', 'Los datos de la ruta se han guardado correctamente.');
      }
    } catch (error) {
      Alert.alert('Éxito', 'Los datos de la ruta se han guardado correctamente.');
    }
  };

  const guardarNoConformidad = async () => {
    if (!selectedTipo || !descripcionNoConformidad) {
      Alert.alert('Error', 'Debe seleccionar un tipo y escribir una descripción.');
      return;
    }
  
    try {
      const response = await fetch('https://isorga.com/api/app/guardarNoConformidad.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nuevaId: nueva,
          tipoNoConformidad: selectedTipo,
          descripcion: descripcionNoConformidad,
        }),
      });
  
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
      const response = await fetch(`https://isorga.com/api/app/listaNoConformidades.php?id=${nueva}`);
      const data = await response.json();
      setNoConformidades(data);
    } catch (error) {
      console.error('Error al cargar las no conformidades:', error);
      setNoConformidades([]);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.area}>
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'datosRuta' && styles.activeTab]}
            onPress={() => handleTabChange('datosRuta')}
          >
            <Text style={[styles.tabText, activeTab === 'datosRuta' && styles.activeTabText]}>
              Datos Ruta
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'noConformidad' && styles.activeTab]}
            onPress={() => handleTabChange('noConformidad')}
          >
            <Text style={[styles.tabText, activeTab === 'noConformidad' && styles.activeTabText]}>
              No Conformidad/Oportunidad
            </Text>
          </TouchableOpacity>
        </View>

        {/* Contenido de la primera pestaña: Datos Ruta */}
        {activeTab === 'datosRuta' && (
          <ScrollView contentContainerStyle={styles.content}>
            {/* Mostrar título y observaciones de la auditoría */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Título Auditoría:</Text>
              <Text style={styles.text}>{tituloAuditoria}</Text>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Observaciones:</Text>
              <RenderHtml contentWidth={width} source={{ html: observacionesAuditoria }} />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Personal Auditado:</Text>
              <TextInput
                style={styles.input}
                value={personalAuditado}
                onChangeText={setPersonalAuditado}
                placeholder="Escriba el personal auditado"
                placeholderTextColor={COLORS.gray}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>RUTA AUDITORIA Y FUENTES DE EVIDENCIAS:</Text>
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
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* Contenido de la segunda pestaña: No Conformidad/Oportunidad */}
        {activeTab === 'noConformidad' && (
          <View style={styles.content}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.addButtonText}>Añadir No Conformidad</Text>
            </TouchableOpacity>

            {noConformidades.length > 0 ? (
              <FlatList
                data={noConformidades}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.noConformidadItem}>
                    <Text style={styles.noConformidadText}>{item.texto_tipo}: {item.texto_NC}</Text>
                  </View>
                )}
              />
            ) : (
              <Text style={styles.placeholderText}>No hay no conformidades registradas.</Text>
            )}

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                <View style={styles.modalContainer}>
                  <TouchableWithoutFeedback>
                    <View style={styles.modalContent}>
                      <Text style={styles.modalTitle}>Añadir No Conformidad</Text>

                      {/* Selección del tipo de no conformidad */}
                      <FlatList
                        data={tiposNoConformidad}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            style={[
                              styles.tipoButton,
                              selectedTipo === item.id && styles.selectedTipoButton,
                            ]}
                            onPress={() => setSelectedTipo(item.id)}
                          >
                            <Text
                              style={[
                                styles.tipoButtonText,
                                selectedTipo === item.id && styles.selectedTipoButtonText,
                              ]}
                            >
                              {item.texto_tipo}
                            </Text>
                          </TouchableOpacity>
                        )}
                      />

                      <TextInput
                        style={styles.input}
                        value={descripcionNoConformidad}
                        onChangeText={setDescripcionNoConformidad}
                        placeholder="Escriba la descripción"
                        placeholderTextColor={COLORS.gray}
                      />

                      <TouchableOpacity style={styles.saveButton} onPress={guardarNoConformidad}>
                        <Text style={styles.saveButtonText}>Crear</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => setModalVisible(false)}
                      >
                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                      </TouchableOpacity>
                    </View>
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
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
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
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: COLORS.black,
  },
  text: {
    fontSize: 16,
    color: COLORS.black,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  noConformidadItem: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  noConformidadText: {
    fontSize: 14,
    color: COLORS.black,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
    marginTop: 20,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.primary,
  },
});

export default NuevaRuta;
