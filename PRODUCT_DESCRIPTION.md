# Fleet Parts Dashboard - Kompletny Opis Aplikacji

## 🎯 CO TO JEST?

**Fleet Parts Dashboard** (FleetManager) to aplikacja webowa do zarządzania flotą pojazdów i monitorowania kosztów części zamiennych. System automatycznie importuje zamówienia z InterCars API, śledzi wydatki, alarmuje o przekroczeniach budżetu i pomaga menedżerom przypisywać zamówienia do konkretnych pojazdów.

---

## 👥 DLA KOGO JEST TA APLIKACJA?

### ✅ Główni Użytkownicy

**1. Menedżerowie Floty (Managers)**
- Osoby zarządzające pojazdami w jednym lub wielu oddziałach
- Odpowiedzialne za kontrolę kosztów części zamiennych
- Używają aplikacji codziennie na tabletach
- Przykład: Manager z Wrocławia zarządza 50 pojazdami, musi wiedzieć które pojazdy przekraczają budżet

**2. Administratorzy Systemu (Admins)**
- Osoby zarządzające całą flotą (wszystkie oddziały)
- Ustawiają limity budżetowe
- Tworzą konta dla menedżerów
- Przypisują menedżerów do oddziałów
- Mają dostęp do wszystkich danych

### ❌ DLA KOGO NIE JEST

- **Małe firmy z 1-5 pojazdami** - za zaawansowane, overkill
- **Indywidualni właściciele aut** - system dla flot firmowych
- **Firmy bez API InterCars** - aplikacja wymaga integracji z InterCars
- **Firmy bez struktury oddziałów** - system zakłada model z branch management
- **Użytkownicy końcowi (kierowcy)** - to narzędzie dla zarządzających, nie kierowców

---

## 🏢 KONTEKST BIZNESOWY

### Jaki Problem Rozwiązuje?

**Problem #1: Chaos w zamówieniach części**
- Firma ma 150+ pojazdów w 4 oddziałach
- Dziennie wpływa kilkadziesiąt zamówień z InterCars
- W komentarzu do zamówienia jest numer rejestracyjny ("WRO KA 12345 - olej silnikowy")
- **Ale:** AI nie zawsze wyciąga poprawnie numer tablicy
- **Efekt:** 200+ zamówień czeka na ręczną weryfikację

**Problem #2: Brak kontroli budżetu**
- Manager nie wie które pojazdy przekraczają limit wydatków
- Dowiaduje się o tym dopiero na koniec miesiąca
- Brak alertów w czasie rzeczywistym

**Problem #3: Nieefektywne zarządzanie wieloma oddziałami**
- Manager Wrocławia musi widzieć tylko pojazdy z Wrocławia
- Admin musi widzieć wszystko
- Brak systemu uprawnień = problemy z danymi

### Jak Aplikacja To Rozwiązuje?

**Rozwiązanie #1: Kolejka Oczekujących (Pending Queue)**
- Wszystkie zamówienia bez przypisanego pojazdu trafiają do kolejki
- Manager widzi je w jednej tabeli, posortowane od najstarszych
- Jedno kliknięcie → wybiera pojazd → gotowe
- **Cel:** < 30 sekund na rozwiązanie jednego case'a

**Rozwiązanie #2: Real-time Budget Alerts**
- System liczy wydatki na każdy pojazd w bieżącym miesiącu
- Alert przy 90% limitu (żółty)
- Alert przy 100% limitu (czerwony)
- Dashboard pokazuje wszystko na pierwszy rzut oka

**Rozwiązanie #3: Multi-Branch Access Control**
- Każdy manager widzi TYLKO swoje oddziały
- Admin widzi wszystko
- Row Level Security w bazie danych = zero szans na wycieki

---

## ⚙️ CO DOKŁADNIE ROBI APLIKACJA?

### 1. Import Zamówień z InterCars

**Jak to działa:**
- InterCars API wysyła dane o nowym zamówieniu
- Webhook trafia do Edge Function w Supabase
- System parsuje dane: ID zamówienia, data, kwota, pozycje, komentarz
- AI próbuje wyciągnąć numer rejestracyjny z komentarza
- Jeśli sukces → zamówienie przypisane automatycznie
- Jeśli fail → trafia do kolejki `pending_orders`

