# Bruk en offisiell baseimage for Java 21
FROM eclipse-temurin:21-jre-alpine

# Sett arbeidskatalog i containeren
WORKDIR /app

# Kopier JAR-filen til containeren
COPY target/monitorapp-0.0.1-SNAPSHOT.jar app.jar

# Eksponer porten som applikasjonen kjører på (juster om nødvendig)
EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
