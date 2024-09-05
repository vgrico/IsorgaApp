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

const Correctivas = ({ route, navigation }) => {
  const {id} = route.params;

  const [userId, setUserId] = useState(null);
  const [centroId, setCentroId] = useState(null);
  
  const [nc, setNC] = useState(null);


  const [correctivas, setCorrectivas] = useState([]);
  const [filteredCorrectivas, setFilteredCorrectivas] = useState([]);

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
      fetchCorrectivas();
    }
  }, [userId, centroId]);

  const fetchCorrectivas = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://isorga.com/api/correctivas.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
          }),
        }
      );
      const data = await response.json();
      console.log(data);
      console.log(centroId);
      setCorrectivas(data);
      setFilteredCorrectivas(data);
      if (data.length > 0) {
        setNC(data[0].numeroNC);
      }
    } catch (error) {
      console.error("Error fetching serie data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = listaNC.filter((item) =>
      item.numero.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredNC(filtered);
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
        <Text style={styles.headerTitle}>NC: {nc}</Text>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={() => navigation.navigate("Inicio")}>
          <Image
            source={require("../../assets/images/logoIsorga.png")}
            style={styles.logo}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderModulo = ({ item }) => {
    return (
<>
  <View style={styles.card}>

  <Text style={styles.cardTitle}>ACCIÓN CORRECTIVA</Text>
  <View style={styles.horizontalLine} />

  <View style={styles.row}>
        <Text style={styles.numeroNC}>ACC-{item.numero}</Text>
        <Text
          style={[
            styles.statusText,
            item.estado === "0"
              ? styles.closedStatus
              : item.estado === "1"
              ? styles.openStatus
              : styles.pendingStatus,
          ]}
        >
          {item.estado === "0"
            ? "CERRADA"
            : item.estado === "1"
            ? "ABIERTA"
            : "CERRADA PENDIENTE"}
        </Text>
</View>

        <View style={styles.horizontalLine} />

        <Text style={styles.value}>DESCRIPCIÓN</Text>
     
        <Text style={styles.titleText}>{item.accionBreve}</Text>
     
    <View style={styles.horizontalLine} />
        <Text style={styles.responsable}>{item.elresponsable}</Text>
      <Text style={styles.footerText}>F. APERTURA: {item.fechaApertura}</Text>
      <Text style={styles.footerText}>F. PREVISTA: {item.fechaPrevista}</Text>
      <Text style={styles.footerText}>F. CIERRE: {item.fechaCierre}</Text>
    </View>
</>
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

      {/* <TextInput
        placeholder="Buscar..."
        style={styles.searchBar}
        placeholderTextColor={COLORS.gray}
        value={search}
        onChangeText={handleSearch}
      /> */}
      <View>
        <FlatList
          data={correctivas}
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
  headerRow: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: COLORS.black,
    paddingBottom: 8,
    marginBottom: 16,
  },
  headerCell: {
    fontWeight: "bold",
    fontSize: 14,
    color: COLORS.black,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    paddingVertical: 8,
  },
  cell: {
    fontSize: 12,
    color: COLORS.black,
    // paddingHorizontal: 1,
  },
  codigoCell: {
    flex: 3, // 20%
  },
  tituloCell: {
    flex: 7, // 70%
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
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 8,
  },
  cell: {
    paddingHorizontal: 10,
  },
  codigoCell: {
    flex: 1, // Ancho de la columna
    textAlign: "left",
  },
  tituloContainer: {
    flex: 2, // Ancho de la columna, ajusta según necesidad
    justifyContent: "center",
  },
  tituloText: {
    fontSize: 14,
    color: "#333",
    textAlign: "left",
  },
  SubtituloText: {
    fontSize: 10,
    color: "#333",
    textAlign: "left",
  },
  estadoCell: {
    flex: 1, // Ancho de la columna
    textAlign: "right",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 8,
  },
  columnLeft: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  columnRight: {
    flex: 2,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  dateText: {
    fontSize: 14,
    color: "#333",
    textAlign: "left",
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "bold", // Negrita para el estado
    textAlign: "right",
  },
  openStatus: {
    color: "red", // Rojo para estado "Abierta"
  },
  closedStatus: {
    color: "green", // Verde para estado "Cerrada"
  },
  SubtitleText: {
    fontSize: 12,
    color: COLORS.grayscale700,
    textAlign: "left",
    marginBottom: 4,
  },
  numero: {
    fontSize: 10,
    color: COLORS.grayscale700,
    textAlign: "left",
    marginBottom: 4,
  },
  numeroNC: {
    fontSize: 16,
    color: "#333",
    textAlign: "left",
    fontWeight: 'bold',
    marginBottom: 4,
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
  cardTitle: {
    fontSize: 14,
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
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  column: {
    flex: 1,
    paddingRight: 10,
  },
  label: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#333",
  },
  value: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  titulo: {
    fontSize: 14,
    paddingVertical: 10,
    color: "#666",
    marginBottom: 4,
  },
  openStatus: {
    color: '#dc3545', // Rojo para abiertas
    fontWeight: "bold",
    borderWidth: 1,          // Ancho del borde
    borderColor: "#dc3545",    // Color del borde (puede ser diferente si lo prefieres)
    borderRadius: 5,         // Bordes redondeados (ajusta el valor según tu preferencia)
    padding: 5,
    textAlign: "center", 
  },
  closedStatus: {
    color: '#28a745', // Verde para cerradas
    fontWeight: "bold",
    borderWidth: 1,          // Ancho del borde
    borderColor: "#28a745",    // Color del borde (puede ser diferente si lo prefieres)
    borderRadius: 5,         // Bordes redondeados (ajusta el valor según tu preferencia)
    padding: 5,    
    textAlign: "center", 
  },
  pendingStatus: {
    color: '#ffa500', // Naranja para cerrada pendiente
    fontWeight: "bold",
    borderWidth: 1,          // Ancho del borde
    borderColor: "#ffa500",    // Color del borde (puede ser diferente si lo prefieres)
    borderRadius: 5,         // Bordes redondeados (ajusta el valor según tu preferencia)
    padding: 5,    
    textAlign: "center",
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  titleText: {
    fontSize: 14,
    fontWeight: 'semibold',
    color: '#333',
    marginBottom: 5,
  },
  subtitleContainer: {
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 14,
    color: '#666',
  },
  responsable: {
    fontSize: 12,
    fontWeight: 'semibold',
    color: '#333',
    marginTop: 6,
    marginBottom:8,
  },
  horizontalLine: {
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between", // Asegura que los elementos se distribuyan con espacio entre ellos
    alignItems: "center", // Alinea verticalmente los elementos en el centro
    marginBottom: 10,
  },

  numeroNC: {
    fontSize: 18,
    color: "#333",
    textAlign: "left",
    flex: 1, // Toma todo el espacio disponible a la izquierda
  },

  statusText: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "right", // Alinea el texto a la derecha
    flex: 1, // Toma todo el espacio disponible a la derecha
  },

  card: {
    backgroundColor: "#fff", // Fondo blanco para la tarjeta
    borderRadius: 5, // Bordes ligeramente redondeados
    borderWidth: 2, // Ancho del borde
    borderColor: "#ADD8E6", // Borde azul claro
    padding: 10, // Espaciado interno
    marginVertical: 10,
    marginHorizontal: 10, // Espaciado entre tarjetas y los bordes de la pantalla
    shadowColor: "transparent", // Elimina la sombra
  },
});

export default Correctivas;
