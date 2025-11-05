# 1. Maven + JDK 17 이미지 기반 빌드
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# 프로젝트 복사 및 패키징
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# 2. 실제 런타임 (경량 JDK)
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app

# 위에서 빌드한 jar 복사
COPY --from=build /app/target/*.jar app.jar

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "app.jar"]
