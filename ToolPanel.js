class ToolPanel extends EventTarget {
	constructor() {
		super();
		this.buttons = [];
		this.checkedMode = InteractionMode.AREAS;
		this.lastPlayerCheckedMode = InteractionMode.AREAS
		this.onselectionchanged = () => {};

		const buttonIds = ["areamode", "speedmode", "wardmode", "erasemode"];
		buttonIds.forEach((id) => {
			let newButton = this._getButtonById(id);

			//unique check
			newButton.addEventListener("checkedchanged", () => {
				this.buttons
					.filter(
						//do not uncheck this (we cant insert in front of inner callbacks)
						(button) => button.element.id != newButton.element.id
					)
					.forEach((button) => {
						//uncheck others
						button.setChecked(false,false);
					});
				this.onselectionchanged();
			});
			this.buttons.push(newButton);
		});
	}

	setCheckedMode(mode) {
		this.buttons.find(
			(button) => (button.id = convertInteractionModeToToolButtonId(mode))
		).setChecked(true);
		//TODO: нужно триггерить весь пул онкликов или по-другому обрабатывать в контейнере
	}

	//returns a ToolButton (or proper inheritor) object with added onClick callback
	_getButtonById(id) {
		let object;
		switch (id) {
			case "wardmode":
				object = new WardButton(
					id,
					() => {
						warder.type = WardType.SENTRY;
					},
					() => {
						warder.type = WardType.OBSERVER;
					}
				);

				object.setOnToggleOn(() => {
					warder.isFocused = true;
					playerTable.uncheckAll()
					this.checkedMode = convertToolButtonIdToInteractionMode(id);
				});

				object.setOnToggleOff(() => {
					warder.isFocused = false;
				});
				break;
			case "erasemode":
				object = new ToolButton(id);

				object.setOnToggleOn(() => {
					eraser.isFocused = true;
					playerTable.uncheckAll()
					this.checkedMode = convertToolButtonIdToInteractionMode(id);
				});

				object.setOnToggleOff(() => {
					eraser.isFocused = false;
				});
				break;
			case "areamode":
				object = new ToolButton(id);

				object.setOnToggleOn(() => {
					this.checkedMode = convertToolButtonIdToInteractionMode(id);
					this.lastPlayerCheckedMode = InteractionMode.AREAS;
				});

				object.setOnToggleOff(() => {});
				break;
			case "speedmode":
				object = new ToolButton(id);

				object.setOnToggleOn(() => {
					this.checkedMode = convertToolButtonIdToInteractionMode(id);
					this.lastPlayerCheckedMode = InteractionMode.MS;
				});

				object.setOnToggleOff(() => {});
				break;
		}
		return object;
	}
}

class ToolButton extends EventTarget {
	static checkedStyle = "scale(0.8)";
	static uncheckedStyle = "scale(1)";

	constructor(id) {
		super();
		this.element = document.getElementById(id);
		this._checked = false;
		this.checkChangedEvent = new Event("checkedchanged");
		this._onClickPoll = [];
		this._onToggleOn = () => {};
		this._onToggleOff = () => {};
		this.addOnClick(() => {
			this.setChecked(true);
		});
		this.element.onclick = () => {
			this._onClickPoll.forEach((callback) => {
				callback();
			});
		};
	}

	addOnClick(callback) {
		this._onClickPoll.push(callback);
	}

	setOnToggleOn(callback) {
		this._onToggleOn = callback;
	}

	setOnToggleOff(callback) {
		this._onToggleOff = callback;
	}

	setChecked(value, emit = true) {
		if (value == this._checked) return;

		if (value) {
			this._onToggleOn();
			this.element.style.transform = ToolButton.checkedStyle;
		} else {
			this._onToggleOff();
			this.element.style.transform = ToolButton.uncheckedStyle;
		}
		this._checked = value;
		if (emit) this.dispatchEvent(this.checkChangedEvent);
	}
}

class WardButton extends ToolButton {
	//basically we need this con only to override onclick to change bg, but we also should specify action for each mode, so to keep loose coupling it recieves lambdas as parameter
	constructor(id, onsentry, onobs) {
		super(id);
		this._onClickPoll.unshift(() => {
			if (this._checked) {
				if (this.element.getAttribute("state") == "obs") {
					this.element.setAttribute("state", "sentry");
					this.element.style.background =
						"url(media/sentry_wards.png)";
					onsentry();
				} else {
					this.element.setAttribute("state", "obs");
					this.element.style.background =
						"url(media/observer_wards.png)";
					onobs();
				}
			}
			this.setChecked(true);
		});
	}
}
