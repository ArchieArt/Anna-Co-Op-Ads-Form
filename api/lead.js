export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const table = process.env.AIRTABLE_TABLE || 'Leads';
  if (!token || !baseId) {
    return res.status(500).json({ ok: false, error: 'Airtable is not configured yet' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const d = body || {};

  const fields = {
    Business: d.business || '',
    Owner: d.owner || '',
    Phone: d.phone || '',
    Email: d.email || '',
    Industry: d.industry || '',
    Website: d.website || '',
    YouTube: d.youtube || '',
    Facebook: d.facebook || '',
    Instagram: d.instagram || '',
    Interests: Array.isArray(d.interests) ? d.interests.join(', ') : (d.interests || ''),
    Goals: Array.isArray(d.goals) ? d.goals.join(', ') : (d.goals || ''),
    'Book Call': d.book_call || '',
    'Magazine Budget': d.magazine_budget ? Number(d.magazine_budget) : null,
    'Reach Percent': d.reach_percent ? Number(d.reach_percent) : null,
    'Ad Size': d.ad_size || '',
    'Word Count': d.word_count ? Number(d.word_count) : null,
    'Affiliate Sets': d.affiliate_sets ? Number(d.affiliate_sets) : 0,
    'Affiliate Copies': d.affiliate_copies ? Number(d.affiliate_copies) : 0,
    'Affiliate Total': d.affiliate_total ? Number(d.affiliate_total) : 0,
    Notes: d.notes || '',
  };

  // Drop nulls so Airtable doesn't reject empty number fields
  Object.keys(fields).forEach((k) => {
    if (fields[k] === null || fields[k] === '') delete fields[k];
  });

  try {
    const r = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ records: [{ fields }] }),
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ ok: false, error: data });
    return res.status(200).json({ ok: true, id: data.records?.[0]?.id });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
}
