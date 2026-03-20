import { useState, useEffect } from "react";
import { supabase } from "./supabase";

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
  });

  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPlayers();
  }, []);

  async function fetchPlayers() {
    const { data, error } = await supabase.from("players").select("*");

    if (error) console.error(error);
    else setPlayers(data);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.authorized) {
      alert("Confirme a autorização.");
      return;
    }

    const { error } = await supabase.from("players").insert([
      {
        name: form.name,
        age: form.age,
        riotid: form.riotId,
        responsible: form.responsibleName,
        email: form.responsibleEmail,
        monitor: form.monitor,
        observation: form.observation,
        active: true,
        date: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error(error);
      return;
    }

    fetchPlayers();

    setForm({
      name: "",
      age: "",
      riotId: "",
      responsibleName: "",
      responsibleEmail: "",
      monitor: "",
      observation: "",
      authorized: false,
    });
  }

  async function removePlayer(id) {
    if (!window.confirm("Remover aluno?")) return;

    await supabase.from("players").delete().eq("id", id);
    fetchPlayers();
  }

  const filtered = players.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 20 }}>
      <h1>Autorização Valorant</h1>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Nome" value={form.name} onChange={handleChange} />
        <br /><br />

        <input name="age" placeholder="Idade" value={form.age} onChange={handleChange} />
        <br /><br />

        <input name="riotId" placeholder="Riot ID" value={form.riotId} onChange={handleChange} />
        <br /><br />

        <input name="responsibleName" placeholder="Responsável" value={form.responsibleName} onChange={handleChange} />
        <br /><br />

        <input name="responsibleEmail" placeholder="Email" value={form.responsibleEmail} onChange={handleChange} />
        <br /><br />

        <select name="monitor" value={form.monitor} onChange={handleChange}>
          <option value="">Monitor</option>
          <option value="Marcos">Marcos</option>
          <option value="Nathan">Nathan</option>
        </select>

        <br /><br />

        <textarea
          name="observation"
          placeholder="Observação"
          value={form.observation}
          onChange={handleChange}
        />

        <br /><br />

        <label>
          <input type="checkbox" name="authorized" checked={form.authorized} onChange={handleChange} />
          Autorizado
        </label>

        <br /><br />

        <button type="submit">Registrar</button>
      </form>

      <h2>Buscar</h2>
      <input value={search} onChange={(e) => setSearch(e.target.value)} />

      <h2>Lista</h2>

      {filtered.map((p) => (
        <div key={p.id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
          <strong>{p.name}</strong> ({p.age})<br />
          Riot: {p.riotid}<br />
          Responsável: {p.responsible}<br />
          Monitor: {p.monitor}<br />
          Data: {new Date(p.date).toLocaleString()}<br />
          Obs: {p.observation || "-"}<br />
          <button onClick={() => removePlayer(p.id)}>Remover</button>
        </div>
      ))}
    </div>
  );
}