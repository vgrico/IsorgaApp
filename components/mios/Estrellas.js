import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from "@expo/vector-icons";
import { COLORS } from '../../constants';

const Estrellas = ({ color, onChange }) => { // Asegúrate de recibir la función onChange
  const [rating, setRating] = useState(0);

  const handleRating = (value) => {
    setRating(value);
    onChange(value); // Llama a la función onChange con el nuevo valor de calificación
  };

  const renderRatingIcons = () => {
    const maxRating = 5;
    const ratingIcons = [];

    for (let i = 1; i <= maxRating; i++) {
      const iconName = i <= rating ? 'star' : 'staro';

      ratingIcons.push(
        <TouchableOpacity
          key={i}
          onPress={() => handleRating(i)} // Pasar el valor de la estrella seleccionada
          style={styles.iconContainer}
        >
          <AntDesign name={iconName} size={30} color={color} />
        </TouchableOpacity>
      );
    }

    return ratingIcons;
  };

  return (
    <View style={styles.container}>
      <View style={styles.ratingIcons}>{renderRatingIcons()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16
  },
  ratingIcons: {
    flexDirection: 'row',
  },
  iconContainer: {
    margin: 5,
  }
});

export default Estrellas;
