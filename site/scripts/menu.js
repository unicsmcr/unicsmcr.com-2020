let opened = false;
const links = document.getElementById("links");
document.getElementById("menu-icon").onclick = () => {
	opened = !opened;
	if (opened) {
		links.classList.add("opened");
	} else {
		links.classList.remove("opened");
	}
}