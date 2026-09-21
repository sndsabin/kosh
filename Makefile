.PHONY: setup setup_git_config fmt fmt_check typecheck dev dev-firefox build build-firefox zip zip-firefox clean help

# setup
setup:
	@make setup_git_config
	@echo "[INFO] Installing dependencies..."
	npm install
	@echo "[OK] Setup complete"

# configure git config
setup_git_config:
	@echo "[INFO] Configuring git..."
	chmod +x .githooks/*
	git config core.hooksPath .githooks
	@echo "[OK] Git hooks enabled."
	
	git config commit.template .gitmessage
	@echo "[OK] Git commit template set."

# format code
fmt:
	@echo "[INFO] Formatting ..."
	npm run format

# check formatting
fmt_check:
	@echo "[INFO] Checking formatting..."
	@if ! npm run format:check; then \
		echo "[X] Frontend files are not formatted. Run 'make fmt'"; \
		exit 1; \
	fi
	@echo "[OK] Formatting OK!"

# run typecheck
typecheck:
	@echo "[INFO] Checking type..."
	npm run compile

	@echo "[OK] Typecheck OK!"

# run in development mode
dev:
	@make setup
	npm run dev

# run in development mode in firefox
dev-firefox:
	@make setup
	npm run dev:firefox

# build the extension
build:
	npm run build

# build the extension for firefox
build-firefox:
	npm run build:firefox

# create a distributable extension archive
zip:
	npm run zip

# create a distributable extension archive for firefox
zip-firefox:
	npm run zip:firefox

# clean build artifacts
clean:
	rm -rf .output/
	rm -rf dist

# help command
help:
	@echo "Available commands:"
	@echo "  make dev            	Run in development mode"
	@echo "  make dev-firefox       Run in development mode (in firefox)"
	@echo "  make fmt            	Format code"
	@echo "  make typecheck  	 	Run typecheck"
	@echo "  make build    		 	Build the extension"
	@echo "  make build-firefox  	Build the extension for firefox"
	@echo "  make zip            	Create a distributable extension archive"
	@echo "  make zip:firefox    	Create a distributable extension archive for firefox"
	@echo "  make clean          	Clean build artifacts"