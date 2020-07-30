import Quill from "quill";

const Embed = Quill.import("blots/embed");

class MentionBlot extends Embed {
  static create(data) {
    const node = super.create();
    const denotationChar = document.createElement("span");
    denotationChar.className = "ql-mention-denotation-char";
    denotationChar.innerHTML = data.denotationChar;
    node.appendChild(denotationChar);
    node.innerHTML += data.value;
    return MentionBlot.setDataValues(node, data);
  }

  static setDataValues(element, data) {
    const domNode = element;
    Object.keys(data).forEach(key => {
      domNode.dataset[key] = data[key];
    });
    return domNode;
  }

  static value(domNode) {
    return domNode.dataset;
  }
}

MentionBlot.blotName = "mention";
MentionBlot.tagName = "span";
MentionBlot.className = "mention";

Quill.register(MentionBlot);


export default class AtPeople {
  constructor(quill, options = {}) {
    this.quill = quill;
    this.options = options;


    this.mentionDom = null;
    this.mentionCharPos = 0;


    this.cursorIndex = 0;

    if (options.list && options.list.length) {
      //@成员列表初始化
      this.createMentionContainer();
      // 键盘事件
      // 上下键（键盘）
      // enter选择
      // tab选择
      // quill.keyboard.addBinding({
      //   key: ''
      // })
      quill.on("text-change", this.onTextChange.bind(this));
      quill.on("selection-change", this.onTextChange.bind(this));
    }
  }

  createMentionContainer() {
    let divNode = document.createElement('div');
    divNode.className = 'quill-at-member';
    this.mentionDom = divNode;
    this.mentionList = document.createElement("ul");
    this.mentionDom.appendChild(this.mentionList);
    this.quill.container.appendChild(divNode);
  }

  /**
   * 生成列表
   * @param data
   */
  renderList(data, searchKey, mentionChar) {
    data = data.filter(item => {
      return item.name.includes(searchKey);
    }) || []
    if (data && data.length) {
      this.mentionList.innerHTML = "";
      let fragment = document.createDocumentFragment();

      for (let i = 0; i < data.length; i++) {
        let li = document.createElement('li');
        li.dataset.index = i;
        li.dataset.value = data[i].name;
        li.dataset.denotationChar = mentionChar;
        li.setAttribute('data-member', JSON.stringify(data[i]));
        li.innerHTML = data[i].name;
        li.onclick = this.onItemClick.bind(this);
        fragment.appendChild(li);
      }
      this.mentionList.appendChild(fragment);

      this.itemIndex = 0;
      this.highlightItem();

      this.showMentionList();
    } else {
      this.hideMentionList()
    }
  }

  showMentionList() {
    this.mentionDom.style.display = '';
    this.updateMentionDomPos();
    // TODO:显示mentionList回调
  }

  // update mentionDom position
  updateMentionDomPos() {
    const mentionCharPos = this.quill.getBounds(this.mentionCharPos);
    this.mentionDom.style.top = mentionCharPos.top + 10 + 'px';
    this.mentionDom.style.left = mentionCharPos.left + 10 + 'px';
  }

  hideMentionList() {
    this.mentionDom.style.display = "none";
    // TODO: 隐藏mentionList回调
  }

  getTextBeforeCursor() {
    const startPos = Math.max(0, this.cursorIndex - 31);
    const textBeforeCursorPos = this.quill.getText(startPos, this.cursorIndex - startPos)
    return textBeforeCursorPos
  }

  getMentionCharIndex(text, mentionDenotationChars) {
    return mentionDenotationChars.reduce((prev, mentionChar) => {
      const mentionCharIndex = text.lastIndexOf(mentionChar);
      if (mentionCharIndex > prev.mentionCharIndex) {
        return {
          mentionChar,
          mentionCharIndex
        };
      }
      return {
        mentionChar: prev.mentionChar,
        mentionCharIndex: prev.mentionCharIndex
      };
    }, {mentionChar: null, mentionCharIndex: -1})
  }

  hasValidMentionCharIndex(mentionCharIndex, text, isolateChar) {
    if (mentionCharIndex > -1) {
      console.log('hasValidMentionCharIndex3333', isolateChar,
        !(mentionCharIndex === 0 || !!text[mentionCharIndex - 1].match(/\s/g)))
      if (isolateChar &&
        !(mentionCharIndex === 0 || !!text[mentionCharIndex - 1].match(/\s/g))) {
        return false
      }
      return true
    }
    return false
  }

  hasValidChars(text, allowedChars) {
    return allowedChars.test(text);
  }

  onTextChange() {
    const range = this.quill.getSelection();
    if (range === null) return;
    this.cursorIndex = range.index;
    //  判断是否
    const textBeforeCursor = this.getTextBeforeCursor();
    console.log('getTextBeforeCursor', textBeforeCursor, this.options)
    const {mentionChar, mentionCharIndex} =
      this.getMentionCharIndex(textBeforeCursor, this.options.mentionDenotationChars)
    console.log('mentionChar:', mentionChar, 'mentionCharIndex:', mentionCharIndex);

    if (this.hasValidMentionCharIndex(mentionCharIndex, textBeforeCursor, this.options.isolateCharacter)) {
      const mentionCharPos = this.cursorIndex - (textBeforeCursor.length - mentionCharIndex);
      console.log('mentionCharPos', mentionCharPos);

      this.mentionCharPos = mentionCharPos;

      const textAfter = textBeforeCursor.substring(mentionCharIndex + mentionChar.length);

      if (textAfter.length >= this.options.minChars && this.hasValidChars(textAfter, this.options.allowedChars)) {
        this.renderList(this.options.list, textAfter, mentionChar);
      } else {
        this.hideMentionList();
      }
    } else {
      this.hideMentionList();
    }
  }

  highlightItem() {
    let itemList = this.mentionList.childNodes;
    for (let i = 0; i < itemList.length; i++) {
      itemList[i].classList.remove('selected');
    }
    itemList[this.itemIndex].classList.add("selected");
    // TODO: 超过高度：滚动优化
  }

  insertItem(data) {
    const render = data;
    if (render === null) {
      return
    }

    const prevMentionCharPos = this.mentionCharPos;

    this.quill.deleteText(this.mentionCharPos,
      this.cursorIndex - this.mentionCharPos,
      Quill.sources.USER);

    this.quill.insertEmbed(
      prevMentionCharPos,
      this.options.blotName,
      render,
      Quill.sources.USER
    )

    if (this.options.spaceAfterInsert) {
      this.quill.insertText(prevMentionCharPos + 1, ' ', QUill.source.USER);
      this.quill.setSelection(prevMentionCharPos + 2, Quill.sources.USER);
    } else {
      this.quill.setSelection(prevMentionCharPos + 1, Quill.sources.USER);
    }
  }

  getItemData() {
    const {link} = this.mentionList.childNodes[this.itemIndex].dataset;
    const hasLinkValue = typeof link !== "undefined";
    const itemTarget = this.mentionList.childNodes[this.itemIndex].dataset
      .target;
    if (hasLinkValue) {
      this.mentionList.childNodes[
        this.itemIndex
        ].dataset.value = `<a href="${link}" target=${itemTarget ||
      this.options.linkTarget}>${
        this.mentionList.childNodes[this.itemIndex].dataset.value
      }`;
    }
    return this.mentionList.childNodes[this.itemIndex].dataset;
  }

  selectItem() {
    const data = this.getItemData();
    this.insertItem(data);
  }

  onItemClick(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    this.itemIndex = e.currentTarget.dataset.index;
    this.highlightItem();
    this.selectItem()
  }
}
