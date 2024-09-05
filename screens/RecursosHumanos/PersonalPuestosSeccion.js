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

const PersonalPuestosSeccion = ({ route, navigation }) => {

    const {id} = route.params;

  const [userId, setUserId] = useState(null);
  const [centroId, setCentroId] = useState(null);

  const [datos, setDatos] = useState(null);
  const [filteredDatos, setFilteredDatos] = useState([]);
  const [seccionNombre, setSeccionNombre] = useState([]);

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
        fetchDatos();
    }
}, [userId, centroId])


  const fetchDatos = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://isorga.com/api/personalPuestosSeccion.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      });
      const data = await response.json();
      console.log(data);
      console.log(centroId);
      console.log(id);
      setDatos(data);
      setFilteredDatos(data);
      if (data.length > 0) {
        setSeccionNombre(data[0].seccion);
      }
    } catch (error) {
      console.error("Error fetching serie data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = datos.filter((item) =>
      item.seccion.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredDatos(filtered);
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
        <Text style={styles.headerTitle}>{seccionNombre}</Text>
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
        onPress={() =>
          navigation.navigate("DocumentosPuesto", {
            id: item.idPuesto,
            nombre: item.puesto,
          })
        }
      >
        <View style={styles.row}>
          <Text style={[styles.cell, styles.nombreCell]}>{item.codigo}</Text>
          <Text style={[styles.cell, styles.tituloCell]}>{item.puesto}</Text>
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
          <Text style={[styles.headerCell, styles.nombreCell]}> Cód.</Text>
          <Text style={[styles.headerCell, styles.tituloCell]}> Nombre Puesto</Text>
        </View>
        <FlatList
          data={filteredDatos}
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
    textTransform: "uppercase", 
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
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    fontSize: 16,
    color: '#333',
  },
  nombreCell: {
    flex: 2, 
    textAlign: 'left',
    fontSize: 12,

  },
  produccionCell: {
    flex: 2,
    textAlign: 'right',
    fontSize: 12,

  },
  tituloCell: {
    flex: 6, 
    fontSize: 12,
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

export default PersonalPuestosSeccion;
