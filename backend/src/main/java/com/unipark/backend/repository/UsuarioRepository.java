package com.unipark.backend.repository;

import com.unipark.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // no futuro se precisar da pra buscar um usuario pelo email para o login
  
}