function createContactsHTML() {

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("תגובות לטופס 1"); // adjust if name is different
  var data = sheet.getDataRange().getValues();

  const headers = data[0];
  const colIndex = {
    name: 1, //headers.indexOf("שם מלא"),
    img: 2, // headers.indexOf("תמונה לדף קשר"),  // פה רק שם קובץ, לא לינק
    dob: 3, //headers.indexOf("תאריך לידה"),
    parents: 6, //headers.indexOf("שם ההורים"),
    phone: 7, //headers.indexOf("מספר טלפון")
    address: 8
  };
let rows = data.slice(1);
rows.sort((a, b) => {
  const nameA = a[colIndex.name] ? a[colIndex.name].toString().split(" ")[0] : "";
  const nameB = b[colIndex.name] ? b[colIndex.name].toString().split(" ")[0] : "";
  return nameA.localeCompare(nameB, "he"); // "he" for Hebrew collation
});
  // נתחיל לבנות HTML
  let html = `
<!DOCTYPE html>
<html lang="he">
<head>
<meta charset="UTF-8">
<title>דף קשר</title>
<style>
  body { font-family: Arial, sans-serif; direction: rtl; }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 10px; }
  .card { text-align: center; border: 1px solid #ccc; padding: 8px; border-radius: 8px; }
  .card img { width: 80px; height: 80px; object-fit: cover; border-radius: 50%; }
  .info { margin-top: 6px; font-size: 12px; line-height: 1.3; }
</style>


</head>
<body>
<h1 style="text-align:center;">דף קשר</h1>
<div class="grid">
`;

  for (let i = 0; i < rows.length; i++) {
    const record = rows[i];
    if (!record[colIndex.name]) continue; // דלג על שורות ריקות

    const imgFile = record[colIndex.img];
    const name = record[colIndex.name];
    let dob = record[colIndex.dob];
    try {
      // ננסה להמיר לטיפוס Date
      let parsed = new Date(dob);
      if (!isNaN(parsed)) {
        dob = Utilities.formatDate(parsed, Session.getScriptTimeZone(), "dd/MM/yy");
      }
    } catch (e) {
    }
    address = record[colIndex.address];
    const parents = record[colIndex.parents];
    // מספרי טלפון – יכולים להיות מופרדים ברווח או ב"/"
    let phones = record[colIndex.phone];
    let phoneHTML = "";
    if (phones) {
      // מפרקים למספרים בודדים
      const phoneList = phones.toString().split(/[\s/]+/);
      phoneHTML = phoneList
        .map(p => `<a href="tel:${p}">${p}</a>`)
        .join(" / ");
    }
    html += `
    <div class="card">
      <img src="pics/${imgFile}" alt="${name}">
      <div class="info">
        <strong>${name}</strong><br>
        ת. לידה: ${dob}<br>
        הורים: ${parents}<br>
        ${phoneHTML}<br>
        ${address}
      </div>
    </div>
    `;
  }

  html += `
</div>
</body>
</html>
`;

  // יוצרים קובץ HTML חדש בדרייב
  const folder = DriveApp.getRootFolder(); // אפשר להחליף לתיקייה ספציפית
  const file = folder.createFile("contacts.html", html, MimeType.HTML);
  
  Logger.log("HTML נוצר: " + file.getUrl());
}
