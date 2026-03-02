# Makefile for auctions-frontend
# Usage: make <target>

# Configuration
IMAGE_NAME   ?= auctions-frontend
IMAGE_TAG    ?= latest
REMOTE_USER  ?= ubuntu
REMOTE_HOST  ?= your-server.com
REMOTE_DIR   ?= /opt/docker-deploys/auctions-frontend
SSH_KEY      ?= ~/.ssh/id_rsa
VERSION      ?= $(IMAGE_TAG)

.PHONY: help dev build build-image run stop clean release deploy \
        deploy-logs deploy-restart deploy-status deploy-stop deploy-shell

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
	  awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# ── Local development ────────────────────────────────────────────────────────

dev: ## Start Next.js dev server
	pnpm dev

build: ## Build Next.js for production (pnpm build)
	pnpm build

build-image: ## Build Docker image (reads build.env for NEXT_PUBLIC_* args)
	@[ -f build.env ] || (echo "Error: build.env not found. Copy build.env.example." && exit 1)
	./build.sh $(VERSION)

# ── Release ──────────────────────────────────────────────────────────────────

release: ## Create a release tag and push to origin (usage: make release VERSION=1.2.0)
	@[ -n "$(VERSION)" ] || (echo "Error: VERSION is required. Usage: make release VERSION=1.2.0" && exit 1)
	./release.sh $(VERSION)

# ── Remote deploy ────────────────────────────────────────────────────────────

deploy: ## Deploy image to remote server via SSH (usage: make deploy REMOTE_HOST=host VERSION=1.2.0)
	@[ "$(REMOTE_HOST)" != "your-server.com" ] || \
	  (echo "Error: set REMOTE_HOST. Usage: make deploy REMOTE_HOST=myserver.com VERSION=1.2.0" && exit 1)
	@echo "Saving image $(IMAGE_NAME):$(VERSION)..."
	sudo docker save $(IMAGE_NAME):$(VERSION) | \
	  ssh -i $(SSH_KEY) $(REMOTE_USER)@$(REMOTE_HOST) \
	    "sudo docker load && sudo docker tag $(IMAGE_NAME):$(VERSION) $(IMAGE_NAME):latest"
	@echo "Restarting container on $(REMOTE_HOST)..."
	ssh -i $(SSH_KEY) $(REMOTE_USER)@$(REMOTE_HOST) \
	  "cd $(REMOTE_DIR) && sudo docker compose pull 2>/dev/null; sudo docker compose up -d --remove-orphans"
	@echo "Done. Container restarted."

deploy-logs: ## Tail remote container logs
	ssh -i $(SSH_KEY) $(REMOTE_USER)@$(REMOTE_HOST) \
	  'cd $(REMOTE_DIR) && sudo docker compose logs -f auctions-frontend'

deploy-restart: ## Restart remote container
	ssh -i $(SSH_KEY) $(REMOTE_USER)@$(REMOTE_HOST) \
	  'cd $(REMOTE_DIR) && sudo docker compose restart auctions-frontend'

deploy-status: ## Check remote container status
	ssh -i $(SSH_KEY) $(REMOTE_USER)@$(REMOTE_HOST) \
	  'cd $(REMOTE_DIR) && sudo docker compose ps'

deploy-stop: ## Stop remote containers
	ssh -i $(SSH_KEY) $(REMOTE_USER)@$(REMOTE_HOST) \
	  'cd $(REMOTE_DIR) && sudo docker compose down'

deploy-shell: ## Open a shell in the remote container
	ssh -i $(SSH_KEY) $(REMOTE_USER)@$(REMOTE_HOST) \
	  'sudo docker exec -it auctions-frontend sh'

# ── Cleanup ──────────────────────────────────────────────────────────────────

clean: ## Remove .next build output
	rm -rf .next
