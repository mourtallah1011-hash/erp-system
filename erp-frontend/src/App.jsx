// erp-frontend/src/App.jsx
import React, { useEffect, useState } from 'react'
import { api } from './api'
import './App.css'

function App(){
  const [tab, setTab] = useState('dashboard')
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [sales, setSales] = useState([])
  const [settings, setSettings] = useState(null)

  useEffect(()=>{ if(localStorage.getItem('token')) loadAll(); }, [])

  async function loadAll(){
    try{
      const [u,p,s,sett] = await Promise.all([api.users(), api.products(), api.sales(), api.settings()])
      setUsers(u); setProducts(p); setSales(s); setSettings(sett);
    }catch(e){ console.error(e); }
  }

  // quick login helper for demo: fetch token from backend not implemented; we'll store demo token placeholder
  function demoLogin(){
    // For testing, store a fake token signed with the same default secret 'CHANGE_ME' if backend doesn't enforce
    localStorage.setItem('token', 'demo-token');
    loadAll();
  }

  return (
    <div className="app">
      <header>
        <h1>ERP Dashboard</h1>
        <nav>
          <button onClick={()=>setTab('dashboard')}>Dashboard</button>
          <button onClick={()=>setTab('products')}>Produits</button>
          <button onClick={()=>setTab('users')}>Utilisateurs</button>
          <button onClick={()=>setTab('sales')}>Ventes</button>
          <button onClick={()=>setTab('settings')}>Paramètres</button>
          <button onClick={demoLogin}>Demo Login</button>
        </nav>
      </header>
      <main>
        {tab==='dashboard' && <Dashboard products={products} sales={sales} />}
        {tab==='products' && <Products products={products} onRefresh={loadAll} />}
        {tab==='users' && <Users users={users} onRefresh={loadAll} />}
        {tab==='sales' && <Sales products={products} sales={sales} onRefresh={loadAll} />}
        {tab==='settings' && <Settings settings={settings} onRefresh={loadAll} />}
      </main>
    </div>
  )
}

function Dashboard({products, sales}){
  const total = sales.reduce((s,a)=>s+(a.total||0),0);
  const tx = sales.length;
  const lowStock = products.filter(p=>p.stock<20).length;
  return (
    <div>
      <h2>Tableau de bord</h2>
      <p>Total ventes: {total} CFA</p>
      <p>Transactions: {tx}</p>
      <p>Produits en stock faible: {lowStock}</p>
    </div>
  )
}

function Products({products, onRefresh}){
  const [form, setForm] = useState({name:'',sku:'',price:0,cost:0,stock:0})
  async function add(){ try{ await api.createProduct(form); onRefresh(); setForm({name:'',sku:'',price:0,cost:0,stock:0}) }catch(e){alert(e)} }
  return (
    <div>
      <h2>Produits</h2>
      <table>
        <thead><tr><th>Nom</th><th>SKU</th><th>Prix</th><th>Coût</th><th>Stock</th></tr></thead>
        <tbody>
          {products.map(p=> <tr key={p.id}><td>{p.name}</td><td>{p.sku}</td><td>{p.price}</td><td>{p.cost}</td><td>{p.stock}</td></tr>)}
        </tbody>
      </table>
      <h3>Ajouter</h3>
      <div className="form">
        <input placeholder="Nom" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
        <input placeholder="SKU" value={form.sku} onChange={e=>setForm({...form,sku:e.target.value})} />
        <input placeholder="Prix" type="number" value={form.price} onChange={e=>setForm({...form,price:Number(e.target.value)})} />
        <input placeholder="Coût" type="number" value={form.cost} onChange={e=>setForm({...form,cost:Number(e.target.value)})} />
        <input placeholder="Stock" type="number" value={form.stock} onChange={e=>setForm({...form,stock:Number(e.target.value)})} />
        <button onClick={add}>Ajouter</button>
      </div>
    </div>
  )
}

function Users({users, onRefresh}){
  const [form, setForm] = useState({email:'',password:'',name:'',role:'CASHIER'})
  async function add(){ try{ await api.createUser(form); onRefresh(); setForm({email:'',password:'',name:'',role:'CASHIER'}) }catch(e){alert(e)} }
  return (
    <div>
      <h2>Utilisateurs</h2>
      <table>
        <thead><tr><th>Email</th><th>Nom</th><th>Role</th></tr></thead>
        <tbody>
          {users.map(u=> <tr key={u.id}><td>{u.email}</td><td>{u.name}</td><td><span className={`badge ${u.role}`}>{u.role}</span></td></tr>)}
        </tbody>
      </table>
      <h3>Ajouter</h3>
      <div className="form">
        <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
        <input placeholder="Nom" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
        <input placeholder="Mot de passe" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
        <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
          <option>ADMIN</option>
          <option>MANAGER</option>
          <option>CASHIER</option>
        </select>
        <button onClick={add}>Ajouter</button>
      </div>
    </div>
  )
}

function Sales({products, sales, onRefresh}){
  const [cart, setCart] = useState([])
  function addToCart(p){
    const idx = cart.findIndex(c=>c.productId===p.id)
    if(idx>=0){ const c = [...cart]; c[idx].quantity++; setCart(c); }
    else setCart([...cart, {productId:p.id, sku:p.sku, quantity:1}])
  }
  async function checkout(){ try{ await api.createSale({ items: cart }); setCart([]); onRefresh(); }catch(e){alert(e)} }
  return (
    <div>
      <h2>Prise de commande</h2>
      <div className="products">
        {products.map(p=> <div key={p.id} className="card"><h4>{p.name}</h4><p>{p.price} CFA</p><p>Stock: {p.stock}</p><button onClick={()=>addToCart(p)}>Ajouter</button></div>)}
      </div>
      <h3>Panier</h3>
      <ul>{cart.map(c=> <li key={c.productId}>{c.sku} x {c.quantity}</li>)}</ul>
      <button onClick={checkout}>Valider</button>

      <h3>Historique</h3>
      <table>
        <thead><tr><th>ID</th><th>Utilisateur</th><th>Total</th><th>Date</th></tr></thead>
        <tbody>
          {sales.map(s=> <tr key={s.id}><td>{s.id}</td><td>{s.user?.email}</td><td>{s.total}</td><td>{new Date(s.createdAt).toLocaleString()}</td></tr>)}
        </tbody>
      </table>
    </div>
  )
}

function Settings({settings, onRefresh}){
  const [form, setForm] = useState(settings||{companyName:'',contact:'',address:''})
  useEffect(()=>{ setForm(settings||{companyName:'',contact:'',address:''}) }, [settings])
  async function save(){ try{ await api.updateSettings(form); onRefresh(); alert('Saved') }catch(e){alert(e)} }
  return (
    <div>
      <h2>Paramètres</h2>
      <input placeholder="Nom entreprise" value={form?.companyName||''} onChange={e=>setForm({...form,companyName:e.target.value})} />
      <input placeholder="Contact" value={form?.contact||''} onChange={e=>setForm({...form,contact:e.target.value})} />
      <input placeholder="Adresse" value={form?.address||''} onChange={e=>setForm({...form,address:e.target.value})} />
      <button onClick={save}>Enregistrer</button>
    </div>
  )
}

export default App
