Create Keys & Certificate
openssl req -x509 -newkey rsa:2048 -keyout keytmp.pem -out cert.pem -days 365

Get Decrypted Keys
openssl rsa -in keytmp.pem -out key.pem

Pass Phrase Used: development