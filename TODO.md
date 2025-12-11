# TODO: Fix MySQL Connection Issue on Railway

## Completed Tasks
- [x] Configure `application-prod.properties` with Railway environment variables
- [x] Add retry logic for database connection in `DatabaseConfig.java`
- [x] Add `spring-retry` and `spring-aspects` dependencies to `pom.xml`

## Next Steps
- [ ] Deploy the application to Railway with `SPRING_PROFILES_ACTIVE=prod`
- [ ] Verify that the environment variables are set correctly in Railway:
  - MYSQLHOST=mysql.railway.internal
  - MYSQLPORT=3306
  - MYSQL_DATABASE=railway
  - MYSQLUSER=root
  - MYSQLPASSWORD=PHGGpmoqoKNyWwlIyLiqcruXUmfMSuEY
- [ ] Test the connection using `nc -vz mysql.railway.internal 3306` from the container
- [ ] Monitor the application logs for successful database connection
