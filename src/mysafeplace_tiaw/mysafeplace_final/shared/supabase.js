// MySafePlace — Supabase Client
const SUPABASE_URL = 'https://cilfpkyzwgokglhynemu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_jgKH18ZqnhFanAeeZ_Wpig_9gobmFwS';

const db = {
  async get(tabela, filtros = {}) {
    let url = `${SUPABASE_URL}/rest/v1/${tabela}?`;
    const params = ['select=*'];
    for (const [key, val] of Object.entries(filtros)) {
      params.push(`${key}=eq.${encodeURIComponent(val)}`);
    }
    url += params.join('&');
    const res = await fetch(url, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    return res.json();
  },

  async getById(tabela, id) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${tabela}?id=eq.${id}&select=*`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    const data = await res.json();
    return data[0];
  },

  async post(tabela, dados) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${tabela}`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(dados)
    });
    const data = await res.json();
    return Array.isArray(data) ? data[0] : data;
  },

  async put(tabela, id, dados) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${tabela}?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(dados)
    });
    const data = await res.json();
    return Array.isArray(data) ? data[0] : data;
  },

  async patch(tabela, id, dados) {
    return this.put(tabela, id, dados);
  },

  async delete(tabela, id) {
    await fetch(`${SUPABASE_URL}/rest/v1/${tabela}?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
  }
};
