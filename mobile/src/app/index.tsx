import { useState } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function Index() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  // 1. Estado inicial: verificando permissões silenciosamente
  if (!permission) {
    return <View style={styles.container} />;
  }

  // 2. Permissão negada ou ainda não solicitada: exibe botão
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>O UniPark precisa acessar sua câmera para ler os QR Codes.</Text>
        <Button onPress={requestPermission} title="Liberar Câmera" color="#61dafb" />
      </View>
    );
  }

  // 3. Função executada quando um QR Code é detectado
  const handleBarcodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    Alert.alert(
      "QR Code Detectado!",
      `Conteúdo lido: ${data}\n\n(No futuro, isso fará o Check-in na API)`,
      [{ text: "Continuar", onPress: () => setScanned(false) }]
    );
  };

  // 4. Permissão concedida: exibe a câmera com a máscara visual
  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>UniPark Scanner</Text>
          <View style={styles.scanFrame} />
          <Text style={styles.instructions}>Centralize o QR Code da vaga no quadro</Text>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 18,
  },
  camera: {
    flex: 1,
    margin: -20, // Compensa o padding do container para a câmera ocupar a tela toda
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)', // Fundo escurecido ao redor do quadro
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    position: 'absolute',
    top: 80,
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: '#61dafb', // Azul claro, combinando com o botão e o React
    backgroundColor: 'transparent',
    borderRadius: 20,
  },
  instructions: {
    color: '#fff',
    fontSize: 16,
    position: 'absolute',
    bottom: 80,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
});