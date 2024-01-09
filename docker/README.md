# MongoDB Replica Set with Docker Compose Guide

This guide provides instructions for setting up a local MongoDB Replica Set using Docker Compose. This guide is based on the article [The Only Local MongoDB Replica Set with Docker Compose Guide You'll Ever Need](https://medium.com/workleap/the-only-local-mongodb-replica-set-with-docker-compose-guide-youll-ever-need-2f0b74dd8384).

## Prerequisites

- Make sure you have Docker installed on your machine.
- Ensure that MongoDB Database Server (MongoDB) service on Windows is stopped to avoid conflicts.

## Docker Settings

1. Open Docker Desktop.
2. Go to "Settings."
3. Navigate to the "General" tab.
4. Tick the option "Add the \*.docker.internal names to the host's etc/hosts file (Requires password)."
5. Save the changes.

## Replica Set Connection String

The three-node replica set connection string is:

```mongodb
mongodb://127.0.0.1:27017,127.0.0.1:27018,127.0.0.1:27019/?replicaSet=rs0
```
