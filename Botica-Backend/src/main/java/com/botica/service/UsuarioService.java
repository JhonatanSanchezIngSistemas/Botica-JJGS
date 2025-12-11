package com.botica.service;

import com.botica.entity.Usuario;
import com.botica.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Optional<Usuario> buscarPorUsername(@org.springframework.lang.NonNull String username) {
        return usuarioRepository.findByUsername(username);
    }

    public Usuario guardar(@org.springframework.lang.NonNull Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public Boolean existePorUsername(@org.springframework.lang.NonNull String username) {
        return usuarioRepository.existsByUsername(username);
    }
}
