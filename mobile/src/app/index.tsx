import { useState } from 'react';
import { StyleSheet, Text, View, Button, Alert, TouchableOpacity, TextInput } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { api } from '../services/api';

export default function Index() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  
  // Estados do sistema de Login
  const [idUsuarioLogado, setIdUsuarioLogado] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // 1. TELA DE LOGIN
  if (idUsuarioLogado === null) {
    const handleLogin = async () => {
      try {
        const resposta = await api.post('/api/usuarios/login', null, {
          params: { email, senha }
        });
        setIdUsuarioLogado(resposta.data);
      } catch (erro: any) {
        Alert.alert("Acesso Negado", "Email ou senha incorretos.");
      }
    };

    return (
      <View style={styles.loginContainer}>
        <Text style={styles.loginTitle}>UniPark</Text>
        
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#999"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />
        
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Entrar no Estacionamento</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 2. TELA DA CÂMARA
  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>O UniPark precisa acessar sua câmera para ler os QR Codes.</Text>
        <Button onPress={requestPermission} title="Liberar Câmera" color="#61dafb" />
      </View>
    );
  }

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    setScanned(true);
    try {
      const resposta = await api.post('/api/estacionamento/checkin', null, {
        params: { idUsuario: idUsuarioLogado, idZona: data }
      });
      Alert.alert(
        "Check-in Realizado!", 
        `Sucesso: ${resposta.data}`, 
        [{ text: "Continuar", onPress: () => setScanned(false) }]
      );
    } catch (erro: any) {
      const mensagemErro = erro.response?.data || "Verifique se a API está rodando.";
      Alert.alert("Erro no Check-in", mensagemErro, [{ text: "Tentar Novamente", onPress: () => setScanned(false) }]);
    }
  };

  const handleCheckout = async () => {
    try {
      const resposta = await api.post('/api/estacionamento/checkout', null, {
        params: { idUsuario: idUsuarioLogado }
      });
      Alert.alert("Saída Liberada!", `Sucesso: ${resposta.data}`);
    } catch (erro: any) {
      const mensagemErro = erro.response?.data || "Erro de conexão ao tentar fazer checkout.";
      Alert.alert("Erro no Checkout", mensagemErro);
    }
  };

  // NOVA FUNÇÃO: Logout
  const handleLogout = () => {
    setIdUsuarioLogado(null);
    setEmail('');
    setSenha('');
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
        {/* Botão de Sair no canto superior direito */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>

        <Text style={styles.title}>UniPark Scanner</Text>
        <View style={styles.scanFrame} />
        <Text style={styles.instructions}>Centralize o QR Code da vaga no quadro</Text>
        
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>Fazer Checkout (Sair da Vaga)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Estilos Gerais e da Câmara
  container: { flex: 1, backgroundColor: '#1c1c1c' },
  camera: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  text: { color: '#fff', textAlign: 'center', marginBottom: 20, fontSize: 18, padding: 20 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  title: { color: '#fff', fontSize: 28, fontWeight: 'bold', position: 'absolute', top: 100 },
  scanFrame: { width: 250, height: 250, borderWidth: 3, borderColor: '#61dafb', backgroundColor: 'transparent', borderRadius: 20 },
  instructions: { color: '#fff', fontSize: 16, position: 'absolute', bottom: 120, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8, overflow: 'hidden' },
  checkoutButton: { position: 'absolute', bottom: 40, backgroundColor: '#ff4757', paddingHorizontal: 25, paddingVertical: 15, borderRadius: 10, elevation: 5 },
  checkoutButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  
  // Estilos do botão de Logout
  logoutButton: { position: 'absolute', top: 40, right: 20, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  logoutButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  // Estilos da Tela de Login
  loginContainer: { flex: 1, backgroundColor: '#1c1c1c', justifyContent: 'center', padding: 30 },
  loginTitle: { color: '#61dafb', fontSize: 45, fontWeight: 'bold', textAlign: 'center', marginBottom: 50 },
  input: { backgroundColor: '#333', color: '#fff', borderRadius: 8, padding: 15, marginBottom: 20, fontSize: 16 },
  loginButton: { backgroundColor: '#61dafb', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  loginButtonText: { color: '#1c1c1c', fontSize: 18, fontWeight: 'bold' }
});