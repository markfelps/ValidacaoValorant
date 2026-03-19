import { useState, useEffect } from "react";

const EXPIRATION_DAYS = 180;

function isExpired(dateStr) {
  const created = new Date(dateStr);
  const now = new Date();
  const diffDays = (now - created) / (1000 * 60 * 60 * 24);
  return diffDays > EXPIRATION_DAYS;
}

function isToday(dateStr) {
  const d = new Date(dateStr);
  const today = new Date();
  return d.toDateString() === today.toDateString();
}

function isThisWeek(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;
  const days = diff / (1000 * 60 * 60 * 24);
  return days <= 7;
}

export default function ValorantAuthorizationApp() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    riotId: "",
    responsibleName: "",
    responsibleEmail: "",
    monitor: "",
    observation: "",
    authorized: false,
    proof: "",
  });

  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem("players");
    return saved ? JSON.parse(saved) : [];
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem("players", JSON.stringify(players));
  }, [players]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, proof: reader.result }));
    };
    reader.readAsDataURL(file);
  }

  function removeProof() {
    setForm((prev) => ({ ...prev, proof: "" }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (Number(form.age) < 12) {
      alert("Idade mínima para jogar é 12 anos.");
      return;
    }

    if (!form.authorized) {
      alert("É necessário confirmar a autorização do responsável.");
      return;
    }

    const newEntry = {
      ...form,
      date: new Date().toLocaleString('pt-BR'),
      active: true,
    };

    let updated;

    if (editingIndex !== null) {
      updated = players.map((p, i) => (i === editingIndex ? newEntry : p));
      setEditingIndex(null);
    } else {
      updated = [...players, newEntry];
    }

    setPlayers(updated);

    setForm({
      name: "",
      age: "",
      riotId: "",
      responsibleName: "",
      responsibleEmail: "",
      monitor: "",
      observation: "",
      authorized: false,
      proof: "",
    });
  }

  function deactivatePlayer(index) {
    const updated = players.map((p, i) =>
      i === index ? { ...p, active: false } : p
    );
    setPlayers(updated);
  }

  function editPlayer(index) {
    const p = players[index];
    setForm(p);
    setEditingIndex(index);
  }

  let filteredPlayers = players.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (filter === "today") {
    filteredPlayers = filteredPlayers.filter((p) => isToday(p.date));
  }

  if (filter === "week") {
    filteredPlayers = filteredPlayers.filter((p) => isThisWeek(p.date));
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Autorização Valorant</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input placeholder="Nome do aluno" name="name" value={form.name} onChange={handleChange} required />
        <br /><br />

        <input placeholder="Idade" name="age" type="number" value={form.age} onChange={handleChange} required />
        <br /><br />

        <input placeholder="Riot ID" name="riotId" value={form.riotId} onChange={handleChange} required />
        <br /><br />

        <input placeholder="Nome do responsável" name="responsibleName" value={form.responsibleName} onChange={handleChange} required />
        <br /><br />

        <input placeholder="Email do responsável" name="responsibleEmail" type="email" value={form.responsibleEmail} onChange={handleChange} required />
        <br /><br />

        <select name="monitor" value={form.monitor} onChange={handleChange} required>
          <option value="">Selecione o monitor</option>
          <option value="Marcos">Marcos</option>
          <option value="Nathan">Nathan</option>
          <option value="Outro">Outro</option>
        </select>
        <br /><br />

        <textarea
          placeholder="Observação"
          name="observation"
          value={form.observation}
          onChange={handleChange}
        />

        <br /><br />

        <label>Print da autorização:</label>
        <br />
        <input type="file" accept="image/*" onChange={handleFile} />

        <br /><br />

        {form.proof && (
          <div>
            <img src={form.proof} alt="preview" style={{ width: 100 }} />
            <br />
            <button type="button" onClick={removeProof}>
              Remover imagem
            </button>
          </div>
        )}

        <br /><br />

        <label>
          <input type="checkbox" name="authorized" checked={form.authorized} onChange={handleChange} />
          Confirmo autorização
        </label>

        <br /><br />

        <button type="submit">
          {editingIndex !== null ? "Atualizar" : "Registrar"}
        </button>
      </form>

      <h2>Buscar aluno</h2>
      <input
        placeholder="Digite o nome..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <h2>Filtro por data</h2>
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">Todos</option>
        <option value="today">Hoje</option>
        <option value="week">Últimos 7 dias</option>
      </select>

      <h2 style={{ marginTop: 20 }}>Alunos</h2>

      {filteredPlayers.length === 0 ? (
        <p>Nenhum aluno encontrado.</p>
      ) : (
        <ul>
          {filteredPlayers.map((p, i) => {
            const expired = isExpired(p.date);

            return (
              <li key={i} style={{ marginBottom: 15, border: "1px solid #ccc", padding: 10 }}>
                <strong>{p.name}</strong> ({p.age}) - {p.riotId} <br />
                Responsável: {p.responsibleName} <br />
                Monitor: {p.monitor} <br />
                Data: {p.date} <br />
                Status: {p.active ? (expired ? "⚠ Expirado" : "🟢 Ativo") : "🔴 Inativo"} <br />
                Obs: {p.observation || "-"}
                <br />
                {p.proof && (
                  <img src={p.proof} alt="proof" style={{ width: 120, marginTop: 5 }} />
                )}
                <br /><br />
                <button onClick={() => editPlayer(i)}>Editar</button>
                <button onClick={() => deactivatePlayer(i)} style={{ marginLeft: 10 }}>
                  Inativar
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
