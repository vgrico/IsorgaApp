import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  StatusBar
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES } from "../../constants";
import Task from "../../components/isorga/Task";


const Todo = ({ route, navigation }) => {
    
  const [userId, setUserId] = useState(null);
  const [centroId, setCentroId] = useState(null);

  const [todos, setTodos] = useState(null);
  const [loading, setLoading] = useState(true);

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
  }, [route.params]);


  useEffect(() => {
    if (userId && centroId) {
      console.log("User ID:", userId);
      console.log("Centro ID:", centroId);
      fetchTodos();
    }
  }, [userId, centroId]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://isorga.com/api/listadoTodos.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
          }),
        }
      );
      const data = await response.json();
      console.log(userId)
      console.log(data);
      setTodos(data);
    } catch (error) {
      console.error("Error fetching modulos:", error);
    } finally {
      setLoading(false);
    }
  };

  function clearTodo(id) {
    setStatusBarNetworkActivityIndicatorVisible(
      todos.filter((todo) => todo.id !== id)
    );
  }

  function toggleTodo(id) {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, status: todo.status === "completed" ? "" : "completed" }
          : todo
      )
    );
  }

  const renderHeader = () => (
    <View style={styles.headerContainer}>
        <Image
        source={require("../../assets/images/logoIsorga.png")}
        style={styles.logo}
      />
      <Text style={styles.headerTitle}>LISTA TAREAS</Text>
    </View>
  );


  const renderModulo = ({ item, index }) => {
    return (
      <TouchableOpacity
      onPress={() => navigation.navigate('Documento', { id: item.id })}
  >
    <Task {...item}  toggleTodo={toggleTodo} clearTodo={clearTodo}/>
      {/* <View style={styles.row}>
          <Text style={[styles.cell, styles.codigoCell]}>{item.title}</Text>
          <Text style={[styles.cell, styles.codigoCell]}>{JSON.stringify(todos, null, 2)}</Text>
          <Text style={[styles.cell, styles.codigoCell]}>{item.status}</Text>
      </View> */}
  </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.text} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.area}>
      {renderHeader()}
      <View style={styles.horizontalLine} />
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderModulo}
        ListHeaderComponentStyle = {() => <Text style={styles.title}>Hoy</Text>}
        contentContainerStyle={styles.flatListContent}
      />
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
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: SIZES.h2,
    fontWeight: "bold",
    marginLeft: 16,
  },
  backIcon: {
    height: 24,
    width: 24,
  },
  moduloContainer: {
    flex: 1,
    margin: 3,
    borderRadius: 15,
    overflow: 'hidden', // Asegura que la imagen no sobresalga del contenedor
    minWidth: '45%',
    minHeight: 120,
    // justifyContent: 'center',
    // alignItems: 'center',
    // position: 'relative',
  },
  moduloImagen: {
    width: '100%',    // La imagen ocupa todo el ancho de la tarjeta
    height: '100%',   // La imagen ocupa todo el alto de la tarjeta
    position: 'cover', // Posiciona la imagen para que se ajuste al contenedor
  },
  
  header: {
    padding: 16,
  },
  centroNombre: {
    fontSize: 20,
    paddingHorizontal: 50,
    fontWeight: "bold",
  },
  centroModulos: {
    fontSize: 15,
    fontWeight: "bold",
  },
  flatListContent: {
    paddingHorizontal: 16,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 5,
  },

  moduloTexto: {
    fontSize: 14,
    textAlign: "center",
  },
  horizontalLine: {
    borderBottomColor: COLORS.black,
    borderBottomWidth: 1,
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
  moduloImagen: {
    width: "100%",
    height: "100%",
    resizeMode: "cover", // La imagen cubre toda la tarjeta
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },
  moduloLogo: {
    width: 50,
    height: 50,
    marginBottom: 15,
    resizeMode: "contain",
  },
});

export default Todo;
