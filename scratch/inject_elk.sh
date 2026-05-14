#!/bin/bash

SERVICES=("config-server" "eureka-server" "user-service" "order-service" "portfolio-service" "market-data" "api-gateway" "notification-service" "risk-service")

LOGBACK_CONTENT='<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <include resource="org/springframework/boot/logging/logback/base.xml"/>
    <appender name="LOGSTASH" class="net.logstash.logback.appender.LogstashTcpSocketAppender">
        <destination>${LOGSTASH_HOST:-localhost}:5044</destination>
        <encoder class="net.logstash.logback.encoder.LoggingEventCompositeJsonEncoder">
            <providers>
                <timestamp/>
                <version/>
                <message/>
                <loggerName/>
                <threadName/>
                <logLevel/>
                <logLevelValue/>
                <stackTrace/>
                <context/>
                <arguments/>
            </providers>
        </encoder>
    </appender>
    <root level="INFO">
        <appender-ref ref="CONSOLE"/>
        <appender-ref ref="LOGSTASH"/>
    </root>
</configuration>'

for SERVICE in "${SERVICES[@]}"; do
    echo "Processing $SERVICE..."
    
    # 1. Add dependency to build.gradle
    if [ -f "$SERVICE/build.gradle" ]; then
        if ! grep -q "logstash-logback-encoder" "$SERVICE/build.gradle"; then
            sed -i "/dependencies {/a \	implementation 'net.logstash.logback:logstash-logback-encoder:7.4'" "$SERVICE/build.gradle"
            echo "Added dependency to $SERVICE/build.gradle"
        fi
    fi
    
    # 2. Add logback-spring.xml
    mkdir -p "$SERVICE/src/main/resources"
    echo "$LOGBACK_CONTENT" > "$SERVICE/src/main/resources/logback-spring.xml"
    echo "Created $SERVICE/src/main/resources/logback-spring.xml"
done

echo "ELK Injection complete."
