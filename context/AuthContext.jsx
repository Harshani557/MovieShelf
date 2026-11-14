import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// All accounts are stored on the device only (offline, no server or API).
const USERS_KEY = 'movieshelf_users';
const SESSION_KEY = 'movieshelf_session';

const AuthContext = createContext(null);

// ---- password hashing (so plain-text passwords are never stored) ----
const mix = (str) => {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
};

const makeSalt = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

const hashPassword = (password, salt) => {
  let digest = password;
  for (let i = 0; i < 1000; i++) digest = mix(salt + digest + i);
  return digest;
};

const normalizeAnswer = (answer) => answer.trim().toLowerCase();

const publicUser = ({ id, name, email, createdAt }) => ({ id, name, email, createdAt });

const readUsers = async () => {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
};
const writeUsers = (users) => AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore the logged-in user when the app starts
  useEffect(() => {
    const restore = async () => {
      try {
        const sessionId = await AsyncStorage.getItem(SESSION_KEY);
        if (sessionId) {
          const users = await readUsers();
          const found = users.find((u) => u.id === sessionId);
          if (found) setUser(publicUser(found));
        }
      } catch (error) {
        console.log('Could not restore session:', error);
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  const register = async ({ name, email, password, securityQuestion, securityAnswer }) => {
    try {
      const users = await readUsers();
      const cleanEmail = email.trim().toLowerCase();
      if (users.some((u) => u.email === cleanEmail)) {
        return { ok: false, error: 'An account with this email already exists.' };
      }
      const salt = makeSalt();
      const answerSalt = makeSalt();
      const newUser = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        name: name.trim(),
        email: cleanEmail,
        salt,
        passwordHash: hashPassword(password, salt),
        securityQuestion,
        answerSalt,
        answerHash: hashPassword(normalizeAnswer(securityAnswer), answerSalt),
        createdAt: new Date().toISOString(),
      };
      await writeUsers([...users, newUser]);
      await AsyncStorage.setItem(SESSION_KEY, newUser.id);
      setUser(publicUser(newUser));
      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'Could not create the account. Please try again.' };
    }
  };

  const login = async ({ email, password }) => {
    try {
      const users = await readUsers();
      const cleanEmail = email.trim().toLowerCase();
      const found = users.find((u) => u.email === cleanEmail);
      if (!found || found.passwordHash !== hashPassword(password, found.salt)) {
        return { ok: false, error: 'Incorrect email or password.' };
      }
      await AsyncStorage.setItem(SESSION_KEY, found.id);
      setUser(publicUser(found));
      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'Could not log in. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(SESSION_KEY);
    } catch (error) {
      console.log('Could not clear session:', error);
    }
    setUser(null);
  };

  const updateName = async (name) => {
    try {
      const users = await readUsers();
      const updated = users.map((u) => (u.id === user.id ? { ...u, name: name.trim() } : u));
      await writeUsers(updated);
      setUser((current) => ({ ...current, name: name.trim() }));
      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'Could not update your name.' };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const users = await readUsers();
      const found = users.find((u) => u.id === user.id);
      if (!found || found.passwordHash !== hashPassword(currentPassword, found.salt)) {
        return { ok: false, error: 'Your current password is incorrect.' };
      }
      const salt = makeSalt();
      const updated = users.map((u) =>
        u.id === user.id ? { ...u, salt, passwordHash: hashPassword(newPassword, salt) } : u
      );
      await writeUsers(updated);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'Could not change the password.' };
    }
  };

  // ---- forgot password (security question) ----
  const getSecurityQuestion = async (email) => {
    try {
      const users = await readUsers();
      const found = users.find((u) => u.email === email.trim().toLowerCase());
      if (!found) return { ok: false, error: 'No account found with this email.' };
      if (!found.securityQuestion) {
        return { ok: false, error: 'This account has no security question, so it cannot be reset.' };
      }
      return { ok: true, question: found.securityQuestion };
    } catch (error) {
      return { ok: false, error: 'Something went wrong. Please try again.' };
    }
  };

  const resetPassword = async ({ email, answer, newPassword }) => {
    try {
      const users = await readUsers();
      const cleanEmail = email.trim().toLowerCase();
      const found = users.find((u) => u.email === cleanEmail);
      if (!found || !found.answerHash) return { ok: false, error: 'Could not reset this account.' };
      if (found.answerHash !== hashPassword(normalizeAnswer(answer), found.answerSalt)) {
        return { ok: false, error: 'That answer is not correct.' };
      }
      const salt = makeSalt();
      const updated = users.map((u) =>
        u.email === cleanEmail ? { ...u, salt, passwordHash: hashPassword(newPassword, salt) } : u
      );
      await writeUsers(updated);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'Could not reset the password.' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user, loading, register, login, logout, updateName, changePassword,
        getSecurityQuestion, resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
