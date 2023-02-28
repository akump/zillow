function checkDOMChange() {
    const layout = document.getElementsByClassName('layout-container');
    if (layout && layout[0] && !layout[0].chromeExtension) {
        layout[0].chromeExtension = true;
        const header = document.getElementsByClassName('side-by-side-action-bar');
        const div = document.createElement('div');
        div.id = 'myZillowStuff';
        div.style.height = '50px';
        div.innerHTML = 'Tv too high count: 0'
        header[0].appendChild(div);
    }
    console.log(layout);
    setTimeout(checkDOMChange, 100);
}

checkDOMChange();