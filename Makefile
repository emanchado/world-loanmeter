VERSION = 1.3
WIDGET_FILENAME = loanmeter-$(VERSION).zip
WIDGET_PATH = releases/$(WIDGET_FILENAME)

all: widget

widget: $(WIDGET_PATH)

$(WIDGET_PATH):
	cd widget && zip -9r ../$@ *
