package com.unipark.backend.repository;

import com.unipark.backend.model.ZonaEstacionamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ZonaEstacionamentoRepository extends JpaRepository<ZonaEstacionamento, Long> {

}