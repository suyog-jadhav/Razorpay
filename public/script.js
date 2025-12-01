document.getElementById('pay-btn').onclick = async function (e) {
    e.preventDefault();

    try {
        const amount = 500; // Amount in INR

        // 1. Create Order
        const response = await fetch('/create-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount: amount })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || errorData.description || 'Network response was not ok');
        }

        const order = await response.json();

        const keyResponse = await fetch('/get-key');
        const keyData = await keyResponse.json();

        if (!keyData.key) {
            alert("API Key not found. Please check Vercel environment variables.");
            return;
        }

        // 2. Configure Razorpay Options
        const options = {
            "key": keyData.key,
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
            alert("Payment Failed: " + response.error.description);
        });
        rzp1.open();
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred: " + error.message);
    }
}
