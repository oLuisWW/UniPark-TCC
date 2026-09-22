package com.unipark.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "zonas_estacionamento")
public class ZonaEstacionamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idZona;

    @Column(nullable = false, length = 100)
    private String nomeZona;

    private String referenciaLocalizacao;

    @Column(nullable = false)
    private Integer capacidadeMaxima;

    @Column(columnDefinition = "int default 0")
    private Integer vagasOcupadas = 0;

    @Column(length = 20, columnDefinition = "varchar(20) default 'Vazio'")
    private String statusLotacao = "Vazio";

    // getters e setters gerados
    public Long getIdZona() {
        return idZona;
    }

    public void setIdZona(Long idZona) {
        this.idZona = idZona;
    }

    public String getNomeZona() {
        return nomeZona;
    }

    public void setNomeZona(String nomeZona) {
        this.nomeZona = nomeZona;
    }

    public String getReferenciaLocalizacao() {
        return referenciaLocalizacao;
    }

    public void setReferenciaLocalizacao(String referenciaLocalizacao) {
        this.referenciaLocalizacao = referenciaLocalizacao;
    }

    public Integer getCapacidadeMaxima() {
        return capacidadeMaxima;
    }

    public void setCapacidadeMaxima(Integer capacidadeMaxima) {
        this.capacidadeMaxima = capacidadeMaxima;
    }

    public Integer getVagasOcupadas() {
        return vagasOcupadas;
    }

    public void setVagasOcupadas(Integer vagasOcupadas) {
        this.vagasOcupadas = vagasOcupadas;
    }

    public String getStatusLotacao() {
        return statusLotacao;
    }

    public void setStatusLotacao(String statusLotacao) {
        this.statusLotacao = statusLotacao;
    }
}