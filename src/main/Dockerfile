# Use an official Maven image as a parent image
FROM maven:3.8.3-openjdk-17 AS build

# Set the working directory
WORKDIR /workspace

# Copy the Maven build file and source code
COPY pom.xml ./pom.xml
COPY src ./src

# Run Maven to download dependencies and build the application
RUN mvn dependency:go-offline -B
RUN mvn package -Dquarkus.package.type=uber-jar -DskipTests

# Create a new image with only the necessary runtime dependencies
FROM openjdk:17-jdk-slim

# Set the working directory
WORKDIR /app

# Copy the built jar file from the build stage
COPY --from=build /workspace/target/CryptoDrink2-1.0-runner.jar ./app.jar

# Expose the port on which the application will run
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
