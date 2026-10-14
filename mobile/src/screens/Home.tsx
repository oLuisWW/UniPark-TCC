import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { api } from '../services/api';

export default function Home({ setTelaAtual, idUsuarioLogado, setIdUsuarioLogado }: any) {
  const [zonas, setZonas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false); // Loading da lista
  const [loadingCheckout, setLoadingCheckout] = useState(false); // Loading do botão sair

  const carregarZonas = async () => {
    setLoading(true);
    try {
      const resposta = await api.get('/api/zonas');
      setZonas(resposta.data);
    } catch (erro) {
      console.log("Erro ao carregar zonas", erro);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarZonas();
  }, []);

  const handleCheckout = async () => {
    setLoadingCheckout(true);
    try {
      const resposta = await api.post('/api/estacionamento/checkout', null, { params: { idUsuario: idUsuarioLogado } });
      Alert.alert("Saída Liberada!", resposta.data);
      carregarZonas(); 
    } catch (erro: any) {
      Alert.alert("Erro no Checkout", erro.response?.data || "Nenhum check-in ativo.");
    } finally {
      setLoadingCheckout(false);
    }
  };

  return (
    <View style={styles.homeContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vagas Campus</Text>
        <TouchableOpacity onPress={() => { setIdUsuarioLogado(null); setTelaAtual('login'); }}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={zonas}
        keyExtractor={(item) => item.idZona.toString()}
        refreshing={loading} // Mostra a bolinha nativa ao puxar para atualizar
        onRefresh={carregarZonas}
        renderItem={({ item }) => {
          const vagasLivres = item.capacidadeMaxima - item.vagasOcupadas;
          const corStatus = vagasLivres === 0 ? '#ff4757' : (vagasLivres <= 5 ? '#ffa502' : '#2ed573');

          return (
            <View style={styles.cardZona}>
              <Text style={styles.nomeZona}>{item.nomeZona}</Text>
              <Text style={styles.infoZona}>Capacidade: {item.capacidadeMaxima} vagas</Text>
              <View style={[styles.badgeStatus, { backgroundColor: corStatus }]}>
                <Text style={styles.textoStatus}>
                  {vagasLivres > 0 ? `${vagasLivres} vagas livres` : 'LOTADO'}
                </Text>
              </View>
            </View>
          );
        }}
      />

      <View style={styles.homeButtonsContainer}>
        <TouchableOpacity style={styles.scanButton} onPress={() => setTelaAtual('camera')}>
          <Text style={styles.scanButtonText}>Ler QR Code (Check-in)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.checkoutHomeButton} onPress={handleCheckout} disabled={loadingCheckout}>
          {loadingCheckout ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.checkoutButtonText}>Fazer Checkout (Sair)</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  homeContainer: { flex: 1, backgroundColor: '#f0f2f5', paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  logoutText: { fontSize: 16, color: '#ff4757', fontWeight: 'bold' },
  cardZona: { backgroundColor: '#fff', marginHorizontal: 20, marginTop: 15, padding: 20, borderRadius: 10, elevation: 3 },
  nomeZona: { fontSize: 18, fontWeight: 'bold', color: '#2f3542' },
  infoZona: { fontSize: 14, color: '#747d8c', marginTop: 5 },
  badgeStatus: { alignSelf: 'flex-start', marginTop: 10, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 },
  textoStatus: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  homeButtonsContainer: { padding: 20, paddingBottom: 40 },
  scanButton: { backgroundColor: '#61dafb', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  scanButtonText: { color: '#1c1c1c', fontSize: 18, fontWeight: 'bold' },
  checkoutHomeButton: { backgroundColor: '#ff4757', padding: 15, borderRadius: 8, alignItems: 'center', height: 55, justifyContent: 'center' },
  checkoutButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});