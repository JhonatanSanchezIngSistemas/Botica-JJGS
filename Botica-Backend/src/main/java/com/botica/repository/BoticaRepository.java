package com.botica.repository;

import com.botica.entity.Botica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BoticaRepository extends JpaRepository<Botica, Long> {
    Optional<Botica> findByRuc(String ruc);
}
