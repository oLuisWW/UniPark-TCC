package com.unipark.backend.controller;

import com.unipark.backend.model.Usuario;
import com.unipark.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<?> fazerLogin(@RequestParam String email, @RequestParam String senha) {
        
        Optional<Usuario> usuarioEncontrado = usuarioRepository.findByEmailAndSenha(email, senha);

        if (usuarioEncontrado.isPresent()) {
            // Se as credenciais estiverem corretas, devolve o ID do utilizador
            return ResponseEntity.ok(usuarioEncontrado.get().getIdUsuario());
        } else {
            // Se falhar, devolve erro 401 (Não Autorizado)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email ou senha incorretos.");
        }
    }
}