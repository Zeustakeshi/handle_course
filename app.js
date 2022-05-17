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
        this.buttonAddCourse = this.createEelement(
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
        this.cousresHtml = this.createEelement('div');
        this.cousresHtml.classList = 'list-cousres-container';
        this.root.append(this.buttonAddCourse, this.cousresHtml);
    }
    createEelement(tagName, className, textContent) {
        const ele = document.createElement(tagName);
        if (className) {
            ele.classList.add(className);
        }
        if (textContent) {
            ele.textContent = textContent;
        }
        return ele;
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
                                    <button type="button" class="btn btn-primary btn-add">Add</button>`
                                : '<button type="button" class="btn btn-primary " data-bs-dismiss="modal">ok</button>'
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
        // this.cousresHtml.insertAdjacentHTML('afterbegin', html);
        this.btnBuyNow = document.querySelectorAll('.btn-buy-now');
    }
    handleRightClick() {
        const options = document.querySelector('.list-opiton');
        window.addEventListener('contextmenu', (e) => {
            if (e.target.matches('.cousres-card')) {
                options.style = `
                display:block;
                top: ${e.pageY}px;
                left: ${e.pageX}px;`;
                e.preventDefault();
                // aa is current index  when right click course-card
                const aa =
                    [...e.target.parentNode.childNodes].indexOf(e.target) /
                    2;
                this.handleDeleteAndPathCourse(aa);
                return false;
            }
            return false;
        });
        document.addEventListener('click', (e) => {
            options.style = `display:none`;
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
        });
    }
    handleRenderBuySucceed() {
        const modalBody = `Thanh You !!!
        <img src="./img/heart_love_smiley_icon_123396.svg"class="icon-happy">`;
        this.rederModal('buy', 'Buy Successfully', modalBody, {
            close: false,
        });
    }
    handleEvent() {
        this.handleRightClick();
        this.buttonAddCourse.addEventListener(
            'click',
            this.handleRenderAddCourse()
        );
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn-add')) {
                this.handleAddCourse();
            }
        });
    }
    handleAddCourse() {
        let inputName = document.querySelector('.inputName');
        let inputAuthor = document.querySelector('.inputAuthor');
        let inputPrice = document.querySelector('.inputPrice');
        let inputBuyAmount = document.querySelector('.inputBuyAmount');
        let inputBestSeller = document.querySelector('.inputBestSeller');
        const data = {
            name: inputName.value,
            author: inputAuthor.value,
            price: inputPrice.value,
            buyAmount: inputBuyAmount.value,
            bestSeller: inputBestSeller.checked,
        };
        inputName.value =
            inputAuthor.value =
            inputPrice.value =
            inputBuyAmount.value =
                '';
        inputBestSeller.checked = false;
        this.postData(data);
        this.localData.push(data);
        this.renderCourses();
    }
    handleDeleteAndPathCourse(currentIndex) {
        console.log(currentIndex);
    }
    async start() {
        await this.addLocalData();
        this.renderCourses();
        this.handleEvent();
    }
}

window.addEventListener('load', () => {
    const app = new App();
    app.start();
});
