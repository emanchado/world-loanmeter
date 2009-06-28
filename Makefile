VERSION = 3.0a
WIDGET_FILENAME = loanmeter-$(VERSION).zip
WIDGET_PATH = releases/$(WIDGET_FILENAME)

all: widget

widget: $(WIDGET_PATH)

$(WIDGET_PATH):
	cd widget && zip -9r ../$@ *
