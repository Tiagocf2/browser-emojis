const COPY_SUCCESS = "Copied to Clipboard!";
const COPY_FAILURE = "Failed to Copy :(";
const FILTER_MATCH_PERCENTAGE = 0.75;
const emojiData = libEmoji.emoji;


/* INICIALIZAÇÃO */
window.onload = () => {
    let searchbar = document.querySelector('#search');
    
    searchbar.addEventListener('input', (ev) => {
        handleSearch(searchbar.value);
    });

    addButtons();
};

function resetButtons(){
    let content = document.querySelector('#content');
    while(content.hasChildNodes()){
        content.removeChild(content.lastChild);
    }
}

function addButtons(filter = undefined){
    let content = document.querySelector('#content');
    let matchedEmojis;
    if(filter && filter.length > 0){
        matchedEmojis = emojiData.filter((emoji) => {
			for(let f_tag of filter){
				for(let e_tag of emoji.tags){
					matches = 0;
					for(let i = 0; i < e_tag.length; i++){
						if(e_tag[i] == f_tag[i]){
							matches++;
						}
					}
					if(matches != 0 && matches/f_tag.length >= FILTER_MATCH_PERCENTAGE){
						return true;
					}
				}
			}
			return false;
        });
    } else {
        matchedEmojis = emojiData;
    }

    matchedEmojis.sort((e1, e2) => {
        return e1.number - e2.number;
    });
     
    for(let e of matchedEmojis){
        let btn = document.createElement('button');
        btn["code"] = String.fromCodePoint(parseInt(e.code,16));
        btn["tags"] = e.tags;
        
        btn.addEventListener("click", () => {
            handleFooter(btn);
        });

        let icon = document.createElement('img');
        icon.setAttribute('src', libEmoji["svg-index"] + e.svg);
        btn.appendChild(icon);
        
        content.appendChild(btn);
    }
}

function handleFooter(btn){
    let footer = document.querySelector('#footer');
    let success = copyToClip(btn.code);
    if(success){
        footer.innerText = COPY_SUCCESS;
        footer.classList.remove('error');
    } else {
        footer.innerText = COPY_FAILURE;
        footer.classList.add('error');
    }

    if(!footer.classList.contains('display')){
        footer.classList.add('display');
    } else {
        footer.classList.toggle('display');
        setTimeout(()=>{footer.classList.toggle('display')}, 100);
    }
}

function copyToClip(text){
    let dummy = document.createElement('input');
    dummy.classList.add("copy");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    dummy.setSelectionRange(0, 99999);
    let success = document.execCommand("copy");
    document.body.removeChild(dummy);
    return success
}

let searchTimeout;
function handleSearch(inputText){
    let searchTags;
    if(inputText == ''){
        searchTags = inputText;
    } else {
        searchTags = inputText.split(" ");
    }

    if(searchTimeout){
        clearTimeout(searchTimeout);
    }
    searchTimeout = setTimeout(() => {
        resetButtons();
        addButtons(searchTags);
    }, 100);
}