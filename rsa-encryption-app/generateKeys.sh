mkdir keys
openssl genpkey -algorithm RSA -out keys/private.pem
openssl rsa -pubout -in keys/private.pem -out keys/public.pem
