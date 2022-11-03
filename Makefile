# Put any command that doesn't create a file here (almost all of the commands)
.PHONY: \
	beautify

usage:
	@echo "Available commands:"
	@echo "beautify..........................Format javascript files"

beautify:
	@find . -type f -name "*.jsx" -exec js-beautify -r -X {} +
