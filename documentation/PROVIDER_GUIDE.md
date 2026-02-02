# 📘 PROVIDER DOCUMENTATION
*(Mess / Tiffin Service Provider Module)*

## 1️⃣ Provider Kya Hota Hai?
**Provider** wo hota hai jo:
- Khana banata hai 🍳
- Tiffin prepare karta hai 🍱
- Admin ke set kiye rules ke according orders fulfill karta hai ✅

📌 **Core Concept**: Provider system ka **execution part** hota hai, **decision part** nahi.

---

## 2️⃣ Provider Ka Role (Real Life)
> “Admin plan banata hai, customer order karta hai, **provider khana bana ke ready karta hai**.”

---

## 3️⃣ Provider Onboarding Flow
Provider ko **Admin** hi add karta hai.
**Admin Provider Add Karte Time:**
- Provider Name
- Mess / Kitchen Name
- Mobile Number
- Address
- Service Area
- Active / Inactive status

👉 **Provider khud register nahi karta.**

---

## 4️⃣ Provider Login System
- Provider ko **ID + Password** milta hai.
- Login ke baad **sirf provider related access** hota hai.
- Admin panel ka access nahi hota.

🔐 **Security:**
- JWT / Session based login.
- Logout pe session destroy.

---

## 5️⃣ Provider Dashboard (Core Screen)
Provider dashboard pe ye info hoti hai:
- Aaj ke **Total Orders** 📊
- **Lunch / Dinner** tiffin count 🍲
- **Pending / Ready** status ⏳
- **Admin messages / alerts** 📢

---

## 6️⃣ Orders Management (MOST IMPORTANT)
Provider kya dekhta hai:
- Date-wise orders
- Meal type (Lunch / Dinner)
- Quantity (Total tiffin)

📌 **Example:**
| Date | Meal | Quantity |
|:---|:---|:---|
| 10 Aug | Lunch | 80 Tiffin |
| 10 Aug | Dinner | 45 Tiffin |

❌ **Provider customer details edit nahi karta.**

---

## 7️⃣ Tiffin Preparation Status
Provider order ka status update karta hai:
1.  **Pending** 🔴
2.  **Preparing** 🟡
3.  **Ready** 🟢

📌 Isse **admin** aur **delivery system** ko pata chalta hai:
*“Khane ki preparation complete ho chuki hai”*

---

## 8️⃣ Menu Access (Read Only)
Provider:
- Aaj ka menu dekh sakta hai.
- Weekly menu dekh sakta hai.

❌ **Menu change nahi karta**
❌ **Item add/remove nahi karta**
👉 Menu **sirf admin set karta hai**.

---

## 9️⃣ Pause / Skip Handling
Provider:
- **Pause ki list sirf dekhta hai**.
- Skip wale customers ke liye khana nahi banata.

📌 **Benefit:**
- Food waste kam hota hai.
- Quantity accurate rehti hai.

---

## 🔟 Schedule & Timing
Provider:
- Admin ke set kiye **timing follow karta hai**.
- Lunch / Dinner time ka dhyan rakhta hai.

❌ **Provider timing change nahi karta.**

---

## 1️⃣1️⃣ Reports (Limited)
Provider sirf ye dekh sakta hai:
- Daily tiffin count
- Monthly total orders

❌ **Revenue** (Not Visible)
❌ **Customer payments** (Not Visible)
❌ **Profit/Loss** (Not Visible)

---

## 1️⃣2️⃣ Notifications & Messages
Provider ko admin se milte hain:
- Menu updates 🍛
- Quantity change alerts ⚠️
- Holiday / off day info 📅

---

## 1️⃣3️⃣ Provider Restrictions (Very Important)
🚫 Customer add/edit/delete
🚫 Plan create/change
🚫 Price update
🚫 Payment manage
🚫 System settings

👉 **Ye sab ADMIN ke under aata hai.**

---

## 1️⃣4️⃣ Admin–Provider Relationship
- Ek Admin → Multiple Providers
- Ek Provider → Multiple Customers
- **Provider admin ke under kaam karta hai.**

---

## 1️⃣5️⃣ Real Life Example
Ek city me 5 mess hain. Sab ka khana alag-alag provider banata hai. Admin centrally sab manage karta hai.

---

## 1️⃣6️⃣ Summary & Interview Lines 🔥
**Short:**
> “Provider handles food preparation and order execution only.”

**Detailed:**
> “The provider module is responsible for preparing tiffins based on admin-defined menus and customer orders, without access to payments or system controls.”

🧠 **FINAL SUMMARY**
*   **Provider** = Execution 🍳
*   **Admin** = Control 🛠️
*   **Customer** = Consumer 😋
