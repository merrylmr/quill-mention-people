export default class AtPeople {
    constructor(quill, options = {}) {
        this.quill = quill;
        this.options = options;
        this.index = 0;

        this.nodeList = null;

        this.cursorIndex = 0;
        //成员列表的DOM
        this.atMerberListDom = null;

        if(options.list && options.list.length){
            //成员的总数
            this.totalLen = options.list.length;
            //@成员列表初始化
            this.generatorList();
            this.quill.container.addEventListener('keydown', this.atPeople.bind(this), false);
        }
    }

    /**
     * 生成@成员列表
     */
    generatorList(){
        let listTtml = '<ul>';
        for (let i = 0; i < this.totalLen; i++) {
            listTtml += '<li  data-member=' + JSON.stringify(this.options.list[i]) + '>' + this.options.list[i].name + '</li>'
        }
        listTtml += '</ul>';
        let divNde = document.createElement('div');
        divNde.className = 'quill-at-member';
        divNde.innerHTML = listTtml;
        this.atMerberListDom = divNde;


        this.nodeList = divNde.getElementsByTagName('li');
        //第一个默认选中
        let firstNode = this.nodeList[0];
        firstNode.classList.add('selected');

        this.quill.container.appendChild(divNde);


        divNde.addEventListener('click', (e) => {
            if (e.target.tagName == 'LI') {
            let selectedItem = JSON.parse(e.target.getAttribute('data-member'));
            //插入@的名字
            this.insertMemberName(selectedItem);
            //判断：是否存在点击插入一个成员执行的函数
            if (this.options.atOneMemberAction) {
                this.options.atOneMemberAction(selectedItem);
            }
        }
    });
    }

    /**
     * 插入成员名称
     * @param item
     */
    insertMemberName(item){
        this.quill.insertText(this.cursorIndex + 1, '@' + item.name + ' ', {
            'color': '#356ccb'
        });
        this.quill.deleteText(this.cursorIndex, 1);
        this.quill.update();
        this.quill.setSelection(this.cursorIndex + item.name.length + 2);
        this.quill.format('color', '#2c3e50');

        this.atMerberListDom.style.display = 'none';
        this.index = 0;
    }

    /**
     * 获取成员列表的位置
     */
    getPosition(){
        if(!this.quill.getSelection(true)){
            return;
        }
        let length = this.quill.getSelection(true).index;
        this.cursorIndex = length;

        let top = this.quill.getBounds(length).top,
            left = this.quill.getBounds(length).left;
        this.atMerberListDom.style.top = top + 10 + 'px';
        this.atMerberListDom.style.left = left + 10 + 'px';
    }

    atPeople(e){
        //输入@键时
        if (e.code == 'Digit2' && e.shiftKey) {
            // 获取成员列表的位置
            this.getPosition();
            //显示成员列表
            this.atMerberListDom.style.display = "block";

        } else {
            //键盘操作：上移、下移
            if ((e.keyCode == '38' || e.keyCode == '40' || e.keyCode == '13')
                && this.atMerberListDom.style.display == 'block') {
                e.preventDefault();
                for (let i = 0; i < this.totalLen; i++) {
                    this.nodeList[i].classList.remove('selected');
                }
                switch (e.keyCode) {
                    case 38://up
                        this.index--;
                        if (this.index < 0) {
                            this.index = this.totalLen - 1
                        }
                        break;
                    case 40://down
                        this.index++;
                        if (this.index > this.totalLen - 1) {
                            this.index = 0
                        }
                        break;
                    case 13://enter
                        let selectedItem=this.options.list[this.index]
                        this.insertMemberName(selectedItem);
                        //判断：是否存在点击插入一个成员执行的函数
                        if (this.options.atOneMemberAction) {
                            this.options.atOneMemberAction(selectedItem);
                        }
                        break;
                }
                this.commonPart(this.index);
                this.nodeList[this.index].classList.add('selected');
            } else {
                this.atMerberListDom.style.display = 'none';
                this.index = 0;
            }
        }

    }

    /**
     * 键盘操作时：
     * 超过部分，设置父元素的srollTop
     * @param i
     */
    commonPart(i) {
        let itemEl = this.nodeList[i];
        let parentEl = itemEl.parentNode;
        let parentH = parentEl.offsetHeight;
        let positionTop = itemEl.offsetTop;
        let itemH = itemEl.offsetHeight;
        parentEl.scrollTop = itemH * itemEl.prevListAll().length - parentH + itemH;
    }
}

HTMLElement.prototype.prevListAll = HTMLElement.prototype.prevListAll || function () {
        var _parent = this.parentElement;
        var _child = _parent.children;
        var arr = [];
        for (var i = 0; i < _child.length; i++) {
            var _childI = _child[i];
            if (_childI == this) {
                break;
            }
            arr.push(_childI);
        }
        return arr;
    };
