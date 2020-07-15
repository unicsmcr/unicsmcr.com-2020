function onSubmit(token) {
	const form = document.getElementById("email-form");
	const heading = document.getElementById("email-h1");
	const paragraph = document.getElementById("email-p");
	const button = document.getElementById("email-submit");

	button.style.display = 'none';

	const data = new FormData(form);
	fetch('./.netlify/functions/email', {
			method: 'post',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: data.get('name'),
				email: data.get('email'),
				message: data.get('message'),
				'g-recaptcha-response': data.get('g-recaptcha-response'),
				to: 'unics:core'
			})
	})
	.then(res => {
		return res.text().then(txt => {
			if (res.ok) {
				form.style.display = 'none';
				heading.innerText = 'Success!';
				paragraph.innerText = 'Your email has been sent, we hope to reply soon!';
				heading.scrollIntoView();
			} else {
				return Promise.reject(new Error(txt));
			}
		});
	})
	.catch(err => {
		console.log(err);
		form.style.display = 'none';
		heading.innerText = 'An error occurred';
		paragraph.innerText = 'We were unable to send your email, please try again later.';
		heading.scrollIntoView();
	});
}

function precaptcha() {
	grecaptcha.execute();
	return false;
}

(function() {
	let recaptchaTag = document.createElement('script');
	recaptchaTag.type = 'text/javascript';
	recaptchaTag.src = 'https://www.google.com/recaptcha/api.js';
	let loadedRecaptcha = false;
	function loadRecaptcha() {
		if (loadedRecaptcha) return;
		loadedRecaptcha = true;
		console.log('loading reCAPTCHA');
		document.getElementsByTagName('head')[0].appendChild(recaptchaTag);
	}
	for (const el of document.getElementById('email-form').children) {
		el.addEventListener('focus', loadRecaptcha);
	}
})();
