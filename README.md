	•	iOS App: Encrypts and sends data securely to the server.
	•	EJS Web Page: Collects client data, encrypts it using Web Crypto API, and sends it to the server.
	•	Express Server: Decrypts incoming data, validates timestamp and nonce, and processes the payload.

This setup ensures secure and validated communication between clients and your server.

To implement a secure system that allows both an iOS app and an EJS-rendered web page to:
	•	Register and authenticate users via OAuth,
	•	Submit URLs along with tags and comments,
	•	Store all interactions in a MariaDB database,

we’ll design a comprehensive solution encompassing the database schema, backend API, EJS frontend, and iOS integration.

Secure Data Transmission Overview

Data to Transmit:
	•	appGuid: Unique identifier for the application.
	•	userId: Identifier for the user.
	•	location: Latitude and longitude coordinates.
	•	localTime: Client’s local time in ISO 8601 format.
	•	url: Current page URL.

Security Measures:
	•	Encryption: Use AES-GCM symmetric encryption with a shared secret key.
	•	Timestamp: Prevent replay attacks by ensuring requests are timely.
	•	Nonce: Unique identifier for each request to prevent duplication.