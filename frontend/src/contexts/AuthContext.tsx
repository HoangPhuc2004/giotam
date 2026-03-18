import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Định nghĩa kiểu dữ liệu cho User
interface User {
  id: number;
  name: string;
  email: string;
  role: 'donor' | 'hospital' | 'admin';
  address?: string;
  phone?: string;
  blood_type?: string;
  last_donation?: string;
}

// Định nghĩa các hàm trong Context
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateProfile: (updatedData: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Khôi phục user từ localStorage khi load lại trang
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // --- 👇 PHẦN QUAN TRỌNG NHẤT: HÀM LOGIN ---
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // 🛑 BẮT LỖI: Nếu Server trả về lỗi (ví dụ 401 Sai mật khẩu)
      if (!response.ok) {
        // Phải "ném" (throw) lỗi này ra thì LoginPage mới bắt được
        throw new Error(data.error || 'Đăng nhập thất bại'); 
      }

      // Nếu thành công
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      
    } catch (error: any) {
      console.error("Login error:", error);
      // 🛑 NÉM LỖI TIẾP: Để LoginPage hiển thị thông báo đỏ
      throw error; 
    }
  };

  const register = async (userData: any) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/register_donor`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Đăng ký thất bại');
        }

        // Tự động login sau khi đăng ký thành công
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));

      } catch (error: any) {
        console.error("Register error:", error);
        throw error;
      }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = async (updatedData: Partial<User>) => {
    if (!user) return;

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${user.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });
        
        const data = await response.json();
        if(!response.ok) throw new Error(data.error || "Lỗi cập nhật");

        const newUser = { ...user, ...data.user };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
    } catch (e) {
        console.error("Update profile error", e);
        throw e; 
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};