BIN = `npm bin`

SRC_JS = $(shell find src -name "*.js")
DIST_JS = $(patsubst src/%.js, dist/%.js, $(SRC_JS))

$(DIST_JS): dist/%.js: src/%.js
	@mkdir -p $(dir $@)
	@$(BIN)/babel $< -o $@

# Task: js
# Builds distribution JS files for publishing to npm.
js: $(DIST_JS)
