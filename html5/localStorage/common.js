const addItems = document.querySelector('.add-items')// form
const itemsList = document.querySelector('.plates')// 列表
let items = [];

function addItem(e) {
    e.preventDefault();
    const text = this.querySelector('[name=item]').value.trim();
    if (!text) return;
    const item = {
        text,
        done: false
    };
    items.push(item);
    populateList(items, itemsList);
    this.reset();
}

function populateList(plates = [], platesList) {
    platesList.innerHTML = plates
        .map((plate, i) => {
            return `
                <li>
                    <label>
                        <input type="checkbox" data-index="${i}" ${plate.done ? 'checked' : ''} />
                        ${plate.text}
                    </label>
                </li>
            `;
        })
        .join('');
}

addItems.addEventListener('submit', addItem)