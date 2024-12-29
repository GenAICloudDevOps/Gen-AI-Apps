# Node.js and React Application Setup Guide

## 1. Install Node.js and npm
```bash
sudo yum install nodejs npm -y
```

## 2. Install Node Version Manager (nvm)
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```
Downloads and configures nvm in shell environment

## 3. Configure Shell
```bash
source ~/.bashrc
```

## 4. Install and Configure Node.js
```bash
nvm install 20
nvm use 20
```

## 5. Verify Installation
```bash
node --version  # Should show v20.x.x
npm --version   # Should show v10.x.x or higher
```

## 6. Create React Application
```bash
npx create-react-app streamlit-host
cd streamlit-host
```

## 7. Initialize and Install Dependencies
```bash
npm init -y
npm install
```

## 8. Additional Required Dependencies and update project files
## Project Structure
```
streamlit-host/
├── src/
│   ├── App.js            # Main application component
│   ├── index.js          # Application entry point
│   └── index.css         # Main stylesheet
├── postcss.config.js     # PostCSS configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── package.json          # Project configuration
```

## 9. Build and Run
```bash
npm run build   # Creates production build
npm start       # Starts development server
```

## Error Handling
- If nvm command not found: Restart terminal or run `source ~/.bashrc`
- If permission errors: Ensure sudo privileges
- If port conflicts: Modify PORT in .env file