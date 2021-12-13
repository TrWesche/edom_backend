Create Keys & Certificate
openssl req -x509 -newkey rsa:2048 -keyout privatekeyt.pem -out cert.pem -days 365

Get Decrypted Keys
openssl rsa -in keytmp.pem -out key.pem

Create Public Key
openssl rsa -in privatekeyt.pem -outform PEM -pubout -out publickey.pem


Pass Phrase Used: development
