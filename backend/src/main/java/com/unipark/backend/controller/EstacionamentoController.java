package com.unipark.backend.controller;

import com.unipark.backend.service.EstacionamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// classe q responde as chamadas da api
@RestController
@RequestMapping("/api/estacionamento") // url base
@CrossOrigin(origins = "*") // libera o cors pro react nao ser bloqueado
public class EstacionamentoController {

    @Autowired
    private EstacionamentoService estacionamentoService;

    // rota de checkin do qr code
    @PostMapping("/checkin")
    public ResponseEntity<String> checkIn(@RequestParam Long idUsuario, @RequestParam Long idZona) {
        
        try {
            // manda pro service resolver a logica
            String resultado = estacionamentoService.realizarCheckIn(idUsuario, idZona);
            
            // se vier msg de erro devolve status 400
            if (resultado.startsWith("erro")) {
                return ResponseEntity.badRequest().body(resultado);
            }
            
            // se deu certo devolve status 200 ok
            return ResponseEntity.ok(resultado);
            
        } catch (Exception e) {
            // se der b.o cai no catch
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // rota de checkout (so precisa mandar o id do usuario pra dar a saida)
    @PostMapping("/checkout")
    public ResponseEntity<String> checkOut(@RequestParam Long idUsuario) {
        
        try {
            // manda pro service finalizar
            String resultado = estacionamentoService.realizarCheckOut(idUsuario);
            
            // se vier erro devolve status 400
            if (resultado.startsWith("erro")) {
                return ResponseEntity.badRequest().body(resultado);
            }
            
            return ResponseEntity.ok(resultado);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}