package com.unipark.backend.repository;

import com.unipark.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    //linha para o Spring Boot criar a consulta SQL automaticamente
    Optional<Usuario> findByEmailAndSenha(String email, String senha);
}