**Co zapisuje:**
```
Zamówienie IC-123456
- Data: 2026-02-01
- Oddział: Wrocław (WRD)
- Kwota brutto: 450 PLN
- Komentarz: "WRO KA 12345 olej + filtry"
- Pozycje: 3 różne części
- Status: pending (czeka na weryfikację)
```

### 2. Kolejka Oczekujących (Pending Queue)

**Dlaczego istnieje:**
- AI nie rozpoznał numeru tablicy
- Komentarz niejasny ("pojazd #5" - który to?)
- Brak komentarza w ogóle
- Duplikat zamówienia

**Jak manager to rozwiązuje:**

**Opcja A: Przypisanie do pojazdu (90% przypadków)**
1. Manager widzi komentarz: "WRO KA 12345 olej"
2. Wpisuje w search: "WRO KA"
3. Wybiera pojazd z listy
4. Klik "Przypisz"
5. System aktualizuje:
   - `orders.vehicle_id` = wybrany pojazd
   - `pending_orders.resolved` = true
   - Dodaje kwotę do wydatków pojazdu

**Opcja B: Oznacz jako "Non-Vehicle" (8% przypadków)**
- "Papier do drukarki" - to nie pojazd
- "Narzędzia warsztatowe" - to wyposażenie
- Klik "Non-Vehicle" → znika z kolejki, nie liczy się do budżetu pojazdów

**Opcja C: Dismiss (2% przypadków)**
- Duplikat
- Błąd w systemie InterCars
- Anulowane zamówienie

**Priorytety:**
- Najstarsze zamówienia na górze
- Te z > 7 dni są podświetlone na czerwono
- Główny wskaźnik: "Oczekuje weryfikacji: 53"

### 3. Monitoring Budżetu

**Jak działa system limitów:**

**Setup (Admin):**
- Admin ustawia domyślny limit: 1000 PLN/miesiąc per pojazd
- Może ustawić custom limity dla specific pojazdów
- Np. pojazd dostawczy: 1500 PLN, auto osobowe: 800 PLN

**Tracking:**
- System sumuje WSZYSTKIE zamówienia przypisane do pojazdu w bieżącym miesiącu
- Używa view `vehicle_monthly_spending` dla wydajności
- Liczy brutto (z VAT)

**Alerty:**
```
Pojazd: WRO KA 12345 (Mercedes Sprinter)
Limit: 1000 PLN
Wydatki MTD: 950 PLN
Status: ⚠️ 95% limitu - ALERT!
```

**Co się dzieje przy alertach:**
- 90-99%: Żółta kartka na dashboardzie
- 100%+: Czerwona kartka + pojawia się w "Budget Alerts"
- Manager dostaje notyfikację (opcjonalne, faza 3)

**Reset:**
- 1. dnia miesiąca liczniki resetują się do 0
- Historia pozostaje (audit trail)

### 4. Dashboard Overview

**Co widzi Manager po zalogowaniu:**

**Top Cards:**
```
[Oczekuje weryfikacji: 53] [Aktywne pojazdy: 48] [Wydatki MTD: 45,230 PLN]
```

**Wykres wydatków (Last 6 months):**
- Słupki pokazujące total spending per miesiąc
- Tylko dla oddziałów managera (WRO + KTW)
- Trend: rośnie/spada

**Top 10 Vehicles (This Month):**
```
1. DJ 2025C - Mercedes Sprinter - Katowice - 1,450 PLN (3 zamówienia) 🔴
2. DJ 2026C - Mercedes Sprinter - Wrocław - 1,200 PLN (5 zamówień) 🔴
3. DJ 0142P - Koege 524 - Wrocław - 890 PLN (2 zamówienia)
...
```

**Recent Pending (Last 5):**
- Mini-tabela z najnowszymi oczekującymi
- Quick access do resolution

### 5. Vehicles Page

**Pełna lista pojazdów:**

**Kolumny:**
- Nr Rejestracyjny (searchable)
- Marka & Model
- Rok produkcji
- Oddział
- Status (Aktywny/Nieaktywny)
- Wydatki MTD
- % limitu

