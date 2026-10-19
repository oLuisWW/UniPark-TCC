import { useState } from 'react';
import { StyleSheet, Text, View, Button, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { api } from '../services/api';

export default function Scanner({ setTelaAtual, idUsuarioLogado }: any) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!permission) return <View style={styles.container} />;
  
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>O UniPark precisa de aceder à sua câmara.</Text>
        <Button onPress={requestPermission} title="Permitir Câmara" />
      </View>
    );
  }

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    setScanned(true); 
    setLoading(true); 
    try {
      const resposta = await api.post('/api/estacionamento/checkin', null, {
        params: { idUsuario: idUsuarioLogado, idZona: data }
      });
      
      // A resposta do Spring Boot é algo como "check-in feito na zona: b1"
      // Vamos extrair apenas a parte depois dos dois pontos (:) e colocar em maiúsculas
      const mensagemDoServidor = resposta.data;
      let nomeZona = data; // Fallback para o ID (3) caso a extração falhe
      
      if (typeof mensagemDoServidor === 'string' && mensagemDoServidor.includes(':')) {
        nomeZona = mensagemDoServidor.split(':')[1].trim().toUpperCase();
      }
      
      Alert.alert(
        "Entrada Registrada", 
        `O seu veículo foi alocado na zona ${nomeZona} com sucesso.`, 
        [
          { text: "Confirmar", onPress: () => { setScanned(false); setTelaAtual('home'); } }
        ]
      );
    } catch (erro: any) {
      Alert.alert("Erro", erro.response?.data, [{ text: "Voltar", onPress: () => { setScanned(false); setTelaAtual('home'); } }]);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        facing="back" 
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned} 
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }} 
      />
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.logoutButton} onPress={() => setTelaAtual('home')}>
          <Text style={styles.logoutButtonText}>Voltar</Text>
        </TouchableOpacity>
        
        {loading ? (
          <ActivityIndicator size="large" color="#61dafb" style={styles.loader} />
        ) : (
          <Text style={styles.title}>Ler Vaga</Text>
        )}
        
        <View style={styles.scanFrame} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1c1c1c' },
  camera: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  text: { color: '#fff', textAlign: 'center', marginBottom: 20, fontSize: 18, padding: 20 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  title: { color: '#fff', fontSize: 28, fontWeight: 'bold', position: 'absolute', top: 100 },
  loader: { position: 'absolute', top: 100 },
  scanFrame: { width: 250, height: 250, borderWidth: 3, borderColor: '#61dafb', borderRadius: 20 },
  logoutButton: { position: 'absolute', top: 60, left: 20, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  logoutButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});