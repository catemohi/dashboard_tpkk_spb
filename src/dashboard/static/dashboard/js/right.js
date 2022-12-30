// changet heme
const themeToggler = document.querySelector(".theme-toggler");
const menuBtn = document.querySelector(".menu-btn");

themeToggler.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme-var');

    themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
    themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');
    
    if (themeToggler.querySelector('span:nth-child(2)').classList.contains('active')) {
        document.cookie = "theme=dark; path=/;";
    } else {
        document.cookie = "theme=white; path=/;";
    }

})

// show sidebar
menuBtn.addEventListener('click', () => {
    sideMenu.style.display = 'block';
})

//close sidebar
closeBtn.addEventListener('click', () => {
    sideMenu.style.display = 'none';
})


if (localStorage.layoutSwitch === 'true') {
    document.body.classList.toggle('dark-theme-var');
    themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
    themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');
}

function fadeIn(el, speed) {
	// Fade in block
	var step = 1 / speed;
	var interval = setInterval(function() {
		if (+el.style.opacity >= 1)
			clearInterval(interval);
			
		el.style.opacity = + el.style.opacity + step;
	}, speed / 1000);
}

function start_chat_ws() {
	let url = 'ws://' + window.location.hostname + ':80/ws/log/';
	let socket = new WebSocket(url);
	let notification_box = document.querySelector('.right .recent-updates .updates');

	socket.onmessage = function(event){
	// Processing new messages in the group
		let notify = JSON.parse(event.data)
		createNotify(notify, notification_box);
	};

	socket.onclose = function(){
	// Try to reconnect in 5 seconds
	setTimeout(function() {start_chat_ws()}, 5000);
	};
};

function createNotify(notify, notifyParent) {
	// Creating a new block
	let update_item = document.createElement('div');
	update_item.className = "update";
	update_item.style.opacity = "0";

	let img_box = document.createElement('div');
	img_box.className = "profile-photo";
	img = document.createElement('img');
	// let img_link determined from django template
	img.src = img_link

	let message = document.createElement('div');
	message.className = "message";

	let text = document.createElement('p');
	let name_hendler = document.createElement('b');
	text.innerText = notify.text;
	let time = document.createElement('small');
	time.className = "text-muted";
	time.innerText = notify.time;

	message.appendChild(text);
	message.appendChild(time);
	img_box.appendChild(img)
	update_item.appendChild(img_box);
	update_item.appendChild(message);
	notifyParent.insertBefore(update_item, notifyParent.firstElementChild);
	fadeIn(update_item, 200);
};
function parsingInt(textString) {
    return parseInt(textString.replace(/^(0$|-?[1-9]\d*(\.\d*[1-9]$)?|-?0\.\d*[1-9])$/, ''));
};


function changeAnalytics() {
    let Analytics = [document.querySelector(".sl-first-line"),
                     document.querySelector(".sl-vip-line"),
                     document.querySelector(".sl-general"),
                     document.querySelector(".mttr"),
                     document.querySelector(".flr")];


    Analytics.forEach(function modifyPercentRatings(module) {
        let RatingObjs =  [module.querySelector(".rating_to_nominal *"),
                           module.querySelector(".rating_to_comparison *")];

        RatingObjs.forEach(function modifyRating(ratingObj) {
            let valueRating = parsingInt(ratingObj.textContent);
            if (valueRating > 0) {
                ratingObj.textContent = "> на " + Math.abs(valueRating) + "%";
                ratingObj.classList.add("danger");
            } else if (valueRating < 0){
                ratingObj.textContent = "< на " + Math.abs(valueRating) + "%";
                ratingObj.classList.add("success");
            }
            else {
                //pass
            }
        });

        let daylySL = module.querySelector(".dayly_sl *")
        if (daylySL != null) {
            let valueSL= parsingInt(daylySL.textContent);
			// minSuccessSL прописана в контексте base.html и тянется с БД
            if (valueSL >= minSuccessSL) {
                daylySL.classList.add("success");
            }
            else {
                daylySL.classList.add("danger");
            }
        }

        let numWorkedAfterDeadline = module.querySelector(".num_worked_after_deadline *")
        if (numWorkedAfterDeadline != null) {
            let valueWorkedAfterDeadline= +numWorkedAfterDeadline.textContent;
            if (valueWorkedAfterDeadline > 0) {
                numWorkedAfterDeadline.classList.add("danger");
            }
        }
    });
};
changeAnalytics();
start_chat_ws();