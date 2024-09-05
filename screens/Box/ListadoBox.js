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

const ListadoBox = ({ route, navigation }) => {
  const { id } = route.params;

  const [userId, setUserId] = useState(null);
  const [documentosBox, setDocumentosBox] = useState([]);
  const [carpetaTitulo, setCarpetaTitulo] = useState(null);

  const [filteredDocumentos, setFilteredDocumentos] = useState([]);

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
    if (userId && id) {
      fetchCarpetaBox();
    }
  }, [userId, id]);

  const fetchCarpetaBox = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `https://isorga.com/api/DocumentosCarpetaBox.php?id=${id}`
      );
      const data = await response.json();
      setDocumentosBox(data);
      setFilteredDocumentos(data);

      console.log(data);
      if (data.length > 0) {
        setCarpetaTitulo(data[0].carpetaTitulo);
      }
    } catch (error) {
      console.error("Error fetching serie data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = documentosBox.filter((item) =>
      item.titulo.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredDocumentos(filtered);
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
        <Text style={styles.headerTitle}> {carpetaTitulo}</Text>
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
        onPress={() => navigation.navigate("DocumentoBox", { id: item.id })}
      >
        <View style={styles.row}>
          <Text style={[styles.cell, styles.codigoCell]}>{item.fecha}</Text>
          <Text style={[styles.cell, styles.tituloCell]}>{item.titulo}</Text>
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
      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={[styles.headerCell, styles.codigoCell]}> Fecha</Text>
          <Text style={[styles.headerCell, styles.tituloCell]}> Título</Text>
        </View>
        <FlatList
          data={filteredDocumentos}
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
    textTransform: "uppercase", // Esta propiedad convierte el texto a mayúsculas
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
});

export default ListadoBox;
