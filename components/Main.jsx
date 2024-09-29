import { useEffect, useState } from "react";
import { StyleSheet, Text, ScrollView, Image, View, Button, ActivityIndicator } from "react-native";
import { getLatestGames } from "../lib/metacritic";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function Main() {
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);  // Página actual
  const [loading, setLoading] = useState(false);  // Indicador de carga
  const [hasMore, setHasMore] = useState(true);  // Indica si hay más juegos para cargar
  const insets = useSafeAreaInsets();

  // Cargar juegos cuando se monta el componente
  useEffect(() => {
    loadGames();  // Cargar los juegos iniciales
  }, []);

  // Función para cargar más juegos
  const loadGames = () => {
    setLoading(true);  // Mostrar indicador de carga
    getLatestGames(page).then((newGames) => {
      if (newGames.length === 0) {
        setHasMore(false);  // Si no hay más juegos, detener
      } else {
        // Filtrar juegos duplicados
        const uniqueGames = newGames.filter(
          (newGame) => !games.some((game) => game.slug === newGame.slug)
        );

        setGames((prevGames) => [...prevGames, ...uniqueGames]);  
        setPage((prevPage) => prevPage + 1);  
      }
      setLoading(false); 
    });
  };

  return (
    <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <Text style={styles.header}>Últimos Juegos</Text>
      <ScrollView>
        {games.map((game) => (
          <View key={game.slug} style={styles.card}>
            <Image source={{ uri: game.image }} style={styles.image} />
            <Text style={styles.score}>Puntuación: {game.score}</Text>
            <Text style={styles.title}>{game.title}</Text>
            <Text style={styles.description}>Descripción: {game.description}</Text>
            <Text style={styles.releaseDate}>Fecha de lanzamiento: {game.releaseDate}</Text>
          </View>
        ))}

        {/* Botón para cargar más juegos */}
        {hasMore && !loading && (
          <Button title="Cargar más" onPress={loadGames} color="#00ff00" />
        )}

        {/* Indicador de carga */}
        {loading && <ActivityIndicator size="large" color="#00ff00" />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
    marginVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    color: "#fff",
  },
  description: {
    fontSize: 16,
    color: "#eee",
  },
  score: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
    marginBottom: 10,
  },
  releaseDate: {
    fontSize: 14,
    color: "#ccc",
  },
  developer: {
    fontSize: 14,
    color: "#fff",
    marginTop: 5,
  },
  card: {
    marginBottom: 42,
  },
  image: {
    width: 107,
    height: 147,
    borderRadius: 10,
  },
});
