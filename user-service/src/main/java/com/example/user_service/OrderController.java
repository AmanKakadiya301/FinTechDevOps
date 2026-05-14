package com.example.user_service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/orders")
    public List<Order> getAllOrders(@RequestParam(required = false) String username) {
        if (username != null && !username.isEmpty()) {
            return orderRepository.findByUsername(username);
        }
        return orderRepository.findAll();
    }

    @PostMapping("/orders")
    public org.springframework.http.ResponseEntity<?> placeOrder(@RequestBody Order order) {
        if (order.getType() == null) order.setType("BUY");
        if (order.getTimestamp() == null) order.setTimestamp(java.time.LocalDateTime.now());
        if (order.getPrice() == null) order.setPrice(100.0);
        if (order.getQuantity() == null) order.setQuantity(10);
        
        List<Order> userOrders = orderRepository.findByUsername(order.getUsername());
        
        double currentBalance = 100000.0;
        int currentHoldings = 0;
        
        for (Order o : userOrders) {
            double total = (o.getPrice() != null ? o.getPrice() : 100.0) * (o.getQuantity() != null ? o.getQuantity() : 10);
            if ("BUY".equalsIgnoreCase(o.getType())) {
                currentBalance -= total;
                if (order.getTicker().equals(o.getTicker())) {
                    currentHoldings += o.getQuantity();
                }
            } else {
                currentBalance += total;
                if (order.getTicker().equals(o.getTicker())) {
                    currentHoldings -= o.getQuantity();
                }
            }
        }
        
        double orderTotal = order.getPrice() * order.getQuantity();
        
        if ("BUY".equalsIgnoreCase(order.getType())) {
            if (currentBalance < orderTotal) {
                return org.springframework.http.ResponseEntity.badRequest().body(Map.of("message", "Insufficient funds. Available balance: $" + currentBalance));
            }
        } else if ("SELL".equalsIgnoreCase(order.getType())) {
            if (currentHoldings < order.getQuantity()) {
                return org.springframework.http.ResponseEntity.badRequest().body(Map.of("message", "Insufficient holdings. You only own " + currentHoldings + " units of " + order.getTicker()));
            }
        }
        
        Order savedOrder = orderRepository.save(order);
        return org.springframework.http.ResponseEntity.ok(savedOrder);
    }

    @GetMapping("/portfolio")
    public Map<String, Object> getPortfolioSummary(@RequestParam(required = false) String username) {
        List<Order> orders;
        if (username != null && !username.isEmpty()) {
            orders = orderRepository.findByUsername(username);
        } else {
            orders = orderRepository.findAll();
        }
        
        double initialBalance = 100000.0;
        double currentBalance = initialBalance;

        for (Order order : orders) {
            double total = (order.getPrice() != null ? order.getPrice() : 100.0) * (order.getQuantity() != null ? order.getQuantity() : 10);
            if ("BUY".equalsIgnoreCase(order.getType())) {
                currentBalance -= total;
            } else {
                currentBalance += total;
            }
        }

        return Map.of(
            "balance", currentBalance,
            "orderCount", orders.size(),
            "status", "Healthy",
            "username", username != null ? username : "ALL"
        );
    }
}
