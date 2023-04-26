# Stylish Web 

🖥️ https://appworks.csypt.me/

### Deployment

1. Install packages: ```npm install```
2. Start MySQL server
3. Import database:
    1. ```mysql -u <user_name> -p <stylish_db_name> < stylish_backend.sql```
    2. ```mysql -u <user_name> -p <stylish_test_db_name> < stylish_test.sql``` (Optional)
4. Create config: ```.env``` for back-end (You can copy the schema from template: ```.env-template```)
    1. set `DB_HOST`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE` for MySQL server (`DB_DATABASE_TEST` is Optional)
    2. set `NODE_ENV` to `development` for development
    3. set `TAPPAY_PARTNER_KEY` for cash flow (copy from your STYLiSH project)
    5. set `TOKEN_SECRET` for jwt
    6. set `BCRYPT_SALT` for password encryption (Optional)
5. Modify API_HOST destination in front-end:
    1. cd `public`
    2. modify file `src/util/Api.js`
        1. change `this.API_HOST` value to `http://localhost:3000/api/1.0`
    3. under `public` folder
        1. npm install
        2. npm run build (The five js files under `public/dist` will be modified)
6. Start a redis server in `localhost` at port `6379` (Optional, the server can still work without redis server, see ```marketing_controller.js``` for more detail)
7. Start server: ```nodemon app.js``` or ```npm run dev```
8. Clear Browser localStorage if needed. The same address will use the same space to records localStorage key-value pairs and it may conflict with mine. (Optional)

### Integration Test (Optional)

1. Import ```stylish_test.sql``` into database 
2. Set  ```DATABASE_TEST``` key to ```stylish_test``` 

#### For Macbook or Linux
3. Run integration test: ```npm run test```

#### For Windows:
3. Run integration test: ```npm run test_windows```
