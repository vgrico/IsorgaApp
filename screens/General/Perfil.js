import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
  fontFamily,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-virtualized-view";

import { COLORS, SIZES, icons } from "../../constants";
import { useFocusEffect } from "@react-navigation/native";

const Perfil = ({ navigation }) => {

  const [userId, setUserId] = useState(null);
  const [centroId, setCentroId] = useState(null);
  const [today, setToday] = useState("");
  const [datosUsuario, setDatosUsuario] = useState([]);
  const [datosCentro, setDatosCentro] = useState([]);

  useEffect(() => {
    const loadUserAndCentroId = async () => {
      try {
        const [userIdFromStorage, centroIdFromStorage] = await Promise.all([
          AsyncStorage.getItem("isorgaId"),
          AsyncStorage.getItem("centroId"),
        ]);
  
        setUserId(userIdFromStorage);
        setCentroId(centroIdFromStorage);
  
        if (userIdFromStorage && centroIdFromStorage) {
          await fetchDatosUsuario(userIdFromStorage);
          await fetchDatosCentro(centroIdFromStorage);
        }
      } catch (error) {
        console.error("Error loading data from AsyncStorage:", error);
      }
    };
  
    loadUserAndCentroId();
  }, []);

  useFocusEffect(
    React.useCallback(()=>{
      if (userId && centroId) {
        fetchDatosUsuario(userId);
        fetchDatosCentro(centroId);
      }

    },[userId, centroId])
  )

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setToday(formattedDate);
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("isorgaId");
      await AsyncStorage.removeItem("centroId");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const fetchDatosUsuario = async () => {
    try {
      const response = await fetch("https://isorga.com/api/DatosUsuario.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
        }),
      });
      const data = await response.json();
      console.log(data);
      setDatosUsuario(data);
    } catch (error) {
      console.error("Error fetching modulos:", error);
    }
  };

  const fetchDatosCentro = async () => {
    try {
      const response = await fetch("https://isorga.com/api/DatosCentro.php", {
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
      setDatosCentro(data);
    } catch (error) {
      console.error("Error fetching modulos:", error);
    }
  };

  // const renderFoto = () => {
  //   return (
  //     <View style={styles.container}>
  //       <Image
  //         source={{
  //           uri: `https://isorga.com/assets/images/foto/${datosUsuario.imagen}`,
  //         }}
  //         style={styles.logo}
  //       />
  //     </View>
  //   );
  // };

  const renderFoto = () => {
    const imagenUsuario = datosUsuario?.imagen
      ? { uri: `https://isorga.com/app/images/foto/${datosUsuario.imagen}` }
      : require('../../assets/images/user_2.png'); 
  
    return (
      <View style={styles.container}>
        <Image
          source={imagenUsuario}
          style={styles.logo}
        />
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        {renderFoto()}
        <Text style={styles.headerTitle}>{datosUsuario.nombre}</Text>
      </View>
    );
  };

  const renderUsuario = () => (
    <View style={styles.usuarioContainer}>
      <View style={styles.usuarioInfo}>

        <View style={styles.usuarioDatoContainer}>
          <Text style={styles.usuarioSubTitulo}>CORREO: </Text>
          <Text style={styles.usuarioDato}>{datosUsuario.mail}</Text>
        </View>
        <View style={styles.usuarioDatoContainer}>
          <Text style={styles.usuarioSubTitulo}>NÚMERO USUARIO: </Text>
          <Text style={styles.usuarioDato}>{userId}</Text>
        </View>
        <View style={styles.usuarioDatoContainer}>
          <Text style={styles.usuarioSubTitulo}>FECHA ALTA: </Text>
          <Text style={styles.usuarioDato}>{datosUsuario.alta}</Text>
        </View>
        <View style={styles.usuarioDatoContainer}>
          <Text style={styles.usuarioSubTitulo}>ÚLTIMO ACCESO: </Text>
          <Text style={styles.usuarioDato}>{datosUsuario.acceso}</Text>
        </View>
        <View style={styles.horizontalLine} />
        <View style={styles.usuarioDatoContainer}>
          <Text style={styles.usuarioSubTitulo}>CENTRO ACTUAL: </Text>
          <Text style={styles.usuarioDato}>{datosCentro.nombre}</Text>
        </View>
        <View style={styles.usuarioDatoContainer}>
          <Text style={styles.usuarioSubTitulo}>DIRECCIÓN: </Text>
          <Text style={styles.usuarioDato}>{datosCentro.direccion}</Text>
        </View>
        <View style={styles.usuarioDatoContainer}>
          <Text style={styles.usuarioSubTitulo}>TELÉFONO: </Text>
          <Text style={styles.usuarioDato}>{datosCentro.telefono}</Text>
        </View>
        <View style={styles.usuarioDatoContainer}>
          <Text style={styles.usuarioSubTitulo}>CÓDIGO POSTAL: </Text>
          <Text style={styles.usuarioDato}>{datosCentro.codigo}</Text>
        </View>
        <View style={styles.usuarioDatoContainer}>
          <Text style={styles.usuarioSubTitulo}>OBSERVACIONES: </Text>
          <Text style={styles.usuarioDato}>{datosCentro.observaciones}</Text>
        </View>
        <View style={styles.horizontalLine} />
      </View>
    </View>
  );

  const renderSettings = () => {
    return (

    <View style={styles.settingsContainer}>
      <TouchableOpacity
        style={styles.settingsItemContainer}
        onPress={() => navigation.navigate("Centros", { pantalla: 1 })}
      >
        <Image source={icons.home} style={styles.settingsIcon} />
        <Text style={styles.settingsName}>Cambiar Centro</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutContainer}>
        <Image source={icons.logout} style={styles.logoutIcon} />
        <Text style={styles.logoutName}>Salir y Desconectar</Text>
      </TouchableOpacity>
    </View>
    );
  };

  return (
    <SafeAreaView style={styles.area}>
      {renderHeader()}
      <View style={styles.horizontalLine} />
      {renderUsuario()}
      <View style={styles.horizontalLineaGruesa} />
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderSettings()}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
    marginBottom: 32,
  },
  header: {
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: SIZES.h2,
    fontFamily: "bold",
    marginLeft: 16,
  },
  headerIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.greyscale900,
  },
  arrowBackIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black,
  },
  bellIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileContainer: {
    alignItems: "center",
    borderBottomColor: COLORS.grayscale400,
    borderBottomWidth: 0.4,
    paddingVertical: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 999,
  },
  picContainer: {
    width: 20,
    height: 20,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    position: "absolute",
    right: 0,
    bottom: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.greyscale900,
    marginTop: 12,
  },
  usuarioContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  usuarioInfo: {
    marginLeft: 16,
  },
  usuarioTitulo: {
    fontSize: 18,
    fontFamily: "semibold",
    color: COLORS.greyscale900,
    marginTop: 12,
  },
  usuarioDato: {
    fontSize: 12,
    fontFamily: "regular",
    color: COLORS.greyscale900,
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.greyscale900,
    fontFamily: "medium",
    marginTop: 4,
  },
  settingsContainer: {
    marginVertical: 12,
  },
  settingsItemContainer: {
    width: SIZES.width - 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
    fontFamily: "Urbanistic-Italic",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingsIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.greyscale900,
  },
  settingsName: {
    fontSize: 18,
    fontFamily: "semiBold",
    color: COLORS.greyscale900,
    marginLeft: 12,
  },
  settingsArrowRight: {
    width: 24,
    height: 24,
    tintColor: COLORS.greyscale900,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightLanguage: {
    fontSize: 18,
    fontFamily: "semiBold",
    color: COLORS.greyscale900,
    marginRight: 8,
  },
  switch: {
    marginLeft: 8,
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }], // Adjust the size of the switch
  },
  logoutContainer: {
    width: SIZES.width - 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  logoutLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.greyscale900,
  },
  logoutName: {
    fontSize: 18,
    fontFamily: "semiBold",
    color: COLORS.greyscale900,
    marginLeft: 12,
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
    paddingHorizontal: 16,
  },
  cancelButton: {
    width: (SIZES.width - 32) / 2 - 8,
    backgroundColor: COLORS.tansparentPrimary,
    borderRadius: 32,
  },
  logoutButton: {
    width: (SIZES.width - 32) / 2 - 8,
    backgroundColor: COLORS.primary,
    borderRadius: 32,
  },
  bottomTitle: {
    fontSize: 24,
    fontFamily: "semiBold",
    color: "red",
    textAlign: "center",
    marginTop: 12,
  },
  bottomSubtitle: {
    fontSize: 20,
    fontFamily: "semiBold",
    color: COLORS.greyscale900,
    textAlign: "center",
    marginVertical: 28,
  },
  separateLine: {
    width: SIZES.width,
    height: 1,
    backgroundColor: COLORS.grayscale200,
    marginTop: 10,
  },
  horizontalLine: {
    borderBottomColor: COLORS.black,
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  horizontalLineaGruesa: {
    borderBottomColor: COLORS.grayscale200,
    borderBottomWidth: 3,
    marginVertical: 10,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: "contain",
    borderRadius: 50,
  },
  moduloLogo: {
    width: 50,
    height: 50,
    marginBottom: 15,
    resizeMode: "contain",
  },
  usuarioDatoContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  usuarioTitulo: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  usuarioSubTitulo: {
    fontWeight: "semibold",
    fontSize: 10,
    color: "#333",
  },
  usuarioDato: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#666",
  },
  settingsContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  settingsItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  settingsIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.white,
    marginRight: 15,
  },
  settingsName: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.white,
  },
  logoutContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  logoutIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.white,
    marginRight: 15,
  },
  logoutName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.white,
  },
});

export default Perfil;
