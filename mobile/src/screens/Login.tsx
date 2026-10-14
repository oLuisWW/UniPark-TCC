import { useState } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, TextInput } from 'react-native';
import { api } from '../services/api';

export default function Login({ setTelaAtual, setIdUsuarioLogado }: any) {
  // Dados do formulário
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // Envia credenciais para o backend
  const handleLogin = async () => {
    try {
      const resposta = await api.post('/api/usuarios/login', null, { params: { email, senha } });
      setIdUsuarioLogado(resposta.data); // Salva ID do usuário logado
      setTelaAtual('home'); // Vai para a tela inicial
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
        <Text style={styles.loginButtonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loginContainer: { flex: 1, backgroundColor: '#1c1c1c', justifyContent: 'center', padding: 30 },
  loginTitle: { color: '#61dafb', fontSize: 45, fontWeight: 'bold', textAlign: 'center', marginBottom: 50 },
  input: { backgroundColor: '#333', color: '#fff', borderRadius: 8, padding: 15, marginBottom: 20, fontSize: 16 },
  loginButton: { backgroundColor: '#61dafb', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  loginButtonText: { color: '#1c1c1c', fontSize: 18, fontWeight: 'bold' }
});