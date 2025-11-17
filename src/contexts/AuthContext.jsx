import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🎯 Verificar se usuário está logado ao carregar
    useEffect(() => {
        const checkAuth = () => {
            try {
                const storedUser = localStorage.getItem('cinewave-user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error('Erro ao verificar autenticação:', error);
                localStorage.removeItem('cinewave-user');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // 🎯 Login
    const login = async (email, password) => {
        // Simulação de API - em produção, isso viria de um backend real
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Verificação básica - em produção, isso seria no backend
                if (email && password.length >= 6) {
                    const userData = {
                        id: Date.now(),
                        email,
                        name: email.split('@')[0], // Nome baseado no email
                        createdAt: new Date().toISOString()
                    };
                    
                    // Salvar no localStorage
                    localStorage.setItem('cinewave-user', JSON.stringify(userData));
                    setUser(userData);
                    
                    resolve({ success: true, user: userData });
                } else {
                    reject({ success: false, error: 'Credenciais inválidas' });
                }
            }, 1000); // Simular delay de rede
        });
    };

    // 🎯 Registro
    const register = async (userData) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const { name, email, password } = userData;
                
                // Validações básicas
                if (!name || !email || !password) {
                    reject({ success: false, error: 'Todos os campos são obrigatórios' });
                    return;
                }

                if (password.length < 6) {
                    reject({ success: false, error: 'Senha deve ter pelo menos 6 caracteres' });
                    return;
                }

                if (!/\S+@\S+\.\S+/.test(email)) {
                    reject({ success: false, error: 'Email inválido' });
                    return;
                }

                // Verificar se email já existe (simulação)
                const existingUsers = JSON.parse(localStorage.getItem('cinewave-users') || '[]');
                if (existingUsers.find(u => u.email === email)) {
                    reject({ success: false, error: 'Email já cadastrado' });
                    return;
                }

                // Criar novo usuário
                const newUser = {
                    id: Date.now(),
                    name,
                    email,
                    createdAt: new Date().toISOString()
                };

                // Salvar usuário na "base de dados"
                existingUsers.push(newUser);
                localStorage.setItem('cinewave-users', JSON.stringify(existingUsers));
                
                // Fazer login automático
                localStorage.setItem('cinewave-user', JSON.stringify(newUser));
                setUser(newUser);

                resolve({ success: true, user: newUser });
            }, 1000);
        });
    };

    // 🎯 Logout
    const logout = () => {
        localStorage.removeItem('cinewave-user');
        setUser(null);
    };

    // 🎯 Atualizar perfil
    const updateProfile = (profileData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const updatedUser = { ...user, ...profileData };
                localStorage.setItem('cinewave-user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                resolve({ success: true, user: updatedUser });
            }, 500);
        });
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};