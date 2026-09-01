# Design System — Axioledger

> Tài liệu spec bổ sung dựa trên kết quả Audit UI Kit (2026-08-30).  
> Xem báo cáo đầy đủ: [`../audit/audit-ui-kit.md`](../audit/audit-ui-kit.md)

---

## Cấu trúc thư mục

```
design-system/
├── tokens/
│   ├── color-tokens.md       ← Semantic color tokens (Light & Dark mode)
│   ├── typography-tokens.md  ← Line-height, letter-spacing, token mapping
│   ├── variables.css         ← CSS Custom Properties (import icon-tokens.css)
│   └── icon-tokens.css       ← Icon color/size tokens + .icon CSS utility classes  ← NEW
├── guidelines/
│   ├── dark-mode.md          ← CSS data-theme approach
│   ├── accessibility.md      ← WCAG AA, contrast matrix
│   ├── icon-usage.md         ← Cách dùng SVG icon nội bộ (không dùng emoji ngoài)  ← NEW
│   └── icon-catalog.md       ← Toàn bộ 919 icons phân loại theo 23 nhóm            ← NEW
├── components/
│   ├── buttons.md            ← 4 sizes × 5 states × 3 types
│   ├── inputs.md             ← Text, Search, OTP, Checkbox, Radio, Dropdown, Date Picker
│   ├── modals.md             ← Modal Dialog & Bottom Sheet
│   ├── feedback.md           ← Toast, Alert, Empty State, Skeleton, Progress, Tooltip
│   └── crypto.md             ← Asset Card, QR Code, Transaction Item, Balance Display
└── guidelines/
    ├── dark-mode.md          ← Nguyên tắc & checklist Dark Mode
    └── accessibility.md      ← WCAG AA, contrast ratio, touch targets
```

---

## Trạng thái triển khai

| File | Ưu tiên | Trạng thái |
|---|---|---|
| `tokens/color-tokens.md` | 🔴 Cao | ✅ Spec xong |
| `tokens/typography-tokens.md` | 🔴 Cao | ✅ Spec xong |
| `components/buttons.md` | 🔴 Cao | ✅ Spec xong |
| `components/inputs.md` | 🔴 Cao | ✅ Spec xong |
| `components/modals.md` | 🔴 Cao | ✅ Spec xong |
| `components/feedback.md` | 🟡 Trung bình | ✅ Spec xong |
| `components/crypto.md` | 🔴 Cao | ✅ Spec xong |
| `guidelines/dark-mode.md` | 🟡 Trung bình | ✅ Spec xong |
| `guidelines/accessibility.md` | 🟡 Trung bình | ✅ Spec xong |

---

## Lộ trình thực thi trên máy chủ

### Giai đoạn 1 — Foundation (Tuần 1–2)
1. Import [`tokens/variables.css`](tokens/variables.css) vào entry point — thay thế toàn bộ hard-code hex
2. Bổ sung line-height & letter-spacing bằng utility class `.text-*` từ variables.css
3. Chạy contrast audit: `npx axe-cli http://localhost:3000` — fix Button Yellow/Greeny text color

### Giai đoạn 2 — Core Components (Tuần 3–5)
4. Xây `components/button.css` — 4 sizes × 5 states × 3 types dùng CSS variables
5. Xây `components/input.css` — Text · Password · Search · OTP
6. Xây `components/modal.css` + `components/bottom-sheet.css`

### Giai đoạn 3 — Feedback & Crypto (Tuần 6–8)
7. `components/toast.css` + `components/alert.css`
8. `components/empty-state.css` + `components/skeleton.css`
9. `components/crypto-card.css` + `components/qr-display.css`

### Giai đoạn 4 — Polish (Tuần 9–10)
10. `components/tooltip.css` + `components/progress.css`
11. Avatar component
12. Kiểm tra dark mode: bật `data-theme="dark"` trên `<html>`, review toàn bộ
13. Chạy accessibility audit cuối: `npx axe-cli`

---

## Icon System

- **Vị trí:** `asset/icon/`
- **Linear (outline):** `asset/icon/linear/` — 920 SVG
- **Bold (solid):** `asset/icon/bold/` — 980 SVG
- **Frame chuẩn:** 24×24px, safe area 20×20px (padding 2px mỗi cạnh)
- **Color:** Dùng token `icon/primary`, `icon/secondary`, `icon/brand`
- **Naming:** `Icon/{Category}/{Name}/{Style}` (VD: `Icon/Crypto/Bitcoin/Linear`)
