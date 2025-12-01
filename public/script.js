document.getElementById('pay-btn').onclick = async function (e) {
    e.preventDefault();

    const amount = 500; // Amount in INR

    // 1. Create Order
    const response = await fetch('/create-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: amount })
    });

    const order = await response.json();

    // 2. Configure Razorpay Options
    const options = {
        "key": "YOUR_KEY_ID_HERE", // Enter the Key ID generated from the Dashboard. NOTE: This is public, but better to fetch from backend if possible or keep it here for simplicity in this demo. Ideally, don't hardcode if you can avoid it, but for client-side integration it's often visible. Wait, actually, the key is needed here.
        // Better practice: Pass the key from the backend in the /create-order response or a separate config endpoint.
        // For this simple demo, I'll fetch it or just ask user to replace it.
        // Let's fetch the key from the backend to be cleaner? Or just keep it simple.
        // Let's assume the user will replace it here or I can pass it from backend.
        // To make it easier for the user, I will modify the backend to send the key_id as well, or just let them paste it here.
        // Actually, standard practice for these simple demos often has the key in JS.
        // I'll leave a placeholder.
        "amount": order.amount,
        "currency": order.currency,
        "name": "Acme Corp",
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "order_id": order.id,
        "handler": async function (response) {
            // 3. Verify Payment
            const verifyResponse = await fetch('/verify-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature
                })
            });

            const verifyResult = await verifyResponse.json();

            if (verifyResult.status === 'success') {
                document.getElementById('message').innerText = 'Payment Successful!';
                document.getElementById('message').style.color = 'green';
            } else {
                document.getElementById('message').innerText = 'Payment Verification Failed!';
                document.getElementById('message').style.color = 'red';
            }
        },
        "prefill": {
            "name": "Gaurav Kumar",
            "email": "gaurav.kumar@example.com",
            "contact": "9000090000"
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    };

    const rzp1 = new Razorpay(options);
    rzp1.on('payment.failed', function (response) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
    });
    rzp1.open();
}
