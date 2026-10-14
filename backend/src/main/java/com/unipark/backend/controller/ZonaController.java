package com.unipark.backend.controller;

import com.unipark.backend.model.ZonaEstacionamento;
import com.unipark.backend.repository.ZonaEstacionamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/zonas")
@CrossOrigin(origins = "*")
public class ZonaController {

    @Autowired
    private ZonaEstacionamentoRepository zonaRepository;

    // Rota que devolve todas as zonas cadastradas no banco
    @GetMapping
    public List<ZonaEstacionamento> listarZonas() {
        return zonaRepository.findAll();
    }
}