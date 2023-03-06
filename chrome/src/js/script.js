
function replaceZpid(zpid) {
    if (zpid.endsWith('_zpid')) {
        zpid = zpid.replace('_zpid', '');
    }
    return zpid;
}

function getZpidFromUrl() {
    const url = window.location.href.split('/');
    const zpid = replaceZpid(url.find(urlPart => urlPart.includes('zpid')));
    return zpid;
}

async function sendComment() {
    const textInputDiv = document.getElementById('textInput');
    const textSubstring = textInputDiv.value.substring(0, 160);
    appendComment(textSubstring);
    textInputDiv.value = '';

    const zpid = getZpidFromUrl();
    await fetch(`http://localhost:3000/${zpid}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
        body: JSON.stringify({ comment: textSubstring }),
    });
}

function appendComment(text) {
    const actualCommentDiv = document.createElement('div');
    actualCommentDiv.innerHTML = text.substring(0, 160);
    const commentsContainer = document.getElementById('zillowComments');
    if (commentsContainer) {
        commentsContainer.appendChild(actualCommentDiv);
    }

}

async function checkDOMChange() {
    const layout = document.getElementsByClassName('layout-container');
    if (layout && layout[0] && !layout[0].chromeExtension) {
        layout[0].chromeExtension = true;
        const containerDiv = document.createElement('div');
        containerDiv.id = 'zillowCommentsContainer';
        document.body.appendChild(containerDiv);

        const commentsDiv = document.createElement('div');
        commentsDiv.id = 'zillowComments';

        const messageContainer = document.createElement('div');
        messageContainer.id = 'zillowMessageContainer';

        const textInput = document.createElement('input');
        textInput.id = "textInput";
        const submitButton = document.createElement('button');
        submitButton.id = "submitButton";
        submitButton.innerText = "Send";

        submitButton.addEventListener("click", sendComment);
        textInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                sendComment()
            }
        });

        messageContainer.appendChild(textInput);
        messageContainer.appendChild(submitButton);


        containerDiv.appendChild(commentsDiv);
        containerDiv.appendChild(messageContainer);

        const zpid = getZpidFromUrl()
        const response = await fetch(`http://localhost:3000/${zpid}`)
        const responseJson = await response.json();
        if (responseJson.comments && responseJson.comments.length > 0) {
            for (const comment of responseJson.comments) {
                appendComment(comment);
            }

        }
    } else if (layout && layout[0] && layout[0].chromeExtension) {
        console.log('created');
    } else {
        const zillowCommentsContainer = document.getElementById('zillowCommentsContainer');
        if (zillowCommentsContainer) {
            zillowCommentsContainer.remove();
        }
    }
    setTimeout(checkDOMChange, 100);
}

checkDOMChange();