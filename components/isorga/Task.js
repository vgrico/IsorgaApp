import { setStatusBarNetworkActivityIndicatorVisible } from "expo-status-bar";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import {Feather} from "@expo/vector-icons";

function CheckMark({ id, status, toggleTodo }) {
  async function toggle() {
    const response = await fetch(`https://isorga.com/api/completarTodo/${id}`, {
      method: "POST",
      body: JSON.stringify({
        value: status ? "" : "completed",
      }),
    });
    const data = await response.json();
    toggleTodo(id);
    console.log(data);
  }
  return (
    <Pressable
      onPress={toggle}
      style={[
        styles.checkMark,
        { backgroundColor: status === "" ? "#E9E9EF" : "#0EA569" },
      ]}
    ></Pressable>
  );
}

const Task = ({ id, title, status, descripcion, toggleTodo, clearTodo }) => {
  const [isDeleteActive, setIsDeleteActive] = useState(false); 

  async function deleteTodo() {
    const response = await fetch(`https://isorga.com/borrarTodo/${id}`, {
      method: "POST",
    });
    clearTodo(id);
    console.log(response.status);
  }

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

  return (
    <TouchableOpacity
      onLongPress={() => setIsDeleteActive(true)}
      onPress={() => setIsDeleteActive(false)}
      activeOpacity={0.8}
      style={[styles.container]}
    >
      <View style={styles.taskContainer}>
        <CheckMark id={id} status={status} toggleTodo={toggleTodo} />
        <View style={styles.textContainer}>
          <Text style={[styles.cell, styles.title]}>
            {title} {id}
          </Text>
          <Text style={[styles.cell, styles.description]}>{descripcion}</Text>
        </View>
      </View>
      {isDeleteActive && (
        <Pressable onPress={deleteTodo} style={styles.deleteButton}>
          <Text style={{ color: "white", fontWeight: "bold" }}>x</Text>
        </Pressable>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  container:{
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding:14,
    borderRadius:21,
    marginBottom: 10,
    backgroundColor: "white",
  },
  checkMark: {
    width: 20,
    height: 20,
    borderRadius: 7,
    marginRight: 10,
  },
  textContainer: {
    flexDirection: "column",
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
  },
  description: {
    fontSize: 12, // Tamaño más pequeño para la descripción
    color: "gray", // Puedes cambiar el color si lo prefieres
  },
});

export default Task;
