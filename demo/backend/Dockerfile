# ===============================
# 1️⃣ BUILD STAGE
# ===============================
FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copy Maven config
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw mvnw

# ✅ FIX: Give execute permission to mvnw
RUN chmod +x mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline

# Copy source code
COPY src src

# Build the application
RUN ./mvnw clean package -DskipTests


# ===============================
# 2️⃣ RUNTIME STAGE
# ===============================
FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /app/target/*SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
