package com.unipark.backend.service;

import com.unipark.backend.model.RegistroOcupacao;
import com.unipark.backend.model.Usuario;
import com.unipark.backend.model.ZonaEstacionamento;
import com.unipark.backend.repository.RegistroOcupacaoRepository;
import com.unipark.backend.repository.UsuarioRepository;
import com.unipark.backend.repository.ZonaEstacionamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

// avisa pro spring que aqui fica a regra de negocio
@Service
public class EstacionamentoService {

    // injeta os repositorios pra acessar o banco
    @Autowired
    private ZonaEstacionamentoRepository zonaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RegistroOcupacaoRepository registroRepository;

    // se der erro no meio do processo ele desfaz tudo no banco (rollback)
    @Transactional
    public String realizarCheckIn(Long idUsuario, Long idZona) {
        
        // puxa usuario e zona pelo id q vem do app
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("usuario nao encontrado"));
                
        ZonaEstacionamento zona = zonaRepository.findById(idZona)
                .orElseThrow(() -> new RuntimeException("zona nao encontrada"));

        // ve se ja ta lotado
        if (zona.getVagasOcupadas() >= zona.getCapacidadeMaxima()) {
            return "erro: zona lotada";
        }

        // soma 1 carro na vaga
        zona.setVagasOcupadas(zona.getVagasOcupadas() + 1);

        // atualiza o status de lotacao da zona
        if (zona.getVagasOcupadas().equals(zona.getCapacidadeMaxima())) {
            zona.setStatusLotacao("lotado");
        } else {
            zona.setStatusLotacao("ocupado");
        }
        zonaRepository.save(zona); 

        // salva o historico do qr code com a hora de entrada
        RegistroOcupacao novoRegistro = new RegistroOcupacao();
        novoRegistro.setUsuario(usuario);
        novoRegistro.setZona(zona);
        novoRegistro.setDataHoraEntrada(LocalDateTime.now());
        novoRegistro.setStatusRegistro("ativo");
        
        registroRepository.save(novoRegistro); 

        // deu bom, retorna msg de sucesso
        return "check-in feito na zona: " + zona.getNomeZona();
    }

    // regra do checkout: acha o registro aberto, poe a hora de saida e devolve a vaga
    @Transactional
    public String realizarCheckOut(Long idUsuario) {
        
        // busca o registro que ta rolando agora pra esse usuario
        RegistroOcupacao registro = registroRepository.findFirstByUsuarioIdUsuarioAndStatusRegistro(idUsuario, "ativo");
        
        if (registro == null) {
            return "erro: nenhum check-in ativo encontrado pra esse usuario";
        }

        // finaliza o registro colocando a hora atual e mudando o status
        registro.setDataHoraSaida(LocalDateTime.now());
        registro.setStatusRegistro("finalizado");
        registroRepository.save(registro);

        // puxa a zona que o cara tava estacionado
        ZonaEstacionamento zona = registro.getZona();
        
        // devolve a vaga (subtrai 1 dos ocupados)
        if (zona.getVagasOcupadas() > 0) {
            zona.setVagasOcupadas(zona.getVagasOcupadas() - 1);
        }

        // atualiza a flag visual de lotacao
        if (zona.getVagasOcupadas() == 0) {
            zona.setStatusLotacao("vazio");
        } else {
            zona.setStatusLotacao("ocupado");
        }
        
        zonaRepository.save(zona);

        return "check-out feito com sucesso. vaga liberada na zona: " + zona.getNomeZona();
    }
}