# 🧠 Notion Clone - In Progress

## Project Scope

I’m fully aware that **Notion** is a massive, feature-rich product.  
This project is just a **minimal MVP clone** built with:


- Workspaces (personal & team)  
- Notes with 2 block types  
- Basic nesting support  
- Real-time updates with WebSockets  

The purpose here is **learning system design and backend integration**,  
not building a production-ready Notion replacement.


## Architecture Note

This project follows a **service-oriented design** with separate modules for Authentication, Users, Workspaces, and Notes.  
While the services are split logically, communication currently happens through **REST APIs**.  

In production-grade **microservices architectures**, services typically communicate asynchronously via message brokers such as **Kafka** or **RabbitMQ** to achieve better scalability, resilience, and decoupling.  

For this MVP, the goal was to focus on **clear service separation and backend integration** rather than implementing the full microservices stack. 
Future iterations could extend this by introducing event-driven communication.

## ✅ Features (in progress)
- [x] Authentication and Session services (JWT, Refresh Tokens)
- [x] User services
- [x] Workspace services
- [ ]  Notes services

## 📦 Tech Stack
- Backend: Node.js, Express.js
- Databases: MongoDB, PostgreSQL, Redis
- Observability: Sentry
- Architecture: Microservices + DDD

## 🚧 Current Status
Currently building the backend final Notes service. Frontend will start soon.


