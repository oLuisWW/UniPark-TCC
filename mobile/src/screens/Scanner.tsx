import { useState } from 'react';
import { StyleSheet, Text, View, Button, Alert, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { api } from '../services/api';

export default function Scanner({ setTelaAtual, idUsuarioLogado }: any) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false); // Evita múltiplas leituras seguidas

  if (!permission) return <View style={styles.container} />;
  
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>O UniPark precisa acessar sua câmera.</Text>
        <Button onPress={requestPermission} title="Liberar Câmera" />
      </View>
    );
  }

  // Dispara ao ler o código
  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    setScanned(true); 
    try {
      const resposta = await api.post('/api/estacionamento/checkin', null, {
        params: { idUsuario: idUsuarioLogado, idZona: data }
      });
      
      Alert.alert("Check-in Realizado!", resposta.data, [
        { text: "Ver Vagas", onPress: () => { setScanned(false); setTelaAtual('home'); } }
      ]);
    } catch (erro: any) {
      Alert.alert("Erro", erro.response?.data, [{ text: "Voltar", onPress: () => { setScanned(false); setTelaAtual('home'); } }]);
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
        <Text style={styles.title}>Ler Vaga</Text>
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
  scanFrame: { width: 250, height: 250, borderWidth: 3, borderColor: '#61dafb', borderRadius: 20 },
  logoutButton: { position: 'absolute', top: 60, left: 20, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  logoutButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});