**Filtry:**
- Search po tablicy: "WRO KA"
- Filter by oddział: Wrocław / Katowice / All
- Filter by status: Aktywne / Nieaktywne / All
- Sort: po wydatkach, alfabetycznie, etc.

**Akcje:**
- Klik na wiersz → detail page
- "Dodaj pojazd" (tylko admin)
- "Dezaktywuj" (sprzedany/wycofany)

### 6. Vehicle Detail Page

**Co pokazuje dla pojazdu DJ 2025C:**

**Header:**
```
Mercedes Sprinter (2015)
DJ 2025C
Katowice
Status: Aktywny
```

**Budget Card:**
```
Wydatki w lutym 2026: 1,450 PLN / 1,000 PLN (145%) 🔴
```

**Order History (Last 12 months):**
Tabela wszystkich zamówień:
```
Data       | InterCars ID | Opis                  | Kwota
2026-02-01 | IC-123456    | Olej + filtry        | 450 PLN
2026-01-28 | IC-123401    | Klocki hamulcowe     | 380 PLN
2026-01-15 | IC-122998    | Opony zimowe         | 620 PLN
...
```

**Chart:**
- Wykres wydatków per miesiąc dla tego pojazdu (12 months)

### 7. Settings (Admin Only)

**Budget Configuration:**
- Default limit dla wszystkich pojazdów
- Custom limity per pojazd (override default)

**User Management:**
- Lista wszystkich użytkowników (admins + managers)
- Dodaj nowego użytkownika:
  - Email
  - Rola (Admin / Manager)
  - Jeśli Manager: wybierz oddziały (multi-select checkboxes)
- Zmień hasło
- Wyświetlanie przypisanych oddziałów jako badges

**Branch Info:**
- Lista oddziałów (nazwa, kod, liczba pojazdów)

### 8. Statistics Page (Admin Only)

**Branch Comparison:**
- Tabela porównująca wszystkie oddziały:
```
Oddział    | Pojazdy | Wydatki MTD | Avg per pojazd | Przekroczenia
Wrocław    | 50      | 48,500 PLN  | 970 PLN        | 5 (10%)
Katowice   | 35      | 32,100 PLN  | 917 PLN        | 2 (6%)
Jelenia G. | 15      | 15,600 PLN  | 1,040 PLN      | 3 (20%)
...
```

**Wykresy:**
- Spending per branch (pie chart)
- Trend over time per branch (multi-line chart)

---

## 🔐 SYSTEM UPRAWNIEŃ (RLS)

### Role w Systemie

**Admin:**
- Widzi WSZYSTKIE oddziały
- Może zarządzać użytkownikami
- Może zmieniać limity budżetowe
- Pełny dostęp do statystyk

**Manager:**
- Widzi TYLKO przypisane oddziały (np. Wrocław + Katowice)
- NIE widzi innych oddziałów (Jelenia Góra, Legnica)
- Może rozwiązywać pending orders w swoich oddziałach
- Może przeglądać pojazdy i wydatki w swoich oddziałach
- NIE może zarządzać użytkownikami
- NIE może zmieniać limitów budżetowych

### Jak Działa Bezpieczeństwo?

**Row Level Security (RLS) w PostgreSQL:**

**Przykład dla tabeli `vehicles`:**
```sql
-- Policy dla adminów
CREATE POLICY "Admins see all vehicles"
ON vehicles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Policy dla managerów
CREATE POLICY "Managers see assigned branch vehicles"
ON vehicles FOR SELECT
USING (
  branch_id IN (
    SELECT branch_id FROM manager_branches
    WHERE profile_id = auth.uid()
  )
);
```

**Co to znaczy w praktyce:**
- Manager zalogowany jako User ID `abc-123`
- Ma assigned branches: Wrocław, Katowice (w tabeli `manager_branches`)
- Query: `SELECT * FROM vehicles`
- **PostgreSQL automatycznie filtruje:** zwraca TYLKO pojazdy z Wrocławia i Katowic
- Manager nigdy nie zobaczy pojazdów z Jeleniej Góry
- **Zero szans na obejście** - to jest na poziomie bazy danych, nie aplikacji

**Podobne RLS dla:**
- `orders` - managers widzą tylko zamówienia ze swoich oddziałów
- `order_items` - przez join z orders
- `pending_orders` - tylko pending items ze swoich oddziałów

