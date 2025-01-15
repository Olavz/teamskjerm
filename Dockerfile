FROM maven:3.9.9-eclipse-temurin-21-alpine AS build

WORKDIR /byggmappe

COPY src ./src
COPY frontend ./frontend
COPY pom.xml .

RUN mvn dependency:go-offline -B
RUN mvn clean package -DskipTests


# Bruk en offisiell baseimage for Java 21
FROM openjdk:21-slim-bullseye

# Sett arbeidskatalog i containeren
WORKDIR /app

# Kopier JAR-filen til containeren
COPY --from=build /byggmappe/target/infoskjerm-0.0.1-SNAPSHOT.jar /app/infoskjerm.jar

ENV PORT 8080

CMD ["java", "-Dserver.port=${PORT}", "-jar", "infoskjerm.jar"]

