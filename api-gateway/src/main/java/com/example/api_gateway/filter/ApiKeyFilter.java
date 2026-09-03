package com.example.api_gateway.filter;

import com.example.api_gateway.cache.ApiKeyValidationCache;
import com.example.api_gateway.client.AuthServiceClient;
import lombok.RequiredArgsConstructor;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class ApiKeyFilter implements GlobalFilter, Ordered {
    private final AuthServiceClient authServiceClient;
    private final ApiKeyValidationCache cache;
    private static final String PARTNER_PATH = "/api/public/courses";
    private static final String REQUIRED_SCOPE = "courses:read";

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();
        if (!path.startsWith(PARTNER_PATH)) {
            return chain.filter(exchange);
        }

        // Search in Headers (case-insensitive) and Query Params (case-insensitive)
        String apiKey = request.getHeaders().getFirst("X-API-KEY");
        if (apiKey == null || apiKey.isBlank()) {
            for (Map.Entry<String, java.util.List<String>> entry : request.getQueryParams().entrySet()) {
                if (entry.getKey().equalsIgnoreCase("x-api-key") ||
                    entry.getKey().equalsIgnoreCase("api-key") ||
                    entry.getKey().equalsIgnoreCase("api_key") ||
                    entry.getKey().equalsIgnoreCase("apikey")) {
                    if (!entry.getValue().isEmpty()) {
                        apiKey = entry.getValue().get(0);
                        break;
                    }
                }
            }
        }

        System.out.println(">>> [ApiKeyFilter] Path: " + path + " | Extracted Key: " + apiKey);

        if (apiKey == null || apiKey.isBlank()) {
            System.out.println(">>> [ApiKeyFilter] Rejected: Key is null or blank");
            return reject(exchange);
        }

        final String finalKey = apiKey;
        String cacheKey = finalKey + ":" + REQUIRED_SCOPE;
        Boolean cached = cache.get(cacheKey);
        if (cached != null) {
            System.out.println(">>> [ApiKeyFilter] Cache Hit: " + cached);
            return cached ? chain.filter(exchange) : reject(exchange);
        }

        return authServiceClient.isValidForScope(finalKey, REQUIRED_SCOPE)
                .flatMap(valid -> {
                    System.out.println(">>> [ApiKeyFilter] AuthServiceClient response for key [" + finalKey + "]: " + valid);
                    cache.put(cacheKey, valid);
                    return valid ? chain.filter(exchange) : reject(exchange);
                });
    }

    private Mono<Void> reject(ServerWebExchange exchange) {
        exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
        return exchange.getResponse().setComplete();
    }

    @Override
    public int getOrder() {
        return -2;
    }
}
