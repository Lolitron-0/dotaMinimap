
class ToolPanel extends EventTarget{
	constructor() {
		this.buttons = []
		this.checkedMode = PlayerInteractionMode.AREA
		this.selectedChangedEvent = new Event("selectedchanged")
		
		const buttonIds = ["areamode","speedmode","wardmode","erasemode"]
		buttonIds.forEach((id)=>{
			const newButton = new ToolButton(document.getElementById(id))
			
			newButton.addOnClick(()=>{ 
				this.buttons.forEach((button)=>{
					setChecked(false) // TODO
				})
			}, true)
			buttons.push(newButton)
		}
	}
}

class ToolButton extends EventTarget{
	static checkedStyle = "scale(0.8)";
	static uncheckedStyle = "scale(1)";
	constructor(id) {
		this.element = document.getElementById(id);
		this._checked = false;
		this.onClickPoll = []
		this.addOnClick(()=>{
			this.setChecked(true);
		})
		this.element.onclick = ()=>{
			this.onClickPoll.forEach((callback)=>{
				callback();
			})
		}
	}

	addOnClick(callback, toFront = false){
		if(toFront) this.onClickPoll.unshift(callback)
		else this.onClickPoll.push(callback);
	}

	setChecked(value){
		if(value == this._checked) return;
	
		if(value) this.element.style.transform = ToolButton.checkedStyle;
		else this.element.style.transform = ToolButton.uncheckedStyle;
		this._checked = value; 
	}
}



class WardButton extends ToolButton {
	//basically we need this con only to override onclick to change bg, but we also should specify action for each mode, so to keep loose coupling it recieves lambdas as parameter
	constructor(id, onsentry, onobs){
		super(id);
		this.addOnClick(()=>{
			if(this._checked){
				if(this.element.getAttribute("state") == "obs"){
					button.setAttribute("state", "sentry");
					button.style.background = "url(media/sentry_wards.png)";
					onsentry();
				} else {
					button.setAttribute("state", "obs");
					button.style.background = "url(media/observer_wards.png)";
					onobs();

				}
			}
			this.setChecked(true);
		}, true)

		
	}
}


