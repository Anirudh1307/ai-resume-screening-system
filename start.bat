@echo off
setlocal

cd /d "%~dp0"

echo ==========================================
echo   AI Resume Screening System Launcher
echo ==========================================
echo.

set "NPM_CMD=npm.cmd"

set "PYTHON_CMD="
python --version >nul 2>&1
if not errorlevel 1 (
    set "PYTHON_CMD=python"
)

if "%PYTHON_CMD%"=="" (
    py -3 --version >nul 2>&1
    if not errorlevel 1 (
        set "PYTHON_CMD=py -3"
    )
)

if "%PYTHON_CMD%"=="" (
    echo [ERROR] Python was not found in PATH.
    echo Please install Python and try again.
    goto :end
)

where %NPM_CMD% >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm.cmd was not found in PATH.
    echo Please install Node.js and try again.
    goto :end
)

set "VENV_DIR="
if exist "venv\Scripts\activate.bat" (
    set "VENV_DIR=venv"
) else if exist ".venv\Scripts\activate.bat" (
    set "VENV_DIR=.venv"
)

if "%VENV_DIR%"=="" (
    echo [WARN] Virtual environment not found.
    echo [INFO] Creating virtual environment in venv...
    %PYTHON_CMD% -m venv venv
    if errorlevel 1 (
        echo [ERROR] Failed to create the virtual environment.
        goto :end
    )
    set "VENV_DIR=venv"
)

echo [INFO] Activating virtual environment...
call "%VENV_DIR%\Scripts\activate.bat"
if errorlevel 1 (
    echo [ERROR] Failed to activate the virtual environment.
    goto :end
)

if exist "requirements.txt" (
    echo [INFO] Checking Python dependencies...
    python -m pip show uvicorn >nul 2>&1
    if errorlevel 1 (
        echo [INFO] Installing dependencies from requirements.txt...
        python -m pip install --upgrade pip
        python -m pip install -r requirements.txt
        if errorlevel 1 (
            echo [ERROR] Dependency installation failed.
            goto :end
        )
    ) else (
        echo [INFO] Dependencies already look available. Skipping install.
    )
) else (
    echo [WARN] requirements.txt not found. Skipping dependency installation.
)

set "APP_TARGET="
if exist "main.py" (
    set "APP_TARGET=main:app"
) else if exist "backend\main.py" (
    set "APP_TARGET=backend.main:app"
)

if "%APP_TARGET%"=="" (
    echo [ERROR] Could not find FastAPI entrypoint.
    echo Expected either main.py or backend\main.py
    goto :end
)

if exist "frontend\package.json" (
    echo.
    echo [INFO] Preparing frontend...
    if not exist "frontend\node_modules" (
        echo [INFO] Installing frontend dependencies...
        pushd frontend
        call %NPM_CMD% install
        if errorlevel 1 (
            popd
            echo [ERROR] Frontend dependency installation failed.
            goto :end
        )
        popd
    ) else (
        echo [INFO] Frontend dependencies already look available. Skipping install.
    )

    echo [INFO] Launching frontend on http://127.0.0.1:5173 ...
    start "Resume Screening Frontend" /D "%~dp0frontend" cmd /k "%NPM_CMD% run dev"
) else (
    echo [WARN] frontend\package.json not found. Frontend will not be started.
)

echo.
echo [INFO] Starting backend on http://127.0.0.1:8000 ...
echo [INFO] Command: uvicorn %APP_TARGET% --reload
echo.

uvicorn %APP_TARGET% --reload

if errorlevel 1 (
    echo.
    echo [ERROR] Server stopped with an error.
) else (
    echo.
    echo [INFO] Server stopped.
)

:end
echo.
pause
endlocal
