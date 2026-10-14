/**
 * Anna Co-op Leads — Google Apps Script
 *
 * 1. Open the sheet: Anna Co-op Leads
 * 2. Extensions → Apps Script
 * 3. Paste this entire file, replacing the default code
 * 4. Deploy → New deployment → Type: Web app
 *    Execute as: Me
 *    Who has access: Anyone
 * 5. Copy the Web app URL and send it so the form can be pointed at it
 */
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    sheet.appendRow([
      new Date(),
      data.business || '',
      data.owner || '',
      data.phone || '',
      data.email || '',
      data.industry || '',
      data.website || '',
      data.youtube || '',
      data.facebook || '',
      data.instagram || '',
      Array.isArray(data.interests) ? data.interests.join(', ') : (data.interests || ''),
      Array.isArray(data.goals) ? data.goals.join(', ') : (data.goals || ''),
      data.book_call || '',
      data.magazine_budget || '',
      data.reach_percent || '',
      data.ad_size || '',
      data.word_count || '',
      data.affiliate_sets || '',
      data.affiliate_copies || '',
      data.affiliate_total || '',
      data.notes || ''
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, service: 'Anna Co-op Leads' }))
    .setMimeType(ContentService.MimeType.JSON);
}
