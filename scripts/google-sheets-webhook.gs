/**
 * Elevate funnel — приём анкет в Google Таблицу
 *
 * === БЫСТРАЯ УСТАНОВКА ===
 * 1. Google Sheets → создайте таблицу (например «Elevate — анкеты воронка»)
 * 2. Расширения → Apps Script → удалите код по умолчанию → вставьте ЭТОТ файл целиком
 * 3. Задайте WEBHOOK_SECRET ниже (любая длинная случайная строка)
 * 4. Сохраните → Run → выберите setupSheet → разрешите доступ к таблице
 * 5. Развернуть → Новое развертывание → Тип: Веб-приложение
 *    - Запуск от имени: Я
 *    - У кого есть доступ: Все
 * 6. Скопируйте URL развертывания (.../exec) в .env сайта:
 *    GOOGLE_SHEETS_WEBHOOK_URL=...
 *    GOOGLE_SHEETS_WEBHOOK_SECRET=тот же секрет
 * 7. Откройте URL в браузере — должно быть {"ok":true,"service":"elevate-funnel-leads"}
 *
 * Тест из Apps Script: Run → testSampleLead
 */

const SHEET_NAME = "Leads";

/** Совпадает с GOOGLE_SHEETS_WEBHOOK_SECRET на сайте. Оставьте "" только для локальных тестов. */
const WEBHOOK_SECRET = "";

/** Колонки таблицы: ключ из JSON сайта → заголовок на русском */
const COLUMNS = [
  { key: "submittedAt", title: "Дата отправки" },
  { key: "name", title: "Имя" },
  { key: "contact", title: "Контакт" },
  { key: "age_label", title: "Возраст" },
  { key: "country", title: "Страна" },
  { key: "status_label", title: "Статус (учёба/работа)" },
  { key: "course_label", title: "Курс" },
  { key: "specialty", title: "Специальность" },
  { key: "interest_reason", title: "Почему интересны стажировки" },
  { key: "internship_understanding", title: "Понимание влияния на карьеру" },
  { key: "career_importance", title: "Важность развития карьеры" },
  { key: "experience", title: "Резюме / опыт" },
  { key: "english_level_label", title: "Уровень английского" },
  { key: "english_certificate_label", title: "Сертификат английского" },
  { key: "internship_field", title: "Сфера стажировки" },
  { key: "target_countries", title: "Страны" },
  { key: "start_timing_label", title: "Когда начать поиск" },
  { key: "financial_situation_label", title: "Финансовая ситуация" },
  { key: "financial_decision_label", title: "Кто принимает решения" },
  { key: "career_blockers", title: "Что мешает карьере" },
  { key: "consultation_goals_label", title: "Ожидания от консультации" },
  { key: "additional_notes", title: "Важно знать до консультации" },
  { key: "videos_watched", title: "Просмотрено видео" },
  { key: "source", title: "Источник" },
];

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  return sheet;
}

function ensureHeaders_(sheet) {
  const titles = COLUMNS.map(function (col) {
    return col.title;
  });
  const firstRow = sheet.getRange(1, 1, 1, titles.length).getValues()[0];
  const empty = firstRow.every(function (cell) {
    return !cell;
  });
  if (sheet.getLastRow() === 0 || empty) {
    sheet.getRange(1, 1, 1, titles.length).setValues([titles]);
    formatHeaderRow_(sheet, titles.length);
  }
}

function formatHeaderRow_(sheet, colCount) {
  const header = sheet.getRange(1, 1, 1, colCount);
  header.setFontWeight("bold");
  header.setBackground("#e8f0fe");
  header.setWrap(true);
  sheet.setFrozenRows(1);
  sheet.setColumnWidths(1, colCount, 160);
  sheet.setColumnWidth(1, 180);
  sheet.setColumnWidth(3, 200);
}

function formatSubmittedAt_(iso) {
  if (!iso) return "";
  try {
    const date = new Date(iso);
    return Utilities.formatDate(date, "Asia/Almaty", "dd.MM.yyyy HH:mm");
  } catch (e) {
    return String(iso);
  }
}

function rowFromPayload_(data) {
  return COLUMNS.map(function (col) {
    var val = data[col.key];
    if (col.key === "submittedAt") {
      return formatSubmittedAt_(val);
    }
    if (val === null || val === undefined) return "";
    if (typeof val === "object") return JSON.stringify(val);
    return String(val);
  });
}

function verifySecret_(e, data) {
  if (!WEBHOOK_SECRET) return true;
  var token =
    (e.parameter && e.parameter.token) ||
    (data && data._webhookVerify) ||
    "";
  return token === WEBHOOK_SECRET;
}

/** Запустите один раз вручную: создаёт лист и шапку */
function setupSheet() {
  var sheet = getSheet_();
  ensureHeaders_(sheet);
}

/** Тестовая строка — Run в редакторе Apps Script */
function testSampleLead() {
  var sample = {
    submittedAt: new Date().toISOString(),
    name: "Тест Тестов",
    contact: "+7 700 000 00 00",
    age_label: "18–20",
    country: "Казахстан",
    status_label: "Учусь в университете",
    course_label: "2",
    specialty: "Международные отношения",
    interest_reason: "Хочу опыт за рубежом",
    internship_understanding: "Понимаю базово",
    career_importance: "Очень важно",
    experience: "Резюме есть, стажировок не было",
    english_level_label: "B2",
    english_certificate_label: "IELTS",
    internship_field: "Консалтинг",
    target_countries: "Германия, США",
    start_timing_label: "Как можно скорее",
    financial_situation_label: "Рассматриваю, нужно обсудить с близкими",
    financial_decision_label: "Родители и я вместе",
    career_blockers: "Не знаю с чего начать",
    consultation_goals_label: "Понять, какие стажировки мне подходят; Получить пошаговый план",
    additional_notes: "Тестовая заявка",
    videos_watched: "3/7",
    source: "elevate-funnel",
  };
  var sheet = getSheet_();
  ensureHeaders_(sheet);
  sheet.appendRow(rowFromPayload_(sample));
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse_({ ok: false, error: "empty_body" });
    }

    var data = JSON.parse(e.postData.contents);

    if (!verifySecret_(e, data)) {
      return jsonResponse_({ ok: false, error: "unauthorized" });
    }

    var sheet = getSheet_();
    ensureHeaders_(sheet);
    sheet.appendRow(rowFromPayload_(data));

    return jsonResponse_({ ok: true });
  } catch (err) {
    Logger.log("doPost error: " + err);
    return jsonResponse_({ ok: false, error: "internal_error" });
  }
}

function doGet() {
  return jsonResponse_({ ok: true, service: "elevate-funnel-leads" });
}
