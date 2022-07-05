class ToolPanel extends EventTarget{
	constructor(buttonIds) {
		this.buttons = []
		this.checkedMode = PlayerInteractionMode.AREA
		buttonIds.forEach((id)=>{
			const newButton = new ToolButton(document.getElementById(id))

			buttons.push(newButton)
		}
	}
}

class ToolButton extends EventTarget{
	static checkedStyle = "trandform: scale(0.8);";
	constructor(id) {
		this.element = document.getElementById(id);
		this._checked = false;
		this.checkedChangedEvent = new Event("checkedchanged")

		this.element.onclick = ()=>{
			this._checked = !this._checked
			this.dispatchEvent(this.checkedChangedEvent)
		}
	}

}
