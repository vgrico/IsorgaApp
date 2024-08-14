import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { COLORS, SIZES } from "../../constants";

const CardEquipos = ({ item, onPress }) => {
  const today = new Date();
  const proximaDate = new Date(item.proxima);
  const isPastDate = proximaDate < today;

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.nombre}</Text>
      <View style={styles.horizontalLine} />
      <Text style={styles.cardSubtitle}>Tipo Revisión: {item.texto_tipo}</Text>
      <View style={styles.horizontalLine} />
      <Text style={[styles.proxima, isPastDate && styles.pastDate]}>
        {item.proxima}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  pastDate: {
    color: "red",
  },
  proxima: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  nombre: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  textoTipo: {
    fontSize: 12,
    color: "#888",
    marginBottom: 5,
  },
  horizontalLine: {
    borderBottomColor: COLORS.black,
    borderBottomWidth: 1,
    marginVertical: 10,
  },
});

export default CardEquipos;
