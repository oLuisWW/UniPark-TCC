import { useState } from 'react';
import Login from '../screens/Login';
import Home from '../screens/Home';
import Scanner from '../screens/Scanner';

export default function Index() {
  // Estados globais da aplicação
  const [telaAtual, setTelaAtual] = useState<'login' | 'home' | 'camera'>('login');
  const [idUsuarioLogado, setIdUsuarioLogado] = useState<number | null>(null);

  // Roteamento de telas
  if (telaAtual === 'login') {
    return <Login setTelaAtual={setTelaAtual} setIdUsuarioLogado={setIdUsuarioLogado} />;
  }

  if (telaAtual === 'home') {
    return <Home setTelaAtual={setTelaAtual} idUsuarioLogado={idUsuarioLogado} setIdUsuarioLogado={setIdUsuarioLogado} />;
  }

  if (telaAtual === 'camera') {
    return <Scanner setTelaAtual={setTelaAtual} idUsuarioLogado={idUsuarioLogado} />;
  }

  return null;
}