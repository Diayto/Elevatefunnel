# Настройка безопасности и пиковой нагрузки (по порядку)

Делайте шаги **1 → 6** перед рекламным таргетом. Код уже поддерживает переменные из `.env.example`.

---

## 1. Upstash (распределённый лимит)

1. Зайдите на [console.upstash.com](https://console.upstash.com) → **Create database** → тип **Redis**.
2. Откройте базу → блок **REST API** → скопируйте **UPSTASH_REDIS_REST_URL** и **UPSTASH_REDIS_REST_TOKEN**.
3. В **Vercel**: проект → **Settings** → **Environment Variables** → добавьте обе переменные для **Production** (и при необходимости Preview).
4. Локально: вставьте те же значения в `.env` (файл не коммитится).
5. Сделайте **Redeploy** (Deploy → Redeploy), чтобы рантайм подхватил env.

**Без Upstash** лимит считается **в памяти каждого инстанса** — при нескольких репликах Vercel это слабее.

---

## 2. Turnstile (антиспам в production)

Код уже готов: виджет под формой, сервер проверяет токен в **`NODE_ENV=production`** (Vercel Production/Preview), если заданы **оба** ключа.

1. Войдите в [Cloudflare Dashboard](https://dash.cloudflare.com/) → слева **Turnstile** (или через меню **Zero Trust** / **Security**, в зависимости от аккаунта) → **Add widget** / **Create**.
2. **Widget name** — любое, например `elevate-apply`.
3. **Domains / Hostnames** — добавьте:
   - **боевой домен** сайта без `https://` (например `elevateinterns.com` и при необходимости `www.elevateinterns.com`);
   - для **Preview** на Vercel, если туда тоже кладёте ключи Turnstile: **`*.vercel.app`** (или конкретный `*-xxx.vercel.app`);
   - для проверки виджета локально: **`localhost`** (серверная проверка при `npm run dev` по умолчанию **выключена**, виджет можно только посмотреть).
4. Тип виджета: **Managed** (рекомендуется) — Cloudflare сам решает, когда показать интерактив.
5. После создания скопируйте:
   - **Site key** → **`NEXT_PUBLIC_TURNSTILE_SITE_KEY`** (Vercel + при желании `.env`);
   - **Secret key** → **`TURNSTILE_SECRET_KEY`** (Vercel как **Sensitive** + не светите в репозитории).
6. **Vercel** → **Settings** → **Environment Variables** → обе переменные для **Production** (и Preview, если нужна капча на превью).
7. **Deployments** → **Redeploy** последнего продакшена (обязательно: `NEXT_PUBLIC_*` попадает в клиентский бандл только при **сборке**).
8. Проверка: на проде под полями формы виден блок Cloudflare → после галочки отправляется заявка, в таблице новая строка. Ошибка «Проверка безопасности не прошла» — обновите страницу, проверьте домен в настройках виджета и redeploy.

**Без обоих ключей** капча на сайте не показывается и API её не требует.

---

## 3. Другой webhook (не Google)

Если `APPLY_WEBHOOK_URL` ведёт на другой **https**-хост (например Zapier), добавьте **точное** имя хоста в **`APPLY_WEBHOOK_EXTRA_HOSTS`** через запятую, без `https://` и без пути:

```env
APPLY_WEBHOOK_EXTRA_HOSTS=hooks.zapier.com
```

Хосты `script.google.com` и `script.googleusercontent.com` разрешены по умолчанию.

---

## 4. Vercel (сеть и злоупотребления)

Настраивается в панели Vercel (не в репозитории):

1. **Firewall** (или **Security** / **Attack Challenge** в зависимости от плана): правило для пути **`/api/apply`**, метод **POST** — например Managed Challenge или rate-based rule.
2. **Observability / Logs**: фильтр по `/api/apply`, сохранённые представления.
3. **Alerts** (если доступны на плане): порог по **5xx** или аномальный рост запросов к `/api/apply`.

Дополнительно: план с достаточным **Function Max Duration** и параллелизмом, если webhook Apps Script долго отвечает.

---

## 5. Секреты

- Ротируйте **`APPLY_WEBHOOK_SECRET`**, ключи **Turnstile** и **Upstash** после утечки или раз в квартал по политике компании.
- В Vercel отмечайте секреты как **Sensitive**, разделяйте **Production / Preview / Development**.
- Не коммитьте `.env`; для команды используйте **`.env.example`** без реальных значений.

---

## 6. Уязвимости npm

```bash
npm run security:audit
```

Исправления безопасности без ломающих откатов:

```bash
npm audit fix
```

**Не используйте** `npm audit fix --force` для Next.js — может откатить `next` на небезопасную старую мажорную версию. Оставшиеся предупреждения по зависимостям внутри `next` снимаются обновлением **Next**, когда подтянут патчи у апстрима.

---

## Краткий чеклист перед рекламой

- [ ] Upstash URL + Token в Vercel, redeploy  
- [ ] При необходимости поднять **`APPLY_RATE_LIMIT_MAX`** / окно (см. `.env.example`)  
- [ ] Turnstile: домены в Cloudflare (prod + при необходимости `*.vercel.app`) + оба ключа в Vercel + **redeploy**  
- [ ] Правило Firewall на `POST /api/apply`  
- [ ] Логи / алерты на 5xx  
- [ ] `npm audit` / `npm audit fix` без `--force`