---

## 🚫 CZEGO APLIKACJA NIE ROBI?

### Funkcje Które NIE Istnieją

❌ **Nie zarządza serwisami mechanicznymi**
- To nie system warsztatowy
- Nie ma kalendarza przeglądów
- Nie śledzi historii napraw (tylko części)

❌ **Nie zarządza paliwem**
- Nie ma kart paliwowych
- Nie śledzi zużycia paliwa
- Nie ma integracji ze stacjami benzynowymi

❌ **Nie zarządza kierowcami**
- Nie ma listy kierowców
- Nie przypisuje kierowców do pojazdów
- Nie śledzi godzin pracy

❌ **Nie ma GPS trackingu**
- Nie ma live location pojazdów
- Nie ma historii tras
- Nie ma geofencing

❌ **Nie generuje raportów PDF**
- (Jeszcze nie - faza 3)
- Na razie tylko widoki w aplikacji

❌ **Nie wysyła email notyfikacji**
- (Jeszcze nie - faza 3)
- Na razie tylko in-app alerts

❌ **Nie ma integracji z innymi dostawcami części**
- TYLKO InterCars API
- Jeśli firma kupuje od innego dostawcy - trzeba ręcznie dodać

❌ **Nie ma mobile app (iOS/Android)**
- Tylko web app
- Responsive design dla tabletów
- Ale nie native mobile app

❌ **Nie ma offline mode**
- Wymaga internetu
- Jeśli brak łącza - aplikacja nie działa

❌ **Nie ma AI predictions**
- Nie przewiduje kiedy pojazd będzie potrzebował części
- Nie ma machine learning
- Tylko reactive tracking (co już się stało)

### Ograniczenia Techniczne

⚠️ **Wymaga InterCars API**
- Bez API nie ma automatycznego importu
- Trzeba mieć umowę z InterCars

⚠️ **Wymaga Supabase**
- Backend jest na Supabase
- Nie można hostować samemu bez zmian

⚠️ **Tylko język polski**
- UI tylko po polsku
- Zakłada polski format tablic rejestracyjnych

⚠️ **Limit 500+ zamówień/miesiąc**
- System jest wydajny do tego poziomu
- Powyżej trzeba optymalizacji

⚠️ **Brak multi-tenancy**
- Jedna instancja = jedna firma
- Nie ma systemu dla wielu firm w jednej bazie

---

## 🏗️ JAK TO DZIAŁA POD MASKĄ?

### Architektura

**Frontend:**
- Next.js 16 (App Router)
- React Server Components
- Shadcn/ui (komponenty UI)
- Tailwind CSS (styling)
- TypeScript (strict mode)

**Backend:**
- Supabase:
  - PostgreSQL database (dane)
  - Auth (logowanie)
  - Edge Functions (webhooks, API)
  - Row Level Security (uprawnienia)

**Hosting:**
- Vercel (frontend)
- Supabase Cloud (backend)

### Kluczowe Tabele w Bazie

**`vehicles`** (150+ rekordów)
```
id, plate_number, brand, model, year, branch_id, is_active
DJ 2025C, Mercedes, Sprinter, 2015, [wrocław_id], true
```

**`orders`** (500+/miesiąc)
```
id, intercars_id, order_date, vehicle_id, total_gross, branch_id, status
[uuid], IC-123456, 2026-02-01, [vehicle_id], 450.00, [wrocław_id], resolved
```

**`order_items`** (3000+/miesiąc)
```
id, order_id, sku, name, total_gross, vehicle_id
[uuid], [order_id], "12345", "Olej 5W30", 120.00, [vehicle_id]
```

**`pending_orders`** (0-200 w dowolnym momencie)
```
id, order_id, resolved, resolved_at, resolved_by
[uuid], [order_id], false, null, null
```

**`branches`** (4 rekordy)
```
id, name, code
[uuid], "Wrocław", "WRD"
```

**`profiles`** (10-50 użytkowników)
```
id, role, email
[user_id], "manager", "jan.kowalski@firma.pl"
```

**`manager_branches`** (junction table)
```
id, profile_id, branch_id
[uuid], [jan_kowalski_id], [wrocław_id]
[uuid], [jan_kowalski_id], [katowice_id]
```

