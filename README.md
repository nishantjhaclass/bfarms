# Madhesh Fresh Eggs

A new egg-buying website based on the earlier FreshNest-style prototype, redesigned specifically for Madhesh Province, Nepal.

## Customer features
- Modern farm-to-home storefront
- Small, Medium and Large eggs
- Quantity controls
- Next-day or within-3-days delivery selection
- Madhesh Province district validation
- Local-level/municipality field with verified place suggestions
- Order number and order history
- Responsive mobile/desktop design

## Creator features
Open **Creator** in the navigation.
Demo PIN: `2580`

The creator can change:
- Small egg price
- Medium egg price
- Large egg price
- Delivery fee

The values are saved in browser `localStorage`.

## Location accuracy
Madhesh Province has 8 districts: Saptari, Siraha, Dhanusha, Mahottari, Sarlahi, Rautahat, Bara and Parsa. Government of Nepal listings show 136 local levels in the province.

The prototype validates the district but does not pretend that a browser-only site can verify a customer's exact street address. Exact address verification should be handled server-side or through a proper geocoding/address service.

## Important production note
This is a static prototype. The creator PIN is visible in the JavaScript and therefore is NOT real security. Customer orders and prices are stored only in the visitor's browser.

For a real public shop, connect the same UI to:
- a secure backend/database
- real creator authentication
- shared order management
- server-side location validation
- payment provider
- notifications/WhatsApp/SMS/email as appropriate
- HTTPS and privacy/terms pages
