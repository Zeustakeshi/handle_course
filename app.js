class Api {
    constructor() {
        this.Api = `http://localhost:3000/couses`;
    }
    async getData() {
        const res = await fetch(this.Api);
        const data = await res.json();
        return data;
    }
    async postData(data) {
        await fetch(this.Api, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
    }
    async patchData(data, index) {
        await fetch(`${this.Api}/${index}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
    }
    async deleteData(index) {
        await fetch(`${this.Api}/${index}`, {
            method: 'DELETE',
        });
    }
}

class App extends Api {
    constructor() {
        super();
        this.localData = [];
        this.root = document.querySelector('#root');
        this.buttonAddCourse = this.createElement(
            'button',
            '',
            'Add courses'
        );
        this.buttonAddCourse.classList = 'btn btn-primary btn-add-courses';
        this.buttonAddCourse.setAttribute('data-bs-toggle', 'modal');
        this.buttonAddCourse.setAttribute(
            'data-bs-target',
            '#addCoursesModal'
        );
        this.cousresHtml = this.createElement('div');
        this.cousresHtml.classList = 'list-cousres-container';
        this.listOptions = this.createElement('div');
        this.listOptions.classList = 'list-group list-opiton';
        this.root.append(
            this.buttonAddCourse,
            this.cousresHtml,
            this.listOptions
        );
    }
    createElement(tagName, className, textContent) {
        const ele = document.createElement(tagName);
        if (className) {
            ele.classList.add(className);
        }
        if (textContent) {
            ele.textContent = textContent;
        }
        return ele;
    }
    getDataFromModal(inputClassNames, isClear) {
        let result = {};
        for (let i in inputClassNames) {
            const ele = document.querySelector(`.${inputClassNames[i]}`);
            if (ele.type === 'text') {
                result[i] = ele.value;
                if (isClear) {
                    ele.value = '';
                }
            } else {
                result[i] = ele.checked;
                if (isClear) {
                    ele.checked = false;
                }
            }
        }
        return result;
    }
    setDataFromModal(inputClassNames, data) {
        for (let i in inputClassNames) {
            const ele = document.querySelector(`.${inputClassNames[i]}`);
            if (ele.type === 'text') {
                ele.value = data[i];
            } else {
                ele.checked = data[i];
            }
        }
    }
    rederModal(modalName, title, modalBody, options) {
        const html = `<div class="modal fade" id="${modalName}Modal" tabindex="-1" aria-labelledby="${modalName}Label" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="${modalName}Label">${title}</h5>
                        <button type="button" class="btn-close"  data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        ${modalBody}
                    </div>
                    <div class="modal-footer">
                        ${
                            options.close
                                ? `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="button" class="btn btn-primary btn-${options.method}">${options.method}</button>`
                                : `<button type="button" class="btn btn-primary " data-bs-dismiss="modal">${options.method}</button>`
                        }
                        
                    </div>
                </div>
            </div>
        </div>`;
        this.root.insertAdjacentHTML('afterbegin', html);
    }
    async addLocalData() {
        const data = await this.getData();
        this.localData = [...data];
    }
    async renderCourses() {
        const cousres = this.localData;
        const html = cousres.reduce((pre, cur, index) => {
            return (
                pre +
                `<div class="cousres-card ${
                    cur.bestSeller ? 'is-bestSeller' : ''
                }">
                    <div class="cousres-card-header"><img src="https://source.unsplash.com/random/${index}" alt="" class="cousres-img"></div>
                    <div class="cousres-card-content">
                        <div class="cousres-title">${cur.name}</div>
                        <div class="cousres-author">${cur.author}</div>
                        <div class="cousres-price">${
                            cur.price
                        }<span>đ</span></div>
                        <div class="cousres-buy-amount">
                            <ion-icon name="people-sharp"></ion-icon>
                            ${cur.buyAmount}
                        </div>
                        <div class="cousres-best-seller">
                            <img src="./img/best_seller.svg" alt="" srcset="">
                        </div>
                        <div class="btn-buy-now" data-bs-target="#buyModal"" data-bs-toggle="modal" >Buy Now</div>
                    </div>
                </div> `
            );
        }, '');
        this.cousresHtml.innerHTML = html;
    }
    addModal() {
        this.handleRenderAddCourse();
        this.handdleRenderBuySuccess();
        this.handleRenderChangeCourse();
        const htmlOptionsChange = `
        <div class="list-opiton-change list-opiton-item" data-bs-target="#changeCoursesModal" data-bs-toggle="modal" >
            <img src="./img/control-fix-setting_108715.svg" alt="" srcset="">
            Change 
        </div>`;
        const htmlOptionsRemove = `
        <div class="list-opiton-remove list-opiton-item" >
            <img src="./img/trash_bin_icon-icons.com_67981.svg" alt="" srcset="">
            Remove
        </div>`;
        this.listOptions.innerHTML = htmlOptionsChange + htmlOptionsRemove;
    }
    handleRightClick() {
        this.options = document.querySelector('.list-opiton');
        window.addEventListener('contextmenu', (e) => {
            if (e.target.matches('.cousres-card')) {
                this.options.style = `
                display:block;
                top: ${e.pageY}px;
                left: ${e.pageX}px;`;
                e.preventDefault();
                // aa is list course (return nodeList)
                const aa = this.cousresHtml.childNodes;
                // index is current course when right and open option
                const currentCourse = [...aa].find((aa) => aa === e.target);
                this.rightClickCurrenrCourse = currentCourse;
                this.rightClickCurrentIndex =
                    [...aa].indexOf(currentCourse) / 2;
                return false;
            }
            return false;
        });
        document.addEventListener('click', (e) => {
            this.options.style = `display:none`;
            return false;
        });
        return false;
    }
    handleRenderAddCourse() {
        const flieds = [
            {
                filedName: 'Name',
                inputType: 'text',
                placeholder: 'Enter Name',
                label: false,
            },
            {
                filedName: 'Author',
                inputType: 'text',
                placeholder: 'Enter Author Name',
                label: false,
            },
            {
                filedName: 'Price',
                inputType: 'text',
                placeholder: 'Enter Price',
                label: false,
            },
            {
                filedName: 'BuyAmount',
                inputType: 'text',
                placeholder: 'Enter Buy Amount',
                label: false,
            },
            {
                filedName: 'BestSeller',
                inputType: 'checkBox',
                placeholder: 'Enter Buy Amount',
                label: 'Best Seller',
            },
        ];
        const modalBody = flieds.reduce((a, b) => {
            if (!b.label) {
                return (
                    a +
                    `<div class="input-group input-group-sm mb-3">
                        <input type="${b.inputType}" class="form-control input${b.filedName}" placeholder="${b.placeholder}" >
                    </div>`
                );
            } else {
                return (
                    a +
                    ` <div class="form-check form-switch input-group-sm mb-3 ">
                        <input class="form-check-input input${b.filedName}" type="${b.inputType}" role="switch" id="input${b.filedName}">
                        <label class="form-check-label" for="input${b.filedName}">${b.label}</label>
                    </div>`
                );
            }
        }, '');
        this.rederModal('addCourses', 'Add Courses', modalBody, {
            close: true,
            method: 'add',
        });
    }
    handdleRenderBuySuccess() {
        const modalBody = `Thanh You !!!
        <img src="./img/heart_love_smiley_icon_123396.svg" alt="" srcset="" class="icon-happy">`;
        this.rederModal('buy', 'Buy Successfully', modalBody, {
            close: false,
            method: 'ok',
        });
    }
    handleRenderChangeCourse() {
        const flieds = [
            {
                filedName: 'ChangeName',
                inputType: 'text',
                placeholder: 'Enter New Name',
                label: false,
            },
            {
                filedName: 'ChangeAuthor',
                inputType: 'text',
                placeholder: 'Enter New Author Name',
                label: false,
            },
            {
                filedName: 'ChangePrice',
                inputType: 'text',
                placeholder: 'Enter New Price',
                label: false,
            },
            {
                filedName: 'ChangeBuyAmount',
                inputType: 'text',
                placeholder: 'Enter New Buy Amount',
                label: false,
            },
            {
                filedName: 'ChangeBestSeller',
                inputType: 'checkBox',
                placeholder: 'Enter New Buy Amount',
                label: 'Best Seller',
            },
        ];
        const modalBody = flieds.reduce((a, b) => {
            if (!b.label) {
                return (
                    a +
                    `<div class="input-group input-group-sm mb-3">
                        <input type="${b.inputType}" class="form-control input${b.filedName}" placeholder="${b.placeholder}">
                    </div>`
                );
            } else {
                return (
                    a +
                    ` <div class="form-check form-switch input-group-sm mb-3 ">
                        <input class="form-check-input input${b.filedName}" type="${b.inputType}" role="switch" id="input${b.filedName}">
                        <label class="form-check-label" for="input${b.filedName}">${b.label}</label>
                    </div>`
                );
            }
        }, '');
        this.rederModal('changeCourses', 'Change Courses', modalBody, {
            close: true,
            method: 'change',
        });
    }
    handleEvent() {
        this.handleRightClick();
        document.addEventListener('click', (e) => {
            // click btn add from modal add course
            if (e.target.matches('.btn-add')) {
                this.handleAddCourse();
            }
            // click option change course  from  list option
            else if (e.target.matches('.list-opiton-change')) {
                this.handleChangeCourse();
            }
            // click btn add from modal add course
            else if (e.target.matches('.btn-change')) {
                const index = this.rightClickCurrentIndex;
                const data = this.getDataFromModal({
                    name: 'inputChangeName',
                    author: 'inputChangeAuthor',
                    price: 'inputChangePrice',
                    buyAmount: 'inputChangeBuyAmount',
                    bestSeller: 'inputChangeBestSeller',
                });
                this.patchData(data, index + 1);
                this.localData[index] = data;
                this.renderCourses();
                // click option remove course  from  list option
            } else if (e.target.matches('.list-opiton-remove')) {
                this.handleRemoveCourse();
            } else {
                return false;
            }
        });
    }
    handleAddCourse() {
        const data = this.getDataFromModal(
            {
                name: 'inputName',
                author: 'inputAuthor',
                price: 'inputPrice',
                buyAmount: 'inputBuyAmount',
                bestSeller: 'inputBestSeller',
            },
            true
        );
        this.postData(data);
        this.localData.push(data);
        this.renderCourses();
    }
    handleChangeCourse() {
        const currentCourse = this.rightClickCurrenrCourse;
        const getCurrentContent = (className) => {
            return currentCourse
                .querySelector(className)
                .textContent.trim();
        };
        const dataCourse = {
            name: getCurrentContent('.cousres-title'),
            author: getCurrentContent('.cousres-author'),
            price: getCurrentContent('.cousres-price').slice(0, -1),
            buyAmount: getCurrentContent('.cousres-buy-amount'),
            bestSeller: currentCourse.classList.contains('is-bestSeller'),
        };
        const classList = {
            name: 'inputChangeName',
            author: 'inputChangeAuthor',
            price: 'inputChangePrice',
            buyAmount: 'inputChangeBuyAmount',
            bestSeller: 'inputChangeBestSeller',
        };
        this.setDataFromModal(classList, dataCourse);
    }
    handleRemoveCourse() {
        const index = this.rightClickCurrentIndex;
        this.deleteData(index + 1);
        this.localData.splice(index, 1);
        this.renderCourses();
    }
    async start() {
        await this.addLocalData();
        this.renderCourses();
        this.addModal();
        this.handleEvent();
    }
}

window.addEventListener('load', () => {
    const app = new App();
    app.start();
});
