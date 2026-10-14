import { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from '../screens/Login';
import Home from '../screens/Home';
import Scanner from '../screens/Scanner';

export default function Index() {
  const [telaAtual, setTelaAtual] = useState('login');
  const [idUsuarioLogado, setIdUsuarioLogado] = useState<string | null>(null);
  const [carregandoInicial, setCarregandoInicial] = useState(true);

  useEffect(() => {
    const verificarSessao = async () => {
      try {
        const idSalvo = await AsyncStorage.getItem('@unipark_idUsuario');
        if (idSalvo !== null) {
          setIdUsuarioLogado(idSalvo);
          setTelaAtual('home'); // Pula o login direto para a Home
        }
      } catch (e) {
        console.error("Erro ao ler sessão", e);
      } finally {
        setCarregandoInicial(false);
      }
    };

    verificarSessao();
  }, []);

  if (carregandoInicial) {
    return (
      <View style={{ flex: 1, backgroundColor: '#1c1c1c', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#61dafb" />
      </View>
    );
  }

  if (telaAtual === 'login') return <Login setTelaAtual={setTelaAtual} setIdUsuarioLogado={setIdUsuarioLogado} />;
  if (telaAtual === 'home') return <Home setTelaAtual={setTelaAtual} idUsuarioLogado={idUsuarioLogado} setIdUsuarioLogado={setIdUsuarioLogado} />;
  if (telaAtual === 'camera') return <Scanner setTelaAtual={setTelaAtual} idUsuarioLogado={idUsuarioLogado} />;
}