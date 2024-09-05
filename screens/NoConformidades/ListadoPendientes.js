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
import NoConformidad from "./NoConformidad";

const ListadoPendientes = ({ navigation }) => {
  const [userId, setUserId] = useState(null);
  const [centroId, setCentroId] = useState(null);

  const [listaNC, setListaNC] = useState([]);
  const [filteredNC, setFilteredNC] = useState([]);

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
      fetchListadoNC();
    }
  }, [userId, centroId]);

  const fetchListadoNC = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://isorga.com/api/listadoPendientes.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          centroId: centroId,
        }),
      });
      const data = await response.json();
      console.log(data);
      console.log(centroId);
      setListaNC(data);
      setFilteredNC(data);
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
        <Text style={styles.headerTitle}>NC PENDIENTES CIERRE</Text>
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
      <TouchableOpacity
        onPress={() => navigation.navigate("NoConformidad", { id: item.id })}
      >
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.numeroNC}>{item.numero} </Text>
            <Text
              style={[
                styles.statusText,
                item.qestado === "ABIERTA"
                  ? styles.openStatus
                  : styles.closedStatus,
              ]}
            >
              {item.qestado}
            </Text>
          </View>

          <Text style={styles.dateText}>{item.fecha}</Text>
          <View style={styles.horizontalLine} />

          <Text style={styles.titleText}>{item.titulo}</Text>
          <View style={styles.horizontalLine} />

          <View style={styles.subtitleContainer}>
            <Text style={styles.SubtitleText}>ORIGEN: {item.origenes}</Text>
            <Text style={styles.SubtitleText}>ÁMBITO: {item.ambitos}</Text>
          </View>
          <View style={styles.horizontalLine} />

          <Text style={styles.responsable}>{item.elresponsable}</Text>
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
        placeholder="Buscar..."
        style={styles.searchBar}
        placeholderTextColor={COLORS.gray}
        value={search}
        onChangeText={handleSearch}
      />
      <View>
        <FlatList
          data={filteredNC}
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
    textAlign: "left",
  },
  openStatus: {
    color: "red", // Rojo para estado "Abierta"
    borderWidth: 1, // Ancho del borde
    borderColor: "green", // Color del borde (puede ser diferente si lo prefieres)
    borderRadius: 5, // Bordes redondeados (ajusta el valor según tu preferencia)
    padding: 5, // Espacio entre el texto y el borde
    textAlign: "center",
  },
  closedStatus: {
    color: "green",
    fontWeight: "bold",
    borderWidth: 1, // Ancho del borde
    borderColor: "green", // Color del borde (puede ser diferente si lo prefieres)
    borderRadius: 5, // Bordes redondeados (ajusta el valor según tu preferencia)
    padding: 5, // Espacio entre el texto y el borde
    textAlign: "center",
  },
  titleText: {
    fontSize: 14,
    color: "#333",
    textAlign: "left",
    marginBottom: 4,
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
    fontSize: 18,
    color: "#333",
    textAlign: "left",
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
  row: {
    flexDirection: "row", // Alineación en fila
    justifyContent: "space-between", // Distribución entre el número y el estado
    alignItems: "center", // Alineación vertical centrada
  },
  numeroNC: {
    fontSize: 14, // Tamaño de fuente para el número
    fontWeight: "bold", // Negrita para el número
    color: "#333", // Color del texto
  },
  statusText: {
    fontSize: 12, // Tamaño de fuente para el estado
    fontWeight: "bold", // Negrita para el estado
    textAlign: "right", // Alineación a la derecha
  },
  openStatus: {
    color: "red", // Rojo si está abierto
    borderWidth: 1, // Ancho del borde
    borderColor: "green", // Color del borde (puede ser diferente si lo prefieres)
    borderRadius: 5, // Bordes redondeados (ajusta el valor según tu preferencia)
    padding: 5, // Espacio entre el texto y el borde
    textAlign: "center",
  },
  closedStatus: {
    color: "green", // Verde si está cerrado
    borderWidth: 1, // Ancho del borde
    borderColor: "green", // Color del borde (puede ser diferente si lo prefieres)
    borderRadius: 5, // Bordes redondeados (ajusta el valor según tu preferencia)
    padding: 5, // Espacio entre el texto y el borde
    textAlign: "center",
  },
  dateText: {
    fontSize: 12, // Tamaño de fuente para la fecha
    color: "#666", // Color gris para la fecha
    marginTop: 5, // Espaciado superior
  },
  titleText: {
    fontSize: 14, // Tamaño de fuente para el título
    fontWeight: "semibold", // Negrita para el título
    color: "#333", // Color del texto
    marginTop: 5, // Espaciado superior
  },
  subtitleContainer: {
    flexDirection: "column",  // Cambiar la dirección a columna para apilar verticalmente
    marginTop: 5,             // Espaciado superior para la separación del título
  },
  SubtitleText: {
    fontSize: 10,             // Tamaño de fuente para subtítulos
    color: "#666",            // Color gris para subtítulos
    marginBottom: 5,          // Espaciado inferior entre las líneas
  },
  responsable: {
    fontSize: 10, // Tamaño de fuente para el responsable
    color: "#666", // Color gris para el responsable
    marginTop: 5, // Espaciado superior
  },
  horizontalLine: {
    borderBottomColor: "#ADD8E6", // Línea horizontal azul claro
    borderBottomWidth: 1, // Ancho de la línea
    marginVertical: 5, // Espaciado vertical
  },
});

export default ListadoPendientes;
