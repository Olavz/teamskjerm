FROM maven:3.9.9-eclipse-temurin-21-alpine AS build

WORKDIR /app

COPY . .

RUN mvn dependency:go-offline -B
RUN mvn clean package -DskipTests


# Bruk en offisiell baseimage for Java 21
FROM eclipse-temurin:21-jre-alpine

# Sett arbeidskatalog i containeren
WORKDIR /app

# Kopier JAR-filen til containeren
COPY --from=build /app/target/infoskjerm-0.0.1-SNAPSHOT.jar /app/infoskjerm.jar

ENTRYPOINT ["java", "-jar", "infoskjerm.jar"]

EXPOSE 8080
