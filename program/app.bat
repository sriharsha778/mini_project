@echo off
cd /d "E:\temp\mini_project\backend"
start cmd /k "npm run dev"

cd /d "E:\temp\mini_project\frontend"
start cmd /k "npm run dev"

timeout /t 5
start http://localhost:5173/
