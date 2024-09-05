import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, icons, SIZES } from "../../constants";

const ListaRequisitos = ({ route, navigation }) => {
    const {grupoId} = route.params;
    const {grupoTitulo} = route.params;
    const {grupoIcono} = route.params;
    console.log(grupoIcono)

  const [userId, setUserId] = useState(null);
  const [centroId, setCentroId] = useState([]);

  const [misGestiones, setMisGestiones] = useState(null);
  const [filteredGestiones, setFilteredGestiones] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userIdFromStorage = await AsyncStorage.getItem("isorgaId");
        setUserId(userIdFromStorage);

        const centroIdFromStorage = await AsyncStorage.getItem("centroId");
        setCentroId(centroIdFromStorage);
      } catch (error) {
        console.error("Error loading data from AsyncStorage:", error);
      }
    };
    loadUserData();
  }, []);

  useEffect(() => {
    if (userId && centroId) {
      fetchMisGestiones();
    }
  }, [userId, centroId]);

  const fetchMisGestiones = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://isorga.com/api/listaRequisitos.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          centroId: centroId,
          grupoId: grupoId,
        }),
      });

      const data = await response.json();
      console.log('LOS DATOS SON:', data);
      setMisGestiones(data);
      setFilteredGestiones(data);

    } catch (error) {
      console.error("Error fetching serie data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = misGestiones.filter((item) => {
      const legTitulo = item.legTitulo ? item.legTitulo.toLowerCase() : "";
      const reqTexto = item.reqTexto ? item.reqTexto.toLowerCase() : "";
      const reqInterno = (item.reqInterno || "").toString().toLowerCase();
  
      return legTitulo.includes(text.toLowerCase()) || reqTexto.includes(text.toLowerCase()) || reqInterno.includes(text.toLowerCase());
    });
    setFilteredGestiones(filtered);
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
        <Text style={styles.headerTitle}> {grupoTitulo}</Text>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={() => navigation.navigate("Inicio")}>
          <Image
            // source={require("../../assets/images/logoIsorga.png")}
            source={{
                uri: `https://isorga.com/app/images/gcat/${grupoIcono}.png`,
            }}
            style={styles.logo}
          />
        </TouchableOpacity>
      </View>
    );
  };


// Función para truncar el texto a 30 palabras
const truncateText = (text, wordLimit) => {
    const words = text.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
  };
  
  const renderModulo = ({ item }) => {
    
    const truncatedReqTexto = truncateText(item.reqTexto, 30);
  
    return (
      <TouchableOpacity
      style={styles.moduloContainer}
      onPress={() =>
        navigation.navigate("FichaRequisito", {
          id: item.reqInterno,
        })
      }
    >
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.reqInterno} {item.condTexto}</Text>
        <View style={styles.horizontalLine} />
        <Text style={styles.cardSubtitle}> {truncatedReqTexto}</Text>
        <View style={styles.horizontalLine} />
        <Text style={styles.cardText}> {item.reqobserv}</Text>
        <View style={styles.horizontalLine} />
        <Text style={styles.cardText}>{item.legTitulo}</Text>
      </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.area}>
      {renderHeader()}
      <View style={styles.horizontalLine} />

      <TextInput
        placeholder="Buscar por Legislacion..."
        style={styles.searchBar}
        placeholderTextColor={COLORS.gray}
        value={search}
        onChangeText={handleSearch}
      />
      <View style={styles.table}>
        <FlatList
          data={filteredGestiones}
          // data={documentosBox}
          renderItem={renderModulo}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.flatListContent}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  backIcon: {
    height: 18,
    width: 18,
    tintColor: COLORS.black,
  },
  headerTitle: {
    color: COLORS.black,
    fontSize: SIZES.h3,
    fontWeight: "bold",
    marginLeft: 20,
  },
  searchBar: {
    margin: 16,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    backgroundColor: COLORS.secondaryWhite,
  },
  flatListContent: {
    paddingHorizontal: 1,
  },
  table: {
    flex: 1,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#fff", // Fondo blanco para la tarjeta
    borderRadius: 5, // Bordes ligeramente redondeados
    borderWidth: 2, // Ancho del borde
    borderColor: "#ADD8E6", // Borde azul claro (puedes ajustar el color)
    padding: 10, // Espaciado interno
    marginVertical: 10,
    marginHorizontal: 10, // Espaciado entre tarjetas
  },
  row: {
    flexDirection: "row", // Alineación en fila
    justifyContent: "space-between", // Distribución entre el número y el estado
    alignItems: "center", // Alineación vertical centrada
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.darkGray,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 12,
    color: COLORS.black,
    marginBottom: 5,
  },
  cardEspecial: {
    fontSize: 14,
    padding: 5,
    borderRadius: 5,
    textAlign: "center",
    color: COLORS.white,
    backgroundColor: COLORS.lightGray, // Fondo por defecto
  },
  peligroso: {
    backgroundColor: COLORS.red, // Cambia el fondo a rojo si es peligroso
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
});

export default ListaRequisitos;
