// Vercel Serverless Function — เก็บข้อมูลติดลบรายวันบน Upstash Redis (Vercel Storage)
// ENV ที่ต้องมี: KV_REST_API_URL, KV_REST_API_TOKEN (Vercel เพิ่มให้อัตโนมัติเมื่อเชื่อม Upstash Redis)
// ENV แนะนำ: APP_PASSWORD (รหัสผ่านเข้าใช้งานระบบ)
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

async function redis(cmd) {
  const r = await fetch(URL_, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + TOKEN },
    body: JSON.stringify(cmd),
  });
  const j = await r.json();
  if (j.error) throw new Error(j.error);
  return j.result;
}

module.exports = async (req, res) => {
  const pw = process.env.APP_PASSWORD;
  if (pw && req.headers['x-app-key'] !== pw) return res.status(401).json({ error: 'unauthorized' });
  if (!URL_ || !TOKEN) return res.status(500).json({ error: 'database not connected' });
  try {
    const date = req.query.date;
    if (req.method === 'GET') {
      if (date) {
        const v = await redis(['GET', 'neg:' + date]);
        return res.status(200).json(v ? JSON.parse(v) : null);
      }
      const dates = (await redis(['SMEMBERS', 'neg:dates'])) || [];
      return res.status(200).json({ dates: dates.sort() });
    }
    if (req.method === 'POST') {
      const { date: d, data } = req.body || {};
      if (!/^\d{4}-\d{2}-\d{2}$/.test(d || '') || !data) return res.status(400).json({ error: 'bad request' });
      await redis(['SET', 'neg:' + d, JSON.stringify(data)]);
      await redis(['SADD', 'neg:dates', d]);
      return res.status(200).json({ ok: true });
    }
    if (req.method === 'DELETE') {
      const dates = date === 'all' ? (await redis(['SMEMBERS', 'neg:dates'])) || [] : [date];
      for (const d of dates) { await redis(['DEL', 'neg:' + d]); await redis(['SREM', 'neg:dates', d]); }
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: 'method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
};
