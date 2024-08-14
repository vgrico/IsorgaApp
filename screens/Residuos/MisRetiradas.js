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

const MisRetiradas = ({ navigation }) => {
  const [userId, setUserId] = useState(null);
  const [centroId, setCentroId] = useState([]);

  const [misRetiradas, setMisRetiradas] = useState(null);
  const [filteredRetiradas, setFilteredRetiradas] = useState([]);

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
      fetchMisRetiradas();
    }
  }, [userId, centroId]);

  const fetchMisRetiradas = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://isorga.com/api/misRetiradas.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          centroId: centroId,
        }),
      });
      const data = await response.json();
      setMisRetiradas(data);
      setFilteredRetiradas(data);
    } catch (error) {
      console.error("Error fetching serie data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = misRetiradas.filter(
      (item) =>
        item.residuo_nombre.toLowerCase().includes(text.toLowerCase()) ||
        item.gestion .toLowerCase().includes(text.toLowerCase())
    );
    setFilteredRetiradas(filtered);
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
        <Text style={styles.headerTitle}> Mis Retiradas</Text>
        <View style={{ flex: 1 }} />
        <Image
          source={require("../../assets/images/logoIsorga.png")}
          style={styles.logo}
        />
      </View>
    );
  };

  const renderModulo = ({ item }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>G-{item.codigo_gestion} {item.gestion} {item.gestion_nombre}</Text>
        {/* <Text style={styles.cardSubtitle}>{item.codigo_gestion}</Text> */}
        <Text style={styles.cardSubtitle}>Fecha: {item.fecha}</Text>
        <View style={styles.horizontalLine} />
      
        <Text style={styles.cardText}>Matricula: {item.matricula} {item.transportista_nombre}</Text>
        <Text style={styles.cardText}>Documento: {item.documento}</Text>
        <Text style={styles.cardText}>Cantidad: {item.cantidad}</Text>
        <View style={styles.horizontalLine} />
        <Text style={styles.cardSubText}>{item.usuarioNombre}</Text>
      </View>
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
        <FlatList
          data={filteredRetiradas}
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
    paddingHorizontal: 16,
  },
  table: {
    flex: 1,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: COLORS.secondaryWhite,
    borderRadius: 10,
    padding: 5,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 2,
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
    fontSize: 10,
    color: COLORS.black,
    marginBottom: 5,
  },
  cardSubText: {
    fontSize: 8,
    color: COLORS.black,
    marginBottom: 5,
  },
  cardEspecial: {
    fontSize: 14,
    padding: 5,
    borderRadius: 5,
    textAlign: "center",
    color: COLORS.white,
    backgroundColor: COLORS.lightGray, 
  },
  peligroso: {
    backgroundColor: COLORS.red, 
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

export default MisRetiradas;
