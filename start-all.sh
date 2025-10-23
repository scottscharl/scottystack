#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Starting PocketBase server...${NC}"
cd server
./pocketbase serve --http="127.0.0.1:8090" &
SERVER_PID=$!

echo -e "${BLUE}Starting React client...${NC}"
cd ../client
npm run dev &
CLIENT_PID=$!

echo -e "${GREEN}Both servers are running!${NC}"
echo -e "${GREEN}PocketBase Admin: http://localhost:8090/_/${NC}"
echo -e "${GREEN}React App: http://localhost:5173${NC}"
echo ""
echo -e "Press Ctrl+C to stop all servers"

# Trap Ctrl+C and kill both processes
trap "kill $SERVER_PID $CLIENT_PID; exit" INT

# Wait for both processes
wait
