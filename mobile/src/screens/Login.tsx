import { useState } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { api } from '../services/api';

export default function Login({ setTelaAtual, setIdUsuarioLogado }: any) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false); // Novo estado de carregamento

  const handleLogin = async () => {
    if (!email || !senha) return Alert.alert("Aviso", "Preencha todos os campos.");
    
    setLoading(true); // Liga a animação
    try {
      const resposta = await api.post('/api/usuarios/login', null, { params: { email, senha } });
      setIdUsuarioLogado(resposta.data);
      setTelaAtual('home');
    } catch (erro: any) {
      Alert.alert("Acesso Negado", "Email ou senha incorretos.");
    } finally {
      setLoading(false); // Desliga a animação, quer dê erro ou sucesso
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
      
      {/* Botão desativado enquanto carrega e mostra o Spinner */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#1c1c1c" />
        ) : (
          <Text style={styles.loginButtonText}>Entrar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loginContainer: { flex: 1, backgroundColor: '#1c1c1c', justifyContent: 'center', padding: 30 },
  loginTitle: { color: '#61dafb', fontSize: 45, fontWeight: 'bold', textAlign: 'center', marginBottom: 50 },
  input: { backgroundColor: '#333', color: '#fff', borderRadius: 8, padding: 15, marginBottom: 20, fontSize: 16 },
  loginButton: { backgroundColor: '#61dafb', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10, height: 55, justifyContent: 'center' },
  loginButtonText: { color: '#1c1c1c', fontSize: 18, fontWeight: 'bold' }
});