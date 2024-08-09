import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Alert,
    ScrollView,
    TouchableOpacity
} from 'react-native';

const InformeScreen = ({ navigation, route }) => {

    const { r = 99, id } = route.params; // Parametros de la navegación
    
    const [informe, setInforme] = useState('');
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
    const [centroNombre, setCentroNombre] = useState('');
    const [nUsuario, setNUsuario] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [titulos, setTitulos] = useState([]);
    const [preguntas, setPreguntas] = useState([]);


    useEffect(() => {
        // Aquí deberías hacer las llamadas a la API para obtener los datos que en PHP se obtenían con SQL
        fetch(`https://isorga.com/api/reportNuevo/${id}`)
            .then(response => response.json())
            .then(data => {
                setInforme(data.informe);
                setCentroNombre(data.centroNombre);
                setNUsuario(data.usuarioNombre);
                setTitulos(data.titulos);
                setPreguntas(data.preguntas);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, [id]);

    const handleSubmit = () => {
        // Lógica para enviar los datos a la API
        fetch('https://isorga.com/api/informe_envio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                informe,
                fecha,
                observaciones,
                respuestas: preguntas,
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Alert.alert('Éxito', 'El Informe se ha introducido con éxito!');
                    navigation.goBack();
                } else {
                    Alert.alert('Error', 'No estás autorizado para realizar este informe.');
                }
            })
            .catch(error => console.error('Error submitting data:', error));
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{id}</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>Volver</Text>
                </TouchableOpacity>
            </View>
            
            {r == 1 && <Text style={styles.successMessage}>El Informe se ha introducido con éxito!</Text>}
            {r == 0 && <Text style={styles.errorMessage}>No estás autorizado para realizar este informe.</Text>}
            
            <View style={styles.formRow}>
                <Text style={styles.label}>Fecha Informe</Text>
                <TextInput
                    style={styles.input}
                    value={fecha}
                    onChangeText={setFecha}
                    editable={false}
                />
            </View>
            <View style={styles.formRow}>
                <Text style={styles.label}>Centro</Text>
                <TextInput
                    style={styles.input}
                    value={centroNombre}
                    editable={false}
                />
            </View>
            <View style={styles.formRow}>
                <Text style={styles.label}>Número Usuario</Text>
                <TextInput
                    style={styles.input}
                    value={nUsuario}
                    editable={false}
                />
            </View>
            
            <View style={styles.formRow}>
                <Text style={styles.label}>Observaciones</Text>
                <TextInput
                    style={styles.textArea}
                    value={observaciones}
                    onChangeText={setObservaciones}
                    multiline
                />
            </View>

            {titulos.map((titulo, index) => (
                <View key={index} style={styles.section}>
                    <Text style={styles.sectionTitle}>{titulo.titulo}</Text>
                    {preguntas.map((pregunta, idx) => (
                        <View key={idx} style={styles.formRow}>
                            <Text>{pregunta.pregunta}</Text>
                            <View style={styles.radioGroup}>
                                <TouchableOpacity onPress={() => handleRadioChange(idx, 1)}>
                                    <Text>SI</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleRadioChange(idx, 0)}>
                                    <Text>NO</Text>
                                </TouchableOpacity>
                            </View>
                            {pregunta.observaciones && (
                                <Text style={styles.observaciones}>{pregunta.observaciones}</Text>
                            )}
                            {/* Campos adicionales dependiendo de las columnas */}
                        </View>
                    ))}
                </View>
            ))}

            <Button title="Enviar Informe" onPress={handleSubmit} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    backText: {
        color: 'blue',
        marginTop: 10,
    },
    formRow: {
        marginBottom: 15,
    },
    label: {
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        borderRadius: 4,
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        borderRadius: 4,
        height: 100,
    },
    radioGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    observaciones: {
        fontSize: 12,
        color: '#666',
    },
    successMessage: {
        color: 'green',
        marginBottom: 20,
    },
    errorMessage: {
        color: 'red',
        marginBottom: 20,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default InformeScreen;