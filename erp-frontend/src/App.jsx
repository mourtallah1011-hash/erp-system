import React, { useState, useEffect } from 'react';
import { 
  LogOut, 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  Settings, 
  AlertCircle, 
  Mail, 
  Lock, 
  LogIn 
} from 'lucide-react';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Identifiants incorrects');
      }

      setToken(data.accessToken || data.access_token || 'connected');
    } catch (err) {
      setError(err.message || 'Impossible de se connecter au serveur');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const response = await fetch('http://localhost:3000/api/v1/products', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des produits:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (token && activeTab === 'products') {
      fetchProducts();
    }
  }, [activeTab, token]);

  if (!token) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>ERP System</h1>
          <p style={styles.subtitle}>Connexion à votre espace entreprise</p>

          <form onSubmit={handleLogin} style={styles.form}>
            {error && (
              <div style={styles.errorBox}>
                <AlertCircle color="#ef4444" size={20} />
                <span>{error}</span>
              </div>
            )}

            <div style={styles.inputGroup}>
              <Mail size={20} color="#6b7280" />
              <input
                type="email"
                placeholder="Adresse Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <Lock size={20} color="#6b7280" />
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <button type="submit" disabled={loading} style={styles.button}>
              <LogIn size={20} />
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.dashboardLayout}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <h2>ERP System</h2>
        </div>

        <nav style={styles.navMenu}>
          <button 
            style={activeTab === 'dashboard' ? styles.navItemActive : styles.navItem} 
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={20} /> Tableau de bord
          </button>
          <button 
            style={activeTab === 'users' ? styles.navItemActive : styles.navItem} 
            onClick={() => setActiveTab('users')}
          >
            <Users size={20} /> Utilisateurs
          </button>
          <button 
            style={activeTab === 'products' ? styles.navItemActive : styles.navItem} 
            onClick={() => setActiveTab('products')}
          >
            <Package size={20} /> Stock & Produits
          </button>
          <button 
            style={activeTab === 'sales' ? styles.navItemActive : styles.navItem} 
            onClick={() => setActiveTab('sales')}
          >
            <ShoppingCart size={20} /> Ventes
          </button>
          <button 
            style={activeTab === 'settings' ? styles.navItemActive : styles.navItem} 
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={20} /> Paramètres
          </button>
        </nav>

        <button style={styles.logoutButton} onClick={() => setToken(null)}>
          <LogOut size={20} /> Déconnexion
        </button>
      </aside>

      <main style={styles.mainContent}>
        <header style={styles.header}>
          <h3>Espace de Gestion</h3>
          <div style={styles.userInfo}>
            <span>Connecté en tant que : <b>{email}</b></span>
          </div>
        </header>

        <section style={styles.contentBody}>
          {activeTab === 'dashboard' && (
            <div>
              <h2>Vue d'ensemble</h2>
              <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                  <h4>Ventes du mois</h4>
                  <p style={styles.statNumber}>12 450 €</p>
                </div>
                <div style={styles.statCard}>
                  <h4>Nouveaux Clients</h4>
                  <p style={styles.statNumber}>+24</p>
                </div>
                <div style={styles.statCard}>
                  <h4>Commandes en cours</h4>
                  <p style={styles.statNumber}>8</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h2>Gestion des Utilisateurs</h2>
              <p>Module de gestion des accès et rôles des employés.</p>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <div style={styles.stockHeader}>
                <div>
                  <h2 style={styles.noMargin}>Stock & Inventaire</h2>
                  <p style={styles.stockSubtitle}>Consultez et gérez l'état de votre stock d'articles.</p>
                </div>
                <button onClick={fetchProducts} style={styles.refreshButton}>
                  Rafraîchir
                </button>
              </div>

              <div style={styles.tableCard}>
                {loadingProducts ? (
                  <p style={styles.loadingText}>Chargement des produits...</p>
                ) : (
                  <table style={styles.table}>
                    <thead>
                      <tr style={styles.tableHeaderRow}>
                        <th style={styles.tableHeaderCell}>Nom du Produit</th>
                        <th style={styles.tableHeaderCell}>Prix Unitaire</th>
                        <th style={styles.tableHeaderCell}>Coût</th>
                        <th style={styles.tableHeaderCell}>SKU</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.length === 0 ? (
                        <tr>
                          <td colSpan={4} style={styles.emptyCell}>
                            Aucun produit disponible dans la base.
                          </td>
                        </tr>
                      ) : (
                        products.map((item, index) => (
                          <tr key={item.id || index} style={styles.tableRow}>
                            <td style={styles.tableCell}><b>{item.name}</b></td>
                            <td style={styles.tableCell}>{item.unitPrice ?? 0} CFA</td>
                            <td style={styles.tableCell}>{item.costPrice ?? 0} CFA</td>
                            <td style={styles.tableCell}>{item.sku || '-'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {activeTab === 'sales' && (
            <div>
              <h2>Historique des Ventes</h2>
              <p>Liste des factures et transactions effectuées.</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2>Paramètres du Système</h2>
              <p>Configuration générale de la plateforme ERP.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    fontFamily: 'Segoe UI, sans-serif',
  },
  card: {
    backgroundColor: '#1e293b',
    padding: '2.5rem',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  title: { margin: 0, fontSize: '1.8rem', color: '#38bdf8' },
  subtitle: { color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.2rem' },
  inputGroup: { display: 'flex', alignItems: 'center', backgroundColor: '#0f172a', padding: '0.8rem', borderRadius: '8px', border: '1px solid #334155', gap: '0.8rem' },
  input: { background: 'none', border: 'none', outline: 'none', color: '#fff', width: '100%' },
  button: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '0.8rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  errorBox: { display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '0.8rem', borderRadius: '8px', fontSize: '0.85rem' },
  
  dashboardLayout: { display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'Segoe UI, sans-serif' },
  sidebar: { width: '250px', backgroundColor: '#1e293b', borderRight: '1px solid #334155', display: 'flex', flexDirection: 'column', padding: '1.5rem' },
  brand: { marginBottom: '2rem', color: '#38bdf8' },
  navMenu: { display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 },
  navItem: { display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem', backgroundColor: 'transparent', color: '#94a3b8', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontSize: '0.95rem' },
  navItemActive: { display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontSize: '0.95rem', fontWeight: 'bold' },
  logoutButton: { display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem', backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', cursor: 'pointer', marginTop: 'auto' },
  mainContent: { flex: 1, display: 'flex', flexDirection: 'column' },
  header: { height: '60px', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', backgroundColor: '#1e293b' },
  userInfo: { fontSize: '0.9rem', color: '#94a3b8' },
  contentBody: { padding: '2rem', flex: 1 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' },
  statCard: { backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '10px', border: '1px solid #334155' },
  statNumber: { fontSize: '1.8rem', fontWeight: 'bold', color: '#38bdf8', margin: '0.5rem 0 0 0' },

  stockHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  noMargin: { margin: 0 },
  stockSubtitle: { color: '#94a3b8', margin: '0.2rem 0 0 0' },
  refreshButton: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  loadingText: { color: '#94a3b8', textAlign: 'center', padding: '1rem' },
  emptyCell: { textAlign: 'center', padding: '2rem', color: '#94a3b8' },
  tableCard: { backgroundColor: '#1e293b', borderRadius: '10px', border: '1px solid #334155', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  tableHeaderRow: { backgroundColor: '#0f172a', borderBottom: '1px solid #334155' },
  tableHeaderCell: { padding: '1rem', color: '#38bdf8', fontSize: '0.9rem', fontWeight: 'bold' },
  tableRow: { borderBottom: '1px solid #334155' },
  tableCell: { padding: '1rem', color: '#f8fafc', fontSize: '0.95rem' }
};