### Kluczowe Views (Pre-computed)

**`vehicle_monthly_spending`**
- Per pojazd, per miesiąc
- Total spending
- Używane w dashboardzie (wydajne!)

**`unresolved_pending_orders`**
- Wszystkie pending orders z JOIN do orders
- Już aggregate data
- Filtrowanie po branch_id

**`vehicles_over_budget`**
- Lista pojazdów które przekroczyły limit
- Used in alerts

**`branch_statistics`**
- Statystyki per oddział
- Total pojazdy, total spending, avg

### Flow: Od InterCars do Dashboard

**Step 1: InterCars wysyła webhook**
```
POST /api/intercars/webhook
{
  "order_id": "IC-123456",
  "date": "2026-02-01",
  "total": 450.00,
  "branch": "WRD",
  "comment": "WRO KA 12345 olej + filtry",
  "items": [...]
}
```

**Step 2: Edge Function przetwarza**
```typescript
// Parsowanie danych
const order = parseInterCarsWebhook(payload)

// AI extraction numeru tablicy
const plateNumber = extractPlateNumber(order.comment)

if (plateNumber) {
  // Znajdź pojazd w bazie
  const vehicle = await findVehicleByPlate(plateNumber)
  
  if (vehicle) {
    // Auto-assign
    await assignOrderToVehicle(order.id, vehicle.id)
  } else {
    // Nie znaleziono → pending
    await createPendingOrder(order.id)
  }
} else {
  // AI nie rozpoznał → pending
  await createPendingOrder(order.id)
}
```

**Step 3: Zapis do bazy**
```sql
-- Insert order
INSERT INTO orders (intercars_id, order_date, total_gross, branch_id, vehicle_id, ...)
VALUES ('IC-123456', '2026-02-01', 450.00, [wro_id], NULL, ...);

-- Insert items
INSERT INTO order_items (order_id, sku, name, total_gross, ...)
VALUES ([order_id], '12345', 'Olej 5W30', 120.00, ...);

-- If not matched → pending
INSERT INTO pending_orders (order_id, resolved, ...)
VALUES ([order_id], false, ...);
```

**Step 4: Dashboard query**
```typescript
// Manager logs in
const userId = await supabase.auth.getUser()

// Get manager's branches
const { data: branches } = await supabase
  .from('manager_branches')
  .select('branch_id')
  .eq('profile_id', userId)

const branchIds = branches.map(b => b.branch_id)

// Get pending count (RLS auto-filters!)
const { count } = await supabase
  .from('unresolved_pending_orders')
  .select('*', { count: 'exact', head: true })
  .in('branch_id', branchIds)

// Display: "Oczekuje weryfikacji: 53"
```

**Step 5: Resolution**
```typescript
// Manager assigns to vehicle
async function resolvePending(orderId, vehicleId) {
  await supabase.rpc('resolve_pending_order', {
    p_order_id: orderId,
    p_vehicle_id: vehicleId,
    p_resolved_by: currentUserId
  })
  
  // RPC internals:
  // 1. UPDATE orders SET vehicle_id = p_vehicle_id
  // 2. UPDATE pending_orders SET resolved = true, resolved_by = p_resolved_by
  // 3. Recalculate vehicle_monthly_spending
}
```

---

## 📊 TYPOWY DZIEŃ UŻYCIA

### Manager - Morning Routine (8:00)

1. **Login**
   - Otwiera tablet
   - logs in: jan.kowalski@firma.pl

2. **Dashboard Check**
   - Widzi: "Oczekuje weryfikacji: 53" 🔴
   - Widzi: "Budget alerts: 3" ⚠️
   - Oh no!

3. **Resolve Alerts First**
   - Klik "Budget Alerts"
   - Widzi: DJ 2025C at 145% limitu
   - Sprawdza detail page - aha, wymiana opon zużyła budżet
   - Akceptuje (nic nie może zrobić, opony były konieczne)

4. **Pending Queue**
   - Klik "Do weryfikacji"
   - Sortuje: najstarsze first
   - Pierwsza pozycja: komentarz "WRO KA 12345 olej"
   - Search: "WRO KA" → znajduje pojazd
   - Przypisuje → Done (30 sekund)
   - Następna pozycja: "narzędzia warsztatowe"
   - Oznacza jako "Non-Vehicle" → Done (15 sekund)
   - Repeat 20x w ciągu 15 minut
   - Kolejka: 53 → 33

