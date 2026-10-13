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

import java.time.Duration;
import java.time.LocalDateTime;

// avisa pro spring que aqui fica a regra de negocio
@Service
public class EstacionamentoService {

    @Autowired
    private ZonaEstacionamentoRepository zonaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RegistroOcupacaoRepository registroRepository;

    @Transactional
    public String realizarCheckIn(Long idUsuario, Long idZona) {
        
        RegistroOcupacao registroAtivo = registroRepository.findFirstByUsuarioIdUsuarioAndStatusRegistro(idUsuario, "ativo");
        
        if (registroAtivo != null) {
            return "erro: você já possui um estacionamento ativo na zona: " + registroAtivo.getZona().getNomeZona();
        }

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("usuario nao encontrado"));
                
        ZonaEstacionamento zona = zonaRepository.findById(idZona)
                .orElseThrow(() -> new RuntimeException("zona nao encontrada"));

        if (zona.getVagasOcupadas() >= zona.getCapacidadeMaxima()) {
            return "erro: zona lotada";
        }

        zona.setVagasOcupadas(zona.getVagasOcupadas() + 1);

        if (zona.getVagasOcupadas().equals(zona.getCapacidadeMaxima())) {
            zona.setStatusLotacao("lotado");
        } else {
            zona.setStatusLotacao("ocupado");
        }
        zonaRepository.save(zona); 

        RegistroOcupacao novoRegistro = new RegistroOcupacao();
        novoRegistro.setUsuario(usuario);
        novoRegistro.setZona(zona);
        novoRegistro.setDataHoraEntrada(LocalDateTime.now());
        novoRegistro.setStatusRegistro("ativo");
        
        registroRepository.save(novoRegistro); 

        return "check-in feito na zona: " + zona.getNomeZona();
    }

    @Transactional
    public String realizarCheckOut(Long idUsuario) {
        
        RegistroOcupacao registro = registroRepository.findFirstByUsuarioIdUsuarioAndStatusRegistro(idUsuario, "ativo");
        
        if (registro == null) {
            return "erro: nenhum check-in ativo encontrado pra esse usuario";
        }

        // 1. Regista a hora de saída
        registro.setDataHoraSaida(LocalDateTime.now());
        registro.setStatusRegistro("finalizado");
        registroRepository.save(registro);

        // 2. Calcula o tempo de permanência
        Duration duracao = Duration.between(registro.getDataHoraEntrada(), registro.getDataHoraSaida());
        long horas = duracao.toHours();
        long minutos = duracao.toMinutesPart();
        
        String tempoFormatado;
        if (horas > 0) {
            tempoFormatado = horas + " hora(s) e " + minutos + " minuto(s)";
        } else {
            tempoFormatado = minutos + " minuto(s)";
        }

        // 3. Liberta a vaga
        ZonaEstacionamento zona = registro.getZona();
        
        if (zona.getVagasOcupadas() > 0) {
            zona.setVagasOcupadas(zona.getVagasOcupadas() - 1);
        }

        if (zona.getVagasOcupadas() == 0) {
            zona.setStatusLotacao("vazio");
        } else {
            zona.setStatusLotacao("ocupado");
        }
        
        zonaRepository.save(zona);

        // 4. Devolve a mensagem final com o cálculo de tempo
        return "Vaga libertada. Tempo de permanência: " + tempoFormatado + ".";
    }
}