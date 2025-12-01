# Razorpay Test Site

Simple local site to test Razorpay Checkout integration.

Setup

1. Copy `.env.example` to `.env` and fill in your Razorpay keys:

```
copy .env.example .env
# then edit .env to add your keys
```

2. Install dependencies and start server (PowerShell):

```powershell
npm install
npm start
```

3. Open `http://localhost:3000` in your browser.

Usage

- Enter an amount (INR) and click "Create & Pay".
- Checkout will open; after completing payment the page will POST to `/verify` to validate the signature.

Notes

- This is a simple test harness. For production, handle signatures, order/capture flows, error handling, and security more robustly.