5. **Vehicle Review**
   - Sprawdza Top 10 Vehicles
   - Widzi że kilka pojazdów zbliża się do limitu
   - Robi notatki do raportu dla szefa

### Admin - Monthly Setup (1st of month)

1. **Login**
   - Dostęp do all branches

2. **Budget Review**
   - Settings → Budget
   - Sprawdza limity
   - Pojazd DJ 2025C często przekracza → zwiększa limit z 1000 na 1200 PLN

3. **Statistics Review**
   - Klik "Statystyki"
   - Porównuje oddziały
   - Widzi: Jelenia Góra ma 20% pojazdów over budget
   - Dzwoni do managera Jeleniej Góry

4. **User Management**
   - Nowy manager w Katowicach
   - Settings → Users → Add User
   - Email: anna.nowak@firma.pl
   - Role: Manager
   - Branches: ✓ Katowice
   - Save → wysłany email z zaproszeniem

---

## 🎨 UX/UI PHILOSOPHY

### Design Principles

**1. Mobile-First (Tablet)**
- Fleet managers używają tabletów w biurze
- Wszystko musi działać na minimum 768px width
- Touch-friendly buttons (min 44x44px)

**2. Speed > Beauty**
- Pending queue musi być FAST
- Minimalizacja kliknięć
- Autofocus na search fields
- Keyboard shortcuts (future)

**3. Visual Hierarchy**
```
🔴 RED = Urgent (over budget, old pending)
🟡 YELLOW = Warning (approaching limit)
🟢 GREEN = OK (resolved, under budget)
🔵 BLUE = Neutral (actions, info)
```

**4. Polish Language**
- Wszystkie labele po polsku
- Kod w angielskim (best practice)
- Currency: always PLN with space (450 PLN nie 450PLN)

**5. Consistent Components**
- Shadcn/ui library
- Cards for summaries
- Tables for data
- Badges for tags (branches, status)

---

## 📈 METRYKI SUKCESU

**Aplikacja jest sukcesem jeśli:**

✅ **Pending Queue Resolution Time < 30s**
- Manager rozwiązuje case w < 30 sekund
- Obecnie: ~25s average

✅ **Zero Budget Surprises**
- Managers wiedzą o przekroczeniach REAL-TIME
- Nie dowiadują się na koniec miesiąca

✅ **System handles 500+ orders/month**
- Bez slowdowns
- Queries < 200ms

✅ **Mobile Experience Smooth**
- Działa płynnie na tablet
- No janky animations

✅ **Zero Security Breaches**
- RLS prevents data leaks
- Managers widzą TYLKO swoje oddziały

---

## 🚧 ROADMAP (Nie Zaimplementowane)

### Phase 3 (Future)

**Email Notifications**
- Alert gdy pojazd przekracza 90% limitu
- Daily summary pending queue
- Weekly/monthly reports

**CSV Export**
- Export pending queue
- Export vehicle spending
- Export branch statistics

**Advanced Filtering**
- Filter pending by date range
- Filter vehicles by brand/model
- Filter by spending range

**API for Third Parties**
- Webhook outgoing (when order resolved)
- REST API dla integracji

**Multi-language**
- English version
- German version (dla firm międzynarodowych)

---

## 🏁 PODSUMOWANIE

**Fleet Parts Dashboard to aplikacja dla średnich/dużych firm z flotą 50+ pojazdów**, które:
- Kupują części z InterCars
- Mają strukturę oddziałów
- Potrzebują kontroli budżetu
- Chcą zautomatyzować przypisywanie zamówień

**Główne wartości:**
1. **Szybkość** - < 30s resolution time
2. **Kontrola** - real-time budget alerts
3. **Bezpieczeństwo** - RLS-based uprawnienia
4. **Prostota** - minimalizacja kliknięć

**Nie jest to:**
- System warsztatowy
- Fleet management all-in-one
- GPS tracking
- System dla małych firm

**Status:** MVP Complete, gotowe do wdrożenia multi-branch access na produkcję.
