import { useState, useEffect } from "react";

export default function ValorantAuthorizationApp() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    riotId: "",
    responsibleName: "",
    responsibleEmail: "",
    authorized: false,
  });

  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem("players");
    return saved ? JSON.parse(saved) : [];
  });
  const [search, setSearch] = useState("");

  // Carregar dados salvos
  useEffect(() => {
    const saved = localStorage.getItem("players");
    if (saved) setPlayers(JSON.parse(saved));
  }, []);

  // Salvar automaticamente
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

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.authorized) {
      alert("É necessário confirmar a autorização do responsável.");
      return;
    }

    setPlayers([...players, form]);
    setForm({
      name: "",
      age: "",
      riotId: "",
      responsibleName: "",
      responsibleEmail: "",
      authorized: false,
    });
  }

  function removePlayer(index) {
    const updated = players.filter((_, i) => i !== index);
    setPlayers(updated);
  }

  const filteredPlayers = players.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Autorização Valorant</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          placeholder="Nome do aluno"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <input
          placeholder="Idade"
          name="age"
          type="number"
          value={form.age}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <input
          placeholder="Riot ID"
          name="riotId"
          value={form.riotId}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <input
          placeholder="Nome do responsável"
          name="responsibleName"
          value={form.responsibleName}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <input
          placeholder="Email do responsável"
          name="responsibleEmail"
          type="email"
          value={form.responsibleEmail}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <label>
          <input
            type="checkbox"
            name="authorized"
            checked={form.authorized}
            onChange={handleChange}
          />
          Confirmo que a autorização foi validada
        </label>

        <br />
        <br />

        <button type="submit">Registrar</button>
      </form>

      <h2>Buscar aluno</h2>
      <input
        placeholder="Digite o nome..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <h2 style={{ marginTop: 20 }}>Alunos autorizados</h2>

      {filteredPlayers.length === 0 ? (
        <p>Nenhum aluno encontrado.</p>
      ) : (
        <ul>
          {filteredPlayers.map((p, i) => (
            <li key={i} style={{ marginBottom: 10 }}>
              <strong>{p.name}</strong> ({p.age} anos) - {p.riotId} <br />
              Responsável: {p.responsibleName}
              <br />
              <button onClick={() => removePlayer(i)}>Remover</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
