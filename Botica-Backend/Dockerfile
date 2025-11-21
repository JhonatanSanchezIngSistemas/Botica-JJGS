# etapa de compilacion
FROM eclipse-temurin:21-jdk-alpine as build
WORKDIR /app
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src
# permisos de ejecucion y compilacion sin tests para agilizar
RUN chmod +x mvnw
RUN ./mvnw install -DskipTests

# etapa de ejecucion
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
