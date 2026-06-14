
# Build stage
FROM eclipse-temurin:21-jdk AS build

WORKDIR /app

# Copy the Gradle wrapper, build.gradle and settings.gradle
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# Make the gradlew script executable
RUN chmod +x ./gradlew

# Copy the source code
COPY src src

# Build the application
RUN ./gradlew build --no-daemon -x test

# Runtime stage
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy the built application from the build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Environment variables for Spring Boot
ENV SPRING_DEVTOOLS_RESTART_ENABLED=false
ENV SPRING_DEVTOOLS_LIVERELOAD_ENABLED=false
ENV SPRING_DOCKER_COMPOSE_ENABLED=false

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
CMD ["java", "-jar", "app.jar"]