import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";
import { COLORS, SIZES } from "../../constants";

const VerticalCentros = ({
  name,
  location,
  startTime,
  endTime,
  date,
  onPress,
}) => {
  const [isFavourite, setIsFavourite] = useState(false);

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/centro.webp")} // Tu imagen de fondo
        style={styles.background}
        imageStyle={{ opacity: 0.1 }}
      >
          <View style={styles.content}>
            <Text
              style={[
                styles.name,
                {
                  color: COLORS.greyscale900,
                },
              ]}
            >
              {name}
            </Text>
            <Text
              style={[
                styles.location,
                {
                  color: COLORS.grayscale700,
                },
              ]}
            >
              {location}
            </Text>
            <Text style={styles.duration}>{startTime}</Text>
            <Text style={styles.location}>
              {date} - {endTime}
            </Text>
          </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    width: (SIZES.width - 32) / 2 - 12,
    // backgroundColor: COLORS.magenta,
    padding: 8,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.magenta,
    overflow: "hidden",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Esto llena todo el contenedor
    backgroundColor: "rgba(255, 255, 255, 0.5)", // Capa semi-transparente
  },
  background: {
    flex: 1,
    justifyContent: "center",
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 12,
    fontFamily: "bold",
    color: COLORS.greyscale900,
    marginVertical: 2,
  },
  location: {
    fontSize: 12,
    fontFamily: "regular",
    color: COLORS.grayscale700,
    marginVertical: 2,
  },
  duration: {
    fontSize: 10,
    fontFamily: "semiBold",
    color: COLORS.grayscale400,
    marginVertical: 2,
  },
});

export default VerticalCentros;
