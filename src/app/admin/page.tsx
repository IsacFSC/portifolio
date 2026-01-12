'use client';

import { useState, useEffect } from 'react';
import { Lock, LogOut, Trash2, Mail, Calendar, AlertTriangle, Eye, X } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

interface LoginAttempt {
  count: number;
  resetAt: number;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, new: 0, read: 0 });
  const [token, setToken] = useState<string | null>(null);
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt>({
    count: 0,
    resetAt: 0,
  });
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState<Contact | null>(null);

  // Timer para contagem regressiva de bloqueio
  useEffect(() => {
    if (!isLocked || lockTimeRemaining <= 0) return;

    const timer = setTimeout(() => {
      setLockTimeRemaining(lockTimeRemaining - 1);
      if (lockTimeRemaining === 1) {
        setIsLocked(false);
        setLoginAttempts({ count: 0, resetAt: 0 });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isLocked, lockTimeRemaining]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const now = Date.now();

    // Reset se passou da janela de 15 minutos
    if (loginAttempts.resetAt && now > loginAttempts.resetAt) {
      setLoginAttempts({ count: 0, resetAt: 0 });
      setIsLocked(false);
    }

    // Verificar se está bloqueado
    if (isLocked) {
      const remainingTime = Math.ceil(
        (loginAttempts.resetAt - now) / 1000
      );
      setLockTimeRemaining(remainingTime);
      setError(`Muitas tentativas. Tente novamente em ${remainingTime}s.`);
      return;
    }

    // Verificar limite de 3 tentativas
    if (loginAttempts.count >= 3) {
      setIsLocked(true);
      setLockTimeRemaining(Math.ceil((loginAttempts.resetAt - now) / 1000));
      setError(
        `Acesso bloqueado por 15 minutos. Muitas tentativas de login falhadas.`
      );
      return;
    }

    // Validar senha no servidor
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const newCount = loginAttempts.count + 1;
        const resetAt = loginAttempts.resetAt || now + 15 * 60 * 1000;
        
        setLoginAttempts({ count: newCount, resetAt });
        setPassword('');

        if (newCount >= 3) {
          setIsLocked(true);
          setLockTimeRemaining(900);
          setError(
            `Senha incorreta. Acesso bloqueado por 15 minutos. (${newCount}/3 tentativas)`
          );
        } else {
          setError(
            `Senha incorreta. ${3 - newCount} tentativa${3 - newCount !== 1 ? 's' : ''} restante${3 - newCount !== 1 ? 's' : ''}.`
          );
        }
        return;
      }

      const data = await response.json();
      const tokenString = data.token;

      setToken(tokenString);
      setIsAuthenticated(true);
      setError('');
      setPassword('');
      setLoginAttempts({ count: 0, resetAt: 0 });
      fetchContacts(tokenString);
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      setError('Erro de conexão. Tente novamente.');
    }
  };

  const fetchContacts = async (authToken: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/contacts', {
        headers: {
          'X-Admin-Token': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setContacts(data);

        // Calcular estatísticas
        setStats({
          total: data.length,
          new: data.filter((c: Contact) => c.status === 'new').length,
          read: data.filter((c: Contact) => c.status === 'read').length,
        });
      } else if (response.status === 401) {
        setError('Token inválido. Faça login novamente.');
        setIsAuthenticated(false);
      } else if (response.status === 429) {
        setError('Muitas requisições. Aguarde alguns segundos.');
      } else {
        setError('Erro ao buscar contatos. Tente novamente.');
      }
    } catch (err) {
      console.error('Erro ao buscar contatos:', err);
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;

    if (confirm('Tem certeza que deseja deletar esta mensagem?')) {
      try {
        const response = await fetch(`/api/admin/contacts/${id}`, {
          method: 'DELETE',
          headers: {
            'X-Admin-Token': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setContacts(contacts.filter((c) => c.id !== id));
          fetchContacts(token);
        } else if (response.status === 429) {
          setError('Limite de deletions atingido. Tente mais tarde.');
        } else {
          setError('Erro ao deletar contato.');
        }
      } catch (err) {
        console.error('Erro ao deletar contato:', err);
        setError('Erro de conexão.');
      }
    }
  };

  const handleMarkAsRead = async (id: string) => {
    if (!token) return;

    try {
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'read' }),
      });

      if (response.ok) {
        fetchContacts(token);
      } else if (response.status === 401) {
        setError('Token inválido. Faça login novamente.');
        setIsAuthenticated(false);
      } else {
        setError('Erro ao atualizar contato.');
      }
    } catch (err) {
      console.error('Erro ao atualizar contato:', err);
      setError('Erro de conexão.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full mx-auto mb-6">
            <Lock size={24} className="text-white" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Admin Panel
          </h1>
          <p className="text-gray-600 text-center mb-6">Área restrita</p>

          {isLocked && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle size={20} className="text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-700 font-semibold">
                  Acesso temporariamente bloqueado
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Aguarde {lockTimeRemaining}s antes de tentar novamente.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Senha Administrativa
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLocked}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Digite sua senha"
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLocked}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg transition-colors"
            >
              {isLocked ? `Bloqueado (${lockTimeRemaining}s)` : 'Acessar'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-800">
              <strong>🔒 Segurança:</strong> Esta área está protegida com
              autenticação por token. Máximo 3 tentativas de login. Após
              falhas, bloqueio de 15 minutos.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (token) fetchContacts(token);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              🔄 Atualizar
            </button>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setPassword('');
                setToken(null);
              }}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <LogOut size={20} />
              Sair
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <p className="text-gray-400 text-sm">Total de Mensagens</p>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <p className="text-gray-400 text-sm">Novas</p>
            <p className="text-3xl font-bold text-blue-400">{stats.new}</p>
          </div>
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <p className="text-gray-400 text-sm">Lidas</p>
            <p className="text-3xl font-bold text-green-400">{stats.read}</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-950 border border-red-700 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle size={20} className="text-red-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-400">Erro</h3>
              <p className="text-sm text-red-300 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Mensagens de Contato */}
        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white">
              Mensagens de Contato
            </h2>
          </div>

          {loading ? (
            <div className="p-6 text-center text-gray-400">Carregando...</div>
          ) : contacts.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              Nenhuma mensagem de contato ainda.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-700 border-b border-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">
                      Assunto
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {contacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-100 font-medium">
                        {contact.name}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-blue-400 hover:underline flex items-center gap-1"
                        >
                          <Mail size={16} />
                          {contact.email}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {contact.subject}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            contact.status === 'new'
                              ? 'bg-blue-900 text-blue-200 border border-blue-700'
                              : 'bg-green-900 text-green-200 border border-green-700'
                          }`}
                        >
                          {contact.status === 'new' ? 'Nova' : 'Lida'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300 flex items-center gap-1">
                        <Calendar size={16} />
                        {new Date(contact.createdAt).toLocaleDateString(
                          'pt-BR'
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedMessage(contact)}
                            className="text-sm bg-blue-900 text-blue-200 px-3 py-1 rounded hover:bg-blue-800 transition-colors flex items-center gap-1 border border-blue-700"
                          >
                            <Eye size={16} />
                            Ver
                          </button>
                          {contact.status === 'new' && (
                            <button
                              onClick={() => handleMarkAsRead(contact.id)}
                              className="text-sm bg-green-900 text-green-200 px-3 py-1 rounded hover:bg-green-800 transition-colors border border-green-700"
                            >
                              Lida
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(contact.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal de Visualização de Mensagem */}
        {selectedMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full border border-gray-700 max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white">Visualizar Mensagem</h2>
                  <p className="text-gray-400 text-sm mt-1">De: {selectedMessage.name}</p>
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-400 hover:text-gray-200 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-gray-400 text-sm font-semibold mb-2">
                    Nome
                  </label>
                  <p className="text-gray-100 bg-gray-700 rounded p-3 border border-gray-600">
                    {selectedMessage.name}
                  </p>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-semibold mb-2">
                    Email
                  </label>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-blue-400 hover:underline bg-gray-700 rounded p-3 border border-gray-600 block"
                  >
                    {selectedMessage.email}
                  </a>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-semibold mb-2">
                    Assunto
                  </label>
                  <p className="text-gray-100 bg-gray-700 rounded p-3 border border-gray-600">
                    {selectedMessage.subject}
                  </p>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-semibold mb-2">
                    Mensagem
                  </label>
                  <div className="text-gray-100 bg-gray-700 rounded p-4 border border-gray-600 whitespace-pre-wrap wrap-break-words max-h-96 overflow-y-auto">
                    {selectedMessage.message}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="block text-gray-400 font-semibold mb-1">
                      Status
                    </label>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        selectedMessage.status === 'new'
                          ? 'bg-blue-900 text-blue-200 border border-blue-700'
                          : 'bg-green-900 text-green-200 border border-green-700'
                      }`}
                    >
                      {selectedMessage.status === 'new' ? 'Nova' : 'Lida'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-gray-400 font-semibold mb-1">
                      Data
                    </label>
                    <p className="text-gray-300">
                      {new Date(selectedMessage.createdAt).toLocaleDateString(
                        'pt-BR',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-6 flex gap-3 justify-end">
                {selectedMessage.status === 'new' && (
                  <button
                    onClick={() => {
                      handleMarkAsRead(selectedMessage.id);
                      setSelectedMessage(null);
                    }}
                    className="bg-green-900 text-green-200 px-4 py-2 rounded hover:bg-green-800 transition-colors border border-green-700 font-semibold"
                  >
                    Marcar como Lida
                  </button>
                )}
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="bg-red-900 text-red-200 px-4 py-2 rounded hover:bg-red-800 transition-colors border border-red-700 font-semibold"
                >
                  Deletar Mensagem
                </button>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="bg-gray-700 text-gray-200 px-4 py-2 rounded hover:bg-gray-600 transition-colors border border-gray-600 font-semibold"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Informações de Segurança */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-8 mt-12 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">
            🔒 Segurança do Admin Panel
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">
                ✅ Proteções Implementadas
              </h3>
              <ul className="list-disc list-inside text-sm text-gray-300 space-y-2 ml-4">
                <li>Autenticação por Token (validado no servidor)</li>
                <li>Rate limiting: 3 tentativas de login em 15 minutos</li>
                <li>Bloqueio temporário após 3 falhas</li>
                <li>Validação de CUID contra SQL injection</li>
                <li>Rate limiting de API: 10 req/min por IP</li>
                <li>Audit logging de todas as operações de deleção</li>
                <li>Headers de segurança: X-Frame-Options, X-Content-Type-Options</li>
                <li>Proteção contra cache: no-store, no-cache</li>
              </ul>
            </div>

            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-100 mb-2">
                📝 Usar a API
              </h3>
              <div className="bg-gray-900 p-4 rounded-lg text-sm font-mono text-gray-300 overflow-x-auto border border-gray-700">
                <p className="mb-4 text-gray-400">
                  <strong>Header necessário:</strong>
                </p>
                <pre>X-Admin-Token: Bearer base64(admin:senha)</pre>
                <p className="mt-4 mb-2 text-gray-400">
                  <strong>Exemplo com curl:</strong>
                </p>
                <pre className="text-xs">
{`TOKEN=$(curl -s -X POST http://localhost:3000/api/admin/login \\
  -H "Content-Type: application/json" \\
  -d '{"password":"admin123"}' | jq -r '.token')
curl -H "X-Admin-Token: Bearer $TOKEN" \\
  http://localhost:3000/api/admin/contacts`}
                </pre>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-100 mb-2">
                🔐 Configuração de Senha
              </h3>
              <p className="text-sm text-gray-300 mb-3">
                Configure a variável de ambiente privada:{' '}
                <code className="bg-gray-900 px-2 py-1 rounded border border-gray-700 text-gray-200">
                  ADMIN_PASSWORD
                </code>
              </p>
              <p className="text-xs text-gray-400">
                Padrão (DEMO): admin123
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
