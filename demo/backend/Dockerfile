# ===============================
# 1️⃣ BUILD STAGE
# ===============================
FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copy Maven config first (for caching)
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline

# Copy source code
COPY src src

# Build Spring Boot jar
RUN ./mvnw clean package -DskipTests


# ===============================
# 2️⃣ RUNTIME STAGE
# ===============================
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy built jar from build stage
COPY --from=build /app/target/*SNAPSHOT.jar app.jar

# Expose Spring Boot port
EXPOSE 8082

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]
