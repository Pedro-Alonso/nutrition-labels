.PHONY: run deploy build clean

run:
	@echo "Starting development server..."
	yarn start:debug

deploy:
	@echo "Deploying application..."
	$(MAKE) clean
	$(MAKE) build

build:
	@test -f .env || (echo "Missing .env file. Please create one based on .env.example." && exit 1)
	@echo "Installing dependencies..."
	yarn install
	@echo "Building the application..."
	yarn android:debug

clean:
	@echo "Removing node_modules and build artifacts..."
	rm -rf node_modules/ .expo/ android/ ios/ build/ dist/
	@echo "Project cleaned."
