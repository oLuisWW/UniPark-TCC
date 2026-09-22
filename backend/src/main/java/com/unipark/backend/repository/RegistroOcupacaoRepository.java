package com.unipark.backend.repository;

import com.unipark.backend.model.RegistroOcupacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegistroOcupacaoRepository extends JpaRepository<RegistroOcupacao, Long> {
    
    // o spring cria o sql sozinho pra buscar o ultimo check-in aberto do usuario
    RegistroOcupacao findFirstByUsuarioIdUsuarioAndStatusRegistro(Long idUsuario, String status);
}